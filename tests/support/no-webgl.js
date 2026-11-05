// Test only: makes WebGL unavailable, so the page shows the static image instead of the 3D scene.
// Used by tests about layout and scrolling, which should not depend on how fast a browser draws 3D.
(() => {
  const getContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
    if (/webgl/i.test(type)) return null;
    return getContext.call(this, type, ...rest);
  };
})();
