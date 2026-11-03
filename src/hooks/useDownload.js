import { useEffect, useState } from 'react';

const UNKNOWN_SIZE_SCALE = 500_000;
const IDLE = { progress: 0, objectUrl: null, error: null };

// Downloads a file while reporting byte progress (0..1) and exposes it as an object URL.
export function useDownload(url, { enabled = true, type = 'application/octet-stream' } = {}) {
  const [state, setState] = useState(IDLE);

  useEffect(() => {
    if (!enabled) return undefined;
    const controller = new AbortController();
    let objectUrl = null;

    (async () => {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`Download failed with status ${response.status}`);
        const total = Number(response.headers.get('content-length')) || 0;
        const reader = response.body.getReader();
        const chunks = [];
        let received = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          received += value.length;
          const progress = total ? received / total : 1 - Math.exp(-received / UNKNOWN_SIZE_SCALE);
          setState((current) => ({ ...current, progress: Math.min(progress, 0.99) }));
        }
        objectUrl = URL.createObjectURL(new Blob(chunks, { type }));
        setState({ progress: 1, objectUrl, error: null });
      } catch (error) {
        if (!controller.signal.aborted) setState((current) => ({ ...current, error }));
      }
    })();

    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url, enabled, type]);

  return state;
}
