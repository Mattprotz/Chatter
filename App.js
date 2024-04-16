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
import Start from "./components/Start";
import Chat from "./components/Chat";

const App = () => {
  const [text, setText] = useState("");
  const Stack = createNativeStackNavigator();

  const alertMyText = () => {
    Alert.alert(text);
  };

  return (
    <NavigationContainer>
      {/* <View style={styles.container}>
        <View style={styles.box1}></View>
        <View style={styles.box2}>
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={setText}
            placeholder="Type Something Here"
          />
          <Text>You wrote: {text}</Text>
        </View>
        <View style={styles.box3}>
          <TouchableOpacity
            onPress={() => {
              alertMyText();
            }}
            title="Button"
            style={styles.button}
          ></TouchableOpacity>
          <ScrollView>
            <Text style={{ fontSize: 110 }}> </Text>
          </ScrollView>
        </View>
      </View> */}
      <Stack.Navigator initialRouteNme="Screen1">
        {/* two required props : name and component */}
        <Stack.Screen name="Start" component={Start} /> 
        <Stack.Screen name="Chat" component={Chat} />
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
