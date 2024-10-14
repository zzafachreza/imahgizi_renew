import { View, Text, SafeAreaView, ScrollView, Image, Alert, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ImageBackground } from 'react-native'
import { Color, colors, fonts } from '../../utils'

import { MyGap, MyInput } from '../../components'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { showMessage } from 'react-native-flash-message'
import axios from 'axios'
import { api_token, apiURL, loginAPI, MYAPP, storeData } from '../../utils/localStorage'

export default function Login({ navigation }) {
    const [kirim, setKirim] = useState({
        api_token: api_token,
        username: '',
        password: '',

    })

    const handleLogin = () => {

        if (kirim.username.length == 0) {
            showMessage({
                type: 'default',
                color: 'white',
                backgroundColor: colors.danger,
                message: 'Tolong isi username!'
            })
        } else if (kirim.password.length == 0) {
            showMessage({
                type: 'default',
                color: 'white',
                backgroundColor: colors.danger,
                message: 'Tolong isi passowrd!'
            })
        } else {
            console.log(kirim);

            axios
                .post(apiURL + 'login', kirim)
                .then(response => {
                    console.log(response.data);
                    if (response.data.status == 200) {
                        console.log(response.data)
                        storeData('user', response.data);
                        navigation.replace("MainApp");
                        Alert.alert(MYAPP, "Login berhasil!");
                    } else {
                        showMessage({
                            type: 'default',
                            color: 'white',
                            backgroundColor: colors.danger,
                            message: response.data.message
                        })
                    }
                })
                .catch(error => {
                    console.error(error)
                })
        }
    }

    const [comp, setComp] = useState({});
    useEffect(() => {
        axios.post(apiURL + 'company').then(res => {
            console.log(res.data.data);
            setComp(res.data.data)
        })
    }, [])

    return (
        <SafeAreaView style={{
            flex: 1,
        }}>
            <ImageBackground source={require('../../assets/bglogin.png')} style={{
                flex: 1,
                width: "100%",
                height: '100%',

            }}>

                <ScrollView>
                    <View style={{
                        padding: 20,

                    }}>

                        {/* LOGO */}
                        <View style={{
                            alignItems: "center",
                            marginTop: 10
                        }}>
                            <Image style={{
                                width: 198,
                                height: 227
                            }} source={require('../../assets/logo.png')} />
                        </View>

                        <View style={{ padding: 10, marginTop: '20%' }}>
                            <Text style={{
                                fontFamily: fonts.primary[700], color: colors.white,
                                fontSize: 25, textAlign: 'center',
                            }}>Masuk</Text>


                            <View style={{ marginTop: 30 }}>
                                <MyInput value={kirim.username} onChangeText={(x) => setKirim({ ...kirim, username: x })} label="Username" placeholder="Isi Username" />
                                <MyGap jarak={10} />
                                <MyInput value={kirim.password} onChangeText={(x) => setKirim({ ...kirim, password: x })} label="Kata Sandi" placeholder="Isi Kata Sandi" secureTextEntry={true} />
                                <MyGap jarak={10} />
                                <TouchableWithoutFeedback onPress={() => {
                                    Linking.openURL('https://wa.me/' + comp.tlp)
                                }}>
                                    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                        <Text style={{
                                            fontFamily: fonts.primary[500],
                                            color: colors.white,

                                        }}>Lupa Kata Sandi</Text>
                                    </View>
                                </TouchableWithoutFeedback>


                                {/* TOMBOL LOGIN */}
                                <View style={{
                                    marginTop: 20
                                }}>
                                    <TouchableWithoutFeedback onPress={handleLogin}>
                                        <View style={{
                                            padding: 10,
                                            backgroundColor: colors.button,
                                            borderRadius: 20,
                                            borderWidth: 2,
                                            borderColor: Color.blueGray[400]

                                        }}>
                                            <Text style={{
                                                fontFamily: fonts.primary[700],
                                                fontSize: 15, textAlign: "center",
                                                color: colors.primary,

                                            }}>Masuk</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                                {/* END TOMBOL LOGIN */}

                                {/* TOMBOL REGISTER */}
                                <View style={{
                                    padding: 10,
                                }}>

                                    <View style={{
                                        marginTop: 60
                                    }}>
                                        <TouchableWithoutFeedback onPress={() => navigation.navigate("Register")}>
                                            <View>
                                                <Text style={{
                                                    fontFamily: fonts.primary[600],
                                                    fontSize: 15,
                                                    textAlign: 'center',
                                                    color: colors.white,

                                                }}>Belum memiliki akun? Silakan <Text style={{
                                                    fontFamily: fonts.primary[700]
                                                }}>Daftar</Text></Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>

                                </View>
                            </View>
                        </View>

                    </View>
                </ScrollView>



            </ImageBackground>
        </SafeAreaView>
    )
}