"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Animated starfield background */}
      <Starfield />

      {/* Soft nebula gradient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.35),transparent_70%)] blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(closest-side,rgba(236,72,153,0.25),transparent_70%)] blur-3xl" />
      </div>

      {/* Hero content */}
      <section className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 py-28 text-center md:py-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur"
        >
          <span className="block h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
          Mission Control Online
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="mt-6 bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-4xl font-extrabold leading-tight text-transparent sm:text-6xl md:text-7xl"
        >
          Welcome to <span className="whitespace-nowrap">NASA Space Apps</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-5 max-w-2xl text-balance text-sm text-white/70 sm:text-base"
        >
          Build, explore, and launch ideas that push humanity forward. Join the global hackathon powered by open space data.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-10 flex items-center gap-4"
        >
          <CTAButton href="/admin">Login</CTAButton>
          <CTAButton href="/admin">Score</CTAButton>
        </motion.div>

        {/* Decorative orbiting elements */}
        <Orbits />
      </section>

      {/* Bottom meta strip */}
      <footer className="relative z-10 mx-auto mb-8 w-full max-w-6xl px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60 backdrop-blur">
          <span>Inspired by NASA imagery & open data</span>
          <span className="hidden sm:inline">Made with Next.js • Framer Motion • Tailwind CSS</span>
        </div>
      </footer>

      <style jsx global>{`
        /* STARFIELD */
        .stars, .stars2, .stars3 {
          position: absolute;
          top: -2000px;
          left: 0;
          right: 0;
          bottom: 0;
          background-repeat: repeat;
          background-size: 2000px 2000px;
          animation: drift 120s linear infinite;
          opacity: 0.6;
        }
        .stars {
          background-image: radial-gradient(1px 1px at 20px 30px, #fff 99%, transparent 0),
            radial-gradient(1px 1px at 100px 80px, #fff 99%, transparent 0),
            radial-gradient(1px 1px at 200px 50px, #fff 99%, transparent 0),
            radial-gradient(1px 1px at 300px 120px, #fff 99%, transparent 0),
            radial-gradient(1px 1px at 400px 20px, #fff 99%, transparent 0);
        }
        .stars2 {
          animation-duration: 180s;
          opacity: 0.45;
          background-image: radial-gradient(1px 1px at 50px 90px, #cfe3ff 99%, transparent 0),
            radial-gradient(1px 1px at 150px 40px, #ffffff 99%, transparent 0),
            radial-gradient(1px 1px at 250px 140px, #cfe3ff 99%, transparent 0),
            radial-gradient(1px 1px at 350px 10px, #ffffff 99%, transparent 0),
            radial-gradient(1px 1px at 450px 70px, #cfe3ff 99%, transparent 0);
        }
        .stars3 {
          animation-duration: 240s;
          opacity: 0.3;
          background-image: radial-gradient(1px 1px at 80px 10px, #ffffff 99%, transparent 0),
            radial-gradient(1px 1px at 180px 100px, #cfe3ff 99%, transparent 0),
            radial-gradient(1px 1px at 280px 30px, #ffffff 99%, transparent 0),
            radial-gradient(1px 1px at 380px 150px, #cfe3ff 99%, transparent 0),
            radial-gradient(1px 1px at 480px 60px, #ffffff 99%, transparent 0);
        }
        @keyframes drift {
          from { transform: translateY(0); }
          to { transform: translateY(2000px); }
        }

        /* Shooting star */
        .shooting-star {
          position: absolute;
          top: 10%;
          left: -10%;
          width: 2px;
          height: 2px;
          background: white;
          box-shadow: 0 0 6px 2px rgba(255,255,255,0.8);
          transform: rotate(-20deg);
          animation: tail 5s linear infinite;
          opacity: 0.8;
        }
        @keyframes tail {
          0% { transform: translate(0,0) rotate(-20deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translate(120vw, 40vh) rotate(-20deg); opacity: 0; }
        }
      `}</style>
    </main>
  );
}

function CTAButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative inline-flex items-center justify-center rounded-xl border border-white/20 bg-gradient-to-b from-white/10 to-white/5 px-6 py-3 text-base font-semibold text-white shadow-[0_0_0_0_rgba(255,255,255,0.2)] outline-none transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.5)] focus-visible:ring-2 focus-visible:ring-cyan-300/50"
    >
      <motion.span
        initial={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative"
      >
        <span className="mr-2 inline-block">🚀</span>
        {children}
      </motion.span>
      {/* shimmering border */}
      <span className="pointer-events-none absolute inset-[1px] rounded-[10px] bg-[linear-gradient(110deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02),rgba(255,255,255,0.12))] [mask-image:linear-gradient(#000,transparent_60%)]" />
    </Link>
  );
}

function Orbits() {
  return (
    <div className="pointer-events-none relative mt-16 h-72 w-72 sm:h-80 sm:w-80">
      {/* central planet */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_30%_30%,#93c5fd,transparent_60%),radial-gradient(circle_at_70%_70%,#1e3a8a,transparent_55%),#0b1020] shadow-[0_0_40px_-5px_rgba(59,130,246,0.6)]"
      />

      {/* orbit rings */}
      <motion.div
        className="absolute inset-0 rounded-full border border-white/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-6 rounded-full border border-white/10"
        animate={{ rotate: -360 }}
        transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
      />

      {/* orbiting satellites */}
      <motion.span
        className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-white"
        animate={{ rotate: 360 }}
        style={{ transformOrigin: "50% 150px" }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <motion.span
        className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-300"
        animate={{ rotate: -360 }}
        style={{ transformOrigin: "50% 120px" }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />

      {/* occasional shooting star */}
      <span className="shooting-star" />
    </div>
  );
}

function Starfield() {
  return (
    <>
      <div className="stars" />
      <div className="stars2" />
      <div className="stars3" />
    </>
  );
}