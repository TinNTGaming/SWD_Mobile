import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Button} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getAllBuildingId } from "../../services/userService";
import { registerMember } from "../../services/memberService";
import * as ImagePicker from 'expo-image-picker';
import axios from '../../axios.js';

const RegisterMember = ({navigation}) => {
  const imageFile = useRef(null);
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
        [id]: event,
    });
  };

  const handleBuildingNameChange = (value) => {
    const selectedBuildingName = value;
    const selectedBuilding = buildingIds.find(building => building.name === selectedBuildingName);
    if (selectedBuilding) {
      setFormData({
        ...formData,
        buildingName: selectedBuilding.name,
        buildingId: selectedBuilding.id
      });
    }
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
            Alert(`Thiếu thông tin: ${arrInput[i]}`);
            break;
        }
    }
    return isValid;
  };

  const handleAddNewUser =  async() => {
    let isValid = checkValidateInput();
    if (isValid) {
        console.log(formData);        
        try {
          await registerMember(formData)
          alert('Đăng kí thành công!');
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

    }
    };
  
  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      handleOnChangeInput(result.assets.uri, 'image');
    }
  };
  
  return (
    <View style={styles.loginBackground}>
        <View style={styles.loginContainer}>
            <View style={styles.loginContent}>
            <ScrollView>
            <Text style={styles.textLogin}>Tạo tài khoản</Text>
            <View style={styles.loginInput}>
                <Text style={styles.label}>Tên User:</Text>
                <TextInput
                style={styles.input}
                placeholder='Nhập tên đăng nhập'
                onChangeText={(event) => handleOnChangeInput(event, 'name')}
                value={formData.name}
                />        
            </View>
            <View style={styles.loginInput}>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                style={styles.input}
                placeholder='Nhập email'
                onChangeText={(event) => handleOnChangeInput(event, 'email')}
                value={formData.email}
                />        
            </View>
            <View style={styles.loginInput}>
                <Text style={styles.label}>Mật khẩu:</Text>
                <TextInput
                style={styles.input}
                placeholder='Nhập password'
                onChangeText={(event) => handleOnChangeInput(event, 'password')}
                value={formData.password}
                secureTextEntry            
                />
            </View>                    
            <View style={styles.loginInput}>
                <Text style={styles.label}>Giới tính:</Text>
                <Picker
                    selectedValue={formData.gender}
                    onValueChange={(event) => handleOnChangeInput(event, 'gender')}
                >
                    <Picker.Item label='Chọn giới tính' value='' />
                    <Picker.Item label='Nam' value='male' />
                    <Picker.Item label='Nữ' value='female' />
                    <Picker.Item label='Khác' value='other' />
                </Picker>
            </View>    
            <View style={styles.loginInput}>
                <Text style={styles.label}>Tên tòa nhà:</Text>
                <Picker 
                    selectedValue={formData.buildingname}
                    onValueChange={(event) => handleBuildingNameChange (event)}
                >
                    <Picker.Item label='Chọn tên tòa nhà' value='' />
                    {buildingIds.map((buildingId) => (
                      <Picker.Item key={buildingId.id} label={buildingId.name} value={buildingId.name} />
                    ))}
                </Picker>
            </View>
            <View style={styles.loginInput}>
                <Text style={styles.label}>Số điện thoại:</Text>
                <TextInput
                style={styles.input}
                placeholder='Nhập số điện thoại'
                onChangeText={(event) => handleOnChangeInput(event, 'phoneNumber')}
                value={formData.phonenumber}
                />        
            </View> 
            <View style={styles.loginInput}>
                <Text style={styles.label}>Ảnh</Text>
                <Button title="Chọn ảnh" onPress={handleImagePicker} />
                {formData.image && <Image source={formData.image} style={styles.image} />}
            </View>
                
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.btnLogin} onPress={handleAddNewUser}>
                <Text style={styles.btnText}>Đăng kí</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnLogin} onPress={() => navigation.navigate('LoginMember')}>
                <Text style={styles.btnText}>Đóng</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
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
