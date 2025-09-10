import { createNativeStackNavigator } from '@react-navigation/native-stack';
import '../global.css';
import Login from '../screens/LoginScreen/Login';
import Register from '../screens/LoginScreen/Register';
import RootLayout from './MainLayout';

const Stack = createNativeStackNavigator();

export default function Index() {

  return (
    <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Main" component={RootLayout} />
    </Stack.Navigator>
  );
}