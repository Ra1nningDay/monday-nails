"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";

type Img = {
  src: string;
  alt: string;
  // desktop absolute positions (vw/vh ให้แม่นแบบภาพอ้างอิง)
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  rot: number;
  w: string; // width พร้อมหน่วย เช่น "17vw"
  // overrides สำหรับ mobile/laptop (<= 1024px)
  topM?: string;
  leftM?: string;
  rightM?: string;
  bottomM?: string;
  wM?: string;
  show?: "base" | "lg" | "xl"; // คุมการแสดงผลตาม breakpoint
};

// -------- ตำแหน่งกรอบรูปแบบภาพอ้างอิง --------
const IMAGES: Img[] = [
  // 4 ใบหลัก — แสดงทุกขนาด
  {
    src: "/hero/nail-1.jpg",
    alt: "เล็บพาสเทลลายคลื่น",
    top: "12vh",
    left: "6vw",
    rot: -10,
    w: "17vw",
    topM: "8vh",
    leftM: "4vw",
    wM: "38vw",
    show: "base",
  },
  {
    src: "/hero/nail-2.jpg",
    alt: "เล็บพาสเทลโทนม่วงชมพู",
    top: "14vh",
    right: "6vw",
    rot: 8,
    w: "18vw",
    topM: "10vh",
    rightM: "4vw",
    wM: "40vw",
    show: "base",
  },
  {
    src: "/hero/nail-3.jpg",
    alt: "เล็บโทนชมพูมุกลายมาร์เบิล",
    bottom: "16vh",
    right: "14vw",
    rot: 12,
    w: "19vw",
    bottomM: "12vh",
    rightM: "8vw",
    wM: "44vw",
    show: "base",
  },
  {
    src: "/hero/nail-4.jpg",
    alt: "เล็บพาสเทลโทนเหลืองมิ้นต์",
    bottom: "20vh",
    left: "8vw",
    rot: -6,
    w: "20vw",
    bottomM: "16vh",
    leftM: "6vw",
    wM: "46vw",
    show: "base",
  },

  // +2 เฉพาะจอ >= lg
  {
    src: "/hero/nail-5.jpg",
    alt: "เล็บพาสเทลลายหัวใจ",
    top: "6vh",
    left: "32vw",
    rot: -4,
    w: "12vw",
    show: "lg",
  },
  {
    src: "/hero/nail-6.jpg",
    alt: "เล็บโฮโลแกรมม่วง",
    bottom: "8vh",
    left: "36vw",
    rot: 5,
    w: "11vw",
    show: "lg",
  },

  // +1 เฉพาะจอ >= xl
  {
    src: "/hero/nail-7.jpg",
    alt: "เล็บเพ้นท์มินิมอล",
    top: "28vh",
    right: "31vw",
    rot: -7,
    w: "10vw",
    show: "xl",
  },
];

// ---------- Sparkles (ดาว/จุดระยิบ) ----------
function Sparkles() {
  const reduce = useReducedMotion();
  const twinkle = reduce
    ? {}
    : {
        opacity: [0.25, 1, 0.25],
        scale: [0.85, 1.15, 0.85],
        transition: {
          duration: 2.6,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  const Star = ({
    x,
    y,
    s = 1,
    d = 0,
  }: {
    x: string;
    y: string;
    s?: number;
    d?: number;
  }) => (
    <motion.svg
      className="absolute"
      style={{ left: x, top: y }}
      width={30 * s}
      height={30 * s}
      viewBox="0 0 20 20"
      initial={{ opacity: 0.6 }}
      animate={twinkle}
      transition={{ delay: d }}
      aria-hidden
    >
      <path
        d="M10 0l1.8 4.2L16 6 11.8 7.8 10 12 8.2 7.8 4 6l4.2-1.8L10 0z"
        fill="white"
      />
    </motion.svg>
  );

  return (
    // z-[5] อยู่เหนือพื้นหลัง/วงกลม แต่ต่ำกว่าข้อความ (z-10)
    <div className="pointer-events-none absolute inset-0 z-[5]">
      {/* ซ้ายบน */}
      <Star x="12%" y="18%" s={0.8} d={0.0} />
      <Star x="22%" y="28%" s={0.9} d={0.3} />
      <Star x="18%" y="42%" s={0.7} d={0.6} />

      {/* กลางบน */}
      <Star x="38%" y="15%" s={1.1} d={0.1} />
      <Star x="52%" y="25%" s={0.6} d={0.4} />

      {/* ขวาบน */}
      <Star x="68%" y="22%" s={0.9} d={0.2} />
      <Star x="82%" y="38%" s={1.0} d={0.7} />

      {/* กลางล่าง */}
      <Star x="45%" y="65%" s={0.8} d={0.5} />
      <Star x="62%" y="75%" s={0.7} d={0.8} />

      {/* ซ้ายล่าง */}
      <Star x="28%" y="78%" s={1.0} d={0.9} />

      {/* จุดประกายเล็ก */}
      <motion.div
        className="absolute rounded-full bg-white/80"
        style={{ left: "64%", top: "28%", width: 4, height: 4 }}
        animate={twinkle}
        transition={{ delay: 0.3 }}
      />
      <motion.div
        className="absolute rounded-full bg-white/80"
        style={{ left: "32%", top: "58%", width: 3, height: 3 }}
        animate={twinkle}
        transition={{ delay: 0.8 }}
      />
      <motion.div
        className="absolute rounded-full bg-white/80"
        style={{ left: "75%", top: "65%", width: 2, height: 2 }}
        animate={twinkle}
        transition={{ delay: 1.2 }}
      />
      <motion.div
        className="absolute rounded-full bg-white/80"
        style={{ left: "15%", top: "65%", width: 3, height: 3 }}
        animate={twinkle}
        transition={{ delay: 0.5 }}
      />
    </div>
  );
}

// ---------- Floating frame (กรอบรูป) ----------
function Floating({
  img,
  delay,
  reduce,
}: {
  img: Img;
  delay: number;
  reduce: boolean;
}) {
  const vis =
    img.show === "xl"
      ? "hidden xl:block"
      : img.show === "lg"
      ? "hidden lg:block"
      : "block";

  const styleDesktop: React.CSSProperties = {
    top: img.top,
    left: img.left,
    right: img.right,
    bottom: img.bottom,
    width: img.w,
  };
  const styleMobile: React.CSSProperties = {
    // ใช้เมื่อ <= 1024px
    // @ts-ignore
    "--topM": img.topM,
    "--leftM": img.leftM,
    "--rightM": img.rightM,
    "--bottomM": img.bottomM,
    "--wM": img.wM,
  };

  return (
    <motion.div
      aria-hidden="true"
      className={`absolute pointer-events-none select-none ${vis}`}
      style={{ ...styleDesktop, ...(img.wM ? styleMobile : {}) }}
      initial={{ opacity: 0, scale: 0.94, rotate: img.rot }}
      animate={{ opacity: 1, scale: 1, rotate: img.rot }}
      transition={{ duration: 0.6, delay }}
    >
      <motion.div
        animate={reduce ? undefined : { y: [-4, 4, -4] }}
        transition={
          reduce
            ? undefined
            : { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
        className="rounded-[22px] p-2 bg-white/92 backdrop-blur-sm
                   shadow-[0_18px_40px_rgba(0,0,0,0.12)] border border-white/80"
      >
        <div className="rounded-[18px] overflow-hidden">
          <Image
            src={img.src}
            alt={img.alt}
            width={900}
            height={1125} // 4:5
            priority
            className="w-full h-auto object-cover"
          />
        </div>
      </motion.div>

      {/* mobile overrides */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .absolute[style*="--wM"] {
            top: var(--topM);
            left: var(--leftM);
            right: var(--rightM);
            bottom: var(--bottomM);
            width: var(--wM);
          }
        }
      `}</style>
    </motion.div>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const scrollTo = (hash: string) =>
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      aria-label="Hero"
      className={[
        "relative min-h-[96vh] overflow-hidden pt-24 flex items-center justify-center",
        // พื้นหลังเข้ม/หวานแบบภาพอ้างอิง: radial หลัก + film + vignette
        "bg-[radial-gradient(1200px_900px_at_15%_20%,#ffd3e7_0%,#fbe0f3_36%,#efe0ff_74%,#e7dbff_100%)]",
      ].join(" ")}
    >
      {/* ชั้นพื้นหลัง: วงกลม/บับเบิล (z-0), ฟิล์ม/vignette (z-[1]) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-40 -left-24 w-[30rem] h-[30rem] rounded-full bg-pink-300/60 blur-3xl" />
        <div className="absolute top-12 right-8 w-[36rem] h-[36rem] rounded-full bg-purple-300/55 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/2 -translate-x-1/2 w-[44rem] h-[44rem] rounded-full bg-pink-200/65 blur-3xl" />
        {/* วงกลมขาวซ้อนสร้างมิติ */}
        <div className="absolute right-[12%] top-[14%] w-72 h-72 rounded-full bg-white/22" />
        <div className="absolute right-[18%] top-[10%] w-44 h-44 rounded-full bg-white/18" />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(1000px_420px_at_50%_100%,rgba(255,255,255,0.55),rgba(255,255,255,0)_70%)]" />
      </div>

      {/* ⭐ ดาว/ระยิบ (ต้องอยู่ z-[5]) */}
      <Sparkles />

      {/* เนื้อหากลาง (z-10) */}
      <div className="relative z-10 w-full px-6">
        <div className="mx-auto max-w-[68rem] text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-900 px-4 py-2 rounded-full text-sm font-medium shadow-sm mb-6"
          >
            <MapPin className="w-4 h-4" />
            ทำเล็บเจล · รังสิต/ใกล้ ม.กรุงเทพ
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 text-balance"
          >
            ทำเล็บเจล <span className="text-pink-600">งานปั้นนูน</span>{" "}
            เพ้นท์เล็บ
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-lg md:text-xl text-gray-700"
          >
            งานละเอียด สีสวยทน ไม่ทำลายหน้าเล็บ — รับประกัน 7 วัน
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => scrollTo("#contact")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full
                         bg-pink-600 hover:bg-pink-700 text-white text-lg font-semibold shadow-lg"
            >
              จองคิวทันที <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollTo("#services")}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full
                         border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white
                         text-lg font-semibold bg-white"
            >
              ดูบริการ
            </button>
          </motion.div>
        </div>
      </div>

      {/* รูปลอย (z-[4]) */}
      <div className="absolute inset-0 z-[4]">
        {IMAGES.map((img, i) => (
          <Floating
            key={`${img.src}-${i}`}
            img={img}
            delay={0.1 * (i + 1)}
            reduce={reduce || false}
          />
        ))}
      </div>

      {/* ไอคอนทาเจล (ขวาล่าง) */}
      {/* <motion.div
        aria-hidden
        className="hidden md:block absolute right-[8%] bottom-[10%] w-20 h-20 opacity-90 z-[6]"
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/hero/nail-polish.png"
          alt="ไอคอนทาเล็บ"
          width={80}
          height={80}
          className="w-full h-full object-contain drop-shadow-lg"
          style={{
            filter:
              "invert(0.5) sepia(1) hue-rotate(280deg) saturate(2) brightness(0.8)",
          }}
        />
      </motion.div> */}
    </section>
  );
}
