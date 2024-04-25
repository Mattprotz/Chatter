import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Platform,
  Text,
  KeyboardAvoidingView,
  Alert
} from "react-native";
import { collection, getDocs, orderBy, onSnapshot, addDoc, query, where } from "firebase/firestore";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db, isConnected }) => {
  const { name, color, userID } = route.params; //destructuring name, id, and color from route parameters
  const [messages, setMessages] = useState([]); //messages as state
  console.log("name", name);
  console.log("userID at Chat", userID)

  
  const fetchMessages = async () => { //fetching messages from Firestore
    const messageDocuments = await getDocs(collection(db, "Messages"), orderBy("createdAt", "desc"));  //pulling from firestore 
    let newMessages = []; //create empty area
    messageDocuments.forEach(docObject => { //iterating over each object/document in collection
      newMessages.push({
        id: docObject.id,
        user: {
          userID: docObject.id,
          name: docObject.name,
          ...docObject.data(),
        },
        createdAt:  new Date(docObject.data().createdAt.toMillis()),
        ...docObject.data()
      });
    });
    setMessages(newMessages);
  };

  const addMessages = async (newMessage) =>{
    const newMessageRef = await addDoc(messages(db, "Messages"), newMessage);
      if(newMessageRef.id){
        setMessages([newMessage, ...messages]);
        Alert.alert('new message has been added')
        console.log("Message:", newMessageRef.id)
      }else{
        Alert.alert('unable to add message')
      }
  }

  const onSend = (newMessages) => {
    addDoc(collection(db, "Messages"), newMessages[0]);
    console.log("message sent")
  };

  const loadCachedMessages = async () =>{
    const cachedMessages  = await AsyncStorage.getItem("message_lists") || []; //assigns empty array in case 'get' fails
    setMessages(JSON.parse(cachedMessages));
  }
//real time data sync if connected
  useEffect(() => {
    let unsubMessageList; 
    if(isConnected === true){
    const q = query(collection(db, "Messages"), where("uid", "==", userID))
     unsubMessageList = onSnapshot(q,(documentsSnapshot)=>{
      let newMessages = [];
      documentsSnapshot.forEach(docObject =>{
        newMessages.push({
          id: docObject.id,
          ...docObject.data(),
        })
      });
      cacheMessageLists(newMessages)
      setMessages(newMessages);
    });
  }else loadCachedMessages();
    //checks if unsub is NOT undefined
    return () =>{
      if(unsubMessageList) unsubMessageList();
    }
  },[isConnected]); //calls callback when prop value changes

  const cacheMessageLists = async(messagesToCache) =>{
    try{
      await AsyncStorage.setItem('message_lists', JSON.stringify(messagesToCache))
    }catch(error){
      console.log(error.message);
    }
  }

 

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props} //props param: includes current messages, prev messages, positioning, etc...
        wrapperStyle={{
          right: {
            backgroundColor: "pink",
          },
          left: {
            backgroundColor: "white",
          },
        }}
      />
    );
  };



  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{
          id: userID,
          name: name
        }}
      />

      {/* keyboard doesn't overlap input field */}
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
