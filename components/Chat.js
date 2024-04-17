import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {
  const { name, color } = route.params; //destructuring name and color from route paramerters
  const [messages, setMessages] = useState([]); //messages as state

  useEffect(() => {
    //hook to set navigation options when component mounts
    navigation.setOptions({ title: name });
  }, []);

  useEffect(() => {
    setMessages([
      {
        _id: 1, //required for gifted
        text: "Hello",
        createdAt: new Date(), //required for gifted
        user: {
          //required for gifted
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 2,
        text: "System Message",
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []);

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
