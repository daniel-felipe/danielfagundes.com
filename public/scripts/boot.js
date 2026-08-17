// Webflow's environment sniff, identical in all three sources. It must run
// before paint: animations.css keys the pre-hide rule off .w-mod-js, and
// the cursor layer is suppressed on .w-mod-touch.
!function (o, c) {
  var n = c.documentElement, t = " w-mod-";
  n.className += t + "js";
  ("ontouchstart" in o || o.DocumentTouch && c instanceof DocumentTouch) && (n.className += t + "touch");
}(window, document);

// Theme resolution and switching.
//
// The resolve step runs from <head>, before the body paints, so the shell
// never flashes the wrong theme. A stored choice always wins over the
// operating system preference; with neither, the dark shell is the default
// because that is what the three sources were rebuilt into.
(function () {
  var KEY = 'ds-theme';
  var root = document.documentElement;

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function systemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var toggle = document.querySelector('[data-theme-toggle]');
    if (!toggle) return;
    var next = theme === 'dark' ? 'claro' : 'escuro';
    toggle.setAttribute('aria-label', 'Mudar para o tema ' + next);
    toggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
  }

  apply(stored() || systemTheme());

  function init() {
    apply(root.getAttribute('data-theme'));

    var toggle = document.querySelector('[data-theme-toggle]');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        apply(next);
        try { localStorage.setItem(KEY, next); } catch (e) {}
      });
    }

    // Follow the system only while the visitor has not made a choice.
    if (!window.matchMedia) return;
    var query = window.matchMedia('(prefers-color-scheme: light)');
    var onChange = function () { if (!stored()) apply(systemTheme()); };
    if (query.addEventListener) query.addEventListener('change', onChange);
    else if (query.addListener) query.addListener(onChange);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
