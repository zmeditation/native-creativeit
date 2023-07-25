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
import DrawerLayout from 'react-native-drawer-layout';
import Menu from './menu/Menu';
import {
    StackNavigator,
    StackActions,
    NavigationActions
} from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const GLOBAL = require('../Global');

export default class About extends Component {
    static navigationOptions = {
      headermode: 'screen',
      header: null
    } 
    state = {

        drawerClosed: true,
        notification:false,
      }

    constructor(props) {
      super(props);


      this.toggleDrawer = this.toggleDrawer.bind(this);
      this.setDrawerState = this.setDrawerState.bind(this);
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
            <Text style={{textAlign: 'center', fontSize: 24, color: 'white', width: wp('100%'), padding: 12}}>About US</Text>
            <Text style={{textAlign: 'center', fontSize: 14, color: 'white', width: wp('100%'), padding: 12}}>
              {GLOBAL.ABOUT_US}
            </Text>

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
