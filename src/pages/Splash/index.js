import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  Animated,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import { MyButton, MyGap } from '../../components';
import { MyDimensi, colors, fonts, windowHeight, windowWidth } from '../../utils';
import { MYAPP, getData } from '../../utils/localStorage';
import { color } from 'react-native-reanimated';

export default function Splash({ navigation }) {
  const img = new Animated.Value(0.5);
  const textScale = new Animated.Value(0.5);
  const textOpacity = new Animated.Value(0);


  useEffect(() => {
    Animated.parallel([
      Animated.timing(img, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }),
      Animated.timing(textScale, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }),
      
    ]).start();

  
    setTimeout(() => {
     getData('user').then(user => {
      if (user) {
        navigation.replace("MainApp")
      } else {
        navigation.replace("Login");
      }
     })
    }, 1500);
  }, []);

  return (
    <SafeAreaView style={{
      flex: 1,
      padding: 0,
      backgroundColor: colors.white,
      justifyContent: 'center',
      position: 'relative'
    }}>

      <ImageBackground source={require('../../assets/bgsplash.png')} style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
        width: '100%',
        height: '100%'
      }}>

        <Animated.Image
          source={require('../../assets/logo.png')}
          resizeMode="contain"
          style={{
            transform: [{ scale: img }],
            width: windowWidth / 1.5,
            height: windowWidth / 1.5,  
            marginTop:'2%'

          }}
        />


        <View style={{
          marginTop:'15%'
        }}>
        <Animated.Text style={{
          transform: [{scale : textScale}],
          fontFamily:fonts.primary[800],
          color:colors.white,
          fontSize:50,
          textAlign:"center",

        }}>IMAH GIZI</Animated.Text>

          <Animated.Text style={{
          transform: [{scale : textScale}],
          fontFamily:fonts.primary[600],
          color:colors.white,
          fontSize:15,
          textAlign:"center",
          width:241,
          marginTop:20

        }}>Tim Pendamping Keluarga Bergerak
          Mewujudkan Zero New Stunting</Animated.Text>
        </View>


        {/* <ActivityIndicator style={{marginTop:50}} color={colors.primary} size="small" /> */}

        <View style={{
        top:100
        }}>
          <Text style={{
            fontFamily:fonts.primary[400],
            fontSize:12,
            color:colors.white,
          }}>
          © 2024
          </Text>
        </View>


      </ImageBackground>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
