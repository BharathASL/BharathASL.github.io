import { Fragment } from 'react';

// Splits text into words or letters for staggered animation. Screen readers get the plain text instead.
export default function SplitText({ text, by = 'words', className = '' }) {
  const words = text.split(' ');
  let index = 0;

  return (
    <>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true" className={`split-text split-text--${by} ${className}`.trim()}>
        {words.map((word, wordIndex) => (
          <Fragment key={`${word}-${wordIndex}`}>
            <span className="split-text__word">
              {by === 'chars' ? (
                [...word].map((char, charIndex) => (
                  <span key={charIndex} className="split-text__char" style={{ '--i': index++ }}>
                    {char}
                  </span>
                ))
              ) : (
                <span className="split-text__inner" style={{ '--i': index++ }}>
                  {word}
                </span>
              )}
            </span>
            {wordIndex < words.length - 1 && ' '}
          </Fragment>
        ))}
      </span>
    </>
  );
}
