"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import Image from "next/image";
import { NAV_ITEMS } from "@/utils/data";
import { useUIStore } from "@/hooks/use-store";

const LINE_URL = "https://lin.ee/pDN1jbV";

function LineIcon({ className = "w-5 h-5" }) {
  // โลโก้ LINE แบบ SVG (พื้นใส)
  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
      <path
        d="M18 4C10.82 4 5 8.86 5 14.86c0 3.42 1.97 6.48 5.02 8.42l-.64 4.79a.9.9 0 0 0 1.32.93l5.66-3.08c.52.06 1.05.1 1.6.1 7.18 0 13-4.86 13-10.86S25.18 4 18 4Z"
        fill="#06C755"
      />
      <path
        d="M10.6 12.4h1.8v5.2h-1.8v-5.2Zm3.1 0h1.8v3.15l2.2-3.15h1.9l-2.35 3.27 2.6 1.93h-2.08l-2.27-1.7v1.7H13.7v-5.2Zm9.9 0h-4.2v1.5h1.2v3.7h1.8v-3.7h1.2v-1.5Zm1.9 0h1.8v5.2h-1.8v-5.2Z"
        fill="#fff"
      />
    </svg>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isMenuOpen, setIsMenuOpen } = useUIStore();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.2,
  });

  return (
    <>
      {/* progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 right-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500"
      />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-[0_10px_30px_rgba(236,72,153,0.15)]"
            : "bg-white/70 backdrop-blur-sm",
        ].join(" ")}
      >
        {/* glow border */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-px bg-gradient-to-r from-transparent via-pink-300/70 to-transparent" />
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.a
              href="#home"
              onClick={() => handleNavClick("#home")}
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <Image
                  src="/hero/logo.png"
                  alt="Monday Nail Studio"
                  width={isScrolled ? 132 : 168}
                  height={48}
                  className="h-30 w-auto md:h-40 object-contain transition-all"
                  priority
                />
                <motion.span
                  className="absolute -right-2 -top-1 text-pink-400/90"
                  initial={{ scale: 0.9, opacity: 0.6 }}
                  animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.6, 1, 0.6] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.4,
                    ease: "easeInOut",
                  }}
                >
                  ✨
                </motion.span>
              </div>
            </motion.a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  className="group relative cursor-pointer px-3 py-2 rounded-full text-md font-medium text-gray-700 hover:text-pink-600 transition-colors"
                >
                  {item.label}
                  <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-1 h-[2px] w-0 rounded-full bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 transition-all duration-300 group-hover:w-8" />
                </button>
              ))}
            </div>

            {/* CTA group */}
            <div className="hidden md:flex items-center  gap-2">
              {/* LINE button */}
              <motion.a
                href={LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ติดต่อเรา ทาง LINE"
                whileHover={{
                  y: -1,
                  boxShadow: "0 10px 20px rgba(6,199,85,.35)",
                }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-full bg-[#06C755] text-white px-4 py-2 text-sm font-semibold"
              >
                <span className="bg-white rounded-full p-1">
                  <LineIcon className="w-5 h-5" />
                </span>
                ติดต่อเรา
              </motion.a>

              {/* Phone/booking button */}
              <motion.button
                whileHover={{
                  y: -1,
                  boxShadow: "0 10px 24px rgba(236,72,153,.35)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavClick("#contact")}
                className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white px-5 py-2 text-sm font-semibold"
              >
                <Phone className="w-6 h-6" />
                จอง/ติดต่อ
                <span className="absolute inset-0 rounded-full ring-2 ring-white/10" />
              </motion.button>
            </div>

            {/* Mobile toggle */}
            <div className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:text-pink-600"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile sheet */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-pink-100/70 bg-white/90 backdrop-blur"
              >
                <div className="px-3 py-2 space-y-2">
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.href)}
                      className="w-full text-left px-3 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition"
                    >
                      {item.label}
                    </button>
                  ))}

                  {/* LINE in mobile */}
                  <a
                    href={LINE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#06C755] text-white px-4 py-3 text-base font-semibold"
                  >
                    <LineIcon className="w-5 h-5" />
                    ติดต่อเรา (LINE)
                  </a>

                  <button
                    onClick={() => handleNavClick("#contact")}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white px-4 py-3 text-base font-semibold"
                  >
                    <Phone className="w-4 h-4" />
                    จอง/ติดต่อ
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>
    </>
  );
}
