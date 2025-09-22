# 🌱 KrishiGo - Your Digital Agriculture Companion

![KrishiGo Logo](assets/images/icon.png)

## 📱 About KrishiGo

KrishiGo is a comprehensive mobile application designed to empower farmers with educational resources, interactive courses, challenges, and rewards. Built with React Native and Expo, this app provides a complete learning platform for agricultural knowledge, sustainable farming practices, and modern techniques.

## ✨ Features

- 📚 **Interactive Courses** - Learn agricultural techniques and modern farming practices
- 🧠 **Knowledge Quizzes** - Test your understanding and earn points
- 🏆 **Challenges** - Complete real-world farming challenges and share your success
- 💰 **Rewards System** - Earn points and redeem them for monetary rewards, coupons, or gadgets
- 🤖 **AI Assistant** - Get instant answers to your farming questions
- 🌐 **Multilingual Support** - Access content in your preferred language
- 👤 **Personalized Experience** - Track your progress and achievements

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/mohanapriyan2006/KrishiGo.git
   cd krishiGo-project
   ```

2. Install dependencies
   ```bash
   npm install
   ```
3. Start the development server
   ```bash
   npx expo start
   ```

### Running the App

Once the development server is running, you can open the app in:

- 📱 **Expo Go app** on your physical device (scan the QR code)
- 📱 **Android Emulator** (press 'a' in the terminal)
- 📱 **iOS Simulator** (press 'i' in the terminal)
- 🌐 **Web Browser** (press 'w' in the terminal)

## 🧩 Project Structure

```
krishigo/
├── ai/
│ ├── ai_api.js
│ ├── ai_contest.js
│ └── ai_firebase.js
│
├── api/
│ ├── challenges/
│ │ └── challenges_firebase.js
│ │
│ ├── courses/
│ │ ├── all_courses_service.js
│ │ └── courses_service.js
│ │
│ ├── quizs/
│ │ └── quiz_service.js
│ │
│ └── user/
│ ├── login_firebase.js
│ ├── register_firebase.js
│ └── user_service.js
│
├── app/
│ ├── index.jsx
│ ├── MainLayout.jsx
│ └── NavBar.jsx
│
├── assets/
│ ├── fonts/
│ └── images/
│
├── components/
│ ├── AIComponents/
│ │ ├── AIChatSpace.jsx
│ │ └── FloatingAIbutton.jsx
│ │
│ ├── ChallengeComponents/
│ │ ├── ChallengePopup.jsx
│ │ └── ChallengeUpload.jsx
│ │
│ ├── CoursesComponents/
│ │ ├── CourseDetails.jsx
│ │ ├── CourseVideo.jsx
│ │ ├── SavedCourses.jsx
│ │ └── SearchCourses.jsx
│ │
│ ├── RedeemComponents/
│ │ ├── CouponModal.jsx
│ │ ├── GadgetsModal.jsx
│ │ ├── RedeemScreen.jsx
│ │ └── UpiModal.jsx
│ │
│ ├── SettingsComponents/
│ │ ├── ChangeLanguageModal.jsx
│ │ ├── DeleteAccModal.jsx
│ │ ├── EditAccountModal.jsx
│ │ ├── EditProfilePhoto.jsx
│ │ └── Settings.jsx
│ │
│ ├── About.jsx
│ ├── ProgressLine.jsx
│ ├── Quiz.jsx
│ ├── RewardPopUp.jsx
│ ├── RoundProgress.jsx
│ └── TremsAndConditions.jsx
│
├── config/
│ └── firebase.js
│
├── functions/
│ └── index.js
│
├── hooks/
│ └── DataContext.js
│
├── screens/
│ ├── LoginScreen/
│ │ ├── Login.jsx
│ │ └── Register.jsx
│ │
│ ├── ChallengeScreen.jsx
│ ├── HomeScreen.jsx
│ ├── JourneyScreen.jsx
│ ├── ProfileScreen.jsx
│ └── RewardsScreen.jsx
│
├── node_modules/ (auto-generated)
│
├── .env
├── .gitignore
├── app.json
├── babel.config.js
├── eslint.config.js
├── global.css
├── iconfig.json
├── metro.config.js
├── package-lock.json
├── package.json
├── README.md
└── tailwind.config.js

```

## 🔄 Backend Data Structure

### User Management

```js
{
  "users": {
    "userId": {
      "authId": "authId123", // Firebase Authentication UID
      "email": "user@example.com",
      "fullName": "John Doe",
      "profilePicture": "https://example.com/profile-picture.jpg",
      "phoneNumber": "+1234567890",
      "address": {
        "street": "123 Main Street",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
      },
      "rewards": {
        "totalPoints": 8490,
        "redeemedPoints": 2000
      },
      "enrolledCourses": [
        {
          "courseId": "courseId1",
          "progress": 50, // Progress in percentage
          "completedModules": ["moduleId1", "moduleId2"],
          "enrolledAt": "2025-09-10T08:00:00Z",
          "lastAccessed": "2025-09-15T09:00:00Z"
        }
      ],
      "achievements": [
        {
          "achievementId": "achievement1",
          "title": "First Course Completed",
          "description": "Completed your first course on KrishiGo.",
          "earnedAt": "2025-08-20T09:00:00Z"
        }
      ],
      "preferences": {
        "language": "en",
        "notificationsEnabled": true
      },
      "createdAt": "2025-09-01T08:00:00Z",
      "updatedAt": "2025-09-15T09:00:00Z"
    }
  }
}
```

### Course Management

```js
{
  "courses": {
    "courseId": {
      "title": "Introduction to Organic Farming",
      "description": "Learn the basics of organic farming and sustainable agriculture.",
      "category": "Agriculture",
      "level": "Beginner",
      "duration": 120, // in minutes
      "price": 500, // in currency units
      "thumbnail": "https://example.com/thumbnail.jpg",
      "videoUrl": "https://example.com/video.mp4",
      "instructor": {
        "name": "John Doe",
        "bio": "An expert in organic farming with 10+ years of experience.",
        "profilePicture": "https://example.com/johndoe.jpg"
      },
      "modules": [
        {
          "moduleId": "moduleId1",
          "title": "Introduction",
          "type": "video",
          "duration": "6 min"
        },
        {
          "moduleId": "moduleId2",
          "title": "Advanced Techniques Quiz",
          "type": "quiz",
          "duration": "12 min"
        }
      ],
      "createdAt": "2025-09-14T08:00:00Z",
      "updatedAt": "2025-09-15T09:00:00Z"
    }
  }
}
```

### Quiz Structure

```js
{
  "quizzes": {
    "quizId1": {
      "moduleId": "moduleId3", // Reference to the parent module
      "title": "Quiz on Best Practices",
      "questions": [
        {
          "questionId": "questionId1",
          "question": "What is the best time to harvest crops?",
          "options": [
            "Early morning",
            "Afternoon",
            "Evening",
            "Night"
          ],
          "correctAnswer": "Early morning"
        }
      ],
      "createdAt": "2025-09-14T08:00:00Z",
      "updatedAt": "2025-09-15T09:00:00Z"
    }
  }
}
```

### Rewards System

```js
{
  "rewards": {
    "rewardId1": {
      "category": "money", // Category: money, coupons, or gadgets
      "title": "UPI Transfer",
      "description": "Direct UPI money transfer",
      "pointsRequired": 1000, // Points needed to redeem
      "value": "₹100", // Reward value
      "type": "upi", // Type of reward (e.g., upi, amazon, earbuds)
      "icon": "cash-outline", // Icon name for UI
      "createdAt": "2025-09-14T08:00:00Z",
      "updatedAt": "2025-09-15T09:00:00Z"
    }
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📬 Contact

For any inquiries or support, please contact the project maintainers:

- GitHub: [@mohanapriyan2006](https://github.com/mohanapriyan2006)
