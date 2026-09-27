"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { MOOD_LEVELS } from "@/data/moodLevels";

interface MoodOrbProps {
  level: number | null;
}

const LEVEL_COLORS: Record<number, string> = Object.fromEntries(
  MOOD_LEVELS.map((m) => [m.level, m.color])
);
const IDLE_COLOR = LEVEL_COLORS[1];

// Орбтың бетін «тыныс алдырады»: негізгі (базалық) төбелер координатынан
// синустар қабаттасып, кедергісіз (noise кітапханасыз) органикалық толқын жасайды.
export default function MoodOrb({ level }: MoodOrbProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const levelRef = useRef(level);
  levelRef.current = level;

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 4.3);

    const geometry = new THREE.IcosahedronGeometry(1.1, 3);
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const basePositions = Float32Array.from(posAttr.array as Float32Array);
    const vertexCount = posAttr.count;

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(IDLE_COLOR),
      metalness: 0.15,
      roughness: 0.35,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const glowGeometry = new THREE.IcosahedronGeometry(1.24, 1);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(IDLE_COLOR),
      transparent: true,
      opacity: 0.12,
      wireframe: true,
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    mesh.add(glowMesh);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
    keyLight.position.set(2.5, 3, 4);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xffffff, 0.5, 12);
    rimLight.position.set(-3, -2, 2);
    scene.add(rimLight);

    const particleCount = 50;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 1.55 + Math.random() * 0.55;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(IDLE_COLOR),
      size: 0.045,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    const currentColor = new THREE.Color(IDLE_COLOR);
    const targetColor = new THREE.Color(IDLE_COLOR);

    let rafId = 0;
    let t = 0;

    const animate = () => {
      const lvl = levelRef.current;
      targetColor.set(lvl ? LEVEL_COLORS[lvl] : IDLE_COLOR);
      currentColor.lerp(targetColor, 0.06);
      material.color.copy(currentColor);
      glowMaterial.color.copy(currentColor);
      (particleMaterial.color as THREE.Color).copy(currentColor);

      const energy = lvl ? 0.6 + lvl * 0.35 : 0.6;

      if (!prefersReduced) {
        t += 0.006 + (lvl ? lvl * 0.0035 : 0);

        const posArr = posAttr.array as Float32Array;
        for (let i = 0; i < vertexCount; i++) {
          const ix = i * 3;
          const bx = basePositions[ix];
          const by = basePositions[ix + 1];
          const bz = basePositions[ix + 2];
          const n =
            Math.sin(bx * 2.3 + t * 1.7) * 0.5 +
            Math.sin(by * 2.7 - t * 1.3) * 0.5 +
            Math.sin(bz * 2.1 + t * 2.1) * 0.5;
          const disp = 1 + n * 0.07 * (energy / 1.8);
          posArr[ix] = bx * disp;
          posArr[ix + 1] = by * disp;
          posArr[ix + 2] = bz * disp;
        }
        posAttr.needsUpdate = true;
        geometry.computeVertexNormals();

        mesh.rotation.y += 0.0022 + (lvl ? lvl * 0.0008 : 0);
        mesh.rotation.x = Math.sin(t * 0.4) * 0.12;
        particles.rotation.y -= 0.0012;
        mesh.scale.setScalar(1 + Math.sin(t * 1.8) * 0.015 * energy);
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={stageRef} className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
