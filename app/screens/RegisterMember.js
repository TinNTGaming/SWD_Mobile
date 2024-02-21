import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'react-native-image-picker';

const RegisterMember = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [gender, setGender] = useState('');
  const [buildingname, setBuildingname] = useState('');
  const [buildingid, setBuildingid] = useState('');
  const [phonenumber, setPhonenumber] = useState('');

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'mix',
        allowEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.cancelled){
        setImage(result.uri);
    }
  };

  return (
    <View style={styles.loginBackground}>
        <View style={styles.loginContainer}>
            <View style={styles.loginContent}>
            <Text style={styles.textLogin}>Member Register</Text>
            <View style={styles.loginInput}>
                <Text style={styles.label}>Username:</Text>
                <TextInput
                style={styles.input}
                placeholder='Enter your username'
                onChangeText={(txt) => setUsername(txt)}
                value={username}
                />        
            </View>
            <View style={styles.loginInput}>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                style={styles.input}
                placeholder='Enter your email'
                onChangeText={(txt) => setEmail(txt)}
                value={email}
                />        
            </View>
            <View style={styles.loginInput}>
                <Text style={styles.label}>Password:</Text>
                <TextInput
                style={styles.input}
                placeholder='Enter your password'
                onChangeText={(txt) => setPassword(txt)}
                value={password}
                secureTextEntry            
                />
            </View>                    
            <View style={styles.loginInput}>
                <Text style={styles.label}>Gender:</Text>
                <TextInput
                style={styles.input}
                placeholder='Enter your gender'
                onChangeText={(txt) => setGender(txt)}
                value={gender}
                />        
            </View>    
            <View style={styles.loginInput}>
                <Text style={styles.label}>Building Name:</Text>
                <Picker 
                    selectedValue={buildingname}
                    onValueChange={(txt) => setBuildingname(txt)}
                >
                    <Picker.Item label='Select Building Name' value='' />
                    <Picker.Item label='Building A' value='Building A' />
                    <Picker.Item label='Building B' value='Building B' />
                    <Picker.Item label='Building C' value='Building C' />
                </Picker>
            </View>
            <View style={styles.loginInput}>
                <Text style={styles.label}>Building Id:</Text>
                <Picker 
                    selectedValue={buildingid}
                    onValueChange={(txt) => setBuildingid(txt)}
                >
                    <Picker.Item label='Select Building Id' value='' />
                    <Picker.Item label='ID001' value='ID001' />
                    <Picker.Item label='ID002' value='ID002' />
                    <Picker.Item label='ID003' value='ID003' />
                </Picker>
            </View>      
            <View style={styles.loginInput}>
                <Text style={styles.label}>Phone Number:</Text>
                <TextInput
                style={styles.input}
                placeholder='Enter your phone number'
                onChangeText={(txt) => setPhonenumber(txt)}
                value={phonenumber}
                />        
            </View> 
            <View style={styles.loginInput}>
                <TouchableOpacity onPress={handleImagePick}>
                <Text style={styles.label}>Choose Image</Text>
                </TouchableOpacity>
                {image && <Image source={{ uri: image }} style={{ width: 200, height: 200}} />}
            </View>
                
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.btnLogin}>
                <Text style={styles.btnText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnLogin} onPress={() => navigation.navigate('LoginMember')}>
                <Text style={styles.btnText}>Close</Text>
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
    height: 800,
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
    padding: 10,
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
    padding: 5,
    marginBottom: 5,
  },
  buttonContainer: {
    paddingTop: 30,
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

export default RegisterMember;
