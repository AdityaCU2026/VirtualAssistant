# Virtual Assistant - AI-Powered Personal Assistant Platform

A full-stack web application that allows users to create and customize their own AI-powered virtual assistant. Built with React frontend and Node.js backend, integrated with Google Gemini AI for intelligent responses.

## 🚀 Features

- **User Authentication**: Secure signup/login with JWT tokens
- **AI Assistant Customization**: Personalize your assistant's name, appearance, and personality
- **Real-time AI Conversations**: Powered by Google Gemini API
- **Image Upload Support**: Upload and manage assistant profile images via Cloudinary
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **Secure API**: RESTful backend with authentication middleware

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Context API** for state management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **BcryptJS** for password hashing
- **Cloudinary** for image storage
- **Google Gemini API** for AI responses

## 📁 Project Structure

```
VirtualAssistant/
├── Backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   └── token.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── user.controller.js
│   ├── middlewares/
│   │   ├── isAuth.js
│   │   └── multer.js
│   ├── models/
│   │   └── user.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── user.routes.js
│   ├── public/
│   ├── index.js
│   ├── gemini.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── App.jsx
│   ├── public/
│   └── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Cloudinary account
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd VirtualAssistant
```

2. **Backend Setup**
```bash
cd Backend
npm install
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

4. **Environment Variables**

Create `.env` file in the Backend directory:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
GEMINI_API_KEY=your_google_gemini_api_key
```

5. **Run the Application**

Backend:
```bash
cd Backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: https://virtualassistant-frontend-aoj5.onrender.com
- Backend:  https://virtualassistant-backend-a0n2.onrender.com

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile` - Update user profile (protected)
- `POST /api/user/upload` - Upload profile image (protected)

### AI Integration
- `POST /api/gemini/chat` - Send message to AI assistant

## 🎨 Customization Features

Users can customize their virtual assistant with:
- **Name**: Personal assistant name
- **Profile Image**: Custom avatar upload
- **Assistant Image**: AI character image
- **Welcome Message**: Personalized greeting
- **Theme**: Visual customization options

## 🔐 Authentication Flow

1. User registers with email and password
2. Password is hashed using bcrypt
3. JWT token is generated and stored in cookies
4. Protected routes verify token via middleware
5. User data persists across sessions

## 🖼️ Image Upload

Images are uploaded to Cloudinary with:
- Automatic optimization
- Secure storage
- CDN delivery
- Multiple format support

## 🧪 Development

### Backend Development
```bash
cd Backend
npm run dev  # Starts with nodemon
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Vite dev server
```

## 🚀 Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

### Environment Variables for Production
Ensure all environment variables are properly configured for production deployment.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For support, email support@virtualassistant.com or join our Slack channel.
