import React, { Component } from 'react';
import {Platform, ImageBackground } from 'react-native';
import TouchableScale from 'react-native-touchable-scale'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
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
    SectionList,
    TouchableHighlight, 
    KeyboardAvoidingView,
    StatusBar,
    FlatList,
   NativeModules, } from 'react-native';

import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import DrawerLayout from 'react-native-drawer-layout';
import Menu from './menu/Menu';
import {
    StackNavigator,
    StackActions, 
    NavigationActions
} from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { SwipeListView } from 'react-native-swipe-list-view';
import ActionButton from 'react-native-action-button';
import { Card, ListItem, Button } from 'react-native-elements';

const GLOBAL = require('../Global');
const { StatusBarManager } = NativeModules;
export default class Inbox extends Component {
    static navigationOptions = {
      headermode: 'screen',
      header: null
    } 

   state = {
    drawerClosed: true,
    inboxData: [],
    notification:false,
    user_id: '',
    }
    constructor(props) {
      super(props);

      console.log('statusBarHeight: ', StatusBar.currentHeight);
      if(Platform.OS == 'ios'){
        StatusBarManager.getHeight((statusBarHeight)=>{
          console.log(statusBarHeight)
        });
      }
      this.toggleDrawer = this.toggleDrawer.bind(this);
      this.setDrawerState = this.setDrawerState.bind(this);


      AsyncStorage.getItem('user_id').then((value) => {

        if (value != null && value != '') {
            console.log(value);
            this.setState({user_id: value});
            this.getInboxData();

        }
    });
  }
  getInboxData(){
    let params = "user_id=" + this.state.user_id;
    console.log(params)
    return fetch(GLOBAL.BASE_URL + 'get_user_messages', {
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

                inboxData: response.data,
            });

        })
        .catch((error) => {
            console.error(error);
        });
  }

  goMessageView(message_id){

    console.log(message_id);
    AsyncStorage.setItem('message_id', message_id);
    this.resetNavigation('Msgview');
  }
  setDrawerState(){
        this.setState({
          drawerClosed: !this.state.drawerClosed,
        });
      }
    
  toggleDrawer = () => {
    if(this.state.drawerClosed)
    {
      this.DRAWER.openDrawer();
    } else {
      this.DRAWER.closeDrawer();
    }
  }
  resetNavigation(targetRoute) {
    const resetAction = StackActions.reset({
        index: 0,
        actions: [
        NavigationActions.navigate({ routeName: targetRoute }),
        ],
    });
    this.props.navigation.dispatch(resetAction);
}
componentDidMount() {
  
  
 }

  render() {

    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <DrawerLayout
            drawerWidth={280}
            
            ref={drawerElement => {
              this.DRAWER = drawerElement;
            }}
            drawerPosition={DrawerLayout.positions.Left}
            onDrawerOpen={this.setDrawerState}
            onDrawerClose={this.setDrawerState}
            renderNavigationView={() => <Menu nav = {this.props.navigation}/>} 
            >
            <View style={styles.bar}>
            <TouchableOpacity onPress={() => this.toggleDrawer()} style={{justifyContent: 'center', height: 60, paddingLeft: 4,}}>
            <MaterialIcons  name='menu' size={30} color={GLOBAL.COLOR.WHITE} />
            </TouchableOpacity>
          
              
              <View style={styles.logoView}>
                <Image source={require('../resources/images/logo.png')} style={{width: 35, height: 35,resizeMode: 'contain', marginRight: 4, paddingBottom: 4}}/>
                <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold', paddingTop: 8,  }}>
                  {GLOBAL.APP_TITLE}
                </Text>
              </View> 
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Usernoti')} style={{justifyContent: 'center', height: 60, paddingRight: 4,}}>
              <MaterialIcons  name='notifications-none' size={30} color={GLOBAL.COLOR.WHITE} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              style={{ height: 50, paddingTop: 4, marginLeft: 8, marginRight: 8, marginTop: 8, marginBottom: 4, }}
              data={this.state.inboxData}
              renderItem={({ item: rowData }) => {
                    return(
                    (rowData.checked == 'pending') ?                     
                      <ListItem
                      onPress={() => this.goMessageView(rowData.msg_id)}
                      containerStyle={{backgroundColor: 'rgba(0, 121, 0, 0.1)',}}
                      component={TouchableScale}
                      friction={90} //
                      tension={100} // These props are passed to the parent component (here TouchableScale)
                      activeScale={0.95} //
                      leftAvatar={{  rounded: true, source: { uri: rowData.user_photo} , size: "medium" }}
                      title={rowData.title}
                      titleStyle = {{color:'white', fontWeight: 'bold'}}
                      subtitle={
                          <View style={{ }}>
                            <Text style={{color: 'rgba(211,211,211,0.7)'}} numberOfLines={2}>{rowData.message}</Text>
                            <Text style={{color: 'rgba(211,211,211,1)', textAlign: 'right', paddingTop: 4, }}>{rowData.time}</Text>
                          </View>
                        
                      }
                      // subtitleStyle={{color:'rgba(211,211,211,1)', width: wp('60%')}}

                    />
                  
                :                      
                 <ListItem
   
                    containerStyle={{backgroundColor: 'rgba(0, 121, 0, 0)',}}
                    component={TouchableScale}
                    onPress={() => this.goMessageView(rowData.msg_id)}
                    friction={90} //
                    tension={100} // These props are passed to the parent component (here TouchableScale)
                    activeScale={0.95} //
                    leftAvatar={{  rounded: true, source: { uri: rowData.user_photo} , size: "medium" }}
                    title={rowData.title}
                    titleStyle = {{color:'white', fontWeight: 'bold'}}
                    subtitle={
                        <View style={{ }}>
                          <Text style={{color: 'rgba(211,211,211,0.7)'}} numberOfLines={2}>{rowData.message}</Text>
                          <Text style={{color: 'rgba(211,211,211,1)', textAlign: 'right', paddingTop: 4, }}>{rowData.time}</Text>
                        </View>
                      
                    }
                    // subtitleStyle={{color:'rgba(211,211,211,1)', width: wp('60%')}}

                  />);
                  
  
              }}
              keyExtractor={(item, index) => index.toString()}
          />

          <ActionButton buttonColor="rgba(00,121,00,0.8)" onPress={() => this.resetNavigation('Message')} position="right" offsetX={10} offsetY={20} >

          </ActionButton>
          </DrawerLayout>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   backgroundColor: GLOBAL.COLOR.RED,
  },

  bar:{
    height: 60,
    marginTop: 25,
    backgroundColor: GLOBAL.COLOR.RED,
    flexDirection: 'row',
    justifyContent: 'space-between',
},

  logoView: {
    height: 50,
    backgroundColor: 'rgba(190, 23, 20, 1)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
})
