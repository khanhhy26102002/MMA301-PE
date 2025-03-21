import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from './Components/HomeScreen';
import ProfileScreen from './Components/ProfileScreen';
import SettingScreen from './Components/SettingScreen';
const Tab = createBottomTabNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color} /> }} />
        <Tab.Screen name="Favorites" component={ProfileScreen} options={{ tabBarIcon: ({ color }) => <Icon name="heart" size={24} color={color} /> }} />
        <Tab.Screen name="Captains" component={SettingScreen} options={{ tabBarIcon: ({ color }) => <Icon name="star" size={24} color={color} /> }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

// 🖌️ Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 10, marginVertical: 5, backgroundColor: '#f9f9f9', borderRadius: 10 },
  image: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold' },
  position: { fontSize: 14, color: 'gray' },
  team: { color: 'blue', fontWeight: 'bold' },
  captain: { color: 'gold', fontWeight: 'bold' },
  header: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 }
});

export default App;
