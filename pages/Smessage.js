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
    Picker,
    Button,
    NativeModules,
} from 'react-native';

import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import DrawerLayout from 'react-native-drawer-layout';
import Menu from './menu/Menu';

import {
    StackNavigator,
    StackActions,
    NavigationActions
} from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SwipeListView } from 'react-native-swipe-list-view';
import ActionButton from 'react-native-action-button';
import { Dropdown } from 'react-native-material-dropdown';
import { KeyboardAccessoryNavigation } from 'react-native-keyboard-accessory';

const GLOBAL = require('../Global');
const { StatusBarManager } = NativeModules;
export default class Smessage extends Component {
    static navigationOptions = {
        headermode: 'screen',
        header: null
    }

    state = {
        user_id: '',
        drawerClosed: true,
        userData: [],
        title: '',
        message: '',
        member_id: '',

        activeInputIndex: 0,
        nextFocusDisabled: false,
        previousFocusDisabled: false,
        buttonsDisabled: false,
        buttonsHidden: false,
        notification:false,
    }
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


        AsyncStorage.getItem('user_id').then((value) => {

            if (value != null && value != '') {
                console.log(value);
                this.setState({ user_id: value });


            }
        });
        AsyncStorage.getItem('member_id').then((value) => {

            if (value != null && value != '') {
                console.log(value);
                this.setState({ member_id: value });


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

    sendMessage() {

        if (this.state.title == null || this.state.title == ''){
            alert('Input Title Please');
        }
        else{
            if(this.state.message == null || this.state.message == ''){
                alert('Input Message Please');
            }else{
                let params = "from=" + this.state.user_id;
                params += "&title=" + this.state.title;
                params += "&message=" + this.state.message;
                params += "&to=" + this.state.member_id;
                params += "&time=" + new Date().toLocaleString();
                console.log(params);
                return fetch(GLOBAL.BASE_URL + 'reply_message', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: params,
        
                })
                    .then((responseJson) => responseJson.json())
                    .then((response) => {
        
                        if (response.success) {
                            alert("successfully sent");
                        } else {
                            alert("Message send failed");
                        }
        
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
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
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() =>  this.props.navigation.goBack()} style={{ justifyContent: 'center', height: 60, paddingLeft: 4, }}>
                            <MaterialIcons name='keyboard-backspace' size={30} color={GLOBAL.COLOR.WHITE} />
                        </TouchableOpacity>
                        <Text style={{color: 'white', fontSize: 22, alignItems: 'center', marginLeft: 8,}}>
                            Message 
                        </Text>
                    </View>

                    <TextInput
                        underlineColorAndroid='transparent'
                        style={styles.textinput}
                        onChangeText={(title) => this.setState({ title })}
                        value={this.state.title}
                        placeholder="Title"
                        clearButtonMode="while-editing"
                    />

                    <TextInput
                        underlineColorAndroid='transparent'
                        style={styles.textMessageInput}
                        onChangeText={(message) => this.setState({ message })}
                        value={this.state.message}
                        placeholder="Message"
                        clearButtonMode="while-editing"
                        multiline={true}
                    />

                    <TouchableOpacity style={{ backgroundColor: GLOBAL.COLOR.GREEN, justifyContent: 'center', alignItems: 'center', height: 40, margin: 20, }} onPress={() => this.sendMessage()}>
                        <Text style={{ textAlign: 'center', fontSize: 16, color: GLOBAL.COLOR.WHITE, }}>
                            SEND
                        </Text>
                    </TouchableOpacity>
                </DrawerLayout>
                <KeyboardAccessoryNavigation
                nextDisabled={this.state.nextFocusDisabled}
                previousDisabled={this.state.previousFocusDisabled}
                nextHidden={true}
                previousHidden={true}

                avoidKeyboard
                />
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
    textinput: {
        backgroundColor: 'white',
        borderColor: '#dddddd',
        borderWidth: 1,
        fontSize: 15,
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 8,
        height: 40,
        marginLeft: 16,
        marginRight: 16,
    },
    textMessageInput: {
        backgroundColor: 'white',
        borderColor: '#dddddd',
        borderWidth: 1,
        fontSize: 15,
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 8,
        height: 240,
        marginLeft: 16,
        marginRight: 16,
    },
})
