# 🛒 FreshCart - Daily Grocery Mobile Application

[![React Native](https://img.shields.io/badge/React%20Native-0.88.0-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo SDK](https://img.shields.io/badge/Expo%20SDK-58-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![React Navigation](https://img.shields.io/badge/React%20Navigation-v7-6B46C1?logo=react&logoColor=white)](https://reactnavigation.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-23AA49.svg)](LICENSE)

A modern, high-performance **React Native (Expo)** mobile application built for daily fresh grocery shopping with farm-direct South Indian vegetables, fruits, dairy, bakery items, beverages, and snacks.

---

## 🌟 Key Highlights & Features

### 1. 🔐 Role-Based Access Control (RBAC)
* **Store Administrator (Gokul)**:
  * Manage product catalog directly from the app.
  * **Add New Items** with real-time price, unit, category, description, and photo.
  * Update product stock counts and inventory statuses.
* **Customer Accounts (Kishore, Madan, etc.)**:
  * Browse the full grocery catalog with smooth sorting and category filters.
  * View rich **Product Details Showcase** (Hero Image, pack size, farm origin, nutrition highlights, user ratings & reviews).
  * Add products to personal cart and wishlist.

### 2. 👥 Multi-User Data Isolation (Private Carts & Wishlists)
* Strict data isolation per user account.
* **Kishore** has his own private cart and favourites.
* **Madan** has his own separate items and wishlist.
* **Gokul (Admin)** has an isolated administrator environment.
* Fast profile/account switcher built right into the profile & navigation drawer.

### 3. 📸 Smart Image Matching & Device Media Upload
* **✨ AI & Keyword-Based Auto Image Generation**:
  * Automatically matches realistic, high-definition grocery photos based on product name in **English and Tamil** (*e.g., Apple, Banana, Thakkali / Tomato, Vengayam / Onion, Palak / Keerai, Cow Milk, Curd, Ghee, Bread, Tea, Kaapi, Coconut, etc.*).
* **📷 Device Gallery & Camera Integration**:
  * Admins can upload photos directly from their phone's gallery using `expo-image-picker`.
  * Snap live photos using the device camera.
* **🎯 1-Tap Preset Grocery Picker**:
  * Quick-access horizontal carousel with popular grocery items for instant 1-tap image selection.
* **🌐 Custom URL Option**:
  * Paste any direct web link with live preview verification before publishing.

### 4. 🛍️ Dynamic Shopping Experience
* **Search & Filter**: Real-time debounce search across names, brands, origins, and descriptions.
* **Category Pills Slider**: Quickly switch between Vegetables, Fruits, Dairy & Milk, Bakery & Staples, Beverages, and Snacks.
* **Interactive Cart & Promo System**:
  * Increment/decrement quantities with bouncy micro-animations.
  * Apply discount coupon codes (`FRESH20`, `SAVE10`, `GOKUL50`).
  * Bill breakdown with item total, delivery fee, tax calculations, and discount savings.

---

## 🔑 Demo Login Accounts

| Role | Name | Email | Password | Pre-loaded Cart Items |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Gokul | `gokul.admin@groceryapp.com` | `gokul123` | Store Catalog Manager |
| **Customer** | Kishore | `kishore.customer@example.com` | `kishore123` | Ooty Carrots, Red Onions |
| **Customer** | Madan Kumar | `madan.customer@example.com` | `madan123` | Ponni Rice, Desi Cow Ghee |

---

## 🛠️ Technology Stack

* **Framework:** [React Native 0.88.0](https://reactnative.dev/) with [Expo SDK 58](https://expo.dev/)
* **Navigation:** [React Navigation 7](https://reactnavigation.org/)
  * `@react-navigation/native-stack`
  * `@react-navigation/bottom-tabs`
  * `@react-navigation/drawer`
* **Animations:** `react-native-reanimated` & Native Animated API
* **Icons:** `@expo/vector-icons` (Ionicons)
* **Media Handling:** `expo-image-picker`
* **Safe Areas & Layout:** `react-native-safe-area-context`, `react-native-screens`

---

## 📂 Project Structure

```text
REACT-NATIVE-MODEL/
├── assets/                   # App icons, splash screens, and illustrations
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── CategoryPill.js   # Category filter chips
│   │   ├── Header.js         # Top app bar with search and drawer trigger
│   │   └── ProductCard.js    # Grid & list product cards with micro-animations
│   ├── context/
│   │   └── AppContext.js     # Global state (Multi-user auth, carts, wishlist, catalog)
│   ├── data/
│   │   └── productsData.js   # Initial catalog data (Vegetables, Fruits, Dairy, Bakery, etc.)
│   ├── navigation/
│   │   ├── AppNavigator.js   # Bottom tabs, drawer, and stack navigators
│   │   └── CustomDrawerContent.js # Side drawer with quick user switch
│   ├── screens/
│   │   ├── CartScreen.js     # Shopping cart with promo codes and order summary
│   │   ├── EditProfileScreen.js # Profile editor
│   │   ├── FavouriteScreen.js# Customer wishlist
│   │   ├── HomeScreen.js     # Feed with promotions and featured categories
│   │   ├── ProductDetailsScreen.js # Customer-only hero showcase
│   │   ├── ProductsScreen.js # Full catalog & Admin "Add Item" manager
│   │   ├── ProfileScreen.js  # User profile and account switcher
│   │   ├── SignInScreen.js   # Dual login for Admin and Customer
│   │   ├── SignUpScreen.js   # Customer registration
│   │   └── WelcomeScreen.js  # Onboarding screen
│   ├── theme/
│   │   └── colors.js         # Design tokens, palette, and shadows
│   └── utils/
│       └── productImageHelper.js # Smart keyword matching & preset gallery
├── App.js                    # Application entry point with Providers
├── app.json                  # Expo app configuration
├── package.json              # Dependencies and run scripts
├── LICENSE                   # MIT License
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your system.

### 1. Clone the repository
```bash
git clone https://github.com/gokul479/Fresh-cart.git
cd Fresh-cart
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npx expo start
```

### 4. Open the App
* **Expo Go (Mobile):** Scan the generated QR code using the **Expo Go** app on Android or Camera app on iOS.
* **Android Emulator:** Press `a` in the terminal or run `npx expo start --android`.
* **iOS Simulator:** Press `i` in the terminal or run `npx expo start --ios`.
* **Web Browser:** Press `w` in the terminal or run `npx expo start --web`.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

Developed with ❤️ by **[Gokul](https://github.com/gokul479)**.
