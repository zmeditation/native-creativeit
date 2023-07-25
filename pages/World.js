import React, { Component } from 'react';
import { Platform, ImageBackground } from 'react-native';
import DrawerLayout from 'react-native-drawer-layout';
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
  KeyboardAvoidingView
} from 'react-native';

import Menu from './menu/Menu';
import {
  StackNavigator,
  StackActions,
  NavigationActions
} from 'react-navigation';
import { Marker, Callout } from 'react-native-maps';
import ClusteredMapView, { itemToGeoJSONFeature } from 'react-native-maps-super-cluster';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const GLOBAL = require('../Global');
const INIT_REGION = {
  latitude: 41.8962667,
  longitude: -121.3340056,
  latitudeDelta: 40,
  longitudeDelta: 40,
}
export default class World extends Component {

  static navigationOptions = {
    header: null
  }

  state = {
    showSpinner: true,
    user_photo: '',
    user_id: '',
    markers: [],
    pins: [],
    drawerClosed: true,
    latitude: 0.0,
    longitude: 0.0,
    notification:false,
  }


  constructor(props) {
    super(props);
    console.log("NearBy");
    this.state.showSpinner = true;
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.setDrawerState = this.setDrawerState.bind(this);

    AsyncStorage.getItem('latitude').then((value) => {
      console.log(value);
      if(value != null && value != ''){

          this.setState({latitude: parseFloat(value)});
        
      }
  });

  AsyncStorage.getItem('longitude').then((value) => {
      console.log(value);
      if(value != null && value != ''){
          console.log(value);
          this.setState({longitude: parseFloat(value)});
         
          
      }
  });
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

  fetchLocationData() {
    return fetch(GLOBAL.BASE_URL + 'get_all_locations', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },

    })
      .then((responseJson) => responseJson.json())
      .then((response) => {
        console.log(response.data);
        this.setState({
          showSpinner: false,
          markers: response.data,

        });
        pins = []
        response.data.map((item) => (
          pins.push({ id: item.id, location: { latitude: parseFloat(item.latitude),longitude:  parseFloat(item.longitude) } })
        ));
        this.setState({ pins });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentDidMount() {
   this.fetchLocationData();
 
  }

  renderCluster = (cluster, onPress) => {
    const pointCount = cluster.pointCount,
      coordinate = cluster.coordinate,
      clusterId = cluster.clusterId

      const clusteringEngine = this.map.getClusteringEngine(),
      clusteredPoints = clusteringEngine.getLeaves(clusterId, 100)

    return (
      <Marker coordinate={coordinate} onPress={onPress}>
        <View style={styles.myClusterStyle}>
          <Text style={styles.myClusterTextStyle}>
            {pointCount}
          </Text>
        </View>
        {
          /*
            Eventually use <Callout /> to
            show clustered point thumbs, i.e.:
            <Callout>
              <ScrollView>
                {
                  clusteredPoints.map(p => (
                    <Image source={p.image}>
                  ))
                }
              </ScrollView>
            </Callout>

            IMPORTANT: be aware that Marker's onPress event isn't really consistent when using Callout.
           */
        }
      </Marker>
    )
  }

  renderMarker = (pins) => <Marker key={pins.id || Math.random()} coordinate={pins.location} />
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
          renderNavigationView={() => <Menu nav={this.props.navigation}/>}
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
          <ClusteredMapView
          style={{ flex: 1 }}
          data={this.state.pins}
          initialRegion={INIT_REGION}
          ref={(r) => { this.map = r }}
          renderMarker={this.renderMarker}
          renderCluster={this.renderCluster}
>

      
        </ClusteredMapView>

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
  myClusterStyle: {
    width: 40,
    height: 40,
    padding: 6,
    borderWidth: 8,
    borderRadius: 20,
    alignItems: 'center',
    borderColor: 'rgba(190, 23, 20, 0.5)',
    justifyContent: 'center',
    backgroundColor: 'rgba(190, 23, 20, 0.9)',
  },
  myClusterTextStyle: {
    fontSize: 13,
    color: 'rgba(190, 23, 20, 0)',
    fontWeight: '500',
    textAlign: 'center',
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

});