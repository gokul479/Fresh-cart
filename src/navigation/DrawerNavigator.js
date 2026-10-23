import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';
import CustomDrawerContent from './CustomDrawerContent';
import ProductsScreen from '../screens/ProductsScreen';
import FavouriteScreen from '../screens/FavouriteScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="MainTabs"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 280,
        },
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ drawerLabel: 'Home' }}
      />
      <Drawer.Screen
        name="Daily Products"
        component={ProductsScreen}
        options={{ drawerLabel: 'Products' }}
      />
      <Drawer.Screen
        name="My Favourites"
        component={FavouriteScreen}
        options={{ drawerLabel: 'Favourites' }}
      />
      <Drawer.Screen
        name="My Cart"
        component={CartScreen}
        options={{ drawerLabel: 'My Cart' }}
      />
      <Drawer.Screen
        name="Customer Profile"
        component={ProfileScreen}
        options={{ drawerLabel: 'Profile' }}
      />
    </Drawer.Navigator>
  );
}
