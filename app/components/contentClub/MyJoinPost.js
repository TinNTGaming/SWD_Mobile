import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
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

  return (
    <View style={styles.newFeedContainer}>
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
                <Text>{resultItem.memberPostName}</Text>
                <View>
                  <Text>{timePost}</Text>
                  <CountdownTimer targetTime={time} />
                </View>
              </View>
              <Text style={styles.caption}>{resultItem.description}</Text>
              <View style={styles.postContentContainer}>
                <Image style={styles.postImg} source={{ uri: resultItem.image }} />
                <View style={styles.postInfo}>
                  <Text style={styles.infoText}>Thông tin trận đấu bạn tham gia</Text>
                  <View>
                    <Text>
                      Khu: <Text style={styles.boldText}>{yardDetails?.areaName}</Text>
                    </Text>
                    <Text>
                      Sân:{" "}
                      <Text style={styles.boldText}>
                        {yardDetails?.sportName} - {resultItem.yardName}
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
    </View>
  );
}

const styles = StyleSheet.create({
  newFeedContainer: {
    width: "80%",
    backgroundColor: "#fff",
  },
  clubTitleNewFeed: {
    height: 51,
    position: "fixed",
    backgroundColor: "#e8eee7",
    borderRadius: 5,
    width: "100%",
    color: "black",
    fontWeight: "700",
    fontSize: 24,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    marginLeft: 37,
    padding: 10
  },
  loadingIcon: {
    marginTop: 20,
  },
  noPostsMessage: {
    marginLeft: 60,
    marginTop: 20,
    fontSize: 18,
  },
  mainPostContainer: {
    height: "auto",
    padding: 20,
    width: "90%",
    backgroundColor: "white",
    margin: "50px auto",
    borderRadius: 10,
    shadowColor: "#ccc",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  posterName: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "100%",
    padding: 10,
    marginBottom: 10,
  },
  caption: {
    fontSize: 20,
    marginBottom: 20,
    marginLeft: 30,
  },
  postContentContainer: {
    marginLeft: 30,
    display: "flex",
  },
  postImg: {
      width: 150,
      height: 150,
      borderRadius: 5,
      marginRight: 20,
    },
    postInfo: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: "70%",
    },
    infoText: {
      fontSize: 18,
      marginBottom: 10,
    },
    boldText: {
      fontWeight: "bold",
    },
  });

  export default MyJoinPost;