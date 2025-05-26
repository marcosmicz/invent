import React from 'react';
import { Card as PaperCard } from 'react-native-paper';

const Card = ({ children, style, mode = 'elevated', ...props }) => {
  return (
    <PaperCard mode={mode} style={style} {...props}>
      <PaperCard.Content>
        {children}
      </PaperCard.Content>
    </PaperCard>
  );
};

export default Card;