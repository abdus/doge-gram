import firebase from "firebase";

export function initializeFirebase() {
  return firebase.initializeApp({
    apiKey: "AIzaSyDNKSlksAAiT_z-kJ4wGWrTYS5-f4IZDe0",
    authDomain: "doge-gram.firebaseapp.com",
    projectId: "doge-gram",
    storageBucket: "doge-gram.appspot.com",
    messagingSenderId: "253952443476",
    appId: "1:253952443476:web:1d03ee674d661ed484d9c1",
  });
}
