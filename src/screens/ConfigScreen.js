import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { CustomHeader }  from '../assets/CustomHeader'
import { CommonActions } from '@react-navigation/native';
import  AsyncStorage from '@react-native-community/async-storage'

export default function ConfigScreen({navigation}){
    
    let [ value, setValue ] = useState()
    let [email, setEmail] = useState()
        useEffect(() => {
            _retrieveData()
        }, [])

    let _retrieveData = async () => {
        try {
        let value2 = await AsyncStorage.getItem('userTipo');
        let email = await AsyncStorage.getItem('emailLogado');
        setValue(value2)
        setEmail(email)
        } catch (error) {
          // Error retrieving data
        }

      };

      function logout(){
        navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                { name: 'LoginScreen' },
              ],
            })
          );
      }

    return(
        <SafeAreaView style={{flex:1, backgroundColor: '#fff'}}>
            <ScrollView>

            <CustomHeader title="Configurações" navigation={navigation}/>
            {

                value == 'admin' ?
            <View>
                <View style={styles.viewText}>
                    <TouchableOpacity style={styles.viewTouch}
                        onPress={() => navigation.navigate('NovoUsuarioScreen')}
                    >
                        <Text style={styles.mainText}>NOVO USUÁRIO</Text>
                        <Text style={styles.secText}>cadastrar novo usuário</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.viewText}>
                    <TouchableOpacity style={styles.viewTouch}
                            onPress={() => navigation.navigate('AlterarUsuariosScreen')}
                    >
                        <Text style={styles.mainText}>GERENCIAR USUÁRIOS</Text>
                        <Text style={styles.secText}>Gerenciar dados dos usuários</Text>
                    </TouchableOpacity>
                </View>
            </View>
                :
                <View style={{display: 'none'}}>
                </View>
            }
            <View style={styles.viewText}>
                <TouchableOpacity style={styles.viewTouch}
                    onPress={() => {
                        AsyncStorage.clear();
                        logout()
                    }}
                >
                    <Text style={styles.mainText}>FAZER LOGOFF</Text>
                    <Text style={styles.secText}>sair da sessão atual</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
            <View style={styles.viewAtual}>
                <Text style={styles.titleAtual}>Usuário atual:</Text>
                <Text style={{fontSize: 20, color: '#4da5ff'}}>{email}</Text>
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    viewText:{
        borderBottomWidth: 2,
        borderRadius: 2,
        borderColor: '#4da5ff',
        flexDirection: 'row',
        marginHorizontal: 15,
        height:90,
    },
    viewTouch:{
        marginTop: 15,
        marginLeft: 5,
    },
    mainText:{
        fontSize: 28,
        color: '#4da5ff'
    },
    secText:{
       fontSize: 16,
       color: '#4da5ff',
       marginTop: -5,
       marginLeft: 27, 
    },
    viewAtual:{
  bottom:20,
  alignItems: 'center',
justifyContent: 'center'
    },
    titleAtual:{
        fontSize: 25,
        marginBottom: 10,
        color: '#4da5ff'
    }
})