import fallbackImage from '../assets/images/character-fallback.webp';

export default function CharacterFallback() {
  return <img className="scene__fallback" src={fallbackImage} alt="" width="640" height="800" decoding="async" />;
}
