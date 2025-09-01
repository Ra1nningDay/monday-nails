import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ตรวจสอบว่ามี DATABASE_URL หรือไม่
  if (!process.env.DATABASE_URL) {
    console.log("⚠️ DATABASE_URL not found, skipping seed...");
    return;
  }

  try {
    // สร้าง admin เริ่มต้น
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.admin.upsert({
      where: { email: "admin@mondaynail.com" },
      update: {},
      create: {
        email: "admin@mondaynail.com",
        password: hashedPassword,
        name: "Admin",
        role: "admin",
      },
    });

    console.log("✅ Admin user created:", admin.email);

    // สร้าง employee เริ่มต้น
    const employeePassword = await bcrypt.hash("employee123", 10);

    // อั้ม
    const employee1 = await prisma.employee.upsert({
      where: { email: "am@mondaynail.com" },
      update: {},
      create: {
        email: "am@mondaynail.com",
        password: employeePassword,
        name: "อั้ม",
        role: "employee",
      },
    });

    console.log("✅ Employee created:", employee1.email);

    // ทิวลิป
    const employee2 = await prisma.employee.upsert({
      where: { email: "tulip@mondaynail.com" },
      update: {},
      create: {
        email: "tulip@mondaynail.com",
        password: employeePassword,
        name: "ทิวลิป",
        role: "employee",
      },
    });

    console.log("✅ Employee created:", employee2.email);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    // ไม่ throw error เพื่อไม่ให้ build fail
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    // ไม่ exit process เพื่อไม่ให้ build fail
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
