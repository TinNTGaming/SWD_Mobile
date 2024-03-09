import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet  } from "react-native";
import { checkMemberJoinClub, getDetailClub, MemberJoinClub, MemberLeavingClub, getIdMemberCreatePost } from "../../services/userService";
import image1 from "../assets/Sport/badminton.jpg";
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ClubPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [userInfo, setUserInfo] = useState(null);

  const [clubDetail, setClubDetail] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [memberCreatePostId, setMemberCreatePostId] = useState(null);


  const getUserInfo = async()=>{
    try {
        const value = await AsyncStorage.getItem('userInfo')
        if(value !== null) {
          setUserInfo(JSON.parse (value));          
        }
      } catch(e) {
        console.log(e);
      }
  };

  const fetchClubDetail = async () => {
    try {
      const response = await getDetailClub(route.params.clubId);      
      setClubDetail(response.result);

      const response2 = await checkMemberJoinClub(userInfo.id, route.params.clubId);
      setIsJoined(response2.result == 1 ? true : false);

      if (response2.result == 1) {
        const memberCreatePostRes = await getIdMemberCreatePost(
          userInfo.id, 
          route.params.clubId
        );
        setMemberCreatePostId(memberCreatePostRes.result.id);
      }
    } catch (error) {
      console.error("Error fetching club detail:", error);   
    }
  };

  const handleJoinClub = async () => {
    await MemberJoinClub({
      memberId: userInfo.id,
      memberName: userInfo.name,
      clubId: clubDetail.id,
      clubName: clubDetail.name,
    });

    setIsJoined(true);
    alert("Join Club Success");
    setClubDetail((prevClubDetail) => ({
      ...prevClubDetail,
      countMember: prevClubDetail.countMember + 1,
    }));

    // navigation.navigate("YourNextScreen"); // Replace with your desired navigation destination
  };

  const handleLeaveClub = async () => {
    Alert.alert(
      "Confirm",
      "Bạn có chắc chắn muốn rời club?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            await MemberLeavingClub({
              memberId: userInfo.id,
              clubId: route.params.clubId,
            });
            setIsJoined(false);

            setClubDetail((prevClubDetail) => ({
              ...prevClubDetail,
              countMember: prevClubDetail.countMember - 1,
            }));
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      await getUserInfo(); // Gọi getUserInfo trong useEffect để đảm bảo userInfo đã được cập nhật
      fetchClubDetail(); // Sau khi userInfo đã được cập nhật, gọi fetchClubDetail
    };
    fetchData();
  }, [route.params.clubId]);

  if (!clubDetail) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.containerClub}>      
      <View style={styles.clubHeader}>
        <Image source={{ uri: clubDetail.image }} style={{ width: 200, height: 200 }} />
        <Text style={styles.clubHeaderText}>Câu Lạc Bộ {clubDetail.name}</Text>
        <Text>{clubDetail.countMember} thành viên</Text>
        
        {isJoined ? (
          <View>
            <TouchableOpacity onPress={() => navigation.navigate(`MainClubPage/${clubDetail.id}/${memberCreatePostId}`)}>
              <Text style={styles.btn}>Tham quan</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLeaveClub}>
              <Text style={[styles.btn, styles.leaveBtn]}>Muốn rời nhóm</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handleJoinClub}>
            <Text style={styles.btn}>Tham gia</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.mainClub}>
      <TouchableOpacity onPress={() => navigation.navigate('MemberPage')}> 
        <Text style={styles.btn}>Quay Lại</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerClub: {
    flex: 1,
    backgroundColor: '#FEF7F7',
    padding: 10,
  },
  clubHeader: {
    flex: 1,
    backgroundColor: '#FEF7F7',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  clubHeaderText: {
    fontSize: 24,
    paddingTop: 20,
    margin: 0,
  },
  btn: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
  },
  leaveBtn: {
    backgroundColor: '#dbdbdb',
  },
  mainClub: {
    flex: 1,
    alignItems: 'center',
  },
});


export default ClubPage;