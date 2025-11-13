import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  List,
  Avatar,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'My Projects',
      description: 'View and manage your projects',
      icon: 'folder',
      onPress: () => navigation.navigate('ProjectList'),
    },
    {
      title: 'Submit Field Data',
      description: 'Record restoration activities',
      icon: 'camera',
      onPress: () => navigation.navigate('FieldDataEntry', { projectId: '1' }),
    },
    {
      title: 'Profile',
      description: 'Manage your account',
      icon: 'account',
      onPress: () => navigation.navigate('Profile'),
    },
  ];

  const recentActivities = [
    {
      id: '1',
      title: 'Mangrove Planting - Site A',
      description: 'Submitted field data for 50 saplings',
      time: '2 hours ago',
      status: 'Pending Review',
    },
    {
      id: '2',
      title: 'Seagrass Restoration - Site B',
      description: 'Verified and approved',
      time: '1 day ago',
      status: 'Approved',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Welcome Section */}
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <View style={styles.welcomeHeader}>
              <Avatar.Text size={48} label={user?.name?.charAt(0) || 'U'} />
              <View style={styles.welcomeText}>
                <Title>Welcome, {user?.name}</Title>
                <Paragraph>{user?.organization}</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Quick Actions</Title>
            {quickActions.map((action, index) => (
              <List.Item
                key={index}
                title={action.title}
                description={action.description}
                left={(props) => <List.Icon {...props} icon={action.icon} />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={action.onPress}
                style={styles.listItem}
              />
            ))}
          </Card.Content>
        </Card>

        {/* Recent Activities */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Recent Activities</Title>
            {recentActivities.map((activity) => (
              <List.Item
                key={activity.id}
                title={activity.title}
                description={activity.description}
                left={(props) => <List.Icon {...props} icon="history" />}
                right={() => (
                  <View style={styles.activityRight}>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                    <Text style={[
                      styles.activityStatus,
                      { color: activity.status === 'Approved' ? '#4CAF50' : '#FF9800' }
                    ]}>
                      {activity.status}
                    </Text>
                  </View>
                )}
                style={styles.listItem}
              />
            ))}
          </Card.Content>
        </Card>

        {/* Stats Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Your Impact</Title>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Projects</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>245</Text>
                <Text style={styles.statLabel}>Data Entries</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1.2k</Text>
                <Text style={styles.statLabel}>kg CO₂</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('FieldDataEntry', { projectId: '1' })}
        label="Add Data"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  welcomeCard: {
    marginBottom: 16,
    elevation: 4,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    marginLeft: 16,
    flex: 1,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  listItem: {
    paddingVertical: 8,
  },
  activityRight: {
    alignItems: 'flex-end',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  activityStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2E7D32',
  },
});
