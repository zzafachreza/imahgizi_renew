import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { colors, fonts, windowWidth } from '../../utils';
import { getData } from '../../utils/localStorage';

export default function Laporan({ navigation, route }) {
  const [user, setUser] = useState({});
  const kelompok_resiko = route.params?.kelompok_resiko || '/'; // Ambil kelompok resiko dari route params
  console.log(route.params)
  // Ambil data user
  const __getUser = () => {
    getData('user').then(u => {
      setUser(u);
    });
  };

  useEffect(() => {
    __getUser();
  }, []);

  return (
    <ImageBackground source={require('../../assets/bghome.png')} style={styles.background}>
      <ScrollView>
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Image style={styles.logo} source={require('../../assets/logo.png')} />
            </View>
          </View>

          {/* TITLE */}
          <View style={styles.titleContainer}>
            <View style={styles.titleBox}>
              <Text style={styles.titleText}>Laporan</Text>
            </View>
          </View>

          <View style={styles.subtitleContainer}>
            <View style={styles.subtitleBox}>
              <Text style={styles.subtitleText}>Kegiatan Pendampingan Keluarga Risiko Stunting</Text>
            </View>
          </View>

          {/* MENU */}
          <View style={styles.menuContainer}>
            {/* Konseling */}
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Konseling', {
              nik: route.params.nik,          // Pastikan ini 'nik' dengan huruf kecil
              namaibu: route.params.namaibu,
              namabayi: route.params.namabayi,
              kelompok_resiko: route.params.kelompok_resiko
            })}>
              <View style={styles.menuItem}>
                <View style={styles.iconContainer}>
                  <Image style={styles.icon} source={require('../../assets/icon_konseling.png')} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.menuText}>Konseling</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>


            {/* Bantuan Sosial */}
            <TouchableWithoutFeedback onPress={() => navigation.navigate('BantuanSocial', {
              nik: route.params.nik,          // Pastikan ini 'nik' dengan huruf kecil
              namaibu: route.params.namaibu,
              namabayi: route.params.namabayi,
              kelompok_resiko: route.params.kelompok_resiko
            })}>
              <View style={styles.menuItem}>
                <View style={styles.iconContainer}>
                  <Image style={styles.icon} source={require('../../assets/icon_bantuan_sosial.png')} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.menuText}>Bantuan Sosial</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>

            {/* Rujukan */}
            <TouchableWithoutFeedback onPress={() => navigation.navigate('RujukanScreen', {
              nik: route.params.nik,          // Pastikan ini 'nik' dengan huruf kecil
              namaibu: route.params.namaibu,
              namabayi: route.params.namabayi,
              kelompok_resiko: route.params.kelompok_resiko
            })}>
              <View style={styles.menuItem}>
                <View style={styles.iconContainer}>
                  <Image style={styles.iconLarge} source={require('../../assets/icon_rujukan.png')} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.menuTextLarge}>Rujukan</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.white,
    width: '100%',
    height: '100%'
  },
  container: {
    padding: 10
  },
  headerContainer: {
    marginTop: 60,
    alignItems: 'center'
  },
  logoContainer: {
    marginTop: 110,
  },
  logo: {
    width: 128,
    height: 147,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 15
  },
  titleBox: {
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 50,
    width: 257,
    borderWidth: 1,
    borderColor: colors.black
  },
  titleText: {
    fontFamily: fonts.primary[700],
    fontSize: 20,
    color: colors.primary,
    textAlign: 'center'
  },
  subtitleContainer: {
    marginTop: 10,
    alignItems: 'center'
  },
  subtitleBox: {
    width: 225
  },
  subtitleText: {
    fontFamily: fonts.primary[500],
    fontSize: 15,
    color: colors.primary,
    textAlign: 'center'
  },
  menuContainer: {
    padding: 20,
    marginTop: -15
  },
  menuItem: {
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 30,
    height: 69,
    marginTop: 11,
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconContainer: {
    marginRight: 12,
    left: 10
  },
  icon: {
    width: 53,
    height: 53,
    top: 4
  },
  iconLarge: {
    width: 59,
    height: 59,
    top: 5
  },
  textContainer: {
    left: -5
  },
  menuText: {
    fontFamily: fonts.primary[700],
    fontSize: 20,
    color: colors.white,
    textAlign: 'center',
    left: 30
  },
  menuTextLarge: {
    fontFamily: fonts.primary[700],
    fontSize: 20,
    color: colors.white,
    textAlign: 'left',
    left: 27
  }
});
