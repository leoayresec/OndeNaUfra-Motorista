import React, {Component} from 'react';
import * as firebase from 'firebase';
import {View, Text, NetInfo, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import {firebaseKey} from './apikeys';
// Initialize Firebase

const firebaseConfig = {
  apiKey: firebaseKey,
  authDomain: 'ondenaufra.firebaseapp.com',
  databaseURL: 'https://ondenaufra.firebaseio.com',
  storageBucket: 'ondenaufra.appspot.com',
};
firebase.initializeApp (firebaseConfig);
const disabledColor = '#e50000';
const enabledColor = '#00420c';
const SLIDE_IN_DOWN_KEYFRAMES = {
  from: {translateX: -150},
  to: {translateX: 150},
};
class GeolocationExample extends Component {
  constructor (props) {
    super (props);

    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      isAtivo: false,
      isOnline: false,
      zootec: false,
      watchId: null,
    };
  }
  sendToFirebase (latitude, longitude) {
    firebase.database ().ref ('motorista/bage').update ({
      latitude,
      longitude,
      zootec: this.state.zootec,
    });
  }
  _onPress () {
    if (this.state.isAtivo) {
      const watchId = setInterval (this.getPosition, 5000);
      this.setState ({
        watchId,
        isAtivo: false,
      });
    } else {
      clearInterval (this.state.watchId);
      this.setState ({isAtivo: true, watchId: null});
    }
  }
  handleFirstConnectivityChange = isConnected => {
    this.setState ({isAtivo: isConnected ? true : false});
  };
  getPosition = () => {
    navigator.geolocation.getCurrentPosition (
      position => {
        this.setState ({error: null});
        this.sendToFirebase (
          position.coords.latitude,
          position.coords.longitude
        );
      },
      error => this.setState ({error: error.message}),
      {
        enableHighAccuracy: false,
        timeout: 2000,
        maximumAge: 1000,
      }
    );
  };
  componentDidMount () {
    NetInfo.isConnected.fetch ().then (isConnected => {
      this.setState ({isOnline: isConnected ? true : false});
    });
    NetInfo.isConnected.addEventListener (
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }
  componentWillUnmount () {
    NetInfo.isConnected.removeEventListener (
      'connectionChange',
      this.handleFirstConnectivityChange
    );
    clearInterval (this.watchId);
  }
  renderBus () {
    return (
      <Animatable.View
        animation={SLIDE_IN_DOWN_KEYFRAMES}
        iterationCount={Infinity}
        direction="alternate"
        duration={3500}
        easing={'linear'}
        useNativeDriver={true}
      >
        <Icon
          name="bus-side"
          type="material-community"
          color={this.state.isAtivo ? '#98a6b0' : enabledColor}
          size={80}
        />
      </Animatable.View>
    );
  }
  render () {
    return (
      <View style={style.container}>
        <View style={{flex: 2, justifyContent: 'center'}}>
          {this.renderBus ()}
          <TouchableOpacity
            style={{
              width: 270,
              height: 100,
              flexDirection: 'row',
              backgroundColor: this.state.isAtivo
                ? enabledColor
                : disabledColor,
              alignSelf: 'center',
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'space-around',
              paddingRight: 10,
            }}
            onPress={() => this._onPress ()}
          >
            <Icon
              name="bus"
              type="font-awesome"
              color={'white'}
              size={30}
              onPress={() => this.setState ({zootec: !this.state.zootec})}
            />
            <Text
              style={{
                color: 'white',
                fontSize: 30,
                textAlign: 'left',
              }}
            >
              {this.state.isAtivo ? 'Pilotar o Bagé' : 'Parar de pilotar'}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: 'center',
            }}
          >
            <Icon
              reverse
              name="swap"
              type="entypo"
              color={this.state.zootec ? enabledColor : disabledColor}
              size={60}
              onPress={() => this.setState ({zootec: !this.state.zootec})}
            />
            <Text
              style={{
                color: 'white',
                fontSize: 22,
              }}
            >
              {this.state.zootec
                ? 'Passando por Zootecnia'
                : 'Não passando por Zootecnia'}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
const style = StyleSheet.create ({
  container: {
    flex: 1,
    backgroundColor: '#98a6b0',
    paddingHorizontal: 5,
    paddingTop: Expo.Constants.statusBarHeight,
  },
});

export default GeolocationExample;
