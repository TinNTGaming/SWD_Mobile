import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView, Modal, TouchableOpacity } from "react-native";
import CountdownTimer from "../CountdownTime";
import {
  getIdMemberCreatePost,
  getNumberOfSlot,
  getSlotJoined,
  getSlotPostJoined,
  getYardDetail,
} from "../../../services/userService";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useRoute } from "@react-navigation/native";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

function MyJoinPost({ yards }) {
  const route = useRoute();
  const id = route.params.id;
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

  const [postIdJoined, setPostIdJoined] = useState([]);
  const [postJoined, setPostJoined] = useState([]);
  const [numberOfSlot, setNumberOfSlot] = useState({});
  const [isLoadingData, setIsLoadingData] = useState(true);

  async function fetchData() {
    try {
      const memberCreatePostRes = await getIdMemberCreatePost(userInfo.id, id);
      const response1 = await getSlotJoined(memberCreatePostRes.result.id);
      setPostIdJoined(response1.result);

      const promises = response1.result.map(async (item) => {
        const response = await getNumberOfSlot(item.slotId);
        return {
          itemId: item.id,
          numberOfSlot: response.result,
          slotId: item.slotId,
        };
      });

      const results = await Promise.all(promises);
      const numberOfSlotMap = {};
      results.forEach((result) => {
        numberOfSlotMap[result.slotId] = result.numberOfSlot;
      });
      setNumberOfSlot(numberOfSlotMap);

      setIsLoadingData(false);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  useEffect(() => {
    if (userInfoLoaded && userInfo)
        fetchData();
  }, [userInfoLoaded, userInfo]);

  useEffect(() => {
    async function fetchPosts() {
      if (postIdJoined.length === 0) return;

      try {
        const slotIds = postIdJoined.map((item) => item.slotId);
        const promises = slotIds.map((slotId) => getSlotPostJoined(slotId));
        const responses2 = await Promise.all(promises);
        setPostJoined(responses2.map((response) => response.result));
      } catch (error) {
        console.log(error);
      }
    }

    fetchPosts();
  }, [postIdJoined]);

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

  return (
    <View style={styles.container}>
      <Text style={styles.clubTitleNewFeed}>Bài viết của bạn đã tham gia</Text>
      <ScrollView>
      {isLoadingData && <ActivityIndicator style={styles.loadingIcon} size="large" color="#0000ff" />}
      {postJoined.length === 0 ? (
        <Text style={styles.noPostsMessage}>
          Bạn chưa hoạt động tham gia, hãy tích cực tham gia nào
        </Text>
      ) : (
        postJoined.map((resultItem, index) => {
          const time = resultItem.date + "T" + resultItem.startTime + ":00";
          const targetTime = new Date(time).getTime();
          const currentTime = new Date().getTime();

          const date = new Date(resultItem.dateTime);

          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          const hours = date.getHours();
          const minutes = date.getMinutes();
          const timePost = ` ${hours}:${minutes} ${year}-${month}-${day}`;

          if (targetTime < currentTime) {
            return null;
          }

          const yardDetails = yards.find((yard) => {
            return yard.id === resultItem.yardId;
          });
          return (
            <View key={index} style={styles.mainPostContainer}>
              <View style={styles.posterName}>
                <View>
                  <Text style={{fontWeight: 'bold', fontSize: 18}}>{resultItem.memberPostName}</Text>
                  <Text>{timePost}</Text>
                </View>
                <View>
                  <CountdownTimer targetTime={time} />
                </View>
              </View>
              <Text style={styles.caption}>{resultItem.description}</Text>
              <View style={styles.postContentContainer}>
                <TouchableOpacity style={styles.postImg} onPress={() => handleImagePress(resultItem.image)}>
                    <Image style={styles.postImg} source={{ uri: resultItem.image }} />
                </TouchableOpacity>
                <View style={styles.postInfo}>
                  <Text style={styles.infoText}>Thông tin trận đấu bạn tham gia</Text>
                  <View>
                    <Text>
                      Khu: <Text style={styles.boldText}>{yardDetails?.areaName}</Text>
                    </Text>
                    <Text>
                      Sân:{" "}
                      <Text style={styles.boldText}>
                        {yardDetails?.areaName} - {resultItem.yardName}
                      </Text>
                    </Text>
                    <Text>
                      Thời gian:{" "}
                      <Text style={styles.boldText}>
                        {resultItem.startTime} - {resultItem.endTime}
                      </Text>
                    </Text>
                    <Text>
                      Date: <Text style={styles.boldText}>{resultItem.date}</Text>
                    </Text>
                    <View>
                      <Text>
                        Tổng số người chơi:{" "}
                        <Text style={styles.boldText}>
                          {parseInt(resultItem.requiredMember) +
                            parseInt(resultItem.currentMember)}
                        </Text>
                      </Text>
                      <Text>
                        Còn:{" "}
                        <Text style={styles.boldText}>
                          {resultItem.requiredMember - parseInt(numberOfSlot[resultItem.id]) || 0}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          );
        })
      )}
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
  clubTitleNewFeed: {
    height: 51,
    position: "relative",
    backgroundColor: "#e8eee7",
    borderRadius: 5,
    width: "100%",
    color: "black",
    fontWeight: "700",
    fontSize: 24,
    marginBottom: 15,
    textAlign: 'center',
    padding: 10,
  },
  loadingIcon: {
    marginTop: 20,
  },
  noPostsMessage: {
    marginTop: 20,
    fontSize: 18,
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
    fontSize: 17,
    marginBottom: 8,
  },
  postContentContainer: {
    display: "flex",
    flexDirection: "row",
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
  infoText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  boldText: {
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

  export default MyJoinPost;