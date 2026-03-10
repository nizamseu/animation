"use client";

import { Billboard, DragControls, Text } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function animation() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Canvas>
        <Billboard
          follow={true}
          lockX={false}
          lockY={false}
          lockZ={false} // Lock the rotation on the z axis (default=false)
        >
          <Text fontSize={1}>I'm a billboard</Text>
        </Billboard>

        {/* <DragControls>
          <mesh position={[0, 0, 1]} rotation={[0.5, 0.5, 1]}>
            <sphereGeometry attach="geometry" />
            <meshStandardMaterial attach="material" />
          </mesh>
        </DragControls> */}
        <directionalLight position={[1, 1, 3]} color="yellow" />
      </Canvas>
    </div>
  );
}
