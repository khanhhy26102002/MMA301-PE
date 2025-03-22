import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import HomeScreen from "./Components/HomeScreen";
import ProfileScreen from "./Components/ProfileScreen";
import SettingScreen from "./Components/SettingScreen";
import DetailScreen from "./Components/DetailScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Detail" component={DetailScreen} />
  </Stack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color} />, headerShown: false
          }}
        />
        <Tab.Screen
          name="Favorites"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color }) => <Icon name="heart" size={24} color={color} />,
          }}
        />
        <Tab.Screen
          name="Captains"
          component={SettingScreen}
          options={{
            tabBarIcon: ({ color }) => <Icon name="star" size={24} color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
