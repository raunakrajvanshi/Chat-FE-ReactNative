import React from 'react';
import {  StyleSheet } from 'react-native';
import { Card, Avatar, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { THEME_COLOR } from '../Constants/theme';
Icon.loadFont()

const UserCard = ({  name, email, onPress }) => {
  const getRandomAvatar = () => {
    const avatarList = [
      'user',
      'user-circle',
      'user-o',
      'user-secret',
      'user-md',
      'user',
    ];
    const randomIndex = Math.floor(Math.random() * avatarList.length);
    return avatarList[randomIndex];
  };

  return (
    <Card style={styles.card}>
    <Card.Title
      title={name}
      subtitle={email}
      left={(props) => (
        <Avatar.Icon
          {...props}
          icon={({ color, size }) => (
            <Icon name={getRandomAvatar()} size={size} color={color} />
          )}
        />
      )}
      right={(props) => (
        <IconButton
          {...props}
          icon="message"
          onPress={onPress}
          color={THEME_COLOR}
        />
      )}
    />
  </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 6,
  },
 
});

export default UserCard;