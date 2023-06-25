import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  TextInput,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
} from 'react-native-paper';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {THEME_COLOR} from '../../Constants/theme';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showToast} from '../../Utils/toastUtils';
import Toast from 'react-native-toast-message';
import {BASE_URL} from '../../Constants/url';

const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigateToHome = () => {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });

    navigation.dispatch(resetAction);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/user/login`, {
        email,
        password,
      });

      const {status, data} = response;
      if (status === 200) {
        const {token} = data;
        showToast('success', data.message);
        await AsyncStorage.setItem('token', `Bearer ${token}`);
        navigateToHome();
      }
    } catch (error) {
      console.log(error);
      showToast('error', error?.response?.data?.message || 'Failed');
    }
  };

  const validator = () => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    return !email || !password || !emailRegex.test(email);
  };

  return (
    <PaperProvider theme={DefaultTheme}>
      <Toast />
      <View style={styles.container}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          disabled={validator()}
          theme={{
            colors: {
              primary: THEME_COLOR,
            },
          }}>
          Login
        </Button>

        <Text
          style={styles.registerText}
          onPress={() => navigation.navigate('Signup')}>
          Not a user yet? Register here
        </Text>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: '20%',
  },
  input: {
    marginBottom: 16,
    borderRadius: 6,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    borderRadius: 6,
  },
  registerText: {
    alignSelf: 'flex-end',
    color: THEME_COLOR,
    marginTop: 8,
  },
});

export default LoginScreen;
