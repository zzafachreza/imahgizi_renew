import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { colors, fonts } from '../../utils'
import { MyCalendar, MyGap, MyHeader, MyInput, MyInputSecond, MyPickerImage, MyTimePicker } from '../../components'
import { ScrollView } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import MyPickerSecond from '../../components/MyPickerSecond'


export default function Rujukan({navigation}) {
  return (
    <SafeAreaView style={{
        flex:1,
        backgroundColor:colors.white
    }}>
      <View>
        <MyHeader title="Rujukan"/>
      </View>
      <ScrollView>
        <View style={{
            padding:20,

        }}>

      
        <MyCalendar placeholder="Pilih Tanggal" label="Waktu Kegiatan"/>
        <MyGap jarak={10}/>

        <MyInputSecond placeholder="Isi Kepemilikan JKN" label="Kepemilikan JKN"/>
        <MyGap jarak={10}/>

        <MyPickerSecond data={[
            {label: 'BPJS', value: 'BPJS'},
            {label: 'KIS', value: 'KIS'},
            {label: 'Lainnya', value: 'Lainnya'},

        ]} label="Jenis JKN"/>
        <MyGap jarak={10}/>


        <MyInputSecond placeholder="Isi Riwayat Penyakit" label="Riwayat Penyakit"/>
        <MyGap jarak={10}/>

        <MyInputSecond placeholder="Isi Fasilitas yang Dijadikan Rujukan" label="Fasilitas yang Dijadikan Rujukan"/>
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