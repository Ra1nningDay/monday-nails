# Monday Nail Studio - Website

เว็บไซต์สำหรับร้านทำเล็บเจล Monday Nail Studio ใกล้มหาวิทยาลัยกรุงเทพ (รังสิต)

## 🚀 Features

- **One-Page Website**: หน้าเดียวครบครันทุกฟีเจอร์
- **SEO Optimized**: ปรับแต่งสำหรับ SEO ครบถ้วน
- **Responsive Design**: รองรับทุกขนาดหน้าจอ
- **Modern UI/UX**: ดีไซน์สวยงาม ทันสมัย
- **Smooth Animations**: ใช้ Framer Motion สำหรับ animation
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Styling ที่รวดเร็วและยืดหยุ่น

## 📱 Sections

1. **Hero Section** - แนะนำร้านและ USP
2. **Benefits** - เหตุผลที่ต้องเลือกร้านเรา
3. **Services** - รายการบริการทั้งหมด
4. **Reviews** - รีวิวจากลูกค้า
5. **FAQ** - คำถามที่พบบ่อย
6. **Contact** - ข้อมูลติดต่อและฟอร์มจอง

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **Deployment**: Vercel (แนะนำ)

## 📦 Installation

```bash
# Clone repository
git clone <repository-url>
cd monday-nail

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 🔧 Configuration

### Environment Variables

สร้างไฟล์ `.env.local` และเพิ่ม:

```env
NEXT_PUBLIC_SITE_URL=https://monday-nail-studio.com
NEXT_PUBLIC_LINE_URL=https://lin.ee/pDN1jbV
NEXT_PUBLIC_PHONE=097-695-6195
```

### SEO Configuration

แก้ไขข้อมูลใน `src/app/layout.tsx`:

- Google Analytics ID
- Google Search Console verification
- Open Graph images

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with SEO
│   ├── page.tsx           # Main page component
│   └── globals.css        # Global styles
├── components/
│   ├── navbar.tsx         # Navigation bar
│   ├── hero.tsx          # Hero section
│   ├── benefits.tsx      # Benefits section
│   ├── services.tsx      # Services section
│   ├── reviews.tsx       # Reviews section
│   ├── faq.tsx          # FAQ section
│   ├── contact.tsx      # Contact section
│   └── footer.tsx       # Footer
├── hooks/
│   └── use-store.ts     # Zustand store
├── types/
│   └── index.ts         # TypeScript interfaces
└── utils/
    └── data.ts          # Static data
```

## 🎨 Customization

### Colors

สีหลักของเว็บไซต์อยู่ใน Tailwind config:

- Primary: Pink (#ec4899)
- Secondary: Purple (#a855f7)
- Background: Pink/Purple gradients

### Content

แก้ไขเนื้อหาได้ใน `src/utils/data.ts`:

- ข้อมูลบริการ
- รีวิวลูกค้า
- FAQ
- ข้อมูลติดต่อ

## 📸 Images

เพิ่มรูปภาพใน `public/` folder:

- `og-image.jpg` - Open Graph image (1200x630)
- `favicon.ico` - Favicon
- `apple-touch-icon.png` - iOS icon
- `services/` - รูปภาพบริการต่างๆ

## 🚀 Deployment

### Vercel (แนะนำ)

1. Push code ไป GitHub
2. Connect repository ใน Vercel
3. Deploy automatically

### Environment Variables ใน Vercel

เพิ่ม environment variables:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_LINE_URL`
- `NEXT_PUBLIC_PHONE`

## 📊 Analytics

### Google Analytics

เพิ่ม Google Analytics 4 ใน `src/app/layout.tsx`:

```tsx
// Google Analytics
<script
  async
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
/>
<script
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
    `,
  }}
/>
```

## 🔍 SEO Checklist

- [x] Meta tags (title, description, keywords)
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Structured data (JSON-LD)
- [x] Sitemap
- [x] Robots.txt
- [x] Canonical URLs
- [x] Alt text for images
- [x] Semantic HTML
- [x] Mobile responsive
- [x] Fast loading

## 📞 Contact

สำหรับคำถามหรือปัญหาทางเทคนิค:

- Email: [your-email]
- LINE: [your-line]

## 📄 License

MIT License - ดูรายละเอียดใน LICENSE file
## Docker Workflow

1. Copy docker/.env.docker.example to docker/.env.docker and update secrets as needed.
2. Build the stack with pnpm docker:build (or docker compose build).
3. Start the services with pnpm docker:up and access the app at http://localhost:3000.
4. Run Prisma migrations/seeds automatically via the container entrypoint, or manually with pnpm docker:up -- overrides.
5. Shut everything down with pnpm docker:down (removes volumes) or docker compose down.
6. Smoke test the stack locally with pnpm test:docker.
