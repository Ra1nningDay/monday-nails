"use client";

import { motion } from "framer-motion";
import { Sparkles, Heart, MapPin, ShieldCheck } from "lucide-react";
import { BENEFITS } from "@/utils/data";

const iconMap = {
  sparkles: Sparkles,
  heart: Heart,
  "map-pin": MapPin,
  "shield-check": ShieldCheck,
};

export default function Benefits() {
  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ทำไมต้องเลือก{" "}
            <span className="text-pink-600">Monday Nail Studio</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            เราให้ความสำคัญกับคุณภาพ งานละเอียด และประสบการณ์ที่ดีของลูกค้า
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BENEFITS.map((benefit, index) => {
            const IconComponent = iconMap[benefit.icon as keyof typeof iconMap];

            return (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 h-full border border-pink-100 hover:border-pink-200 transition-all duration-300">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-pink-200 transition-colors">
                    <IconComponent className="w-8 h-8 text-pink-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 border border-pink-100">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 mb-2">
                  500+
                </div>
                <div className="text-gray-600">ลูกค้าพึงพอใจ</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 mb-2">4.9</div>
                <div className="text-gray-600">คะแนนรีวิวเฉลี่ย</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 mb-2">
                  7 วัน
                </div>
                <div className="text-gray-600">รับประกันงาน</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
