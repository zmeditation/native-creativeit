import React, { Component } from 'react';
import {Platform, ImageBackground } from 'react-native';

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
    Switch,
    ActivityIndicator,
    TouchableOpacity,
    SectionList,
    TouchableHighlight, 
    KeyboardAvoidingView,
    StatusBar,
    FlatList,
    Vibration, } from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import DrawerLayout from 'react-native-drawer-layout';
import Menu from './menu/Menu';
import {
    StackNavigator,
    StackActions, 
    NavigationActions
} from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const GLOBAL = require('../Global');
export default class Setting extends Component {
    static navigationOptions = {
      headermode: 'screen',
      header: null
    } 
    constructor(props) {
      super(props);
      this.state = {

        drawerClosed: true,
        user_status: true,
        push_status: true,
        user_id:'',
        notification:false,
      };
      this.toggleDrawer = this.toggleDrawer.bind(this);
      this.setDrawerState = this.setDrawerState.bind(this);

      AsyncStorage.getItem('user_status').then((value) => {
        console.log(value);
        if(value != null && value != ''){
            console.log(value);
            if(value == 'active'){
              this.setState({user_status: true});
            }else{
              this.setState({user_status: false});
            }
        }
    });
    AsyncStorage.getItem('push_status').then((value) => {
      console.log(value);
      if(value != null && value != ''){
          if(value == 'active'){
            this.setState({push_status: true});
          }
          else{
            this.setState({push_status: false});
          }
      }
  });
  AsyncStorage.getItem('user_id').then((value) => {
    console.log(value);
    if(value != null && value != ''){
        console.log(value);
        this.setState({user_id: value});
    }
});
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

      updateUserStatus(value){
        let params = "user_id=" + this.state.user_id;
        if (value){
          params += "&user_status=" + 'active';
        }else{
          params += "&user_status=" + 'disable';
        }
        
        

        return fetch(GLOBAL.BASE_URL + 'update_user_status', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,

        })
            .then((responseJson) => responseJson.json())
            .then((response) => {
                if(response.success == 1){
                  if(value){
                    AsyncStorage.setItem('user_status', 'active');
                  }else{
                    AsyncStorage.setItem('user_status', 'disable');
                  }


                  this.setState({user_status: value});
                }else{
                  alert("Setting Update Failed");
                }
            })
            .catch((error) => {
                console.error(error);
            });
      }

      updatePushStatus(value){
        let params = "user_id=" + this.state.user_id;
        if (value){
          params += "&push_status=" + 'active';
        }else{
          params += "&push_status=" + 'disable';
        }
        

        return fetch(GLOBAL.BASE_URL + 'update_push_status', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,

        })
            .then((responseJson) => responseJson.json())
            .then((response) => {

              if(response.success == 1){
                if(value){
                  AsyncStorage.setItem('push_status', 'active');
                }else{
                  AsyncStorage.setItem('push_status', 'disable');
                }

                this.setState({push_status: value});
              }else{
                alert("Setting Update Failed");
              }

            })
            .catch((error) => {
                console.error(error);
            });
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
              {
                this.state.notification ? <MaterialIcons  name='notifications-active' size={30} color={GLOBAL.COLOR.WHITE} />:
                <MaterialIcons  name='notifications-none' size={30} color={GLOBAL.COLOR.WHITE} />
              }
              </TouchableOpacity>
            </View>
            
            <Text style={{textAlign: 'center', fontSize: 24, color: 'white', width: wp('100%'), padding: 12}}>Settings</Text>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', margin: 12,}}>
                <Text style={{textAlign: 'left', marginLeft: 12, fontSize: 20, color: 'white'}}>Share Account</Text>
                <Switch style={{ marginLeft: 36, }} value={this.state.user_status} onValueChange={(value) => this.updateUserStatus(value)}/>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', margin: 12}}>
                <Text style={{textAlign: 'left', marginLeft: 12, fontSize: 20, color: 'white'}}>Turn On Push Notification</Text>
                <Switch style={{ marginLeft: 36,}} value={this.state.push_status} onValueChange={(value) => this.updatePushStatus(value) }/>
            </View>
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
