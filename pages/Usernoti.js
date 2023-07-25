import React, { Component } from 'react';
import { Platform, ImageBackground } from 'react-native';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
    Alert,
    AsyncStorage,
    TextInput,
    Text,
    View,
    Image,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    TouchableHighlight,
    KeyboardAvoidingView,
    FlatList,
} from 'react-native';

import {
    StackNavigator,
    StackActions,
    NavigationActions
} from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Card, ListItem, Button } from 'react-native-elements';
const GLOBAL = require('../Global');

export default class Usernoti extends Component {

    static navigationOptions = {
        header: null
    }

    state = {
        showSpinner: true,
        notiData: [],
        user_id: '',
    }



    constructor(props) {
        super(props);

        console.log("Notification");
        this.state.showSpinner = false;
        AsyncStorage.getItem('user_id').then((value) => {

            if (value != null && value != '') {
                console.log(value);
                this.setState({ user_id: value });
                //this.getNotiData();

            }
        });
    }


    getNotiData() {
        let params = "user_id=" + this.state.user_id;
        console.log(params)
        return fetch(GLOBAL.BASE_URL + 'get_notifications', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,

        })
            .then((responseJson) => responseJson.json())
            .then((response) => {
                console.log(response.data)
                this.setState({

                    notiData: response.data,
                });

            })
            .catch((error) => {
                console.error(error);
            });
    }


    componentDidMount() {

    }

    render() {
        const { state, navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <View style={styles.bar}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <MaterialIcons name='keyboard-backspace' size={30} color={GLOBAL.COLOR.WHITE} />
                    </TouchableOpacity>
                    <Text style={{color: 'white', marginLeft: 8, fontSize: 22,}}>Notifications</Text>
                </View>
                <FlatList
              style={{ margin: 8, }}
              data={this.state.notiData}
              renderItem={({ item: rowData }) => {
                    return(
                    (rowData.type == '1') ?                     
                      <ListItem
                      onPress={() => this.goMessageView(rowData.message_tb_id)}
                      containerStyle={{backgroundColor: 'rgba(0, 121, 0, 0.1)',}}
                      component={TouchableScale}
                      friction={90} //
                      tension={100} // These props are passed to the parent component (here TouchableScale)
                      activeScale={0.95} //
                      leftAvatar={{  rounded: true, source: { uri: rowData.photo} , size: "medium" }}
                      title={rowData.title}
                      titleStyle = {{color:'white', fontWeight: 'bold'}}
                      subtitle={
                          <View style={{ }}>
                            <Text style={{color: 'rgba(211,211,211,0.7)'}} numberOfLines={2}>{rowData.description}</Text>
                            <Text style={{color: 'rgba(211,211,211,1)', textAlign: 'right', paddingTop: 4, }}>{rowData.time}</Text>
                          </View>
                        
                      }
                      // subtitleStyle={{color:'rgba(211,211,211,1)', width: wp('60%')}}

                    />
                  
                :                      
                      rowData.type == '2' ? 
                      <ListItem
                      containerStyle={{backgroundColor: 'rgba(0, 121, 0, 0)',}}
                      component={TouchableScale}                      
                      friction={90} //
                      tension={100} // These props are passed to the parent component (here TouchableScale)
                      activeScale={0.95} //
                      leftAvatar={{  rounded: true, source: { uri: rowData.photo} , size: "medium" }}
                      title={rowData.title}
                      titleStyle = {{color:'white', fontWeight: 'bold'}}
                      subtitle={
                          <View style={{ }}>
                            <Text style={{color: 'rgba(211,211,211,0.7)'}} numberOfLines={2}>{rowData.message}</Text>
                            <Text style={{color: 'rgba(211,211,211,1)', textAlign: 'right', paddingTop: 4, }}>{rowData.time}</Text>
                          </View>
                        
                      }
                      // subtitleStyle={{color:'rgba(211,211,211,1)', width: wp('60%')}}
  
                    />:
                    <ListItem
    
                        containerStyle={{backgroundColor: 'rgba(0, 121, 0, 0)',}}
                        component={TouchableScale}
                        friction={90} //
                        tension={100} // These props are passed to the parent component (here TouchableScale)
                        activeScale={0.95} //
                        leftAvatar={{  rounded: true, source: { uri: rowData.photo} , size: "medium" }}
                        title={rowData.title}
                        titleStyle = {{color:'white', fontWeight: 'bold'}}
                        subtitle={
                            <View style={{ }}>
                            <Text style={{color: 'rgba(211,211,211,0.7)'}} numberOfLines={2}>{rowData.description}</Text>
                            <Text style={{color: 'rgba(211,211,211,1)', textAlign: 'right', paddingTop: 4, }}>{rowData.time}</Text>
                            </View>
                        
                        }
                        // subtitleStyle={{color:'rgba(211,211,211,1)', width: wp('60%')}}

                    />);
                  
  
              }}
              keyExtractor={(item, index) => index.toString()}
          />

            </View>
        );
    }
}

const styles = StyleSheet.create({



    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#a91117',
    },

    activityIndicator: {
        marginBottom: 30,
    },
  bar:{
    height: 45,
    paddingLeft: 12,
    marginTop: 25,
    width: wp('100%'),
    backgroundColor: '#a91117',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
},
});