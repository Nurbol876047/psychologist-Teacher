"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Link from "next/link";
import { useLang, useTranslation } from "@/lib/i18n";
import { TOPICS } from "@/data/topics";
import { LECTURE_MODULES } from "@/data/lecture";

const SCREENS_PER_MODULE = 80;

const MODULES = LECTURE_MODULES.map((mod) => {
  const topic = TOPICS.find((tp) => tp.id === mod.topicId)!;
  return { ...mod, topic };
});

// Тректің биіктігі: әр модульге бір экран биіктігінен сәл артық скролл
// қашықтығы, сол уақытта 3D нысан толық айналым жасайды.
export default function ModulesShowcase3D() {
  const { t } = useTranslation();
  const { lang } = useLang();
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Тар экрандарда (мобильде) 3D-сахнаны мүлде монтаждамаймыз: WebGL контексі
  // мен rAF циклі тек CSS арқылы жасырылмай, нақты іске қосылмауы керек.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const track = trackRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!track || !stage || !canvas) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const geometry = new THREE.IcosahedronGeometry(1.4, 1);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1E3A5F"),
      metalness: 0.25,
      roughness: 0.5,
      flatShading: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry),
      new THREE.LineBasicMaterial({ color: "#C9A96E", transparent: true, opacity: 0.55 })
    );
    mesh.add(edges);

    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);
    const accentLight = new THREE.PointLight(new THREE.Color("#2FA6A6"), 1.4, 14);
    accentLight.position.set(-3, -1.5, 2.5);
    scene.add(accentLight);

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

    let rafId = 0;
    let idleT = 0;

    const animate = () => {
      const rect = track.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const total = Math.max(rect.height - viewportH, 1);
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = scrolled / total;
      const rawIndex = progress * MODULES.length;
      const clampedIndex = Math.min(MODULES.length - 1, Math.floor(rawIndex));

      setActiveIndex((prev) => (prev !== clampedIndex ? clampedIndex : prev));

      mesh.rotation.y = rawIndex * Math.PI * 2 * 0.55;
      mesh.rotation.x = Math.sin(rawIndex * 0.6) * 0.25;

      if (!prefersReduced) {
        idleT += 0.003;
        mesh.rotation.y += Math.sin(idleT) * 0.05;
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
      edges.geometry.dispose();
      (edges.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, [isDesktop]);

  const active = MODULES[activeIndex];
  const title = lang === "kk" ? active.topic.title_kk : active.topic.title_ru;

  if (!isDesktop) return null;

  return (
    <div
      ref={trackRef}
      className="relative"
      style={{ height: `${MODULES.length * SCREENS_PER_MODULE}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-[#FAF6EF]"
          style={{
            backgroundImage: "radial-gradient(rgba(30,58,95,0.08) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div ref={stageRef} className="absolute inset-y-0 right-0 w-3/5 lg:w-1/2">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        <div className="relative z-10 h-full max-w-6xl mx-auto px-6 lg:px-10 flex items-center">
          <div className="max-w-md flex flex-col gap-4">
            <span className="font-serif text-5xl lg:text-6xl leading-none text-primary/50 tabular-nums">
              {String(active.topic.id).padStart(2, "0")}
            </span>
            <h3 className="font-serif text-2xl lg:text-3xl text-slate-900">{title}</h3>
            <p className="font-plex-sans text-[15px] lg:text-base text-slate-700 leading-[1.6]">
              {active.text[lang]}
            </p>
            <Link
              href={`/consultation?topic=${active.topic.id}`}
              className="font-plex-sans mt-1 inline-flex w-fit items-center gap-1.5 text-sm text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-colors"
            >
              {t("video_advice_cta")} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2.5">
          {MODULES.map((m, i) => (
            <span
              key={m.topicId}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                i === activeIndex ? "bg-primary" : "bg-primary/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
