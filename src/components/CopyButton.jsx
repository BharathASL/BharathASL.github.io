import { useEffect, useRef, useState } from 'react';

const RESET_MS = 2000;

export default function CopyButton({ text, label, className = '' }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  const supported = typeof navigator !== 'undefined' && Boolean(navigator.clipboard?.writeText);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (!supported) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), RESET_MS);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={copy}
        data-copied={copied ? 'true' : undefined}
        data-magnetic
      >
        {copied ? 'Copied' : label}
      </button>
      <span className="visually-hidden" role="status">
        {copied ? 'Email address copied' : ''}
      </span>
    </>
  );
}
