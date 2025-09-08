# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

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