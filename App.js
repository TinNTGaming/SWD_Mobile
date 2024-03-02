import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './app/screens/HomePage';
import LoginMember from './app/screens/LoginMember';
import RegisterMember from './app/screens/RegisterMember';
import MemberPage from './app/screens/MemberPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='HomePage'>
        <Stack.Screen name='HomePage' component={HomePage} />
        <Stack.Screen name='LoginMember' component={LoginMember} />
        <Stack.Screen name='RegisterMember' component={RegisterMember} />
        <Stack.Screen name='MemberPage' component={MemberPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

