# Uwazi Testing Checklist

## Pre-Deployment Testing

### 1. Development Environment
- [ ] `npm run dev` starts without errors
- [ ] No console errors on homepage
- [ ] TailwindCSS styles loading correctly
- [ ] Redux DevTools working (if installed)

### 2. Homepage Testing
- [ ] Hero section displays correctly
- [ ] Sample polls load from database
- [ ] Poll cards are clickable
- [ ] Pricing section displays
- [ ] Footer newsletter works
- [ ] All links navigate correctly

### 3. Poll Creation
- [ ] Form validation works
  - [ ] Title: minimum 5 characters
  - [ ] Options: minimum 2, maximum 6
  - [ ] Email: valid format required
- [ ] Can add options (up to 6)
- [ ] Can remove options (minimum 2)
- [ ] Free tier tracking works (2 polls/week)
- [ ] Redirects to voting page after creation
- [ ] Email captured in database

### 4. Voting
- [ ] Poll displays with all options
- [ ] Can click option to vote
- [ ] Vote submits successfully
- [ ] Prevents double voting (localStorage)
- [ ] Prevents double voting (database)
- [ ] Redirects to results after vote
- [ ] Live counter updates

### 5. Results Dashboard
- [ ] Poll title and description display
- [ ] Vote counts accurate
- [ ] Percentages calculated correctly
- [ ] Progress bars render
- [ ] Charts display (Bar & Pie)
- [ ] Chart toggle works
- [ ] Live updates work
- [ ] PDF export button shows modal
- [ ] Email modal works
- [ ] CSV export downloads

### 6. Real-time Features
- [ ] Open poll in two browser windows
- [ ] Vote in one window
- [ ] Other window updates automatically
- [ ] Vote counter animates
- [ ] Chart updates in real-time

### 7. Responsive Design
- [ ] Test on mobile (375px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1440px)
- [ ] Navigation works on mobile
- [ ] Forms usable on mobile
- [ ] Charts responsive

### 8. PWA Features
- [ ] Manifest loads without errors
- [ ] Icons display (check browser devtools)
- [ ] Can install on mobile
- [ ] Works offline (basic functionality)

### 9. PWA Features
- [ ] Manifest loads without errors
- [ ] Icons display (check browser devtools)
- [ ] Can install on mobile
- [ ] Works offline (basic functionality)

### 10. Pricing Plan Integration
- [ ] Professional plan button opens contact modal
- [ ] Enterprise plan button opens contact modal
- [ ] Contact forms validate correctly
- [ ] Form submissions save to database
- [ ] Thank you message displays
- [ ] Email captured in subscribers table

### 11. Poll Deletion
- [ ] Delete button appears on PollCard (when showDelete=true)
- [ ] Confirmation dialog shows before deletion
- [ ] Poll deletes successfully
- [ ] Related data (options, votes) also deleted
- [ ] /my-polls page displays all polls
- [ ] Can delete polls from /my-polls page

### 12. Footer Links
- [ ] All footer links navigate correctly
- [ ] Features page shows coming soon
- [ ] API Docs page shows coming soon
- [ ] Help page shows coming soon
- [ ] Contact page form works
- [ ] Privacy page displays
- [ ] Terms page displays
- [ ] Newsletter signup works in footer
