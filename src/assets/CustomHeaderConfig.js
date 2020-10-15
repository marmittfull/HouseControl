import React, { Component } from 'react'
import { Text, View, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import  AntDesign  from 'react-native-vector-icons/AntDesign'

export class CustomHeaderConfig extends Component{
    render(){
        return(
            <View style={styles.menuContainer}>
                <StatusBar hidden={true}/>
                <View style={{flex:1, justifyContent: 'center'}}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <AntDesign name='back' size={40} style={styles.menuIcon} /> 
                        </TouchableOpacity>
        
                </View>
                <View style={{flex:1.5, justifyContent:'center'}}>
                    <Text style={styles.menuText}>{this.props.title}</Text>
                </View>
                <View style={{flex:1, }}></View>
            </View>
  
        )
    }
}
const styles = StyleSheet.create({
    menuIcon:{
        marginLeft:9,
        color: '#fff'
    },
    menuText:{
        textAlign: 'center',
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    menuContainer:{
        backgroundColor: '#6cadff',
        flexDirection: 'row', 
        height: 50, 
    },
})