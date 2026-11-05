// Test only: reports a real graphics card, so the 3D scene and loader run in CI browsers that render in software.
(() => {
  const getContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, options) {
    if (options && options.failIfMajorPerformanceCaveat) options = { ...options, failIfMajorPerformanceCaveat: false };
    return getContext.call(this, type, options);
  };
  for (const C of [WebGLRenderingContext, WebGL2RenderingContext]) {
    const getParameter = C.prototype.getParameter;
    C.prototype.getParameter = function (p) {
      if (p === 0x9246 || p === 0x1f01) return 'Test GPU';
      return getParameter.call(this, p);
    };
  }
})();
