"use client";

import { motion } from "framer-motion";
import { Clock, Star, ArrowRight } from "lucide-react";
import { SERVICES } from "@/utils/data";

export default function Services() {
  return (
    <section
      id="services"
      className="py-20 bg-gradient-to-br from-pink-50 to-purple-50"
    >
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
            บริการของเรา
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ครบครันทุกความต้องการ ตั้งแต่เล็บเจลพื้นฐาน ไปจนถึงงานปั้นนูน 3D
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 h-full shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-100">
                {/* Service Image Placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl mb-6 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-4xl mb-2">💅</div>
                    <p className="text-sm">{service.title}</p>
                  </div>
                </div>

                {/* Service Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Price and Duration */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {service.duration}
                      </div>
                      <div className="text-lg font-bold text-pink-600">
                        {service.price}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      จองเลย
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add-ons Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            บริการเสริม
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "ติดเพชร/สติ๊กเกอร์", price: "50-150 บาท" },
              { title: "ดูแลหนังกำพร้า", price: "100 บาท" },
              { title: "Treatment เคลือบเงา", price: "150 บาท" },
              { title: "ถอดเจลแบบถนอม", price: "200 บาท" },
            ].map((addon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="text-center p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors"
              >
                <h4 className="font-semibold text-gray-900 mb-2">
                  {addon.title}
                </h4>
                <p className="text-pink-600 font-medium">{addon.price}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Promotions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl p-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-6 h-6" />
              <h3 className="text-2xl font-bold">โปรโมชั่นพิเศษ</h3>
              <Star className="w-6 h-6" />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Happy Monday</h4>
                <p className="text-pink-100">
                  เจลพื้นโทนสุภาพ ราคาโปร 199-259 บาท
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">โปรนักศึกษา</h4>
                <p className="text-pink-100">แสดงบัตร นศ. ลด 10% (จ.-ศ.)</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">คู่เพื่อนสนิท</h4>
                <p className="text-pink-100">มา 2 คน ลดรวม 100 บาท</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
