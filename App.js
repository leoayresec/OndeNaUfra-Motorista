import React, { Component } from "react";
import { View, Text, NetInfo, Switch, StyleSheet, Image } from "react-native";
import * as firebase from "firebase";
import SwitchExample from "./SwitchUse";
import { Button, Badge } from "react-native-elements";
// Initialize Firebase

const firebaseConfig = {
  apiKey: "AIzaSyAHQNHk8ed6VBw4LCcSMTp2ehqtPyic1to",
  authDomain: "ondenaufra.firebaseapp.com",
  databaseURL: "https://ondenaufra.firebaseio.com",
  storageBucket: "ondenaufra.appspot.com"
};
firebase.initializeApp(firebaseConfig);

class GeolocationExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      isAtivo: false,
      isOnline: false,
      switch1Value: false,
      switch2Value: false,
      watchId: null
    };
  }
  sendToFirebase(latitude, longitude) {
    firebase
      .database()
      .ref("motorista/bage")
      .update({
        latitude,
        longitude
      });
  }
  _onPress() {
    if (this.state.isAtivo) {
      const watchId = setInterval(this.getPosition, 5000);
      this.setState({
        watchId,
        isAtivo: false
      });
    } else {
      clearInterval(this.state.watchId);
      this.setState({ isAtivo: true, watchId: null });
    }
  }
  handleFirstConnectivityChange = isConnected => {
    this.setState({ isAtivo: isConnected ? true : false });
  };
  getPosition = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({ error: null });
        this.sendToFirebase(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      error => this.setState({ error: error.message }),
      {
        enableHighAccuracy: false,
        timeout: 2000,
        maximumAge: 1000
      }
    );
  };
  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({ isOnline: isConnected ? true : false });
    });
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this.handleFirstConnectivityChange
    );
  }
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleFirstConnectivityChange
    );
    clearInterval(this.watchId);
  }

  toggleSwitch1 = value => {
    this.setState({ switch1Value: value });
  };
  toggleSwitch2 = value => {
    this.setState({ switch2Value: value });
  };

  render() {
    return (
      <View style={style.container}>
        <Badge
          value={this.state.isAtivo ? "Parado" : "Rodando"}
          textStyle={{ color: "green" }}
          containerStyle={{ width: "50%" }}
        />
        <Text style={{ fontSize: 22, textAlign: "center" }}>
          Status: {this.state.isAtivo ? "Parado" : "Rodando"}
        </Text>
        <Button
          large
          icon={{ name: "bus", type: "font-awesome" }}
          title="Pilotar o Bagé"
          onPress={() => this._onPress()}
          backgroundColor={this.state.isAtivo ? "green" : "red"}
        />
        <SwitchUse
          toggleSwitch1={this.toggleSwitch1}
          toggleSwitch2={this.toggleSwitch2}
          switch1Value={this.state.switch1Value}
          switch2Value={this.state.switch2Value}
        />

        {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
        <View
          style={{
            width: 25,
            height: 25,
            borderRadius: 12.5,
            backgroundColor: this.state.isOnline ? "green" : "red"
          }}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: "#000"
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "black"
            }}
          >
            <Image
              source={require("./assets/zootec.png")}
              resizeMode={"contain"}
              style={{ width: "50%", height: "50%" }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text>Sentido Prédio Central</Text>
          </View>
        </View>
      </View>
    );
  }
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a9a9a9",
    paddingHorizontal: 5,
    paddingTop: Expo.Constants.statusBarHeight
  }
});

export default GeolocationExample;
