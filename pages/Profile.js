import React, { Component } from 'react';
import {Platform, ImageBackground } from 'react-native';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
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
    KeyboardAvoidingView } from 'react-native';

import {
    StackNavigator,
    StackActions, 
    NavigationActions
} from 'react-navigation';


const GLOBAL = require('../Global');

export default class Profile extends Component {

    static navigationOptions = {
        header: null
    }

    state = {
        showSpinner: true,
        avatarURL: 'https://www.flaticon.com/free-icon/avatar_147144',
        user_name: '',
        user_email: '',
        user_phone: '',
        user_gender: '',
        user_address: '',
        user_profession: '',
        user_age: '',
        user_state: '',
        user_id: '',
        user_lat: '',
        user_long: '',
      }
    
    resetNavigation(targetRoute) {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
            NavigationActions.navigate({ routeName: targetRoute }),
            ],
        });
        this.props.navigation.dispatch(resetAction);
    }

    constructor(props) {
        super(props);

        console.log("ProfileConstructor");
        this.state.showSpinner = false;
        AsyncStorage.getItem('user_photo').then((value) => {
            console.log(value);
            this.setState({avatarURL: value});
        });
        AsyncStorage.getItem('user_name').then((value) => {
            console.log(value);
            this.setState({user_name: value});
        });

        AsyncStorage.getItem('user_email').then((value) => {
            console.log(value);
            this.setState({user_email: value});
        });
        AsyncStorage.getItem('user_id').then((value) => {
            console.log(value);
            this.setState({user_id: value});
        });
        AsyncStorage.getItem('user_phone').then((value) => {
           
            if(value != null && value != '')
            {
            this.setState({user_phone: value});

            }
        });
        AsyncStorage.getItem('user_gender').then((value) => {
            if(value != null && value != '')
            {
            this.setState({user_gender: value});

            }
        });

        AsyncStorage.getItem('user_address').then((value) => {
            if(value != null && value != '')
            {
            this.setState({user_address: value});
            }
        });
        AsyncStorage.getItem('user_profession').then((value) => {
            if(value != null && value != '')
            {
            this.setState({user_profession: value});

            }
        });
        AsyncStorage.getItem('user_age').then((value) => {
            if(value != null && value != '')
            {
            this.setState({user_age: value});

            }
        });
        AsyncStorage.getItem('user_state').then((value) => {
            if(value != null && value != '')
            {
            this.setState({user_state: value});

            }
        });

        AsyncStorage.getItem('user_lat').then((value) => {
            if(value != null && value != '')
            {
            this.setState({user_lat: value});

            }
        });
        AsyncStorage.getItem('user_long').then((value) => {
            if(value != null && value != '')
            {
            this.setState({user_long: value});

            }
        });
        
    }

    componentDidMount() {
  
    }

    _onRegister(){
        if(this.state.user_phone == ""){
            alert("Please enter your phone number.");
        }else if(this.state.user_gender == ""){
            alert("Please enter your gender.");
        }else if(this.state.user_state == ""){
            alert("Please enter your martial status.");
        }else if(this.state.user_profession == ""){
            alert("Please enter your profession.");
        }else if(this.state.user_address == ""){
            alert("Please enter your address.");
        }else if(this.state.user_age == ""){
            alert("Please enter your age.");
        }else{
            var profileParams = "user_name=" + this.state.user_name;
        profileParams += "&user_email=" + this.state.user_email;
        profileParams += "&user_phone=" + this.state.user_phone;
        profileParams += "&user_gender=" + this.state.user_gender;
        profileParams += "&user_state=" + this.state.user_state;
        profileParams += "&user_professional=" + this.state.user_profession;
        profileParams += "&user_address=" + this.state.user_address;
        profileParams += "&user_age=" + this.state.user_age;
        profileParams += "&api_token=" + GLOBAL.API_KEY;
        profileParams += "&user_status=" + 'active';
        profileParams += "&user_id=" + this.state.user_id;
        profileParams += "&user_lat=" + this.state.user_id;
        profileParams += "&user_long=" + this.state.user_id;
        return fetch(GLOBAL.BASE_URL + 'update_user', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: profileParams,

        })
        .then((responseJson) => responseJson.json())
        .then((response) => {
            console.log(response);
                if(response.success == 1){
                    AsyncStorage.setItem('user_id', response.data.id);
                    // AsyncStorage.setItem('user_name', response.data.user_name);
                    // AsyncStorage.setItem('user_email', response.data.user_email);
                    // AsyncStorage.setItem('user_photo', response.data.user_photo);
                    AsyncStorage.setItem('user_phone', response.data.user_phone);
                    AsyncStorage.setItem('user_address', response.data.user_address);
                    AsyncStorage.setItem('user_gender', response.data.user_gender);
                    AsyncStorage.setItem('user_state', response.data.user_state);
                    AsyncStorage.setItem('user_professional', response.data.user_professional);
                    AsyncStorage.setItem('user_status', response.data.user_status);
                    AsyncStorage.setItem('user_age', response.data.user_age);
                    AsyncStorage.setItem('user_latitude', response.data.user_age);
                    AsyncStorage.setItem('user_longitude', response.data.user_age);
                }
                try {
                    this.resetNavigation('Tab');                    
                } catch (error) {
                    
                }

            

        })
        .catch((error) =>{
            console.error(error);
        });
        }
        
    }

    getAddress(){
        
        if(this.state.user_phone != null){
            AsyncStorage.setItem('user_phone', this.state.user_phone);
        }
        if(this.state.user_gender != null){
            AsyncStorage.setItem('user_gender', this.state.user_gender);
        }
        if(this.state.user_state != null){
            AsyncStorage.setItem('user_state', this.state.user_state);
        }
        if(this.state.user_professional != null){
            AsyncStorage.setItem('user_professional', this.state.user_professional);
        }
        if(this.state.user_age != null){
            AsyncStorage.setItem('user_age', this.state.user_age);
        }
        if(this.state.user_address != null){
            AsyncStorage.setItem('user_address', this.state.user_address);
        }

        this.resetNavigation('Address');    
    }
  
    render() {
        const { state, navigate } = this.props.navigation;
        return (
            <View style={styles.basicContainer}>
                <View style={styles.topBar}>
                    <Image source={require('../resources/images/logo.png')} style={styles.topBarLogo}/>
                    <Text style = {{color: 'white', fontSize: 35}}>
                        {GLOBAL.APP_NAME}
                    </Text>
                </View>
                <KeyboardAvoidingView style={styles.container} behavior="padding">
                    <ScrollView style={{ backgroundColor: 'rgba(255, 255, 255, 0)',}}>
                        <View style = {styles.avatarContainer}>
                             <Image source={{uri: this.state.avatarURL}} style = {styles.avatar} />
                        </View>
                        <View style = {styles.formContainer}>
        
                        <Text style={{color: 'red', fontSize: 12, marginTop: 60, marginLeft: 10}}>Name</Text>
                        <TextInput
                            underlineColorAndroid='transparent'
                            style={styles.textinput}
                            onChangeText={(user_name) => this.setState({user_name:user_name})}
                            value={this.state.user_name}
                            placeholder="User Name"
                            clearButtonMode="while-editing"
                            editable = {false}
                        />
                    
                        <Text style={{color: 'red', fontSize: 12, marginTop:20, marginLeft: 10}}>Email</Text>                
                        <TextInput
                            underlineColorAndroid='transparent'
                            style={styles.textinput}
                            onChangeText={(user_email) => this.setState({user_email:user_email})}
                            value={this.state.user_email}
                            placeholder="E-mail"
                            clearButtonMode="while-editing"
                            keyboardType="email-address"
                            editable = {false}
                        />
                        <Text style={{color: 'red', fontSize: 12, marginTop:20, marginLeft: 10}}>Phone</Text>                
                        <TextInput
                            underlineColorAndroid='transparent'
                            style={styles.textinput}
                            onChangeText={(user_phone) => this.setState({user_phone:user_phone})}
                            value={this.state.user_phone}
                            placeholder="Phone Number"
                            clearButtonMode="while-editing"
                            keyboardType="numeric"
                        />
                        <Text style={{color: 'red', fontSize: 12, marginTop:20, marginLeft: 10}}>Gender</Text>                
                        <TextInput
                            underlineColorAndroid='transparent'
                            style={styles.textinput}
                            onChangeText={(user_gender) => this.setState({user_gender:user_gender})}
                            value={this.state.user_gender}
                            placeholder="Gender"
                            clearButtonMode="while-editing"
            
                        />
                        <Text style={{color: 'red', fontSize: 12, marginTop:20, marginLeft: 10}}>Marital Status</Text>                
                        <TextInput
                            underlineColorAndroid='transparent'
                            style={styles.textinput}
                            onChangeText={(user_state) => this.setState({user_state:user_state})}
                            value={this.state.user_state}
                            placeholder="Marital Status"
                            clearButtonMode="while-editing"
                            
                        />
                        <Text style={{color: 'red', fontSize: 12, marginTop:20, marginLeft: 10}}>Profession</Text>                
                        <TextInput
                            underlineColorAndroid='transparent'
                            style={styles.textinput}
                            onChangeText={(user_profession) => this.setState({user_profession:user_profession})}
                            value={this.state.user_profession}
                            placeholder="Profession"
                            clearButtonMode="while-editing"
                            
                        />
                        <Text style={{color: 'red', fontSize: 12, marginTop:20, marginLeft: 10}}>Address</Text>                
                        <TextInput
                            underlineColorAndroid='transparent'
                            style={styles.textInputAddress}
                            onFocus={() => this.getAddress()}
                            value={this.state.user_address}
                            placeholder="Address"
                            clearButtonMode="while-editing"
                            
                        />
                        <Text style={{color: 'red', fontSize: 12, marginTop:20, marginLeft: 10}}>Age</Text>                
                        <TextInput
                            underlineColorAndroid='transparent'
                            style={styles.textinput}
                            onChangeText={(user_age) => this.setState({user_age:user_age})}
                            value={this.state.user_age}
                            placeholder="Age"
                            clearButtonMode="while-editing"
                            keyboardType="numeric"
                        />

                        <View style={[styles.centerContainer, {marginTop: 20}]}>
                            <TouchableHighlight style={styles.button} onPress={() => {this._onRegister()}}>
                                <View style={styles.buttonContainer}>
                                    <Text style={styles.buttonText}>Register</Text>
                                </View>
                            </TouchableHighlight>
                        </View>

                    </View>
                        

                        <View style={{ height: 60 }} />
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    basicContainer: {
        flex:1,
        alignItems: 'stretch',
        backgroundColor: GLOBAL.COLOR.RED, 
    },

    topBar: {
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
        marginTop: 30,
    },
    topBarLogo:{
        resizeMode: 'contain',
        width: 40,
         height: 40,
        marginRight: 10,
        },
    avatar:{
        resizeMode: 'cover',
        width: 100,
        height: 100,
        borderColor: GLOBAL.COLOR.RED,
        borderWidth: 1.5,
        borderRadius: 50,

        },
    avatarContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        zIndex: 1,

        },
    formContainer:{
         flex: 0.98,
         borderRadius: 6,
         backgroundColor: 'white',
         marginTop: -60,
         zIndex: 0,
         padding: 20,
        },
    container: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderRadius: 10,
        padding: 24,
    },

    centerContainer: {
        alignItems: 'center'
    },

    textinput: {
        backgroundColor: 'white',
        borderColor: '#dddddd',
        borderWidth: 1,
        fontSize: 15,
        borderRadius: 5,
        paddingLeft:10,
        paddingRight:10,
        marginTop: 4,
        height: 40,
    },
    textInputAddress:{
        backgroundColor: 'white',
        borderColor: '#dddddd',
        borderWidth: 1,
        fontSize: 15,
        borderRadius: 5,
        paddingLeft:10,
        paddingRight:10,
        marginTop: 4,
        height: 80,
    },

    password: {
        backgroundColor: 'white',
        borderColor: '#dddddd',
        borderWidth: 1,
        fontSize: 15,
        borderRadius: 5,
        paddingLeft:10,
        paddingRight:10,
        marginTop: 10
    },    

    button: {
        height:56,
        width:200,
        backgroundColor:GLOBAL.COLOR.RED,
        borderRadius: 28,
        marginTop: 10,
        marginBottom: 5,
    },

    buttonContainer: {
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent: 'center'
    },

    buttonText: {
        color:'white',
        fontSize:15,
    }
});