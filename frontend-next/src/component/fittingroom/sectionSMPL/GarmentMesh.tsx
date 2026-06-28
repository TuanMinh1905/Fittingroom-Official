import { useMemo } from "react";
import "@react-three/fiber";
import * as THREE from "three";

interface GarmentMeshProps {
  vertices: number[];
  faces: number[];
  color?: string | [number, number, number, number]; // hex string hoặc RGBA tuple [0..1]
  type?: string; // "t-shirt" | "shirt" | "pant" | ...
}

/**
 * Kiểm tra garment type có phải là áo (layer trên) hay không.
 * Áo luôn được vẽ phía trên quần để tránh mesh xuyên nhau tại vùng eo/hông.
 */
function isUpperGarment(type?: string): boolean {
  if (!type) return false;
  const t = type.toLowerCase();
  return t.includes("shirt") || t.includes("t-shirt") || t.includes("áo");
}

/**
 * Render garment mesh (áo/quần) với màu sắc tùy chỉnh.
 * DoubleSide để nhìn cả mặt trong lẫn mặt ngoài khi xoay model.
 *
 * Fix đè mesh áo-quần bằng Stencil Buffer:
 * ─────────────────────────────────────────
 * Vấn đề: mesh áo và quần xuyên qua nhau ở vùng eo/hông (mesh interpenetration).
 * polygonOffset chỉ xử lý z-fighting (2 mặt cùng độ sâu), không giải quyết
 * được trường hợp vertices quần nằm TRƯỚC vertices áo trong 3D space.
 *
 * Giải pháp Stencil Buffer:
 * 1. Áo (upper) render TRƯỚC (renderOrder=1), đánh dấu stencil=1 tại mọi pixel áo
 * 2. Quần (lower) render SAU (renderOrder=2), chỉ vẽ ở pixel mà stencil≠1
 *    → Quần tự động bị ẩn ở vùng bị áo che phủ, kể cả khi mesh quần xuyên qua áo
 * 3. Body mesh (renderOrder=0) render trước cả hai, đảm bảo cả áo và quần
 *    đều bị body che đúng cách
 */
export default function GarmentMesh({ vertices, faces, color = "#3b82f6", type }: GarmentMeshProps) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positionArray = new Float32Array(vertices);
    const indexArray = new Uint32Array(faces);

    g.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));
    g.setIndex(new THREE.BufferAttribute(indexArray, 1));
    g.computeVertexNormals();
    return g;
  }, [vertices, faces]);

  // Chuyển đổi color: nếu là mảng RGBA [r,g,b,a] → sang THREE.Color
  const threeColor = useMemo(() => {
    if (Array.isArray(color)) {
      return new THREE.Color(color[0], color[1], color[2]);
    }
    return new THREE.Color(color);
  }, [color]);

  const isUpper = isUpperGarment(type);

  return (
    <mesh
      geometry={geometry}
      renderOrder={isUpper ? 1 : 2}
    >
      <meshStandardMaterial
        color={threeColor}
        roughness={0.65}
        metalness={0.0}
        side={THREE.DoubleSide}
        // ── Stencil buffer config ──
        // stencilWrite=true bật stencil test cho material này (tên hơi misleading,
        // nó bật cả stencil TEST lẫn stencil WRITE trong Three.js)
        stencilWrite={true}
        stencilRef={1}
        stencilFuncMask={0xff}
        // Áo: Always pass stencil → luôn render, ghi stencil=1 khi depth pass
        // Quần: NotEqual → chỉ render ở pixel mà stencil≠1 (áo chưa vẽ)
        stencilFunc={isUpper ? THREE.AlwaysStencilFunc : THREE.NotEqualStencilFunc}
        // Áo: Replace → ghi stencilRef(1) vào stencil buffer khi cả stencil+depth pass
        // Quần: Keep → không ghi gì vào stencil buffer
        stencilZPass={isUpper ? THREE.ReplaceStencilOp : THREE.KeepStencilOp}
        stencilFail={THREE.KeepStencilOp}
        stencilZFail={THREE.KeepStencilOp}
      />
    </mesh>
  );
}
