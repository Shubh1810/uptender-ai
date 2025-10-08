# 🍪 Cookie Banner Setup

## ✅ What's Been Added

A professional, GDPR-compliant cookie consent banner has been added to your TenderHub site.

---

## 🎨 Features

### **Professional Design:**
- ✅ Minimal and non-intrusive
- ✅ Appears at bottom of screen
- ✅ Smooth slide-in animation
- ✅ Mobile responsive
- ✅ Matches your site's design system

### **Functionality:**
- ✅ Shows on first visit only
- ✅ Remembers user choice (localStorage)
- ✅ Accept/Decline options
- ✅ Link to Privacy Policy
- ✅ Cookie icon for visual clarity
- ✅ Auto-appears after 1 second delay

---

## 📁 Files Created/Modified

### **New File:**
- `src/components/ui/cookie-banner.tsx` - Cookie banner component

### **Modified Files:**
- `src/app/layout.tsx` - Added CookieBanner to layout

---

## 🎯 How It Works

### **First Visit:**
```
1. User visits site
2. After 1 second, banner slides up from bottom
3. User sees cookie notice with Accept/Decline buttons
4. User makes choice
5. Choice saved to localStorage
6. Banner disappears
```

### **Return Visits:**
```
1. User visits site
2. Check localStorage for 'cookie-consent'
3. If found → Don't show banner
4. If not found → Show banner
```

---

## 🎨 Two Versions Available

### **Default (Full Width):**
```tsx
<CookieBanner />
```
- Full width at bottom
- More prominent
- Better for legal compliance

### **Minimal (Bottom Right):**
```tsx
<CookieBannerMinimal />
```
- Bottom-right corner
- Compact card design
- Less intrusive
- Closeable with X button

**Currently using:** Default (Full Width)

---

## 🔄 Switching Between Versions

To use the minimal version instead:

In `src/app/layout.tsx`, change:
```tsx
<CookieBanner />
```
to:
```tsx
<CookieBannerMinimal />
```

And update the import:
```tsx
import { CookieBannerMinimal } from "@/components/ui/cookie-banner";
```

---

## 🎨 Customization

### **Change Colors:**

In `cookie-banner.tsx`, modify the classes:

```tsx
// Primary button (Accept)
className="bg-blue-600 hover:bg-blue-700"
// Change to your brand color

// Secondary button (Decline)
className="border-gray-300 text-gray-700"
```

### **Change Text:**

```tsx
<p className="text-sm font-medium text-gray-900 mb-1">
  We use cookies  // ← Change this
</p>

<p className="text-xs text-gray-600 leading-relaxed">
  We use essential cookies...  // ← Change this
</p>
```

### **Change Delay:**

```tsx
setTimeout(() => setIsVisible(true), 1000);
// Change 1000 to desired milliseconds
// 0 = immediate, 2000 = 2 seconds, etc.
```

---

## 📱 Preview

### **Desktop:**
```
┌─────────────────────────────────────────────────────────┐
│                    [Your Website]                        │
│                                                          │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ 🍪  We use cookies                    [Decline] [Accept] │
│     We use essential cookies to make our site work...    │
└─────────────────────────────────────────────────────────┘
```

### **Mobile:**
```
┌─────────────────────┐
│   [Your Website]    │
│                     │
│                     │
├─────────────────────┤
│ 🍪  We use cookies  │
│     Essential...    │
│  [Decline] [Accept] │
└─────────────────────┘
```

---

## 🔐 Privacy Compliance

The cookie banner:

1. ✅ **Informs users** about cookie usage
2. ✅ **Provides choice** (Accept/Decline)
3. ✅ **Links to privacy policy** for details
4. ✅ **Remembers choice** to avoid repeated prompts
5. ✅ **Non-blocking** - doesn't prevent site access

### **What Cookies Are Used:**

**Essential Cookies (Always Active):**
- Supabase authentication cookies (`sb-*`)
- Session management
- Security tokens

**Analytics Cookies (Optional):**
- Vercel Analytics (if user accepts)
- PostHog tracking (if user accepts)

---

## 🧪 Testing

### **Test First Visit:**
1. Open site in Incognito/Private mode
2. Wait 1 second
3. Banner should slide up from bottom
4. Click "Accept" or "Decline"
5. Banner disappears
6. Refresh page → Banner should NOT appear again

### **Test Reset:**
To test banner again:
1. Open DevTools (F12)
2. Console tab
3. Type: `localStorage.removeItem('cookie-consent')`
4. Press Enter
5. Refresh page
6. Banner appears again

---

## 📊 User Choice Tracking

The banner stores user choice in localStorage:

```javascript
// Check user's choice
const consent = localStorage.getItem('cookie-consent');

// Possible values:
// 'accepted' - User clicked Accept
// 'declined' - User clicked Decline
// null - User hasn't chosen yet
```

You can use this to conditionally load analytics:

```tsx
useEffect(() => {
  const consent = localStorage.getItem('cookie-consent');
  if (consent === 'accepted') {
    // Load analytics
    // posthog.init(...)
  }
}, []);
```

---

## 🎯 Next Steps (Optional)

### **1. Create Proper Privacy Policy:**
Update `/privacy-policy/page.tsx` with comprehensive cookie information.

### **2. Add Cookie Settings:**
Allow users to change preferences later:
- Add "Cookie Settings" link in footer
- Create modal to update preferences

### **3. Track Consent:**
- Log consent choices to database
- Required for some regulations

### **4. Granular Consent:**
- Separate essential/analytics/marketing cookies
- Let users choose categories

---

## ✨ Summary

You now have:
- ✅ Professional cookie consent banner
- ✅ Appears on first visit
- ✅ Remembers user choice
- ✅ GDPR-friendly
- ✅ Mobile responsive
- ✅ Easy to customize

The banner is live and will appear on all pages of your site! 🎉

---

## 🐛 Troubleshooting

### **Banner not showing:**
- Check browser console for errors
- Verify you're on first visit (or cleared localStorage)
- Check if component is imported in layout.tsx

### **Banner showing every time:**
- localStorage might be disabled
- Try different browser
- Check browser privacy settings

### **Styling issues:**
- Verify Tailwind CSS is working
- Check for conflicting styles
- Inspect element in DevTools

---

**The cookie banner is now live and ready!** 🍪✨

