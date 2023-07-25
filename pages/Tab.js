import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image, 
  Vibration,
} from 'react-native';
import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import DrawerLayout from 'react-native-drawer-layout';
import Menu from './menu/Menu';
import PropTypes from 'prop-types';
import Classic from './tab/Classic';
import Locateme from './tab/Locateme';
import Userinfo from './tab/Userinfo';
import Business from './tab/Business';
import Smsg from './tab/Smsg';
import Addr from './tab/Addr';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const GLOBAL = require('../Global');
import Toast, {DURATION} from 'react-native-easy-toast';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';




export default class Tab extends Component {

    static navigationOptions = {
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
      _positionDetect()
      {

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

                <App/>
                <Toast ref="toast" style={{position: 'absolute',  left: 0, width: wp('100%'),
                        backgroundColor: GLOBAL.COLOR.GREEN}
                }
                
                fadeInDuration={750}
                fadeOutDuration={3000}
                opacity={0.9}
                textStyle={{color:'white'}}/>

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

const ClassicStack = createStackNavigator({
    Classic: Classic,
    Userinfo: Userinfo,
    Business: Business,
    Addr: Addr,
});  


const LocateStack = createStackNavigator({
  Locateme: Locateme,
  Smsg: Smsg,

});  




const Tabpage = createBottomTabNavigator(
    {
        Classic: {
            screen: ClassicStack,
            navigationOptions: {
                    tabBarLabel: 'Classic View',
                    swipeEnabled: true,
                    tabBarIcon: ({ focused, horizontal, tintColor }) => {
                      
                      // You can return any component that you like here! We usually use an
                      // icon component from react-native-vector-icons
                      if(focused){
                        return <MaterialCommunityIcons name='earth' size={horizontal ? 20 : 25} color={GLOBAL.COLOR.GREEN} />;
                      }else{
                        return <MaterialCommunityIcons name='earth' size={horizontal ? 20 : 25} color={GLOBAL.COLOR.WHITE} />;
                      }

                    },
                             
              },

        },
        Locateme: {
            screen: LocateStack,
            navigationOptions: {
                tabBarLabel: 'Locate me',
                swipeEnabled: true,
                tabBarIcon: ({ focused, horizontal, tintColor }) => {
                      
                  // You can return any component that you like here! We usually use an
                  // icon component from react-native-vector-icons
                  if(focused){
                    return <Entypo name='location' size={horizontal ? 20 : 25} color={GLOBAL.COLOR.GREEN} />;
                  }else{
                    return <Entypo name='location' size={horizontal ? 20 : 25} color={GLOBAL.COLOR.WHITE} />;
                  }

                },
          },


        },
      // Userinfo: {
      //   screen: Userinfo
      // },

    },
    {
        tabBarPosition: 'bottom',
        tabBarOptions: {
          activeTintColor: GLOBAL.COLOR.GREEN,
          inactiveTintColor: 'white',
          activeBackgroundColor: 'white',
          inactiveBackgroundColor: GLOBAL.COLOR.GREEN,
          showIcon: true,
          labelStyle: {
            fontSize: 11,
          },
          tabStyle: {
            width: 100,
          },
          style: {
            backgroundColor: 'white',
          },
        },

       
    },

    {
        initialRouteName: 'Classic',
      },
);

const App = createAppContainer(Tabpage);