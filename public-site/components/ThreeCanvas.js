"use client";
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import gsap from 'gsap';

// Orbital nodes configuration
const NODES_DATA = [
  { label: "Corporate Trainers", route: "/corporate-trainers", color: "#4facfe" },
  { label: "Software Development", route: "/software-development", color: "#00f2fe" },
  { label: "Research Guidance", route: "/research-guidance", color: "#38f9d7" },
  { label: "Educational Events", route: "/educational-events", color: "#b19ffb" },
  { label: "Certification Courses", route: "/certification-courses", color: "#f093fb" },
  { label: "Placement Training", route: "/placement-training", color: "#43e97b" }
];

// Inner component to access R3F hooks (useThree, useFrame)
function SceneContent({ hoveredNode, setHoveredNode, activeLabel, setActiveLabel }) {
  const { camera, scene } = useThree();
  const router = useRouter();
  const nodeRefs = useRef([]);
  const centralGroupRef = useRef();
  const [zooming, setZooming] = useState(false);

  // Orbit parameters
  const orbitRadius = 4.8;
  const orbitSpeed = 0.25;

  useFrame((state) => {
    if (zooming) return;

    const time = state.clock.getElapsedTime();

    // Rotate central model gently
    if (centralGroupRef.current) {
      centralGroupRef.current.rotation.y = time * 0.15;
    }

    // Position orbital nodes in a circular path
    nodeRefs.current.forEach((ref, idx) => {
      if (!ref) return;
      // Distribute nodes equally
      const angle = (idx / NODES_DATA.length) * Math.PI * 2 + time * orbitSpeed;
      
      // Orbit on XZ plane, with slight vertical waving
      ref.position.x = Math.cos(angle) * orbitRadius;
      ref.position.z = Math.sin(angle) * orbitRadius;
      ref.position.y = Math.sin(time + idx) * 0.25;
      
      // Auto rotation of nodes
      ref.rotation.y += 0.01;
    });
  });

  const handleNodeClick = (node, index) => {
    if (zooming) return;
    setZooming(true);

    // Zoom camera directly to the clicked node using GSAP
    const targetPos = new THREE.Vector3();
    node.getWorldPosition(targetPos);

    // Dynamic camera path offset
    const offset = new THREE.Vector3(
      camera.position.x - targetPos.x,
      camera.position.y - targetPos.y,
      camera.position.z - targetPos.z
    ).normalize().multiplyScalar(1.2);

    // GSAP animation sequence
    gsap.timeline({
      onComplete: () => {
        // Redirect route after animation finishes
        router.push(NODES_DATA[index].route);
      }
    })
    .to(camera.position, {
      x: targetPos.x + offset.x,
      y: targetPos.y + offset.y + 0.2,
      z: targetPos.z + offset.z,
      duration: 1.4,
      ease: 'power3.inOut'
    })
    .to(camera.rotation, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0.4
    }, "-=0.4");
  };

  return (
    <>
      {/* Central Integrated Model */}
      <group ref={centralGroupRef} position={[0, -0.4, 0]}>
        {/* Motherboard Base (Bottom) */}
        <mesh position={[0, -2, 0]}>
          <boxGeometry args={[3.2, 0.08, 3.2]} />
          <meshStandardMaterial color="#0b0f19" roughness={0.5} metalness={0.7} />
        </mesh>
        
        {/* Glowing Chip processor */}
        <mesh position={[0, -1.92, 0]}>
          <boxGeometry args={[0.9, 0.08, 0.9]} />
          <meshStandardMaterial color="#0F3D7A" emissive="#0F3D7A" emissiveIntensity={0.6} roughness={0.1} />
        </mesh>
        
        {/* Chip Circuit outlines (Motherboard design elements) */}
        <gridHelper args={[3.0, 10, "#FF9E1B", "#0F3D7A"]} position={[0, -1.95, 0]} rotation={[0, 0, 0]} />

        {/* Vertical Circuits (Connecting traces running upwards) */}
        <group>
          {Array.from({ length: 12 }).map((_, i) => {
            const theta = (i / 12) * Math.PI * 2;
            const x = Math.cos(theta) * 0.45;
            const z = Math.sin(theta) * 0.45;
            return (
              <mesh key={i} position={[x, -0.2, z]}>
                <cylinderGeometry args={[0.015, 0.015, 3.4, 8]} />
                <meshBasicMaterial color="#0F3D7A" transparent opacity={0.6} />
              </mesh>
            );
          })}
        </group>

        {/* Graduation Cap (Top Model) */}
        <group position={[0, 1.6, 0]}>
          {/* Flat Cap Board */}
          <mesh rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[2.0, 0.06, 2.0]} />
            <meshStandardMaterial color="#0f0f12" roughness={0.4} metalness={0.8} />
          </mesh>
          {/* Skull Cap Bowl */}
          <mesh position={[0, -0.24, 0]}>
            <sphereGeometry args={[0.62, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} rotation={[Math.PI, 0, 0]} />
            <meshStandardMaterial color="#0F3D7A" roughness={0.6} />
          </mesh>
          {/* Cap Button */}
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
            <meshBasicMaterial color="#FF9E1B" />
          </mesh>
          {/* Cap Tassel String */}
          <mesh position={[0.6, -0.4, 0.6]}>
            <cylinderGeometry args={[0.01, 0.01, 0.8, 8]} />
            <meshBasicMaterial color="#FF9E1B" />
          </mesh>
        </group>
      </group>

      {/* Orbiting Service Nodes */}
      {NODES_DATA.map((node, index) => {
        const isHovered = hoveredNode === index;
        const scaleVal = isHovered ? 1.45 : 1.0;
        
        return (
          <group 
            key={index}
            ref={(el) => { if (el) nodeRefs.current[index] = el; }}
          >
            {/* Connecting Wire Line */}
            <LineWire 
              start={[0, -0.4, 0]} 
              end={[0, 0, 0]} 
              isHovered={isHovered} 
            />

            {/* Glowing orbital sphere */}
            <mesh 
              onClick={(e) => {
                e.stopPropagation();
                handleNodeClick(nodeRefs.current[index], index);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredNode(index);
                setActiveLabel(node.label);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredNode(null);
                setActiveLabel("");
              }}
              scale={[scaleVal, scaleVal, scaleVal]}
            >
              <sphereGeometry args={[0.42, 32, 32]} />
              <meshStandardMaterial 
                color={node.color}
                emissive={isHovered ? "#FF9E1B" : node.color}
                emissiveIntensity={isHovered ? 1.3 : 0.6}
                roughness={0.15}
                metalness={0.85}
              />
              
              {/* Node Outer Orbit Ring shell */}
              <mesh scale={[1.4, 1.4, 1.4]}>
                <sphereGeometry args={[0.42, 16, 16]} />
                <meshBasicMaterial 
                  color={isHovered ? "#FF9E1B" : node.color} 
                  wireframe 
                  transparent 
                  opacity={isHovered ? 0.35 : 0.12} 
                />
              </mesh>
            </mesh>
          </group>
        );
      })}
    </>
  );
}

// Line helper to draw data wire connections dynamically
function LineWire({ start, end, isHovered }) {
  const lineRef = useRef();
  
  useFrame(() => {
    if (!lineRef.current) return;
    
    // Find parent group position to update vertex locations
    const parent = lineRef.current.parent;
    if (parent) {
      const pos = parent.position;
      const positions = lineRef.current.geometry.attributes.position.array;
      // Start is center motherboard
      positions[0] = start[0] - pos.x;
      positions[1] = start[1] - pos.y;
      positions[2] = start[2] - pos.z;
      // End is node coordinates
      positions[3] = 0;
      positions[4] = 0;
      positions[5] = 0;
      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const positions = new Float32Array([...start, ...end]);

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial 
        color={isHovered ? "#FF9E1B" : "#0F3D7A"} 
        linewidth={isHovered ? 3 : 1}
        transparent
        opacity={isHovered ? 0.95 : 0.4}
      />
    </line>
  );
}

const STATIC_FALLBACK_STARS = Array.from({ length: 40 }).map((_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 1,
  duration: Math.random() * 3 + 2
}));

export default function ThreeCanvas() {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [activeLabel, setActiveLabel] = useState("");
  const [webGLSupported, setWebGLSupported] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supported = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      requestAnimationFrame(() => {
        setWebGLSupported(supported);
      });
    } catch (e) {
      requestAnimationFrame(() => {
        setWebGLSupported(false);
      });
    }
  }, []);

  if (!webGLSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#121214] relative overflow-hidden">
        {/* Background Starfield Mock (Pure CSS) */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          {STATIC_FALLBACK_STARS.map((star) => (
            <div 
              key={star.id} 
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDuration: `${star.duration}s`
              }}
            />
          ))}
        </div>

        {/* Central Circuit motherboard base */}
        <div className="relative w-[500px] h-[500px] flex items-center justify-center scale-90 sm:scale-100">
          {/* Glowing motherboard trace SVGs */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 500 500">
            {NODES_DATA.map((_, idx) => {
              const angle = (idx / NODES_DATA.length) * Math.PI * 2 - Math.PI / 2;
              const x2 = 250 + Math.cos(angle) * 180;
              const y2 = 250 + Math.sin(angle) * 180;
              return (
                <g key={idx}>
                  <line 
                    x1="250" 
                    y1="250" 
                    x2={x2} 
                    y2={y2} 
                    stroke={hoveredNode === idx ? "#FF9E1B" : "#0F3D7A"} 
                    strokeWidth={hoveredNode === idx ? "3" : "1.5"}
                    strokeDasharray={hoveredNode === idx ? "none" : "5, 5"}
                    className="transition-all duration-300"
                  />
                  <circle 
                    cx={x2} 
                    cy={y2} 
                    r="4" 
                    fill={hoveredNode === idx ? "#FF9E1B" : "#0F3D7A"} 
                  />
                </g>
              );
            })}
          </svg>

          {/* Processor core in center */}
          <div className="w-32 h-32 rounded-2xl bg-slate-950 border-2 border-[#0F3D7A]/50 flex flex-col items-center justify-center z-10 shadow-[0_0_40px_rgba(15,61,122,0.4)] relative">
            {/* Glowing Motherboard Chip */}
            <div className="w-16 h-16 rounded-lg bg-[#0f3d7a]/20 border border-[#FF9E1B]/30 flex items-center justify-center shadow-[inset_0_0_15px_rgba(255,158,27,0.1)]">
              <svg className="w-10 h-10 text-[#FF9E1B] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A5.905 5.905 0 018 3.743 9.49 9.49 0 0112 3c1.44 0 2.805.32 4.02.893a5.905 5.905 0 014.887 5.591c0 .277-.02.55-.058.817m-15.482 0a50.58 50.58 0 0115.482 0" />
              </svg>
            </div>
            <span className="text-[9px] font-mono text-slate-500 mt-2 tracking-widest uppercase">TECHYUG CORE</span>
          </div>

          {/* Orbiting nodes buttons */}
          {NODES_DATA.map((node, idx) => {
            const angle = (idx / NODES_DATA.length) * Math.PI * 2 - Math.PI / 2;
            const x = 250 + Math.cos(angle) * 180;
            const y = 250 + Math.sin(angle) * 180;
            const isHovered = hoveredNode === idx;

            return (
              <button
                key={idx}
                onClick={() => router.push(node.route)}
                onMouseEnter={() => {
                  setHoveredNode(idx);
                  setActiveLabel(node.label);
                }}
                onMouseLeave={() => {
                  setHoveredNode(null);
                  setActiveLabel("");
                }}
                className="absolute w-20 h-20 rounded-full flex flex-col items-center justify-center border transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  backgroundColor: isHovered ? `${node.color}25` : '#0f0f12',
                  borderColor: isHovered ? '#FF9E1B' : `${node.color}50`,
                  boxShadow: isHovered ? `0 0 20px ${node.color}40` : 'none',
                  transform: `translate(-50%, -50%) scale(${isHovered ? 1.15 : 1})`
                }}
              >
                {/* Node Dot */}
                <div 
                  className="w-4 h-4 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: isHovered ? '#FF9E1B' : node.color,
                    boxShadow: `0 0 10px ${node.color}`
                  }}
                />
                
                {/* Label text */}
                <span className="text-[8px] font-mono font-bold text-slate-400 mt-1.5 text-center px-1 leading-tight group-hover:text-white transition-colors uppercase tracking-wider">
                  {node.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* HUD label */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 pointer-events-none transition-all duration-300">
          <div className={`px-8 py-3 rounded-full glass-panel flex items-center justify-center border border-white/10 transition-all duration-500 ${activeLabel ? 'opacity-100 translate-y-0 scale-100 shadow-[0_0_20px_rgba(255,158,27,0.25)] border-[#FF9E1B]/30' : 'opacity-0 translate-y-4 scale-95'}`}>
            <span className="text-xl font-bold tracking-wider font-sans text-glow-orange text-[#FF9E1B]">
              {activeLabel}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 4.5, 7.8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        
        {/* Floating background starfield */}
        <StarsBackground />
        
        <SceneContent 
          hoveredNode={hoveredNode} 
          setHoveredNode={setHoveredNode} 
          activeLabel={activeLabel} 
          setActiveLabel={setActiveLabel} 
        />
      </Canvas>
      
      {/* Floating HUD Node Label Banner */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 pointer-events-none transition-all duration-300">
        <div className={`px-8 py-3 rounded-full glass-panel flex items-center justify-center border border-white/10 transition-all duration-500 ${activeLabel ? 'opacity-100 translate-y-0 scale-100 shadow-[0_0_20px_rgba(255,158,27,0.25)] border-[#FF9E1B]/30' : 'opacity-0 translate-y-4 scale-95'}`}>
          <span className="text-xl font-bold tracking-wider font-sans text-glow-orange text-[#FF9E1B]">
            {activeLabel}
          </span>
        </div>
      </div>
    </div>
  );
}


const STATIC_STAR_COUNT = 150;
const STATIC_STAR_POSITIONS = (() => {
  const pos = new Float32Array(STATIC_STAR_COUNT * 3);
  for (let i = 0; i < STATIC_STAR_COUNT * 3; i += 3) {
    pos[i] = (Math.random() - 0.5) * 22;
    pos[i + 1] = (Math.random() - 0.5) * 15;
    pos[i + 2] = (Math.random() - 0.5) * 22;
  }
  return pos;
})();

// Background starfield component
function StarsBackground() {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0003;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position"
          count={STATIC_STAR_COUNT}
          array={STATIC_STAR_POSITIONS}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.07} color="#38f9d7" sizeAttenuation depthWrite={false} />
    </points>
  );
}
