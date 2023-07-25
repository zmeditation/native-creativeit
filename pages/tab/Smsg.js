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

import {
    StackNavigator,
    StackActions,
    NavigationActions
} from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionButton from 'react-native-action-button';
import { Dropdown } from 'react-native-material-dropdown';
import { KeyboardAccessoryNavigation } from 'react-native-keyboard-accessory';
const GLOBAL = require('../../Global');
const { StatusBarManager } = NativeModules;
export default class Smsg extends Component {
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

    }
    constructor(props) {
        super(props);



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
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() =>  this.props.navigation.goBack()} style={{ justifyContent: 'center', height: 60, paddingLeft: 4, }}>
                            <MaterialIcons name='keyboard-backspace' size={30} color={GLOBAL.COLOR.WHITE} />
                        </TouchableOpacity>
                        <Text style={{color: 'white', fontSize: 22, alignItems: 'center', marginLeft: 8,}}>
                            Message 
                        </Text>
                    </View>
                    <View>
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
                    </View>
                    <KeyboardAccessoryNavigation
                    nextDisabled={this.state.nextFocusDisabled}
                    previousDisabled={this.state.previousFocusDisabled}
                    nextHidden={true}
                    previousHidden={true}
                    avoidKeyboard
                    />

                    <TouchableOpacity style={{ backgroundColor: GLOBAL.COLOR.GREEN, justifyContent: 'center', alignItems: 'center', height: 40, margin: 20, }} onPress={() => this.sendMessage()}>
                        <Text style={{ textAlign: 'center', fontSize: 16, color: GLOBAL.COLOR.WHITE, }}>
                            SEND
                        </Text>
                    </TouchableOpacity>
             
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
