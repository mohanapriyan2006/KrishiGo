import { NavigationContainer } from '@react-navigation/native';
import '../global.css';
import RootLayout from './_layout';


export default function Index() {


  return (
    <NavigationContainer>
      <RootLayout />
    </NavigationContainer>
  );
}