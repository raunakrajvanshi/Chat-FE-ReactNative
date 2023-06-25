import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Provider as PaperProvider,
  ActivityIndicator,
  Appbar,
} from 'react-native-paper';
import axios from 'axios';
import { THEME_COLOR } from '../../Constants/theme';
import {
  generateRoomCode,
  getJWT,
  removeTokenAndNavigateToLogin,
} from '../../Utils/common';
import UserCard from '../../Components/UserCard';
import { useNavigation } from '@react-navigation/native';
import { showToast } from '../../Utils/toastUtils';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../../Constants/url';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    init();
    navigation.setOptions({
      headerRight: () => (
        <Appbar.Action icon="logout" onPress={handleLogout} />
      ),
    });
  }, []);

  const init = async () => {
    try {
      const headers = {
        Authorization: await getJWT(),
      };

      const userResponse = await axios.get(`${BASE_URL}/user/getUser`, {
        headers,
      });

      if (userResponse.status === 200) {
        setUserDetails(userResponse?.data);
        const response = await axios.get(`${BASE_URL}/user/getAvailableUsers`, {
          headers,
        });
        setUserList(response.data);
      }
    } catch (error) {
      const { response } = error;
      if (response.status === 401) {
        removeTokenAndNavigateToLogin(navigation);
      } else {
        showToast('error', 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const createViewChatroom = async (receiverData) => {
    try {
      const headers = {
        Authorization: await getJWT(),
      };

      let response = await axios.post(
        `${BASE_URL}/chatroom`,
        {
          name: generateRoomCode(userDetails.email, receiverData?.email),
        },
        {
          headers,
        },
      );
      
      let data = response?.data?.data;
      if (data) {
        navigation.navigate('Conversation', {
          senderData: userDetails,
          receiverData,
          chatroomId: data?._id,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openConversation = (receiverData) => {
    createViewChatroom(receiverData);
  };

  const handleLogout = async () => {
    await removeTokenAndNavigateToLogin(navigation);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Toast />
        <ActivityIndicator size="large" color={THEME_COLOR} />
      </View>
    );
  }

  const renderUserList = () => {
    return userList.map((user) => (
      <UserCard
        key={user._id}
        name={user.name}
        email={user.email}
        onPress={() => openConversation(user)}
      />
    ));
  };

  return (
    <PaperProvider>
      <Toast />
      <View style={styles.container}>{renderUserList()}</View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  card: {
    marginBottom: 16,
  },
  button: {
    borderRadius: 6,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
