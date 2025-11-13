import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Button } from 'react-native-paper';

export default function ProjectDetailScreen({ navigation, route }: any) {
  const { projectId } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Project Details</Title>
          <Text>Project ID: {projectId}</Text>
          <Text>This is a placeholder for project details.</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('FieldDataEntry', { projectId })}
            style={styles.button}
          >
            Add Field Data
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  button: {
    marginTop: 16,
  },
});
