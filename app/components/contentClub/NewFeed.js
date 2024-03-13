import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import {
  UserJointSlot,
  getNumberOfSlot,
  getSlotNotJoined
  } from "../../../services/userService";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountdownTimer from '../CountdownTime';

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
  }

  return (
    <View style={styles.container}>
      <Text style={styles.clubTitle}>{clubDetail.name}</Text>

        <TouchableOpacity style={styles.postContainer} onPress={() => navigation.navigate('CreatePostPage', { clubDetail, idclubmem })}>
        <Image source={userInfo && userInfo.image ? { uri: userInfo.image } : null} style={styles.avatar} />
        <Text style={styles.writeBtn}>
          <Text>{userInfo ? userInfo.name : 'Guest'} ơi! </Text>
          <Text style={{ marginLeft: 5 }}>Bạn đang muốn gì thế?</Text>
        </Text>
      </TouchableOpacity>

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
        const yardDetails = yards.find((yard) => {
          return yard.id === item.yardId;
        });

        return (
          <View key={item.id} style={styles.mainPostContainer}>
            <View style={styles.posterName}>
              <Text>{item.memberPostName}</Text>
              <Text>{timePost}</Text>
            </View>
            <Text><CountdownTimer targetTime={time} /></Text>
            <Text style={styles.caption}>{item.description}</Text>
            <View style={styles.postContentContainer}>
              <Image source={{uri: item.image}} style={styles.postImg} />
              <View style={styles.postInfo}>
                <Text style={styles.postInfoText}>Thông tin trận đấu</Text>
                <Text>Khu: {yardDetails?.areaName}</Text>
                <Text>Sân: {yardDetails?.sportName} - {item.yardName}</Text>
                <Text>Thời gian: {item.startTime} - {item.endTime}</Text>
                <Text>Date: {item.date}</Text>
                <Text>Tổng số người chơi: {parseInt(item.requiredMember) + parseInt(item.currentMember)}</Text>
                <Text>Còn thiếu: {parseInt(item.requiredMember) - parseInt(numberOfSlot[item.id] || 0)} người</Text>
                {isFull ? (
                  <TouchableOpacity style={[styles.btnJoin, {backgroundColor: 'gray'}]} disabled>
                    <Text>Đã đủ người</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.btnJoin} onPress={() => handleJoinSlot(item.id)}>
                    <Text>Tham gia</Text>
                  </TouchableOpacity>
                  )}
                  </View>
                </View>
              </View>
            );
          })}
          </ScrollView>
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
      clubTitleNewFeed: {
        marginLeft: "15%",
        height: 44,
        position: "absolute",
        backgroundColor: "#a4ce9f",
        padding: "5px 40px",
        borderRadius: 5,
        width: "70%",
        color: "#fff",
      },
      postContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
      },
      avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
      },
      writeBtn: {
        marginLeft: 10,
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
      },
      postContentContainer: {
        flexDirection: "row",
      },
      postImg: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 16,
      },
      postInfo: {
        flex: 1,
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
});

export default NewFeed;
