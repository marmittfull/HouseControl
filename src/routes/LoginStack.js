import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import  HomeStack from './HomeStack'
import  LoginScreen from '../screens/LoginScreen'
import  AutenticVerific from '../screens/AutenticVerific'

const Stack = createStackNavigator()

export default function LoginStack(){
    return(
        <Stack.Navigator initialRouteName='AutenticVerific'>
            <Stack.Screen name='AutenticVerific' component={AutenticVerific}
                    options={{
                        headerShown: false
                    }}
                />
            <Stack.Screen name='LoginScreen' component={LoginScreen}
                    options={{
                        headerShown: false
                    }}
                />
            <Stack.Screen name='HomeScreen' component={HomeStack}
                    options={{
                        headerLeft: false,
                        headerTitle: '',
                        headerShown: false
                    }}
            />
            
        </Stack.Navigator>
    )
}