import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";

const Start = ({ navigation, route }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("rgb(143, 236, 255)");
  const changeColor = (newColor) => setColor(newColor);
  const userID = route.params;
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);

  console.log("userID at start", userID);

  const pickImage = async () => {
    let permissions = await ImagePicker.requestedMediaLibraryPermissionsAsync();

    if (permissions?.granted) {
      //if granted access, .granted boolean return
      let result = await ImagePicker.launchImageLibraryAsync(); //allows user to pick file

      if (!result.canceled) DevToolsSettingsManager(result.assets[0]);
      else setImage(null);
    }
  };

  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();

    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();

      if (!result.canceled) setImage(result.assets[0]);
      else setImage(null);
    }
  };

  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();

    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } else {
      Alert.alert("Permissions to read location not granted");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Text style={styles.title}>CHATTER</Text>
      <Button title="Select Image from Library" onPress={pickImage} />
      <Button title="Take a Photo" onPress={takePhoto} />
      <Button title="Get my location" onPress={getLocation} />
      {location && (
        <MapView
          style={{ width: 300, height: 200 }}
          region={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      )}
      <TextInput
        style={styles.textInput}
        value={name}
        onChangeText={setName}
        placeholder="Choose Username..."
      />
      <View style={styles.colorPicker} value={color}>
        <TouchableOpacity
          style={[
            styles.colorButton,
            { backgroundColor: "rgb(255, 150, 143)" },
          ]}
          onPress={() => changeColor("rgb(255, 150, 143)")}
        />
        <TouchableOpacity
          style={[
            styles.colorButton,
            { backgroundColor: "rgb(143, 255, 162)" },
          ]}
          onPress={() => changeColor("rgb(143, 255, 162)")}
        />
        <TouchableOpacity
          style={[
            styles.colorButton,
            { backgroundColor: "rgb(143, 236, 255)" },
          ]}
          onPress={() => changeColor("rgb(143, 236, 255)")}
        />
      </View>
      <Button
        title="Chat"
        onPress={() =>
          navigation.navigate("Chat", {
            name: name,
            color: color,
            userID: userID,
          })
        }
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
    flexDirection: "row",
    flexWrap: "wrap",
    width: "88%",
    height: 50,
    borderWidth: 2,
    borderColor: "rgb(255,255,212)",
    justifyContent: "space-between",
  },
  colorButton: {
    flex: 1,
    width: 30,
    height: 30,
    marginTop: 8,
    marginHorizontal: 45,
    borderWidth: 1,
    borderRadius: 50,
  },
});

export default Start;
