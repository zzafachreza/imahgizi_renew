import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Icon } from 'react-native-elements';
import { Color, colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';

export default function MyPickerImage({
  label,
  onImagePicked,
  imageUri,
}) {
  const [selectedImage, setSelectedImage] = useState(imageUri || null);

  const pickImage = () => {
    // Opsi untuk mengatur gambar dari galeri
    const options = {
      mediaType: 'photo',
      quality: 0.7, // Mengatur kualitas gambar agar tidak terlalu besar
      maxWidth: 800, // Batas ukuran lebar gambar
      maxHeight: 800, // Batas ukuran tinggi gambar
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        Alert.alert('Error', 'Error picking the image.');
        console.log('ImagePicker Error: ', response.error);
      } else {
        const imageUri = response.assets[0].uri;
        setSelectedImage(imageUri);
        if (onImagePicked) {
          onImagePicked(imageUri); // Kirim gambar yang dipilih ke parent component
        }
      }
    });
  };

  return (
    <View style={{ marginBottom: 20 }}>
      {label && (
        <Text style={{
          fontFamily: fonts.primary[600],
          color: colors.primary,
          marginBottom: 8,
          fontSize: 15,
        }}>
          {label}
        </Text>
      )}
      
      <TouchableOpacity onPress={pickImage} style={[styles.container, selectedImage && styles.containerWithImage]}>
        <View style={styles.imageContainer}>
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={styles.imageSelected}
            />
          ) : (
            <View style={{
              alignItems:"center",
           
              width:'100%'
            }}>
            <View style={{
            flexDirection:"row",
            justifyContent:"center",
            alignItems:"center",
            padding:0,
            backgroundColor:'#D9D9D9',
            width:"50%",
            height:40, 
            borderRadius:5,
            alignSelf:'center',
            borderWidth:1,
            borderColor:Color.blueGray[400]
           
            

          }}>
          <Icon type="ionicon" name="image-outline" size={25} color={colors.white} />
          <Text style={{
            fontFamily:fonts.primary[500],
            fontSize:15, 
            fontStyle:"italic",
            left:5,
            color:colors.white,
           
          }}>Unggah Foto</Text>
          </View>
            </View>
         
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: colors.border,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
  },
  containerWithImage: {
    height: 120, // Ubah tinggi container menjadi 120 jika gambar sudah dipilih
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    padding:10
  },
  imageSelected: {
    width: 100,
    height: 100, // Gambar menjadi 100x100 setelah dipilih
    borderRadius: 10,
  },
});
