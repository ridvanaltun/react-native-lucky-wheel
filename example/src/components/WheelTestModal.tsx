import type { ComponentProps, ReactElement, RefObject } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import {
  GestureHandlerRootView,
  Pressable as GHPressable,
} from 'react-native-gesture-handler';
import LuckyWheel from 'react-native-lucky-wheel';
import type { LuckyWheelHandle } from 'react-native-lucky-wheel';
import { BORDER, CARD_BG, MUTED, PURPLE, TEXT } from '../constants/theme';
import type { ISlice } from 'react-native-lucky-wheel';

const GestureHandlerRootViewWithChildren =
  GestureHandlerRootView as unknown as (
    props: ComponentProps<typeof View>
  ) => ReactElement | null;

type Props = {
  visible: boolean;
  onClose: () => void;
  wheelRef: RefObject<LuckyWheelHandle | null>;
  slices: ISlice[];
  wheelSource?: number;
  onSpinningStart: () => void;
  onSpinningEnd: (slice: ISlice) => void;
  winnerIndex: number | undefined;
  waitWinner: boolean;
  modalWinnerSlice: unknown;
  modalIsSpinning: boolean;
  onModalWheelReset: () => void;
};

export default function WheelTestModal({
  visible,
  onClose,
  wheelRef,
  slices,
  wheelSource,
  onSpinningStart,
  onSpinningEnd,
  winnerIndex,
  waitWinner,
  modalWinnerSlice,
  modalIsSpinning,
  onModalWheelReset,
}: Props) {
  const statusText = modalWinnerSlice
    ? String(
        (modalWinnerSlice as { text?: unknown; value?: unknown }).text ??
          (modalWinnerSlice as { value?: unknown }).value ??
          'Winner!'
      )
    : null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <GestureHandlerRootViewWithChildren style={styles.gestureRoot}>
        <View style={styles.modalBackdrop}>
          <GHPressable
            style={[StyleSheet.absoluteFillObject, styles.backdropDismiss]}
            onPress={onClose}
          />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Wheel in modal</Text>
              <TouchableOpacity
                onPress={onClose}
                style={styles.modalCloseBtn}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCloseBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalWheelWrap}>
              <LuckyWheel
                ref={wheelRef}
                slices={slices}
                onSpinningStart={onSpinningStart}
                onSpinningEnd={onSpinningEnd}
                size={260}
                source={wheelSource}
                enableGesture
                minimumSpinVelocity={0.6}
                winnerIndex={winnerIndex}
                waitWinner={waitWinner}
              />
            </View>

            {statusText != null ? (
              <Text style={styles.modalWinnerText} numberOfLines={2}>
                {statusText}
              </Text>
            ) : (
              <Text style={styles.modalStatusText}>
                {modalIsSpinning ? 'Spinning...' : 'Swipe or use controls'}
              </Text>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.btn,
                  styles.btnPrimary,
                  modalIsSpinning && styles.btnDisabled,
                ]}
                onPress={() => wheelRef.current?.start()}
                disabled={modalIsSpinning}
                activeOpacity={0.8}
              >
                <Text style={styles.btnText}>▶ Spin</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.btn,
                  styles.btnWarning,
                  !modalIsSpinning && styles.btnDisabled,
                ]}
                onPress={() => wheelRef.current?.stop()}
                disabled={!modalIsSpinning}
                activeOpacity={0.8}
              >
                <Text style={styles.btnText}>■ Stop</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnDanger]}
                onPress={onModalWheelReset}
                activeOpacity={0.8}
              >
                <Text style={styles.btnText}>↺ Reset</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalHint}>
              Same slice mode and "Force winner" as the main screen. Tap outside
              to close.
            </Text>
          </View>
        </View>
      </GestureHandlerRootViewWithChildren>
    </Modal>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  backdropDismiss: {
    zIndex: 0,
    elevation: 0,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalSheet: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 20,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    zIndex: 10,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '700',
  },
  modalCloseBtn: {
    padding: 8,
  },
  modalCloseBtnText: {
    color: MUTED,
    fontSize: 20,
    fontWeight: '600',
  },
  modalWheelWrap: {
    alignItems: 'center',
    marginVertical: 12,
  },
  modalWinnerText: {
    color: '#4ade80',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalStatusText: {
    color: MUTED,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  modalHint: {
    color: MUTED,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 16,
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
});
