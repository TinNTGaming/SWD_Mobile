import React,  { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
//import { handleLogoutMember } from '../../services/memberService';
import HomeContent from './contentMember/HomeContent';
import ClubContent from './contentMember/ClubContent';
import Contact from '../components/FooterMember';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HeaderMember() {

  const [activeTab, setActiveTab] = React.useState('home');

//   const handleLogout = async () => {
//     try {
//       await handleLogoutMember();
//       // Use AsyncStorage for React Native instead of localStorage
//       // AsyncStorage.removeItem('token');
//       // AsyncStorage.removeItem('userInfo');
//       navigation.navigate('/');
//     } catch (error) {
//       console.log(error);
//     }
//   };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getLoginInfo = async()=>{
       try {
           const value = await AsyncStorage.getItem('userInfo')
           if(value !== null) {
               userInfo =  JSON.parse (value);
           }
         } catch(e) {
           console.log(e);
         }
   };
   getLoginInfo();

  return (
    <View style={styles.container}>
        <View style={styles.header}>
        <Image style={styles.headerLogo} source={require('../assets/logoHeader/logo.png')}/>
        <View style={styles.middle}>
          <View style={styles.contentMiddle}>
            <TouchableOpacity
              style={[styles.childContent, activeTab === 'home' && styles.active]}
              onPress={() => handleTabClick('home')}
            >
              <Text style={styles.active}>
                <Text style={{ fontWeight: 'bold' }}>Home</Text>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.childContent, activeTab === 'club' && styles.active]}
              onPress={() => handleTabClick('club')}
            >
              <Text style={styles.active}>
                <Text style={{ fontWeight: 'bold' }}>Club</Text>
              </Text>
            </TouchableOpacity>
            <View style={styles.childContent}>
              <TouchableOpacity
                style={[styles.childContent, activeTab === 'contact' && styles.active]}
                onPress={() => handleTabClick('contact')}
              >
                <Text style={styles.active}>
                  <Text style={{ fontWeight: 'bold' }}>Contact</Text>
                </Text>
              </TouchableOpacity>
            </View>          
          </View>
        </View>
        <View style={styles.contentRight}>
          <View style={styles.headerUserInfo}>
            <Text style={{ fontSize: 13, fontWeight: '300', textTransform: 'uppercase' }}>
              {userInfo.name}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.content}>
        {activeTab === 'home' && <HomeContent />}
        {activeTab === 'club' && <ClubContent />}
        {activeTab === 'contact' && <Contact />}
      </View>
    </View>
    
  );
};
const styles = StyleSheet.create({
    container: {
    flex: 1,
    flexDirection: 'column',
    },
    header: {
      flexDirection: 'row',
      height: 70,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: '#fff',
      alignItems: 'center',
      paddingTop: 30,
    },
    headerLogo: {
      height: '50%',
      width: '20%',
      resizeMode: 'cover',
    },
    middle: {
      flex: 1,
      marginLeft: 10,
    },
    contentMiddle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    childContent: {
      flex: 1,
      alignItems: 'center',
    },
    active: {
      color: '#5cbb50',
      fontSize: 18,
    },
    contentRight: {
      marginLeft: 20,
      marginRight: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    // headerImage: {
    //   backgroundSize: 'cover',
    //   width: 50,
    //   height: 50,
    //   borderRadius: 25,
    //   overflow: 'hidden',
    // },
    headerUserInfo: {
      fontSize: 5,
      fontWeight: '10',
      textTransform: 'uppercase',
    },
    content:{
      flex: 1,
      marginTop: 70
    }
  });
export default HeaderMember;