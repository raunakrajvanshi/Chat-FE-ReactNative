import React, {useState} from 'react';
import {View, StyleSheet, Text, Alert} from 'react-native';
import {
  TextInput,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {THEME_COLOR} from '../../Constants/theme';
import axios from 'axios';
import {showToast} from '../../Utils/toastUtils';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../../Constants/url';

const SignupScreen = () => {
  const navigation = useNavigation(); 

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setPasswordMatchError(true);
    } else {
      setPasswordMatchError(false);
      try {
        const response = await axios.post(
            `${BASE_URL}/user/register`,
          {
            email,
            password,
            name: username,
          },
        );
        const {status, data} = response;
        if (status === 200) {
          showToast('success', data.message);
          navigation.navigate('Login');
        } 
      } catch (error) {
        showToast('error', error?.response?.data?.message || 'Failed');
      }
    }
  };

  const validator = () => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    return (
      !email ||
      !password ||
      !confirmPassword ||
      !username ||
      !emailRegex.test(email)
    );
  };

  return (
    <PaperProvider theme={DefaultTheme}>
      <Toast />
      <View style={styles.container}>
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          theme={{
            colors: {
              primary: THEME_COLOR,
            },
          }}
          mode="outlined"
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          theme={{
            colors: {
              primary: THEME_COLOR,
            },
          }}
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


        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
          error={passwordMatchError}
          mode="outlined"
        />

        <Button
          mode="contained"
          onPress={handleSignup}
          style={styles.button}
          disabled={validator()}
          theme={{
            colors: {
              primary: THEME_COLOR,
            },
          }}>
          Sign Up
        </Button>
        {passwordMatchError && (
          <Text style={styles.errorText}>Passwords do not match.</Text>
        )}

        <Text
          style={styles.loginText}
          onPress={() => navigation.navigate('Login')}>
          Already a user? Login
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
  loginText: {
    alignSelf: 'flex-end',
    color: THEME_COLOR,
    marginTop: 8,
  },
});

export default SignupScreen;
