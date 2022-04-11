const firebase = require('firebase');
require('firebase/app');
require('firebase/analytics');
require('firebase/firestore');
// import "firebase/firestore"
import {firebaseConfig} from '../firebaseConfig.jsx';
!firebase.apps.length? firebase.initializeApp(firebaseConfig): firebase.app();
export default firebase
