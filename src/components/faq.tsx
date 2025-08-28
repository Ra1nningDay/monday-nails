"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQS } from "@/utils/data";

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section
      id="faq"
      className="py-20 bg-gradient-to-br from-pink-50 to-purple-50"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="w-8 h-8 text-pink-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              คำถามที่พบบ่อย
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            คำตอบสำหรับคำถามที่ลูกค้าสงสัยบ่อย
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden"
            >
              <motion.button
                onClick={() => toggleFaq(faq.id)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-pink-50 transition-colors"
                whileHover={{ backgroundColor: "#fdf2f8" }}
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openFaq === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-pink-600 flex-shrink-0" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {openFaq === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              ยังมีคำถามอื่นๆ อยู่ไหม?
            </h3>
            <p className="text-pink-100 mb-6">
              ติดต่อเราได้เลย เรายินดีให้คำแนะนำและตอบคำถามทุกข้อสงสัย
            </p>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-pink-50 transition-colors"
            >
              ติดต่อเรา
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
