import { useState } from "react";
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
import { getFirestore, collection, getDocs } from "firebase/firestore";
import Start from "./components/Start";
import Chat from "./components/Chat";
import Welcome from "./components/Welcome";

const App = () => {
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

  const [text, setText] = useState("");
  const Stack = createNativeStackNavigator();

  const alertMyText = () => {
    Alert.alert(text);
  };

  return (
    <NavigationContainer>

      <Stack.Navigator initialRouteNme="Welcome">
        {/* two required props : name and component */}
        <Stack.Screen name="Welcome" component={Welcome}/>
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => <Chat db={db} {...props} />}
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
