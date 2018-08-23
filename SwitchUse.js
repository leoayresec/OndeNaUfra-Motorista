import React, { Component } from 'react'
import {
   View,
   Switch,
   StyleSheet,
   Text
} 
from 'react-native'

export default SwitchUse = (props) => {
   return (
      <View style = {styles.container}>
         <Switch
            onValueChange = {props.toggleSwitch1}
            value = {props.switch1Value}
            />
            <Text>Zootecnia</Text>
         <Switch
            onValueChange = {props.toggleSwitch2}
            value = {props.switch2Value}/>
            <Text>Prédio Central</Text>

      </View>
   )
}
const styles = StyleSheet.create ({
   container: {
      alignItems: 'center',
      marginTop: 100
   }
})