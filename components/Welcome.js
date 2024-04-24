import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";
import { useEffect } from "react";

const Welcome = ({ navigation }) => {
    const auth = getAuth();
    const signInUser = () =>{
        signInAnonymously(auth)
            .then(result=>{
                navigation.navigate("Chat", {id: result.user.uid});
                Alert.alert("Signed in Successfully!")
            })
            .catch((error)=>{
                Alert.alert("Unable to sign in")
            })    
    }
    
  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>CHATTER</Text>
      <TouchableOpacity style={styles.startButton} onPress={signInUser}>
        <Text style={styles.startButtonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(143, 236, 255)"
  },
  appTitle: {
    fontSize: 50,
    fontWeight: "bold",
    padding: 30,
    marginBottom: 100,
    color: "rgb(255,255,212)",
  },
  startButton: {
    borderWidth: 2,
    borderColor: "rgb(255,255,212)",
    borderRadius:"50",
    height: 50,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  startButtonText: {
    color: "#FFF",
  }
});

export default Welcome;
