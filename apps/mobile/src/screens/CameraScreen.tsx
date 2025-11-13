import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default function CameraScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text>Camera Screen - Placeholder</Text>
      <Button onPress={() => navigation.goBack()}>Go Back</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
