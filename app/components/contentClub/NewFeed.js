import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import ModalCreatePost from "../../component/modal/ModalCreatePost";
import { getDetailClub, getPostInClub, createPostInSlot, UserJointSlot, getTranPoint, getSlotJoined, getNumberOfSlot, getWalletByMemberId, getYardDetail } from "../../services/userService";
import { useRoute } from "@react-navigation/native";
import { showErrorToast, showSuccessToast } from "../../component/toast/toast";

function NewFeed() {
  const route = useRoute();
  const id = route.params.id;
  const idclubmem = route.params.idclubmem;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [clubDetail, setClubDetail] = useState({});
  const [slotsInClub, setSlotsInClub] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tranPoint, setTranPoint] = useState(null);
  const [numberOfSlot, setNumberOfSlot] = useState({});
  const [slotJoined, setSlotJoined] = useState([]);
  const [inforWallet, setInforWallet] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [yardDetails, setYardDetails] = useState([]);

  async function fetchData() {
    try {
      const [clubDetailRes, slotsInClubRes, slotJoinedRes, tranPointRes] = await Promise.all([
        getDetailClub(id),
        getPostInClub(id),
        getSlotJoined(idclubmem),
        getTranPoint()
      ]);

      setTranPoint(tranPointRes.result);
      setClubDetail(clubDetailRes.result);
      setSlotsInClub(slotsInClubRes.result);
      setSlotJoined(slotJoinedRes.result);

      const promises = slotsInClubRes.result.map(async (item) => {
        const response = await getNumberOfSlot(item.id);
        return { itemId: item.id, numberOfSlot: response.result };
      });

      const results = await Promise.all(promises);
      const numberOfSlotMap = {};
      results.forEach((result) => {
        numberOfSlotMap[result.itemId] = result.numberOfSlot;
      });
      setNumberOfSlot(numberOfSlotMap);

      const walletRes = await getWalletByMemberId(userInfo.id);
      setInforWallet(walletRes.result);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const details = await Promise.all(slotsInClub.map((item) => getYardDetail(item.yardId)));
      setYardDetails(details);
    };

    fetchData();
  }, [slotsInClub]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCreatePost = async (postData) => {
    postData.memberPostName = userInfo.name;
    postData.clubId = id;
    postData.memberPostId = idclubmem;
    try {
      await createPostInSlot(postData);
      showSuccessToast("Create post successfully!");
      setIsModalOpen(false);
      setIsLoading(true);
      fetchData();
    } catch (error) {
      showErrorToast("Create post error!");
      console.error("Error creating post:", error);
    }
  };

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

      // Refresh page
      fetchData();
    } catch (error) {
      showErrorToast("Error joining slot!");
      console.error("Error joining slot:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.clubTitle}>{clubDetail.name}</Text>

      <TouchableOpacity style={styles.postContainer} onPress={toggleModal}>
        <Image source={{uri: userInfo.image}} style={styles.avatar} />
        <Text style={styles.writeBtn}>
          <Text>{userInfo.name} ơi</Text>
          <Text style={{ marginLeft: 5 }}>Bạn đang muốn gì thế?</Text>
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Bài viết mới nhất</Text>

      {isLoading && <ActivityIndicator style={styles.loadingIcon} size="large" color="#0000ff" />}

      {slotsInClub.map((item, index) => {
        if (item.memberPostId == idclubmem) {
          return null;
        }

        const isJoined = slotJoined.some((joinedSlot) => joinedSlot.slotId === item.id);

        if (isJoined) return null;

        const remainingSlots = parseInt(item.requiredMember) - parseInt(numberOfSlot[item.id] || 0);
        const isFull = remainingSlots <= 0;

        return (
          <View key={item.id} style={styles.mainPostContainer}>
            <View style={styles.posterName}>
              <Text>{item.memberPostName}</Text>
              <Text>{item.dateTime}</Text>
            </View>
            <Text style={styles.caption}>{item.description}</Text>
            <View style={styles.postContentContainer}>
              <Image source={{uri: item.image}} style={styles.postImg} />
              <View style={styles.postInfo}>
                <Text style={styles.postInfoText}>Thông tin trận đấu</Text>
                <Text>Khu: {yardDetails[index]?.result.areaName}</Text>
                <Text>Sân: {yardDetails[index]?.result.sportName} - {item.yardName}</Text>
                <Text>Thời gian: {item.startTime} - {item.endTime}</Text>
                <Text>Date: {item.date}</Text>
                <Text>Tổng số người chơi: {parseInt(item.requiredMember) + parseInt(item.currentMember)}</Text>
                <Text>Còn: {parseInt(item.requiredMember) - parseInt(numberOfSlot[item.id] || 0)}</Text>
                {isFull ? (
                  <TouchableOpacity style={[styles.btnJoin, {backgroundColor: 'gray'}]} disabled>
                    <Text>Full</Text>
                  </TouchableOpacity>
                ) : isJoined ? (
                  <TouchableOpacity style={styles.btnJoin} disabled>
                    <Text>Joined</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.btnJoin} onPress={() => handleJoinSlot(item.id)}>
                    <Text>Join</Text>
                  </TouchableOpacity>
                  )}
                  </View>
                </View>
              </View>
            );
          })}
          <ModalCreatePost isOpen={isModalOpen} toggle={toggleModal} createPost={handleCreatePost} />
        </View>
      );
    }
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
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