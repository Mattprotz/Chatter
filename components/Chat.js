import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Platform,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import { collection, getDocs, orderBy, onSnapshot } from "firebase/firestore";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

const Chat = ({ route, navigation, db }) => {
  const { name, color, userID } = route.params; //destructuring name and color from route parameters
  const [messages, setMessages] = useState([]); //messages as state

  
  const fetchMessages = async () => { //fetching messages from Firestore
    const messageDocuments = await getDocs(collection(db, "Messages"), orderBy("createdAt", "desc")); 
    let newMessages = [];
    messageDocuments.forEach(docObject => {
      newMessages.push({
        id: docObject.id,
        // user: {
        //   _id: docObject.user._id,
        //   name: docObject.user.name,
        // },
        text: docObject.text,
        createdAt:  new Date(docObject.data().createdAt.toMillis()),
        ...docObject.data()
      });

    });
    setMessages(newMessages);
  };

  useEffect(() => {
    const unsubMessageList = onSnapshot(collection(db, "Messages"), (documentsSnapshot)=>{
      let newMessages = [];
      documentsSnapshot.forEach(docObject =>{
        newMessages.push({
          id: docObject.id,
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

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1, //required for gifted
  //       text: "Hello",
  //       createdAt: new Date(), //required for gifted
  //       user: {
  //         //required for gifted
  //         _id: 2,
  //         name: "React Native",
  //         avatar: "https://placeimg.com/140/140/any",
  //       },
  //     },
  //     {
  //       _id: 2,
  //       text: "Say Hi!",
  //       createdAt: new Date(),
  //       system: true,
  //     },
  //   ]);
  // }, []);

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

  const onSend = (newMessages=[]) => {
    //parameter new message
    //called when user sends message
    setMessages(
      (
        previousMessages //instead of directly changing state,
      ) => GiftedChat.append(previousMessages, newMessages)
    ); //appending new messages to previous sent messages
  };

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
          user: name,
        }}
      />

      {/* keyboard doesnt overlap input field */}
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
