import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Snackbar,
  Chip,
  IconButton,
} from 'react-native-paper';
import { useLocation } from '../contexts/LocationContext';
import { useCamera } from '../contexts/CameraContext';
import { useAuth } from '../contexts/AuthContext';
import { Coordinate, Polygon } from '@bluecarbon/shared';

interface FieldDataEntryScreenProps {
  navigation: any;
  route: any;
}

export default function FieldDataEntryScreen({ navigation, route }: FieldDataEntryScreenProps) {
  const { projectId } = route.params;
  const { user } = useAuth();
  const { currentLocation, getCurrentLocation, isLoading: locationLoading } = useLocation();
  const { photos, addPhoto, removePhoto, takePhoto, pickFromGallery, clearPhotos } = useCamera();

  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [carbonEstimate, setCarbonEstimate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentLocation) {
      setCoordinates([currentLocation]);
    }
  }, [currentLocation]);

  const handleAddCurrentLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      setCoordinates(prev => [...prev, location]);
    }
  };

  const handleTakePhoto = async () => {
    const photo = await takePhoto();
    if (photo) {
      addPhoto(photo);
    }
  };

  const handlePickFromGallery = async () => {
    const photo = await pickFromGallery();
    if (photo) {
      addPhoto(photo);
    }
  };

  const handleRemovePhoto = (photoId: string) => {
    removePhoto(photoId);
  };

  const handleAddCoordinate = () => {
    navigation.navigate('Map', {
      onSelect: (coordinate: Coordinate) => {
        setCoordinates(prev => [...prev, coordinate]);
      },
    });
  };

  const handleRemoveCoordinate = (index: number) => {
    setCoordinates(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (coordinates.length === 0) {
      setError('Please add at least one location coordinate');
      return false;
    }
    if (photos.length === 0) {
      setError('Please add at least one photo');
      return false;
    }
    if (!carbonEstimate.trim()) {
      setError('Please enter carbon estimate');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Create polygon from coordinates
      const polygon: Polygon = {
        type: 'Polygon',
        coordinates: [[
          ...coordinates.map(coord => [coord.longitude, coord.latitude]),
          [coordinates[0].longitude, coordinates[0].latitude], // Close the polygon
        ]],
      };

      // Prepare field data
      const fieldData = {
        projectId,
        coordinates: JSON.stringify(polygon),
        photoHash: photos.map(photo => photo.url).join(','), // In real app, upload to IPFS
        carbonEstimate: parseFloat(carbonEstimate),
        notes,
        submittedBy: user?.id,
        submittedAt: new Date().toISOString(),
      };

      // Mock submission - replace with actual blockchain submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Success',
        'Field data submitted successfully! It will be reviewed by verifiers.',
        [
          {
            text: 'OK',
            onPress: () => {
              clearPhotos();
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      setError('Failed to submit field data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Field Data Entry</Title>
          <Paragraph>Record restoration activities and measurements</Paragraph>

          {/* Location Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location Coordinates</Text>
            {coordinates.map((coord, index) => (
              <Chip
                key={index}
                style={styles.coordinateChip}
                onClose={() => handleRemoveCoordinate(index)}
                closeIcon="close"
              >
                {coord.latitude.toFixed(6)}, {coord.longitude.toFixed(6)}
              </Chip>
            ))}
            <View style={styles.buttonRow}>
              <Button
                mode="outlined"
                onPress={handleAddCurrentLocation}
                loading={locationLoading}
                style={styles.button}
              >
                Add Current Location
              </Button>
              <Button
                mode="outlined"
                onPress={handleAddCoordinate}
                style={styles.button}
              >
                Select on Map
              </Button>
            </View>
          </View>

          {/* Photos Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <View style={styles.photoGrid}>
              {photos.map((photo) => (
                <View key={photo.id} style={styles.photoContainer}>
                  <Image source={{ uri: photo.url }} style={styles.photo} />
                  <IconButton
                    icon="close"
                    size={16}
                    style={styles.removePhotoButton}
                    onPress={() => handleRemovePhoto(photo.id)}
                  />
                </View>
              ))}
            </View>
            <View style={styles.buttonRow}>
              <Button
                mode="outlined"
                onPress={handleTakePhoto}
                icon="camera"
                style={styles.button}
              >
                Take Photo
              </Button>
              <Button
                mode="outlined"
                onPress={handlePickFromGallery}
                icon="image"
                style={styles.button}
              >
                From Gallery
              </Button>
            </View>
          </View>

          {/* Carbon Estimate */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Carbon Estimate</Text>
            <TextInput
              label="Estimated CO₂ Sequestration (kg)"
              value={carbonEstimate}
              onChangeText={setCarbonEstimate}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
              placeholder="Enter estimated carbon sequestration"
            />
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <TextInput
              label="Additional Notes"
              value={notes}
              onChangeText={setNotes}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
              placeholder="Add any additional observations or notes"
            />
          </View>

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.submitButton}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Field Data'}
          </Button>
        </Card.Content>
      </Card>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={4000}
      >
        {error}
      </Snackbar>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2E7D32',
  },
  coordinateChip: {
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  photoContainer: {
    position: 'relative',
    margin: 4,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 24,
    paddingVertical: 8,
  },
});
