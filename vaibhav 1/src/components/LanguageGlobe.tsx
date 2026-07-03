// LanguageGlobe.tsx - Rotating 3D Multilingual AI Globe using Three.js Sprites
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Globe } from 'lucide-react';

interface LanguageNode {
  code: string;
  name: string;
  native: string;
  x: number;
  y: number;
  z: number;
}

const LANGUAGES: LanguageNode[] = [
  { code: 'en', name: 'English', native: 'English', x: 0, y: 1.5, z: 0 },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', x: 1.2, y: 0.5, z: 0.8 },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', x: -1.2, y: 0.5, z: -0.8 },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', x: 0.8, y: -0.7, z: -1.2 },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', x: -0.8, y: -0.7, z: 1.2 },
  { code: 'mr', name: 'Marathi', native: 'मराठी', x: 0, y: -1.4, z: 0.6 }
];

interface LanguageGlobeProps {
  onLanguageChange: (langCode: string) => void;
  currentLang: string;
}

export const LanguageGlobe: React.FC<LanguageGlobeProps> = ({ onLanguageChange, currentLang }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedLang, setSelectedLang] = useState(currentLang);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Group to hold all rotating elements
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Wireframe Sphere
    const sphereGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const globeSphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(globeSphere);

    // 2. Ring orbital paths
    const ringGeo = new THREE.RingGeometry(1.22, 1.23, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xbd00ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 4;
    globeGroup.add(ring);

    // 3. Create Canvas Text Sprites for Languages
    const spriteList: { sprite: THREE.Sprite; code: string }[] = [];

    const createTextSprite = (text: string, isActive: boolean) => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Background
        ctx.fillStyle = isActive ? 'rgba(0, 240, 255, 0.25)' : 'rgba(17, 24, 39, 0.5)';
        ctx.strokeStyle = isActive ? '#05f2c7' : 'rgba(0, 240, 255, 0.3)';
        ctx.lineWidth = 4;
        
        // Rounded rect path
        ctx.beginPath();
        ctx.roundRect(4, 4, 120, 56, 12);
        ctx.fill();
        ctx.stroke();

        // Font settings
        ctx.fillStyle = isActive ? '#05f2c7' : '#f3f4f6';
        ctx.font = 'bold 20px "Outfit", "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 64, 32);
      }

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.95
      });
      return new THREE.Sprite(spriteMat);
    };

    const loadSprites = (activeCode: string) => {
      // Clean up previous sprites from group
      spriteList.forEach((item) => globeGroup.remove(item.sprite));
      spriteList.length = 0;

      LANGUAGES.forEach((lang) => {
        const sprite = createTextSprite(lang.native, lang.code === activeCode);
        sprite.position.set(lang.x, lang.y, lang.z);
        // Scale the sprites for text aspect ratio
        sprite.scale.set(1.1, 0.55, 1);
        
        // Store reference data inside sprite
        sprite.userData = { code: lang.code };

        globeGroup.add(sprite);
        spriteList.push({ sprite, code: lang.code });
      });
    };

    loadSprites(selectedLang);

    // --- Interactive Hover / Click Raycasting ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (event: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(globeGroup.children);

      const hitSprite = intersects.find((intersect) => intersect.object instanceof THREE.Sprite);
      if (hitSprite) {
        const code = hitSprite.object.userData.code;
        setSelectedLang(code);
        onLanguageChange(code);
        loadSprites(code);
      }
    };

    canvasRef.current.addEventListener('click', handleCanvasClick);

    // --- Animation Loop ---
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      // Rotate the group
      globeGroup.rotation.y += 0.006;
      globeGroup.rotation.x += 0.002;

      // Keep text sprites facing the camera directly (automatic for THREE.Sprite)
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('click', handleCanvasClick);
      }
      window.removeEventListener('resize', handleResize);
      scene.clear();
      renderer.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
    };
  }, [selectedLang]);

  return (
    <div className="hud-card glass-panel lang-globe-card">
      <div className="card-header">
        <div className="icon-container secondary">
          <Globe className="glow-icon" />
        </div>
        <div>
          <h3>Multilingual Language Matrix</h3>
          <span className="card-subtitle">Click to Translate Command Center</span>
        </div>
      </div>

      <div className="lang-globe-body">
        <div ref={containerRef} className="globe-canvas-container">
          <canvas ref={canvasRef} />
        </div>
        <div className="selected-lang-info">
          <span className="info-label">Active AI Language Dialect</span>
          <span className="info-value">
            {LANGUAGES.find((l) => l.code === selectedLang)?.name} ({LANGUAGES.find((l) => l.code === selectedLang)?.native})
          </span>
        </div>
      </div>
    </div>
  );
};
