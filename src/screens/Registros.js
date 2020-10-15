import React, { useState, useEffect } from 'react'
import {View, Text, SafeAreaView, StyleSheet, Dimensions, ActivityIndicator, ScrollView} from 'react-native';
import { CustomHeader }  from '../assets/CustomHeader'
import firestore from '@react-native-firebase/firestore'
const { width: WIDTH } = Dimensions.get('window')
import { useFocusEffect }  from '@react-navigation/native'


export default function RegistrosScreen({navigation}){
    let [ loading, setLoading ] = useState(true)
    let [ arrayRegistros, setArrayRegistros ] = useState([])

    useFocusEffect(
        React.useCallback(() => {
            pegarDados();
        }, [])
    );

    const pegarDados = async() => {
        arrayRegistros.length = 0;
        setLoading(true)
        const dataMinima = await pegarData();
        let emails = await firestore().collection('registros').where('data', '>', dataMinima)
            .orderBy('data', 'desc').orderBy('hora', 'desc').orderBy('segundo', 'desc').orderBy('milesimo', 'desc')
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    arrayRegistros.push({'usuario':doc.data().usuario,
                                        'hora': doc.data().hora,
                                         'data': doc.data().data,
                                        'funcao': doc.data().funcao,
                                        'documento': doc.id
                    })
                });
            })
        setLoading(false)

    }

    function pegarData(){
        var data = new Date(),
            dia  = (data.getDate()-7).toString().padStart(2, '0'),
            mes  = (data.getMonth()+1).toString().padStart(2, '0')
        return dia+"/"+mes;
    }

    return(
        <SafeAreaView style={{flex:1, backgroundColor: '#fff'}}>
            <CustomHeader title="Registros" navigation={navigation}/>
            <ScrollView style={{marginTop: 2, marginBottom:10}}>
            {
                loading ?
                    <View style={styles.viewLoading}>
                        <ActivityIndicator size="large" color="#4da5ff"/>
                    </View>
                    :
                    arrayRegistros.map(({usuario, hora, funcao, data, documento}) => {
                        return (
                            <View key={documento} style={styles.cardView}>
                                <View style={{flex: 1}}>
                                    <Text style={[styles.text,{marginLeft: 5, fontSize: 18}]}>O portão foi {funcao}</Text>
                                    <Text style={[styles.text, {marginLeft: 5, fontSize: 11,}]}>{usuario}</Text>
                                </View>
                                <View style={{justifyContent: 'flex-end', marginRight: 5}}>
                                    <Text style={styles.text}>{hora}</Text>
                                    <Text style={styles.text}>{data}</Text>
                                </View>
                            </View>
                        );
                    })
            }
            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    viewLoading:{
        display:"flex",
        flex:1,
        backgroundColor:'#fff',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardView:{
        marginTop:10,
        width: WIDTH - 6,
        height: 60,
        marginHorizontal: 3,
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: '#4da5ff',
        borderWidth: 0.5,
        borderRadius: 5,

    },
    text:{
        fontSize: 15,
        color: '#4da5ff',
        fontWeight: 'bold'
    }
})
