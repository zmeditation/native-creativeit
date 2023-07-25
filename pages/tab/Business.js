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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    StackNavigator,
    StackActions, 
    NavigationActions
} from 'react-navigation';


import { Switch } from 'react-native-gesture-handler';

const GLOBAL = require('../../Global');

export default class Business extends Component {

    static navigationOptions = {
        header: null,
    }

    state = {
        showSpinner: true,
        business_name: '',
        business_category: '',
        business_email:'',
        business_website: '',
        business_phone: '',
        business_location: '',
        business_address: '',
        business_status: '',
        business_latitude: '',
        business_longitude: '',
        user_id: '',
        showMap: true,

      }
    

    constructor(props) {
        super(props);

        AsyncStorage.getItem('user_id').then((value) => {
            console.log(value);
            if(value != null && value != ''){
                this.setState({user_id: value});
            }
        });
        AsyncStorage.getItem('business_name').then((value) => {
            console.log(value);
            if(value != null && value != ''){
                this.setState({business_name: value});
            }
        });
        AsyncStorage.getItem('business_email').then((value) => {
            console.log(value);
            if(value != null && value != ''){
                this.setState({business_email: value});
            }
        });
        AsyncStorage.getItem('business_category').then((value) => {
            console.log(value);
            if(value != null && value != ''){
                this.setState({business_category: value});
            }
        });
        AsyncStorage.getItem('business_website').then((value) => {
            console.log(value);
            if(value != null && value != ''){
                this.setState({business_website: value});
            }
        });
        AsyncStorage.getItem('business_phone').then((value) => {
            console.log(value);
            if(value != null && value != ''){
                this.setState({business_phone: value});
            }
        });

        AsyncStorage.getItem('business_address').then((value) => {
            console.log(value);
            if(value != null && value != ''){
                this.setState({business_address: value});
            }
        });
        AsyncStorage.getItem('business_latitude').then((value) => {
            console.log(value);
            if(value != null && value != ''){
                this.setState({business_latitude: value});
            }
        });
        AsyncStorage.getItem('business_longitude').then((value) => {
            console.log(value);
            if(value != null && value != ''){
                this.setState({business_longitude: value});
            }
        });
  
        
    }

    componentDidMount() {
  
    }

    _onRegister(){
        if(this.state.business_phone == ""){
            alert("Please enter your phone number.");
        }else if(this.state.business_address == ""){
            alert("Please enter your address.");
        }else if(this.state.business_category == ""){
            alert("Please enter your category.");
        }else if(this.state.business_website == ""){
            alert("Please enter your website.");
        }else if(this.state.business_email == ""){
            alert("Please enter your email.");
        }else if(this.state.business_name == ""){
            alert("Please enter your name.");
        }else{
            var profileParams = "business_name=" + this.state.business_name;
        profileParams += "&business_email=" + this.state.business_email;
        profileParams += "&business_phone=" + this.state.business_phone;
        profileParams += "&business_latitude=" + this.state.business_latitude;
        profileParams += "&business_longitude=" + this.state.business_longitude;
        profileParams += "&business_address=" + this.state.business_address;
        profileParams += "&business_category=" + this.state.business_category;
        profileParams += "&business_website=" + this.state.business_website;
        profileParams += "&business_status=" + this.state.business_status;
        profileParams += "&user_id=" + this.state.user_id;
        return fetch(GLOBAL.BASE_URL + 'register_business', {
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
                    
                    AsyncStorage.setItem('business_name', '');
                    AsyncStorage.setItem('business_email', '');
                    AsyncStorage.setItem('business_website', '');
                    AsyncStorage.setItem('business_phone', '');
                    AsyncStorage.setItem('business_address', '');
                    AsyncStorage.setItem('business_latitude', '');
                    AsyncStorage.setItem('business_longitude', '');
                    AsyncStorage.setItem('business_status', '');
                    AsyncStorage.setItem('business_category', '');
                    this.resetNavigation('Classic');

                }
                try {
                    // this.resetNavigation('Tab');                    
                } catch (error) {
                    
                }

            

        })
        .catch((error) =>{
            console.error(error);
        });
        }
        
    }

    updateBusinessStatus(value){
        this.setState({showMap: value});
        if(this.state.showMap){
            this.setState({business_status: 'active'})
        }else{
            this.setState({business_status: 'disable'})
        }
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

    selectAddr(){

        if(this.state.business_name != ''){
            AsyncStorage.setItem('business_name', this.state.business_name);            
        }

        if(this.state.business_email != ''){
            AsyncStorage.setItem('business_email', this.state.business_email);            
        }

        if(this.state.business_category != ''){
            AsyncStorage.setItem('business_category', this.state.business_category);            
        }

        if(this.state.business_phone != ''){
            AsyncStorage.setItem('business_phone', this.state.business_phone);            
        }

        if(this.state.business_website != ''){
            AsyncStorage.setItem('business_website', this.state.business_website);            
        }
        this.props.navigation.navigate('Addr');
    }
    render() {
        const { state, navigate } = this.props.navigation;
        return (
            <View style={styles.basicContainer}>

                <KeyboardAvoidingView style={styles.container} behavior="padding">
                    <ScrollView style={{ backgroundColor: 'rgba(255, 255, 255, 0)',}}>

                        <View style = {styles.formContainer}>
                        <View style = {styles.titleContainer}>
                            <MaterialCommunityIcons  name='circle-edit-outline' size={28} color={GLOBAL.COLOR.GREEN} />
                            <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center' }} numberOfLines ={2}>
                                ENTER YOUR BUSINESS INFO
                            </Text>
                        </View>

                        <TextInput
                            underlineColorAndroid='transparent'
                            style={styles.textinput}
                            onChangeText={(business_name) => this.setState({business_name:business_name})}
                            value={this.state.business_name}
                            placeholder="Business Name"
                            clearButtonMode="while-editing"
                            
                        />         

                        <TextInput
                            underlineColorAndroid='transparent'
                            style={styles.textinput}
                            onChangeText={(business_email) => this.setState({business_email:business_email})}
                            value={this.state.business_email}
                            placeholder="E-mail"
                            clearButtonMode="while-editing"
                            keyboardType="email-address"
                            
                        />
                        <TextInput
                            underlineColorAndroid='transparent'
                            style={styles.textinput}
                            onChangeText={(business_category) => this.setState({business_category:business_category})}
                            value={this.state.business_category}
                            placeholder="Category"
                            clearButtonMode="while-editing"
            
                        />
                        <TextInput
                            underlineColorAndroid='transparent'
                            style={styles.textinput}
                            onChangeText={(business_phone) => this.setState({business_phone:business_phone})}
                            value={this.state.business_phone}
                            placeholder="Phone Number"
                            clearButtonMode="while-editing"
                            keyboardType="numeric"
                        />
                        <TextInput
                            underlineColorAndroid='transparent'
                            style={styles.textinput}
                            onChangeText={(business_website) => this.setState({business_website:business_website})}
                            value={this.state.business_website}
                            placeholder="Website"
                            clearButtonMode="while-editing"
                            
                        />            
                      
                                     
                        <TextInput
                            underlineColorAndroid='transparent'
                            style={styles.textInputAddress}
                            onFocus={() => this.selectAddr()}
                            value={this.state.business_address}

                            placeholder="Address"
                            clearButtonMode="while-editing"

                        />


                        <View style={[styles.centerContainer, {marginTop: 20}]}>
                            <TouchableHighlight style={styles.button} onPress={() => {this._onRegister()}}>
                                
                                    <Text style={styles.buttonText}>Save</Text>
                                
                            </TouchableHighlight>
                            <Text style={{ paddingLeft: 20, fontSize: 17, marginRight: 8}}>
                                Visible on map
                            </Text>
                            <Switch value={this.state.showMap} onValueChange={(value) => this.updateBusinessStatus(value)}/>
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
        paddingTop: 20,
    },

    topBar: {
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        
 
    },
    topBarLogo:{
        resizeMode: 'contain',
        width: 40,
         height: 40,
        marginRight: 10,
        },

    titleContainer:{
        
        flexDirection: 'row',
        justifyContent: 'center',

        backgroundColor: 'rgba(255, 255, 255, 0)',
        marginBottom: 12
        
        },
    formContainer:{
         borderRadius: 6,
         backgroundColor: 'white',
         marginTop: 10,
         padding: 20,
        },
    container: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderRadius: 10,
        paddingLeft: 24,
        paddingRight: 24,
        
    },

    centerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
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
        height:32,
        width:80,
        backgroundColor:GLOBAL.COLOR.GREEN,
        borderRadius: 16,
        marginTop: 10,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'

    },

    buttonContainer: {
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent: 'center'
    },

    buttonText: {
        color:'white',
        fontSize:17,
    }
});