import { createNativeStackNavigator } from '@react-navigation/native-stack';
import About from '../components/About';
import CourseDetails from '../components/CourseDetails';
import CourseVideo from '../components/CourseVideo';
import { QuizScreen } from '../components/Quiz';
import SavedCourses from '../components/SavedCourses';
import SearchCourses from '../components/SearchCourses';
import Settings from '../components/SettingsScreen/Settings';
import TermsAndConditions from '../components/TremsAndConditions';
import '../global.css';
import Login from '../screens/LoginScreen/Login';
import Register from '../screens/LoginScreen/Register';
import RootLayout from './MainLayout';

const Stack = createNativeStackNavigator();

export default function Index() {

  return (
    <Stack.Navigator initialRouteName='Main' screenOptions={{ headerShown: false }}>
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