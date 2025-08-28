"use client";

import { motion } from "framer-motion";
import { ArrowUp, Phone, MessageCircle, MapPin } from "lucide-react";
import { NAV_ITEMS, CONTACT_INFO } from "@/utils/data";

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-pink-400 mb-4">
              Monday Nail Studio
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              ทำเล็บเจล งานปั้นนูน เพ้นท์เล็บ ใกล้มหาวิทยาลัยกรุงเทพ (รังสิต)
              งานละเอียด เสร็จไว สีสวยทน — รับประกัน 7 วัน
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-pink-400" />
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="text-gray-300 hover:text-pink-400 transition-colors"
                >
                  {CONTACT_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-green-400" />
                <a
                  href={CONTACT_INFO.line}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  LINE Official
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">{CONTACT_INFO.address}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">เมนู</h4>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="text-gray-300 hover:text-pink-400 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">บริการ</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#services"
                  className="text-gray-300 hover:text-pink-400 transition-colors"
                >
                  ทำเล็บเจลพื้น
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-300 hover:text-pink-400 transition-colors"
                >
                  เพ้นท์เล็บ & ดีไซน์
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-300 hover:text-pink-400 transition-colors"
                >
                  งานปั้นนูน 3D
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-300 hover:text-pink-400 transition-colors"
                >
                  ต่อ PVC
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 Monday Nail Studio. สงวนลิขสิทธิ์
          </div>

          <motion.button
            onClick={handleScrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-full transition-colors"
            aria-label="กลับขึ้นด้านบน"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
