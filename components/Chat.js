import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Platform,
  Text,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import {
  collection,
  getDocs,
  orderBy,
  onSnapshot,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db, isConnected }) => {
  const { name, color, userID } = route.params; //destructuring name, id, and color from route parameters
  const [messages, setMessages] = useState([]); //messages as state
  console.log("name", name);
  console.log("userID at Chat", userID);

  useEffect(() => {
    //real time data sync if connected
    let unsubMessages;
    if (isConnected === true) {
      console.log("Connected to firestore")
      // , where("uid", "==", userID)
      const q = query(collection(db, "Messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (documentsSnapshot) => {
        let newMessages = [];
        documentsSnapshot.forEach((docObject) => {
          newMessages.push({
            id: docObject.id,
            ...docObject.data(),
            createdAt: new Date(docObject.data().createdAt.toMillis()),
            ...docObject.data(),
          });
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else {
      loadCachedMessages();
      console.log("messages loading from cache");
    }

    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [isConnected]);

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("Messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem("Messages")) || []; //assigns empty array in case 'get' fails
    setMessages(JSON.parse(cachedMessages));
    console.log("messages from cache")
  };

  // const fetchMessages = async () => {
  //   //fetching messages from Firestore
  //   const messageDocuments = await getDocs(
  //     collection(db, "Messages"),
  //     orderBy("createdAt")
  //   ); //pulling from firestore
  //   let newMessages = []; //create empty area
  //   messageDocuments.forEach((docObject) => {
  //     //iterating over each object/document in collection
  //     newMessages.push({
  //       id: docObject.id,
  //       user: {
  //         userID: docObject.userID,
  //         name: docObject.name,
  //         ...docObject.data(),
  //       },
  //       createdAt: new Date(docObject.data().createdAt.toMillis()),
  //       ...docObject.data(),
  //     });
  //   });

  //   setMessages(newMessages);
  // };

  // const addMessages = async (newMessage) => {
  //   const newMessageRef = await addDoc(messages(db, "Messages"), newMessage);
  //   if (newMessageRef.id) {
  //     setMessages([newMessage, ...messages]);
  //     Alert.alert("new message has been added");
  //     console.log("Message:", newMessageRef.id);
  //   } else {
  //     Alert.alert("unable to add message");
  //   }
  // };

  const onSend = (newMessages) => {
    addDoc(collection(db, "Messages"), newMessages[0]);
    console.log("message sent");
  };


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
