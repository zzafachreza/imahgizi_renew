import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { colors, fonts } from '../../utils';
import { MyButton, MyGap, MyHeader, MyInputSecond, MyPicker } from '../../components';
import { getData, storeData, MYAPP, updateProfileAPI, apiURL } from '../../utils/localStorage';
import axios from 'axios';
import kecamatanDesa from '../../components/Kecamatan/kecamatan.json';
import { useIsFocused } from '@react-navigation/native';

export default function AccountEdit({ navigation, route }) {
    const { nama_lengkap, username, telepon, alamat } = route.params;

    console.log(route.params);
    const [kirim, setKirim] = useState({
        id_pengguna: route.params.id_pengguna,
        nama_lengkap: nama_lengkap || '',
        username: username || '',
        telepon: telepon || '',
        alamat: alamat || '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [dataAlamat, setDataAlamat] = useState([]);
    const isFocused = useIsFocused();


    useEffect(() => {
        const formattedData = kecamatanDesa.map(item => ({
            label: `${item.Kecamatan} - ${item.Desa}`,
            value: `${item.Kecamatan}, ${item.Desa}`,
        }));
        setDataAlamat(formattedData);
    }, []);

    const handleSave = () => {
        if (!kirim.nama_lengkap || !kirim.username || !kirim.telepon || !kirim.alamat) {
            Alert.alert(MYAPP, 'Semua kolom harus diisi!');
            return;
        }

        Alert.alert(
            "Konfirmasi",
            "Apakah Anda yakin ingin memperbarui profil?",
            [
                {
                    text: "Batal",
                    style: "cancel",
                },
                {
                    text: "Ya", onPress: () => {
                        setLoading(true);

                        // Pastikan id dikirimkan
                        axios.post(apiURL + 'update_profile', kirim)
                            .then(response => {
                                console.log(response.data);
                                setLoading(false);
                                if (response.data.status === 200) {
                                    storeData('user', response.data.data);
                                    Alert.alert(MYAPP, 'Data berhasil diperbarui!');

                                    storeData('user', null);
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Login' }],
                                    });
                                } else {
                                    Alert.alert(MYAPP, 'Gagal menyimpan perubahan.');
                                }
                            })
                            .catch(error => {
                                setLoading(false);
                                console.error(error);
                                Alert.alert(MYAPP, 'Terjadi kesalahan saat menghubungi server.');
                            });
                    }
                }
            ]
        );
    };


    return (
        <SafeAreaView style={styles.container}>
            <MyHeader title="Edit Profil" />
            <ScrollView style={styles.scrollView}>
                <View style={styles.contentContainer}>
                    <MyInputSecond
                        label="Nama Lengkap"
                        value={kirim.nama_lengkap}
                        onChangeText={(x) => setKirim({ ...kirim, nama_lengkap: x })}
                    />
                    <MyGap jarak={10} />
                    <MyInputSecond
                        label="Username"
                        value={kirim.username}
                        onChangeText={(x) => setKirim({ ...kirim, username: x })}
                    />
                    <MyGap jarak={10} />
                    <MyInputSecond
                        label="Nomor WhatsApp"
                        value={kirim.telepon}
                        onChangeText={(x) => setKirim({ ...kirim, telepon: x })}
                    />
                    <MyGap jarak={10} />

                    <MyPicker
                        value={kirim.alamat}
                        onValueChange={(x) => setKirim({ ...kirim, alamat: x })}
                        label="Alamat Lengkap"
                        data={dataAlamat}
                    />

                    <MyGap jarak={10} />
                    <MyInputSecond
                        placeholder="Kosongkan jika tidak diubah"
                        label="Kata Sandi"
                        secureTextEntry={true}
                        onChangeText={(x) => setKirim({ ...kirim, newpassword: x })}
                    />

                    <MyGap jarak={20} />

                    <MyButton
                        title="Simpan Perubahan"
                        warna={colors.primary}
                        onPress={handleSave}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollView: {
        padding: 20,
    },
    contentContainer: {
        marginVertical: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
});
