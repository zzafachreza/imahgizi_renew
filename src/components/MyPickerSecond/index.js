import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Picker } from 'react-native';
import { Icon } from 'react-native-elements';
import { Color, colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import kecamatanData from '../../components/Kecamatan/kecamatan.json';

export default function MyPickerSecond({
    label,
    iconname,
    onValueChange,
    value,
    data = [], // Berikan default value sebagai array kosong
    colorIcon = colors.primary,
  }) {
    return (
      <>
        <Text style={{ fontFamily: fonts.primary[600], color: colors.primary, marginBottom: 8, fontSize: 15, left: 10 }}>
          {label}
        </Text>
  
        <View style={styles.pickerContainer}>
          <View style={styles.iconContainer}>
            <Icon type="ionicon" name={iconname} color={Color.blueGray[300]} size={24} />
          </View>
          <Picker
            style={styles.picker}
            selectedValue={value}
            onValueChange={onValueChange}>
            {data.length > 0 ? (
              data.map((item, index) => (
                <Picker.Item
                  key={index}
                  textStyle={styles.pickerItem}
                  value={item.value}
                  label={item.label}
                />
              ))
            ) : (
              <Picker.Item label="Tidak ada data" value="" />
            )}
          </Picker>
          <View style={styles.dropdownIcon}>
            <Icon type="ionicon" name="caret-down-outline" color={Color.blueGray[300]} size={20} />
          </View>
        </View>
      </>
    );
  }
  
  const styles = StyleSheet.create({
    pickerContainer: {
      backgroundColor: '#F6F6F6',
      borderWidth: 1,
      borderRadius: 15,
      borderColor: Color.blueGray[300],
      height: 40,
      justifyContent: 'center',
    },
    iconContainer: {
      position: 'absolute',
      left: 12,
      top: 13,
    },
    picker: {
      width: '90%',
      height: 40,
      left: 30,
      transform: [{ scale: 1 }],
    },
    pickerItem: {
      fontSize: 12,
      fontFamily:fonts.primary[500],
      color: colors.primary,
    },
    dropdownIcon: {
      position: 'absolute',
      right: 12,
      top: 10,
      backgroundColor: '#F6F6F6',
    },
  });