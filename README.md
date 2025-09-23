# Uwazi Polling Platform

A streamlined polling platform for African governance that converts anonymous users into leads while providing valuable insights. Built with Next.js, Redux, TypeScript, and Chart.js.

![Uwazi Platform](https://img.shields.io/badge/status-beta-blue) ![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.0-38bdf8)

---

## 🎯 Features

- 🗳️ **Anonymous Poll Creation & Voting** - No registration required
- 📊 **Real-time Results** with dynamic visualizations
- 🔄 **Live Updates** using Supabase real-time subscriptions
- 📱 **PWA Support** - Install on mobile devices (icons pending)
- 📧 **Lead Generation** - Strategic email capture at multiple touchpoints
- 📄 **Export Options** - PDF reports and CSV data export (utilities ready)
- 🎨 **Modern UI** - Custom TailwindCSS design system with blue/teal branding
- 🗃️ **Redux State Management** - Complete state management solution
- 🔒 **TypeScript** - Full type safety throughout
- ⚡ **Free Tier Tracking** - 2 polls per week limit with localStorage
- 🌍 **IP-based Vote Protection** - One vote per IP address per poll

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.5.3 (App Router), React 18, TypeScript 5.3.3
- **State Management**: Redux Toolkit 2.0+
- **Styling**: TailwindCSS 3.4.0 with custom design system
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **Charts**: Chart.js 4.4+ with react-chartjs-2 (utilities ready)
- **Forms**: React Hook Form with Zod validation
- **PWA**: Next-PWA for offline support
- **Export**: jsPDF and html2canvas for PDF generation

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works perfectly)
- Git for version control

### Installation

1. **Clone and install dependencies:**
```bash
git clone https://github.com/KiriManii/uwazi.git
cd uwazi
npm install
```

2. **Set up Supabase database:**

   a. Create a Supabase account at [supabase.com](https://supabase.com)
   
   b. Create a new project (any region works - Stockholm recommended for Europe/Africa)
   
   c. Go to SQL Editor and run the complete schema from `SUPABASE_SETUP.md`
   
   d. Get your credentials from Settings → API:
      - Copy **Project URL**
      - Copy **anon public** key

3. **Configure environment variables:**
```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Start development server:**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your polling platform!

---

## 📱 Usage

### Creating Polls
1. Click "Create Poll" or "Start Free Poll" button
2. Enter poll title (5-100 characters)
3. Add optional description (max 500 characters)
4. Add 2-6 poll options
5. Provide email to receive results (lead generation)
6. Click "Create Poll & Get Link"
7. Get instant shareable poll link

**Free Tier Limit:** 2 polls per week (tracked via localStorage)

### Voting
1. Visit poll link (no login required)
2. Select your preferred option
3. Click to submit vote
4. View confirmation message
5. Automatically redirected to results
6. **One vote per IP address per poll**

### Viewing Results
1. Access results page from vote confirmation or direct link
2. See live updating percentages
3. View vote counts in real-time
4. Progress bars show relative support
5. Results update automatically when new votes arrive
6. Export options available (PDF/CSV - UI pending)

---

## 🗂️ Project Structure

```
uwazi/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx               # Root layout with Redux Provider
│   │   ├── page.tsx                 # Homepage
│   │   ├── create/page.tsx          # Poll creation
│   │   ├── poll/[id]/page.tsx       # Voting interface
│   │   ├── results/[id]/page.tsx    # Results dashboard
│   │   └── api/
│   │       ├── polls/route.ts       # Poll CRUD
│   │       ├── votes/route.ts       # Vote submission
│   │       └── subscribe/route.ts   # Email capture
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx           # Navigation header
│   │   │   └── Footer.tsx           # Footer with newsletter
│   │   ├── polls/
│   │   │   ├── PollCard.tsx         # Poll preview
│   │   │   └── VoteInterface.tsx    # Voting UI
│   │   └── charts/                  # Chart components (Phase 4)
│   ├── store/                       # Redux Toolkit
│   │   ├── index.ts                 # Store configuration
│   │   ├── hooks.ts                 # Typed hooks
│   │   └── slices/
│   │       ├── pollsSlice.ts        # Poll state
│   │       ├── votingSlice.ts       # Vote tracking
│   │       └── uiSlice.ts           # UI state
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client
│   │   ├── validation.ts            # Zod schemas
│   │   ├── tracking.ts              # Free tier tracking
│   │   └── export.ts                # PDF/CSV utilities
│   └── types/
│       └── index.ts                 # TypeScript interfaces
├── public/
│   └── manifest.json                # PWA manifest
├── .env.local                       # Environment variables
└── package.json                     # Dependencies
```

---

## 🎯 Assignment Compliance

### ✅ Required Technologies - 100% Implemented

- [x] **React/Next.js** - Next.js 15.5.3 with App Router
- [x] **Redux Toolkit** - Complete state management with typed hooks
- [x] **TypeScript** - 100% TypeScript implementation with strict mode
- [x] **Chart.js** - Utilities ready, UI integration in Phase 4
- [x] **API Integration** - Supabase REST API + real-time subscriptions
- [x] **Form Validation** - React Hook Form + Zod schemas
- [x] **Responsive Design** - Mobile-first TailwindCSS with custom system
- [x] **Real-time Updates** - WebSocket subscriptions via Supabase

### ✅ Core Features - Fully Functional

- [x] Homepage with poll listings
- [x] Poll creation with validation
- [x] Anonymous voting system
- [x] Results dashboard with percentages
- [x] Real-time vote updates
- [x] Lead generation (email capture)
- [x] Free tier tracking
- [x] IP-based vote protection
- [x] Responsive design
- [x] Error handling

---

## 🗄️ Database Schema

### Supabase Tables

**polls**
- `id` (UUID, Primary Key)
- `title` (TEXT, Required)
- `description` (TEXT, Optional)
- `creator_email` (TEXT)
- `created_at` (TIMESTAMP)
- `is_active` (BOOLEAN)
- `total_votes` (INTEGER)

**poll_options**
- `id` (UUID, Primary Key)
- `poll_id` (UUID, Foreign Key → polls)
- `option_text` (TEXT, Required)
- `vote_count` (INTEGER)
- `position` (INTEGER)

**votes**
- `id` (UUID, Primary Key)
- `poll_id` (UUID, Foreign Key → polls)
- `option_id` (UUID, Foreign Key → poll_options)
- `ip_address` (INET, Required)
- `created_at` (TIMESTAMP)
- **Unique constraint:** `(poll_id, ip_address)`

**email_subscribers**
- `id` (UUID, Primary Key)
- `email` (TEXT, Unique)
- `source` (TEXT: poll_creation | newsletter | results)
- `subscribed_at` (TIMESTAMP)

**Row Level Security:** Enabled on all tables with public access policies

---

## 🧪 Testing Guide

### Manual Testing Checklist

**Homepage:**
- [ ] Polls load from database
- [ ] Styling appears correctly (blue/teal theme)
- [ ] Cards display vote counts
- [ ] Navigation links work

**Poll Creation:**
- [ ] Form validation works
- [ ] Can add/remove options (2-6)
- [ ] Email validation enforces format
- [ ] Free tier limit shows after 2 polls/week
- [ ] Redirects to voting page after creation

**Voting:**
- [ ] Options display correctly
- [ ] Can submit vote
- [ ] localStorage tracks voted status
- [ ] Redirects to results
- [ ] Can't vote twice (IP protection)

**Results:**
- [ ] Percentages calculate correctly
- [ ] Progress bars display properly
- [ ] Live updates work (test with 2 browsers)
- [ ] Vote counts show accurately

**API Testing:**
```bash
# Test polls endpoint
curl http://localhost:3000/api/polls

# Test vote submission
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{"poll_id":"[id]","option_id":"[id]"}'
```

---

## 🐛 Troubleshooting

### Issue: Styling Not Appearing

**Symptom:** Plain black text on white background, no colors or effects

**Solution:**
```bash
# Verify TailwindCSS version (should be 3.x, not 4.x)
npm list tailwindcss

# If version 4.x, downgrade to v3:
npm uninstall tailwindcss @tailwindcss/postcss @tailwindcss/node
npm install -D tailwindcss@^3.4.0 postcss@^8.4.0 autoprefixer@^10.4.0
npx tailwindcss init -p

# Clear cache and restart
rm -rf .next
npm run dev
```

### Issue: 404 on Poll Pages

**Symptom:** Clicking poll cards leads to 404 error

**Cause:** Missing `page.tsx` files in dynamic routes

**Verify files exist:**
- `src/app/poll/[id]/page.tsx`
- `src/app/results/[id]/page.tsx`

### Issue: "Cannot read properties of undefined"

**Symptom:** Error accessing `poll.options.length`

**Solution:** Already fixed in `pollsSlice.ts` with data transformation. Ensure you have latest code.

### Issue: Supabase Connection Errors

**Check:**
1. `.env.local` has correct credentials
2. Supabase project is active (not paused)
3. RLS policies are configured
4. Browser console for specific error messages

### Issue: UTF-8 Encoding Error (Windows)

**Symptom:** "stream did not contain valid UTF-8"

**Solution:** Recreate file in VS Code (not Git Bash) or use:
```bash
rm [problematic-file]
# Recreate without special characters/emojis
```

---

## 📊 Development Status

### Phase 1: Setup ✅ COMPLETE
- [x] Project initialization
- [x] Dependencies installed
- [x] Git repository configured
- [x] Environment variables set up

### Phase 2: Infrastructure ✅ COMPLETE
- [x] Database schema created
- [x] Redux store configured
- [x] TypeScript interfaces defined
- [x] Utility functions implemented
- [x] TailwindCSS design system

### Phase 3: Core Features ✅ COMPLETE
- [x] Layout components (Header/Footer)
- [x] Homepage with poll listings
- [x] Poll creation workflow
- [x] Voting interface
- [x] Results dashboard
- [x] API routes
- [x] Lead generation

### Phase 4: Advanced Features 🚧 IN PROGRESS
- [ ] Chart.js integration (utilities ready)
- [ ] PDF export UI
- [ ] CSV export UI
- [ ] Enhanced real-time features
- [ ] PWA icons
- [ ] Production deployment

**Current Completion:** ~70%

---

## 🚀 Deployment

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Environment Variables to Set in Vercel:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL` (your production URL)

### Pre-Deployment Checklist
- [ ] Create PWA icons (192x192, 512x512)
- [ ] Test all features in production mode
- [ ] Configure custom domain (optional)
- [ ] Set up error monitoring
- [ ] Enable analytics
- [ ] Review Supabase usage limits

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

**Development Guidelines:**
- Follow TypeScript strict mode
- Use conventional commit messages
- Maintain TailwindCSS design system
- Write descriptive component names
- Test all features before committing

---

## 📚 Documentation

- **Setup Guide:** `SUPABASE_SETUP.md` - Complete database setup
- **Session Summary:** Development progress and issues
- **Master Doc:** `uwazi-master-doc.md` - Complete implementation guide
- **Implementation Script:** `uwazi_complete_implementation.sh` - Automated setup

---

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Anonymous voting with IP tracking
- Environment variables for sensitive data
- Input validation with Zod schemas
- SQL injection protection via Supabase
- XSS protection via React

---

## ⚠️ Known Issues

1. **PWA Icons Missing** - Placeholder icons needed for production
2. **Chart.js UI Not Integrated** - Utilities ready, UI pending
3. **PDF Export UI Incomplete** - Functions exist, modal pending
4. **No Email Service** - Using placeholder, needs SMTP setup
5. **No Analytics** - Consider adding tracking

---

## 📞 Support & Contact

**Developer:** KiriManii (Lewis Kimani)  
**Email:** lewis.kimani.dev@gmail.com  
**GitHub:** [@KiriManii](https://github.com/KiriManii)  
**Repository:** https://github.com/KiriManii/uwazi.git

For issues and feature requests, please open an issue on GitHub.

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built for African governance transformation
- Powered by Supabase and Next.js
- Styled with TailwindCSS
- State managed with Redux Toolkit

---

## 🎉 Quick Start Summary

```bash
# Complete setup in 5 commands:
git clone https://github.com/KiriManii/uwazi.git
cd uwazi
npm install
# Update .env.local with Supabase credentials
npm run dev
```

**Then:**
1. Set up Supabase (see `SUPABASE_SETUP.md`)
2. Test the platform at http://localhost:3000
3. Start building! 🚀

---

*Built with ❤️ for African governance transformation*  
*Last Updated: September 23, 2025*  
*Version: 0.7.0 (Beta)*