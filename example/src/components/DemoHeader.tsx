import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BORDER, CARD_BG, MUTED, PURPLE, TEXT } from '../constants/theme';

type Props = {
  isImageMode: boolean;
  onModeSwitch: () => void;
};

export default function DemoHeader({ isImageMode, onModeSwitch }: Props) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Lucky Wheel</Text>
      <TouchableOpacity
        style={[styles.modeToggle, isImageMode && styles.modeToggleActive]}
        onPress={onModeSwitch}
        activeOpacity={0.75}
      >
        <Text
          style={[
            styles.modeToggleText,
            isImageMode && styles.modeToggleTextActive,
          ]}
        >
          {isImageMode ? 'Image' : 'SVG'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: TEXT,
    letterSpacing: 0.5,
  },
  modeToggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD_BG,
  },
  modeToggleActive: {
    borderColor: PURPLE,
    backgroundColor: '#8b5cf615',
  },
  modeToggleText: {
    color: MUTED,
    fontWeight: '700',
    fontSize: 13,
  },
  modeToggleTextActive: {
    color: PURPLE,
  },
});
