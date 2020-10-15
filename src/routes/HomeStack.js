import React from 'react'
import { createDrawerNavigator  } from '@react-navigation/drawer'
import CustomDrawerContent from '../assets/CustomDrawerContent';
import  HomeScreen from '../screens/HomeScreen'
import  RegistrosScreen from '../screens/Registros'
import SuporteScreen from '../screens/SuporteScreen';
import ConfigStack from './ConfigStack'


const drawer = createDrawerNavigator();

export default function HomeDrawer(){
    return(
        <drawer.Navigator drawerContent={props => CustomDrawerContent(props)}>
            <drawer.Screen
                name="HomeScreen" component={HomeScreen}
            />
            <drawer.Screen
                name="RegistrosScreen" component={RegistrosScreen}
            />
            <drawer.Screen
                name="SuporteScreen" component={SuporteScreen}
            />
            <drawer.Screen
                name="ConfigScreen" component={ConfigStack}
            />
        </drawer.Navigator>
    )
}
