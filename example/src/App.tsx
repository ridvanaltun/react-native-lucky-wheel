import { useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import LuckyWheel from 'react-native-lucky-wheel';
import type { LuckyWheelHandle } from 'react-native-lucky-wheel';
import {
  DemoHeader,
  WinnerBanner,
  DemoControlsCard,
  WheelTestModal,
} from './components';
import { DARK_BG } from './constants/theme';
import {
  IMAGE_SLICES,
  SVG_SLICES,
  WHEEL_IMAGE,
} from './constants/demoWheelData';
import {
  IMAGE_WINNER_OPTIONS,
  SVG_WINNER_OPTIONS,
} from './constants/winnerChipOptions';

function App() {
  const wheelRef = useRef<LuckyWheelHandle>(null);
  const modalWheelRef = useRef<LuckyWheelHandle>(null);

  const [winnerSlice, setWinnerSlice] = useState<unknown>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isImageMode, setIsImageMode] = useState(false);
  const [isEndlessSpinning, setIsEndlessSpinning] = useState(true);
  const [winnerIndex, setWinnerIndex] = useState<number | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalWinnerSlice, setModalWinnerSlice] = useState<unknown>(null);
  const [modalIsSpinning, setModalIsSpinning] = useState(false);

  const slices = useMemo(
    () => (isImageMode ? IMAGE_SLICES : SVG_SLICES),
    [isImageMode]
  );
  const wheelSource = isImageMode ? WHEEL_IMAGE : undefined;
  const winnerOptions = isImageMode ? IMAGE_WINNER_OPTIONS : SVG_WINNER_OPTIONS;

  const handleSpinStart = useCallback(() => {
    setWinnerSlice(null);
    setIsSpinning(true);
  }, []);

  const handleSpinEnd = useCallback((slice: unknown) => {
    setWinnerSlice(slice);
    setIsSpinning(false);
  }, []);

  const handleReset = useCallback(() => {
    wheelRef.current?.reset();
    setWinnerSlice(null);
    setIsSpinning(false);
  }, []);

  const handleModeSwitch = useCallback(() => {
    setIsImageMode((prev) => !prev);
    setWinnerIndex(undefined);
    wheelRef.current?.reset();
    setWinnerSlice(null);
    setIsSpinning(false);
    modalWheelRef.current?.reset();
    setModalWinnerSlice(null);
    setModalIsSpinning(false);
  }, []);

  const handleModalSpinStart = useCallback(() => {
    setModalWinnerSlice(null);
    setModalIsSpinning(true);
  }, []);

  const handleModalSpinEnd = useCallback((slice: unknown) => {
    setModalWinnerSlice(slice);
    setModalIsSpinning(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    modalWheelRef.current?.reset();
    setModalWinnerSlice(null);
    setModalIsSpinning(false);
    setModalVisible(false);
  }, []);

  const handleModalWheelReset = useCallback(() => {
    modalWheelRef.current?.reset();
    setModalWinnerSlice(null);
    setModalIsSpinning(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={DARK_BG} barStyle="light-content" />

      <DemoHeader isImageMode={isImageMode} onModeSwitch={handleModeSwitch} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.wheelContainer}>
          <LuckyWheel
            ref={wheelRef}
            slices={slices}
            onSpinningStart={handleSpinStart}
            onSpinningEnd={handleSpinEnd}
            size={300}
            source={wheelSource}
            enableGesture
            minimumSpinVelocity={0.6}
            winnerIndex={winnerIndex}
            waitWinner={isEndlessSpinning}
          />
        </View>

        <WinnerBanner winnerSlice={winnerSlice} isSpinning={isSpinning} />

        <DemoControlsCard
          isSpinning={isSpinning}
          onStart={() => wheelRef.current?.start()}
          onStop={() => wheelRef.current?.stop()}
          onReset={handleReset}
          isEndlessSpinning={isEndlessSpinning}
          onToggleEndless={() => setIsEndlessSpinning((prev) => !prev)}
          winnerOptions={winnerOptions}
          winnerIndex={winnerIndex}
          onWinnerIndex={setWinnerIndex}
          onOpenModal={() => setModalVisible(true)}
        />
      </ScrollView>

      <WheelTestModal
        visible={modalVisible}
        onClose={handleCloseModal}
        wheelRef={modalWheelRef}
        slices={slices}
        wheelSource={wheelSource}
        onSpinningStart={handleModalSpinStart}
        onSpinningEnd={handleModalSpinEnd}
        winnerIndex={winnerIndex}
        waitWinner={isEndlessSpinning}
        modalWinnerSlice={modalWinnerSlice}
        modalIsSpinning={modalIsSpinning}
        onModalWheelReset={handleModalWheelReset}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  scrollContent: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  wheelContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
});

export default App;
