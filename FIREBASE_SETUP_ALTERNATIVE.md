# 🔥 **Alternative Firebase Setup (Node.js v18 Compatible)**

Since your Node.js version (v18.18.2) is not compatible with the latest Firebase CLI, here are alternative setup methods:

## 🎯 **Method 1: Manual Console Setup (Recommended)**

### **Step 1: Enable Authentication**
1. Go to [Firebase Console](https://console.firebase.google.com/project/sih-logins)
2. Click **Authentication** → **Get started**
3. Click **Sign-in method** tab
4. Enable **Email/Password** provider
5. Toggle **Enable** → **Save**

### **Step 2: Create Users Manually**
Click **Users** tab → **Add user** and create these 8 users:

```
admin@kmrl.com | admin123
fitness@kmrl.com | fitness123
jobcard@kmrl.com | jobcard123
branding@kmrl.com | branding123
mileage@kmrl.com | mileage123
cleaning@kmrl.com | cleaning123
stabling@kmrl.com | stabling123
maintenance@kmrl.com | maintenance123
```

### **Step 3: Enable Firestore**
1. Go to **Firestore Database** → **Create database**
2. Choose **Start in test mode**
3. Select location: **asia-south1 (Mumbai)**
4. Click **Done**

### **Step 4: Set Security Rules**
1. Go to **Firestore Database** → **Rules** tab
2. Replace with the content from `firestore.rules` file
3. Click **Publish**

## 🎯 **Method 2: Web-based Setup Script**

I've created a web-based setup that you can run directly in your browser:

### **Create HTML Setup File:**