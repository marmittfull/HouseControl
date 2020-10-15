import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity, Alert } from 'react-native'
import  AsyncStorage  from '@react-native-community/async-storage'
import { CustomHeaderConfig }  from '../assets/CustomHeaderConfig'
import firestore from '@react-native-firebase/firestore'
import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { useNavigation, CommonActions } from '@react-navigation/native'
const { width: WIDTH } = Dimensions.get('window')

export default function AlterarUsuariosScreen(props){
    
    let [ loading, setLoading ] = useState(true)
    let [ mudanca, setMudanca ] = useState(0)
    let [ arrayEmails, setArrayEmails ] = useState([])
    const navigation = useNavigation()
    
    //Colocando todos os email no array.
    
    useEffect(() => {
        pegarEmails()
    }, [mudanca])
    
    const pegarEmails = async() => {
        setLoading(true)   
        let emails = await firestore().collection('users').get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                arrayEmails.push(doc.data().email) 
            });
        })
        setLoading(false)
       
        
    }  

    async function confirmacao(email, key){

        let exist = false
        let emailteste = await AsyncStorage.getItem('emailLogado')        
        if(emailteste != null && emailteste != undefined){
            await firestore().collection('users').get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                if(doc.data().email == emailteste){
                    exist = true;                  
                }
                });
            })
            if (exist == true) {

                Alert.alert(
                    'Excluir usuário',
                    'Você tem certeza que deseja excluir o usuário '+email+'?',
                    [
                        {
                            text: 'Excluir',
                            onPress:() => checarEmail(email, key)
                        },
                        {
                            text: 'Cancelar',
                            onPress:() => console.log(''),
                            style: 'cancel'
                        }
                    ],
                    { cancelable: false }
                )
                
            }
            else{
                AsyncStorage.clear()
                Alert.alert(
                    'Erro!',
                    'Seu usuário foi excluído do sistema.',
                    [
                        {
                            text: 'Voltar',
                            onPress:() =>  navigation.dispatch(
                                CommonActions.reset({
                                  index: 1,
                                  routes: [
                                    { name: 'LoginScreen' },
                                  ],
                                })
                              ),
                        },
                    ],
                    { cancelable: false }
                ) 
            }
        }


        
    }

    async function alteracao(email, key){

            let docPE = ''
            let senha
            let tipo
            let cpf
            let cod
            setLoading(true)
            let emails = await firestore().collection('users').get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    if(doc.data().email == email){
                    senha = doc.data().senha  
                    tipo = doc.data().tipo
                    cpf = doc.data().cpf
                    cod = doc.data().cod
                    }
                });
            })
        setLoading(false)
        navigation.navigate('editarUser', {email: email, key: key, senha: senha, tipo: tipo, cpf: cpf, cod: cod})
    }

    async function checarEmail(email, key) {

        let emailAsync = await AsyncStorage.getItem('emailLogado')
        if(email == emailAsync){
            let docPE = ''
            setLoading(true)
            let emails = await firestore().collection('users').get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    if(doc.data().email == email){
                        docPE = doc.id
                    }
                });
            })
            let deleteDoc = firestore().collection('users').doc(docPE).delete();
            setArrayEmails([])
            setMudanca(mudanca + 1)
            AsyncStorage.clear();
            navigation.navigate('LoginScreen')
        }
        else{
            let docPE = ''
            setLoading(true)
            let emails = await firestore().collection('users').get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    if(doc.data().email == email){
                        docPE = doc.id
                    }
                });
            })
            let deleteDoc = firestore().collection('users').doc(docPE).delete();
            setArrayEmails([])
            setMudanca(mudanca + 1)
            setLoading(false)
        }
    }

    return(
        <SafeAreaView style={{flex:1, backgroundColor: '#fff'}}>
            <CustomHeaderConfig  title="Gerenciar Usuários" navigation={props.navigation}/>
            {
                    loading ?
                    <View style={styles.viewLoading}>
                        <ActivityIndicator size="large" color="#4da5ff"/>
                    </View>
                    :
                        arrayEmails.map((email, key) => {
                        return (

                        
                        
                        <View key={email} style={styles.cardView}>
                            <View style={{flex: 1}}>
                                <Text style={{marginLeft: 5, fontSize: 15, color: '#4da5ff', fontWeight: 'bold'}}>{email}</Text>
                            </View>
                            <TouchableOpacity style={{justifyContent: 'flex-end'}}
                                              onPress={() => alteracao(email, key)}
                            >
                                <AntDesign name='edit' size={30} color={'#4da5ff'}/>
                            </TouchableOpacity>
                            {
                                key != 0 ?
                                <TouchableOpacity style={{justifyContent: 'flex-end', marginLeft: 17}}
                                                onPress={() => confirmacao(email, key)}
                                >
                                    <EvilIcons name='trash' size={40} color={'#4da5ff'}/>
                                </TouchableOpacity>   
                                :
                                <View style={{marginRight: 5}}></View> 
                            }
                        </View>
                        );
                        })
                    
            }
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
        borderWidth: 0.3,
        borderRadius: 5,
        
    }
})