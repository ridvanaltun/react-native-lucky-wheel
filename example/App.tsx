// @ts-nocheck

import React, { useRef, useState } from 'react';
import { View, SafeAreaView, StatusBar, StyleSheet } from 'react-native';

import LuckyWheel, { LuckyWheelHandle } from 'react-native-lucky-wheel';

import Button from './Button';

const App = () => {
  const wheelRef = useRef<LuckyWheelHandle>(null);

  const [winnerIndex, setWinnerIndex] = useState<number | undefined>(undefined);
  const [isImageMode, setIsImageMode] = useState(false);
  const [isEndlessSpinningOn, setIsEndlessSpinningOn] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <LuckyWheel
        ref={wheelRef}
        slices={
          isImageMode
            ? require('./data/slices-for-image.json')
            : require('./data/slices-for-svg.json')
        }
        onSpinningStart={() => {
          console.log('onSpinningStart');
        }}
        onSpinningEnd={(_winner) => {
          console.log('onSpinningEnd');
        }}
        size={300}
        source={isImageMode ? require('./assets/wheel.png') : null}
        enableGesture
        minimumSpinVelocity={0.6} // 0.0 - 1.0
        winnerIndex={winnerIndex}
        waitWinner={isEndlessSpinningOn}
      />
      <View style={styles.buttons}>
        <Button
          onPress={() => {
            setIsImageMode(!isImageMode);
          }}
          title={isImageMode ? 'Switch SVG Mode' : 'Switch Image Mode'}
        />
        <Button
          onPress={() => {
            wheelRef?.current?.start();
          }}
          title="Start"
        />
        <Button
          onPress={() => {
            wheelRef?.current?.stop();
          }}
          title="Stop"
        />
        <Button
          onPress={() => {
            wheelRef?.current?.reset();
          }}
          title="Reset"
        />
        <Button
          onPress={() => {
            if (winnerIndex) {
              setWinnerIndex(undefined);
            } else {
              setWinnerIndex(1);
            }
          }}
          title={winnerIndex ? 'Remove Winner' : 'Set Winner 1'}
        />
        <Button
          onPress={() => {
            setIsEndlessSpinningOn(!isEndlessSpinningOn);
          }}
          title={
            isEndlessSpinningOn
              ? 'Deactive Endless Spinning'
              : 'Active Endless Spinning'
          }
          style={{ backgroundColor: isEndlessSpinningOn ? 'red' : 'green' }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  text: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default App;
