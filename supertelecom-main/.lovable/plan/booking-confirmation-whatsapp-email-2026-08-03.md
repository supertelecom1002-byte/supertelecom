# Booking Confirmation — WhatsApp + Email

Booking form abhi Google Sheet me row add karta hai. Ab uske baad confirmation bhejna hai.

## Phase 1 — Abhi banega (free, koi account nahi chahiye)

Form submit hone ke baad, Sheet me save hone par:

1. **Customer ke liye WhatsApp confirmation**
   - Success message ke saath ek bada button: "WhatsApp par confirmation lein"
   - Ye `wa.me/918002903643` chat kholta hai, message pehle se bhara hua:
     "Namaste Super Telecom, maine booking request bheji hai — Naam: X, Phone: Y, Model: Z, Service: S"
   - Customer bas Send dabata hai — turant aapke WhatsApp par request aa jaati hai aur customer ko bhi chat me record mil jaata hai.
   - Mobile par ye chat automatic khul jaayegi (naya tab), desktop par WhatsApp Web.

2. **Shop ko WhatsApp alert**
   - Wahi message aapke business number par hi jaata hai (upar wala step), plus success screen par "Hamare team ko bhi aapka request mil gaya hai" note.

3. **Screen par confirmation card**
   - Success ke baad booking summary card: reference time, naam, service, aur Call / WhatsApp / Email buttons.

## Phase 2 — Automatic message/email (isme aapki taraf se ek cheez chahiye)

Aapne "Nhi hai" bataya domain ke liye. Uske bina automatic email nahi ja sakti:

- **Email (customer + aapko dono):** Lovable Emails se bhejne ke liye apna domain chahiye (jaise `supertelecom.in`). Gmail address se app automatic email nahi bhej sakta — spam/deliverability ke kaaran Google isko block karta hai. Domain lene ke baad main 15 minute me set kar doonga: customer ko "Booking Confirmed" email aur aapko "Nayi Booking" alert email, dono Super Telecom branding me.
- **Automatic WhatsApp API message (bina customer ke tap kiye):** Iske liye Twilio ya WhatsApp Business API account + Meta business verification chahiye (paid, approval me kuch din lagte hain). Aap account bana lein to main connect kar doonga.

Phase 1 in dono ke bina bhi aaj se kaam karega.

## Technical details

- `src/lib/booking.functions.ts`: return me booking summary + timestamp bhi bhejna, taaki UI confirmation card bana sake. (Sheets append logic unchanged.)
- `src/routes/index.tsx` Contact component:
  - Success state me summary card + pre-filled `wa.me` link (message `encodeURIComponent` se).
  - Submit success par `window.open(waUrl, "_blank")` se WhatsApp chat auto-open (popup block hone par button fallback hamesha visible).
  - Existing UI/theme, validation, aur double-submit protection waise ke waise.
- Email ke liye baad me: Lovable Cloud + email domain, phir do templates (`booking-confirmation` customer ko, `booking-alert` owner ko) aur `sendTemplateEmail` call `submitBooking` handler ke andar.
