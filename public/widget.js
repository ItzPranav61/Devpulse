/*!
 * DevPulse embed script
 * <script src="https://YOUR-APP/widget.js" data-username="octocat" data-theme="dark" async></script>
 *
 * Supported data attributes: username (required), theme, show, repos, transparent, radius, bg, fg, accent
 */
(function () {
  var s = document.currentScript;
  if (!s) {
    var all = document.querySelectorAll('script[src*="widget.js"][data-username]');
    s = all[all.length - 1];
  }
  if (!s) return;

  var username = s.getAttribute('data-username');
  if (!username) return;

  var origin = new URL(s.src, window.location.href).origin;
  var map = { theme: 'theme', show: 'show', repos: 'repos', transparent: 'transparent', radius: 'radius', bg: 'c_bg', fg: 'c_fg', accent: 'c_accent' };
  var params = new URLSearchParams();
  Object.keys(map).forEach(function (attr) {
    var v = s.getAttribute('data-' + attr);
    if (v !== null && v !== '') params.set(map[attr], v);
  });

  var frame = document.createElement('iframe');
  frame.src = origin + '/embed/' + encodeURIComponent(username) + (params.toString() ? '?' + params.toString() : '');
  frame.title = 'GitHub activity for ' + username;
  frame.loading = 'lazy';
  frame.setAttribute('scrolling', 'no');
  frame.style.cssText = 'width:100%;min-height:220px;border:0;display:block;background:transparent;';
  s.parentNode.insertBefore(frame, s.nextSibling);

  window.addEventListener('message', function (e) {
    if (e.source !== frame.contentWindow) return;
    var d = e.data;
    if (d && d.type === 'devpulse:height' && typeof d.height === 'number') {
      frame.style.height = d.height + 'px';
    }
  });
})();
