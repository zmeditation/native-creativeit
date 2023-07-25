import React, { Component } from 'react';
import { Platform, ImageBackground } from 'react-native';

import Toast, {DURATION} from 'react-native-easy-toast';
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
    Vibration,

} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import {
    StackNavigator,
    StackActions,
    NavigationActions
} from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Menu from './menu/Menu';
import DrawerLayout from 'react-native-drawer-layout';
const GLOBAL = require('../Global');

export default class Nearby extends Component {

    static navigationOptions = {
        header: null
    }

    state = {
        showSpinner: true,
        latitude: 0.0,
        longitude: 0.0,
        user_photo: '',
        user_id: '',
        markers: [],
        drawerClosed: true,
        showUserView: false,
        member_photo: '',
        member_name:'',
        member_phone: '',
        member_address: '',
        member_email: '',
        member_age: '',
        member_gender: '',
        member_profession: '',
        member_facebook: '',
        member_id: '',
        friends: [],
        friendText: '',
        notification:false,
    }



    constructor(props) {
        super(props);


        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.setDrawerState = this.setDrawerState.bind(this);

        console.log("NearBy");
        this.state.showSpinner = true;
        AsyncStorage.getItem('latitude').then((value) => {

            if (value != null && value != '') {
                this.setState({ latitude: parseFloat(value) });
            }
        });

        AsyncStorage.getItem('longitude').then((value) => {

            if (value != null && value != '') {

                this.setState({ longitude: parseFloat(value) });

            }
        });
        AsyncStorage.getItem('user_photo').then((value) => {

            if (value != null && value != '') {

                this.setState({ user_photo: value });
            }
        });
        AsyncStorage.getItem('user_id').then((value) => {

            if (value != null && value != '') {

                this.setState({ user_id: value });
                this.fetchLocationData();
                this.getFriends();
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
    fetchLocationData() {


        let params = "user_id=" + this.state.user_id;
        params += "&user_photo=" + this.state.user_photo;
        params += "&latitude=" + this.state.latitude;
        params += "&longitude=" + this.state.longitude;

        return fetch(GLOBAL.BASE_URL + 'get_nearby_locations', {
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
                this.setState({
                    showSpinner: false,
                    markers: response.data,
                });

            })
            .catch((error) => {
                console.error(error);
            });
    }
    componentDidMount() {
       
    }

    getFriends(){
        let params = "user_id=" + this.state.user_id;
        return fetch(GLOBAL.BASE_URL + 'get_all_friends', {
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
                this.setState({
                 
                    friends: response.data,
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    closeDialog(){
        this.setState({showUserView: false});
    }

    getRequestFriend(){

        if(this.state.friendText == ''){

            let params = "user_id=" + this.state.user_id;
            params += "&friend_id=" + this.state.member_id;
            params += "&time=" + new Date().toLocaleString();
            console.log(params);
            return fetch(GLOBAL.BASE_URL + 'add_friend', {
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
                            alert('Successfully requested');
                        }else{
                            alert('Friend Request Failed');
                        }
                  
    
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    setMemberData(userData){
        var friendText = ''
        this.state.friends.map(function (item){

            if(item.friend_id == userData.user_id){
               friendText = item.status
            }
        });

        this.setState({friendText: friendText});

        this.setState({showUserView: true});
        this.setState({member_name: userData.user_name});
        this.setState({member_email: userData.user_email});
        this.setState({member_phone: userData.user_phone});
        this.setState({member_photo: userData.user_photo});
        this.setState({member_address: userData.user_address});
        this.setState({member_age: userData.user_age});
        this.setState({member_gender: userData.user_gender});
        this.setState({member_profession: userData.user_professional});
        this.setState({member_facebook: userData.facebook_url});
        this.setState({member_id: userData.user_id});
        
    }

    _sendMessage(){
        console.log('send_msg');
        AsyncStorage.setItem('member_id', this.state.member_id);
        this.props.navigation.navigate('Smessage');
    }

    goToFacebook(){
        AsyncStorage.setItem('facebookURL', this.state.member_facebook);
        this.props.navigation.navigate('Fbweb');
    }
    render() {
        const { state, navigate } = this.props.navigation;
        return (
            <View style={styles.basicContainer}>
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
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            latitudeDelta: 0.0522,
                            longitudeDelta: 0.0221
                        }}  >

                        {this.state.showSpinner ? null : this.state.markers.map((marker, index) => {
                            console.log(marker);
                            const coords = {
                                latitude: parseFloat(marker.latitude),
                                longitude: parseFloat(marker.longitude),
                            };
                            var avatar = marker.user_photo;
                            if (marker.user_photo == null || marker.user_photo == '') {
                                avatar = "https://www.flaticon.com/free-icon/avatar_147144";
                            }

                            return (
                                <Marker key={index} coordinate={coords} onPress={() => this.setMemberData(marker)}>
                                    <View>
                                        <ImageBackground source={require('../resources/images/user_marker.png')} style={styles.backgroundImage}>
                                            <Image source={{ uri: avatar }} style={styles.locationImage} />
                                        </ImageBackground>
                                    </View>
                                </Marker>);
                        })}
                    </MapView>
                    {
                        this.state.showUserView ? 
                        <View style={styles.friendView}>
                            <TouchableOpacity onPress={() => this.goToFacebook()}>
                                <Image source={{ uri: this.state.member_photo }} style={styles.userImageView} />
                            </TouchableOpacity>
                            
                            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 6, marginTop: 4, }}>
                                        {this.state.member_name}
                            </Text>
                         
                            <View style={styles.userView}>
                                <View style={styles.textInfo}>
                                        <Text style={{ fontSize: 16 }}>Email: </Text>
                                        <Text style={{ fontSize: 16,  marginLeft: 4, }}>{this.state.member_email}</Text>
                                </View>
                                <View style={styles.textInfo}>
                                        <Text style={{ fontSize: 16 }}>Phone: </Text>
                                        <Text style={{ fontSize: 16,  marginLeft: 4 }}>{this.state.member_phone}</Text>
                                </View>
                        

                                <View style={styles.textInfo}>
                                    <Text style={{ fontSize: 16 }}>Address: </Text>
                                    <Text numberOfLines={2} style={{ width: 200, fontSize: 16,  marginLeft: 4, paddingRight: 8, }}>{this.state.member_address}</Text>
                                </View>
            
                                <View style={styles.textInfo}>
                                    <Text style={{ fontSize: 16 }}>Gender: </Text>
                                    <Text style={{ fontSize: 16,  marginLeft: 4 }}>{this.state.member_gender}</Text>
                                </View>
                                <View style={styles.textInfo}>
                                    <Text style={{ fontSize: 16 }}>Profession: </Text>
                                    <Text style={{ fontSize: 16,  marginLeft: 4 }}>{this.state.member_profession}</Text>
                                </View>
                                <View style={styles.textInfo}>
                                    <Text style={{ fontSize: 16 }}>Age: </Text>
                                    <Text style={{ fontSize: 16,  marginLeft: 4 }}>{this.state.member_age}</Text>
                                </View>
                            </View>
                      

                        <View style={{backgroundColor: GLOBAL.COLOR.DARKGRAY, height: 1, marginLeft: 12, marginRight: 12}}/>

                        <TouchableOpacity onPress={() => this.getRequestFriend()} style={{  justifyContent: 'center', alignItems:'center', marginTop: 12, marginLeft: 14, marginRight: 14, marginBottom: 12, height:40, width: wp('70%'),backgroundColor: GLOBAL.COLOR.GREEN, borderRadius: 20,  }}>
                            <Text style={{fontSize: 18, fontWeight:'bold', color: 'white'}}>Send a friend request</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this._sendMessage()} style={{  justifyContent: 'center', alignItems:'center', marginTop: 6, marginLeft: 14, marginRight: 14, marginBottom: 12, height:40, width: wp('70%'),backgroundColor: GLOBAL.COLOR.GREEN, borderRadius: 20,  }}>
                            <Text style={{fontSize: 18, fontWeight:'bold', color: 'white'}}>Send a message</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.closeDialog()} style={{ position: 'absolute', right: 16, top: 16 }}>
                                <MaterialIcons name='close' size={16} color={GLOBAL.COLOR.DARKGRAY} />
                        </TouchableOpacity>
                        {
                            this.state.friendText == '' ? 
                            null
                            :
                            this.state.friendText == 'pending' ? 
                            <Text style={{position: 'absolute', top: 8, left: 16, color: 'white', backgroundColor: 'red', height: 18, borderRadius:9, width: 80, textAlign: 'center',overflow: 'hidden', }}>
                                {this.state.friendText}
                            </Text>
                            :            
                            <Text style={{position: 'absolute', top: 8, left: 16, color: 'white', backgroundColor: 'green', height: 18, borderRadius: 9 , width: 80, textAlign: 'center',overflow: 'hidden',}}>
                                Friend
                            </Text>
                        }

                </View>
                        : null
                    }
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

    basicContainer: {
        flex: 1,
        backgroundColor: GLOBAL.COLOR.RED,
    },

    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#a91117',
    },
    backgroundImage: {

        flex: 1,
        resizeMode: 'contain',
        height: 101.14,
        width: 70,
        alignItems: 'center',

    },

    button: {

        height: hp('10%'),
        width: wp('80%'),
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
    locationImage: {
        marginTop: 15,
        width: 50,
        height: 50,
        borderRadius: 25,
        borderColor: GLOBAL.COLOR.WHITE,
        borderWidth: 1,
        resizeMode: 'cover',

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
    friendView: {
        position: 'absolute',
        top: 140,
        left: wp('8%'),
        width: wp('84%'),
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center'
    },
    userView: {
        height: 140,
        marginLeft: 8, 
        marginRight: 8,

        
    },
    userImageView: {
        height: 80,
        width: 80,
        resizeMode: 'cover',
        borderRadius: 40,
        borderColor: 'red',
        borderWidth: 2,
        marginTop: -40,
    },
    infoContainer: {
    
        marginTop: 4,
        marginLeft: 8,

    },
    textInfo: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 4,


    },

});