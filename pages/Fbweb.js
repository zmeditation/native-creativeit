import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image, 
  WebView,
  AsyncStorage,
} from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import DrawerLayout from 'react-native-drawer-layout';
import Menu from './menu/Menu';
import PropTypes from 'prop-types';


import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const GLOBAL = require('../Global');



export default class Fbweb extends Component {

    static navigationOptions = {
        header: null
    }
    state = {

      drawerClosed: true,
      facebookUrl: 'https://facebook.com/'
  }
    constructor(props) {
        super(props);

        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.setDrawerState = this.setDrawerState.bind(this);

        AsyncStorage.getItem('facebookURL').then((value) => {
            console.log(value);
            
            if(value != null && value != '')
            this.setState({facebookUrl: value});
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
      resetNavigation(targetRoute) {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
            NavigationActions.navigate({ routeName: targetRoute }),
            ],
        });
        this.props.navigation.dispatch(resetAction);
    }
      componentDidMount(){
        this.setState({drawerClosed:true});
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
              <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{justifyContent: 'center', height: 60, paddingLeft: 4,}}>
                <MaterialIcons  name='keyboard-backspace' size={30} color={GLOBAL.COLOR.WHITE} />
              </TouchableOpacity>
          
              
                <View style={styles.logoView}>
                  <Image source={require('../resources/images/logo.png')} style={{width: 35, height: 35,resizeMode: 'contain', marginRight: 4, paddingBottom: 4}}/>
                  <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold', paddingTop: 8,  }}>
                      {GLOBAL.APP_TITLE}
                  </Text>
                </View> 
                <TouchableOpacity onPress={() => this.toggleDrawer()} style={{justifyContent: 'center', height: 60, paddingRight: 4,}}>
                  <MaterialIcons  name='notifications-none' size={30} color={GLOBAL.COLOR.WHITE} />
                </TouchableOpacity>
              </View>
              <WebView
                source={{uri: this.state.facebookUrl}}
                style={{flex: 1}}
                />


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



  });
