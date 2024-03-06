import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView} from "react-native";
import { getAllClub } from "../../../services/userService";
import { useNavigation } from '@react-navigation/native';

function ClubContent() {
  const [clubs, setClubs] = useState([]);
  const navigation = useNavigation();
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
    navigation.navigate("ClubPage", { clubId });
  };

  return (
    <View style={styles.containerClub1}>
      <View style={styles.line}></View>
      <Text style={styles.clubTitle}>Sport clubs</Text>
      <ScrollView horizontal={false}>
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
      </ScrollView>
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
    margin: 5,
    alignSelf: "center",
  },
  clubTitle: {
    color: "#000",
    marginTop: 5,
    textAlign: "center",
    fontSize: 30
  },
  contentMiddle: {
    marginTop: 30,
    flexDirection: 'row',
    padding: 10,
    gap: 10
  },
  imageClub: {
    height: 100,
    width: 150,
    marginBottom: 20,
  },
  club: {
    height: 170,
    flexDirection: "column",
    textAlign: "center",
    borderColor: "#000",
    borderWidth: 1,
    padding: 20,
  },
  clubName: {
    fontWeight: "bold",
    fontSize: 16,
    textDecorationLine: "none",
  },
});

export default ClubContent;