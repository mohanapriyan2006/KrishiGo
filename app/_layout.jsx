import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';


import Home from '../components/Home.jsx';

const Tab = createBottomTabNavigator();

export default function RootLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Journey') {
            iconName = 'map';
          } else if (route.name === 'Challenge') {
            iconName = 'trophy';
          } else if (route.name === 'Rewards') {
            iconName = 'gift';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return (
            <View style={[
              styles.tabIcon,
              { backgroundColor: focused ? 'rgba(255, 255, 255, 0.9)' : 'transparent' }
            ]}>
              <Ionicons name={iconName} size={size} color={focused ? '#8BC34A' : '#e3e3e3'} />
            </View>
          );
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#8BC34A',
          paddingVertical: 8,
          height: 70,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Journey" component={Home} />
      <Tab.Screen name="Challenge" component={Home} />
      <Tab.Screen name="Rewards" component={Home} />
      <Tab.Screen name="Profile" component={Home} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
