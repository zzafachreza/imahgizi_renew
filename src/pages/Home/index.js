import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  Animated,
  ImageBackground,
  TouchableWithoutFeedback,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { MyButton, MyCalendar, MyGap, MyHeader, MyInput, MyPicker } from '../../components';
import { MyDimensi, colors, fonts, windowHeight, windowWidth, Color } from '../../utils';
import { MYAPP, apiURL, api_token, getData, storeData } from '../../utils/localStorage';
import { BackgroundImage } from 'react-native-elements/dist/config';
import { color } from 'react-native-reanimated';
import axios from 'axios';
import moment from 'moment';
import { useToast } from 'react-native-toast-notifications';
import MyLoading from '../../components/MyLoading';

import { Icon } from 'react-native-elements';


const MyMenu = ({ onPress, img, label, backgroundColor, desc }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: windowWidth / 4,
        height: windowWidth / 4,
      }}>
        <View style={{
          backgroundColor: backgroundColor,
          borderRadius: 12,
          width: windowWidth / 4,
          height: windowWidth / 4,
          padding: 10,
          justifyContent: 'center',
          alignItems: 'center'

        }}>
          <Image source={img} style={{
            width: windowWidth / 5, height: windowWidth / 5,
          }} />
        </View>
        <Text style={{
          marginTop: 10,
          color: colors.black,
          ...fonts.caption,
          textAlign: 'center',
          maxWidth: '85%'
        }}>{label}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default function Home({ navigation, route }) {
  const [user, setUser] = useState({});

  const __getUser = () => {
    getData('user').then(u => {
      setUser(u)
    })
  }

  useEffect(() => {
    __getUser();
  }, [])
  return (
    <ImageBackground source={require('../../assets/bghome.png')} style={{
      flex: 1,
      backgroundColor: colors.white,
      width: "100%",
      height: "100%"
    }}>

      <ScrollView>

        <View style={{
          padding: 10
        }}>

       {/* HEADER ATAS */}
       <View style={{marginTop:60}}>
        <Text style={{
          fontFamily:fonts.primary[700],
          fontSize:25,
          textAlign:"center",
          color:colors.white,
        }}>Selamat datang</Text>

        <View style={{
          alignItems:"center",
          marginTop:40
        }}>
          <Image style={{
            width:128,
            height:147,
          }} source={require('../../assets/logo.png')}/>
        </View>
       </View>
       {/* END HEADER ATAS */}

       {/* HEADER BAWAH */}
       <View style={{
        alignItems:"center",
        marginTop:15,
       }}>
        <View style={{
          padding:10,
          backgroundColor:colors.white,
          borderRadius:50,
          width:257,
          borderWidth:1,
          borderColor:colors.black

        }}>

        <Text style={{
          fontFamily:fonts.primary[700],
          fontSize:20,
          color:colors.primary,
          textAlign:"center"
        }}>Surveilan</Text>

        </View>
       </View>
       {/* END HEADER BAWAH */}

       {/* MENU */}
       <View style={{padding:20, top: -15}}>
          {/* MENU SATU */}

          <View style={{
            marginTop:11
          }}>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('IbuHamilKEK')}>
            
              <View style={{
                padding:10,
                backgroundColor:colors.primary,
                borderRadius:30,
                height:69
           
              }}>

              <View style={{
                     flexDirection:'row',
                justifyContent:"center",
                alignItems:"center",
                left:- 20,
                top: -7
              }}>
            <View style={{
                marginRight:12,
                left: -15
              }}>
                <Image style={{
                  width:69,
                  height:69,
                }} source={require('../../assets/icon_ibuhamil.png')}/>
              </View>

              <View style={{
                left:-20
              }}>
                <Text style={{
                  fontFamily:fonts.primary[700],
                  fontSize:20,
                  color:colors.white,
                  textAlign:"center",
                }}>Ibu Hamil KEK</Text>
              </View>
              </View>

           

              </View>
            </TouchableWithoutFeedback>
          </View>
          {/* END MENU SATU */}

           {/* MENU DUA */}

           <View style={{
            marginTop:11
          }}>
           <TouchableWithoutFeedback onPress={() => navigation.navigate('IbuHamilAnemia')}>
            
            <View style={{
              padding:10,
              backgroundColor:colors.primary,
              borderRadius:30,
              height:69
         
            }}>

            <View style={{
                   flexDirection:'row',
              justifyContent:"center",
              alignItems:"center",
              left:- 20,
              top: -2
            }}>
          <View style={{
              marginRight:12
            }}>
              <Image style={{
                width:62,
                height:62,
              }} source={require('../../assets/icon_anemia.png')}/>
            </View>

            <View>
              <Text style={{
                fontFamily:fonts.primary[700],
                fontSize:20,
                color:colors.white,
                textAlign:"center",
              }}>Ibu Hamil Anemia</Text>
            </View>
            </View>

         

            </View>
          </TouchableWithoutFeedback>
          </View>
          {/* END MENU DUA*/}


           {/* MENU TIGA */}

           <View style={{
            marginTop:11
          }}>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('BadutaGizi')}>
            
            <View style={{
              padding:10,
              backgroundColor:colors.primary,
              borderRadius:30,
              height:69
         
            }}>

            <View style={{
                   flexDirection:'row',
              justifyContent:"center",
              alignItems:"center",
              left:- 20,
              top: -7
            }}>
          <View style={{
              marginRight:12
            }}>
              <Image style={{
                width:62,
                height:62,
                left:20
              }} source={require('../../assets/icon_baduta.png')}/>
            </View>

            <View style={{
              left: 15
            }}>
              <Text style={{
                fontFamily:fonts.primary[700],
                fontSize:20,
                color:colors.white,
                textAlign:"left",
              }}>Baduta Gizi Kurang/{'\n'}
              Gizi Buruk</Text>
            </View>
            </View>

         

            </View>
          </TouchableWithoutFeedback>
          </View>
          {/* END MENU TIGA */}

           {/* MENU EMPAT */}

           <View style={{
            marginTop:11
          }}>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('CATINAnemia')}>
            
            <View style={{
              padding:10,
              backgroundColor:colors.primary,
              borderRadius:30,
              height:69
         
            }}>

            <View style={{
                   flexDirection:'row',
              justifyContent:"center",
              alignItems:"center",
              left:- 20,
              top: -0
            }}>
          <View style={{
              marginRight:12
            }}>
              <Image style={{
                width:54,
                height:54,
                left:20
              }} source={require('../../assets/icon_catinanemia.png')}/>
            </View>

            <View style={{
              left: 20,
              top: -5
            }}>
              <Text style={{
                fontFamily:fonts.primary[700],
                fontSize:20,
                color:colors.white,
                textAlign:"left",
              }}>CATIN KEK & Anemia</Text>
            </View>
            </View>

         

            </View>
          </TouchableWithoutFeedback>
          </View>
          {/* END MENU EMPAT */}
       </View>
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({})