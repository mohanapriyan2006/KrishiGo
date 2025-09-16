# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Go to Frontend Folder

   ```bash
   cd frontend
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


# Folder structure

```
src/
├── assets/                 # Static assets
│   ├── images/            # App images
│   ├── icons/             # Icon files
│   ├── fonts/             # Custom fonts
│   └── lottie/            # Lottie animations
├── components/            # Reusable components
│   ├── common/            # Generic components (Button, Input, etc.)
│   ├── ui/                # UI-specific components
│   └── forms/             # Form-related components
├── screens/               # Screen components
│   ├── Auth/              # Authentication screens
│   ├── Home/              # Home screen and related
│   ├── Profile/           # Profile screens
│   └── index.js           # Screen exports
├── navigation/            # Navigation configuration
│   ├── AppNavigator.js    # Main navigator
│   ├── AuthNavigator.js   # Auth navigator
│   └── index.js           # Navigation exports
├── services/              # API and external services
│   ├── api/               # API calls
│   ├── auth/              # Authentication services
│   └── storage/           # Local storage services
├── utils/                 # Utility functions
│   ├── helpers/           # Helper functions
│   ├── constants/         # App constants
│   └── validators/        # Validation functions
├── hooks/                 # Custom React hooks
│   ├── useAuth.js         # Auth-related hooks
│   ├── useApi.js          # API hooks
│   └── index.js           # Hook exports
├── context/               # React Context providers
│   ├── AuthContext.js     # Authentication context
│   ├── AppContext.js      # General app context
│   └── index.js           # Context exports
├── styles/                # Global styles and themes
│   ├── theme.js           # App theme configuration
│   ├── globalStyles.js    # Global style definitions
│   └── colors.js          # Color palette
└── __tests__/             # Test files
    ├── components/        # Component tests
    ├── screens/          # Screen tests
    └── utils/            # Utility tests
```

--------------------------------------------------------

# Backend schema

### userDetails
```js []
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
        },
        {
          "courseId": "courseId2",
          "progress": 100,
          "completedModules": ["moduleId1", "moduleId2", "moduleId3"],
          "enrolledAt": "2025-08-01T08:00:00Z",
          "lastAccessed": "2025-08-20T09:00:00Z"
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
        "language": "en", // Preferred language (e.g., "en" for English)
        "notificationsEnabled": true
      },
      "createdAt": "2025-09-01T08:00:00Z",
      "updatedAt": "2025-09-15T09:00:00Z"
    }
  }
}
```

### courses
```js []
{
  "courses": {
    "courseId": {
      "title": "Introduction to Organic Farming",
      "description": "Learn the basics of organic farming and sustainable agriculture.",
      "category": "Agriculture",
      "level": "Beginner",
      "duration": 120,
      "price": 500, 
      "thumbnail": "https://example.com/thumbnail.jpg",
      "videoUrl": "https://example.com/video.mp4",
      "instructor": {
        "name": "John Doe",
        "bio": "An expert in organic farming with 10+ years of experience.",
        "profilePicture": "https://example.com/johndoe.jpg"
      },
      "createdAt": "2025-09-14T08:00:00Z",
      "updatedAt": "2025-09-15T09:00:00Z"
    }
  }
}
```

### course details
```js []
{
  "courses": {
    "courseId": {
      "title": "How to Harvest More Effectively",
      "description": "Learn how to harvest crops more efficiently and sell them for higher profits.",
      "category": "Agriculture",
      "level": "Beginner",
      "duration": 420, // in minutes (7 hours)
      "price": 500, // in currency units
      "thumbnail": "https://example.com/course-thumbnail.jpg",
      "videoUrl": "https://example.com/course-intro.mp4",
      "instructor": {
        "name": "John Doe",
        "bio": "An expert in organic farming with 10+ years of experience.",
        "profilePicture": "https://example.com/johndoe.jpg"
      },
      "ratings": {
        "average": 4.5,
        "totalRatings": 120
      },
      "modules": [
        "moduleId1": {
            "courseId": "courseId", // Reference to the parent course
            "title": "Introduction",
            "description": "In this module, you will learn the basics of harvesting.",
            "type" : "video",
            "videoUrl": "https://example.com/module1.mp4",
            "duration": "6 min",
            "completed": true,
            "createdAt": "2025-09-14T08:00:00Z",
            "updatedAt": "2025-09-15T09:00:00Z"
         },
         "moduleId2": {
            "courseId": "courseId",
            "title": "Advanced Techniques",
            "description": "Learn advanced techniques for harvesting crops.",
             "type" : "video",
            "videoUrl": "https://example.com/module2.mp4",
            "duration": "12 min",
            "completed": false,
            "createdAt": "2025-09-14T08:00:00Z",
            "updatedAt": "2025-09-15T09:00:00Z"
         }
         "moduleId3": {
            "courseId": "courseId",
            "title": "Advanced Techniques Quiz",
            "description": "Learn advanced techniques for harvesting crops.",
             "type" : "quiz",
            "quizId": "jhbfjhsebuhwe",
            "duration": "12 min",
            "completed": false,
            "createdAt": "2025-09-14T08:00:00Z",
            "updatedAt": "2025-09-15T09:00:00Z"
         }
      ],
      "createdAt": "2025-09-14T08:00:00Z",
      "updatedAt": "2025-09-15T09:00:00Z"
    }
  }
}
```

### quiz
```js []
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
        },
        {
          "questionId": "questionId2",
          "question": "Which tool is most effective for harvesting?",
          "options": [
            "Sickle",
            "Shovel",
            "Hoe",
            "Plow"
          ],
          "correctAnswer": "Sickle"
        }
      ],
      "createdAt": "2025-09-14T08:00:00Z",
      "updatedAt": "2025-09-15T09:00:00Z"
    }
  }
}
```

### redeemReward
```js []
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
    },
    "rewardId2": {
      "category": "coupons",
      "title": "Amazon Voucher",
      "description": "₹500 Amazon gift card",
      "pointsRequired": 4500,
      "value": "₹500",
      "type": "amazon",
      "icon": "bag-outline",
      "createdAt": "2025-09-14T08:00:00Z",
      "updatedAt": "2025-09-15T09:00:00Z"
    },
    "rewardId3": {
      "category": "gadgets",
      "title": "Wireless Earbuds",
      "description": "Bluetooth 5.0 earbuds",
      "pointsRequired": 15000,
      "value": "₹1500",
      "type": "earbuds",
      "icon": "headset-outline",
      "createdAt": "2025-09-14T08:00:00Z",
      "updatedAt": "2025-09-15T09:00:00Z"
    }
  }
}
```