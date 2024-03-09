import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from "react-native";
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
import CountdownTimer from "../../component/countDownTime";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

function MyPost({ tranPoint, inforWallet, yards }) {
  const route = useRoute();
  const id = route.params.id;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [myPost, setMyPost] = useState([]);
  const [numberOfSlot, setNumberOfSlot] = useState({});
  const [memberJoinList, setMemberJoinList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
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

    fetchData();
    setIsLoading(true);
  }, [id, userInfo.id]);

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

      showSuccessToast("Confirm successful!");
    } catch (error) {
      console.log(error);
      showErrorToast("Confirm failed!");
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
      showSuccessToast("Cancel successful!");
    } catch (error) {
      showErrorToast("Cancel failed!");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Bài viết của bạn</Text>
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

            const day = date.getDate(); // Lấy ngày trong tháng (1-31)
            const month = date.getMonth() + 1; // Lấy tháng (0-11), cộng thêm 1 vì tháng bắt đầu từ 0
            const year = date.getFullYear(); // Lấy năm
            const hours = date.getHours(); // Lấy giờ trong ngày (0-23)
            const minutes = date.getMinutes(); // Lấy phút (0-59)
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
                  <View>
                    <CountdownTimer targetTime={time} />
                  </View>
                </View>

                <Text style={styles.caption}>{item.description}</Text>

                <View style={styles.postContentContainer}>
                  <Image style={styles.postImg} source={{ uri: item.image }} />
                  <View style={styles.postInfo}>
                    <Text style={styles.infoText}>Thông tin trận đấu</Text>
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
                                  <Text>{member.memberName}</Text>{" "}
                                  <View>
                                    {postItem.status.map((status) => {
                                      if (status.clubMemberId === member.id) {
                                        if (status.joinStatus === "joined") {
                                          return (
                                            <View key={`${member.id}-joined`} style={styles.confirmButtons}>
                                              <TouchableOpacity
                                                style={styles.confirmButton}
                                                onPress={() =>
                                                  handleConfirmJoin(
                                                    member.id,
                                                    item.id,
                                                    member.memberId
                                                  )
                                                }
                                              >
                                                <Text style={styles.buttonText}>Xác nhận đã tham gia</Text>
                                              </TouchableOpacity>
                                              <TouchableOpacity
                                                style={styles.cancelButton}
                                                onPress={() =>
                                                  handleCancelJoin(
                                                    member.id,
                                                    item.id
                                                  )
                                                }
                                              >
                                                <Text style={styles.buttonText}>Xác nhận không tham gia</Text>
                                              </TouchableOpacity>
                                            </View>
                                          );
                                        } else if (
                                          status.joinStatus === "confirm_joined"
                                        ) {
                                          return (
                                            <Text key={`${member.id}-confirm-joined`} style={styles.confirmText}>Đã tham gia</Text>
                                          );
                                        } else if (
                                          status.joinStatus ===
                                          "confirm_no_joined"
                                        ) {
                                          return (
                                            <Text key={`${member.id}-confirm-no-joined`} style={styles.cancelText}>Không tham gia</Text>
                                          );
                                        }
                                      }
                                      return null;
                                    })}
                                  </View>
                                </View>
                              ))
                            ) : (
                              <Text>Chưa có người chơi nào tham gia.</Text>
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
    position: "fixed",
    backgroundColor: "#e8eee7",
    padding: "5px 40px",
    borderRadius: 5,
    width: "70%",
    color: "#fff",
    fontWeight: "700",
    fontSize: 24,
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
  p: {
    margin: 0,
    fontWeight: "bold",
    fontSize: 24,
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
    width: "16%",
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginRight: 20,
  },
  postInfor: {
    paddingLeft: 50,
    width: "auto",
    textAlign: "left",
    backgroundColor: "white",
    marginLeft: 20,
    borderWidth: 1,
    borderColor: "#bebaba",
    paddingBottom: 10,
    display: "flex",
    flexDirection: "column",
  },
  h3: {
    marginBottom: 20,
    fontWeight: "bold",
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
  b: {
    fontSize: 24,
    fontWeight: "400",
  },
  confirm: {
    width: 50,
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    color: "orange",
    fontSize: 18,
  },
  confirmButton: {
    border: "none",
    borderRadius: 4,
    padding: "8px 16px",
    marginRight: 8,
    cursor: "pointer",
    backgroundColor: "#4caf50",
    color: "white",
  },
  cancelButton: {
    border: "none",
    borderRadius: 4,
    padding: "8px 16px",
    marginRight: 8,
    cursor: "pointer",
    backgroundColor: "#f44336",
    color: "white",
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
    alignItems: "center",
    marginTop: 10,
  },
});

export default MyPost;
