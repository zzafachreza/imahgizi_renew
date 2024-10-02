import { View, Text, SafeAreaView, Alert } from 'react-native'
import React, { useState } from 'react'
import { colors, fonts } from '../../utils'
import { MyCalendar, MyGap, MyHeader, MyInput, MyInputSecond, MyPickerImage, MyTimePicker } from '../../components'
import { ScrollView } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useRoute } from '@react-navigation/native'
import { showMessage } from 'react-native-flash-message'
import axios from 'axios'
import { konselingAPI, MYAPP } from '../../utils/localStorage'


export default function Konseling({navigation}) {
  const route = useRoute();
  const kelompokResiko = route.params.kelompok_resiko || "Tidak ada";
  const nik = route.params.nik || "/";
  const namaBayi = route.params.namaBayi || "/";
  const namaIbu = route.params.namaIbu || "/";

  const [kirim, setKirim] = useState({
    materikonseling:'',
    waktukegiatan: new Date(),
    pendata: '',
    foto: null,

  })

  const handleSimpan = () => {
    if (kirim.materikonseling.length == 0 ||kirim.waktukegiatan == '' || kirim.pendata.length == 0 || !kirim.foto )  {
      showMessage({
        type: 'default',
        color:colors.white,
        backgroundColor:colors.danger,
      });
      return;
    }

    const dataToSend = {
      materikonseling: kirim.materikonseling,
      waktukegiatan: kirim.waktukegiatan,
      pendata: kirim.pendata,
      foto: kirim.foto,
      kelompok_resiko: kelompokResiko,
      nik: nik,
      namaibu: namaIbu,
      namabayi: namaBayi,
    };

    axios
    .post(konselingAPI, dataToSend)
    .then(response => {
      console.log(response.data);
      if (response.data.status === 200) {
        Alert.alert(MYAPP, "Sukses", "Data berhasil disimpan!")
      } else {
        showMessage({
          message: "Gagal menyimpan data, coba lagi!",
          type: "danger",
          backgroundColor: colors.danger,
          color: colors.white,
      });
      }
    })
    .catch(error => {
      console.error("Terjadi kesalahan:", error);
      showMessage({
          message: "Terjadi kesalahan pada server!",
          type: "danger",
          backgroundColor: colors.danger,
          color: colors.white,
      });
  });


  }

  return (
    <SafeAreaView style={{
        flex:1,
        backgroundColor:colors.white
    }}>
      <View>
        <MyHeader title="Konseling"/>
      </View>
      <ScrollView>
        <View style={{
            padding:20,

        }}>

        <MyInputSecond placeholder="Isi Materi Konseling"  label="Materi Konseling"/>
        <MyGap jarak={10}/>

        <MyCalendar placeholder="Pilih Tanggal" label="Waktu Kegiatan"/>
        <MyGap jarak={10}/>

        <MyInputSecond placeholder="Isi Pendata" label="Pendata"/>
        <MyGap jarak={10}/>

        <MyPickerImage label="Unggah Foto"/>
        
        <View>
          <TouchableWithoutFeedback>
            <View style={{
              padding:10,
              backgroundColor:colors.primary,
              borderRadius:30,

            }}>
              <Text style={{
                color:colors.white,
                textAlign:"center",
                fontFamily:fonts.primary[600],
                fontSize:15,

              }}>Simpan</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}