import React from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import ref, { uploadBytes } from 'firebase/storage';

const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
  const actionSheet = useActionSheet();

  const onActionPress = () => {
    const options = [
      "Choose Image from Library",
      "Take Picture",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log("user trying to pick image");
            pickImage();
            return;
          case 1:
            console.log("user trying to take photo");
            takePhoto();
            return;
          case 2:
            console.log("user trying to send location");
            getLocation();
          default:
        }
      }
    );
  };

  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();
    if(permissions?.granted){
      const location = await Location.getCurrentPositionAsync({});
      if(location){
        onSend({
          location:{
            longitude: location.coords.longitude,
            latitude: location.coords.latitude
          },
        })
      }else Alert.alert('error occured while fetching location')
    } else Alert.alert('Permissions not granted')
  }

  const pickImage = async ()=> {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(permissions?.granted){
      let result = await ImagePicker.launchImageLibraryAsync();
      if(!result.canceled){
        const imageURI = result.assets[0].uri;
        const response = await fetch(imageURI);
        const blob = await response.blob();
        const newUploadRef = ref(storage, 'image123')
        uploadBytes(newUploadRef, blob).then(async(snapshot)=>{
          console.log("Filed has been successfully uploaded")
        })
      }
      else Alert.alert("Permissions have not been granted");
    }
  }

  const takePhoto = async ()=>{
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if(permissions?.granted){
      let result = await ImagePicker.launchCameraAsync();
      if(!result.canceled){
        setImage(result.assets[0]);
      }else setImage(null)
    }
  }

  const generateReference = (uri) => {
    const timeStamp = (new Date()).getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];
    return `${userID}-${timeStamp}-${imageName}`;
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onActionPress}>
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 10,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

export default CustomActions;
