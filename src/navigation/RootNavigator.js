import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import DrawerNavigator from './DrawerNavigator';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import CartScreen from '../screens/CartScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* Auth Flow Screens */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Sign In" component={SignInScreen} />
      <Stack.Screen name="Sign Up" component={SignUpScreen} />

      {/* Main Drawer & Tabs Flow */}
      <Stack.Screen name="MainApp" component={DrawerNavigator} />

      {/* Stack Detail Screens */}
      <Stack.Screen
        name="Product Details"
        component={ProductDetailsScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="Edit Profile"
        component={EditProfileScreen}
      />
      <Stack.Screen
        name="My Cart"
        component={CartScreen}
      />
    </Stack.Navigator>
  );
}
