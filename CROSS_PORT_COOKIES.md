# Cross-Port HTTP-Only Cookies

## 🔍 **Overview**

Pengecekan cookie HTTP-only antar port **bisa dilakukan** dengan beberapa batasan dan konfigurasi yang tepat.

## ✅ **Yang Bisa Dilakukan**

### **1. Automatic Cookie Transmission**
```javascript
// HTTP-only cookies otomatis dikirim dengan request
fetch('http://localhost:3000/api/auth', {
  credentials: 'include' // Mengirim cookies
})
```

### **2. Server-Side Validation**
- Server dapat membaca HTTP-only cookies
- Server dapat memvalidasi cookies dari domain yang berbeda
- Server dapat mengembalikan status autentikasi

### **3. Cross-Port Requests**
```javascript
// Dari port 7000 ke port 3000
fetch('http://localhost:3000/peta/login', {
  credentials: 'include'
})
```

## ⚠️ **Batasan dan Masalah**

### **1. Same-Origin Policy**
```javascript
// Port 7000 dan 3000 dianggap berbeda origin
// localhost:7000 ≠ localhost:3000
```

### **2. CORS Configuration**
Server di port 3000 harus mengizinkan:
```javascript
Access-Control-Allow-Origin: http://localhost:7000
Access-Control-Allow-Credentials: true
```

### **3. Cookie Domain Setting**
```javascript
// Cookies harus diset untuk domain yang tepat
// Domain: localhost (tanpa port)
// Path: / (untuk semua path)
```

## 🧪 **Testing Cross-Port Cookies**

### **Fungsi Testing**
```javascript
// Test cross-port cookie transmission
const results = await testCrossPortCookies();
console.log(results);
```

### **Test Cases**
1. **Direct API call**: `http://localhost:3000/api/auth/status`
2. **Login page check**: `http://localhost:3000/peta/login`
3. **Home page check**: `http://localhost:3000/peta/home`

### **Expected Results**
```javascript
// Success case
{
  test: "Test 1: Direct API call",
  status: 200,
  url: "http://localhost:3000/api/auth/status",
  redirected: false
}

// Redirect case (authenticated)
{
  test: "Test 2: Login page check",
  status: 302,
  url: "http://localhost:3000/peta/home",
  redirected: true
}
```

## 🔧 **Solusi untuk Cross-Port Cookie Sharing**

### **Solution 1: CORS Configuration**
```javascript
// Server di port 3000 harus mengizinkan:
app.use(cors({
  origin: 'http://localhost:7000',
  credentials: true
}));
```

### **Solution 2: Cookie Domain Setting**
```javascript
// Set cookies untuk domain localhost (tanpa port)
res.cookie('accessToken', token, {
  domain: 'localhost',
  path: '/',
  httpOnly: true,
  secure: false // untuk development
});
```

### **Solution 3: Proxy Setup**
```javascript
// package.json
{
  "proxy": "http://localhost:3000"
}
```

## 📊 **Debug Information**

### **Cookie Debugger Panel**
- **Cross-Port Test Button**: Test cookie transmission
- **Test Results**: Status dari setiap test case
- **Domain Info**: Current vs target domain
- **Headers Info**: Response headers dari server

### **Console Logs**
```javascript
🧪 Testing cross-port cookie transmission...
🔍 Test 1: Direct API call...
✅ Test 1: Direct API call result: { status: 200, url: "...", redirected: false }
🔍 Test 2: Login page check...
✅ Test 2: Login page check result: { status: 302, url: "...", redirected: true }
```

## 🎯 **Implementation Flow**

### **Step 1: Test Cross-Port Communication**
```javascript
// Klik "🧪 Test Cross-Port Cookies" di debug panel
// Monitor console untuk hasil test
```

### **Step 2: Check CORS Configuration**
```javascript
// Pastikan server mengizinkan credentials
// Check response headers untuk CORS info
```

### **Step 3: Verify Cookie Transmission**
```javascript
// Check apakah cookies dikirim dengan request
// Monitor Network tab untuk cookie headers
```

### **Step 4: Validate Server Response**
```javascript
// Check response status dan redirects
// Verify authentication status dari server
```

## 🛠️ **Troubleshooting**

### **Problem: CORS Error**
```javascript
// Solution: Configure server CORS
Access-Control-Allow-Origin: http://localhost:7000
Access-Control-Allow-Credentials: true
```

### **Problem: Cookies Not Sent**
```javascript
// Solution: Check credentials: 'include'
fetch(url, {
  credentials: 'include'
})
```

### **Problem: Wrong Domain**
```javascript
// Solution: Set cookie domain correctly
domain: 'localhost' // bukan 'localhost:3000'
```

## 📝 **Best Practices**

1. **Always use `credentials: 'include'`** untuk cross-port requests
2. **Configure CORS properly** di server
3. **Set cookie domain correctly** (tanpa port)
4. **Test thoroughly** dengan debug tools
5. **Monitor Network tab** untuk debugging

## 🚀 **Testing Instructions**

1. **Open Debug Panel**: Klik "🔍 Debug Cookies"
2. **Run Cross-Port Test**: Klik "🧪 Test Cross-Port Cookies"
3. **Monitor Console**: Lihat hasil test
4. **Check Network Tab**: Monitor request/response
5. **Verify Results**: Pastikan cookies dikirim dan diterima 