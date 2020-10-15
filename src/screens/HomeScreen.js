/* eslint-disable react-native/no-inline-styles */
/* eslint-disable keyword-spacing */
/* eslint-disable comma-dangle */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, BackHandler, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { CustomHeader }  from '../assets/CustomHeader';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
const { width: WIDTH } = Dimensions.get('window');
import RNBluetoothClassic, { BTEvents, BTCharsets } from 'react-native-bluetooth-classic';
import base64 from 'react-native-base64';
import AsyncStorage from '@react-native-community/async-storage';

export default function HomeScreen(props){
    const navigation = useNavigation();
    const [portaoStatus, setPortaoStatus] = useState('fechado');
    let [ loading, setLoading ] = useState(false);

    BackHandler.addEventListener('hardwareBackPress', function(){
        return true;
    });

     async function abrir() {
         const check1 = await RNBluetoothClassic.isConnected();
         if (check1 && portaoStatus === 'fechado') {
             const dado = base64.encode('a');
             const send = await RNBluetoothClassic.writeToDevice(dado);
             if (send) {
                 try {
                     const dataAtual = await dataAtualFormatada();
                     const horaAtual = await horaAtualFormatada();
                     const segundoAtual = await segundoAtualFormatado();
                     const milessimoAtual = await milessimoAtualFormatado();
                     await firestore().collection('registros').doc().set({

                         usuario: await AsyncStorage.getItem('emailLogado'),
                         data: dataAtual,
                         hora: horaAtual,
                         milesimo: milessimoAtual,
                         segundo: segundoAtual,
                         funcao: 'aberto'
                     });
                 } catch (e) {

                 }
                 setPortaoStatus('aberto');
             }
         }
     }


     async function fechar(){
         const check1 = await RNBluetoothClassic.isConnected();

         if(check1 && portaoStatus == 'aberto'){
             const dado = base64.encode('f');
             const send =  await RNBluetoothClassic.writeToDevice(dado);
             if(send){
                 try {
                     const dataAtual = await dataAtualFormatada();
                     const horaAtual = await horaAtualFormatada();
                     const milessimoAtual = await milessimoAtualFormatado();
                     const segundoAtual = await segundoAtualFormatado();
                     await firestore().collection('registros').doc().set({

                         usuario: await AsyncStorage.getItem('emailLogado'),
                         data: dataAtual,
                         hora: horaAtual,
                         milesimo: milessimoAtual,
                         segundo: segundoAtual,
                         funcao: 'fechado'
                     });
                 }
                 catch (e) {

                 }
             }
             setPortaoStatus('fechado');
         }
    }
         function dataAtualFormatada(){
             var data = new Date(),
                 dia  = data.getDate().toString().padStart(2, '0'),
                 mes  = (data.getMonth() + 1).toString().padStart(2, '0');
             return dia + '/' + mes;
         }

         function horaAtualFormatada(){
             var horario = new Date(),
                 hora = horario.getHours().toString().padStart(2, '0'),
                 minuto = horario.getMinutes().toString().padStart(2, '0');
             return hora + ':' + minuto;
         }

        function milessimoAtualFormatado(){
            var horario = new Date(),
                milessimo = horario.getMilliseconds().toString();
            return milessimo;
        }

    function segundoAtualFormatado(){
        var horario = new Date(),
            segundos = horario.getSeconds().toString();
        return segundos;
    }


    return(
        <SafeAreaView style={{flex:1, backgroundColor: '#fff'}}>
            <CustomHeader title="Tela Inicial" navigation={props.navigation}/>
            <View style={styles.container}>
            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btn}
                    onPress = {() => abrir()}
                >
                    <Text style={styles.btnText}>
                        ABRIR
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btn}
                                  onPress = {() => fechar()}
                >
                    <Text style={styles.btnText}>
                        FECHAR
                    </Text>
                </TouchableOpacity>
            </View>
            </View>
            {/* <View style={styles.alertContainer}>
                <Text style={styles.alertmsg}>
                    Lembre-se, para realizar as funções de abertura e fechamento do portão é essencial que seu bluetooth esteja pareado e conectado com o mesmo.
                </Text>
            </View> */}
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    btnContainer:{
        marginBottom: 10
    },
    btn:{
        width: WIDTH - 55,
        height: 130,
        borderWidth: 0.5,
        borderColor: '#6cadff',
        borderRadius: 45,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnText:{
        fontSize: 50,
        color: '#6cadff',
    },
    alertContainer:{
        height: 100,
        marginBottom: 10,
        borderWidth: 3,
        margin: 5,
        borderColor: '#6cadff',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'

    },
    alertmsg:{
        fontSize: 15,
        color: '#6cadff',
        textAlign: 'center',
    }
});
