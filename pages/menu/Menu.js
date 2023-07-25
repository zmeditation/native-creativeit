import React, { Component, PropTypes } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, StyleSheet,Alert, Navigator, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackNavigator, StackActions, NavigationActions } from 'react-navigation';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

// import Main from './Main'

const menuList = require('./MenuList');

const GLOBAL = require('../../Global');

export default class Menu extends Component {
    state = {
        avatarURL: 'https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwi9yd2zzOLeAhUJH3AKHQujDaIQjRx6BAgBEAU&url=https%3A%2F%2Fwww.flaticon.com%2Ffree-icon%2Favatar_147144&psig=AOvVaw27VBJg6WoEHzXZ3Yv-s6s3&ust=1542790442092376',
        user_name: '',
        friends: '0 Friends',
        user_id: '',

    }
  constructor(props) {
    super(props);
    AsyncStorage.getItem('user_photo').then((value) => {
        console.log(value);
        this.setState({avatarURL: value});
    });
    AsyncStorage.getItem('user_name').then((value) => {
        console.log(value);
        this.setState({user_name: value});
    });
    AsyncStorage.getItem('user_id').then((value) => {
      console.log(value);
      this.setState({user_id: value});
      this.getFriendNum();
  });
  }

  getFriendNum(){

    let params = "user_id=" + this.state.user_id;
    return fetch(GLOBAL.BASE_URL + 'get_friend_num', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,

    })
      .then((responseJson) => responseJson.json())
      .then((response) => {
        console.log(response.data);
        if(response.success == 1){
          this.setState({
            friends: response.data + ' Friends'
          });
  
        }
  
      })
      .catch((error) => {
        console.error(error);
      });
  }

  goPage(name)
  {
    const { navigate } = this.props.nav;

    if(name == "Classic View")
    {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
        NavigationActions.navigate({ routeName: 'Tab'}),
        ],
    });
    this.props.nav.dispatch(resetAction);
    }

    if(name == "World View")
    {
      this.props.nav.navigate('World');
    }

    if(name == "Nearby")
    {
      this.props.nav.navigate('Nearby');
    }

    if(name == "Inbox"){
      this.props.nav.navigate('Inbox');
    }
    if(name == "Settings"){
      this.props.nav.navigate('Setting');
    }
    if(name == "My Routes"){
      this.props.nav.navigate('Routes');
    }
    
    if(name == "About"){
      this.props.nav.navigate('About');
    }



    if(name == "Become a VIP member here"){
      this.props.nav.navigate('Membership');
    }

  }

  render() {
    return (
      <View style={styles.wrapper}>
        <ScrollView>
        <View style = {styles.avatarContainer}>
            <Image source={{uri: this.state.avatarURL}} style = {styles.avatar} />
            
        </View>
        <Text style={styles.name}>{this.state.user_name}</Text>
        <View style={styles.friendView}>
            <Text style={styles.friendText}>{this.state.friends}</Text>
        </View>
 
          {menuList.MENU_LIST.map(item => (
            <TouchableOpacity
              style = {styles.menuItem}
              key={item.index}
              onPress={() => this.goPage(item.name)}
            >
              
            {
              item.index == 8 ? 
              <Image source={item.ic} style={styles.vipSideIcon}/>
              :
              
              <Image source={item.ic} style={styles.sideIcon}/>
            }
            {
              item.index == 8 ? 
              <Text style={styles.listMenu} style={{color: GLOBAL.COLOR.GREEN, paddingLeft: 14,}}>{item.name}</Text>
              :
              
              <Text style={styles.listMenu}>{item.name}</Text>
            }
            
            </TouchableOpacity>
          ))}
        <View style={{ height: 40, backgroundColor: 'rgba(190, 23, 20, 0)', }}/>  
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
    marginTop: 25,
    paddingTop: 30,
    height: hp('100%'), 
  },

  friendView:{
      flex: 1,
      flexDirection:'row',
      justifyContent: 'center',
      marginBottom: 8,
  },

  friendText:{
      textAlign:'center',
      color: 'white',
      fontSize: 14,
      width: '30%',
      height: 20,
      backgroundColor: GLOBAL.COLOR.RED,
      borderRadius: 10,
      overflow: "hidden",

  },
  name:{
    fontSize: 24,
    flex: 1,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  menuItem:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 16,
    paddingTop: 10,
  },
  listMenu: {
    color: 'black', 
    fontSize: 16, 
    paddingLeft: 20, 
    paddingTop: 12,
    paddingBottom: 12,
  },
  avatar:{
    resizeMode: 'cover',
    width: 100,
    height: 100,
    borderColor: GLOBAL.COLOR.RED,
    borderWidth: 1.5,
    borderRadius: 50,

    },
avatarContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.0)',
    zIndex: 1,

    },
    sideIcon:{
        width: 30,
        height: 30,
    },

    vipSideIcon: {
      width: 20,
      height: 25,
      resizeMode: 'contain',
    }

});