import React, {useState, useEffect, useRef} from 'react';
import {KeyboardAvoidingView, Platform, SafeAreaView} from 'react-native';
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/FontAwesome';
import {BASE_URL} from '../../Constants/url';
import {getJWT} from '../../Utils/common';
import axios from 'axios';
import {showToast} from '../../Utils/toastUtils';
import Toast from 'react-native-toast-message';
import io from 'socket.io-client';

Icon.loadFont();

const Conversation = ({route}) => {
  const {senderData, receiverData, chatroomId} = route.params;
  const {_id: senderId} = senderData;
  const {_id: receiverId} = receiverData;
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  const senderAvatar = () => (
    <Icon name="user-circle-o" size={40} color="#888" />
  );
  const receiverAvatar = () => (
    <Icon name="user-circle-o" size={40} color="#888" />
  );

  const initSocket = async () => {
    const token = await getJWT();
    socketRef.current = io(BASE_URL, {
      query: {token: token.replace('Bearer ', '')},
    });

    socketRef.current.on('connect', async () => {
      socketRef.current.emit('joinRoom', {
        chatroomId,
      });
      try {
        const response = await axios.get(
          `${BASE_URL}/chatroom/messages/${chatroomId}`,
          {headers: {Authorization: token}},
        );
        const messages = response.data.map(formatMessage);
        setMessages(messages);
      } catch (error) {
        console.log(error);
      }
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from socket');
    });

    socketRef.current.on('newMessage', newMessage => {
      const formattedMessage = formatMessage(newMessage);
      setMessages(prevMessages =>
        GiftedChat.append(prevMessages, formattedMessage),
      );
    });
  };

  const formatMessage = message => {
    const isSender = message.user === senderId;
    const user = isSender ? senderData : receiverData;
  
    return {
      _id: message._id,
      text: message.message,
      user: {
        _id: user._id,
        name: user.name,
        avatar: isSender ? senderAvatar() : receiverAvatar(),
      },
    };
  };
  useEffect(() => {
    initSocket();
    setMessages([]);

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leaveRoom', {
          chatroomId,
        });
        socketRef.current.disconnect();
      }
    };
  }, []);

  const onSend = (newMessages = []) => {
    const [message] = newMessages;
    socketRef.current.emit('chatroomMessage', {
      chatroomId,
      message: message.text,
    });
  };

  const bubbleStyle = {
    left: {
      backgroundColor: '#ffcccc',
    },
    right: {
      backgroundColor: '#7bed9f',
    },
  };

  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: bubbleStyle.left,
          right: bubbleStyle.right,
        }}
        textStyle={{
          left: {color: '#000'},
          right: {color: '#000'},
        }}
      />
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Toast />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: senderId,
            name: senderData.name,
            avatar: senderAvatar(),
          }}
          placeholder="Type a message..."
          renderBubble={renderBubble}
          timeTextStyle={{left: {color: '#888'}, right: {color: '#888'}}}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Conversation;
