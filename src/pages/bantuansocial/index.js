import { View, Text, SafeAreaView, Alert } from 'react-native';
import React, { useState } from 'react';
import { colors, fonts } from '../../utils';
import { MyCalendar, MyGap, MyHeader, MyInputSecond, MyPickerImage } from '../../components';
import { ScrollView } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import axios from 'axios';
import { apiURL, bantuanSosialAPI, MYAPP } from '../../utils/localStorage';
import MyLoading from '../../components/MyLoading';

export default function BantuanSosial({ navigation }) {
  const route = useRoute();

  // Mengambil parameter dari route jika ada, atau default
  const kelompokResiko = route.params?.kelompok_resiko || "Tidak ada";
  const nik = route.params?.nik || "/";
  const namaBayi = route.params?.namabayi || "/";
  const namaIbu = route.params?.namaibu || "/";

  const [kirim, setKirim] = useState({
    waktukegiatan: new Date(),
    jenisbantuan: '',
    sumberbantuan: '',
    pendata: '',
    foto: null,
  });

  const [loading, setLoading] = useState(false); // State untuk loading

  const handleDateChange = (date) => {
    console.log("Tanggal yang dipilih:", date);
    setKirim((prevState) => ({ ...prevState, waktukegiatan: date }));
  };

  const handleSimpan = () => {
    // Validasi input
    if (!kirim.jenisbantuan || !kirim.sumberbantuan || !kirim.waktukegiatan || !kirim.pendata || !kirim.foto) {
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
      waktukegiatan: formattedDate,
      jenisbantuan: kirim.jenisbantuan,
      sumberbantuan: kirim.sumberbantuan,
      pendata: kirim.pendata,
      foto: kirim.foto,
      kelompok_resiko: kelompokResiko,
      nik: nik,
      namaibu: namaIbu,
      namabayi: namaBayi,
    };

    console.log("Data yang dikirim:", dataToSend);
    setLoading(true)

    axios
      .post(apiURL + 'bantuansosial', dataToSend)
      .then(response => {
        setLoading(false)
        console.log(response.data);
        if (response.data.status === 200) {
          Alert.alert(MYAPP, "Data berhasil disimpan!");
          navigation.replace("MainApp"); // Navigasi ke halaman utama setelah data disimpan
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
        setLoading(false)
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <View>
        <MyHeader title="Bantuan Sosial" />
      </View>
      <ScrollView>
        <View style={{ padding: 20 }}>
          <MyCalendar
            value={kirim.waktukegiatan || new Date()}
            onDateChange={handleDateChange}
            placeholder="Pilih Tanggal"
            label="Waktu Kegiatan"
          />
          <MyGap jarak={10} />

          <MyInputSecond
            value={kirim.jenisbantuan}
            onChangeText={(x) => setKirim({ ...kirim, jenisbantuan: x })}
            placeholder="Isi Jenis Bantuan"
            label="Jenis Bantuan"
          />
          <MyGap jarak={10} />

          <MyInputSecond
            value={kirim.sumberbantuan}
            onChangeText={(x) => setKirim({ ...kirim, sumberbantuan: x })}
            placeholder="Isi Sumber Bantuan"
            label="Sumber Bantuan"
          />
          <MyGap jarak={10} />

          <MyInputSecond
            value={kirim.pendata}
            onChangeText={(x) => setKirim({ ...kirim, pendata: x })}
            placeholder="Isi Pendata"
            label="Pendata"
          />
          <MyGap jarak={10} />

          <MyPickerImage onImagePicked={(x) => setKirim({ ...kirim, foto: x })} label="Unggah Foto" />
          <MyGap jarak={10} />

          <View>
            <TouchableWithoutFeedback onPress={handleSimpan}>
              <View style={{
                padding: 10,
                backgroundColor: colors.primary,
                borderRadius: 30,
              }}>
                <Text style={{
                  color: colors.white,
                  textAlign: "center",
                  fontFamily: fonts.primary[600],
                  fontSize: 15,
                }}>
                  Simpan
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </ScrollView>
      {loading && <MyLoading />}
    </SafeAreaView>
  );
}
