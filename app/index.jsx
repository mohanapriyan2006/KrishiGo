import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { I18nextProvider } from "react-i18next";
import About from "../components/About";
import CourseDetails from "../components/CoursesComponents/CourseDetails";
import CourseVideo from "../components/CoursesComponents/CourseVideo";
import SavedCourses from "../components/CoursesComponents/SavedCourses";
import SearchCourses from "../components/CoursesComponents/SearchCourses";
import { QuizScreen } from "../components/Quiz";
import Settings from "../components/SettingsComponents/Settings";
import TermsAndConditions from "../components/TermsAndConditions";
import i18n from "../config/i18n"; // Import i18n instance
import "../global.css";
import DataProvider from "../hooks/DataContext";
import Login from "../screens/LoginScreen/Login";
import Register from "../screens/LoginScreen/Register";
import RootLayout from "./MainLayout";

const Stack = createNativeStackNavigator();

// Create a wrapper component to handle i18n initialization
function AppContent() {
	return (
		<Stack.Navigator
			initialRouteName="Login"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="Login" component={Login} />
			<Stack.Screen name="Register" component={Register} />
			<Stack.Screen name="Main" component={RootLayout} />
			<Stack.Screen name="Quiz" component={QuizScreen} />
			<Stack.Screen name="SearchCourses" component={SearchCourses} />
			<Stack.Screen name="SavedCourses" component={SavedCourses} />
			<Stack.Screen name="CourseDetails" component={CourseDetails} />
			<Stack.Screen name="CourseVideo" component={CourseVideo} />
			<Stack.Screen name="Settings" component={Settings} />
			<Stack.Screen name="About" component={About} />
			<Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
		</Stack.Navigator>
	);
}

export default function Index() {
	return (
		<I18nextProvider i18n={i18n}>
			<DataProvider>
				<AppContent />
			</DataProvider>
		</I18nextProvider>
	);
}
