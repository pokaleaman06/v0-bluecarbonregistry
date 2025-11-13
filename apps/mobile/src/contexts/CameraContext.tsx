import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { PhotoPoint } from '@bluecarbon/shared';

interface CameraContextType {
  photos: PhotoPoint[];
  addPhoto: (photo: PhotoPoint) => void;
  removePhoto: (photoId: string) => void;
  clearPhotos: () => void;
  takePhoto: () => Promise<PhotoPoint | null>;
  pickFromGallery: () => Promise<PhotoPoint | null>;
  isLoading: boolean;
  error: string | null;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

interface CameraProviderProps {
  children: ReactNode;
}

export function CameraProvider({ children }: CameraProviderProps) {
  const [photos, setPhotos] = useState<PhotoPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPhoto = (photo: PhotoPoint) => {
    setPhotos(prev => [...prev, photo]);
  };

  const removePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const clearPhotos = () => {
    setPhotos([]);
  };

  const takePhoto = async (): Promise<PhotoPoint | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        setError('Camera permission denied');
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        exif: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const photo: PhotoPoint = {
          id: Date.now().toString(),
          url: asset.uri,
          coordinates: {
            latitude: asset.exif?.GPSLatitude || 0,
            longitude: asset.exif?.GPSLongitude || 0,
          },
          timestamp: new Date(),
          metadata: {
            exif: asset.exif || {},
            accuracy: asset.exif?.GPSHPositioningError || 0,
            bearing: asset.exif?.GPSImgDirection || 0,
          },
        };

        return photo;
      }

      return null;
    } catch (error) {
      setError('Error taking photo');
      console.error('Error taking photo:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const pickFromGallery = async (): Promise<PhotoPoint | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setError('Media library permission denied');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        exif: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const photo: PhotoPoint = {
          id: Date.now().toString(),
          url: asset.uri,
          coordinates: {
            latitude: asset.exif?.GPSLatitude || 0,
            longitude: asset.exif?.GPSLongitude || 0,
          },
          timestamp: new Date(),
          metadata: {
            exif: asset.exif || {},
            accuracy: asset.exif?.GPSHPositioningError || 0,
            bearing: asset.exif?.GPSImgDirection || 0,
          },
        };

        return photo;
      }

      return null;
    } catch (error) {
      setError('Error picking photo from gallery');
      console.error('Error picking photo from gallery:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const value: CameraContextType = {
    photos,
    addPhoto,
    removePhoto,
    clearPhotos,
    takePhoto,
    pickFromGallery,
    isLoading,
    error,
  };

  return (
    <CameraContext.Provider value={value}>
      {children}
    </CameraContext.Provider>
  );
}

export function useCamera() {
  const context = useContext(CameraContext);
  if (context === undefined) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
}
