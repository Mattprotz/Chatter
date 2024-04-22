import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";

const Welcome = ({ navigation }) => {
    const auth = getAuth();
    const signInUser = () =>{
        signInAnonymously(auth)
            .then(result=>{
                navigation.navigate("Chat", {userID:result.user.uid});
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
  },
  appTitle: {
    fontWeight: "600",
    fontSize: 45,
    marginBottom: 100,
  },
  startButton: {
    backgroundColor: "rgb(176,223,255)",
    height: 50,
    width: "88%",
    justifyContent: "center",
    alignItems: "center",
  },
  startButtonText: {
    color: "#FFF",
  }
});

export default Welcome;
