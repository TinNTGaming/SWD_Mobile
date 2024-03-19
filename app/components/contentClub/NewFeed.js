import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView, Modal } from "react-native";
import {
  UserJointSlot,
  getNumberOfSlot,
  getSlotNotJoined
  } from "../../../services/userService";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountdownTimer from '../CountdownTime';
import Avatar from "../../assets/avatar/no-avatar.png";

function NewFeed({ inforWallet, tranPoint, yards, setActiveTab, clubDetail }) {
  const route = useRoute();
  const id = route.params.id;
  const idclubmem = route.params.idclubmem;
  const navigation = useNavigation();

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

  const [numberOfSlot, setNumberOfSlot] = useState({});
  const [slotNotJoined, setSlotNotJoined] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (userInfoLoaded && userInfo) {
        try {
          const [slotNotJoinedRes] = await Promise.all([
            getSlotNotJoined(idclubmem, id)
          ]);
          const slotNotJoinFitler = slotNotJoinedRes.result.filter((item) => {
              return (
                item.memberPostId != idclubmem &&
                !isPassTime(item.date, item.startTime)
              );
            });
          setSlotNotJoined(slotNotJoinFitler);

          const promises = slotNotJoinedRes.result.map(async (item) => {
            const response = await getNumberOfSlot(item.id);
            return { itemId: item.id, numberOfSlot: response.result };
          });
          const results = await Promise.all(promises);
          const numberOfSlotMap = {};
          results.forEach((result) => {
            numberOfSlotMap[result.itemId] = result.numberOfSlot;
          });
          setNumberOfSlot(numberOfSlotMap);

          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [userInfoLoaded, userInfo]);

  function isPassTime(date, hour) {
      const time = date + "T" + hour + ":00";
      const targetTime = new Date(time).getTime();
      const currentTime = new Date().getTime();

      if (targetTime < currentTime) {
        return true;
      } else {
        false;
      }
    }

  async function handleJoinSlot(slotId) {
    try {
      await UserJointSlot({
        tranPoint: tranPoint,
        inforWallet: inforWallet,
        newClubMemSlot: {
          clubMemberId: idclubmem,
          slotId: slotId,
          transactionPoint: tranPoint.point,
        },
      });
      alert('Tham gia thành công!');
      setActiveTab("myJoinPost")
    } catch (error) {
      console.error("Error joining slot:", error);
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImagePress = (imageUri) => {
    setSelectedImage(imageUri);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedImage(null);
  };

  const isValidUri = (uri) => {
       try {
         new URL(uri);
         return true;
       } catch (error) {
         return false;
       }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.clubTitle}>{clubDetail.name}</Text>
      <View style={styles.postTitle}>
      <TouchableOpacity style={styles.postContainer} onPress={() => navigation.navigate('CreatePostPage', { clubDetail, idclubmem })}>
          {userInfo && userInfo.image && typeof userInfo.image === 'string' && isValidUri(userInfo.image) ?
            <Image
              source={{ uri: userInfo.image }}
              style={styles.avatar}
            />
            :
            <Image
              source={Avatar}
              style={styles.avatar}
            />
          }
          <Text style={styles.writeBtn}>
            <Text>{userInfo ? userInfo.name : 'Guest'} ơi! </Text>
            <Text>Bạn đang muốn gì thế?</Text>
          </Text>
      </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Bài viết mới nhất</Text>
      <ScrollView>
      {isLoading && <ActivityIndicator style={styles.loadingIcon} size="large" color="#0000ff" />}

      {slotNotJoined.map((item, index) => {

        const time = item.date + "T" + item.startTime + ":00";

        const date = new Date(item.dateTime);

        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const timePost = ` ${hours}:${minutes} ${day}-${month}-${year}`;

        const remainingSlots = parseInt(item.requiredMember) - parseInt(numberOfSlot[item.id] || 0);
        const isFull = remainingSlots <= 0;

        let yardDetails = [];
        if(yards)
            yardDetails = yards && yards.find((yard) => {
              return yard.id === item.yardId;
            });


        return (
          <View key={item.id} style={styles.mainPostContainer}>
            <View style={styles.posterName}>
                <View>
                  <Text style={{fontWeight: 'bold', fontSize: 18}}>{item.memberPostName}</Text>
                  <Text>{timePost}</Text>
                </View>
                <View>
                  <Text><CountdownTimer targetTime={time} /></Text>
                </View>
            </View>
            <Text style={styles.caption}>{item.description}</Text>
            <View style={styles.postContentContainer}>
              <TouchableOpacity style={styles.postImg} onPress={() => handleImagePress(item.image)}>
                <Image source={{uri: item.image}} style={styles.postImg} />
              </TouchableOpacity>
              <View style={styles.postInfo}>
                <Text style={styles.postInfoText}>Thông tin trận đấu</Text>
                <Text>Khu: <Text style={styles.boldText}>{yardDetails?.areaName}</Text></Text>
                <Text>Sân: <Text style={styles.boldText}>{yardDetails?.areaName} - {item.yardName}</Text></Text>
                <Text>Thời gian: <Text style={styles.boldText}>{item.startTime} - {item.endTime}</Text></Text>
                <Text>Date: <Text style={styles.boldText}>{item.date}</Text></Text>
                <Text>Tổng số người chơi: <Text style={styles.boldText}>{parseInt(item.requiredMember) + parseInt(item.currentMember)}</Text></Text>
                <Text>Còn thiếu: <Text style={styles.boldText}>{parseInt(item.requiredMember) - parseInt(numberOfSlot[item.id] || 0)} người</Text></Text>
                {isFull ? (
                  <TouchableOpacity style={[styles.btnJoin, {backgroundColor: 'gray'}]} disabled>
                    <Text style={styles.boldText}>Đã đủ người</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.btnJoin} onPress={() => handleJoinSlot(item.id)}>
                    <Text style={{color: 'white', fontSize: 15}}>Tham gia</Text>
                  </TouchableOpacity>
                  )}
                  </View>
                </View>
              </View>
            );
          })}
          </ScrollView>
          <Modal visible={isModalVisible} transparent={true} animationType="slide">
              <View style={styles.modalContainer}>
                <Image style={styles.modalImage} source={{ uri: selectedImage }} />
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                    <Text style={styles.closeButtonText}>Đóng</Text>
                </TouchableOpacity>
              </View>
          </Modal>
        </View>
      );
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    clubTitle:{
        fontSize: 30,
        fontWeight: "bold",
        textAlign: 'center'
    },
    postTitle:{
        alignItems: 'center'
    },
    postContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 25,
    },
    writeBtn: {
        textAlign: 'center',
        fontSize: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    loadingIcon: {
        marginTop: 20,
    },
    mainPostContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
      },
    posterName: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    caption: {
        marginBottom: 8,
        fontSize: 17
    },
    postContentContainer: {
        flexDirection: "row",
        display: "flex",
    },
    postImg: {
        flex: 3,
        resizeMode: "contain",
        borderRadius: 5,
        marginRight: 10
    },
    postInfo: {
        flex: 4,
    },
    postInfoText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
    btnJoin: {
        backgroundColor: "green",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    boldText:{
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
    modalImage: {
        width: "80%",
        height: "80%",
        resizeMode: "contain",
    },
    closeButton: {
        position: "absolute",
        top: 20,
        right: 20,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: "black",
        fontWeight: "bold",
    },
});

export default NewFeed;
