import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const LoginMember = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); 

  return (
    <View style={styles.loginBackground}>
      <View style={styles.loginContainer}>
        <View style={styles.loginContent}>
          <Text style={styles.textLogin}>Member Login</Text>
          <View style={styles.loginInput}>
            <Text style={styles.label}>Username:</Text>
            <TextInput
              style={styles.input}
              placeholder='Enter your username'
              onChangeText={(txt) => setUsername(txt)}
            />        
          </View>
          <View style={styles.loginInput}>
            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              placeholder='Enter your password'
              onChangeText={(txt) => setPassword(txt)}
              secureTextEntry            
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.btnLogin}>
              <Text style={styles.btnText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnLogin} onPress={() => navigation.navigate('RegisterMember')}>
              <Text style={styles.btnText}>Create new account</Text>
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
