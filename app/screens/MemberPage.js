import { View, StyleSheet } from "react-native";
import HeaderMember from "../components/HeaderMember";
import Footer from "../components/FooterMember";

function MemberPage() {
  return (
    <View style={styles.main}>
      <HeaderMember />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1, 
  },
});

export default MemberPage;