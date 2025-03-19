import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import { motion } from "framer-motion";

const AnimatedBlob = () => {
  const meshRef = useRef();

  useFrame(({ mouse }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = mouse.x * 0.5;
      meshRef.current.rotation.x = mouse.y * 0.5;
    }
  });

  return (
    <Sphere args={[2, 96, 96]} ref={meshRef}>
      <MeshDistortMaterial color="#8c52ff" distort={0.5} speed={2} roughness={0.5} />
    </Sphere>
  );
};

const InteractiveBlob = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className="absolute w-80 h-80 md:w-[500px] md:h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <Canvas className="canvas">
        <AnimatedBlob />
      </Canvas>
    </motion.div>
  );
};

export default InteractiveBlob;
