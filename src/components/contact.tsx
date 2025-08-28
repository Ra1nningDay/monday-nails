"use client";

import { motion } from "framer-motion";
import { Phone, MapPin, Clock, MessageCircle, ArrowRight } from "lucide-react";
import { CONTACT_INFO } from "@/utils/data";

export default function Contact() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="contact" className="py-20 bg-white">
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
            ติดต่อและจองคิว
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ติดต่อเราเพื่อจองคิวหรือสอบถามข้อมูลเพิ่มเติม
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                ข้อมูลติดต่อ
              </h3>

              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      โทรศัพท์
                    </h4>
                    <a
                      href={`tel:${CONTACT_INFO.phone}`}
                      className="text-pink-600 hover:text-pink-700 transition-colors"
                    >
                      {CONTACT_INFO.phone}
                    </a>
                  </div>
                </div>

                {/* LINE */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      LINE Official
                    </h4>
                    <a
                      href={CONTACT_INFO.line}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 transition-colors"
                    >
                      เพิ่มเพื่อนใน LINE
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      ที่อยู่
                    </h4>
                    <p className="text-gray-600">{CONTACT_INFO.address}</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      เวลาเปิด-ปิด
                    </h4>
                    <p className="text-gray-600">{CONTACT_INFO.hours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Steps */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border border-pink-100">
              <h4 className="text-xl font-bold text-gray-900 mb-6">
                ขั้นตอนการจอง
              </h4>
              <div className="space-y-4">
                {[
                  "ทัก LINE หรือโทรศัพท์",
                  "ส่งแบบ/โทนที่อยากได้",
                  "เลือกวัน-เวลา",
                  "ยืนยันคิว",
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border border-pink-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              ส่งข้อความถึงเรา
            </h3>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    ชื่อ-นามสกุล
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                    placeholder="ชื่อของคุณ"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                    placeholder="081-234-5678"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  บริการที่สนใจ
                </label>
                <select
                  id="service"
                  name="service"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                >
                  <option value="">เลือกบริการ</option>
                  <option value="gel-base">ทำเล็บเจลพื้น</option>
                  <option value="nail-art">เพ้นท์เล็บ & ดีไซน์</option>
                  <option value="3d-art">งานปั้นนูน 3D</option>
                  <option value="pvc-extension">ต่อ PVC</option>
                  <option value="other">อื่นๆ</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ข้อความ
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                  placeholder="รายละเอียดเพิ่มเติม หรือวันที่ต้องการจอง"
                ></textarea>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                ส่งข้อความ
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              หรือติดต่อเราโดยตรงผ่าน{" "}
              <a
                href={CONTACT_INFO.line}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                LINE Official
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
