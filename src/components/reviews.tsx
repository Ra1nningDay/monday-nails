"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { REVIEWS } from "@/utils/data";

export default function Reviews() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section id="reviews" className="py-20 bg-white">
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
            รีวิวจากลูกค้า
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ลูกค้าของเราพึงพอใจกับบริการและผลงานของเรา
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 h-full border border-pink-100 hover:border-pink-200 transition-all duration-300">
                {/* Quote Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                    <Quote className="w-6 h-6 text-pink-600" />
                  </div>
                </div>

                {/* Stars */}
                <div className="flex justify-center mb-4">
                  <div className="flex gap-1">{renderStars(review.rating)}</div>
                </div>

                {/* Review Text */}
                <blockquote className="text-gray-700 text-center mb-6 italic leading-relaxed">
                  "{review.comment}"
                </blockquote>

                {/* Customer Info */}
                <div className="text-center">
                  <div className="font-semibold text-gray-900 mb-1">
                    {review.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Overall Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl p-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              {renderStars(5)}
            </div>
            <h3 className="text-2xl font-bold mb-2">คะแนนเฉลี่ย 4.9/5</h3>
            <p className="text-pink-100">
              จากรีวิวมากกว่า 500 รายการ • ลูกค้าพึงพอใจ 98%
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
