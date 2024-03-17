import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, YellowBox } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faNewspaper, faEnvelope } from "@fortawesome/free-regular-svg-icons";

import {
  getTranPoint,
  getWalletByMemberId,
  getYards,
  getDetailClub
} from "../../services/userService";

import NewFeed from "../components/contentClub/NewFeed";
import MyPost from "../components/contentClub/MyPost";
import MyJoinPost from "../components/contentClub/MyJoinPost";
import HistoryPage from "../components/contentClub/HistoryPage";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

console.disableYellowBox = true;

const MainClubPage = () => {
  const [activeTab, setActiveTab] = useState('newFeed');
  const navigation = useNavigation();
  const route = useRoute();
  const id = route.params.id;
  const idclubmem = route.params.idclubmem;

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

  const [inforWallet, setInforWallet] = useState({});
  const [tranPoint, setTranPoint] = useState({});
  const [yards, setYards] = useState({});
  const [clubDetail, setClubDetail] = useState({});


  useEffect(() => {
  if (userInfoLoaded && userInfo) {
      const fetchWalletData = async () => {
        try {
          // Sử dụng Promise.all để gửi các yêu cầu cùng một lúc
          const [walletRes, tranPointRes, yardsRes, clubDetailRes] = await Promise.all([
            getWalletByMemberId(userInfo.id),
            getTranPoint(),
            getYards(),
            getDetailClub(id),
          ]);

          // Đặt thông tin ví, điểm giao dịch và các khu vực vào trạng thái
          setInforWallet(walletRes.result);
          setTranPoint(tranPointRes.result);
          setYards(yardsRes.result);
          //console.log(clubDetailRes);
          setClubDetail(clubDetailRes.result);
        } catch (error) {
          console.error("Error fetching wallet data:", error);
        }
      };
      fetchWalletData();
    }
    }, [userInfoLoaded, userInfo]);
    //console.log(tranPoint);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <View style={styles.mainClubContainer}>
      <View style={styles.sideBarMain}>

        <TouchableOpacity style={styles.tabBtn} onPress={() => navigation.navigate('MemberPage')}>
            <View>
                <FontAwesomeIcon icon={faHome}/>
            </View>
            <Text style={styles.text}>Trang chủ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "newFeed" && styles.activeTab]}
          onPress={() => handleTabClick("newFeed")}
        >
          <View style={styles.icon}>
            <FontAwesomeIcon icon={faNewspaper} />
          </View>
          <Text style={styles.text}>Bảng tin</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "myPost" && styles.activeTab]}
          onPress={() => handleTabClick("myPost")}
        >
          <FontAwesomeIcon icon={faEnvelope} />
          <Text style={styles.text}>Bài đăng của tôi</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "myJoinPost" && styles.activeTab]}
          onPress={() => handleTabClick("myJoinPost")}
        >
          <FontAwesomeIcon icon={faEnvelope} />
          <Text style={styles.text}>Bài đăng tham gia</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "myHistory" && styles.activeTab]}
          onPress={() => handleTabClick("myHistory")}
        >
          <FontAwesomeIcon icon={faEnvelope} />
          <Text style={styles.text}>Ví</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        {activeTab === "newFeed" && <NewFeed
                                    inforWallet={inforWallet}
                                    tranPoint={tranPoint}
                                    yards={yards}
                                    setActiveTab={setActiveTab}
                                    clubDetail={clubDetail}/>}
        {activeTab === "myPost" && <MyPost
                                   tranPoint={tranPoint}
                                   inforWallet={inforWallet}
                                   yards={yards}/>}
        {activeTab === "myJoinPost" && <MyJoinPost
                                        yards={yards}/>}
        {activeTab === "myHistory" && <HistoryPage />}
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  mainClubContainer: {
    flex: 1,
    flexDirection: "column",
    paddingTop: 20,
  },
  sideBarMain: {
    flexDirection: "row",
    backgroundColor: "#fff",
    height: 80,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: "#e9e1e1",
    borderTopColor: "#e9e1e1",
  },
  tabBtn: {
    flex:1,
    width: "20%",
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e9e1e1",
    justifyContent:'center',
    alignItems:'center',
  },
  tabBtnText: {
    fontWeight: "bold",
  },
  activeTab: {
    backgroundColor: "#cad4c9",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text:{
    textAlign: 'center',
    fontWeight: "bold",
  }
});

export default MainClubPage;