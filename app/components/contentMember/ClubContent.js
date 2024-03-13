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
      <Text style={styles.clubTitle}>Các câu lạc bộ thể thao</Text>
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
                    source={{ uri: item.image }}
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
    flex: 1,
  },
  line: {
    height: 1,
    width: "80%",
    backgroundColor: "#000",
    marginVertical: 5,
    alignSelf: "center",
  },
  clubTitle: {
    color: "#000",
    marginTop: 5,
    textAlign: "center",
    fontSize: 30,
    marginBottom: 10, 
  },
  contentMiddle: {
    flexDirection: "row",
    flexWrap: "wrap", 
    justifyContent: "center", 
  },
  imageClub: {
    height: 100,
    width: 150,
    marginBottom: 10,
  },
  club: {
    height: 200, 
    width: 160, 
    flexDirection: "column",
    justifyContent: "center", 
    alignItems: "center", 
    borderColor: "#000",
    borderWidth: 1,
    padding: 10,
    margin: 10, 
  },
  clubName: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center", 
    marginTop: 10, 
  },
});


export default ClubContent;