import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './app/screens/HomePage';
import LoginMember from './app/screens/LoginMember';
import RegisterMember from './app/screens/RegisterMember';
import MemberPage from './app/screens/MemberPage';
import ClubPage from './app/screens/ClubPage';
import MainClubPage from './app/screens/MainClubPage';
import CreatePostPage from './app/screens/CreatePostPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='HomePage'>
        <Stack.Screen name='HomePage' component={HomePage} />
        <Stack.Screen name='LoginMember' component={LoginMember} />
        <Stack.Screen name='RegisterMember' component={RegisterMember} />
        <Stack.Screen name='MemberPage' component={MemberPage} options={{headerShown: false}}/>
        <Stack.Screen name='ClubPage' component={ClubPage} options={{headerShown: false}}/>
        <Stack.Screen name='MainClubPage' component={MainClubPage} options={{headerShown: false}}/>
        <Stack.Screen name='CreatePostPage' component={CreatePostPage} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

