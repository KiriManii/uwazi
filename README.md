# Uwazi Polling Platform

A streamlined polling platform for African governance that converts anonymous users into leads while providing valuable insights. Built with Next.js, Redux, TypeScript, and Chart.js.

## ��� Features

- ���️ **Anonymous Poll Creation & Voting** - No registration required  
- ��� **Real-time Results** with Chart.js visualizations (Bar/Pie charts)  
- ��� **Live Updates** using Supabase real-time subscriptions  
- ��� **PWA Support** - Install on mobile devices  
- ��� **Lead Generation** - Email capture at multiple touchpoints  
- ��� **Export Options** - PDF reports and CSV data export  
- ��� **Modern UI** - TailwindCSS with custom design system  
- ���️ **Redux State Management** - Complete state management solution  
- ��� **TypeScript** - Full type safety throughout  

## ���️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript  
- **State Management**: Redux Toolkit  
- **Styling**: TailwindCSS with custom design system  
- **Database**: Supabase (PostgreSQL) with real-time subscriptions  
- **Charts**: Chart.js with react-chartjs-2  
- **Forms**: React Hook Form with Zod validation  
- **PWA**: Next-PWA for offline support  
- **Export**: jsPDF and html2canvas for PDF generation  

## ��� Quick Start

### Prerequisites

- Node.js 18+ and npm  
- Supabase account (free tier works)  

### Installation

1. **Clone and install dependencies:**
\`\`\`bash
git clone https://github.com/KiriManii/uwazi.git
cd uwazi
npm install
\`\`\`

2. **Configure environment variables:**
\`\`\`bash
cp .env.example .env.local
# Update with your Supabase credentials
\`\`\`

3. **Start development server:**
\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see your polling platform!

## ��� Usage

### Creating Polls

- Click "Create Poll" or "Start Free Poll"  
- Enter poll title, description (optional), and options (2–6)  
- Provide email for results (lead generation)  
- Get instant shareable poll link  

### Voting

- Visit poll link (no login required)  
- Select your choice  
- See real-time results immediately  
- One vote per IP address  

### Results Dashboard

- Live updating charts (Bar/Pie toggle)  
- Real-time vote counts and percentages  
- Export to PDF (with email capture) or CSV  
- Share results link  

## ��� Assignment Compliance

✅ Required Technologies

- **React/Next.js** – Next.js 14 with App Router  
- **Redux Toolkit** – Complete state management  
- **TypeScript** – 100% TypeScript implementation  
- **Chart.js** – Dynamic bar and pie charts  
- **API Integration** – Supabase REST API + real-time  
- **Form Validation** – React Hook Form + Zod schemas  
- **Responsive Design** – Mobile-first TailwindCSS  
- **Real-time Updates** – WebSocket subscriptions  

## ��� Contributing

1. Fork the repository  
2. Create feature branch  
\`\`\`bash
git checkout -b feature/amazing-feature
\`\`\`  
3. Commit changes  
\`\`\`bash
git commit -m "Add amazing feature"
\`\`\`  
4. Push to branch  
\`\`\`bash
git push origin feature/amazing-feature
\`\`\`  
5. Open Pull Request  

## ���‍��� Author

**KiriManii (Lewis Kimani)**  
��� Email: lewis.kimani.dev@gmail.com  
��� GitHub: [@KiriManii](https://github.com/KiriManii)

> Built for African governance transformation with ❤️  

---

## ��� Development Status

- ✅ Project setup and dependencies  
- ✅ Database setup (Supabase)  
- ✅ Redux store configuration  
- ✅ Core components implementation  
- ✅ Real-time features  
- ✅ PWA configuration  
- ✅ Deployment setup  
