import React, { useState } from 'react'
import { StyleSheet, SafeAreaView, View,
    TextInput, Text, Dimensions,
    TouchableOpacity, KeyboardAvoidingView, Alert, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { CustomHeaderConfig }  from '../assets/CustomHeaderConfig'
import { useNavigation, CommonActions } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage'
import { Picker } from '@react-native-community/picker'
import firestore from '@react-native-firebase/firestore'
import * as Yup from 'yup'
import { Formik } from 'formik'

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
)
const { width: WIDTH } = Dimensions.get('window')

export default function NovoUsuarioScreen(props){
    let [ showPass, setShowPass ] = useState(true)
    let [ press, setPress ] = useState(false)
    let [ loading, setLoading ] = useState(false)
    let [selectedValue, setSelectedValue] = useState("admin")

    const navigation = useNavigation()

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



    async function loginUser(values){
        Keyboard.dismiss()
        let emailNovo = values.email
        emailNovo = emailNovo.toLowerCase()
        let exist = false
        let emailteste = await AsyncStorage.getItem('emailLogado')
        setLoading(true)

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

                    let exist2 = false
                    await firestore().collection('users').get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                        if(doc.data().email == emailNovo){
                            exist2 = true;
                        }
                        });
                    })

                    if(exist2 == true){
                        Alert.alert('Cadastro inválido!', 'O email inserido já está cadastrado no sistema.')
                    }
                    else{

                        await firestore().collection('users').doc().set({
                            email: emailNovo,
                            senha: values.senha,
                            tipo: selectedValue,
                            cpf: values.cpf,
                            cod: values.cod
                        })
                        Alert.alert('Cadastro bem sucedido!', 'O usuário foi cadastrado no sistema.')
                    }
                    values.senha = ''
                    values.email = ''
                    values.cpf = ''
                    values.cod = ''

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
        initialValues={{ email: '', senha: '', cpf: '', cod: '' }}
        onSubmit={values => loginUser(values)}
        validationSchema={Yup.object().shape({
            email: Yup
            .string('Email inválido, verifique o email informado!')
            .email('Email inválido, verifique o email informado!')
            .required('Por favor, insira o email a ser cadastrado!'),
            senha: Yup
            .string('Senha inválida, verifique a senha informada!')
            .min(5, 'Senha inválida, a senha deve conter no mínimo 5 caracteres!')
            .max(20, 'Senha inválida, a senha deve conter no máximo 20 caracteres!')
            .required('Por favor, insira a senha a ser cadastrada!'),
            cpf: Yup
            .string('CPF inválido!')
            .min(11, 'CPF inválido, o CPF deve conter 11 dígitos!')
            .max(11, 'CPF inválido, o CPF deve conter 11 dígitos!'),
            cod: Yup
            .string('Código inválido!')
            .typeError('Código inválido, o código deve conter apenas números!')
            .min(5, 'Código inválido, seu código deve conter 5 dígitos!')
            .max(5, 'Código inválido, seu código deve conter 5 dígitos!')

        })}
        >
        {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
            <DismissKeyboard>
            <SafeAreaView style={styles.backgroundContainer}>

            <CustomHeaderConfig  title="Novo usuário" navigation={props.navigation}/>
            <View style={styles.mainView}>
                <View style={styles.logoContainer}>
                    <View style={{borderBottomWidth: 1, borderColor: '#4da5ff'}}>
                        <Text style={styles.textCadastro}>CADASTRO</Text>
                    </View>
                </View>
                <KeyboardAvoidingView behavior="position" enabled>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="EMAIL"
                        placeholderTextColor='#555555'
                        underlineColorAndroid='#4da5ff'
                        style={styles.input}
                        onChangeText={handleChange('email')}
                        value={values.email}
                        onBlur={() => setFieldTouched('email')}
                    />
                    {touched.email && errors.email &&
                    <Text style={{ fontSize: 10, color: 'red', marginLeft: 2 }}>{errors.email}</Text>
                }
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
                        <Ionicons name={press === false ?  'ios-eye' : 'ios-eye-off' } size={26} color={'rgba(0, 0, 0, 0.5)'}/>
                    </TouchableOpacity>
                    {touched.senha && errors.senha &&
                <Text style={{ fontSize: 10, color: 'red', marginLeft:2 }}>{errors.senha}</Text>
                }
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Informe seu CPF para a recuperação da conta!"
                        placeholderTextColor='#555555'
                        underlineColorAndroid='#4da5ff'
                        style={styles.input}
                        onChangeText={handleChange('cpf')}
                        value={values.cpf}
                        onBlur={() => setFieldTouched('cpf')}
                        keyboardType={'numeric'}
                    />
                    {touched.cpf && errors.cpf &&
                    <Text style={{ fontSize: 10, color: 'red', marginLeft: 2 }}>{errors.cpf}</Text>
                }
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Informe 5 números para a recuperação da conta!"
                        placeholderTextColor='#555555'
                        underlineColorAndroid='#4da5ff'
                        style={styles.input}
                        onChangeText={handleChange('cod')}
                        keyboardType={'numeric'}
                        value={values.cod}
                        onBlur={() => setFieldTouched('cod')}
                    />
                    {touched.cod && errors.cod &&
                    <Text style={{ fontSize: 10, color: 'red', marginLeft: 2 }}>{errors.cod}</Text>
                }
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Picker
                        selectedValue={selectedValue}
                        style={{ height: 50, width: 200 }}
                        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                    >
                        <Picker.Item label="Administrador" value="admin" />
                        <Picker.Item label="Comum" value="comum" />
                    </Picker>
                </View>
                <View style={styles.viewButtons}>
                    <TouchableOpacity style={styles.btns}
                                    onPress={() => handleSubmit()}>
                        <Text style={styles.text}>Salvar</Text>
                    </TouchableOpacity>
                <TouchableOpacity style={styles.btns}
                                onPress={() => navigation.navigate('ConfigScreen')}>
                    <Text style={styles.text}>Cancelar</Text>
                </TouchableOpacity>
                </View>
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
        </SafeAreaView>
        </DismissKeyboard>
        )}
      </Formik>
    )
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: '#fff'
    },
    backgroundContainer:{
        flex:1,
        alignItems: 'center',
        width: null,
        height: null,
        backgroundColor: '#fff'
    },
    logoContainer:{
        alignItems: 'center',
        marginBottom: 50,
        marginTop: 20,

    },
    textCadastro:{
        fontSize: 25,
        fontWeight: 'bold',
        color: '#4da5ff',
    },
    inputContainer:{
        marginTop: 0
    },
    input:{
        width: WIDTH - 55,
        height: 55,
        fontSize: 16,
        paddingLeft: 5,
        paddingBottom: 24 ,
        color: 'black',

    },
    btnEye:{
        position: 'absolute',
        top: 10,
        right: 15,
    },
    SenhaForg:{
        textAlign: 'right',
        color: '#555555',
        opacity: 0.7,
        textTransform: 'uppercase',
        marginRight: 9
    },
    btns:{
        width: WIDTH - 55,
        height: 45,
        borderRadius: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        borderColor: '#4da5ff',
        borderWidth: 0.4,
        marginTop: 10,
    },
    text:{
        color: '#555555',
        fontSize: 16,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    mainView:{
        flexDirection: 'column',
        marginHorizontal:10,
        marginTop: 35
    },
    viewButtons:{
        marginTop: 10,
        flexDirection: 'column',
    },
    checkView:{
        flexDirection: 'row',
        marginTop: 5,
        height:30,
        alignItems:'center',
        justifyContent:'flex-start'
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
