import React, {Component} from 'react';
import { View, TouchableOpacity, Text, FlatList, StyleSheet, LayoutAnimation, Platform, UIManager, Dimensions} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width: WIDTH } = Dimensions.get('window')

export default class Accordian extends Component{

    constructor(props) {
        super(props);
        this.state = { 
          data: props.data,
          expanded : false,
        }

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }
  
  render() {

    return (
       <View>
            <TouchableOpacity style={styles.row} onPress={()=>this.toggleExpand()}>
                <Text style={[styles.title]}>{this.props.title}</Text>
                <Icon name={this.state.expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color={'#4da5ff'} />
            </TouchableOpacity>
            <View style={styles.parentHr}/>
            {
                this.state.expanded &&
                <View style={{}}>
                    <FlatList
                    data={this.state.data}
                    numColumns={1}
                    scrollEnabled={false}
                    renderItem={({item, index}) => 
                        <View style={{}}>
                            <View style={[styles.childRow, styles.button]}>
                                <Text style={styles.font} >{item.key}</Text>
                            </View>
                            <View style={styles.childHr}/>
                        </View>
                    }
                    
                    />
                </View>
            }
            
       </View>
    )
  }

  onClick=(index)=>{
    const temp = this.state.data.slice()
    temp[index].value = !temp[index].value
    this.setState({data: temp})
  }

  toggleExpand=()=>{
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({expanded : !this.state.expanded})
  }

}

const styles = StyleSheet.create({
    container:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    button:{
        width:'100%',
        minHeight:54,
        alignItems:'center',
        paddingLeft:35,
        paddingRight:35,
        fontSize: 12,
    },
    title:{
        fontSize: 14,
        fontWeight:'bold',
        color: '#4da5ff',
        width: WIDTH - 80
    },
    row:{
        flexDirection: 'row',
        justifyContent:'space-between',
        height:56,
        paddingLeft:25,
        paddingRight:18,
        alignItems:'center',
        backgroundColor: 'white',
        borderBottomWidth: 0.6,
        borderColor: '#4da5ff',
    },
    childRow:{
        flexDirection: 'row',
        justifyContent:'space-between',
        backgroundColor: 'rgba(220,220,220, 0.5)',
        flex: 1,

    },
    font:{
        color: '#4da5ff',
        textAlign: 'justify',
        marginVertical: 5,
        fontSize: 15
    }
    
});