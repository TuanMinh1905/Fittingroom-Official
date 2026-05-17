import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import HumanMesh from "./HumanMesh"; // Import component HumanMesh

// Canvas là khung render 3D. Nó tạo scene + renderer + camera
// position: vị trí camera trong không gian 3D
// fov: góc nhìn camera (nhỏ hơn thì zoom-in kiểu tele, lớn hơn thì wide).

/* ambientLight là Ánh sáng môi trường chiếu đều mọi hướng. */
/* Không tạo bóng đổ rõ, chỉ làm scene đỡ tối. */
/* intensity=0.5 là độ sáng vừa phải. */

// directionalLight là ánh sáng chiếu từ một hướng cụ thể, tạo bóng đổ rõ ràng.
// position là vị trí nguồn sáng.
// Chiếu có hướng nên tạo cảm giác khối rõ hơn.
// intensity=1.2 sáng hơn ambient.

// gridHelper tạo lưới trên mặt đất, giúp định hướng trong không gian 3D.
// Lưới tham chiếu mặt sàn để dễ nhìn orientation/scale.
// 4: kích thước tổng của lưới.
// 20: số ô chia.
// "#999999" và "#dddddd": màu line đậm/nhạt

// <group rotation={[0, Math.PI, 0]}> ... </group>
// Nhóm object để transform chung (rotate/scale/position).
// Ở đây xoay quanh trục Y một góc Math.PI (180 độ).
// Mục đích: quay model lại đúng hướng camera.

// HumanMesh vertices={vertices} faces={faces} 
// Component bạn tự viết, nhận dữ liệu mesh từ backend.
// Bên trong nó tạo BufferGeometry từ vertices + faces.
// Rồi render ra object mesh người.

// OrbitControls 
// Cho phép dùng chuột để:
// xoay camera quanh model
// zoom in/out

export function Scene({ vertices, faces }: { vertices: number[]; faces: number[] }) {
  return (
    <Canvas camera={{ position: [0, 0.9, 2.2], fov: 45 }}>
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 3, 2]} intensity={1.2} />
      <gridHelper args={[4, 20, "#999999", "#dddddd"]} />

      <group rotation={[0, Math.PI, 0]}>
        <HumanMesh vertices={vertices} faces={faces} />
      </group>

      <OrbitControls />
    </Canvas>
  );
}
