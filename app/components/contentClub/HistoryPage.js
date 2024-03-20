import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import {
  getUserWallet,
  getTransactionHistoryPoints,
} from "../../../services/memberService";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSpinner, faStar } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

function HistoryPage() {
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

  const [transactionHistoryPoints, setTransactionHistoryPoints] = useState([]);
  const [walletInfo, setWalletInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletInfo = async () => {
    if (userInfoLoaded && userInfo) {
      try {
        const response = await getUserWallet(userInfo.id);
        setWalletInfo(response.result);
        const walletId = response.result.id;
        const response2 = await getTransactionHistoryPoints(walletId);
        setTransactionHistoryPoints(response2.result);
        const lastTransaction = response2.result.find(
          (item) => item.status && item.status.data && item.status.data[0] === 1
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching wallet info:", error);
        setLoading(false);
      }
    }
    }
    fetchWalletInfo();
  }, [userInfoLoaded, userInfo]);

  console.log(transactionHistoryPoints);

  return (
    <View style={styles.historyPageContainer}>
      <Text style={styles.pageTitle}>Chi tiết về ví của bạn</Text>
      <View style={styles.historyWrapper}>
        <View style={styles.walletDetailPopup}>
          <Text style={{fontSize: 17}}>
            <Text style={styles.boldText}>Tên:</Text> {walletInfo.memberName}
          </Text>
          <Text style={{fontSize: 17}}>
            <Text style={styles.boldText}>Điểm bạn đang có:</Text>{" "}
            {walletInfo.point}{" "}
            <FontAwesomeIcon icon={faStar} style={styles.faStar} />
          </Text>
        </View>
        <ScrollView style={styles.usersTable}>
          <View style={styles.table}>
                <View style={styles.row}>
                  <Text style={styles.headerCell}>Điểm ban đầu</Text>
                  <Text style={styles.headerCell}>Điểm giao dịch</Text>
                  <Text style={styles.headerCell}>Tổng kết</Text>
                  <Text style={styles.headerCell}>Ghi chú</Text>
                </View>

                {transactionHistoryPoints
                  .filter((item) => item.status && item.status.data && item.status.data[0] === 1)
                  .map((item, index) => {
                    const resultPoint = item.initialPoint + item.transactionPoint;
                    const formattedTransactionPoint =
                      item.transactionPoint > 0 ? `+${item.transactionPoint}` : item.transactionPoint;
                    let descriptionText = '';

                    // Kiểm tra giá trị của description và đặt văn bản phù hợp
                    if (item.desciption === 'join slot ') {
                      descriptionText = 'Đăng kí      tham gia';
                    } else if (item.desciption === 'confirm_joined') {
                      descriptionText = 'Xác nhận   tham gia';
                    } else {
                      descriptionText = item.desciption;
                    }
                    return (
                      <View style={styles.row} key={index}>
                        <Text style={styles.cell}>{item.initialPoint}</Text>
                        <Text style={styles.cell}>{formattedTransactionPoint}</Text>
                        <Text style={styles.cell}>{resultPoint}</Text>
                        <Text style={styles.cell}>{descriptionText}</Text>
                      </View>
                    );
                  })}
              </View>
        </ScrollView>
      </View>
      {loading && (
        <ActivityIndicator style={styles.loadingSpinner} size="large" color="#0000ff" />
      )}
      {transactionHistoryPoints.length === 0 && !loading && (
        <Text style={styles.noPostsMessage}>Bạn chưa có ví</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  historyPageContainer: {
    flex: 1,
    paddingTop: 20,
    padding: 10,
    backgroundColor: "#fff",
  },
  pageTitle: {
    marginLeft: "15%",
    height: 51,
    position: "relative",
    backgroundColor: "#e8eee7",
    borderRadius: 5,
    width: "70%",
    color: "black",
    fontWeight: "700",
    fontSize: 24,
    marginBottom: 15,
    textAlign:'center',
    padding: 8
  },
  historyWrapper: {
    flex: 1,
    marginTop: 10,
  },
  walletDetailPopup: {
    marginBottom: 10, // Added marginBottom
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 17
  },
  faStar: {
    color: "gold",
  },
  usersTable: {
    flex: 1,
  },
  loadingSpinner: {
    marginTop: 20,
  },
  noPostsMessage: {
    marginTop: 20,
    fontSize: 18,
  },
  table: {
    borderWidth: 1,
    borderColor: '#000',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
    alignItems: 'center'
  },
  headerCell: {
    flex: 1,
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: 'center',
  },
});

export default HistoryPage;