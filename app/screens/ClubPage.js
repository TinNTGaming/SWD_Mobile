import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet  } from "react-native";
import { checkMemberJoinClub, getDetailClub, MemberJoinClub, MemberLeavingClub, getIdMemberCreatePost } from "../../services/userService";
import image1 from "../assets/Sport/badminton.jpg";
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ClubPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [userInfo, setUserInfo] = useState('');

  const [clubDetail, setClubDetail] = useState('');
  const [isJoined, setIsJoined] = useState('');
  const [memberCreatePostId, setMemberCreatePostId] = useState('');


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
  getUserInfo();

  const fetchClubDetail = async () => {
    try {
      const response = await getDetailClub('1');
      console.log(response);
      setClubDetail(response.result);

      const response2 = await checkMemberJoinClub(userInfo.id, '1');
      setIsJoined(response2.result == 1 ? true : false);

      if (response2.result == 1) {
        const memberCreatePostRes = await getIdMemberCreatePost(userInfo.id, '1');
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
              clubId: route.params,
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
    fetchClubDetail();
  }, [route.params]);

  if (!clubDetail) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1 }}>      

      <View style={{ flex: 9, alignItems: "center" }}>
        <Image source={image1} style={{ width: 200, height: 200 }} />
        <Text>Câu Lạc Bộ {clubDetail.name}</Text>
        <Text>{clubDetail.countMember} thành viên</Text>
        
        {isJoined ? (
          <View>
            <TouchableOpacity onPress={() => navigation.navigate(`MainClub/${clubDetail.id}/${memberCreatePostId}`)}>
              <Text>Tham quan</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLeaveClub}>
              <Text>Muốn rời nhóm</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handleJoinClub}>
            <Text>Tham gia</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerClub: {
    flex: 1,
    flexDirection: 'row',
  },
  sideBar: {
    flex: 1,
    backgroundColor: '#95B491',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideBarText: {
    padding: 20,
    fontSize: 18,
  },
  clubHeader: {
    flex: 4,
    backgroundColor: '#FEF7F7',
    width: '80%',
    height: 400,
    paddingBottom: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clubHeaderText: {
    fontSize: 24,
    paddingTop: 20,
    margin: 0,
  },
  createPost: {
    backgroundColor: '#95B491',
    padding: 20,
    marginRight: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    fontWeight: 'bold',
  },
  btn: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    fontWeight: 'bold',
  },
  viewBtn: {
    marginRight: 10,
    backgroundColor: '#96dad1',
  },
  leaveBtn: {
    backgroundColor: '#dbdbdb',
  },
  mainClub: {
    flex: 6,
    alignItems: 'center',
  },
  imgBackground: {
    width: '80%',
    height: 200,
    borderWidth: 1,
    borderRadius: 10,
  },
  postContent: {
    flex: 1,
    backgroundColor: '#dbdbdb',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  contentPost: {
    width: '80%',
    height: 300,
    backgroundColor: '#fff',
    marginVertical: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  imgPost: {
    width: '40%',
    height: '90%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  post: {
    width: '60%',
    padding: 20,
  },
  postText: {
    fontSize: 18,
  },
  inforPost: {
    backgroundColor: '#d7d7d7',
    width: '80%',
    fontSize: 18,
    padding: 10,
  },
  inforPostText: {
    fontSize: 24,
  },
});


export default ClubPage;