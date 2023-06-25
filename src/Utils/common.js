import AsyncStorage from '@react-native-async-storage/async-storage';
const md5 = require('md5');

export const checkAuthentication = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return !!token;
    } catch (error) {
      return false;
    }
  };

  export const getJWT = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
    } catch (error) {
      return false;
    }
  };

  export const removeTokenAndNavigateToLogin = async (navigation) => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };

  export const  generateRoomCode=(email1, email2) =>{
    const sortedEmails = [email1, email2].sort();
    const concatenatedEmails = sortedEmails.join('');
    const uniqueCode = md5(concatenatedEmails).substring(0, 6).toUpperCase();
    return uniqueCode;
  }