import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet} from "react-native";
import {
  checkMemberJoinClub,
  getDetailClub,
  MemberJoinClub,
  MemberLeavingClub,
  getIdMemberCreatePost,
} from "../../services/userService";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ClubPage = ({ route, navigation }) => {
    const [userInfo, setUserInfo] = useState(null);
  const { id } = route.params;
  const [clubDetail, setClubDetail] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [memberCreatePostId, setMemberCreatePostId] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("userInfo")
      .then(userInfoString => {
        const parsedUserInfo = JSON.parse(userInfoString);
        setUserInfo(parsedUserInfo);
      })
      .catch(error => {
        console.error("Error fetching user info:", error);
      });
  }, []);

  const fetchClubDetail = async () => {
    try {
      const response = await getDetailClub(id);
      setClubDetail(response.result);

      const response2 = await checkMemberJoinClub(user.id, id);
      setIsJoined(response2.result == 1 ? true : false);

      if (response2.result == 1) {
        const memberCreatePostRes = await getIdMemberCreatePost(
          userInfo.id,
          id
        );
        setMemberCreatePostId(memberCreatePostRes.result.id);
        console.log(memberCreatePostRes);
      }
    } catch (error) {
      console.error("Error fetching club detail:", error);
    }
  };

  const handleJoinClub = async () => {
    await MemberJoinClub({
      memberId: user.id,
      memberName: user.name,
      clubId: clubDetail.id,
      clubName: clubDetail.name,
    });

    setIsJoined(true);
    alert("Join Club Success");
    setClubDetail((prevClubDetail) => ({
      ...prevClubDetail,
      countMember: prevClubDetail.countMember + 1,
    }));

    // Gọi hàm navigation.navigate để điều hướng đến trang khác
    navigation.navigate("ClubDetail", {
      clubId: clubDetail.id,
      memberCreatePostId: memberCreatePostId,
    });
  };

  const handleLeaveClub = async () => {
    const confirmLeave = window.confirm("Bạn có chắc chắn muốn rời club?");
    if (confirmLeave) {
      await MemberLeavingClub({
        memberId: user.id,
        clubId: id,
      });
      setIsJoined(false);

      setClubDetail((prevClubDetail) => ({
        ...prevClubDetail,
        countMember: prevClubDetail.countMember - 1,
      }));
    }
  };

  useEffect(() => {
    fetchClubDetail();
  }, [id]);

  if (!clubDetail) {
    return <View>Loading...</View>;
  }

  return (
    <View style={styles.containerClub}>
      <View style={styles.mainClub}>
        <View style={styles.clubHeader}>
          <Image
            style={styles.imgBackground}
            source={{ uri: image1 }} // Đảm bảo thay thế đúng đường dẫn hình ảnh
          />
          <Text>Câu Lạc Bộ {clubDetail.name}</Text>
          <Text>{clubDetail.countMember} thành viên</Text>
          <View>
            {isJoined ? (
              <View>
                <TouchableOpacity
                  style={styles.viewBtn}
                  onPress={() =>
                    navigation.navigate("MainClub", {
                      clubId: clubDetail.id,
                      memberCreatePostId: memberCreatePostId,
                    })
                  }
                >
                  <Text>Tham quan</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.leaveBtn}
                  onPress={handleLeaveClub}
                >
                  <Text>Muốn rời nhóm</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.joinBtn}
                onPress={handleJoinClub}
              >
                <Text>Tham gia</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
    containerClub: {
      flex: 1,
      flexDirection: 'row',
    },
    mainClub: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    clubHeader: {
      backgroundColor: '#FEF7F7',
      width: '80%',
      height: '80%',
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imgBackground: {
      width: '100%',
      height: '50%',
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 10,
    },
    viewBtn: {
      backgroundColor: '#96dad1',
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#000',
      marginRight: 10,
    },
    leaveBtn: {
      backgroundColor: '#dbdbdb',
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#000',
    },
    postContent: {
      flex: 1,
      backgroundColor: '#dbdbdb',
      borderRadius: 20,
      paddingTop: 10,
      alignItems: 'center',
    },
    contentPost: {
      width: '80%',
      height: 120,
      backgroundColor: '#fff',
      marginVertical: 15,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 0,
    },
    imgPost: {
      width: '40%',
      height: '90%',
      padding: 10,
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 10,
    },
    post: {
      width: '60%',
      padding: 20,
    },
    inforPost: {
      backgroundColor: '#d7d7d7',
      width: '80%',
      fontSize: 18,
    },
  });

export default ClubPage;