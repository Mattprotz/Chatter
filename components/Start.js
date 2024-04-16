import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";

const Start = ({ navigation }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("blue");
  const changeColor = (newColor) => setColor(newColor);
  return (
    <View style={[styles.container,{backgroundColor:color}]}>
      <Text style={styles.title}>CHATTER</Text>

      <TextInput
        style={styles.textInput}
        value={name}
        onChangeText={setName}
        placeholder="Username"
      />
      <View style={styles.colorPicker} value={color}>
        <TouchableOpacity
          style={[styles.colorButton, { backgroundColor: "red" }]}
          onPress={() => changeColor("rgb(255, 150, 143)")}
        />
        <TouchableOpacity
          style={[styles.colorButton, { backgroundColor: "green" }]}
          onPress={() => changeColor("rgb(143, 255, 162)")}
        />
        <TouchableOpacity
          style={[styles.colorButton, { backgroundColor: "blue" }]}
          onPress={() => changeColor("rgb(143, 236, 255)")}
        />
      </View>
      <Button
        title="Chat"
        onPress={() => navigation.navigate("Chat", { name: name , color: color})}
        style={styles.chatButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(176,223,255)",
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    padding: 30,
    color: "rgb(255,255,212)",
  },
  textInput: {
    justifyContent: "center",
    alignItems: "center",
    width: "88%",
    padding: 20,
    borderWidth: 2,
    borderColor: "rgb(255,255,212)",
    marginTop: 15,
    marginBottom: 15,
  },
  colorPicker: {
    flexDirection:'row',
    flexWrap:'wrap',
    width: "88%",
    height: 50,
    borderWidth: 2,
    borderColor: "rgb(255,255,212)",
    justifyContent:'space-between'
  },
  colorButton:{
    flex: 1,
    width:30,
    height:30,
    marginTop:8,
    marginHorizontal:45,
    borderWidth:1,
    borderRadius:50,
  }
});

export default Start;
