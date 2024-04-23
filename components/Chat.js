import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Platform,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import { collection, getDocs, orderBy, onSnapshot, addDoc } from "firebase/firestore";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

const Chat = ({ route, navigation, db }) => {
  const { name, color, userID } = route.params; //destructuring name and color from route parameters
  const [messages, setMessages] = useState([]); //messages as state

  
  const fetchMessages = async () => { //fetching messages from Firestore
    const messageDocuments = await getDocs(collection(db, "Messages"), orderBy("createdAt", "desc")); 
    let newMessages = [];
    messageDocuments.forEach(docObject => {
      newMessages.push({
        _id: docObject.id,
        user: {
          _id: docObject.userId,
          name: docObject.user.name,
        },
        createdAt:  new Date(docObject.data().createdAt.toMillis()),
        ...docObject.data()
      });
    });
    setMessages(newMessages);
  };

  useEffect(() => {
    console.log(userID)
    const unsubMessageList = onSnapshot(collection(db, "Messages"), (documentsSnapshot)=>{
      let newMessages = [];
      documentsSnapshot.forEach(docObject =>{
        newMessages.push({
          _id: docObject._id,
          ...docObject.data()
        })
      });
      setMessages(newMessages);
    });
    //checks if unsub is NOT undefined
    return () =>{
      if(unsubMessageList)unsubMessageList();
    }
  },[]);

  const addMessages = async (newMessage) =>{
    const newMessageRef = await addDoc(messages(db, "Messages"), newMessage);
      if(newMessageRef.id){
        setMessages([newMessage, ...messages]);
        Alert.alert('new message has been added')
      }else{
        Alert.alert('unable to add message')
      }
  }

  if(!userID){
    console.error("UserID is undefined")
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

  const onSend = (newMessages) => {
    addDoc(collection(db, "Messages"), newMessages[0]);
  };

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,
          name: name,
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
