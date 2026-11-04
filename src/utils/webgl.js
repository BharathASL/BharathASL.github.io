const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render/i;

function rendererName(gl) {
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  return String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? '');
}

// True when WebGL runs on a real graphics card. Without one, browsers fall back to drawing 3D on the CPU,
// which makes the page slow and drains batteries, so the static image is shown instead.
export function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const options = { failIfMajorPerformanceCaveat: true };
    const gl = canvas.getContext('webgl2', options) || canvas.getContext('webgl', options);
    if (!gl) return false;
    const software = SOFTWARE_RENDERER.test(rendererName(gl));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return !software;
  } catch {
    return false;
  }
}
