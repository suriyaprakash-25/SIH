# 🔥 **KMRL Metro Firebase Setup Guide**

## 📋 **Prerequisites**
- Node.js installed (v18+ recommended)
- Firebase account
- Firebase project created: `sih-logins`

## 🚀 **Quick Setup Instructions**

### **Step 1: Get Firebase Admin Key**
1. Go to [Firebase Console](https://console.firebase.google.com/project/sih-logins)
2. Click **Project Settings** (gear icon)
3. Go to **Service Accounts** tab
4. Click **"Generate new private key"**
5. Download the JSON file
6. **Rename it to:** `firebase-admin-key.json`
7. **Save it in this directory:** `D:\SIH 2\`

⚠️ **IMPORTANT**: The file should be named exactly `firebase-admin-key.json`

### **Step 2: Login to Firebase CLI**
```bash
firebase login
```
This will open your browser to authenticate.

### **Step 3: Run the Setup Script**
```bash
node setup-firestore.js
```

### **Step 4: Deploy Firestore Rules**
```bash
firebase deploy --only firestore:rules
```

## 📊 **What Gets Created:**

### **🔐 Authentication Users (8 total):**
```
admin@kmrl.com / admin123 (Admin)
fitness@kmrl.com / fitness123 (Fitness Certificates)
jobcard@kmrl.com / jobcard123 (Job Card Status)
branding@kmrl.com / branding123 (Branding Priorities)
mileage@kmrl.com / mileage123 (Mileage Monitoring)
cleaning@kmrl.com / cleaning123 (Cleaning Slots)
stabling@kmrl.com / stabling123 (Stabling Positions)
maintenance@kmrl.com / maintenance123 (Cleaning & Maintenance)
```

### **📁 Firestore Collections:**
- **`users`** - User profiles with roles and permissions
- **`certificates`** - Train fitness certificates
- **`jobCards`** - Maintenance job tracking
- **`branding`** - Advertisement and branding data
- **`mileage`** - Daily mileage and performance tracking
- **`cleaning`** - Cleaning schedules and slots
- **`stabling`** - Train depot positioning
- **`maintenance`** - Maintenance tasks and history

### **🛡️ Security Rules:**
- Role-based access control
- Users can only access their designated sections
- Admin has full access
- All operations require authentication

## 🎯 **Testing Your Setup:**

1. **Start your app:** `npm run start` (in frontend directory)
2. **Open:** http://localhost:3000
3. **Test login with any credentials above**
4. **Verify role-based access works**

## 🔧 **Troubleshooting:**

### **Error: firebase-admin-key.json not found**
- Download the service account key from Firebase Console
- Ensure it's named exactly `firebase-admin-key.json`
- Place it in the root directory (`D:\SIH 2\`)

### **Error: Permission denied**
- Run `firebase login` first
- Ensure you have admin access to the Firebase project

### **Error: Project not found**
- Verify project ID is `sih-logins` in `.firebaserc`
- Check Firebase Console that project exists

## 📱 **Firebase Console URLs:**
- **Project Overview:** https://console.firebase.google.com/project/sih-logins
- **Authentication:** https://console.firebase.google.com/project/sih-logins/authentication/users
- **Firestore:** https://console.firebase.google.com/project/sih-logins/firestore/data
- **Project Settings:** https://console.firebase.google.com/project/sih-logins/settings/general

## 🎉 **Success Indicators:**
- ✅ 8 users created in Firebase Authentication
- ✅ User profiles created in Firestore `users` collection
- ✅ Sample data populated in all collections
- ✅ Security rules deployed
- ✅ Login system working with role-based access

---

**Need help?** Check the setup script output for detailed success/error messages.