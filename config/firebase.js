import * as firebase from 'firebase';

// Initialize Firebase
export function config(){
const firebaseConfig = {
  apiKey: "AIzaSyAHQNHk8ed6VBw4LCcSMTp2ehqtPyic1to",
  authDomain: "ondenaufra.firebaseapp.com",
  databaseURL: "https://ondenaufra.firebaseio.com",
  storageBucket: "ondenaufra.appspot.com"
}; 
return {firebaseConfig};
}