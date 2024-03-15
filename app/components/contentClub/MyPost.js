import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import {
  getIdMemberCreatePost,
  getMyPostInClub,
  getNumberOfSlot,
  getYardDetail,
} from "../../../services/userService";
import {
  getListMemberJoinPost,
  confirmNoJoining,
  confirmJoining,
} from "../../../services/memberService";
import CountdownTimer from "../CountdownTime";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

function MyPost({ tranPoint, inforWallet, yards }) {
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

  const [myPost, setMyPost] = useState([]);
  const [numberOfSlot, setNumberOfSlot] = useState({});
  const [memberJoinList, setMemberJoinList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  
    const fetchData = async () => {
      if (userInfoLoaded && userInfo) {
      try {
        const response1 = await getIdMemberCreatePost(userInfo.id, id);
        const memberCreatePostId = response1.result.id;

        const response2 = await getMyPostInClub(memberCreatePostId);
        setMyPost(response2.result);

        const response3Promises = response2.result.map(async (post) => {
          const response = await getListMemberJoinPost(post.id);
          return {
            postId: post.id,
            members: response.result,
            status: response.IdClubMemberSlots,
          };
        });
        const response3Results = await Promise.all(response3Promises);
        setMemberJoinList(response3Results);

        const promises = response2.result.map(async (item) => {
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
        console.log(error);
      }
    }
    }
    fetchData();
    setIsLoading(true);
  }, [userInfoLoaded, userInfo]);

  const handleConfirmJoin = async (idClubMember, idSlot, memberId) => {
    try {
      await confirmJoining(idClubMember, idSlot, {
        tranPoint: tranPoint,
        inforWallet: inforWallet,
        memberId: memberId,
      });

      const response3Promises = myPost.map(async (post) => {
        const response = await getListMemberJoinPost(post.id);
        return {
          postId: post.id,
          members: response.result,
          status: response.IdClubMemberSlots,
        };
      });

      const response3Results = await Promise.all(response3Promises);
      setMemberJoinList(response3Results);

      alert("Xác nhận thành công!");
    } catch (error) {
      console.log(error);
      alert("Lỗi!");
    }
  };

  const handleCancelJoin = async (idClubMember, idSlot) => {
    try {
      await confirmNoJoining(idClubMember, idSlot);
      const response3Promises = myPost.map(async (post) => {
        const response = await getListMemberJoinPost(post.id);
        return {
          postId: post.id,
          members: response.result,
          status: response.IdClubMemberSlots,
        };
      });

      const response3Results = await Promise.all(response3Promises);
      setMemberJoinList(response3Results);
      alert("Xác nhận không tham gia!");
    } catch (error) {
      alert("Lỗi!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.clubTitleNewFeed}>Bài viết của bạn</Text>
      <ScrollView>
      {isLoading && <ActivityIndicator style={styles.loadingIcon} size="large" color="#0000ff" />}
      {myPost.length === 0 ? (
        <Text style={styles.noPostsMessage}>Bạn chưa đăng bài, hãy cùng kiếm đồng đội nhé</Text>
      ) : (
        <>
          {myPost.map((item, index) => {
            const time = item.date + "T" + item.startTime + ":00";
            const targetTime = new Date(time).getTime();
            const currentTime = new Date().getTime();

            var isPassTime;

            if (targetTime < currentTime) {
              isPassTime = true;
            }

            const date = new Date(item.dateTime);

            const day = date.getDate(); 
            const month = date.getMonth() + 1; 
            const year = date.getFullYear(); 
            const hours = date.getHours(); 
            const minutes = date.getMinutes(); 
            const timePost = ` ${hours}:${minutes} ${year}-${month}-${day}`;

            //get yard details
            const yardDetails = yards.find((yard) => {
              return yard.id === item.yardId;
            });
            return (
              <View key={item.id} style={styles.mainPostContainer}>
                <View style={styles.posterName}>
                  <View>
                    <Text>{item.memberPostName}</Text>
                    <Text>{timePost}</Text>
                  </View>
                  {!isPassTime ? (
                  <View>
                    <CountdownTimer targetTime={time} />
                  </View>
                  ) : (
                  <View>
                      <Text style={{fontSize: 16, fontWeight: "bold"}}>Kết thúc trận đấu</Text>
                  </View>
                  )}
                </View>

                <Text style={styles.caption}>{item.description}</Text>

                <View style={styles.postContentContainer}>
                  <Image style={styles.postImg} source={{ uri: item.image }} />
                  <View style={styles.postInfo}>
                    <Text style={styles.postInfoText}>Thông tin trận đấu</Text>
                    <View>
                      <Text>Khu: <Text style={styles.boldText}>{yardDetails?.areaName}</Text></Text>
                      <Text>Sân: <Text style={styles.boldText}>{yardDetails?.sportName} - {item.yardName}</Text></Text>
                      <Text>Thời gian: <Text style={styles.boldText}>{item.startTime} - {item.endTime}</Text></Text>
                      <Text>Date: <Text style={styles.boldText}>{item.date}</Text></Text>
                      <View>
                        <Text>Tổng số người chơi: <Text style={styles.boldText}>{parseInt(item.requiredMember) + parseInt(item.currentMember)}</Text></Text>
                        <Text>Còn: <Text style={styles.boldText}>{parseInt(item.requiredMember) - parseInt(numberOfSlot[item.id] || 0)}</Text></Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View>
                  {isLoading ? (
                    <ActivityIndicator style={styles.loadingIcon} size="small" color="#0000ff" />
                  ) : (
                    <View style={styles.memberJoin}>
                      {memberJoinList
                        .filter((postItem) => postItem.postId === item.id)
                        .map((postItem) => (
                          <View
                            key={postItem.postId}
                            style={styles.memberJoinList}
                          >
                            <Text>Danh sách người chơi đã tham gia:</Text>
                            {postItem.members.length > 0 ? (
                              postItem.members.map((member) => (
                                <View key={member.id} style={styles.memberItem}>
                                  <Text>{member.memberName}</Text>
                                  <View>
                                    {isPassTime && postItem.status.map((status) => {
                                      if (status.clubMemberId === member.id) {
                                        if (status.joinStatus === "joined") {
                                          return (
                                            <View key={`${member.id}-joined`} style={styles.confirmButtons}>
                                              <TouchableOpacity
                                                onPress={() =>
                                                  handleConfirmJoin(
                                                    member.id,
                                                    item.id,
                                                    member.memberId
                                                  )
                                                }
                                              >
                                                <Text style={styles.confirmButton}>Xác nhận đã tham gia</Text>
                                              </TouchableOpacity>
                                              <TouchableOpacity
                                                onPress={() =>
                                                  handleCancelJoin(
                                                    member.id,
                                                    item.id
                                                  )
                                                }
                                              >
                                                <Text style={styles.cancelButton}>Xác nhận không tham gia</Text>
                                              </TouchableOpacity>
                                            </View>
                                          );
                                        } else if (
                                          status.joinStatus === "confirm_joined"
                                        ) {
                                          return (
                                            <TouchableOpacity style={ styles.btnConfirm }>
                                                <Text key={`${member.id}-confirm-joined`} style={styles.confirmText}>Đã tham gia</Text>
                                            </TouchableOpacity>
                                          );
                                        } else if (
                                          status.joinStatus ===
                                          "confirm_no_joined"
                                        ) {
                                          return (
                                          <TouchableOpacity style={ styles.btnCancel }>
                                            <Text key={`${member.id}-confirm-no-joined`} style={styles.cancelText}>Không tham gia</Text>
                                          </TouchableOpacity>
                                          );
                                        }
                                      }
                                      return null;
                                    })}
                                  </View>
                                </View>
                              ))
                            ) : (
                              <Text key="empty">Chưa có người chơi nào tham gia.</Text>
                            )}
                          </View>
                        ))}
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </>
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
    marginLeft: 60,
    height: 51,
    position: "relative",
    backgroundColor: "#e8eee7",
    borderRadius: 5,
    width: "70%",
    color: "black",
    fontWeight: "700",
    fontSize: 24,
    marginTop: 10,
    marginBottom: 10,
    textAlign:'center',
    padding: 8
  },
  postContainer: {
    margin: "50px auto 20px",
    height: 126,
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    textAlign: "center",
    padding: "30px 0",
    shadowColor: "#ccc",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    display: "flex",
    justifyContent: "center",
  },
  postInput: {
    borderRadius: 20,
    width: "80%",
    height: 50,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#d0cdcd",
  },
  postLine: {
    width: "90%",
    height: 2,
    backgroundColor: "#d0cdcd",
    margin: "0 auto",
  },
  h5: {
    marginLeft: 60,
  },
  mainPostContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    marginLeft:10,
    marginRight: 10
  },
  posterName: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
  },
  caption: {
    fontSize: 20,
    marginBottom: 8,
  },
  postContentContainer: {
    display: "flex",
    flexDirection: "row",
  },
  postImg: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 16,
  },
  postInfor: {
    flex: 1,
  },
  postInfoText: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 8,
  },
  btnJoin: {
    padding: "10px 50px",
    backgroundColor: "#3b6d36",
    color: "#fff",
    width: "22%",
    textAlign: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  confirmButtons:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  confirmButton: {
    padding: 10,
    margin: 5,
    backgroundColor: "#4caf50",
    color: "white",
    borderRadius: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 10,
    margin: 5,
    backgroundColor: "#f44336",
    color: "white",
    borderRadius: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  btnConfirm: {
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  confirmText: {
    color: 'white',
  },
  btnCancel: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  cancelText: {
    color: 'white',
  },
  memberJoin: {
    marginTop: 30,
  },
  span: {
    fontSize: 20,
    width: 400,
    marginRight: 30,
  },
  memberItem: {
    display: "flex",
    marginTop: 10,
  },
  noPostsMessage: {
    fontSize: 18
  }
});

export default MyPost;
