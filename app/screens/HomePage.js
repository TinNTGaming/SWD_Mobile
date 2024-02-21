import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

const HomePage = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Image style={styles.background} source={require('../assets/Sport/login-background.png')}/>
            <Text style={styles.title}>Welcome to Sports Club</Text>
            <View style={styles.loginBtnContainer}>
                <TouchableOpacity
                    style={styles.loginBtn}
                    onPress={() => navigation.navigate('LoginAdmin')}
                >
                    <Text style={styles.loginText}>Login Admin</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.loginBtn}
                    onPress={() => navigation.navigate('LoginMember')}
                >
                    <Text style={styles.loginText}>Login Member</Text>
                </TouchableOpacity>
            </View>
            <Image source={require('../assets/others/welcome.jpg')} style={styles.wcImg} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        padding: 0,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000',
        position: 'absolute',
    },
    title: {
        fontSize: 35,
        color: '#fff',
        fontWeight: 'bold'
    },
    loginBtnContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        marginTop: 30,
    },
    loginBtn: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginHorizontal: 5,
        backgroundColor: '#E4AEC5',
        borderWidth: 1,
        borderColor: 'rgb(251, 95, 95)',
    },
    loginText: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    wcImg: {
        marginTop: 30,
        width: 200,
        height: 200,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'rgb(251, 95, 95)',
    },
});

export default HomePage;