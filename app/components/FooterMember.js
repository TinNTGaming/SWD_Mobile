import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCopyright } from '@fortawesome/free-regular-svg-icons';

function FooterMember() {
  return (
    <View style={styles.containerFooter}>
      <Text style={styles.footerTitle}>Thông tin liên hệ</Text>
      <Text style={styles.email}>Email: racket@gmail.com</Text>
      <Text style={styles.phone}>Phone: 0123456789</Text>
      <Text style={styles.copyright}>
        <FontAwesomeIcon style={styles.copyIcon} icon={faCopyright} />
        Copyright 2024 Racket.vn. Bản quyền thuộc về Racket
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
    containerFooter: {
      width: '100%',
      height: '100%',
      backgroundColor: '#769971',
      textAlign: 'center',
      position: 'absolute',
      borderTopWidth: 1,
      borderTopColor: '#000',
    },
    footerTitle: {
      paddingTop: 150,
      padding: 50,
      fontSize: 30,
      textAlign: 'center',
      justifyContent: 'center',
    },
    email: {
      fontSize: 20,
      textAlign: 'center',
      justifyContent: 'center',
    },
    phone: {
        fontSize: 20,
        textAlign: 'center',
        justifyContent: 'center',
      },
    copyright: {
      fontSize: 16,
      fontWeight: 'bold',
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      textAlign: 'center',
      justifyContent: 'center',
    },
    copyIcon: {
      marginRight: 10,
    },
  });

export default FooterMember;