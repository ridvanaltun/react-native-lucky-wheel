import { StyleSheet } from 'react-native';

export const luckyWheelStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  wheel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderColor: '#000',
    borderWidth: 15,
    opacity: 0.3,
  },
  knob: {
    justifyContent: 'flex-end',
    zIndex: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
