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
import { getData, storeData, MYAPP, updateProfileAPI } from '../../utils/localStorage';
import axios from 'axios';
import kecamatanDesa from '../../components/Kecamatan/kecamatan.json'; 
import { useIsFocused } from '@react-navigation/native';

export default function AccountEdit({ navigation, route }) {
    const { nama_lengkap, username, nomor_wa } = route.params;

    const [kirim, setKirim] = useState({
        nama_lengkap: nama_lengkap || '',
        username: username || '',
        nomor_wa: nomor_wa || '',
        alamat: '', 
        password: '', 
    });

    const [loading, setLoading] = useState(false);
    const [dataAlamat, setDataAlamat] = useState([]); 
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            getData('user').then(res => {
                if (res && res.data) {
                    setKirim({
                        id: res.data.id, // Pastikan id pengguna ditambahkan
                        nama_lengkap: res.data.nama_lengkap,
                        username: res.data.username,
                        nomor_wa: res.data.nomor_wa,
                        alamat: res.data.alamat,
                        password: '',  // Password akan tetap kosong jika tidak diubah
                    });
                }
            });
        }
    }, [isFocused]);
    

    useEffect(() => {
        const formattedData = kecamatanDesa.map(item => ({
            label: `${item.Kecamatan} - ${item.Desa}`,
            value: `${item.Kecamatan}, ${item.Desa}`, 
        }));
        setDataAlamat(formattedData);
    }, []);

    const handleSave = () => {
        if (!kirim.nama_lengkap || !kirim.username || !kirim.nomor_wa || !kirim.alamat) {
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
                        axios.post(updateProfileAPI, kirim)
                            .then(response => {
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
                        value={kirim.nomor_wa}
                        onChangeText={(x) => setKirim({ ...kirim, nomor_wa: x })}
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
                        label="Kata Sandi"
                        value={kirim.password}
                        secureTextEntry={true}
                        onChangeText={(x) => setKirim({ ...kirim, password: x })}
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
