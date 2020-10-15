import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';

export default function CustomDrawerContent(props){

    return(
        <LinearGradient
            colors={['#000', '#4da5ff']}
            style={styles.mainContainer}>
            <View style={styles.viewLogo}>
                <Image
                    source={require('../assets/icon2.png')}
                    style={{width: 160, height: 160}}
                />
            </View>
            <View style={styles.viewText}>
                <TouchableOpacity style={{marginTop: 40, marginLeft: 15}}
                    onPress={() => props.navigation.navigate('HomeScreen')}
                >
                <Text style={styles.textStyle}>Tela Inicial</Text>

                </TouchableOpacity>
            </View>
            <View style={styles.viewText}>
                <TouchableOpacity style={{marginTop: 40, marginLeft: 15}}
                    onPress={() =>

                        props.navigation.navigate('RegistrosScreen')
                    }

                    >
                <Text style={styles.textStyle}>Registros</Text>

                </TouchableOpacity>
            </View>
            <View style={styles.viewText}>
                <TouchableOpacity style={{marginTop: 40, marginLeft: 15}}
                    onPress={() => props.navigation.navigate('ConfigScreen')}
                >
                <Text style={styles.textStyle}>Configurações</Text>

                </TouchableOpacity>
            </View>
            <View style={styles.viewText}>
                <TouchableOpacity style={{marginTop: 40, marginLeft: 15}}
                    onPress={() => props.navigation.navigate('SuporteScreen')}
                >
                <Text style={styles.textStyle}>Suporte</Text>

                </TouchableOpacity>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor: 'blue',
    },
    viewCloseDrawer:{
        flexDirection: 'row',
        height: 60,
    },
    viewLogo:{
        borderWidth: 0,
        flexDirection: 'row',
        height: 150,
        justifyContent: 'center',
        alignContent: 'center'
    },
    viewText:{
        borderBottomWidth: 2,
        borderRadius: 2,
        borderColor: '#fff',
        flexDirection: 'row',
        marginHorizontal: 15,
        height:80,

    },
    textStyle:{
        color: "#fff",
        fontSize: 28,

    }
})
