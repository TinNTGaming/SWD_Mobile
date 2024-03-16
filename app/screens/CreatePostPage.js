import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faImages, faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import {
  faPenToSquare,
  faClock,
  faPerson,
  faPersonShelter,
  faSignsPost,
} from "@fortawesome/free-solid-svg-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import { launchImageLibrary } from 'react-native-image-picker';
import axios from "axios";
import { getYardsBySport, createPostInSlot } from "../../services/userService";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';


function CreatePostPage() {
  const imageFile = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { clubDetail, idclubmem } = route.params;
  const id = clubDetail.id;

  const [userInfoLoaded, setUserInfoLoaded] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const value = await AsyncStorage.getItem('userInfo')
          if(value !== null) {
            setUserInfo(JSON.parse(value));
          }
          setUserInfoLoaded(true);
        } catch(e) {
          console.log(e);
        }
      };
      fetchData();
    }, []);

  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    memberPostId: "",
    currentMember: 0,
    requiredMember: 0,
    yardName: "",
    clubId: "",
    description: "",
    image: "",
  });

  const [yards, setYards] = useState([]);
  const [yardId, setYardId] = useState("");

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
      const fetchYards = async () => {
      if (userInfoLoaded && userInfo) {
        try {
          const yardsRes = await getYardsBySport(clubDetail.sportId);
          setYards(yardsRes.result);
        } catch (error) {
          console.error("Error fetching yards:", error);
        }
      };
      }
    fetchYards();
  }, [clubDetail, userInfoLoaded, userInfo]);

  const handleOnChangeInput = async (value, id) => {
    if (id === "image" && imageFile) {
      await uploadCloudinary(imageFile.current?.files[0]);
    }
    setFormData({
      ...formData,
      [id]: value,
    });
    if (id === "yardName") {
      const selectedYard = yards.find((yard) => yard.name === value);
      setYardId(selectedYard.id);
    }
  };

  const handleImagePicker = async () => {
      const result = await launchImageLibrary();
      console.error('Test',result);
      handleOnChangeInput(result.assets.uri, 'image');
    };

  const uploadCloudinary = async (image) => {
    const formDataImage = new FormData();
    formDataImage.append("api_key", "665652388645534");
    formDataImage.append("upload_preset", "upload-image");
    formDataImage.append("file", image);
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/upload-image/image/upload",
        formDataImage
      );
      setFormData({
        ...formData,
        image: response.data.url,
      });
      console.log("Upload cloudinary successfully", response);
    } catch (error) {
      console.log("Error upload cloudinary:", error);
    }
  };

  const handleAddNewPost = async () => {
    const postData = {
      ...formData,
      yardId: yardId,
    };
    postData.memberPostName = userInfo.name;
    postData.clubId = id;
    postData.memberPostId = idclubmem;
    try {
      await createPostInSlot(postData);
      alert("Create post successfully!");
      navigation.navigate('MainClubPage', {id, idclubmem});
    } catch (error) {
      alert("Create post error!");
      console.error("Error creating post:", error);
      navigation.navigate('MainClubPage', {id, idclubmem});
    }
  };

    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };

    const handleConfirmDate = (date) => {
      setFormData({
        ...formData,
        date: date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      });
      hideDatePicker();
    };

  const hours = [];
  for (let i = 5; i <= 21; i++) {
    const hour = `${i < 10 ? "0" : ""}${i}:00`;
    hours.push(hour);
  }

  return (
    <View style={styles.modalContainer}>
      <Text style={styles.modalHeader}>
        <FontAwesomeIcon icon={faSignsPost} /> Tạo mới bài viết
      </Text>
      <ScrollView style={styles.modalBody}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            <FontAwesomeIcon icon={faPenToSquare} /> Mô tả
          </Text>
          <TextInput
            multiline
            numberOfLines={4}
            style={styles.textArea}
            onChangeText={(value) => handleOnChangeInput(value, "description")}
            value={formData.description}
            placeholder="Bạn viết gì đi...."
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            <FontAwesomeIcon icon={faCalendarDays} /> Ngày
          </Text>
          <TouchableOpacity onPress={showDatePicker}>
              <Text style={styles.input}>{formData.date}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirmDate}
              onCancel={hideDatePicker}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            <FontAwesomeIcon icon={faClock} /> Thời gian bắt đầu
          </Text>
          <Picker
            selectedValue={formData.startTime}
            onValueChange={(value) => handleOnChangeInput(value, "startTime")}
            style={styles.input}
          >
            <Picker.Item label="Chọn thời gian bắt đầu" value="" />
            {hours.map((hour, index) => (
              <Picker.Item key={index} label={hour} value={hour} />
            ))}
          </Picker>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            <FontAwesomeIcon icon={faClock} /> Thời gian kết thúc
          </Text>
          <Picker
            selectedValue={formData.endTime}
            onValueChange={(value) => handleOnChangeInput(value, "endTime")}
            style={styles.input}
          >
            <Picker.Item label="Chọn thời gian kết thúc" value="" />
            {hours.map((hour, index) => (
              <Picker.Item key={index} label={hour} value={hour} />
            ))}
          </Picker>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            <FontAwesomeIcon icon={faPerson} /> Thành viên hiện tại
          </Text>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            onChangeText={(value) => handleOnChangeInput(value, "currentMember")}
            value={formData.currentMember.toString()}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            <FontAwesomeIcon icon={faPerson} /> Thành viên yêu cầu
          </Text>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            onChangeText={(value) => handleOnChangeInput(value, "requiredMember")}
            value={formData.requiredMember.toString()}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            <FontAwesomeIcon icon={faPersonShelter} /> Tên sân
          </Text>
          <Picker
            selectedValue={formData.yardName}
            onValueChange={(value) => handleOnChangeInput(value, "yardName")}
            style={styles.input}
          >
            <Picker.Item label="Chọn tên sân" value="" />
            {yards.map((yard) => (
              <Picker.Item
                key={yard.id}
                label={`${yard.name} - ${yard.areaName}`}
                value={yard.name}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.formGroup}>
          <View>
            <Text style={styles.label}>
              <FontAwesomeIcon icon={faImages} /> Ảnh
            </Text>
            <Button title="Chọn ảnh" onPress={handleImagePicker} />
            {formData.image && <Image source={{ uri: imageUri }} style={styles.image} />}
          </View>
        </View>
      </ScrollView>
      <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.button} onPress={handleAddNewPost}>
            <Text style={styles.buttonText}>Đăng bài</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MainClubPage', {id, idclubmem})}>
            <Text style={styles.buttonText}>Hủy</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
      flex: 1,
      padding: 20,
      backgroundColor: "#fff",
    },
    modalHeader: {
      fontSize: 20,
      fontWeight: "bold",
    },
    modalBody: {
      flex: 1,
    },
    formGroup: {
      marginVertical: 10,
    },
    label: {
      fontSize: 16,
      fontWeight: "bold",
    },
    input: {
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingTop: 8,
      fontSize: 16
    },
    textArea: {
      height: 80,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      textAlignVertical: "top",
      fontSize: 16
    },
    fileInput: {
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
    },
    modalFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    button: {
        backgroundColor: "#4CAF50",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
  });

export default CreatePostPage;
