# Cookie-Based Authentication System

## 🔐 **Overview**
Sistem autentikasi ini menggunakan HTTP-only cookies yang aman untuk memverifikasi status autentikasi pengguna. HTTP-only cookies tidak dapat dibaca oleh JavaScript dan hanya dapat divalidasi oleh server.

## 🍪 **Cookie Detection**

### **HTTP-Only Cookie Names:**
- `accessToken` (Primary - HTTP-Only)
- `refreshToken` (Primary - HTTP-Only)
- `token` (HTTP-Only)
- `access_token` (HTTP-Only)
- `auth_token` (HTTP-Only)
- `session` (HTTP-Only)
- `sessionId` (HTTP-Only)
- `JSESSIONID` (HTTP-Only)
- `connect.sid` (HTTP-Only)

### **Cara Kerja dengan HTTP-Only Cookies:**
1. **Server Validation**: HTTP-only cookies otomatis dikirim dengan setiap request
2. **API Call**: Sistem selalu melakukan request ke `/auth/me` untuk validasi
3. **Server Response**: Server memvalidasi HTTP-only cookies dan mengembalikan status
4. **Client Decision**: Client mengandalkan response server untuk menentukan status auth

## 🔍 **Debug Tools**

### **Cookie Debugger Component**
- Tombol debug di pojok kiri bawah
- Menampilkan status cookie autentikasi
- Menunjukkan cookie mana yang ditemukan
- Menampilkan semua cookie yang ada

### **Console Logging & Alerts**
```javascript
// Log yang akan muncul di console:
🔍 Starting authentication verification...
🔍 Checking authentication status...
🔍 Login redirect info: { referrer, isFromLogin, shouldCheckAuth }
🍪 Using HTTP-only cookies - relying on server validation
🔍 Making authentication request to server...
🔍 Auth check response status: 200/401/403
🔍 Authentication status: SUCCESS/FAILED
🔍 Local auth check result: { isAuthenticated, user }
✅ Authentication successful: {user data}

// Alerts yang akan muncul:
✅ Authentication successful! Welcome back! (Jika langsung akses halaman)
✅ Authentication successful! Redirecting to your requested page... (Jika redirect setelah login)
⚠️ Authentication required! Please login to continue... (Jika belum terautentikasi)
🚨 Authentication error! Please try logging in again... (Jika terjadi error)
```

### **HTTP-Only Cookie Security:**
- 🔒 **Secure**: HTTP-only cookies tidak dapat dibaca oleh JavaScript
- 🔒 **Automatic**: Cookies otomatis dikirim dengan setiap request
- 🔒 **Server-Only**: Hanya server yang dapat memvalidasi cookies
- 🔒 **XSS Protection**: Melindungi dari serangan XSS

### **Debug Information:**
- HTTP-only cookies ditampilkan dengan ikon 🔒
- Status autentikasi ditentukan oleh server
- Client tidak dapat membaca nilai cookie

### **Alert System:**
- **Success Alert**: Muncul ketika user berhasil terautentikasi
- **Redirect Alert**: Muncul ketika user akan di-redirect ke halaman yang disimpan
- **Required Alert**: Muncul ketika user belum terautentikasi
- **Error Alert**: Muncul ketika terjadi error dalam proses autentikasi

### **Local Auth Check:**
- **Fallback Method**: Jika SSO auth gagal, cek status di `http://localhost:3000/peta/login`
- **Redirect Detection**: Deteksi apakah user di-redirect ke home/dashboard
- **Cross-Domain Support**: Mendukung autentikasi antar domain yang berbeda

## 📁 **Files yang Dimodifikasi**

### **New Files:**
- `src/utils/auth.js` - Updated dengan cookie checking
- `src/components/CookieDebugger.jsx` - Debug component
- `COOKIE_AUTHENTICATION.md` - Dokumentasi ini

### **Modified Files:**
- `src/components/AuthProvider.jsx` - Enhanced logging
- `src/App.js` - Added CookieDebugger

## 🔧 **Fungsi Utama**

### **checkAuth()**
```javascript
// Pengecekan autentikasi dengan cookie
const { isAuthenticated, user } = await checkAuth();
```

### **hasValidAuthCookies()**
```javascript
// Pengecekan apakah ada cookie autentikasi
const hasAuth = hasValidAuthCookies();
```

### **debugCookies()**
```javascript
// Debug informasi cookie
const cookieInfo = debugCookies();
console.log(cookieInfo);
```

### **handlePostLoginRedirect()**
```javascript
// Handle redirect setelah login berhasil
const wasRedirected = handlePostLoginRedirect();
```

## 🎯 **Fleksible Redirect System**

### **Scenario 1: User mengakses halaman langsung**
- User sudah terautentikasi → Langsung akses halaman yang dituju
- User belum terautentikasi → Redirect ke login → Setelah login kembali ke halaman asal

### **Scenario 2: User mengakses dari bookmark**
- User sudah terautentikasi → Langsung akses halaman bookmark
- User belum terautentikasi → Redirect ke login → Setelah login kembali ke halaman bookmark

### **Scenario 3: User mengakses URL spesifik**
- User sudah terautentikasi → Langsung akses URL spesifik
- User belum terautentikasi → Redirect ke login → Setelah login kembali ke URL spesifik

## 🚀 **Cara Menggunakan**

1. **Start Application**: `npm start`
2. **Check Debug Info**: Klik tombol "🔍 Debug Cookies" di pojok kiri bawah
3. **Monitor Console**: Lihat log autentikasi di browser console
4. **Test Authentication**: 
   - Tanpa cookie → redirect ke login
   - Dengan cookie valid → load dashboard

## 🔄 **Flow Autentikasi**

```
1. App Load
   ↓
2. Check Cookies (hasValidAuthCookies)
   ↓
3. If No Cookies → Save Current URL → Redirect to Login
   ↓
4. If Has Cookies → Call /auth/me
   ↓
5. If Valid Response → Check for Saved URL → Redirect or Continue
   ↓
6. If Invalid Response → Save Current URL → Redirect to Login
```

### **Redirect Logic:**
- **Not Authenticated**: Save current URL → Redirect to `http://localhost:3000/peta/login`
- **Authenticated**: Check for saved URL → Redirect back or continue to current page
- **Post Login**: Redirect to originally requested page
- **Login Detection**: Check if user came from login page

## 🛠️ **Troubleshooting**

### **Jika autentikasi gagal:**
1. Buka browser console
2. Klik tombol debug cookies
3. Periksa apakah ada cookie autentikasi
4. Periksa response dari `/auth/me`

### **Jika redirect tidak bekerja:**
1. Periksa URL login di `AUTH_BASE_URL`
2. Pastikan server SSO berjalan di `10.15.38.162:3100`
3. Periksa CORS settings di server

## 📝 **Environment Variables**

Pastikan file `.env` berisi:
```
REACT_APP_API_URL=your_backend_api_url
```

SSO URL hardcoded: `http://10.15.38.162:3100/api/sso/v1` 