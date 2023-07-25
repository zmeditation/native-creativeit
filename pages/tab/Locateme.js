import React, { Component } from 'react';
import { Platform, ImageBackground } from 'react-native';
import CheckBox from 'react-native-check-box';
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
    FlatList
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Overlay } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import {
    StackNavigator,
    StackActions,
    NavigationActions
} from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import ActionButton from 'react-native-action-button';

const GLOBAL = require('../../Global');

export default class Locateme extends Component {

    static navigationOptions = {
        header: null
    }

    state = {
        showSpinner: false,
        latitude: 0.0,
        longitude: 0.0,
        latitudeDelta: 0.0522,
        longitudeDelta: 0.0221,
        user_photo: '',
        user_id: '',
        user_name: '',
        user_phone: '',
        user_address: '',
        markers: [],
        regions: [],
        region: {
            latitude: 0.0,
            longitude: 0.0,
            latitudeDelta: 0.0522,
            longitude: 0.0522,
        },

        members: '0',
        friendNum: '0',
        friends: [],
        showRegions: true,
        showPins: true,
        showNearBy: false,
        memberData: [],
        isChecked: false,

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
        request_friends: [],
        friendText: '',

        availableMembers: [],
    }



    constructor(props) {
        super(props);

        console.log("LocateMe");

        let self = this;
        AsyncStorage.getItem('latitude').then((value) => {

            if (value != null && value != '') {
                self.setState({ latitude: parseFloat(value) });
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
                console.log(value);
                this.setState({ user_id: value });
                this.fetchRegionData();
                this.fetchLocationData();

            }
        });
        AsyncStorage.getItem('user_name').then((value) => {
            console.log(value);
            if(value != null && value != ''){
                console.log(value);
                this.setState({user_name: value});
            }
        });
        AsyncStorage.getItem('user_phone').then((value) => {
            console.log(value);
            if(value != null && value != ''){
                console.log(value);
                this.setState({user_phone: value});
            }
        });
        AsyncStorage.getItem('user_address').then((value) => {
            console.log(value);
            if(value != null && value != ''){
                console.log(value);
                this.setState({user_address: value});
            }
        });

    }

    fetchRegionData() {
        let params = "user_id=" + this.state.user_id;
        params += "&latitude=" + this.state.latitude;
        params += "&longitude=" + this.state.longitude;

        return fetch(GLOBAL.BASE_URL + 'get_regions', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,

        })
            .then((responseJson) => responseJson.json())
            .then((response) => {

                this.setState({
                    regions: response.data,
                    friendNum:  response.friend_num,
                });

            })
            .catch((error) => {
                console.error(error);
            });

    }
    fetchLocationData() {
        let params = "user_id=" + this.state.user_id;
        params += "&user_photo=" + this.state.user_photo;
        params += "&latitude=" + this.state.latitude;
        params += "&longitude=" + this.state.longitude;

        return fetch(GLOBAL.BASE_URL + 'get_all_locations', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,

        })
            .then((responseJson) => responseJson.json())
            .then((response) => {

                this.setState({

                    markers: response.data,
                });

            })
            .catch((error) => {
                console.error(error);
            });
    }

    fetchRegionMembers(user_id) {
        let params = "region_info=" + user_id;
        return fetch(GLOBAL.BASE_URL + 'get_region_users', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,

        })
            .then((responseJson) => responseJson.json())
            .then((response) => {

                this.setState({
                    showSpinner: false,
                    memberData: response.data,
                });

            })
            .catch((error) => {
                console.error(error);
            });
    }
    _pressRegion(radius, user_id) {
        this.forceUpdate();
        this.setState({ showRegions: false })
        let members = radius.toString();
        this.setState({ members: members });
        let friends = this.state.friendNum + ' Friends live here';
        this.setState({ friendNum: friends });
        this.fetchRegionMembers(user_id);
    }

    componentDidMount() {

    }
    onRegionChange(region) {
        // console.log(region);

        console.log(region.latitudeDelta);
        if (region.latitudeDelta < 0.02 || region.longitudeDelta < 0.02) {

            if (!this.state.showNearBy) {
                this.setState({ showRegions: true, showNearBy: true });
                this.setState({ latitude: region.latitude });
                this.setState({ longitude: region.longitude });
                this.setState({ latitudeDelta: region.latitudeDelta });
                this.setState({ longitudeDelta: region.longitudeDelta });
                // this.fetchLocationData();
                // this.forceUpdate();
            }


        }
        else {
            if (this.state.showNearBy) {
                this.setState({ showNearBy: false })

                this.setState({ latitude: region.latitude });
                this.setState({ longitude: region.longitude });
                this.setState({ latitudeDelta: region.latitudeDelta });
                this.setState({ longitudeDelta: region.longitudeDelta });
                // this.forceUpdate();

            }
        }
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

    batchFriendRequest(){
        var ids = this.state.request_friends;
        var temp = '';
        ids.map((item) => {
            temp += item + ','
        });

        let params = "user_id=" + this.state.user_id;
        params += "&friend_ids=" + temp;
        params += "&time=" + new Date().toLocaleString();
        console.log(params);
        return fetch(GLOBAL.BASE_URL + 'add_friends', {
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
                        this._getAvailbleMembers();
                        alert('Successfully requested');

                    }else{
                        alert('Friend Request Failed');
                    }
              

            })
            .catch((error) => {
                console.error(error);
            });


    }
    makeFriendList(userId){
        var friends = this.state.request_friends;
        var idx = friends.indexOf(userId);
        if (idx >= 0) {
            friends.splice(idx, 1);
        }else{
            friends.push(userId);
        }
        
        this.setState({request_friends: friends});

    }

  
    closeDialog() {
        this.setState({ showRegions: true });
        this.setState({ showPins: true });
        this.setState({ showUserView: false });
    }
    setMemberData(userData){

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
        this.props.navigation.navigate('Smsg');
    }

    goToFacebook(){
        AsyncStorage.setItem('facebookURL', this.state.member_facebook);
        this.props.navigation.navigate('Fbweb');
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
    _getAvailbleMembers(){
        this.setState({showPins: false});
        let params = "user_id=" + this.state.user_id;


        return fetch(GLOBAL.BASE_URL + 'get_available_members', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,

        })
            .then((responseJson) => responseJson.json())
            .then((response) => {

                this.setState({

                    availableMembers: response.data,
                });

            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        const { state, navigate } = this.props.navigation;
        return (
            <View style={styles.basicContainer}>
                <MapView
                    style={{ flex: 1 }}
                    provider={PROVIDER_GOOGLE}
                    onRegionChange={(region) => this.onRegionChange(region)}
                    region={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: this.state.latitudeDelta,
                        longitudeDelta: this.state.longitudeDelta
                    }}  >

                    {
                        this.state.showNearBy ?
                            this.state.markers.map((marker, index) => {

                                const coords = {
                                    latitude: parseFloat(marker.latitude),
                                    longitude: parseFloat(marker.longitude),
                                };

                                var avatar = marker.user_photo;
                                if (marker.user_photo == null || marker.user_photo == '') {
                                    avatar = "https://www.flaticon.com/free-icon/avatar_147144";
                                }

                                const description = 'Phone: ' + marker.user_phone;
                                return (
                                    <Marker key={index} coordinate={coords}
                                        
                                        onPress={() => this.setMemberData(marker)} 
                                        >
                                        <View>
                                            <ImageBackground source={require('../../resources/images/user_marker.png')} style={styles.backgroundImage1}>
                                                <Image source={{ uri: avatar }} style={styles.locationImage1} />
                                            </ImageBackground>
                                        </View>
                                    </Marker>
                                );
                            })


                            : this.state.regions.map((marker, index) => {

                                const coords = {
                                    latitude: parseFloat(marker.latitude),
                                    longitude: parseFloat(marker.longitude),
                                };

                                return (
                                    <Marker key={index} coordinate={coords} onPress={() => this._pressRegion(marker.radius, marker.user_id)}>
                                        <View>
                                            <ImageBackground source={require('../../resources/images/gradient_wave.png')} style={styles.backgroundImage} >
                                            </ImageBackground>
                                        </View>
                                    </Marker>
                                    // <Marker key={index} coordinate={coords} title={marker.user_name}
                                    //     description={description}>
                                    //     <View>
                                    //         <ImageBackground source={require('../../resources/images/user_marker.png')} style={styles.backgroundImage}>
                                    //             <Image source={{uri: avatar}} style={styles.locationImage}/>
                                    //         </ImageBackground>                            
                                    //     </View>
                                    // </Marker>
                                );
                            })}
                </MapView>
                {
                    this.state.showRegions ? null :
                        <View style={styles.memberContainer}>
                            <TouchableOpacity onPress={() => this.closeDialog()} style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 4, paddingTop: 4 }}>
                                <MaterialIcons name='close' size={16} color={GLOBAL.COLOR.DARKGRAY} />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 12, paddingRight: 12, paddingBottom: 12, paddingTop: 0 }}>
                                <View style={{ alignItems: 'center', paddingRight: 8 }}>
                                    <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'red', textAlign: 'center' }}>
                                        {this.state.members}
                                    </Text>
                                    <Text style={{ fontSize: 10, textAlign: 'center', color: GLOBAL.COLOR.DARKGRAY }}>
                                        {this.state.friendNum}
                                    </Text>
                                </View>
                                <Text style={{ fontSize: 20, width: 160, paddingTop: 2, }} numberOfLines={2}>
                                    Lebanese Live in this area
                         </Text>
                            </View>
                            <View style={{ height: 1, backgroundColor: GLOBAL.COLOR.DARKGRAY, marginLeft: 8, marginRight: 8, }} />
                            <FlatList
                                style={{ height: 50, paddingTop: 4, marginLeft: 8, marginRight: 8, marginTop: 8, marginBottom: 4, }}
                                horizontal
                                data={this.state.memberData}
                                renderItem={({ item: rowData }) => {
                                    return (
                                        <View style={{ width: 44, height: 44, backgroundColor: 'rgb(255, 255, 255, 0)', justifyContent: 'center', alignItems: 'center', padding: 2, }}>
                                            <Image source={{ uri: rowData.user_photo }} style={{ borderRadius: 20, resizeMode: 'cover', width: 40, height: 40 }} />
                                            <View style={{ position: 'absolute', right: 6, bottom: 6, width: 6, height: 6, backgroundColor: GLOBAL.COLOR.LIGHTGREEN, borderRadius: 3 }} />
                                        </View>
                                    );
                                }}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                }
                {
                    this.state.showNearBy ?
                    this.state.showPins ? null :
                        <View style={styles.friendView}>
                            <TouchableOpacity onPress={() => this.closeDialog()} style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 4, paddingTop: 4 }}>
                                <MaterialIcons name='close' size={16} color={GLOBAL.COLOR.DARKGRAY} />
                            </TouchableOpacity>
                            <View style={styles.userView}>
                                <Image source={{ uri: this.state.user_photo }} style={styles.userImageView} />
                                <View style={styles.infoContainer}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 6 }}>
                                        {this.state.user_name}
                                    </Text>
                                    <View style={styles.textInfo}>
                                        <Image source={require('../../resources/images/phone_red_ic.png')} style={{ width: 16, height: 16, resizeMode: 'stretch' }} />
                                        <Text style={{ fontSize: 16,  marginLeft: 4 }}>{this.state.user_phone}</Text>
                                    </View>
                                    <View style={styles.textInfo}>
                                        <Image source={require('../../resources/images/location_red_ic.png')} style={{ width: 16, height: 16, resizeMode: 'stretch' }} />
                                        <Text numberOfLines={2} style={{ width: 200, fontSize: 16,  marginLeft: 4, paddingRight: 8, }}>{this.state.user_address}</Text>
                                    </View>

                                </View>
                            </View>
                            <Text style={{textAlign: 'left', fontSize: 12, color: GLOBAL.COLOR.DARKGRAY, marginLeft: 12,}}>
                               {GLOBAL.INVITE}
                            </Text>
                            <View style={{backgroundColor: GLOBAL.COLOR.DARKGRAY, height: 1, marginLeft: 12, marginRight: 12}}/>
                            <FlatList
                                style={{ height: 50, paddingTop: 4, marginLeft: 12, marginRight: 12, marginTop: 8, marginBottom: 4, }}
                                horizontal
                                data={this.state.availableMembers}
                                renderItem={({ item: rowData }) => {
                                    return (
                                        <View style={{ width: 44, height: 44, backgroundColor: 'rgb(255, 255, 255, 0)', justifyContent: 'center', alignItems: 'center', padding: 2, }}>
                                            
                                            <CheckBox
                                                style={{flex: 1, width:40, height: 40, borderRadius: 20,}}
                                                onClick={()=>{
                                                   this.makeFriendList(rowData.user_id)
                                                }}
                                                isChecked={this.state.request_friends.indexOf(rowData.user_id) >= 0}
                                                checkedImage={<Image source={require('../../resources/images/check_ic.png')} style={{width:40, height: 40, borderRadius: 20, resizeMode: 'stretch'}}/>}
                                                unCheckedImage={<Image source={{uri: rowData.user_photo}} style={{width:40, height: 40, borderRadius: 20, resizeMode: 'cover'}}/>}
                                            />
                                        </View>
                                    );
                                }}
                                keyExtractor={(item, index) => index.toString()}
                            />
                            <TouchableOpacity onPress={() => this.batchFriendRequest()} style={{  justifyContent: 'center', alignItems:'center', marginTop: 12, marginLeft: 14, marginRight: 14, marginBottom: 12, height:50,backgroundColor: GLOBAL.COLOR.GREEN, borderRadius: 25,  }}>
                                <Text style={{fontSize: 20, fontWeight:'bold', color: 'white'}}>Friend Request</Text>
                            </TouchableOpacity>
                        </View>
                        :null
                }{
                    this.state.showNearBy ? 
                        <ActionButton buttonColor="rgba(00,121,00,0.8)" position="right" offsetX={10} offsetY={20} >
                        <ActionButton.Item
                            buttonColor="#007900"
                            title="Friends"
                            onPress={() => console.log('notes tapped!')}>
                            <Feather name="user-check" size={14} color={GLOBAL.COLOR.WHITE} />
                        </ActionButton.Item>
                        <ActionButton.Item
                            buttonColor="#007900"
                            title="Members"
                            onPress={() => this._getAvailbleMembers()}>
                            <Feather name="users" size={14} color={GLOBAL.COLOR.WHITE} />
                        </ActionButton.Item>
                    </ActionButton>
                : null
                }

                  {
                        this.state.showUserView ? 
                        <View style={styles.member_friendView}>
                            <TouchableOpacity onPress={() => this.goToFacebook()}>
                                <Image source={{ uri: this.state.member_photo }} style={styles.member_userImageView} />
                            </TouchableOpacity>
                            
                            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 6, marginTop: 4, }}>
                                        {this.state.member_name}
                            </Text>
                         
                            <View style={styles.member_userView}>
                                <View style={styles.member_textInfo}>
                                        <Text style={{ fontSize: 16 }}>Email: </Text>
                                        <Text style={{ fontSize: 16,  marginLeft: 4, }}>{this.state.member_email}</Text>
                                </View>
                                <View style={styles.member_textInfo}>
                                        <Text style={{ fontSize: 16 }}>Phone: </Text>
                                        <Text style={{ fontSize: 16,  marginLeft: 4 }}>{this.state.member_phone}</Text>
                                </View>
                        

                                <View style={styles.member_textInfo}>
                                    <Text style={{ fontSize: 16 }}>Address: </Text>
                                    <Text numberOfLines={2} style={{ width: 200, fontSize: 16,  marginLeft: 4, paddingRight: 8, }}>{this.state.member_address}</Text>
                                </View>
            
                                <View style={styles.member_textInfo}>
                                    <Text style={{ fontSize: 16 }}>Gender: </Text>
                                    <Text style={{ fontSize: 16,  marginLeft: 4 }}>{this.state.member_gender}</Text>
                                </View>
                                <View style={styles.member_textInfo}>
                                    <Text style={{ fontSize: 16 }}>Profession: </Text>
                                    <Text style={{ fontSize: 16,  marginLeft: 4 }}>{this.state.member_profession}</Text>
                                </View>
                                <View style={styles.member_textInfo}>
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

            </View>
        );
    }
}

const styles = StyleSheet.create({

    basicContainer: {
        flex: 1,
    },
    memberContainer: {
        position: 'absolute',
        top: 20,
        left: wp('8%'),
        width: wp('84%'),
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        // height: hp('25%'),

    },

    backgroundImage: {
        flex: 1,
        resizeMode: 'contain',
        height: 70,
        width: 70,
        alignItems: 'center',

    },

    friendView: {
        position: 'absolute',
        top: 20,
        left: wp('8%'),
        width: wp('84%'),
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    userView: {
        flexDirection: 'row',
        justifyContent: 'center',
        height: 120,
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
        marginTop: 15,
        marginLeft: 12, 
    },
    infoContainer: {
    
        marginTop: 12,
        marginLeft: 8,

    },
    textInfo: {
        flexDirection: 'row',
        justifyContent: 'flex-start',


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
        borderColor: 'rgba(190, 23, 20, 0)',
        borderWidth: 1,
        resizeMode: 'cover',

    },

    locationImage1: {
        marginTop: 15,
        width: 50,
        height: 50,
        borderRadius: 25,
        borderColor: GLOBAL.COLOR.WHITE,
        borderWidth: 1,
        resizeMode: 'cover',

    },

    backgroundImage1: {

        flex: 1,
        resizeMode: 'contain',
        height: 101.14,
        width: 70,
        alignItems: 'center',

    },

    member_friendView: {
        position: 'absolute',
        top: 60,
        left: wp('8%'),
        width: wp('84%'),
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center'
    },
    member_userView: {
        height: 140,
        marginLeft: 8, 
        marginRight: 8,

        
    },
    member_userImageView: {
        height: 80,
        width: 80,
        resizeMode: 'cover',
        borderRadius: 40,
        borderColor: 'red',
        borderWidth: 2,
        marginTop: -40,
    },
    member_infoContainer: {
    
        marginTop: 4,
        marginLeft: 8,

    },
    member_textInfo: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 4,


    },


});