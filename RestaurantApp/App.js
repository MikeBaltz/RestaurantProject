import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import RestaurantsScreen from './screens/RestaurantsScreen';
import ReservationScreen from './screens/ReservationScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Σύνδεση' }} />
        <Stack.Screen name="Restaurants" component={RestaurantsScreen} options={{ title: 'Εστιατόρια' }} />
        <Stack.Screen name="Reservation" component={ReservationScreen} options={{ title: 'Κράτηση' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Το Προφίλ μου' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
