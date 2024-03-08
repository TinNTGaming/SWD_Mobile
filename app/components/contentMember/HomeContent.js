import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';

import image from '../../assets/LogoHeaderMember/logo.jpg';
import image1 from '../../assets/Sport/badminton.jpg';
import image2 from '../../assets/Sport/football.jpg';
import image3 from '../../assets/Sport/ball.jpg';

function HomeContent() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.homeHeaderBanner}>
        <View style={styles.contentUp}>
          <Image source={image} style={styles.headerImage} />
        </View>
        <View style={styles.contentDown}>
          <Text style={styles.content1}>What is this website used for?</Text>
          <Text style={styles.content2}>
            Hiện nay, tại các tòa chung cư Vinhome có các sân thể thao như cầu lông, bóng rổ, bóng đá. Khi mọi người muốn dùng các sân này cần phải đặt trước để giữ chỗ. Nhưng vì người sử dụng đông nên đôi lúc việc đặt sân rất khó khăn.
          </Text>
          <Text style={styles.content2}>
            Bên cạnh đó, một số người ở tại Vinhome đặt được sân nhưng lại thiếu người chơi. Do đó chúng tôi đã phát triển một ứng dụng cho các câu lạc bộ thể thao, mỗi môn thể thao sẽ tương ứng với một câu lạc bộ.
          </Text>
          <Text style={styles.content2}>
            Với nền tảng này, những người đặt được sân có thể mời gọi mọi người tham gia chơi cùng...
          </Text>
        </View>
      </View>

      {/* SportSlide component */}
      {/* <SportSlide /> */}

      <View style={styles.imgClub}>
        <Text style={styles.joinTitle}>Hãy tham gia với chúng tôi</Text>
        <View style={styles.contentMiddle}>
          <Image source={image1} style={styles.clubImage} />
          <Image source={image2} style={styles.clubImage} />
          <Image source={image3} style={styles.clubImage} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  homeHeaderBanner: {
    marginBottom: 20,
  },
  contentUp: {
    marginBottom: 10,
  },
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  contentDown: {
    marginBottom: 10,
  },
  content1: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  content2: {
    fontSize: 20,
  },
  imgClub: {
    marginBottom: 20,
  },
  joinTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contentMiddle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clubImage: {
    width: '30%',
    height: 100,
    borderRadius: 10,
  },
});

export default HomeContent;