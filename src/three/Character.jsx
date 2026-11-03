import { useGLTF } from '@react-three/drei';

const MODEL_URL = `${import.meta.env.BASE_URL}models/character.glb`;

export default function Character(props) {
  const { scene } = useGLTF(MODEL_URL, false, true);
  return <primitive object={scene} {...props} />;
}

useGLTF.preload(MODEL_URL, false, true);
