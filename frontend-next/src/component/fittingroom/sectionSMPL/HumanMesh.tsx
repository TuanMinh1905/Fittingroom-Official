import { useMemo } from "react";
import "@react-three/fiber";
import * as THREE from "three";

interface HumanMeshProps {
  vertices: number[];
  faces: number[];
  color?: string;
}

/**
 * Render body mesh (SMPL) với skin tone.
 * vertices: mảng phẳng [x0,y0,z0, x1,y1,z1, ...]
 * faces: mảng phẳng [i0,i1,i2, ...]
 */
export default function HumanMesh({ vertices, faces, color = "#e8beac" }: HumanMeshProps) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positionArray = new Float32Array(vertices);
    const indexArray = new Uint32Array(faces);

    g.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));
    g.setIndex(new THREE.BufferAttribute(indexArray, 1));
    g.computeVertexNormals();
    return g;
  }, [vertices, faces]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={color}
        roughness={0.7}
        metalness={0.05}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
