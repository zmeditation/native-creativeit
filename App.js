
import React from "react";
import { View, Text, AsyncStorage } from "react-native";
import { createStackNavigator, createAppContainer  } from "react-navigation";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Address from "./pages/Address";
import Tab from "./pages/Tab";
import Membership from "./pages/Membership";
import Setting from "./pages/Setting";
import World from "./pages/World";
import Usernoti from "./pages/Usernoti";
import About from "./pages/About";
import Inbox from "./pages/Inbox";
import Message from "./pages/Message";
import MsgView from "./pages/Msgview";
import Fbweb from "./pages/Fbweb"
import Nearby from "./pages/Nearby"
import Routes from "./pages/Routes"

import firebase from 'react-native-firebase';
const AppNavigator = createStackNavigator(
  {
    Splash: Splash,
    Login: Login,
    Profile: Profile,
    Address: Address,
    Tab: Tab,
    About: About,
    Usernoti: Usernoti,
    Membership: Membership,
    Setting: Setting,
    World: World,
    Inbox: Inbox,
    Message: Message,
    MsgView: MsgView,
    Fbweb: Fbweb,
    Nearby: Nearby,
    Routes: Routes
  },
  {
    initialRouteName: "Splash"
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  async componentDidMount() {
    this.checkPermission();
  }
  
    //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getToken();
    } else {
        this.requestPermission();
    }
  }
  
    //3
  async getToken() {


    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log(fcmToken)
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            console.log(fcmToken);
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
  }
  
    //2
  async requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  }
  render() {
    return <AppContainer />;
  }
}