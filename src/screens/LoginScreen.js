import React, { useState  } from 'react'
import { StyleSheet, SafeAreaView, View, 
        TextInput, Text, Image, StatusBar, Dimensions,
        TouchableOpacity, KeyboardAvoidingView, BackHandler, Alert, 
        ActivityIndicator, TouchableWithoutFeedback, Keyboard, Linking } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage'
import firestore from '@react-native-firebase/firestore'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { Header } from '@react-navigation/stack'

const { width: WIDTH } = Dimensions.get('window')

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
)

const wppURL = "https://api.whatsapp.com/send?phone=5551989298666&text=Ol%C3%A1!"

export default function LoginScreen(){
    let [ showPass, setShowPass ] = useState(true)
    let [ press, setPress ] = useState(false)
    let [ loading, setLoading ] = useState(false)
    let [ senhaEsquecida, setSenhaEsquecida ] = useState(false)
    
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
    BackHandler.addEventListener('hardwareBackPress', function(){
        return true;
    })
    const navigation = useNavigation()
    async function loginUser(values){
                    setLoading(true)
                    let emailNovo = values.email
                    emailNovo = emailNovo.toLowerCase()
                    let exist = false
                    await firestore().collection('users').get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                        if(doc.data().email == emailNovo && doc.data().senha == values.senha){
                            if(doc.data().tipo == 'admin'){
                                AsyncStorage.setItem('userTipo', 'admin')
                            }
                            else{
                                AsyncStorage.setItem('userTipo', 'comum')
                            }
                            exist = true;                  
                        }
                        });
                    })
                    if (exist == true) {
                        AsyncStorage.setItem('userLogado', '1')
                        AsyncStorage.setItem('emailLogado', emailNovo)
                        navigation.navigate("HomeScreen")
                    }
                    else{
                        Alert.alert('Login inválido!', 'O login inserido não foi encontrado, verifique o email ou senha digitados.')
                    }
                    setLoading(false)
                    
                }

    function recover(){
        setSenhaEsquecida(true);
        
    }
    async function recoverConta(values){
        Keyboard.dismiss()
        let exist = false;
        let emailLocalizado = '';
        let senhaLocalizada = '';
        setLoading(true)
        await firestore().collection('users').get()
        .then(snapshot => {
            snapshot.forEach(doc => {
            if(doc.data().cpf == values.cpf && doc.data().cod == values.cod){
                exist = true;   
                emailLocalizado = doc.data().email
                senhaLocalizada = doc.data().senha               
            }
            });
        })
        setLoading(false)
        if (exist == true) {
            Alert.alert(
                'Conta encontrada!',
                'Email: '+emailLocalizado+
                '   Senha: '+senhaLocalizada+'',
                [
                    {
                        text: 'Voltar',
                        onPress:() =>  navigation.navigate('LoginScreen')
                    },
                ],
                { cancelable: false }
            ) 
        }
        else{
            Alert.alert(
                'Conta não encontrada!',
                'Verifique o código de recuperação da conta e CPF informados.',
                [
                    {
                        text: 'Voltar',
                        onPress:() =>  navigation.navigate('LoginScreen')
                    },
                ],
                { cancelable: false }
            ) 
        }
        
    }



    function returnLogin(){
        setSenhaEsquecida(false)
    }


    return(
        
        <Formik
        initialValues={{ email: '', senha: '' }}
        onSubmit={values => loginUser(values)}
        validationSchema={Yup.object().shape({
            email: Yup
            .string('Email inválido, verifique o email informado!')
            .email('Email inválido, verifique o email informado!')
            .required('Por favor, insira seu email!'),
            senha: Yup
            .string('Senha inválida, verifique a senha informada!')
            .min(5, 'Senha inválida, verifique a senha informada!')
            .max(20, 'Senha inválida, verifique a senha informada!')
            .required('Por favor, insira sua senha!'),
        })}
        >
        {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <DismissKeyboard>
            <View style={senhaEsquecida == true ? styles.backgroundContainer2 : styles.backgroundContainer}>
            <StatusBar hidden={true}/>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/icon2.png')}
                    style={{width: 220, height: 220}}
                />
            </View>
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
                {touched.senha && errors.senha &&
                <Text style={{ fontSize: 10, color: 'red', marginLeft:2 }}>{errors.senha}</Text>
            }
                <TouchableOpacity style={styles.btnEye}
                                  onPress={() => showPassToggle()}
                >
                    <Icon name={press == false ?  'ios-eye' : 'ios-eye-off' } size={26} color={'rgba(0, 0, 0, 0.5)'}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => recover()}>
                <Text style={styles.SenhaForg}>Esqueci minha conta!</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.btnLogin}
                            onPress={() => handleSubmit()}
                            disabled={senhaEsquecida}
                            >
                <Text style={styles.text}>Entrar</Text>
            </TouchableOpacity>
                        {
                            loading ?
                            <View style={styles.viewLoading}>
                                    <ActivityIndicator size="large" color="#4da5ff"/>
                            </View>
                                :
                                <View style={{display:'none'}}>
                                </View>
                        }

            </View>
            
        </DismissKeyboard>

        {
            senhaEsquecida ?
            <Formik
        initialValues={{ cpf: '', cod: '' }}
        onSubmit={values => recoverConta(values)}
        validationSchema={Yup.object().shape({
            cpf: Yup
            .string('CPF inválido!')
            .min(11, 'CPF inválido, o CPF deve conter 11 dígitos!')
            .max(11, 'CPF inválido, o CPF deve conter 11 dígitos!')
            .required('Por favor, insira o CPF utilizado no cadastro da conta!'),
            cod: Yup
            .string('Código inválido!')
            .typeError('Código inválido, o código deve conter apenas números!')
            .min(5, 'Código inválido, seu código deve conter 5 dígitos!')
            .max(5, 'Código inválido, seu código deve conter 5 dígitos!')
            .required('Por favor, insira o código utilizado no cadastro da conta!'),
        })}
        >
            {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
            <View style={styles.viewEsquecida}>
                <Text style={styles.titleRecover}>Recuperação</Text>
                <View style={styles.inputContainerRecover}>
                    <TextInput
                        placeholder="CPF cadastrado na conta"
                        placeholderTextColor='#555555'
                        underlineColorAndroid='#4da5ff'
                        style={styles.inputRecover}
                        onChangeText={handleChange('cpf')}
                        value={values.cpf}
                        onBlur={() => setFieldTouched('cpf')}
                        keyboardType={'numeric'}
                    />
                    {touched.cpf && errors.cpf &&
                    <Text style={{ fontSize: 10, color: 'red', marginLeft: 2 }}>{errors.cpf}</Text>
                }   
                </View>
                <View style={styles.inputContainerRecover}>
                    <TextInput
                        placeholder="Código de recuperação da conta"
                        placeholderTextColor='#555555'
                        underlineColorAndroid='#4da5ff'
                        style={styles.inputRecover}
                        onChangeText={handleChange('cod')}
                        keyboardType={'numeric'}
                        value={values.cod}
                        onBlur={() => setFieldTouched('cod')}
                    />
                    {touched.cod && errors.cod &&
                    <Text style={{ fontSize: 10, color: 'red', marginLeft: 2 }}>{errors.cod}</Text>
                }   
                </View>
                <TouchableOpacity >
                <Text style={styles.wppRecover} onPress={() => Linking.openURL(wppURL)}>Esqueci meu código de recuperação!</Text>
                </TouchableOpacity>
                <View style={styles.viewButtons}>
                    <TouchableOpacity style={styles.btns}
                                    onPress={() => handleSubmit()}>   
                        <Text style={styles.text}>Recuperar</Text>
                    </TouchableOpacity>
                <TouchableOpacity style={styles.btns}
                                onPress={() => returnLogin()}>    
                    <Text style={styles.text}>Cancelar</Text>
                </TouchableOpacity>
                </View>
            </View>
            )}</Formik>
            :
            <View style={{display:'none'}}>
            </View>
        }
        </KeyboardAvoidingView>
        )}
      </Formik>
        
    );
  }
const styles = StyleSheet.create({
    backgroundContainer:{
        height:900,
        alignItems: 'center',
        width: null,
        backgroundColor: '#fff'
    },
    backgroundContainer2:{
        height:900,
        alignItems: 'center',
        width: null,
        backgroundColor: '#000000',
        opacity: 0.3,
    },
    logoContainer:{
        alignItems: 'center',
        marginBottom: 50,
        marginTop: 40
    },
    inputContainer:{
        marginTop: 10
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
        top: 0,
        right: 15,
    },
    SenhaForg:{
        textAlign: 'right',
        color: '#555555',
        opacity: 0.7,
        textTransform: 'uppercase',
        marginRight: 9
    },
    wppRecover:{
        textAlign: 'left',
        color: '#555555',
        opacity: 0.7,
        textTransform: 'uppercase',
        marginRight: 38
    },
    btnLogin:{
        width: WIDTH - 55,
        height: 45,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        marginTop: 90,
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
    },
    viewEsquecida:{
        display:"flex",
        flex:1,
        backgroundColor:'#fff',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        height: 500,
        marginTop: 90,
        marginHorizontal: 30,
        borderColor: '#4da5ff',
        borderWidth: 0.4,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
    },
    titleRecover:{
        fontSize: 28,
        color: '#4da5ff',
        marginTop: 30,
        textDecorationLine: 'underline'

    },
    inputContainerRecover:{
        marginTop: 30    
    },  
    inputRecover:{
        width: WIDTH - 90,
        height: 55,
        fontSize: 16,
        paddingLeft: 5,
        paddingBottom: 24 ,
        color: 'black',
       
    },
    btns:{
        width: WIDTH - 90,
        height: 45,
        borderRadius: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        borderColor: '#4da5ff',
        borderWidth: 0.4,
        marginTop: 20,
    },
    viewButtons:{
        marginTop: 10,
        flexDirection: 'column',
    },
})