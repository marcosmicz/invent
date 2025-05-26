import React from 'react';
import { Appbar } from 'react-native-paper';

const TopAppBar = ({ title, onMenuPress, actions, ...props }) => {
  return (
    <Appbar.Header {...props}>
      {onMenuPress && (
        <Appbar.Action 
          icon="menu" 
          onPress={onMenuPress}
        />
      )}
      <Appbar.Content title={title} />
      {actions && actions.map((action, index) => (
        <Appbar.Action
          key={index}
          icon={action.icon}
          onPress={action.onPress}
        />
      ))}
    </Appbar.Header>
  );
};

export default TopAppBar;