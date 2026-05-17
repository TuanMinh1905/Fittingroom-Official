import { useMemo } from "react";
import "@react-three/fiber";
import * as THREE from "three";

export default function HumanMesh({vertices, faces}: {vertices: number[], faces: number[]}) {
    // script logic

    // useMeno giống với onMouted trong Nuxt, chạy 1 lần khi component được mount, và chỉ chạy lại khi dependency thay đổi
    const geometry = useMemo(() => {
        const g = new THREE.BufferGeometry();

        // Convert vertices and faces to typed arrays
        const positionArray = new Float32Array(vertices);
        const indexArray = new Uint32Array(faces);

        g.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));
        g.setIndex(new THREE.BufferAttribute(indexArray, 1));
        g.computeVertexNormals(); // Tính toán normal cho ánh sáng
        return g;
    }, [vertices, faces]);


    // HTML render
    return ( 
        <mesh geometry={geometry}>
            <meshStandardMaterial color="orange" />
        </mesh>
    );

}