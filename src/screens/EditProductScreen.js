import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { updateProduct } from '../utils/database';
import { useProducts } from '../context/ProductContext';
import { theme } from '../theme';

export const EditProductScreen = ({ navigation, route }) => {
  const { product } = route.params;
  const { refreshProducts } = useProducts();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(product.image || null);
  const [formData, setFormData] = useState({
    title: product.title || '',
    author: product.author || '',
    price: product.price?.toString() || '',
    category: product.category || '',
    isbn: product.isbn || '',
    description: product.description || '',
    stock: product.stock?.toString() || '',
    image: product.image || '',
    rating: product.rating?.toString() || '',
    pages: product.pages?.toString() || '',
    language: product.language || '',
    publisher: product.publisher || '',
    publication_date: product.publication_date || '',
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to select images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setFormData((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setFormData((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: pickImage,
        },
        {
          text: 'Enter URL',
          onPress: () => {
            setSelectedImage(null);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Product title is required');
      return false;
    }
    if (!formData.author.trim()) {
      Alert.alert('Error', 'Author name is required');
      return false;
    }
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return false;
    }
    if (!formData.category.trim()) {
      Alert.alert('Error', 'Category is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const productData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        price: parseFloat(formData.price),
        category: formData.category.trim(),
        isbn: formData.isbn.trim() || null,
        description: formData.description.trim() || null,
        stock: formData.stock ? parseInt(formData.stock) : 0,
        image: formData.image.trim() || null,
        rating: formData.rating ? parseFloat(formData.rating) : 0,
        pages: formData.pages ? parseInt(formData.pages) : null,
        language: formData.language.trim() || null,
        publisher: formData.publisher.trim() || null,
        publication_date: formData.publication_date.trim() || null,
      };

      await updateProduct(product.id, productData);
      await refreshProducts();
      
      Alert.alert('Success', 'Product updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update product. Please try again.');
      console.error('Update product error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter product title"
                value={formData.title}
                onChangeText={(value) => handleInputChange('title', value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Author *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter author name"
                value={formData.author}
                onChangeText={(value) => handleInputChange('author', value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price *</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={formData.price}
                onChangeText={(value) => handleInputChange('price', value)}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Fiction, Science Fiction, Classic"
                value={formData.category}
                onChangeText={(value) => handleInputChange('category', value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Stock</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={formData.stock}
                onChangeText={(value) => handleInputChange('stock', value)}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter product description"
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                multiline
                numberOfLines={4}
              />
            </View>

            <Text style={styles.sectionTitle}>Additional Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Product Image</Text>
              {selectedImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.changeImageButton}
                    onPress={showImageOptions}
                  >
                    <Text style={styles.changeImageButtonText}>Change Image</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.selectImageButton} onPress={showImageOptions}>
                  <Text style={styles.selectImageIcon}>📷</Text>
                  <Text style={styles.selectImageText}>Select Image</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Or Enter Image URL</Text>
              <TextInput
                style={styles.input}
                placeholder="https://example.com/image.jpg"
                value={selectedImage && !selectedImage.startsWith('http') ? '' : formData.image}
                onChangeText={(value) => {
                  handleInputChange('image', value);
                  if (value) setSelectedImage(value);
                }}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>ISBN</Text>
              <TextInput
                style={styles.input}
                placeholder="978-0-123456-78-9"
                value={formData.isbn}
                onChangeText={(value) => handleInputChange('isbn', value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rating</Text>
              <TextInput
                style={styles.input}
                placeholder="0.0 - 5.0"
                value={formData.rating}
                onChangeText={(value) => handleInputChange('rating', value)}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pages</Text>
              <TextInput
                style={styles.input}
                placeholder="Number of pages"
                value={formData.pages}
                onChangeText={(value) => handleInputChange('pages', value)}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Language</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., English"
                value={formData.language}
                onChangeText={(value) => handleInputChange('language', value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Publisher</Text>
              <TextInput
                style={styles.input}
                placeholder="Publisher name"
                value={formData.publisher}
                onChangeText={(value) => handleInputChange('publisher', value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Publication Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={formData.publication_date}
                onChangeText={(value) => handleInputChange('publication_date', value)}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Update Product</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 16,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  selectImageButton: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectImageIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  selectImageText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  changeImageButton: {
    marginTop: 12,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  changeImageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
