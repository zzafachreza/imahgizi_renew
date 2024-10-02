import { View, Text, SafeAreaView, Alert } from 'react-native'
import React, { useState } from 'react'
import { colors, fonts } from '../../utils'
import { MyCalendar, MyGap, MyHeader, MyInput, MyInputSecond, MyPickerImage, MyTimePicker } from '../../components'
import { ScrollView } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import MyPickerSecond from '../../components/MyPickerSecond'
import MyLoading from '../../components/MyLoading'
import { useRoute } from '@react-navigation/native'
import { MYAPP, rujukanAPI } from '../../utils/localStorage'
import { showMessage } from 'react-native-flash-message'
import axios from 'axios'


export default function Rujukan({navigation}) {
  const route = useRoute();

   // Ambil data dari route params
   const kelompokResiko = route.params?.kelompok_resiko || "Tidak ada";
   const nik = route.params?.nik || "/";
   const namaBayi = route.params?.namabayi || "/";
   const namaIbu = route.params?.namaibu || "/";

   const [kirim, setKirim] = useState({
    kepemilikan_jkn: '',
    jenis_jkn: 'BPJS', // Default value
    riwayat_penyakit: '',
    fasilitas_rujukan: '',
    pendata: '',
    waktukegiatan: new Date(),
    foto: null,
  });

  const [loading, setLoading] = useState(false);
  
  const handleDateChange = (date) => {
    console.log('Tanggal yang dipilih:', date);
    setKirim((prevState) => ({ ...prevState, waktukegiatan: date }));
  };


  const handleSimpan = () => {
    // Validasi input untuk memastikan semua data diisi dengan benar
    if (!kirim.kepemilikan_jkn || !kirim.jenis_jkn || !kirim.riwayat_penyakit || !kirim.fasilitas_rujukan || !kirim.pendata || !kirim.foto) {
      showMessage({
        message: "Semua data harus diisi!",
        type: 'danger',
        backgroundColor: colors.danger,
        color: colors.white,
      });
      return;
    }

    setLoading(true); // Tampilkan loading

    const formattedDate = new Date(kirim.waktukegiatan).toISOString().split('T')[0];

    const dataToSend = {
      kepemilikan_jkn: kirim.kepemilikan_jkn,
      jenis_jkn: kirim.jenis_jkn,
      riwayat_penyakit: kirim.riwayat_penyakit,
      fasilitas_rujukan: kirim.fasilitas_rujukan,
      pendata: kirim.pendata,
      waktukegiatan: formattedDate,
      foto: kirim.foto,
      kelompok_resiko: kelompokResiko,
      nik: nik,
      namaibu: namaIbu,
      namabayi: namaBayi,
    };

    console.log("Data yang dikirim:", dataToSend);
    setLoading(true)
    axios
      .post(rujukanAPI, dataToSend)
      .then(response => {
        setLoading(false);
        console.log(response.data)
        if (response.data.status === 200) {
          console.log(response.data)
          Alert.alert(MYAPP, "Data berhasil disimpan!");
          navigation.replace("MainApp");
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
        setLoading(false);
        console.error("Terjadi kesalahan:", error);
        showMessage({
          message: "Terjadi kesalahan pada server!",
          type: "danger",
          backgroundColor: colors.danger,
          color: colors.white,
        });
      });
  };

  return (
    <SafeAreaView style={{
        flex:1,
        backgroundColor:colors.white
    }}>
      <View>
        <MyHeader title="Rujukan"/>
      </View>

      {loading && <MyLoading/>}


      <ScrollView>
        <View style={{
            padding:20,

        }}>

      
        <MyCalendar value={kirim.waktukegiatan || new Date()} onDateChange={handleDateChange} placeholder="Pilih Tanggal" label="Waktu Kegiatan"/>
        <MyGap jarak={10}/>

        <MyInputSecond value={kirim.kepemilikan_jkn} 
        onChangeText={(X) => setKirim({...kirim,kepemilikan_jkn: X})}
        placeholder="Isi Kepemilikan JKN" label="Kepemilikan JKN"/>
        <MyGap jarak={10}/>

        <MyPickerSecond  value={kirim.jenis_jkn}  data={[
            {label: 'BPJS', value: 'BPJS'},
            {label: 'KIS', value: 'KIS'},
            {label: 'Lainnya', value: 'Lainnya'},

        ]} 
        onValueChange={(X) => setKirim({...kirim, jenis_jkn: X})}
        
        label="Jenis JKN"/>
        <MyGap jarak={10}/>


        <MyInputSecond value={kirim.riwayat_penyakit}
         onChangeText={(x) => setKirim({...kirim,riwayat_penyakit: x})}
         placeholder="Isi Riwayat Penyakit" label="Riwayat Penyakit"/>
        <MyGap jarak={10}/>

        <MyInputSecond value={kirim.fasilitas_rujukan}
          onChangeText={(x) => setKirim({...kirim, fasilitas_rujukan: x})}
         placeholder="Isi Fasilitas yang Dijadikan Rujukan" label="Fasilitas yang Dijadikan Rujukan"/>
        <MyGap jarak={10}/>

        <MyInputSecond value={kirim.pendata}
        onChangeText={(x) => setKirim({...kirim,pendata : x})} 
         placeholder="Isi Pendata" label="Pendata"/>
        <MyGap jarak={10}/>

        <MyPickerImage onImagePicked={(x) => setKirim({...kirim, foto: x})} label="Unggah Foto"/>
        
        <View>
          <TouchableWithoutFeedback onPress={handleSimpan}>
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