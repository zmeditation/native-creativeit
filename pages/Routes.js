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
  SectionList,
  TouchableHighlight,
  KeyboardAvoidingView,
  StatusBar,
  FlatList,
  Vibration,
  NativeModules,
} from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
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
const { StatusBarManager } = NativeModules;
export default class Routes extends Component {
  static navigationOptions = {
    headermode: 'screen',
    header: null
  }
  state = {

    drawerClosed: true,
    curLat: 0.0,
    curLong: 0.0,
    desLat: 0.0,
    desLong: 0.0,
    notification:false,
  };
  constructor(props) {
    super(props);

    console.log('statusBarHeight: ', StatusBar.currentHeight);
    if (Platform.OS == 'ios') {
      StatusBarManager.getHeight((statusBarHeight) => {
        console.log(statusBarHeight)
      });
    }
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.setDrawerState = this.setDrawerState.bind(this);
    AsyncStorage.getItem('user_longitude').then((value) => {
      console.log(value);
      if (value != null && value != '') {
        console.log(value);
        this.setState({ desLong: parseFloat(value) });

      }
    });
    AsyncStorage.getItem('user_latitude').then((value) => {
      console.log(value);
      if (value != null && value != '') {
        console.log(value);
        this.setState({ desLat: parseFloat(value) });

      }
    });


  }


  setDrawerState() {
    this.setState({
      drawerClosed: !this.state.drawerClosed,
    });
  }

  toggleDrawer = () => {
    if (this.state.drawerClosed) {
      this.DRAWER.openDrawer();
    } else {
      this.DRAWER.closeDrawer();
    }
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
          renderNavigationView={() => <Menu nav={this.props.navigation} />}
        >
          <View style={styles.bar}>
            <TouchableOpacity onPress={() => this.toggleDrawer()} style={{ justifyContent: 'center', height: 60, paddingLeft: 4, }}>
              <MaterialIcons name='menu' size={30} color={GLOBAL.COLOR.WHITE} />
            </TouchableOpacity>


            <View style={styles.logoView}>
              <Image source={require('../resources/images/logo.png')} style={{ width: 35, height: 35, resizeMode: 'contain', marginRight: 4, paddingBottom: 4 }} />
              <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold', paddingTop: 8, }}>
                {GLOBAL.APP_TITLE}
              </Text>
            </View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Usernoti')} style={{ justifyContent: 'center', height: 60, paddingRight: 4, }}>
            {
                this.state.notification ? <MaterialIcons  name='notifications-active' size={30} color={GLOBAL.COLOR.WHITE} />:
                <MaterialIcons  name='notifications-none' size={30} color={GLOBAL.COLOR.WHITE} />
            }
            </TouchableOpacity>
          </View>
          <MapView
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
            region={{
                latitude: this.state.curLat,
                longitude: this.state.curLong,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0921
            }}  >
          <Marker coordinate={{latitude: this.state.curLat, longitude: this.state.curLong}}/>
          <Marker coordinate={{latitude: this.state.desLat, longitude: this.state.desLong}}/>
          
          <MapViewDirections
            origin={{
              latitude: this.state.curLat,
              longitude: this.state.curLong,
            }}
            destination={{
              latitude: this.state.desLat,
              longitude: this.state.desLong,

            }}
            apikey={GLOBAL.GOOGLE_API_KEY}
            strokeWidth = {3}
            strokeColor="hotpink"
          />
        </MapView>

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

  bar: {
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
