import React, { useState } from 'react'
import { StyleSheet, View, 
    TextInput, Text, Dimensions,
    TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import {Picker} from '@react-native-community/picker'
import firestore from '@react-native-firebase/firestore'
import { useNavigation, CommonActions } from '@react-navigation/native'
import * as Yup from 'yup'
import { Formik } from 'formik'
import  Ionicons from 'react-native-vector-icons/Ionicons'

const { width: WIDTH } = Dimensions.get('window')

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
)

export default function editarUser({route}){
    const navigation = useNavigation()
    let email = route.params.email
    let cpf = route.params.cpf
    let cod = route.params.cod
    let key = route.params.key
    let [ showPass, setShowPass ] = useState(true)
    let [ press, setPress ] = useState(false)
    let [ senha, setSenha] = useState(route.params.senha)
    let [ loading, setLoading ] = useState(false)
    let [selectedValue, setSelectedValue] = useState(route.params.tipo)
    
    function showPassToggle() {
        if(press == false){
            setShowPass(false)
            setPress(true)
        }
        else{
            setShowPass(true)
            setPress(false)
        }
    }

    async function changeUser(values){

        Keyboard.dismiss()
        setLoading(true)
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

                let docPE = ''
                let emails = await firestore().collection('users').get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        if(doc.data().email == email){
                            docPE = doc.id
                        }
                    });
                })
                let updateDoc = firestore().collection('users').doc(docPE).update({
                    email: email,
                    senha: values.senha,
                    tipo: selectedValue
                });
                Alert.alert(
                    'Alteração conclúida com sucesso!',
                    'Os dados do usuário selecionado foram atualizados.',
                    [
                        {
                            text: 'Voltar',
                            onPress:() =>  navigation.navigate('AlterarUsuariosScreen')
                        },
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
            setLoading(false)
    }
    
    return(
        
        <Formik
        initialValues={{ senha: senha, cpf:cpf, cod: cod }}
        onSubmit={values => changeUser(values)}
        validationSchema={Yup.object().shape({
            senha: Yup
          .string('Senha inválida, verifique a senha informada!')
          .min(5, 'Senha inválida, a senha deve conter no mínimo 5 caracteres!')
          .max(20, 'Senha inválida, a senha deve conter no máximo 20 caracteres!')
          .required('Por favor, insira a senha a ser cadastrada!')
        })}
        >
        {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
        <DismissKeyboard>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <View style={styles.backView}>
            <KeyboardAvoidingView behavior="padding" enabled>
            <View style={{height:100, alignItems: 'center'}}>
                <Text style={{color: '#4da5ff', fontSize: 25, marginTop: 20, textDecorationLine: 'underline'}}>ATUALIZAR USUÁRIO</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="EMAIL"
                    placeholderTextColor='#555555'
                    underlineColorAndroid='#4da5ff'
                    style={styles.input}
                    value={email}
                    editable={false}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="SENHA"
                    placeholderTextColor='#555555'
                    underlineColorAndroid='#4da5ff'
                    secureTextEntry={showPass}
                    style={styles.input}
                    onChangeText={handleChange('senha')}
                    onBlur={() => setFieldTouched('senha')}
                    value={values.senha}
                />

                <TouchableOpacity style={styles.btnEye}
                                  onPress={() => showPassToggle()}
                                  >
                    <Ionicons name={press == false ?  'ios-eye' : 'ios-eye-off' } size={26} color={'rgba(0, 0, 0, 0.5)'}/>
                </TouchableOpacity>
            </View>
                                  {touched.senha && errors.senha &&
                                  <Text style={{ fontSize: 10, color: 'red', marginLeft: 53 }}>{errors.senha}</Text>
                                  }
                <View style={styles.inputContainer}>
                    <TextInput
                        underlineColorAndroid='#4da5ff'
                        style={styles.input}
                        value={cpf}
                        editable={false}
                    />
                    {touched.cpf && errors.cpf &&
                    <Text style={{ fontSize: 10, color: 'red', marginLeft: 2 }}>{errors.cpf}</Text>
                }   
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        underlineColorAndroid='#4da5ff'
                        style={styles.input}
                        value={cod}
                        editable={false}
                    />
                    {touched.cod && errors.cod &&
                    <Text style={{ fontSize: 10, color: 'red', marginLeft: 2 }}>{errors.cod}</Text>
                }   
                </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 15 }}>
                    
                    {
                        key == 0 ?
                        <Picker
                        selectedValue={selectedValue}
                        style={{ height: 50, width: 200 }}
                        enabled={false}
                    >
                        <Picker.Item label="Administrador" value="admin" />
                        <Picker.Item label="Comum" value="comum" />
                    </Picker>
                    :
                    <Picker
                        selectedValue={selectedValue}
                        style={{ height: 50, width: 200 }}
                        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                    >
                        <Picker.Item label="Administrador" value="admin" />
                        <Picker.Item label="Comum" value="comum" />
                    </Picker>
                    }
                </View>
            <TouchableOpacity style={styles.btnLogin}
                            onPress={() => handleSubmit()}
                            
                            >
                <Text style={styles.text}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCancelar}
                            onPress={() => navigation.navigate('AlterarUsuariosScreen')}
                            
                            >
                <Text style={styles.text}>Cancelar</Text>
            </TouchableOpacity>
                            </KeyboardAvoidingView>
            </View>
            {
                loading ?
                    <View style={styles.viewLoading}>
                        <ActivityIndicator size="large" color="#4da5ff"/>
                    </View>
                    :
                <View style={{display:'none'}}>
                </View>
            }
        </KeyboardAvoidingView>
         </DismissKeyboard>
         )}
         </Formik>
    )
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignContent: "center",

        backgroundColor: '#fff'
    },
    backView:{
        height: 615,
        width: WIDTH - 80,
        marginHorizontal: 50,
        borderWidth: 1,
        borderColor: '#4da5ff',
        borderRadius: 3,
        marginTop: 50
    },
    inputContainer:{
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },  
    input:{
        width: WIDTH - 120,
 
        height: 55,
        fontSize: 16,
        paddingLeft: 5,
        paddingBottom: 24 ,
        color: 'black',
       
    },
    btnEye:{
        position: 'absolute',
        top: 10,
        right: 45,
    },
    btnLogin:{
        width: WIDTH - 200,
        height: 45,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        marginTop: 50,
        marginHorizontal: 50,
        borderColor: '#4da5ff',
        borderWidth: 0.4
    },
    btnCancelar:{
        width: WIDTH - 200,
        height: 45,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        marginTop: 25,
        marginHorizontal: 50,
        borderColor: '#4da5ff',
        borderWidth: 0.4
    },
    text:{
        color: '#555555',
        fontSize: 16,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
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
    }
})