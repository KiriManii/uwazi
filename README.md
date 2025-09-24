# Uwazi Polling Platform

A streamlined polling platform for African governance that converts anonymous users into leads while providing valuable insights. Built with Next.js, Redux, TypeScript, and Chart.js for 100% assignment compliance.

![Uwazi Platform](https://img.shields.io/badge/status-live-success) ![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.0-38bdf8)

**🌐 Live Demo:** [https://uwazi-polling.vercel.app](https://uwazi-polling.vercel.app)

---

## 🎯 Features

### Core Functionality
- 🗳️ **Anonymous Poll Creation & Voting** - No registration required
- 📊 **Dynamic Visualizations** - Chart.js with bar/pie toggle
- 🔄 **Real-time Updates** - Live vote counts via Supabase subscriptions
- 📱 **PWA Support** - Installable on mobile devices
- 📧 **Lead Generation** - Strategic email capture at multiple touchpoints
- 📄 **Export Capabilities** - PDF reports with email gate & CSV downloads
- 🗑️ **Poll Management** - Admin deletion with cascade cleanup
- 🎨 **Modern UI** - Custom TailwindCSS design system (blue/teal branding)

### Technical Features
- 🗃️ **Redux State Management** - Complete state management with typed hooks
- 🔒 **TypeScript** - Full type safety throughout application
- ⚡ **Free Tier Tracking** - 2 polls per week limit via localStorage
- 🌍 **IP-based Protection** - One vote per IP per poll
- 💼 **Contact Forms** - Professional/Enterprise plan inquiry system
- 🔗 **Complete Navigation** - All footer links functional (legal pages, contact, coming soon placeholders)

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.5.3 (App Router), React 18, TypeScript 5.3.3
- **State Management**: Redux Toolkit 2.0+
- **Styling**: TailwindCSS 3.4.0 with custom design system
- **Database**: Supabase (PostgreSQL) with real-time subscriptions & RPC functions
- **Charts**: Chart.js 4.4+ with react-chartjs-2
- **Forms**: React Hook Form with Zod validation
- **PWA**: Next-PWA for offline support
- **Export**: jsPDF and html2canvas for PDF generation

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Git for version control

### Installation

**1. Clone and install:**
```bash
git clone https://github.com/KiriManii/uwazi.git
cd uwazi
npm install
```

**2. Set up Supabase:**

Create a Supabase project at [supabase.com](https://supabase.com), then run this SQL in the SQL Editor:

```sql
-- Core tables
CREATE TABLE polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  creator_email TEXT,
  creator_ip INET,
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  total_votes INTEGER DEFAULT 0
);

CREATE TABLE poll_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  vote_count INTEGER DEFAULT 0,
  position INTEGER NOT NULL
);

CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE,
  ip_address INET NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(poll_id, ip_address)
);

CREATE TABLE email_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT,
  subscribed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE contact_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('professional', 'enterprise', 'general')),
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Public policies
CREATE POLICY "Public can view polls" ON polls FOR SELECT USING (true);
CREATE POLICY "Public can create polls" ON polls FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view options" ON poll_options FOR SELECT USING (true);
CREATE POLICY "Public can create options" ON poll_options FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can vote" ON votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can subscribe" ON email_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can submit inquiries" ON contact_inquiries FOR INSERT WITH CHECK (true);

-- Helper functions
CREATE OR REPLACE FUNCTION increment_vote_count(option_id UUID, poll_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE poll_options SET vote_count = vote_count + 1 WHERE id = option_id;
  UPDATE polls SET total_votes = total_votes + 1 WHERE id = poll_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delete_poll(poll_id UUID)
RETURNS void AS $$
BEGIN
  DELETE FROM votes WHERE votes.poll_id = delete_poll.poll_id;
  DELETE FROM poll_options WHERE poll_options.poll_id = delete_poll.poll_id;
  DELETE FROM polls WHERE id = delete_poll.poll_id;
END;
$$ LANGUAGE plpgsql;
```

**3. Configure environment:**
```bash
cp .env.example .env.local
```

Update `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**4. Start development:**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📱 Usage

### Creating Polls
1. Click "Create Poll" or "Start Free Poll"
2. Enter title (5-100 characters) and optional description
3. Add 2-6 options
4. Provide email for results (lead generation)
5. Receive shareable poll link instantly

**Limits:** Free tier = 2 polls/week (localStorage tracking)

### Voting
- One-click voting (no login)
- IP-based duplicate prevention
- Real-time results updates
- Automatic redirect to results page

### Results Dashboard
- Live updating percentages and vote counts
- Bar/Pie chart toggle
- Animated progress bars
- PDF export (email-gated)
- CSV export (instant download)

### Pricing Plans
- **Free**: 2 polls/week, 25 responses, basic features
- **Professional** ($79 one-time): Contact form inquiry system
- **Enterprise** ($45/user/month): Contact form inquiry system

---

## 🗂️ Project Structure

```
uwazi/
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout + Redux Provider
│   │   ├── page.tsx                 # Homepage with pricing
│   │   ├── create/page.tsx          # Poll creation
│   │   ├── poll/[id]/page.tsx       # Voting interface
│   │   ├── results/[id]/page.tsx    # Results with charts
│   │   ├── my-polls/page.tsx        # Poll management (admin)
│   │   ├── contact/page.tsx         # Contact form
│   │   ├── privacy/page.tsx         # Privacy policy
│   │   ├── terms/page.tsx           # Terms of service
│   │   ├── features/page.tsx        # Coming soon
│   │   ├── api-docs/page.tsx        # Coming soon
│   │   ├── help/page.tsx            # Coming soon
│   │   └── api/
│   │       ├── polls/
│   │       │   ├── route.ts         # GET all, POST create
│   │       │   └── [id]/route.ts    # GET one, DELETE
│   │       ├── votes/route.ts       # POST vote
│   │       ├── subscribe/route.ts   # POST email
│   │       └── contact/route.ts     # POST inquiry
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── polls/
│   │   │   ├── PollCard.tsx         # With delete option
│   │   │   └── VoteInterface.tsx
│   │   ├── charts/
│   │   │   ├── ResultsChart.tsx     # Chart.js wrapper
│   │   │   └── LiveCounter.tsx      # Animated counter
│   │   └── ui/
│   │       ├── ContactModal.tsx     # Plan inquiry
│   │       ├── ComingSoon.tsx       # Placeholder pages
│   │       └── Loading.tsx
│   ├── store/
│   │   ├── index.ts
│   │   ├── hooks.ts
│   │   └── slices/
│   │       ├── pollsSlice.ts
│   │       ├── votingSlice.ts
│   │       └── uiSlice.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── validation.ts
│   │   ├── tracking.ts
│   │   └── export.ts
│   └── types/index.ts
├── public/
│   ├── manifest.json
│   ├── icon-192.png                 # PWA icon
│   └── icon-512.png                 # PWA icon
├── .env.local
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 🎯 Assignment Compliance

### ✅ Required Technologies (100%)

- [x] **React/Next.js** - Next.js 15.5.3 with App Router
- [x] **Redux Toolkit** - Complete state management with typed hooks
- [x] **TypeScript** - 100% typed codebase
- [x] **Chart.js** - Dynamic bar/pie charts with toggle
- [x] **API Integration** - Supabase REST + real-time + RPC
- [x] **Form Validation** - React Hook Form + Zod schemas
- [x] **Responsive Design** - Mobile-first TailwindCSS
- [x] **Real-time Updates** - WebSocket subscriptions

### ✅ Core Features (100%)

- [x] Poll creation with validation
- [x] Anonymous voting system
- [x] Live results dashboard
- [x] Chart visualizations
- [x] Real-time data sync
- [x] Professional UI/UX
- [x] Error handling
- [x] Loading states

---

## 🗑️ Admin Operations

### Deleting Polls

**Option 1: Admin UI** (Recommended)
```
Visit /my-polls → Click Delete → Confirm
```

**Option 2: API Call**
```bash
curl -X DELETE "http://localhost:3000/api/polls/[poll-id]"
```

**Option 3: Direct SQL** (Emergency only)
```sql
BEGIN;
DELETE FROM votes WHERE option_id IN (SELECT id FROM poll_options WHERE poll_id = '[poll-id]');
DELETE FROM poll_options WHERE poll_id = '[poll-id]';
DELETE FROM polls WHERE id = '[poll-id]';
COMMIT;
```

**Verify deletion:**
```sql
SELECT COUNT(*) FROM polls WHERE id = '[poll-id]';
SELECT COUNT(*) FROM poll_options WHERE poll_id = '[poll-id]';
-- Both should return 0
```

**Note:** The `delete_poll` RPC function handles cascade deletion automatically. Always prefer the API route or admin UI over direct SQL.

---

## 🧪 Testing

### Pre-Build Checklist

**Development Environment:**
- [ ] `npm run dev` starts without errors
- [ ] No console errors on homepage
- [ ] TailwindCSS styles loading (blue/teal theme visible)
- [ ] Redux DevTools working (if installed)

**Core Features:**
- [ ] Poll creation form validates correctly
- [ ] Can add/remove options (2-6 limit enforced)
- [ ] Email validation works
- [ ] Free tier limit triggers after 2 polls/week
- [ ] Voting submits successfully
- [ ] IP-based duplicate prevention works
- [ ] Results display with accurate percentages
- [ ] Charts render (Bar & Pie modes)
- [ ] Chart toggle works smoothly

**Real-time Features:**
- [ ] Open poll in two browsers
- [ ] Vote in one → other updates automatically
- [ ] Live counter animates
- [ ] Results refresh within 1 second

**Export Features:**
- [ ] CSV downloads with correct data
- [ ] PDF export shows email modal
- [ ] Email captured in database
- [ ] PDF generates successfully

**Contact & Navigation:**
- [ ] Professional plan button opens modal
- [ ] Enterprise plan button opens modal
- [ ] Contact form submits to database
- [ ] All footer links navigate correctly
- [ ] Coming soon pages display with email capture

**Poll Management:**
- [ ] `/my-polls` page loads all polls
- [ ] Delete button appears on polls
- [ ] Confirmation dialog shows
- [ ] Poll deletes successfully
- [ ] Related data removed (verify in DB)

**Responsive Design:**
- [ ] Mobile (375px): Navigation, forms, charts work
- [ ] Tablet (768px): Layout adapts correctly
- [ ] Desktop (1440px): Full features visible

### Production Build Test

```bash
npm run build
npm run start
# Test all features in production mode
```

**Lighthouse Targets:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

---

## 🐛 Troubleshooting

### Issue: Styling Not Appearing

**Symptoms:** Plain black text, no colors or TailwindCSS effects

**Cause:** TailwindCSS v4 incompatibility (project requires v3)

**Solution:**
```bash
# Check version
npm list tailwindcss

# If v4.x, downgrade to v3
npm uninstall tailwindcss @tailwindcss/postcss @tailwindcss/node
npm install -D tailwindcss@^3.4.0 postcss@^8.4.0 autoprefixer@^10.4.0
npx tailwindcss init -p

# Verify globals.css has @tailwind directives (not @import)
# Clear cache and restart
rm -rf .next
npm run dev
```

### Issue: UTF-8 Encoding Error (Windows)

**Symptoms:** "stream did not contain valid UTF-8"

**Affected Files:** Usually files created via Git Bash heredoc

**Solution:**
```bash
# Delete corrupted file
rm [file-path]

# Recreate in VS Code (not Git Bash)
# Save with UTF-8 encoding (VS Code default)
# Avoid special characters/emojis in code
```

**Prevention:** Always create new files in VS Code on Windows

### Issue: 404 on Poll Pages

**Symptoms:** Clicking polls leads to 404

**Cause:** Missing `page.tsx` in dynamic routes

**Solution:**
```bash
# Verify these files exist:
ls src/app/poll/[id]/page.tsx
ls src/app/results/[id]/page.tsx

# If missing, recreate from backup or git history
```

### Issue: "Cannot read properties of undefined"

**Symptoms:** Error accessing `poll.options.length`

**Cause:** Supabase returns `poll_options` but code expects `options`

**Solution:** Already fixed in `pollsSlice.ts` with data transformation:
```typescript
const transformedData = data?.map((poll) => ({
  ...poll,
  options: poll.poll_options || [],
}));
```

### Issue: Supabase Connection Errors

**Checklist:**
1. Verify `.env.local` has correct credentials
2. Check Supabase project is active (not paused)
3. Confirm RLS policies are configured
4. Check browser console for specific errors
5. Test API routes with curl:
```bash
curl http://localhost:3000/api/polls
```

### Issue: TypeScript/ESLint Errors

**Common fixes:**
- Remove `(error as any)` → use proper type interfaces
- Fix Supabase query methods (`.catch()` doesn't exist, use error handling)
- Remove unused variables
- Add proper type definitions for API responses

### Issue: Chart.js Not Displaying

**Checklist:**
1. Verify Chart.js is registered in component
2. Check data structure matches `Poll` interface
3. Ensure container has height (e.g., `h-[400px]`)
4. Check browser console for Chart.js errors

---

## 📊 Development Status

### Phase 1: Setup ✅ COMPLETE
- [x] Project initialization
- [x] Dependencies installed
- [x] Git repository configured
- [x] Environment variables

### Phase 2: Infrastructure ✅ COMPLETE
- [x] Database schema with RPC functions
- [x] Redux store with 3 slices
- [x] TypeScript interfaces
- [x] Utility functions
- [x] TailwindCSS design system

### Phase 3: Core Features ✅ COMPLETE
- [x] Layout components
- [x] Homepage with pricing
- [x] Poll creation workflow
- [x] Voting interface
- [x] Results dashboard
- [x] API routes
- [x] Lead generation

### Phase 4: Advanced Features ✅ COMPLETE
- [x] Chart.js integration (bar/pie toggle)
- [x] PDF export with email gate
- [x] CSV export
- [x] Enhanced real-time features
- [x] LiveCounter animations
- [x] Poll deletion system
- [x] Contact forms (Professional/Enterprise)
- [x] Footer pages (Privacy, Terms, Contact, Coming Soon)
- [x] PWA configuration

### Phase 5: Production ✅ COMPLETE
- [x] PWA icons created
- [x] Production build successful
- [x] Deployed to Vercel
- [x] Live at https://uwazi-polling.vercel.app
- [ ] Custom domain (optional)
- [ ] Analytics integration
- [ ] Monitoring setup

**Current Status: 🟢 LIVE IN PRODUCTION**

---

## 🚀 Deployment

### Live Production Instance

**URL:** [https://uwazi-polling.vercel.app](https://uwazi-polling.vercel.app)  
**Status:** ✅ Live and operational  
**Platform:** Vercel  
**Last Updated:** September 24, 2025

### Deployment Configuration

**Environment Variables (Vercel Dashboard):**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_APP_URL` - Production URL (https://uwazi-polling.vercel.app)

**Build Settings:**
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Node Version: 18.x

### Known Deployment Issues & Solutions

**Issue:** "Environment variable references secret that does not exist"  
**Solution:** Remove `env` section from `vercel.json` - use dashboard environment variables only

**Issue:** Build fails with TypeScript errors  
**Solution:** Run `npx tsc --noEmit` locally before deploying to catch errors early

**Issue:** Charts not displaying in production  
**Solution:** Separate animation options for Bar vs Pie charts (already fixed)

### Redeployment

To trigger a new deployment:
1. Push changes to `main` branch
2. Vercel automatically deploys
3. Or manually redeploy from Vercel dashboard → Deployments → Redeploy

---

## ⚠️ Known Issues & Future Enhancements

### Known Issues
1. **PWA Offline Behavior** - Needs comprehensive offline fallback strategy
2. **Email Service** - Using placeholder, needs SMTP integration for production
3. **No Authentication** - Poll deletion endpoint needs admin auth before public use
4. **Rate Limiting** - No abuse protection for voting yet
5. **No Analytics** - Consider adding tracking (Vercel Analytics, PostHog)

### Future Enhancements
- [ ] User authentication system
- [ ] Poll scheduling (publish date/time)
- [ ] Poll templates
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Email notifications for poll creators
- [ ] Automated testing suite (E2E with Playwright)
- [ ] Audit logs for admin actions
- [ ] Soft delete with restoration capability
- [ ] AI-powered insights (using Hugging Face API)

---

## 🗄️ Database Schema Summary

**Tables:**
- `polls` - Main poll data with creator tracking
- `poll_options` - Poll choices linked to polls
- `votes` - Anonymous votes with IP tracking and unique constraint
- `email_subscribers` - Lead generation with source tracking
- `contact_inquiries` - Plan inquiry system (Professional/Enterprise)

**RPC Functions:**
- `increment_vote_count` - Atomic vote counting
- `delete_poll` - Cascade deletion (votes → options → poll)

**Security:**
- Row Level Security (RLS) enabled on all tables
- Public policies for anonymous access
- IP-based duplicate prevention
- Input validation with Zod schemas

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

**Guidelines:**
- Follow TypeScript strict mode
- Use conventional commit messages
- Maintain TailwindCSS design system
- Test all features before committing
- Update README for new features

---

## 📚 Documentation

- **Main README:** This file
- **Setup Guide:** `SUPABASE_SETUP.md` - Complete database setup instructions
- **Testing:** `TESTING.md` - Comprehensive testing checklist

---

## 🔒 Security

- Row Level Security (RLS) on all Supabase tables
- Anonymous voting with IP tracking
- Environment variables for sensitive data
- Input validation with Zod schemas
- SQL injection protection via Supabase
- XSS protection via React
- CORS configured correctly

**Security Recommendations:**
- Enable authentication before making deletion endpoints public
- Add rate limiting for API routes
- Implement CSRF protection
- Set up logging and monitoring
- Regular security audits
- Keep dependencies updated

---

## 📞 Support & Contact

**Developer:** KiriManii (Lewis Kimani)  
**Email:** lewis.kimani.dev@gmail.com  
**GitHub:** [@KiriManii](https://github.com/KiriManii)  
**Repository:** https://github.com/KiriManii/uwazi

For issues and feature requests, open an issue on GitHub.

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built for African governance transformation
- Powered by Supabase and Next.js
- Styled with TailwindCSS
- State managed with Redux Toolkit
- Charts visualized with Chart.js

---

## 🎉 Quick Start Summary

```bash
# Complete setup in 5 steps:
git clone https://github.com/KiriManii/uwazi.git
cd uwazi
npm install
# Set up Supabase database (see SQL above)
# Update .env.local with credentials
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000) and start polling!

---

**Built with ❤️ for African governance transformation**  
**Live Demo:** [https://uwazi-polling.vercel.app](https://uwazi-polling.vercel.app)  
**Last Updated:** September 24, 2025  
**Version:** 1.0.0  
**Status:** 🟢 Live in Production