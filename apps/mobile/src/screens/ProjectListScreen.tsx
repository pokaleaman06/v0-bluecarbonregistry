import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, List, Button } from 'react-native-paper';

export default function ProjectListScreen({ navigation }: any) {
  const projects = [
    {
      id: '1',
      name: 'Mangrove Restoration - Site A',
      location: 'Maharashtra Coast',
      status: 'Active',
      area: '5.2 hectares',
    },
    {
      id: '2',
      name: 'Seagrass Restoration - Site B',
      location: 'Gujarat Coast',
      status: 'Active',
      area: '3.8 hectares',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {projects.map((project) => (
        <Card key={project.id} style={styles.card}>
          <Card.Content>
            <Title>{project.name}</Title>
            <Text>Location: {project.location}</Text>
            <Text>Area: {project.area}</Text>
            <Text>Status: {project.status}</Text>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('ProjectDetail', { projectId: project.id })}
              style={styles.button}
            >
              View Details
            </Button>
          </Card.Content>
        </Card>
      ))}
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
    marginTop: 12,
  },
});
