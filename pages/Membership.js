import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image, 
  ScrollView,
} from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import DrawerLayout from 'react-native-drawer-layout';
import Menu from './menu/Menu';
import PropTypes from 'prop-types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { PricingCard } from 'react-native-elements';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const GLOBAL = require('../Global');




export default class Membership extends Component {

    static navigationOptions = {
        header: null
    }
    state = {

      drawerClosed: true,
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
      _positionDetect()
      {

      }
      componentDidMount(){
        this.setState({drawerClosed:true});
      }

      _purchaseBasic(){

      }

      _purchasePlus(){

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
              <ScrollView style={{ backgroundColor: 'rgba(255, 255, 255, 0)'}}>
                <View style={{alignItems: 'center'}}>
                    <PricingCard
                        color='#4f9deb'
                        title='Basic'
                        price='$1.99'
                        info={['1 Month', 'Full Support', 'All Core Features']}
                        button={{ title: 'GET STARTED', icon: 'flight-takeoff' }}
                        containerStyle={{marginTop: 20, width: wp('80%'), borderRadius: 4}}
                        onButtonPress={() => this._purchaseBasic()}
                        />
                        <PricingCard
                        color='#a72ce9'
                        title='Plus'
                        price='$12.99'
                        info={['12 Month', 'Full Support', 'All Core Features']}
                        button={{ title: 'GET STARTED', icon: 'flight-takeoff' }}
                        containerStyle={{marginTop: 12,  width: wp('80%'), borderRadius: 4}}
                        onButtonPress={() => this._purchasePlus()}
                        />
                </View>

              </ScrollView>



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

    welcome: {
      fontSize: 35,
      color: '#6600ff',
  
    },
    logoView: {
      height: 50,
      backgroundColor: 'rgba(190, 23, 20, 1)',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    instructions: {
      marginTop: 40,
      textAlign: 'center',
      color: '#333333',
      marginBottom: 80,
      fontSize: 20,
    },

    title:{
      textAlign: 'center',
      fontSize: 24,
      
    },
    buttonContainer: {
      backgroundColor: '#2E9298',
      borderRadius: 10,
      padding: 10,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 10,
      shadowOpacity: 0.25,
      marginRight: 20,
      marginLeft: 20,
    },
  });