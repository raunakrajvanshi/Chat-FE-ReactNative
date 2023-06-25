import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './Screens/Home/Home';
import Login from './Screens/Login/Login';
import Signup from './Screens/Signup/Signup';
import Conversation from './Screens/Conversation/Conversation';
import {checkAuthentication} from './Utils/common';
import { ActivityIndicator } from 'react-native-paper';
import { View } from 'react-native';
import { THEME_COLOR } from './Constants/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticateUser = async () => {
      const authenticated = await checkAuthentication();
      setIsAuthenticated(authenticated);
      setLoading(false);
    };
    authenticateUser();
  }, []);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color={THEME_COLOR} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? 'Home' : 'Login'}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerLeft: null}}
        />
        <Stack.Screen name="Conversation" component={Conversation} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
