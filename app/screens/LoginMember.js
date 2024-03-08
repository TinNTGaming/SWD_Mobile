import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import _ from "lodash";
import { handleLoginMember } from "../../services/memberService";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginMember = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); 

  const doLogin = async() => {
    if (username.length == 0){
      alert('Bạn chưa điền email'); 
      return;
    }
    if (password.length == 0){
      alert('Bạn chưa điền mật khẩu');
      return;
    }
    
    try {
      let data = await handleLoginMember(username, password);
      console.log(data);
      if (data && !_.isEmpty(data.token)) {
          await AsyncStorage.setItem('token', data.token);
          await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
          navigation.navigate('MemberPage');
      }
    } catch (error) {
      console.error(error);
      alert('Đăng nhập thất bại, hãy thử lại');
    }
  };

  return (
    <View style={styles.loginBackground}>
      <View style={styles.loginContainer}>
        <View style={styles.loginContent}>
          <Text style={styles.textLogin}>Đăng nhập thành viên</Text>
          <View style={styles.loginInput}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              placeholder='Nhận email của bạn'
              onChangeText={(txt) => setUsername(txt)}
            />        
          </View>
          <View style={styles.loginInput}>
            <Text style={styles.label}>Mật khẩu:</Text>
            <TextInput
              style={styles.input}
              placeholder='Nhập mật khẩu của bạn'
              onChangeText={(txt) => setPassword(txt)}
              secureTextEntry            
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.btnLogin} onPress={doLogin}>
              <Text style={styles.btnText}>Đăng nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnLogin} onPress={() => navigation.navigate('RegisterMember')}>
              <Text style={styles.btnText}>Tạo mới người dùng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'rgba(34, 193, 195, 1)',
  },
  loginContainer: {
    width: 400,
    height: 350,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    backgroundColor: 'white',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  loginContent: {
    padding: 20,
  },
  textLogin: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 24,
    paddingTop: 10,
  },
  loginInput: {
    marginVertical: 7,
  },
  customInputPassword: {
    position: 'relative',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 17
  },
  input: {
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnLogin: {
    width: '48%',
    marginVertical: 10,
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(34, 193, 195, 1)',
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default LoginMember;
