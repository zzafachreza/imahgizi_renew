import { View, Text, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { ImageBackground } from 'react-native';
import { Color, colors, fonts } from '../../utils';
import kecamatanDesa from '../../components/Kecamatan/kecamatan.json';
import { MyGap, MyInput, MyPicker } from '../../components';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { showMessage } from 'react-native-flash-message';
import axios from 'axios';
import { loginAPI, MYAPP, registerAPI, storeData } from '../../utils/localStorage';

export default function Register({ navigation }) {
    const [kirim, setKirim] = useState({
        nama_lengkap: '',
        username: '',
        nomor_wa: '',
        alamat: '',
        password: '',
    });

    // Mengambil data dari JSON
    const [dataAlamat, setDataAlamat] = useState([]);

    useEffect(() => {
        const formattedData = kecamatanDesa.map(item => ({
            label: `${item.Kecamatan} - ${item.Desa}`,
            value: `${item.Kecamatan}, ${item.Desa}`, // Menggabungkan kecamatan dan desa
        }));
        setDataAlamat(formattedData);

        // Set alamat default jika ada
        if (formattedData.length > 0) {
            setKirim(prevState => ({
                ...prevState,
                alamat: formattedData[0].value // Alamat pertama
            }));
        }
    }, []);

    const handleRegister = () => {
        const requiredFields = [
            { field: kirim.nama_lengkap, message: "Mohon isi Nama Lengkap!" },
            { field: kirim.username, message: "Mohon isi Username!" },
            { field: kirim.nomor_wa, message: "Mohon isi nomor WhatsApp!" },
            { field: kirim.alamat, message: "Mohon pilih Alamat!" },
            { field: kirim.password, message: "Mohon isi Password!" },
        ];

        for (let i = 0; i < requiredFields.length; i++) {
            if (requiredFields[i].field.length === 0) {
                showMessage({
                    type: "default",
                    color: 'white',
                    backgroundColor: colors.danger,
                    message: requiredFields[i].message
                });
                return;
            }
        }

        if (kirim.nomor_wa.length < 10 || kirim.nomor_wa.length > 13) {
            showMessage({
                type: "default",
                color: 'white',
                backgroundColor: colors.danger,
                message: "Nomor WhatsApp harus terdiri dari 10 hingga 13 digit!"
            });
            return;
        }

        console.log(kirim);

        // Pengecekan alamat untuk pendaftaran otomatis
        const firstAddress = dataAlamat[0]?.value;
        if (kirim.alamat === firstAddress) {
            handleRegisterAPI(); // Langsung mendaftar jika alamat sama
            return;
        }

        // Jika alamat tidak sama, lanjutkan dengan pendaftaran
        handleRegisterAPI();
    };

    const handleRegisterAPI = () => {
        axios
            .post(registerAPI, kirim)
            .then(response => {
                if (response.data.status === 200) {
                    console.log(response.data);
                    storeData('user', kirim);
                    navigation.replace("Login");
                    Alert.alert(MYAPP, "Selamat!, Anda berhasil daftar!");
                } else if (response.data.status === 404) {
                    showMessage({
                        type: 'default',
                        color: 'white',
                        backgroundColor: colors.danger,
                        message: "Sudah ada akun"
                    });
                } else {
                    showMessage({
                        type: 'default',
                        color: 'white',
                        backgroundColor: colors.danger,
                        message: "Kesalahan Jaringan"
                    });
                }
            })
            .catch(error => {
                console.error("Terjadi kesalahan dari server!", error);
                showMessage({
                    type: "default",
                    color: "white",
                    backgroundColor: colors.danger,
                    message: "Terjadi kesalahan di server, coba lagi nanti."
                });
            });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground source={require('../../assets/bgregister.png')} style={{ flex: 1, width: "100%", height: '100%' }}>
                <ScrollView>
                    <View style={{ padding: 20 }}>
                        {/* LOGO */}
                        <View style={{ alignItems: "center", marginTop: 20 }}>
                            <Image style={{ width: 97, height: 107 }} source={require('../../assets/logo.png')} />
                        </View>

                        <View style={{ padding: 10, marginTop: '12%' }}>
                            <Text style={{ fontFamily: fonts.primary[700], color: colors.white, fontSize: 25, textAlign: 'center', }}>Daftar</Text>

                            <View style={{ marginTop: 30 }}>
                                <MyInput
                                    value={kirim.nama_lengkap}
                                    onChangeText={(x) => setKirim({ ...kirim, nama_lengkap: x })}
                                    label="Nama Lengkap"
                                    placeholder="Isi Nama Lengkap" />
                                <MyGap jarak={10} />
                                <MyInput
                                    value={kirim.username}
                                    onChangeText={(x) => setKirim({ ...kirim, username: x })}
                                    label="Username"
                                    placeholder="Isi Username" />
                                <MyGap jarak={10} />
                                <MyInput
                                    value={kirim.nomor_wa}
                                    onChangeText={(x) => setKirim({ ...kirim, nomor_wa: x })}
                                    label="Nomor WhatsApp"
                                    placeholder="Isi Nomor WhatsApp"
                                    keyboardType="numeric" />
                                <MyGap jarak={10} />
                                <MyPicker
                                    value={kirim.alamat}
                                    onValueChange={(x) => setKirim({ ...kirim, alamat: x })}
                                    label="Alamat Lengkap"
                                    data={dataAlamat} // Mengirim data alamat ke MyPicker
                                />
                                <MyGap jarak={10} />
                                <MyInput
                                    value={kirim.password}
                                    onChangeText={(x) => setKirim({ ...kirim, password: x })}
                                    label="Kata Sandi"
                                    placeholder="Kata Sandi" />
                                <MyGap jarak={10} />

                                {/* TOMBOL DAFTAR */}
                                <View style={{ marginTop: 20 }}>
                                    <TouchableWithoutFeedback onPress={handleRegister}>
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
                                            }}>Daftar</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                                {/* END TOMBOL DAFTAR */}

                                {/* TOMBOL BELUM PUNYA AKUN */}
                                <View style={{ padding: 10 }}>
                                    <View style={{ marginTop: 60 }}>
                                        <TouchableWithoutFeedback>
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
