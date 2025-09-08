import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';
import '../global.css';
import Login from '../screens/LoginScreen/Login';


export default function Index() {

  const [isLogined, setIsLogined] = useState(false);

  return (
    <NavigationContainer>
      {/* {isLogined ? <RootLayout /> : <Login />} */}
      <Login />
    </NavigationContainer>
  );
}