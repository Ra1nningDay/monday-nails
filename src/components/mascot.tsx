"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const GREETINGS = [
  "สวัสดีค่ะ! 👋",
  "ยินดีต้อนรับ! ✨",
  "มีอะไรให้ช่วยไหมคะ? 💅",
  "ดูสวยๆ กันเลย! 🌸",
  "พร้อมให้บริการค่ะ! 💖",
];

export default function Mascot() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [currentGreeting, setCurrentGreeting] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // แสดงมาสคอสเมื่อ scroll ลงมา 30% ของหน้าจอ
      if (scrollY > windowHeight * 0.3 && !isVisible) {
        setIsVisible(true);
        setTimeout(() => setShowPopup(true), 500);
      } else if (scrollY < windowHeight * 0.2 && isVisible) {
        setIsVisible(false);
        setShowPopup(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible]);

  useEffect(() => {
    if (showPopup) {
      const interval = setInterval(() => {
        setCurrentGreeting((prev) => (prev + 1) % GREETINGS.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [showPopup]);

  const handleMascotClick = () => {
    setShowPopup(!showPopup);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 200, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          // ติดขอบขวาจริง ๆ
          className="fixed right-0 bottom-16 z-40 pointer-events-none"
        >
          {/* Popup */}
          <AnimatePresence>
            {showPopup && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="absolute bottom-full right-2 mb-3 w-48"
              >
                <div className="relative bg-white rounded-2xl shadow-xl border border-pink-100 p-4">
                  <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white" />
                  <motion.p
                    key={currentGreeting}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm font-medium text-gray-800 text-center leading-relaxed"
                  >
                    {GREETINGS[currentGreeting]}
                  </motion.p>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-pink-100 hover:bg-pink-200 rounded-full flex items-center justify-center text-pink-600 text-xs transition-colors"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mascot (หมุนเอียงจากมุมขวาล่างและชิดขอบ) */}
          <motion.div
            onClick={handleMascotClick}
            className="relative pointer-events-auto origin-bottom-right -mr-1" // -mr ช่วยให้ชิดขอบมากขึ้น
            style={{ originX: 1, originY: 1 }} // เผื่อไม่ใช้ Tailwind origin-*
            whileHover={{ scale: 1.06, rotate: -3 }}
            whileTap={{ scale: 0.96 }}
          >
            <motion.div
              // เอียงถาวรเล็กน้อย แต่ยังชิดขอบเพราะ origin อยู่มุมขวาล่าง
              animate={{ rotate: -8, y: [-3, 3, -3] }}
              transition={{
                rotate: { duration: 0 }, // หมุนค้างไว้
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <Image
                src="/hero/mascos.png"
                alt="Monday Nail Studio Mascot"
                width={120}
                height={120}
                className="w-50 h-50 object-contain drop-shadow-xl"
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
