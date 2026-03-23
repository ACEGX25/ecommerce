"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="pt-16 min-h-screen">
      <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">

        {/* MEN — slides in from left */}
        <motion.div
          className="relative flex-1 overflow-hidden border-b md:border-b-0 md:border-r"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Link href="/men" className="group absolute inset-0">
            <Image
              src="/assets/hero-men.jpg"
              alt="Men's collection"
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-end p-8">
              {/* Text fades up after panel arrives */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
              >
                <h2 className="heading-l1 text-[clamp(3rem,8vw,6rem)] text-background drop-shadow-sm">MEN</h2>
                <p className="text-background/80 text-sm mt-2 tracking-wide">Engineered for daily wear</p>
              </motion.div>
            </div>
          </Link>
        </motion.div>

        {/* WOMEN — slides in from right */}
        <motion.div
          className="relative flex-1 overflow-hidden"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Link href="/women" className="group absolute inset-0">
            <Image
              src="/assets/hero-women.jpg"
              alt="Women's collection"
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-end p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
              >
                <h2 className="heading-l1 text-[clamp(3rem,8vw,6rem)] text-background drop-shadow-sm">WOMEN</h2>
                <p className="text-background/80 text-sm mt-2 tracking-wide">Precision in every stitch</p>
              </motion.div>
            </div>
          </Link>
        </motion.div>

      </div>

      {/* Marquee strip — fades in last */}
      <motion.div
        className="border-t border-b py-4 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <div className="flex gap-12 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {Array(3)
            .fill(["SUPIMA COTTON", "HEATTECH", "AIRISM", "DRY-EX", "BLOCKTECH", "ULTRA LIGHT DOWN"])
            .flat()
            .map((text, i) => (
              <span key={i} className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
                {text}
              </span>
            ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Index;