import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { useEffect, useRef } from "react";
import HumanMesh from "./HumanMesh";
import GarmentMesh from "./GarmentMesh";

// Kiểu dữ liệu cho garment mesh
export interface GarmentData {
  vertices: number[];
  faces: number[];
  color?: string | [number, number, number, number];
  type?: string;
}

interface SceneProps {
  bodyVertices: number[];
  bodyFaces: number[];
  garments?: GarmentData[];
  skinColor?: string;
  /** Giá trị dọc từ thanh trượt: 0 = nhìn chân, 50 = giữa, 100 = nhìn đầu */
  verticalOffset?: number;
}

/**
 * Component nội bộ để điều khiển camera target theo verticalOffset.
 * Khi slider thay đổi, target.y sẽ di chuyển theo,
 * giúp xem từng phần cơ thể mà không cần zoom hay xoay.
 */
function CameraTargetController({ verticalOffset }: { verticalOffset: number }) {
  useEffect(() => {
    // Map slider: 0 (chân) → target.y = -1.0, 50 (giữa) → 0.3, 100 (đầu) → 1.6
    const minY = -1.0;
    const maxY = 1.6;
    const targetY = minY + (verticalOffset / 100) * (maxY - minY);

    // Update OrbitControls target qua custom event
    window.dispatchEvent(
      new CustomEvent("update-camera-target", { detail: { y: targetY } })
    );
  }, [verticalOffset]);

  return null;
}

/**
 * OrbitControls wrapper nhận custom event để update target.
 */
function SmartOrbitControls() {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const { y } = (e as CustomEvent).detail;
      if (controlsRef.current) {
        controlsRef.current.target.set(0, y, 0);
        controlsRef.current.update();
      }
    };
    window.addEventListener("update-camera-target", handler);
    return () => window.removeEventListener("update-camera-target", handler);
  }, []);

  return (
    <OrbitControls
      ref={controlsRef}
      target={[0, 0.3, 0]}
      minDistance={1}
      maxDistance={5}
      enablePan={true}
      enableDamping={true}
      dampingFactor={0.08}
      maxPolarAngle={Math.PI * 0.85}
      minPolarAngle={Math.PI * 0.1}
    />
  );
}

/**
 * 3D Scene hiển thị model người + quần áo.
 *
 * - 3-point lighting: ambient + directional + fill light
 * - ContactShadows tạo bóng mềm dưới chân
 * - OrbitControls cho phép xoay/zoom/pan
 * - Background gradient tối (dark studio feel)
 */
export function Scene({ bodyVertices, bodyFaces, garments = [], skinColor = "#e8beac", verticalOffset = 50 }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.9, 2.5], fov: 40 }}
      style={{ background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
      gl={{ antialias: true, alpha: false, stencil: true }}
    >
      {/* Lighting: 3-point setup */}
      <ambientLight intensity={0.4} color="#e6e6ff" />
      {/* Key light — phía trước-trên-phải */}
      <directionalLight position={[3, 4, 3]} intensity={1.5} color="#ffffff" castShadow />
      {/* Fill light — phía trái, nhẹ hơn */}
      <directionalLight position={[-3, 2, 1]} intensity={0.6} color="#b0c4ff" />
      {/* Back/rim light — phía sau để tạo viền sáng */}
      <directionalLight position={[0, 3, -3]} intensity={0.4} color="#ffeedd" />

      {/* Floor grid */}
      <gridHelper args={[4, 20, "#334466", "#223344"]} position={[0, -1.2, 0]} />

      {/* Contact shadow — bóng mềm dưới chân */}
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.5}
        scale={4}
        blur={2.5}
        far={1.5}
      />

      {/* Model group — chính diện hướng về camera */}
      <group>
        {/* Body mesh */}
        <HumanMesh vertices={bodyVertices} faces={bodyFaces} color={skinColor} />

        {/* Garment meshes */}
        {garments.map((g, idx) => (
          <GarmentMesh
            key={`garment-${idx}-${g.type || idx}`}
            vertices={g.vertices}
            faces={g.faces}
            color={g.color}
            type={g.type}
          />
        ))}
      </group>

      {/* Camera target controller — điều khiển bởi slider */}
      <CameraTargetController verticalOffset={verticalOffset} />

      {/* OrbitControls: xoay chuột trái, zoom scroll, pan chuột phải */}
      <SmartOrbitControls />
    </Canvas>
  );
}
