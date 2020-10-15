import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import  ConfigScreen from '../screens/ConfigScreen'
import  AlterarUsuariosScreen from '../screens/AlterarUsuariosScreen'
import  NovoUsuarioScreen from '../screens/NovoUsuarioScreen'
import editarUser from '../screens/editarUser'

const Stack = createStackNavigator()

export default function ConfigStack(){
    return(
        <Stack.Navigator initialRouteName='ConfigScreen'>
            <Stack.Screen name='ConfigScreen' component={ConfigScreen}
                    options={{
                        headerShown: false
                    }}
                />
            <Stack.Screen name='NovoUsuarioScreen' component={NovoUsuarioScreen}
                    options={{
                        headerLeft: false,
                        headerTitle: '',
                        headerShown: false
                    }}
            />
            <Stack.Screen name='AlterarUsuariosScreen' component={AlterarUsuariosScreen}
                    options={{
                        headerLeft: false,
                        headerTitle: '',
                        headerShown: false
                    }}
            />
            <Stack.Screen name="editarUser" component={editarUser}
                options={{
                    headerLeft: false,
                    headerTitle: '',
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}