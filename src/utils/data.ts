import { Service, Benefit, Review, FAQ, NavItem, ContactInfo } from "@/types";

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "หน้าแรก", href: "#home" },
  { id: "services", label: "บริการ", href: "#services" },
  { id: "work", label: "ผลงาน", href: "#work" },
  { id: "pricing", label: "แพ็กเกจ", href: "#pricing" },
  { id: "reviews", label: "รีวิว", href: "#reviews" },
  { id: "faq", label: "FAQ", href: "#faq" },
];

export const BENEFITS: Benefit[] = [
  {
    id: "quality",
    title: "วัสดุคุณภาพซาลอน",
    description: "ใช้สีและวัสดุเกรดซาลอน สีเงาสวย ติดทน ไม่ทำลายเล็บธรรมชาติ",
    icon: "sparkles",
  },
  {
    id: "care",
    title: "ใส่ใจรายละเอียด",
    description: "ทีมงานมืออาชีพ ใส่ใจความสะอาด ตรงเวลา และผลงานที่สมบูรณ์แบบ",
    icon: "heart",
  },
  {
    id: "location",
    title: "ทำเลสะดวก",
    description: "ใกล้มหาวิทยาลัยกรุงเทพ (รังสิต) เดินทางง่าย จอดรถสะดวก",
    icon: "map-pin",
  },
  {
    id: "warranty",
    title: "รับประกัน 7 วัน",
    description: "รับประกันงาน 7 วัน ครอบคลุมสีล่อน หลุด แตกร้าวจากงานช่าง",
    icon: "shield-check",
  },
];

export const SERVICES: Service[] = [
  {
    id: "gel-base",
    title: "ทำเล็บเจลพื้น",
    description: "โทนสุภาพ พาสเทล กลิตเตอร์ เหมาะกับไปเรียน/ทำงาน",
    duration: "45-60 นาที",
    price: "เริ่มต้น 199 บาท",
    features: [
      "โทนสุภาพ/พาสเทล/กลิตเตอร์",
      "เหมาะกับไปเรียน/ทำงาน",
      "ติดทนนาน",
    ],
    image: "/services/gel-base.jpg",
  },
  {
    id: "nail-art",
    title: "เพ้นท์เล็บ & ดีไซน์เฉพาะตัว",
    description: "ลายมินิมอล ฟูฟ่อง โทนพาสเทล สามารถนำเรฟฯ มาให้ดูได้",
    duration: "60-90 นาที",
    price: "399-799 บาท",
    features: [
      "ลายมินิมอล/ฟูฟ่อง/โทนพาสเทล",
      "สามารถนำเรฟฯ มาให้ดู",
      "ให้ช่างช่วยออกแบบ",
    ],
    image: "/services/nail-art.jpg",
  },
  {
    id: "3d-art",
    title: "งานปั้นนูน 3D",
    description: "ดอกไม้ โบว์ คาแรกเตอร์ รายละเอียดคม เคลือบแน่น เนียนมือ",
    duration: "90-120 นาที",
    price: "599-999 บาท",
    features: ["ดอกไม้/โบว์/คาแรกเตอร์", "รายละเอียดคม", "เคลือบแน่น เนียนมือ"],
    image: "/services/3d-art.jpg",
  },
  {
    id: "pvc-extension",
    title: "ต่อ PVC (ทรงธรรมชาติ)",
    description: "เลือกความยาว/ทรง อัลมอนด์ สแควร์ วงรี แข็งแรง น้ำหนักเบา",
    duration: "120-150 นาที",
    price: "เริ่มต้น 359 บาท",
    features: [
      "เลือกความยาว/ทรง",
      "แข็งแรง น้ำหนักเบา",
      "ทำสีพื้น/เพ้นท์เพิ่มได้",
    ],
    image: "/services/pvc-extension.jpg",
  },
];

export const REVIEWS: Review[] = [
  {
    id: "1",
    name: "น้องพลอย",
    rating: 5,
    comment: "งานสวยมากค่ะ ละเอียดมาก ช่างใจดี ราคาไม่แพง แนะนำเลย!",
    date: "2024-01-15",
  },
  {
    id: "2",
    name: "คุณสมหญิง",
    rating: 5,
    comment: "ทำเล็บเจลที่นี่มา 3 ครั้งแล้ว สีติดทนมาก ไม่ล่อนเลย ดีใจที่เจอ",
    date: "2024-01-10",
  },
  {
    id: "3",
    name: "น้องเบล",
    rating: 5,
    comment: "งานปั้นนูนสวยมาก ดูเป็นธรรมชาติ ราคาโอเคมากสำหรับงานคุณภาพแบบนี้",
    date: "2024-01-08",
  },
];

export const FAQS: FAQ[] = [
  {
    id: "1",
    question: "ต้องจองล่วงหน้ากี่วัน?",
    answer:
      "แนะนำจองล่วงหน้า 1-2 วัน เพื่อให้เราเตรียมวัสดุและจัดตารางเวลาให้เหมาะสม",
  },
  {
    id: "2",
    question: "ถอดเจลทำอย่างไร?",
    answer:
      "เราใช้วิธีถอดเจลแบบถนอมหน้าเล็บ ไม่ทำให้เล็บเสียหาย สามารถทำได้ที่ร้านหรือซื้อชุดถอดไปทำเองที่บ้าน",
  },
  {
    id: "3",
    question: "มีโปรโมชั่นอะไรบ้าง?",
    answer:
      "มีโปรวันจันทร์ เจลพื้นโทนสุภาพ ราคาโปร 199-259 บาท และโปรนักศึกษา แสดงบัตรลด 10%",
  },
  {
    id: "4",
    question: "รับประกันงานกี่วัน?",
    answer:
      "รับประกันงาน 7 วัน ครอบคลุมสีล่อน หลุด แตกร้าวจากงานช่าง (ไม่รวมการใช้งานผิดวิธี)",
  },
];

export const CONTACT_INFO: ContactInfo = {
  phone: "097-695-6195",
  line: "https://lin.ee/pDN1jbV",
  address: "ใกล้มหาวิทยาลัยกรุงเทพ (รังสิต) จ.ปทุมธานี",
  hours: "จ.-อา. 10:00-19:00",
};
