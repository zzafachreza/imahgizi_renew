import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { colors, fonts } from '../../utils'
import { MyCalendar, MyGap, MyHeader, MyInput, MyInputSecond, MyPickerImage, MyTimePicker } from '../../components'
import { ScrollView } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'


export default function BantuanSocial({navigation}) {
  return (
    <SafeAreaView style={{
        flex:1,
        backgroundColor:colors.white
    }}>
      <View>
        <MyHeader title="Bantuan Sosial"/>
      </View>
      <ScrollView>
        <View style={{
            padding:20,

        }}>

      
        <MyCalendar placeholder="Pilih Tanggal" label="Waktu Kegiatan"/>
        <MyGap jarak={10}/>

        <MyInputSecond placeholder="Isi Jenis Bantuan" label="Jenis Bantuan"/>
        <MyGap jarak={10}/>

        <MyInputSecond placeholder="Isi Sumber Bantuan" label="Sumber Bantuan"/>
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