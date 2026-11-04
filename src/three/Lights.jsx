import { useThemeColors } from '../hooks/useThemeColors.js';

const LIGHTING = {
  dark: { ambient: 1.1, key: 2.2, rim: 3.0 },
  light: { ambient: 1.8, key: 2.4, rim: 1.4 },
};

export default function Lights() {
  const { theme, bg, accent } = useThemeColors();
  const level = LIGHTING[theme];

  return (
    <>
      <hemisphereLight args={['white', bg, level.ambient]} />
      <directionalLight position={[2.5, 4, 3]} intensity={level.key} color="white" />
      <directionalLight position={[-3, 2.5, -2.5]} intensity={level.rim} color={accent} />
    </>
  );
}
