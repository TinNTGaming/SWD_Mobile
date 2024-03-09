import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faNewspaper, faEnvelope } from "@fortawesome/free-regular-svg-icons";

import NewFeed from "../components/contentClub/NewFeed";
import MyPost from "../components/contentClub/MyPost";
import MyJoinPost from "../components/contentClub/MyJoinPost";
import HistoryPage from "../components/contentClub/HistoryPage";
import { useNavigation, useRoute } from "@react-navigation/native";

const MainClubPage = () => {
  const [activeTab, setActiveTab] = useState('newFeed');
  const navigation = useNavigation();
  const route = useRoute();
  const id = route.params.id;
  const idclubmem = route.params.idclubmem;

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <View style={styles.mainClubContainer}>
      <View style={styles.sideBarMain}>
        <TouchableOpacity style={styles.tabBtn} onPress={() => navigation.navigate('MemberPage')}>
          <FontAwesomeIcon icon={faHome} />
          <Text>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "newFeed" && styles.activeTab]}
          onPress={() => handleTabClick("newFeed")}
        >
          <FontAwesomeIcon icon={faNewspaper} />
          <Text>New feed</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "myPost" && styles.activeTab]}
          onPress={() => handleTabClick("myPost")}
        >
          <FontAwesomeIcon icon={faEnvelope} />
          <Text>My posted</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "myJoinPost" && styles.activeTab]}
          onPress={() => handleTabClick("myJoinPost")}
        >
          <FontAwesomeIcon icon={faEnvelope} />
          <Text>Posts joined</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "myHistory" && styles.activeTab]}
          onPress={() => handleTabClick("myHistory")}
        >
          <FontAwesomeIcon icon={faEnvelope} />
          <Text>History</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        {activeTab === "newFeed" && <NewFeed />}
        {activeTab === "myPost" && <MyPost />}
        {activeTab === "myJoinPost" && <MyJoinPost />}
        {activeTab === "myHistory" && <HistoryPage />}
      </View>
      
    </View>
  );
};

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
    width: "20%",
    paddingVertical: 20,
    paddingHorizontal: 10,
    fontWeight: "bold",
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e9e1e1",
  },
  tabBtnText: {
    fontWeight: "bold",
  },
  activeTab: {
    backgroundColor: "#cad4c9",
  },
  contentContainer: {
    flex: 1, // Nội dung chiếm phần còn lại của mainClubContainer
    backgroundColor: "#fff", // Màu nền nếu cần
  },
});

export default MainClubPage;