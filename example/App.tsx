// @ts-nocheck

import React, { useRef, useState } from 'react';
import {
  View,
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';

import LuckyWheel, {
  GestureTypes,
  LuckyWheelHandle,
} from 'react-native-lucky-wheel';

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
        winnerIndex={winnerIndex}
        onSpinningEnd={(winner) => {
          console.log('winner ->', winner);
        }}
        size={300}
        innerRadius={0}
        outerRadius={300 / 2 - 13}
        textStyle={styles.text}
        knobSize={30}
        knobColor="#000"
        padAngle={0}
        dotColor="#FFF"
        backgroundColor="#F00"
        source={isImageMode ? require('./assets/wheel.png') : null}
        enableGesture
        minimumSpinVelocity={1} // 0.0 - 1.0
        gestureType={GestureTypes.CLOCKWISE}
        waitWinner={isEndlessSpinningOn}
      />
      <View style={styles.buttons}>
        <Button
          onPress={() => {
            setIsImageMode(!isImageMode);
          }}
          title="Toggle Mode"
        />
        <View style={styles.separator} />
        <Button
          onPress={() => {
            wheelRef?.current?.start();
          }}
          title="Start"
        />
        <View style={styles.separator} />
        <Button
          onPress={() => {
            wheelRef?.current?.stop();
          }}
          title="Stop"
        />
        <View style={styles.separator} />
        <Button
          onPress={() => {
            wheelRef?.current?.reset();
          }}
          title="Reset"
        />
        <View style={styles.separator} />
        <Button
          onPress={() => {
            setWinnerIndex(1);
          }}
          title="Set Winner 1"
        />
        <View style={styles.separator} />
        <Button
          onPress={() => {
            setWinnerIndex(undefined);
          }}
          title="Remove Winner"
        />
        <View style={styles.separator} />
        <Button
          onPress={() => {
            setIsEndlessSpinningOn(!isEndlessSpinningOn);
          }}
          title="Toggle Endless Spinning"
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
  separator: {
    margin: 10,
    marginTop: 60,
  },
  text: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default App;
