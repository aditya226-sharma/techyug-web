// AegisHUDCanvas.tsx - Immersive WebGL 3D Command Center using Three.js
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { loadConfig } from '../services/configStore';

interface AegisHUDCanvasProps {
  activeSection: string; // Used to trigger specific camera orientations
}

export const AegisHUDCanvas: React.FC<AegisHUDCanvasProps> = ({ activeSection }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Load initial settings
    let config = loadConfig();
    let settings = config.settings3D;

    // --- Three.js Setup ---
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    // Add space fog for depth
    scene.fog = new THREE.FogExp2(0x030712, 0.015);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 2, 8);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
    } catch (e) {
      console.warn("WebGL not supported or context creation failed:", e);
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Glowing spot lights representing scanning fields
    const primaryGlow = new THREE.PointLight(new THREE.Color(settings.colorPrimary), 4, 15);
    primaryGlow.position.set(0, 0, 0);
    scene.add(primaryGlow);

    const secondaryGlow = new THREE.PointLight(new THREE.Color(settings.colorSecondary), 2, 10);
    secondaryGlow.position.set(3, 2, -3);
    scene.add(secondaryGlow);

    // --- 3D Objects ---

    // 1. Digital Twin (Inner core)
    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);

    // Dynamic style based on settings
    let avatarMesh: THREE.Mesh;

    const getTwinColor = (baseColor: string) => {
      const configData = loadConfig();
      const unreadCount = configData.alerts.filter(a => !a.read).length;
      if (unreadCount > 0) {
        return unreadCount === 1 ? "#f59e0b" : "#ff0055"; // Orange for warning, red for critical
      }
      return baseColor;
    };

    const createAvatar = (style: 'wireframe' | 'particles' | 'solid', color1: string, color2: string) => {
      const activeColor1 = getTwinColor(color1);
      
      // Clear old avatar meshes
      while(avatarGroup.children.length > 0) {
        avatarGroup.remove(avatarGroup.children[0]);
      }

      // Outer holographic sphere
      const sphereGeo = new THREE.IcosahedronGeometry(1.6, 2);
      const wireframeMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(activeColor1),
        wireframe: true,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
      });
      const solidMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(activeColor1),
        emissive: new THREE.Color(color2),
        emissiveIntensity: 0.4,
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.7,
        wireframe: false
      });

      avatarMesh = new THREE.Mesh(
        sphereGeo,
        style === 'solid' ? solidMat : wireframeMat
      );
      avatarGroup.add(avatarMesh);

      // Inner core core structure
      const innerGeo = new THREE.OctahedronGeometry(0.9, 1);
      const innerMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color2),
        wireframe: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      avatarGroup.add(innerMesh);

      // Add orbiting rings
      const ringGeo = new THREE.RingGeometry(2.2, 2.22, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(activeColor1),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      const ring1 = new THREE.Mesh(ringGeo, ringMat);
      ring1.rotation.x = Math.PI / 2;
      avatarGroup.add(ring1);

      const ring2 = new THREE.Mesh(ringGeo, ringMat);
      ring2.rotation.y = Math.PI / 4;
      ring2.scale.setScalar(0.9);
      avatarGroup.add(ring2);
    };

    createAvatar(settings.modelStyle, settings.colorPrimary, settings.colorSecondary);

    // 2. Shield Particles (Cocoon)
    const particleCount = settings.particleDensity;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const radiusList = new Float32Array(particleCount);

    const pColor1 = new THREE.Color(settings.colorPrimary);
    const pColor2 = new THREE.Color(settings.colorSecondary);

    for (let i = 0; i < particleCount; i++) {
      // Distribute particles in a spherical shell around the avatar
      const radius = 2.8 + Math.random() * 0.8;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      radiusList[i] = radius;
      speeds[i] = 0.2 + Math.random() * 0.8;

      // Color gradient
      const mixedColor = pColor1.clone().lerp(pColor2, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom Canvas Texture for circular particles (avoid loading external images)
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.3, 'rgba(255,255,255,0.8)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 16);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      map: createParticleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const shieldParticles = new THREE.Points(particleGeometry, particleMaterial);
     scene.add(shieldParticles);

    // 3. Grid Ground
    const gridHelper = new THREE.GridHelper(30, 30, 0x00f0ff, 0x111e38);
    gridHelper.position.y = -3.5;
    // Set material blending
    if (Array.isArray(gridHelper.material)) {
      gridHelper.material.forEach((mat) => {
        mat.transparent = true;
        mat.opacity = 0.15;
      });
    } else {
      gridHelper.material.transparent = true;
      gridHelper.material.opacity = 0.15;
    }
    scene.add(gridHelper);

    // Glowing radar scanning ring on the ground
    const radarGeo = new THREE.RingGeometry(0.1, 0.4, 32);
    const radarMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const radarRing = new THREE.Mesh(radarGeo, radarMat);
    radarRing.rotation.x = Math.PI / 2;
    radarRing.position.y = -3.48;
    scene.add(radarRing);

    // 4. Digital Earth Globe (Surrounding orbits)
    const earthGeo = new THREE.SphereGeometry(6.2, 28, 28);
    const earthMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.02,
      blending: THREE.AdditiveBlending
    });
    const earthGlobe = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earthGlobe);

    // 5. AI Core Reactor expanding Energy Waves
    const energyWaves: {
      mesh: THREE.Mesh;
      scaleSpeed: number;
      maxScale: number;
    }[] = [];

    const triggerEnergyWave = (color: string) => {
      const geo = new THREE.IcosahedronGeometry(1.6, 1);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        wireframe: true,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
      });
      const wave = new THREE.Mesh(geo, mat);
      scene.add(wave);
      energyWaves.push({
        mesh: wave,
        scaleSpeed: 2.2,
        maxScale: 3.5
      });
    };

    // 6. Deflecting Incident Particles (Cyberthreat simulation)
    const threatParticles: {
      mesh: THREE.Mesh;
      velocity: THREE.Vector3;
      active: boolean;
      spawnTime: number;
    }[] = [];

    const createThreatParticle = () => {
      const size = 0.08 + Math.random() * 0.08;
      const geometry = new THREE.SphereGeometry(size, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: 0xff0055, // Critical red
        transparent: true,
        opacity: 0.8
      });
      const mesh = new THREE.Mesh(geometry, material);

      // Spawn at a distance pointing towards the shield
      const angle = Math.random() * Math.PI * 2;
      const height = -2 + Math.random() * 4;
      mesh.position.set(Math.cos(angle) * 8, height, Math.sin(angle) * 8);

      const target = new THREE.Vector3(0, 0, 0);
      const velocity = target.clone().sub(mesh.position).normalize().multiplyScalar(0.08 + Math.random() * 0.06);

      scene.add(mesh);
      threatParticles.push({
        mesh,
        velocity,
        active: true,
        spawnTime: Date.now()
      });
    };

    // --- Animation Loop ---
    let frameId: number;
    const clock = new THREE.Clock();

    // Camera targets based on activeSection
    const targetCamPosition = new THREE.Vector3(0, 2, 8);
    const targetLookAt = new THREE.Vector3(0, 0, 0);
    const currentLookAt = new THREE.Vector3(0, 0, 0);

    const updateCameraTargets = () => {
      if (activeSection === 'hero') {
        targetCamPosition.set(0, 0.8, 7.5);
        targetLookAt.set(0, 0, 0);
      } else if (activeSection === 'scanner') {
        // Look from top-right down at the scan node
        targetCamPosition.set(4, 3, 5);
        targetLookAt.set(-1, -0.5, 0);
      } else if (activeSection === 'radar') {
        // Zoom into active radar details
        targetCamPosition.set(-3.5, 1.2, 5.5);
        targetLookAt.set(0.5, -0.5, 0.5);
      } else if (activeSection === 'alerts') {
        // Position camera to look at the smartphone simulator
        targetCamPosition.set(0, 0.5, 6);
        targetLookAt.set(0, 0, 0);
      } else if (activeSection === 'analytics') {
        // View showing grid height fields
        targetCamPosition.set(-1.5, 4.5, 6.5);
        targetLookAt.set(0.5, -2, -1);
      } else {
        targetCamPosition.set(0, 1.5, 8);
        targetLookAt.set(0, 0, 0);
      }
    };

    updateCameraTargets();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Slow dynamic rotation of avatar
      avatarGroup.rotation.y += 0.005 * settings.particleSpeed;
      avatarGroup.rotation.x += 0.002 * settings.particleSpeed;

      if (avatarMesh) {
        avatarMesh.scale.setScalar(1 + Math.sin(elapsedTime * 2.5) * 0.02);
      }

      // Rotate and contract/expand shield particles
      const posAttr = shieldParticles.geometry.attributes.position;
      const count = posAttr.count;

      for (let i = 0; i < count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);
        const z = posAttr.getZ(i);

        // Orbit calculation
        const speed = speeds[i] * settings.particleSpeed * 0.15;
        const radius = radiusList[i] + Math.sin(elapsedTime * 1.5 + i) * 0.05;

        // Simple rotation matrix application around Y axis
        const cosA = Math.cos(speed * delta);
        const sinA = Math.sin(speed * delta);

        const newX = x * cosA - z * sinA;
        const newZ = x * sinA + z * cosA;

        // Apply scale/radius adjustment
        const currentRadius = Math.sqrt(newX * newX + y * y + newZ * newZ);
        const factor = radius / currentRadius;

        posAttr.setXYZ(i, newX * factor, y * factor, newZ * factor);
      }
      posAttr.needsUpdate = true;

      // Pulse radar sweep ring
      radarRing.scale.addScalar(0.04);
      if (radarRing.scale.x > 35) {
        radarRing.scale.setScalar(0.1);
      }
      const radarMat = radarRing.material as THREE.MeshBasicMaterial;
      radarMat.opacity = Math.max(0, 0.4 * (1 - radarRing.scale.x / 35));

      // Manage threat particle simulation
      // Spawn new threats if shield is deflecting
      if (settings.shieldStatus === 'Deflecting' && Math.random() < 0.1 && threatParticles.length < 15) {
        createThreatParticle();
      }

      for (let i = threatParticles.length - 1; i >= 0; i--) {
        const p = threatParticles[i];
        p.mesh.position.add(p.velocity);

        // Check distance to avatar core (center 0,0,0)
        const dist = p.mesh.position.length();

        if (dist <= 2.8) {
          // INTERCEPTED by shield!
          triggerEnergyWave(settings.colorPrimary);
          // Flash shield color to green and remove threat particle
          primaryGlow.color.setHex(0x05f2c7); // Flash Emerald
          primaryGlow.intensity = 6;

          scene.remove(p.mesh);
          p.mesh.geometry.dispose();
          if (Array.isArray(p.mesh.material)) {
            p.mesh.material.forEach((m) => m.dispose());
          } else {
            p.mesh.material.dispose();
          }
          threatParticles.splice(i, 1);
        } else if (dist > 15 || Date.now() - p.spawnTime > 6000) {
          // Out of bounds / timeout
          scene.remove(p.mesh);
          p.mesh.geometry.dispose();
          if (Array.isArray(p.mesh.material)) {
            p.mesh.material.forEach((m) => m.dispose());
          } else {
            p.mesh.material.dispose();
          }
          threatParticles.splice(i, 1);
        }
      }

      // Rotate and scale background Digital Earth globe
      earthGlobe.rotation.y += 0.003;
      earthGlobe.rotation.x += 0.001;
      const targetEarthOpacity = activeSection === 'radar' ? 0.28 : 0.02;
      const earthMatObj = earthGlobe.material as THREE.MeshBasicMaterial;
      earthMatObj.opacity = THREE.MathUtils.lerp(earthMatObj.opacity, targetEarthOpacity, 0.05);

      // Scale and fade AI Core energy waves
      for (let i = energyWaves.length - 1; i >= 0; i--) {
        const wave = energyWaves[i];
        wave.mesh.scale.addScalar(wave.scaleSpeed * delta);
        const waveMat = wave.mesh.material as THREE.MeshBasicMaterial;
        const progress = wave.mesh.scale.x / wave.maxScale;
        waveMat.opacity = Math.max(0, 0.65 * (1 - progress));

        if (wave.mesh.scale.x >= wave.maxScale) {
          scene.remove(wave.mesh);
          wave.mesh.geometry.dispose();
          waveMat.dispose();
          energyWaves.splice(i, 1);
        }
      }

      // Restore primary glow color slowly
      primaryGlow.color.lerp(new THREE.Color(settings.colorPrimary), 0.05);
      primaryGlow.intensity = THREE.MathUtils.lerp(primaryGlow.intensity, 4, 0.05);

      // Smooth camera interpolation (lerp)
      camera.position.lerp(targetCamPosition, 0.04);
      currentLookAt.lerp(targetLookAt, 0.04);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
    };

    animate();

    // --- Dynamic Settings Updates ---
    const handleConfigChange = () => {
      config = loadConfig();
      const prevSettings = settings;
      settings = config.settings3D;

      // Update light colors
      primaryGlow.color.set(settings.colorPrimary);
      secondaryGlow.color.set(settings.colorSecondary);

      // Update grid helper colors if needed
      radarRing.material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(settings.colorPrimary),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
      });

      // Recreate avatar if style/colors changed
      if (
        prevSettings.modelStyle !== settings.modelStyle ||
        prevSettings.colorPrimary !== settings.colorPrimary ||
        prevSettings.colorSecondary !== settings.colorSecondary
      ) {
        createAvatar(settings.modelStyle, settings.colorPrimary, settings.colorSecondary);
      }
    };

    window.addEventListener("balkavach-config-update", handleConfigChange);

    // --- Resize Handler ---
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // --- Clean Up ---
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("balkavach-config-update", handleConfigChange);
      window.removeEventListener('resize', handleResize);

      // Dispose resources
      scene.clear();
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      radarGeo.dispose();
      radarMat.dispose();
      earthGeo.dispose();
      earthMat.dispose();

      energyWaves.forEach(w => {
        scene.remove(w.mesh);
        w.mesh.geometry.dispose();
        const mat = w.mesh.material as THREE.MeshBasicMaterial;
        mat.dispose();
      });

      threatParticles.forEach(p => {
        scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        if (Array.isArray(p.mesh.material)) {
          p.mesh.material.forEach((m) => m.dispose());
        } else {
          p.mesh.material.dispose();
        }
      });
    };
  }, [activeSection]);

  // Adjust camera targets whenever activeSection changes
  useEffect(() => {
    // Triggers internal camera lerping parameters updates
  }, [activeSection]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: 'none'
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
};
