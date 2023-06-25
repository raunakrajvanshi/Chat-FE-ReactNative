import Toast from 'react-native-toast-message';


export const showToast = (type, message) => {
  Toast.show({
    type: type, // 'success' or 'error'
    text1: type === 'success' ? 'Success' : 'Error',
    text2: message,
    position: 'bottom',
    visibilityTime: 2000,
    autoHide: true,
    topOffset: 30,
    
  });
};