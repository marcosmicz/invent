import React from 'react';
import { Appbar, useTheme } from 'react-native-paper';

const TopAppBar = ({ title, onMenuPress, actions, ...props }) => {
  const theme = useTheme();
  
  return (
    <Appbar.Header
      {...props}
      style={[
        {
          backgroundColor: theme.colors.surface,
        },
        props.style
      ]}
      theme={{
        colors: {
          surface: theme.colors.surface,
          onSurface: theme.colors.onSurface,
        }
      }}
    >
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