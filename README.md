# Phonebook Management System - Frontend

This is the frontend for the **Phonebook Management System**, built with **Next.js (React.js)**. It provides an intuitive UI for user authentication, phonebook management, and contact sharing.

## 🚀 Features

- **User Authentication**
  - Sign Up & Sign In
  - Forgot Password
- **User Management**
  - Approve new users (Super-admin/Admin)
  - Deactivate/Delete users (Super-admin/Admin)
  - CRUD operations for users (Super-admin/Admin)
- **Phonebook Management**
  - CRUD operations for contacts (First Name, Last Name, Email, Contact Number, Profile Photo) (User)
  - Share/unshare contacts with other users (Super-admin/Admin)
  - Contacts update across shared users (User)
- **API Communication**
  - Fetches data only via the backend API (no direct database access)

## 🛠️ Tech Stack

- **Frontend**: Next.js, React.js, TypeScript
- **State Management**: Zustand (or Context API)
- **UI Components**: TailwindCSS, ShadCN UI
- **API Requests**: Fetch/Axios
- **Authentication**: JWT Tokens

## 📂 Project Setup

### 1️⃣ Clone the repository
```sh
git clone https://github.com/jlayese/kmc-frontend.git
cd kmc-frontend
```

### 2️⃣ Install dependencies
```sh
npm install
```

### 3️⃣ Set up environment variables  
Create a `.env.local` file and add:
```sh
NEXT_PUBLIC_API_V1="http://localhost:5000/api/v1"
```

### 4️⃣ Run the development server
```sh
npm run dev
```
Frontend will be available at **`http://localhost:3000`**.

## 🚀 Deployment
The app is deployed at: **[https://kmc-frontend-alpha.vercel.app/](#)**  

---

## 📧 Contact
For inquiries, reach out to **junmanuellayese@gmail.com**.
