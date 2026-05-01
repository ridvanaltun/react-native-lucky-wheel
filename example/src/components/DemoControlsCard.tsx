import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  BORDER,
  CARD_BG,
  DARK_BG,
  MUTED,
  PURPLE,
  TEXT,
} from '../constants/theme';

type WinnerChipOption = { label: string; value: number | undefined };

type Props = {
  isSpinning: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  isEndlessSpinning: boolean;
  onToggleEndless: () => void;
  winnerOptions: WinnerChipOption[];
  winnerIndex: number | undefined;
  onWinnerIndex: (value: number | undefined) => void;
  onOpenModal: () => void;
};

export default function DemoControlsCard({
  isSpinning,
  onStart,
  onStop,
  onReset,
  isEndlessSpinning,
  onToggleEndless,
  winnerOptions,
  winnerIndex,
  onWinnerIndex,
  onOpenModal,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>Controls</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.btn,
            styles.btnPrimary,
            isSpinning && styles.btnDisabled,
          ]}
          onPress={onStart}
          disabled={isSpinning}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>▶ Spin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.btn,
            styles.btnWarning,
            !isSpinning && styles.btnDisabled,
          ]}
          onPress={onStop}
          disabled={!isSpinning}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>■ Stop</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnDanger]}
          onPress={onReset}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>↺ Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionLabel}>Options</Text>
      <TouchableOpacity
        style={styles.toggleRow}
        onPress={onToggleEndless}
        activeOpacity={0.7}
      >
        <View style={styles.toggleInfo}>
          <Text style={styles.toggleTitle}>Endless Spinning</Text>
          <Text style={styles.toggleSubtitle}>
            Keeps spinning until a winner is set
          </Text>
        </View>
        <View style={[styles.toggle, isEndlessSpinning && styles.toggleOn]}>
          <View
            style={[
              styles.toggleThumb,
              isEndlessSpinning && styles.toggleThumbOn,
            ]}
          />
        </View>
      </TouchableOpacity>

      <View style={styles.divider} />

      <Text style={styles.sectionLabel}>Force Winner (slice index)</Text>
      <View style={styles.chipRow}>
        {winnerOptions.map((opt) => (
          <TouchableOpacity
            key={String(opt.value ?? 'none')}
            style={[
              styles.chip,
              winnerIndex === opt.value && styles.chipActive,
            ]}
            onPress={() => onWinnerIndex(opt.value)}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.chipText,
                winnerIndex === opt.value && styles.chipTextActive,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionLabel}>Modal</Text>
      <TouchableOpacity
        style={styles.modalOpenBtn}
        onPress={onOpenModal}
        activeOpacity={0.8}
      >
        <Text style={styles.modalOpenBtnText}>Open wheel in modal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 20,
    width: '90%',
    gap: 12,
  },
  sectionLabel: {
    color: MUTED,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: PURPLE,
  },
  btnWarning: {
    backgroundColor: '#d97706',
  },
  btnDanger: {
    backgroundColor: '#dc2626',
  },
  btnDisabled: {
    opacity: 0.3,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  toggleTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '600',
  },
  toggleSubtitle: {
    color: MUTED,
    fontSize: 12,
    marginTop: 3,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: BORDER,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleOn: {
    backgroundColor: PURPLE,
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
    alignSelf: 'flex-start',
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: DARK_BG,
  },
  chipActive: {
    borderColor: PURPLE,
    backgroundColor: '#8b5cf615',
  },
  chipText: {
    color: MUTED,
    fontWeight: '600',
    fontSize: 13,
  },
  chipTextActive: {
    color: PURPLE,
  },
  modalOpenBtn: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalOpenBtnText: {
    color: TEXT,
    fontWeight: '700',
    fontSize: 15,
  },
});
