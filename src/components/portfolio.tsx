"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: "เล็บพาสเทลลายคลื่น",
    category: "เจลพื้น",
    image: "/hero/nail-1.jpg",
    description: "โทนพาสเทลหวาน เหมาะกับไปเรียน/ทำงาน",
  },
  {
    id: 2,
    title: "เล็บโทนม่วงชมพู",
    category: "เพ้นท์ลาย",
    image: "/hero/nail-2.jpg",
    description: "ลายมินิมอล ดูสะอาดตา",
  },
  {
    id: 3,
    title: "เล็บโทนชมพูมุก",
    category: "มาร์เบิล",
    image: "/hero/nail-3.jpg",
    description: "ลายมาร์เบิลสวย เงาสวย",
  },
  {
    id: 4,
    title: "เล็บโทนเหลืองมิ้นต์",
    category: "เจลพื้น",
    image: "/hero/nail-4.jpg",
    description: "สีสดใส เหมาะกับฤดูร้อน",
  },
  {
    id: 5,
    title: "เล็บลายหัวใจ",
    category: "เพ้นท์ลาย",
    image: "/hero/nail-5.jpg",
    description: "ลายหวานน่ารัก เหมาะกับคู่รัก",
  },
  {
    id: 6,
    title: "เล็บโฮโลแกรมม่วง",
    category: "โฮโลแกรม",
    image: "/hero/nail-6.jpg",
    description: "เอฟเฟกต์โฮโลแกรมสวย",
  },
];

const CATEGORIES = ["ทั้งหมด", "เจลพื้น", "เพ้นท์ลาย", "มาร์เบิล", "โฮโลแกรม"];

export default function Portfolio() {
  return (
    <section
      id="portfolio"
      className="py-20 bg-gradient-to-b from-white to-pink-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ตัวอย่างผลงาน
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ดูตัวอย่างผลงานที่เราทำให้ลูกค้า งานละเอียด สีสวยทน
            ทุกชิ้นงานผ่านการรับประกัน 7 วัน
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {CATEGORIES.map((category, index) => (
            <button
              key={category}
              className="px-6 py-2 rounded-full text-sm font-medium transition-all
                         bg-white border-2 border-pink-200 text-pink-600 hover:bg-pink-600 hover:text-white hover:border-pink-600
                         focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PORTFOLIO_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-[4/5]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 bg-pink-600 text-white text-xs font-medium rounded-full">
                    {item.category}
                  </span>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center text-white">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">ดูรายละเอียด</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>

                {/* Action Button */}
                <div className="mt-4">
                  <button className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium text-sm transition-colors">
                    ดูรายละเอียด
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-6">
            ต้องการดูผลงานเพิ่มเติมหรือมีไอเดียเฉพาะตัว?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-semibold transition-colors">
              ดูผลงานเพิ่มเติม
            </button>
            <button className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white font-semibold transition-colors">
              ปรึกษาไอเดีย
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
