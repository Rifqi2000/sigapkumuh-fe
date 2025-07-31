# Troubleshooting Authentication Issues

## 🔍 **Problem: Auth check returns false despite successful login**

### **Possible Causes:**

1. **Domain/Port Mismatch**
   - React app: `http://localhost:7000`
   - Login page: `http://localhost:3000`
   - Auth server: `https://10.15.38.162:3100`

2. **HTTP-only Cookies Domain Issue**
   - Cookies set for one domain may not be sent to another
   - Cross-origin requests may not include cookies

3. **CORS Configuration**
   - Server may not allow credentials from different origins
   - Missing `Access-Control-Allow-Credentials: true`

## 🛠️ **Debugging Steps:**

### **1. Check Domain Compatibility**
```javascript
// Open browser console and run:
const domainInfo = checkDomainCompatibility();
console.log(domainInfo);
```

### **2. Check Network Tab**
- Open Developer Tools → Network tab
- Look for the request to `/auth/me`
- Check if cookies are being sent
- Check response status and headers

### **3. Check Console Logs**
```javascript
// Look for these logs:
🌐 Current domain: http://localhost:7000
🔗 Auth domain: https://10.15.38.162:3100
🔍 Same domain: false
🔍 Cross-Origin: true
```

## 🔧 **Solutions:**

### **Solution 1: Same Domain Setup**
```javascript
// If possible, run React app on same domain as auth server
// Example: Both on localhost:3000
// Or configure redirect to localhost:3000/peta/login
```

### **Solution 2: Configure CORS on Server**
```javascript
// Server needs to allow credentials from React app domain
Access-Control-Allow-Origin: http://localhost:7000
Access-Control-Allow-Credentials: true
```

### **Solution 3: Use Proxy**
```javascript
// Add proxy in package.json
{
  "proxy": "https://10.15.38.162:3100"
}
```

### **Solution 4: Check Cookie Domain**
```javascript
// Ensure cookies are set for correct domain
// May need to set cookies for parent domain
```

## 📊 **Debug Information:**

### **Cookie Debugger Panel Shows:**
- **Domain Info**: Current vs Auth domain
- **Cross-Origin**: Whether requests are cross-origin
- **HTTP-Only Status**: Cookie accessibility

### **Console Logs to Monitor:**
```javascript
🔍 Auth check response status: 401/403/200
🔍 Response body: [server response]
🚨 CORS Error - Request blocked by CORS policy
🚨 Network/CORS Error - Trying alternative approach...
```

## 🎯 **Quick Fixes:**

### **For Development:**
1. **Same Port**: Run React app on port 3000
2. **Proxy Setup**: Use proxy in package.json
3. **CORS Headers**: Ensure server allows credentials

### **For Production:**
1. **Same Domain**: Deploy both apps on same domain
2. **Subdomain**: Use subdomains (app.domain.com, auth.domain.com)
3. **API Gateway**: Use API gateway to handle CORS

## 🔍 **Testing Steps:**

1. **Check Domain Info**: Use Cookie Debugger
2. **Monitor Network**: Check request/response in Network tab
3. **Console Logs**: Look for error messages
4. **Server Logs**: Check server-side authentication logs
5. **Cookie Inspection**: Check if cookies exist in Application tab
6. **Login Redirect**: Check if redirect to `http://localhost:3000/peta/login` works
7. **Referrer Check**: Verify if user came from login page 