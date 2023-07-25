import { createStackNavigator, createDrawerNavigator } from 'react-navigation';
import React, { Component } from 'react';
import { Platform, ImageBackground } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
    Alert,
    AsyncStorage,
    TextInput,
    Text,
    View,
    Image,
    ScrollView,
    Switch,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    TouchableHighlight,
    KeyboardAvoidingView
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast';
import {
    StackNavigator,
    StackActions,
    NavigationActions
} from 'react-navigation';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ActionButton from 'react-native-action-button';

const GLOBAL = require('../../Global');

export default class Classic extends Component {


  state = {
      showSpinner: true,
      latitude: 0.0,
      longitude: 0.0,
      user_id: '',
      user_photo: '',
      user_name: '',
      user_phone: '',
      user_address: '',
      map_latitude: 0.0,
      modalVisible: false,
      showCongView: true,
      showUserInfoView: true,
      showBusinessView: false,

      memberName: '',
      memberPhoto: '',
      memberPhone: '',
      memberAddr: '',

      business_name: '',
      business_category: '',
      business_email:'',
      business_website: '',
      business_phone: '',
      business_location: '',
      business_address: '',


      user_status: true,
      business: [],
      notification: {},
  }

  static navigationOptions = {
      header: null,
  }
  constructor(props) {
      super(props);

      console.log("LoginConstructor");
      this.state.showSpinner = false;


      this.getBusinessInfos();

      AsyncStorage.getItem('latitude').then((value) => {
          console.log(value);
          if (value != null && value != '') {
              // console.log(value);
              temp = parseFloat(value);
              temp_location = temp + 0.04;
              console.log(temp_location);
              this.setState({ latitude: temp });
              this.setState({ map_latitude: temp_location });
          }
      });

      AsyncStorage.getItem('longitude').then((value) => {
          console.log(value);
          if (value != null && value != '') {
              console.log(value);
              this.setState({ longitude: parseFloat(value) });

          }
      });
      AsyncStorage.getItem('user_photo').then((value) => {
          console.log(value);
          if (value != null && value != '') {
              console.log(value);
              this.setState({ user_photo: value });
          }
      });
      AsyncStorage.getItem('user_name').then((value) => {
          console.log(value);
          if (value != null && value != '') {
              console.log(value);
              this.setState({ user_name: value });
          }
      });
      AsyncStorage.getItem('user_phone').then((value) => {
          console.log(value);
          if (value != null && value != '') {
              console.log(value);
              this.setState({ user_phone: value });
          }
      });
      AsyncStorage.getItem('user_address').then((value) => {
          console.log(value);
          if (value != null && value != '') {
              console.log(value);
              this.setState({ user_address: value });
          }
      });
      AsyncStorage.getItem('user_id').then((value) => {
          console.log(value);
          if (value != null && value != '') {
              console.log(value);
              this.setState({ user_id: value });
          }
      });

      AsyncStorage.getItem('user_status').then((value) => {
          console.log(value);
          if (value != null && value != '') {
              console.log(value);
              if (value == 'active') {
                  this.setState({ user_status: true });
              } else {
                  this.setState({ user_status: false });
              }
          }
      });


  }


  _hiddenInfoView() {
      this.setState({showUserInfoView: false});
  }

  _hiddenCongView() {

      // AsyncStorage.setItem('login', 'disable');
      this.setState({ showCongView: false });


  }

  _addBusiness() {
      console.log('business');
  }

  _editProfile() {
      this.resetNavigation('Userinfo');
  }

  _changeUserStatus(value) {
      let params = "user_id=" + this.state.user_id;
      if (value) {
          params += "&user_status=" + 'active';
      } else {
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
              if (response.success == 1) {
                  if (value) {
                      AsyncStorage.setItem('user_status', 'active');
                  } else {
                      AsyncStorage.setItem('user_status', 'disable');
                  }


                  this.setState({ user_status: value });
              } else {
                  alert("Setting Update Failed");
              }
          })
          .catch((error) => {
              console.error(error);
          });
  }


  getBusinessInfos() {
      let params = "user_id=" + this.state.user_id;


      return fetch(GLOBAL.BASE_URL + 'get_business_infos', {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params,

      })
          .then((responseJson) => responseJson.json())
          .then((response) => {
              if (response.success == 1) {
                  this.setState({ business: response.data });
              } else {

              }
          })
          .catch((error) => {
              console.error(error);
          });
  }

  setBusinessData(data) {
      this.setState({showBusinessView: true});
      this.setState({showUserInfoView: false})
      this.setState({memberAddr: data.user_address});
      this.setState({memberName: data.user_name});
      this.setState({memberPhone: data.user_phone});
      this.setState({memberPhoto: data.user_photo});
      this.setState({business_name: 'Business Name: ' + data.name});
      this.setState({business_category: 'Business Category:' + data.category});
      this.setState({business_email: 'Business Email:' + data.email});
      this.setState({business_website: 'Business Website:' + data.website});
      this.setState({business_phone: 'Business Phone:' + data.phone});
      this.setState({business_address: 'Business Address:' + data.address});

  }
  _showInfoView(){
      this.setState({showUserInfoView: true});
  }
  componentDidMount() {
      
  }

  
  closeDialog(){

      this.setState({showBusinessView: false});
  }

  render() {
      const { state, navigate } = this.props.navigation;
      return (
          <View style={styles.basicContainer}>
              <MapView
                  style={{ flex: 1 }}
                  provider={PROVIDER_GOOGLE}
                  region={{
                      latitude: this.state.map_latitude,
                      longitude: this.state.longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421
                  }}  >
                  {
                      this.state.showCongView ?
                          <Marker coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }} onPress={(marker) => this.setBusinessData(marker)}>
                              <View>
                                  <ImageBackground source={require('../../resources/images/user_marker.png')} style={styles.backgroundImage}>
                                      <Image source={{ uri: this.state.user_photo }} style={styles.locationImage} />
                                  </ImageBackground>
                              </View>
                          </Marker>
                          :
                          this.state.business.map((marker, index) => {

                              const coords = {
                                  latitude: parseFloat(marker.latitude),
                                  longitude: parseFloat(marker.longitude),
                              };

                              var avatar = marker.user_photo;
                              if (marker.user_photo == null || marker.user_photo == '') {
                                  avatar = "https://www.flaticon.com/free-icon/avatar_147144";
                              }


                              return (
                                  <Marker key={index} coordinate={coords}
                                      onPress={() => this.setBusinessData(marker)}
                                  >
                                      <View>
                                          <ImageBackground source={require('../../resources/images/user_marker.png')} style={styles.backgroundImage}>
                                              <Image source={{ uri: avatar }} style={styles.locationImage} />
                                          </ImageBackground>
                                      </View>
                                  </Marker>
                              );
                          })
                  }

              </MapView>
              {

                  this.state.showUserInfoView ?
                      <View style={{position: 'absolute', top: 0, left: 0, backgroundColor: 'white', width: wp('100%')}}>
                          <View style={styles.userView}>
                              <Image source={{ uri: this.state.user_photo }} style={styles.userImageView} />
                              <View style={styles.infoContainer}>
                                  <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', marginBottom: 6 }}>
                                      {this.state.user_name}
                                  </Text>
                                  <View style={styles.textInfo}>
                                      <Image source={require('../../resources/images/phone_white_ic.png')} style={{ width: 16, height: 16, resizeMode: 'stretch' }} />
                                      <Text style={{ fontSize: 16, color: 'white', marginLeft: 4 }}>{this.state.user_phone}</Text>
                                  </View>
                                  <View style={styles.textInfo}>
                                      <Image source={require('../../resources/images/pin_white_ic.png')} style={{ width: 16, height: 16, resizeMode: 'stretch' }} />
                                      <Text numberOfLines={2} style={{ width: 200, fontSize: 16, color: 'white', marginLeft: 4, paddingRight: 8, }}>{this.state.user_address}</Text>
                                  </View>

                              </View>
                              <View style={styles.hiddenContainer}>
                                  <TouchableOpacity onPress={() => this._hiddenInfoView()} style={styles.hiddenContainer}>
                                      <Image
                                          style={styles.button}
                                          source={require('../../resources/images/hide_ic.png')}
                                      />
                                  </TouchableOpacity>
                              </View>
                          </View>
                          <View style={styles.settingView}>
                              <TouchableOpacity onPress={() => this.props.navigation.navigate('Userinfo')} style={{
                                  flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', borderRadius: 16, borderColor: 'white', borderWidth: 1, backgroundColor: GLOBAL
                                      .COLOR.RED, height: 32, width: 80, paddingLeft: 12,
                              }}>
                                  <MaterialIcons name='edit' size={20} color={GLOBAL.COLOR.WHITE} />
                                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Edit</Text>
                              </TouchableOpacity>
                              <Text style={{ fontSize: 16, marginLeft: 20, color: 'white' }}>
                                  Visible on map
                              </Text>
                              <Switch style={{ marginLeft: 8, }} value={this.state.user_status} onValueChange={(value) => this._changeUserStatus(value)} />

                          </View>
                      </View> :
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(190, 23, 20, 0.9)', height: 40, width: wp('100%'), }}>
                          <TouchableOpacity onPress={() =>this._showInfoView()} style={{paddingRight: 20, alignItems: 'center'}}>
                              <Image
                                  style={styles.button}
                                  source={require('../../resources/images/show_ic.png')}
                              />
                          </TouchableOpacity>
                      </View>
              }

             
              {
                  this.state.showCongView ?
                      <View style={styles.congView}>
                          <Text style={{ marginTop: 20, color: GLOBAL.COLOR.RED, fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
                              {'CONGRATS ' + this.state.user_name + '!'}
                          </Text>
                          <Text style={{ fontSize: 12, textAlign: 'center' }}>
                              You're a pioneer in this region
                  </Text>
                          <TouchableOpacity onPress={() => this._hiddenCongView()} style={{
                              flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8, borderRadius: 16, backgroundColor: GLOBAL
                                  .COLOR.RED, height: 32, width: 80
                          }}>
                              <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>DONE</Text>
                          </TouchableOpacity>
                      </View>
                      : null

              }
              {
                  this.state.showBusinessView ? 
                      <View style={styles.businessView}>
                          <TouchableOpacity onPress={() => this.closeDialog()} style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 4, paddingTop: 4 }}>
                              <MaterialIcons name='close' size={16} color={GLOBAL.COLOR.DARKGRAY} />
                          </TouchableOpacity>
                          <View style={styles.businessUserView}>
                              <Image source={{ uri: this.state.memberPhoto }} style={styles.businessImageView} />
                              <View style={styles.infoContainer}>
                                  <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 6 }}>
                                      {this.state.memberName}
                                  </Text>
                                  <View style={styles.textInfo}>
                                      <Image source={require('../../resources/images/phone_red_ic.png')} style={{ width: 16, height: 16, resizeMode: 'stretch' }} />
                                      <Text style={{ fontSize: 16,  marginLeft: 4 }}>{this.state.memberPhone}</Text>
                                  </View>
                                  <View style={styles.textInfo}>
                                      <Image source={require('../../resources/images/location_red_ic.png')} style={{ width: 16, height: 16, resizeMode: 'stretch' }} />
                                      <Text numberOfLines={2} style={{ width: 200, fontSize: 16,  marginLeft: 4, paddingRight: 8, }}>{this.state.memberAddr}</Text>
                                  </View>

                              </View>
                          </View>
                          <Text style={{textAlign: 'left', fontSize: 12, color: GLOBAL.COLOR.DARKGRAY, marginLeft: 12,}}>
                             Business Info
                          </Text>
                          <View style={{backgroundColor: GLOBAL.COLOR.DARKGRAY, height: 1, marginLeft: 12, marginRight: 12}}/>
                          <View style={{alignItems: 'left', paddingLeft: 16,  marginBottom: 16}}>
                              <Text style={{marginTop: 12, color: GLOBAL.COLOR.DARKGRAY}}>
                                  {this.state.business_name}
                              </Text>
                              <Text style={{marginTop: 12, color: GLOBAL.COLOR.DARKGRAY}}>
                                  {this.state.business_category}
                              </Text>
                              <Text style={{marginTop: 12, color: GLOBAL.COLOR.DARKGRAY}}>
                                  {this.state.business_email}
                              </Text>
                              <Text style={{marginTop: 12, color: GLOBAL.COLOR.DARKGRAY}}>
                                  {this.state.business_phone}
                              </Text>
                              <Text style={{marginTop: 12, color: GLOBAL.COLOR.DARKGRAY}}>
                                  {this.state.business_website}
                              </Text>
                              <Text style={{marginTop: 12, color: GLOBAL.COLOR.DARKGRAY}}>
                                  {this.state.business_address}
                              </Text>
                          </View>
                      </View>
                  :null
              }


              <ActionButton buttonColor="rgba(00,121,00,0.8)" onPress={() => this.props.navigation.navigate('Business')} position="right" offsetX={10} offsetY={20} >

              </ActionButton>

          </View>
      );
  }
}

const styles = StyleSheet.create({

  basicContainer: {
      flex: 1,
  },

  container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#a91117',
  },
  congView: {
      flex: 1,
      height: hp('20%'),
      width: wp('70%'),
      borderRadius: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      position: 'absolute',
      top: 180,
      left: wp('15%'),
      marginTop: 16,
      alignItems: 'center'

  },
  settingView: {

      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      position: 'absolute',
      top: 121,
      left: 0,
      backgroundColor: 'rgba(190, 23, 20, 0.9)',
      height: 60,
      width: wp('100%'),
      paddingLeft: 10,
  },
  userView: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      position: 'absolute',
      top: 0,
      left: 0,
      backgroundColor: 'rgba(190, 23, 20, 0.9)',
      height: 120,
      width: wp('100%'),
      paddingTop: 20,
      paddingLeft: 20,

  },
  userImageView: {
      height: 60,
      width: 60,
      resizeMode: 'cover',
      borderRadius: 30,
      borderColor: 'white',
      borderWidth: 2,
      marginTop: 8,
  },
  infoContainer: {
      flexDirection: 'column',
      marginLeft: 16,
  },
  textInfo: {
      flexDirection: 'row',
      justifyContent: 'flex-start',


  },
  hiddenContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 40,
      height: 120,
      justifyContent: 'center',

  },
  locationImage: {
      marginTop: 10,
      width: 50,
      height: 50,
      borderRadius: 25,
      borderColor: GLOBAL.COLOR.WHITE,
      borderWidth: 1,
      resizeMode: 'cover',

  },


  backgroundImage: {

      flex: 1,
      resizeMode: 'contain',
      height: 101.14,
      width: 70,
      alignItems: 'center',

  },

  button: {

      height: 20,
      width: 20,
  },

  imageContainer: {

      alignItems: 'center',
      height: hp('10%'),
      width: wp('100%'),
      marginBottom: 20,
  },

  activityIndicator: {
      marginBottom: 30,
  },
  businessView: {
      position: 'absolute',
      top: 50,
      left: wp('8%'),
      width: wp('84%'),
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  businessUserView: {
      flexDirection: 'row',
      justifyContent: 'center',
      height: 100,
      marginLeft: 8, 
      marginRight: 8,
  },

  businessImageView: {
      height: 80,
      width: 80,
      resizeMode: 'cover',
      borderRadius: 40,
      borderColor: 'red',
      borderWidth: 2,
      
      marginLeft: 12, 
  },

});