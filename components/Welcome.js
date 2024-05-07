import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";
import { useEffect } from "react";

const Welcome = ({ navigation, route }) => {
    const auth = getAuth();
    
    const signInUser = () =>{
        signInAnonymously(auth)
            .then(result=>{
                navigation.navigate("Start", {userID: result.user.uid});
                Alert.alert("Signed in Successfully!")
            })
            .catch((error)=>{
                Alert.alert("Unable to sign in")
                console.error("Error", error)
            })    
    }

    const signUpUser = () =>{

    }

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>CHATTER</Text>
      {/* <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>Sign Up</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.startButton} onPress={signInUser}>
        <Text style={styles.startButtonText}>Guest</Text>
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
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  startButtonText: {
    color: "#FFF",
  }
});

export default Welcome;
