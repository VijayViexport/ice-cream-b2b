# 🧪 Testing Guide - B2B Ice Cream Wholesale Platform

## 🌐 Application URLs

### Local Development URLs
- **Frontend (User Interface)**: http://localhost:3000
- **Backend (API Server)**: http://localhost:5000
- **Your Network**: http://192.168.1.153:3000

### Testing from Different Devices

#### Same Computer
- Use: `http://localhost:3000`

#### Other Devices on Same Network (Mobile, Tablet, Other PC)
- Use: `http://192.168.1.153:3000`
- Make sure devices are connected to the same WiFi network

---

## 👥 Test Accounts

### Admin Account
```
Email: admin@icewarehouse.com
Password: admin123
Role: ADMIN
Access: Full system access, order management, user approval
```

### Buyer Account (Approved)
```
Email: buyer@example.com
Password: buyer123
Role: BUYER
Status: APPROVED
Access: Can browse products, add to cart, place orders
```

### Buyer Account (Pending - for testing approval flow)
You'll need to register a new account to test the approval workflow

---

## 🧪 Testing Scenarios

### 1️⃣ User Registration & Approval Flow

**Test Steps:**
1. Open: http://localhost:3000/register
2. Fill in registration form:
   - Business Name: "Test Ice Cream Shop"
   - Contact Person: "John Doe"
   - Email: "testbuyer@example.com"
   - Phone: "1234567890"
   - Password: "test123"
   - Business Address: "123 Test Street, City"
3. Submit registration
4. Expected: User created with PENDING status
5. Login as Admin (admin@icewarehouse.com)
6. Go to: http://localhost:3000/admin/users
7. Approve the new buyer
8. Expected: Buyer can now place orders

---

### 2️⃣ Product Browsing (Enhanced UI)

**Test Steps:**
1. Login as approved buyer
2. Go to: http://localhost:3000/products
3. **Test Enhanced Product Cards:**
   - Hover over product cards (should see lift animation)
   - Check animated background orbs (blob animations)
   - Verify badges: Featured, Stock Status, Category
   - Check SKU visibility
   - Hover to see volume pricing expand
   - Verify stock indicator with progress bar
   - Check "Add to Cart" button alignment (all buttons at same height)
4. **Test Filters:**
   - Use search bar
   - Filter by category
   - Sort by price, name
5. **Test Responsive Design:**
   - Resize browser window
   - Test on mobile device (http://192.168.1.153:3000)

---

### 3️⃣ Shopping Cart & Checkout

**Test Steps:**
1. Login as approved buyer
2. Add products to cart
3. Go to: http://localhost:3000/cart
4. **Test Cart Functions:**
   - Update quantities
   - Remove items
   - View price calculations
5. Click "Proceed to Checkout"
6. Fill shipping address:
   ```
   Full Name: John Doe
   Phone: 1234567890
   Street Address: 123 Ice Cream Lane
   City: New York
   State: NY
   Zip: 10001
   ```
7. Select payment method: "Offline Bank Transfer"
8. Place order
9. Expected: Order created with PENDING_PAYMENT status

---

### 4️⃣ Real-Time Notifications (Critical Test)

**Setup:**
1. Open TWO browser windows/tabs:
   - **Window 1**: Admin logged in (http://localhost:3000)
   - **Window 2**: Buyer logged in (http://localhost:3000)

**Test Scenario A - New Order Notification:**
1. In **Buyer window**: Place a new order
2. In **Admin window**: Watch notification bell icon
3. **Expected Results:**
   - Notification badge shows red dot with count
   - Click bell to see "New order from [Business Name]"
   - Notification appears in real-time (within 1 second)

**Test Scenario B - Payment Proof Notification:**
1. Buyer uploads payment proof for order
2. Admin should receive real-time notification
3. Admin can view payment proof

**Verification:**
- Check browser console (F12) for WebSocket connection: `Socket connected: socket_id`
- No errors in console

---

### 5️⃣ Order Management (Admin Side)

**Test Steps:**
1. Login as admin
2. Go to: http://localhost:3000/admin/orders
3. **Test Order Actions:**
   - View order details
   - Check payment proof (if uploaded)
   - Update order status to CONFIRMED
   - Update payment status to PAID
   - Mark as SHIPPED
   - Mark as DELIVERED
4. **Test Notifications:**
   - Each status change should notify the buyer
   - Verify real-time notification delivery

---

### 6️⃣ Payment Proof Upload

**Test Steps:**
1. Login as buyer
2. Go to: http://localhost:3000/orders
3. Click "Upload Payment Proof" on a pending order
4. Select an image file (JPG, PNG)
5. Upload
6. **Expected:**
   - Success message displayed
   - Admin receives notification
   - Payment proof visible in admin panel

---

### 7️⃣ Product Management (Admin)

**Test Steps:**
1. Login as admin
2. Go to: http://localhost:3000/admin/products
3. **Test CRUD Operations:**
   - Create new product
   - Upload product images
   - Set tiered pricing (bulk discounts)
   - Edit existing product
   - Toggle active/inactive status
   - Delete product (soft delete)

---

### 8️⃣ Mobile Responsiveness Testing

**Test on Mobile Device:**
1. Connect mobile to same WiFi
2. Open: http://192.168.1.153:3000
3. **Test Features:**
   - Navigation menu (hamburger)
   - Product cards (touch interactions)
   - Cart functionality
   - Checkout form
   - Notification bell
   - Image viewing

**Expected:**
- Touch-friendly buttons (48px minimum)
- Readable text without zooming
- Proper grid layout (1-2 columns on mobile)
- Smooth animations

---

## 🔍 Visual Testing Checklist

### Enhanced Product Card Features ✅
- [ ] Glassmorphism effects visible
- [ ] Background orbs animating (blob animation)
- [ ] Card lifts on hover (translateY + scale)
- [ ] Image zooms on hover
- [ ] Featured badge with sparkle icon
- [ ] Stock status badge (color-coded)
- [ ] SKU displayed clearly
- [ ] Volume pricing section expands on hover
- [ ] Stock progress bar with shimmer effect
- [ ] "Add to Cart" buttons aligned at same height
- [ ] Trust signals visible (Quality Assured, Fast Delivery)
- [ ] Corner accent appears on hover
- [ ] Button shine animation on hover

### Notification System ✅
- [ ] Bell icon shows red dot when unread notifications exist
- [ ] Badge count updates in real-time
- [ ] Notification dropdown opens smoothly
- [ ] Notifications marked as read on click
- [ ] "View All" link works
- [ ] Auto-refresh on new notification

---

## 🐛 Common Issues & Solutions

### Issue 1: Cannot Access from Mobile
**Problem**: http://192.168.1.153:3000 not loading on mobile
**Solution:**
- Ensure mobile is on same WiFi network
- Check Windows Firewall (allow port 3000)
- Run: `netstat -ano | findstr :3000` to verify server listening

### Issue 2: Notifications Not Working
**Problem**: Admin not receiving notifications
**Solution:**
1. Check browser console for WebSocket errors
2. Verify backend running on port 5000
3. Check Socket.io connection in Network tab (WS protocol)
4. Refresh both admin and buyer pages

### Issue 3: Product Cards Not Aligned
**Problem**: "Add to Cart" buttons at different heights
**Solution:** Already fixed! All cards use flexbox with `flex-grow` and `mt-auto`

### Issue 4: Images Not Loading
**Problem**: Product images show broken icon
**Solution:**
- Check if images exist in `backend/uploads/products/`
- Verify URL: http://localhost:5000/uploads/products/[filename]
- Check CORS settings in backend

---

## 📊 Performance Testing

### Load Testing
1. Open multiple browser tabs (10+)
2. Login with different accounts
3. Browse products simultaneously
4. Check for:
   - Memory leaks
   - Slow animations
   - API response times

### Animation Performance
1. Open Chrome DevTools
2. Go to Performance tab
3. Record while interacting with product cards
4. Check FPS (should be 60fps)
5. Look for layout thrashing

---

## 🌐 Sharing with External Testers

### Option 1: Same Local Network
**URL**: `http://192.168.1.153:3000`
- Share with people on same WiFi
- Works for office/home testing

### Option 2: Expose to Internet (Ngrok)
```bash
# Install ngrok
npm install -g ngrok

# Expose frontend
ngrok http 3000

# Expose backend (in another terminal)
ngrok http 5000
```

**Note**: Update `REACT_APP_API_URL` in frontend `.env` to use ngrok URL

### Option 3: Deploy to Cloud
- **Frontend**: Vercel, Netlify
- **Backend**: Heroku, Railway, Render
- **Database**: Railway PostgreSQL, Supabase

---

## 📝 Test Data

### Sample Products (Already in Database)
- Vanilla Dream Ice Cream
- Chocolate Delight
- Strawberry Bliss
- Mint Chocolate Chip
- Cookie Dough Explosion

### Bank Transfer Details (For Testing)
```
Bank: Test Bank
Account Name: Ice Warehouse Ltd
Account Number: 1234567890
Routing Number: 987654321
SWIFT: TESTBANK
```

---

## 🎯 Priority Test Cases

### High Priority (Must Test)
1. ✅ User registration → approval → login
2. ✅ Product browsing with new enhanced UI
3. ✅ Add to cart → checkout → place order
4. ✅ Real-time notifications (admin receives order notification)
5. ✅ Payment proof upload → admin notification
6. ✅ Order status updates

### Medium Priority
1. Search and filter products
2. Edit profile
3. View order history
4. Admin product management
5. Mobile responsiveness

### Low Priority
1. Password reset
2. Bulk operations
3. Export data
4. Analytics

---

## 📸 Screenshots to Take

For documentation/reporting:
1. Homepage
2. Product listing page (show enhanced cards)
3. Product card hover state
4. Shopping cart
5. Checkout page
6. Order confirmation
7. Admin dashboard
8. Notification dropdown
9. Order management panel
10. Mobile views

---

## 🚀 Quick Start Testing Script

```bash
# 1. Ensure servers are running
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start

# 2. Open URLs
# Browser Tab 1: http://localhost:3000 (Admin)
# Browser Tab 2: http://localhost:3000 (Buyer - incognito mode)

# 3. Quick Test Flow
# - Tab 1: Login as admin
# - Tab 2: Login as buyer → Place order
# - Tab 1: Check notification bell (should show new order)
```

---

## 📞 Support

If you encounter issues during testing:
1. Check browser console (F12 → Console tab)
2. Check backend logs in terminal
3. Verify database connection
4. Clear browser cache and cookies

---

**Happy Testing! 🎉**
