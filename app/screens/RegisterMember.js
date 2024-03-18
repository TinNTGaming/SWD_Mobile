import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Button, Image} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getAllBuildingId } from "../../services/userService";
import { registerMember } from "../../services/memberService";
import * as ImagePicker from 'expo-image-picker';

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
    formDataImage.append("api_key", "665652388645534");
    formDataImage.append("upload_preset", "upload-image");
    formDataImage.append("file", {
                                   uri: image,
                                   type: 'image/*', // thay đổi kiểu MIME tùy thuộc vào loại file
                                   name: 'upload.jpg'
                                   });
    try {
        const response = await fetch('https://api.cloudinary.com/v1_1/upload-image/image/upload', {
          method: 'POST',
          body: formDataImage,
        });
        const data = await response.json();
        console.log('Upload result: ', data.url);
        return data.url;
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
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
          const imageUrl = await uploadCloudinary(formData.image); // Đợi cho việc upload ảnh hoàn thành trước khi tiếp tục
          setFormData(prevState => ({
            ...prevState,
            image: imageUrl, // Cập nhật URL ảnh sau khi upload thành công
          }));
          await registerMember(formData);
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
    try {
        // Yêu cầu quyền truy cập thư viện ảnh
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access media library was denied');
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
          handleOnChangeInput(result.assets[0].uri, "image");
        }
    } catch (error) {
        console.error('Error choosing/uploading image:', error);
        // Xử lý lỗi nếu có
    }
  };
  
  return (
    <View style={styles.loginBackground}>
    <Image style={styles.background} source={require('../assets/Sport/login-background.jpg')}/>
        <View style={styles.loginContainer}>
        <ScrollView>
            <View style={styles.loginContent}>
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
                <View style={styles.inputPicker}>
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
            </View>    
            <View style={styles.loginInput}>
                <Text style={styles.label}>Tên tòa nhà:</Text>
                <View style={styles.inputPicker}>
                <Picker
                    onValueChange={(value) => handleBuildingNameChange (value)}
                    selectedValue={formData.buildingName}
                    style={styles.loginInput}
                >
                    <Picker.Item label='Chọn tên tòa nhà' value='' />
                    {buildingIds.map((buildingId) => (
                      <Picker.Item key={buildingId.id} label={buildingId.name} value={buildingId.name} />
                    ))}
                </Picker>
                </View>
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
                {formData.image && <Image source={{ uri: formData.image}} style={styles.image} />}
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.btnLogin} onPress={handleAddNewUser}>
                <Text style={styles.btnText}>Đăng kí</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnLogin} onPress={() => navigation.navigate('LoginMember')}>
                <Text style={styles.btnText}>Đóng</Text>
                </TouchableOpacity>
            </View>
            </View>
            </ScrollView>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginContainer: {
    width: '95%',
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: 'white',
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
    fontSize: 17,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderStyle: 'solid',
    paddingHorizontal: 10,
    marginBottom: 5,
    fontSize: 16,
    borderRadius: 5,
  },
  inputPicker:{
    borderWidth: 0.8,
    borderStyle: 'solid',

    height: 40,
    justifyContent: 'center',
    fontSize: 16,
    borderRadius: 5,
  },
  buttonContainer: {
    flex: 1,
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnLogin: {
    width: '48%',
    marginVertical: 10,
    padding: 10,
    borderRadius: 15,
    borderWidth: 0.8,
    borderStyle: 'solid',
    backgroundColor: 'rgba(34, 193, 195, 1)',
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginTop: 10,
  },
  background: {
      flex: 1,
      width: '100%',
      height: '100%',
      padding: 0,
      borderWidth: 1,
      borderColor: '#000',
      position: 'absolute',
  },
});

export default RegisterMember;
