import React, { Component } from 'react';
import { View, Text, Button, NetInfo, Switch, StyleSheet } from 'react-native';
import SwitchExample from './SwitchUse'
import * as firebase from 'firebase';

// Initialize Firebase

const firebaseConfig = {
  apiKey: "your api key here",
  authDomain: "ondenaufra.firebaseapp.com",
  databaseURL: "https://ondenaufra.firebaseio.com",
  storageBucket: "ondenaufra.appspot.com"
 
}
firebase.initializeApp(firebaseConfig);

class GeolocationExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      isAtivo: null,
      switch1Value: false,
      switch2Value: false,
    };
  }

  _onPress() {
      this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        options = { timeout: 100 }
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
        firebase.database().ref('motorista/bage').update({
          latitude : position.coords.latitude,
          longitude: position.coords.longitude
        });
    
     } ,
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );
    
    
  }
  handleFirstConnectivityChange(isConnected) {
    this.setState({ isAtivo: (isConnected ? true : false) });
  }
  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({ isAtivo: (isConnected ? true : false) })
    });
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }

  toggleSwitch1 = (value) => {
    this.setState({ switch1Value: value })
    console.log('Switch 1 is: ' + value)
  }
  toggleSwitch2 = (value) => {
    this.setState({ switch2Value: value })
    console.log('Switch 2 is: ' + value)
  }

  render() {
    return (
      <View style={style.container}>
        <Text>Latitude: {this.state.latitude}</Text>
        <Text>Longitude: {this.state.longitude}</Text>
        <Text>Status: {this.state.isAtivo ? 'Online' : 'Offline'}</Text>
        <Button
          onPress={() => this._onPress()}
          title="Pilotar o Bagé"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
        <SwitchUse toggleSwitch1={this.toggleSwitch1}
          toggleSwitch2={this.toggleSwitch2}
          switch1Value={this.state.switch1Value}
          switch2Value={this.state.switch2Value} />

        {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
        <View
          style={{ width: 25, height: 25, borderRadius: 12.5, backgroundColor: this.state.isAtivo ? 'green' : 'red' }}
        />
      </View>

    );
  }

}
const style = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#a9a9a9',
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  }
})



export default GeolocationExample;