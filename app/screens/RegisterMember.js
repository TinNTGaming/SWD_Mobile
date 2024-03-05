import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getAllBuildingId } from "../../services/userService";
import { registerMember } from "../../services/memberService";
import * as ImagePicker from 'react-native-image-picker';

const RegisterMember = ({navigation}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    image: '',
    gender: '',
    buildingId: '',
    buildingName: '',
    phoneNumber: ''
  });
  const [buildingIds, setBuildingIds] = useState([]);

  useEffect(() => {
    const fetchBuildingIds = async () => {
        try {
            const response = await getAllBuildingId();
            console.log(response);
            setBuildingIds(response.result);
        } catch (error) {
            console.error('Error fetching buildingIds', error);
        }
    };

    fetchBuildingIds();
  }, []);


  const handleOnChangeInput = (event, id) => {
    if(id === 'image' && imageFile){
        uploadCloudinary(imageFile.current?.files[0])
    }
    setFormData({
        ...formData,
        [id]: event.target.value,
    });
  };

  const uploadCloudinary = async (image) => {
    const formDataImage = new FormData();
    formDataImage.append('api_key', '665652388645534');
    formDataImage.append('upload_preset','upload-image');
    formDataImage.append('file', image);
    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/upload-image/image/upload',formDataImage);
      setTimeout(()=> {
        setFormData({
            ...formData,
            image: response.data.url
        })
      },500)
      console.log('Upload cloudinary successfully', response);
    } catch (error) {
      console.log('Error upload cloudinary:', error);
    }
  };

  const checkValidateInput = () => {
    let isValid = true;
    let arrInput = ['name', 'email', 'password', 'image', 'gender', 'buildingId', 'buildingName', 'phoneNumber'];
    for (let i = 0; i < arrInput.length; i++) {
        if (!formData[arrInput[i]]) {
            isValid = false;
            showErrorToast(`Missing parameter: ${arrInput[i]}`);
            break;
        }
    }
    return isValid;
  };

  const handleAddNewUser =  async() => {
    let isValid = checkValidateInput();
    if (isValid) {
        //call api create modal
        console.log(formData);        
        try {
          await registerMember(formData)
          alert('User added successfully!');     
          navigation.navigate('LoginMember');
        } catch (error) {
          console.log(error);
      }

        setFormData({
            name: '',
            email: '',
            password: '',
            image: '',
            gender: '',
            buildingId: '',
            buildingName: '',
            phoneNumber: '',
        });

        toggle();
    }
    };
  
    const handleImagePicker = () => {
      const options = {
        title: 'Chọn ảnh',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };

      ImagePicker.showImagePicker(options, (response) => {
        if (response.didCancel) {
          console.log('Người dùng hủy chọn ảnh');
        } else if (response.error) {
          console.log('Lỗi:', response.error);
        } else {
          // Lưu đường dẫn hình ảnh và hiển thị nó
          formData.image = ({ uri: response.uri });                  
        }
      });
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
                onChangeText={(event) => handleOnChangeInput(event, 'name')}
                value={formData.name}
                />        
            </View>
            <View style={styles.loginInput}>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                style={styles.input}
                placeholder='Enter your email'
                onChangeText={(event) => handleOnChangeInput(event, 'email')}
                value={formData.email}
                />        
            </View>
            <View style={styles.loginInput}>
                <Text style={styles.label}>Password:</Text>
                <TextInput
                style={styles.input}
                placeholder='Enter your password'
                onChangeText={(event) => handleOnChangeInput(event, 'password')}
                value={formData.password}
                secureTextEntry            
                />
            </View>                    
            <View style={styles.loginInput}>
                <Text style={styles.label}>Gender:</Text>
                <TextInput
                style={styles.input}
                placeholder='Enter your gender'
                onChangeText={(event) => handleOnChangeInput(event, 'gender')}
                value={formData.gender}
                />        
            </View>    
            <View style={styles.loginInput}>
                <Text style={styles.label}>Building Name:</Text>
                <Picker 
                    selectedValue={formData.buildingname}
                    onValueChange={(event) => handleOnChangeInput(event, 'buildingName')}
                >
                    <Picker.Item label='Select Building Name' value='' />
                    {buildingIds.map((buildingId) => (
                      <Picker.Item label={buildingId.name} value={buildingId.name} />                                            
                    ))}
                </Picker>
            </View>
            <View style={styles.loginInput}>
                <Text style={styles.label}>Building Id:</Text>
                <Picker 
                    selectedValue={formData.buildingid}
                    onValueChange={(event) => handleOnChangeInput(event, 'buildingId')}
                >
                    <Picker.Item label='Select Building Id' value='' />
                    {buildingIds.map((buildingId) => (
                      <Picker.Item label={buildingId.id} value={buildingId.id} />                                            
                    ))}
                </Picker>
            </View>      
            <View style={styles.loginInput}>
                <Text style={styles.label}>Phone Number:</Text>
                <TextInput
                style={styles.input}
                placeholder='Enter your phone number'
                onChangeText={(event) => handleOnChangeInput(event, 'phoneNumber')}
                value={formData.phonenumber}
                />        
            </View> 
            <View style={styles.loginInput}>
                <TouchableOpacity 
                onPress={handleImagePicker} 
                onValueChange={(event) => handleOnChangeInput(event, 'image')} 
                >
                  {formData.image ? (
                  <Image source={formData.image} style={styles.image} onValueChange={(event) => handleOnChangeInput(event, 'image')}  />
                  ) : (
                    <Text style={styles.label}>Chọn ảnh</Text>
                  )}
                </TouchableOpacity>                
            </View>
                
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.btnLogin} onPress={handleAddNewUser}>
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
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
});

export default RegisterMember;
