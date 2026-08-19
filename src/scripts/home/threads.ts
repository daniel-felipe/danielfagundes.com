import { Color, Mesh, Program, Renderer, Triangle } from 'ogl';

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

function fragmentShader(lineCount: number, yMin: number, yMax: number, cheap: boolean): string {
	const noise = cheap
		? `Perlin2D(vec2(time_scaled, st.x + perc) * 2.5)`
		: `mix(
    Perlin2D(vec2(time_scaled, st.x + perc) * 2.5),
    Perlin2D(vec2(time_scaled, st.x + time_scaled) * 3.5) / 1.5,
    st.x * 0.3
  )`;

	return `
precision mediump float;

uniform float iTime;
uniform vec3 iResolution;
uniform vec3 uColor;
uniform float uAmplitude;
uniform float uDistance;
uniform float uYOffset;
uniform vec2 uMouse;

const int u_line_count = ${lineCount};
const float u_line_width = 7.0;
const float u_line_blur = 10.0;
const float u_y_min = ${yMin.toFixed(3)};
const float u_y_max = ${yMax.toFixed(3)};

float Perlin2D(vec2 P) {
  vec2 Pi = floor(P);
  vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
  vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
  Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
  Pt += vec2(26.0, 161.0).xyxy;
  Pt *= Pt;
  Pt = Pt.xzxz * Pt.yyww;
  vec4 hash_x = fract(Pt * (1.0 / 951.135664));
  vec4 hash_y = fract(Pt * (1.0 / 642.949883));
  vec4 grad_x = hash_x - 0.49999;
  vec4 grad_y = hash_y - 0.49999;
  vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y)
    * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
  grad_results *= 1.4142135623730950;
  vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy
    * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
  vec4 blend2 = vec4(blend, vec2(1.0 - blend));
  return dot(grad_results, blend2.zxzx * blend2.wwyy);
}

float lineFn(vec2 st, float width, float perc, vec2 mouse, float time, float amplitude, float distance, float px) {
  float split_offset = (perc * 0.4);
  float split_point = 0.1 + split_offset;

  float amplitude_normal = smoothstep(split_point, 0.7, st.x);
  float finalAmplitude = amplitude_normal * 0.5
    * amplitude * (1.0 + (mouse.y - 0.5) * 0.2);

  float time_scaled = time / 10.0 + (mouse.x - 0.5) * 1.0;
  float blur = smoothstep(split_point, split_point + 0.05, st.x) * perc;
  float xnoise = ${noise};

  float y = uYOffset + (perc - 0.5) * distance + xnoise / 2.0 * finalAmplitude;
  float edge = (width / 2.0) + (u_line_blur * px * blur);

  float line_start = smoothstep(y + edge, y, st.y);
  float line_end = smoothstep(y, y - edge, st.y);

  return clamp(
    (line_start - line_end) * (1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3))),
    0.0,
    1.0
  );
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  if (uv.y < u_y_min || uv.y > u_y_max) {
    gl_FragColor = vec4(0.0);
    return;
  }

  float px = 1.0 / max(iResolution.x, iResolution.y);
  float line_strength = 1.0;
  for (int i = 0; i < u_line_count; i++) {
    float p = float(i) / float(u_line_count);
    line_strength *= (1.0 - lineFn(
      uv,
      u_line_width * px * (1.0 - p),
      p,
      uMouse,
      iTime,
      uAmplitude,
      uDistance,
      px
    ));
  }

  float colorVal = 1.0 - line_strength;
  gl_FragColor = vec4(uColor * colorVal, colorVal);
}
`;
}

function accentRgb(): [number, number, number] {
	const probe = document.createElement('span');
	probe.style.color = 'var(--accent)';
	document.body.appendChild(probe);
	const color = getComputedStyle(probe).color;
	probe.remove();
	const parts = color.match(/[\d.]+/g);
	if (!parts || parts.length < 3) return [0.64, 0.66, 0.82];
	return [Number(parts[0]) / 255, Number(parts[1]) / 255, Number(parts[2]) / 255];
}

export function initHeroThreads(): void {
	const hero = document.querySelector<HTMLElement>('.hero');
	const host = hero?.querySelector<HTMLElement>('.hero-threads');
	if (!hero || !host) return;

	const compact = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
	const lineCount = compact ? 8 : 12;
	const maxDim = compact ? 480 : 720;
	const frameMs = 1000 / 20;
	const followMouse = window.matchMedia('(pointer: fine)').matches;
	const yMin = compact ? 0.48 : 0.16;
	const yMax = 0.99;

	const canvas = document.createElement('canvas');
	host.appendChild(canvas);

	let renderer: Renderer;
	try {
		renderer = new Renderer({
			canvas,
			dpr: 1,
			alpha: true,
			depth: false,
			antialias: false,
			powerPreference: 'low-power',
		});
	} catch {
		canvas.remove();
		return;
	}

	const gl = renderer.gl;
	if (!gl) {
		canvas.remove();
		return;
	}

	gl.clearColor(0, 0, 0, 0);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	const [r, g, b] = accentRgb();
	const geometry = new Triangle(gl);
	const program = new Program(gl, {
		vertex: vertexShader,
		fragment: fragmentShader(lineCount, yMin, yMax, true),
		transparent: true,
		depthTest: false,
		depthWrite: false,
		uniforms: {
			iTime: { value: 0 },
			iResolution: { value: new Color(1, 1, 1) },
			uColor: { value: new Color(r, g, b) },
			uAmplitude: { value: 1 },
			uDistance: { value: 0.14 },
			uYOffset: { value: compact ? 0.68 : 0.64 },
			uMouse: { value: new Float32Array([0.5, 0.5]) },
		},
	});
	const mesh = new Mesh(gl, { geometry, program });

	let inView = true;
	let playing = false;
	let frame = 0;
	let lastDraw = 0;
	let resizeRaf = 0;
	let boxStale = true;
	let hostBox = new DOMRect();
	const mouse = { x: 0.5, y: 0.5 };
	const target = { x: 0.5, y: 0.5 };

	const resize = () => {
		const w = host.clientWidth;
		const h = host.clientHeight;
		if (w < 2 || h < 2) return;
		const longest = Math.max(w, h);
		renderer.dpr = longest > maxDim ? maxDim / longest : 1;
		renderer.setSize(w, h);
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		program.uniforms.iResolution.value.set(gl.drawingBufferWidth, gl.drawingBufferHeight, 1);
		boxStale = true;
	};

	const onResize = () => {
		if (resizeRaf) return;
		resizeRaf = requestAnimationFrame(() => {
			resizeRaf = 0;
			resize();
		});
	};

	const onMove = (event: PointerEvent) => {
		if (!inView) return;
		if (boxStale) {
			hostBox = host.getBoundingClientRect();
			boxStale = false;
		}
		if (hostBox.width < 1 || hostBox.height < 1) return;
		target.x = (event.clientX - hostBox.left) / hostBox.width;
		target.y = 1 - (event.clientY - hostBox.top) / hostBox.height;
	};

	const onLeave = () => {
		target.x = 0.5;
		target.y = 0.5;
	};

	const syncColor = () => {
		const [cr, cg, cb] = accentRgb();
		program.uniforms.uColor.value.set(cr, cg, cb);
	};

	const loop = (now: number) => {
		frame = requestAnimationFrame(loop);
		if (now - lastDraw < frameMs) return;
		lastDraw = now;

		if (followMouse) {
			mouse.x += 0.05 * (target.x - mouse.x);
			mouse.y += 0.05 * (target.y - mouse.y);
			program.uniforms.uMouse.value[0] = mouse.x;
			program.uniforms.uMouse.value[1] = mouse.y;
		}

		program.uniforms.iTime.value = now * 0.001;
		renderer.render({ scene: mesh });
	};

	const play = () => {
		if (playing) return;
		playing = true;
		lastDraw = 0;
		frame = requestAnimationFrame(loop);
	};

	const pause = () => {
		if (!playing) return;
		playing = false;
		cancelAnimationFrame(frame);
		frame = 0;
	};

	const syncPlayback = () => {
		if (inView && !document.hidden) play();
		else pause();
	};

	resize();
	syncPlayback();

	const ro = new ResizeObserver(onResize);
	ro.observe(host);

	const io = new IntersectionObserver(
		(entries) => {
			inView = entries.some((entry) => entry.isIntersecting);
			if (inView) boxStale = true;
			syncPlayback();
		},
		{ threshold: 0.12 },
	);
	io.observe(hero);

	const theme = new MutationObserver(syncColor);
	theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

	document.addEventListener('visibilitychange', syncPlayback);

	if (followMouse) {
		hero.addEventListener('pointermove', onMove, { passive: true });
		hero.addEventListener('pointerleave', onLeave, { passive: true });
		window.addEventListener('scroll', () => {
			boxStale = true;
		}, { passive: true });
	}
}
