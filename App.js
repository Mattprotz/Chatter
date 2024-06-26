import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Alert,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage"
import { useNetInfo }from '@react-native-community/netinfo';
import Start from "./components/Start";
import Chat from "./components/Chat";
import Welcome from "./components/Welcome";

const App = () => {
  const connectionStatus = useNetInfo();


 useEffect(()=>{
  if(connectionStatus.isConnected === false){ 
    Alert.alert("Connection Lost")
    disableNetwork(db);
  }else if(connectionStatus.isConnected === true){
    enableNetwork(db);
  }
 },[connectionStatus.isConnected])

  const firebaseConfig = {
    apiKey: "AIzaSyCikqWBcobNi251yH7rYlQEOnoCmxYz09U",
    authDomain: "chatter-d4f39.firebaseapp.com",
    projectId: "chatter-d4f39",
    storageBucket: "chatter-d4f39.appspot.com",
    messagingSenderId: "126328665381",
    appId: "1:126328665381:web:a246b61bdf4a6653c8d6cc",
  };

  const app = initializeApp(firebaseConfig); //initialize firebase
  const db = getFirestore(app); //initialize firestore and reference service
  const storage = getStorage(app);

  const [text, setText] = useState("");
  const Stack = createNativeStackNavigator();
 


  return (
    <NavigationContainer>

      <Stack.Navigator initialRouteNme="Welcome">
        {/* two required props : name and component */}
        <Stack.Screen name="Welcome" component={Welcome}/>
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => (<Chat isConnected={connectionStatus.isConnected} db={db} storage={storage} {...props} />)}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box1: {
    flex: 1,
    backgroundColor: "blue",
  },
  box2: {
    flex: 12,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  box3: {
    flex: 5,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    width: "65%",
    borderWidth: 3,
    height: 50,
    padding: 10,
  },
  button: {
    width: "50%",
    height: "20",
    backgroundColor: "#DDDDDD",
    color: "black",
    padding: 10,
  },
});

export default App;
