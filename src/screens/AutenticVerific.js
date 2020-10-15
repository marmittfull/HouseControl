import React, { useEffect } from 'react'
import { View, Alert, Image, StatusBar } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-community/async-storage'
import RNBluetoothClassic, { BTEvents, BTCharsets } from 'react-native-bluetooth-classic';

export default function AutenticVerific(){
    const navigation = useNavigation()

    useEffect(() => {
            checarExistencia()
        }, [])

    useEffect(() => {
        async function init(){

            try{
                const enable = await RNBluetoothClassic.requestEnable();
                if(enable){

                    //const lista = await RNBluetoothClassic.list();
                    connect();

                }
            }
            catch (e) {
                console.log(e);
            }
        }

        async function connect(){
            try{
                const conectar = await RNBluetoothClassic.connect("98:D3:51:FD:A0:E8");
            }
            catch (e) {

            }

        }

        init();

        return() => {
            async function remove(){
                await RNBluetoothClassic.cancelDiscovery();
                console.log('Fim scanneamento');

            }
            remove();
        }
    }, [])


    async function checarExistencia(){
        let exist = false
        let email = await AsyncStorage.getItem('emailLogado')

        if(email != null && email != undefined){
            await firestore().collection('users').get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                if(doc.data().email == email){
                    exist = true;
                }
                });
            })
            if (exist == true) {
                verificaLogin()
            }
            else{
                AsyncStorage.clear()
                navigation.navigate('LoginScreen')
            }
        }
        else{
                AsyncStorage.clear()
                navigation.navigate('LoginScreen')
        }

    }


    const verificaLogin = async() => {
        try{
            const value= await AsyncStorage.getItem('userLogado')

            if(value == 1){
                setTimeout(() => {

                    navigation.navigate("HomeScreen")
                }, 400);
            }
            else{
                setTimeout(() => {

                    navigation.navigate('LoginScreen')
                }, 1500);
            }
        }
        catch(erro){
            console.log(erro);

        }
    }

    return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <StatusBar hidden={true}/>
            <Image
                    source={require('../assets/icon2.png')}
                    style={{width: 220, height: 220}}
                />
        </View>
    )
}
