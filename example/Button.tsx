import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  TextStyle,
} from 'react-native';

interface IButton extends TouchableOpacityProps {
  title: string;
  textStyle?: TextStyle;
}

const Button = ({ title, ...props }: IButton) => {
  return (
    <TouchableOpacity {...props} style={[styles.button, props.style]}>
      <Text style={[styles.buttonText, props.textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#312',
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default Button;
