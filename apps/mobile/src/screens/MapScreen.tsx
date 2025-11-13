import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default function MapScreen({ navigation, route }: any) {
  const { onSelect } = route.params;

  const handleSelectLocation = () => {
    // Mock location selection
    const mockLocation = {
      latitude: 19.0760,
      longitude: 72.8777,
    };
    onSelect(mockLocation);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text>Map Screen - Placeholder</Text>
      <Text>Select a location on the map</Text>
      <Button onPress={handleSelectLocation}>Select This Location</Button>
      <Button onPress={() => navigation.goBack()}>Cancel</Button>
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
