import { View, Text, StyleSheet } from 'react-native';
import { MUTED } from '../constants/theme';

type Props = {
  winnerSlice: unknown;
  isSpinning: boolean;
};

function winnerLabel(slice: unknown): string {
  if (!slice || typeof slice !== 'object') return '';
  const s = slice as { text?: unknown; value?: unknown };
  const raw = s.text ?? s.value;
  return raw !== undefined ? String(raw) : 'Winner!';
}

export default function WinnerBanner({ winnerSlice, isSpinning }: Props) {
  if (winnerSlice) {
    return (
      <View style={styles.winnerCard}>
        <Text style={styles.winnerEmoji}>🎉</Text>
        <View style={styles.winnerInfo}>
          <Text style={styles.winnerLabel}>You won!</Text>
          <Text style={styles.winnerValue}>{winnerLabel(winnerSlice)}</Text>
        </View>
        <Text style={styles.winnerEmoji}>🎉</Text>
      </View>
    );
  }

  return (
    <View style={styles.winnerPlaceholder}>
      <Text style={styles.winnerPlaceholderText}>
        {isSpinning ? 'Spinning...' : 'Spin the wheel!'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  winnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#0d2818',
    borderColor: '#22c55e',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginBottom: 16,
    width: '90%',
    justifyContent: 'center',
  },
  winnerEmoji: {
    fontSize: 26,
  },
  winnerInfo: {
    alignItems: 'center',
  },
  winnerLabel: {
    color: '#86efac',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  winnerValue: {
    color: '#4ade80',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 2,
  },
  winnerPlaceholder: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  winnerPlaceholderText: {
    color: MUTED,
    fontSize: 15,
    fontStyle: 'italic',
  },
});
