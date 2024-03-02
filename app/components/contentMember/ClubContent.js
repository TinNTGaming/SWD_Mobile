import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { getAllClub } from "../../../services/userService";

function ClubContent() {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    fetchApiClubs();
  }, []);

  const fetchApiClubs = async () => {
    try {
      let data = await getAllClub();
      setClubs(data.result);
    } catch (error) {
      setClubs([]);
      console.log(error);
    }
  };

  const handleClick = (clubId) => {
    navigation.navigate("MemberSport", { clubId });
  };

  return (
    <View style={styles.containerClub1}>
      <View style={styles.line}></View>
      <Text style={styles.clubTitle}>Sport clubs</Text>
      <View style={styles.contentMiddle}>
        {clubs &&
          clubs.map((item, index) => {
            if (item.status && item.status.data && item.status.data[0] === 1) {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.club}
                  onPress={() => handleClick(item.id)}
                >
                  <Image
                    style={styles.imageClub}
                    source={require("../../assets/Sport/badminton.jpg")}
                  />
                  <Text style={styles.clubName} onPress={() => handleClick(item.id)}>
                    Club Name: {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  containerClub1: {
    backgroundColor: "#fff",
    height: "100%",
    flexDirection: "column",
  },
  line: {
    height: 1,
    width: "80%",
    backgroundColor: "#000",
    margin: 100,
    alignSelf: "center",
  },
  clubTitle: {
    color: "#000",
    marginTop: 80,
    textAlign: "center",
  },
  contentMiddle: {
    height: "auto",
    marginTop: 50,
  },
  imageClub: {
    borderRadius: 10,
    height: 250,
    width: 350,
    marginBottom: 20,
  },
  club: {
    height: "auto",
    flexDirection: "column",
    textAlign: "center",
    borderColor: "#000",
    borderWidth: 1,
    padding: 20,
  },
  clubName: {
    fontWeight: "bold",
    fontSize: 18,
    textDecorationLine: "none",
  },
});

export default ClubContent;