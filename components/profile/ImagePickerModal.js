// components/profile/ImagePickerModal.js
import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

/**
 * ImagePickerModal component - Modal for selecting image source (camera or gallery).
 * 
 * @param {Object} props
 * @param {boolean} props.visible - Whether the modal is visible
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Function} props.onCameraPress - Callback when camera option is selected
 * @param {Function} props.onGalleryPress - Callback when gallery option is selected
 * @returns {JSX.Element} The rendered ImagePickerModal component
 */
const ImagePickerModal = React.memo(({ visible, onClose, onCameraPress, onGalleryPress }) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Update Profile Photo</Text>
          
          <TouchableOpacity 
            style={[styles.modalOption, { borderBottomColor: colors.border }]} 
            onPress={onCameraPress}
          >
            <Ionicons name="camera-outline" size={24} color={colors.primary} />
            <Text style={[styles.modalOptionText, { color: colors.text }]}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.modalOption, { borderBottomColor: colors.border }]} 
            onPress={onGalleryPress}
          >
            <Ionicons name="images-outline" size={24} color={colors.primary} />
            <Text style={[styles.modalOptionText, { color: colors.text }]}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={onClose}
          >
            <Text style={[styles.cancelText, { color: colors.primary }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});

ImagePickerModal.displayName = 'ImagePickerModal';

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 16,
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ImagePickerModal;

