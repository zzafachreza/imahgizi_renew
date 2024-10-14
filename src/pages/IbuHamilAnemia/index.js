import { View, Text, SafeAreaView, ScrollView, TouchableWithoutFeedback } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors, fonts } from '../../utils';
import { MyCalendar, MyGap, MyHeader, MyInputSecond, MyRadio } from '../../components';
import MyPickerSecond from '../../components/MyPickerSecond';
import kecamatanDesa from '../../components/Kecamatan/kecamatan.json';
import axios from 'axios';
import { apiURL, ibuhamilanemiaAPI, MYAPP } from '../../utils/localStorage'; // Menggunakan API Ibu Hamil Anemia
import { Alert } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import MyLoading from '../../components/MyLoading';
export default function IbuHamilAnemia({ navigation }) {
    const [kirim, setKirim] = useState({
        namaibu: '',
        anakke: '',
        nik: '',
        usiaibu: '',
        kecamatan: '',
        desa: '',
        usiakehamilan: '',
        hasilpengukuranhb: '', // Mengubah field ke HB (Hemoglobin)
        waktupendataan: new Date(),
        pendata: '',
        kepemilikan_jamban_sehat: '',
        keluarga_perokok: '',
        kepemilikan_jkn: '',
    });

    const [filteredDesas, setFilteredDesas] = useState([]); // Desa yang terfilter berdasarkan kecamatan
    const [kecamatanOptions, setKecamatanOptions] = useState([]); // Pilihan kecamatan
    const [loading, setLoading] = useState(false); // Tambahkan state loading

    // Mengambil data kecamatan-desa dari JSON dan menginisiasi state
    useEffect(() => {
        const uniqueKecamatans = [...new Set(kecamatanDesa.map(item => item.Kecamatan))];
        setKecamatanOptions(uniqueKecamatans);

        if (uniqueKecamatans.length > 0) {
            const firstKecamatan = uniqueKecamatans[0];
            setKirim((prevState) => ({ ...prevState, kecamatan: firstKecamatan }));

            // Filter desa berdasarkan kecamatan pertama
            const filtered = kecamatanDesa.filter(item => item.Kecamatan === firstKecamatan);
            const desaOptions = filtered.map(item => ({ label: item.Desa, value: item.Desa }));
            setFilteredDesas(desaOptions);

            if (desaOptions.length > 0) {
                setKirim((prevState) => ({ ...prevState, desa: desaOptions[0].value }));
            }
        }
    }, []);

    useEffect(() => {
        // Inisialisasi nilai default untuk setiap picker
        setKirim((prevState) => ({
            ...prevState,

            kepemilikan_jamban_sehat: 'Ya',  // Nilai default pertama untuk Kepemilikan Jamban Sehat
            keluarga_perokok: 'Ya',          // Nilai default pertama untuk Keluarga Perokok
            kepemilikan_jkn: 'Ya'            // Nilai default pertama untuk Kepemilikan JKN
        }));
    }, []);

    const handleKecamatanChange = (kecamatan) => {
        console.log("Kecamatan yang dipilih:", kecamatan);
        setKirim((prevState) => ({ ...prevState, kecamatan })); // Update kecamatan

        // Filter desa berdasarkan kecamatan yang dipilih
        const filtered = kecamatanDesa.filter(item => item.Kecamatan === kecamatan);
        const desaOptions = filtered.map(item => ({ label: item.Desa, value: item.Desa }));

        setFilteredDesas(desaOptions);

        if (desaOptions.length > 0) {
            setKirim((prevState) => ({ ...prevState, desa: desaOptions[0].value })); // Update desa
        } else {
            setKirim((prevState) => ({ ...prevState, desa: '' })); // Kosongkan desa jika tidak ada pilihan
        }
    };

    const handleDateChange = (date) => {
        console.log("Tanggal yang dipilih:", date);
        setKirim({ ...kirim, waktupendataan: date });
    };

    const handleSimpan = () => {
        // Validasi Input
        const requiredFields = [
            { field: kirim.namaibu, message: "Mohon isi Nama Ibu!" },
            { field: kirim.anakke, message: "Mohon isi Anak ke-!" },
            { field: kirim.nik, message: "Mohon isi NIK!" },
            { field: kirim.usiaibu, message: "Mohon isi Usia Ibu!" },
            { field: kirim.usiakehamilan, message: "Mohon isi Usia Kehamilan!" },
            { field: kirim.hasilpengukuranhb, message: "Mohon isi Hasil Pengukuran HB!" },
            { field: kirim.pendata, message: "Mohon isi Pendata!" },

        ];

        for (let i = 0; i < requiredFields.length; i++) {
            if (!requiredFields[i].field || requiredFields[i].field.length === 0) {
                showMessage({
                    type: "default",
                    color: 'white',
                    backgroundColor: colors.danger,
                    message: requiredFields[i].message
                });
                return;
            }
        }

        if (!kirim.kecamatan || kirim.kecamatan.trim() === "") {
            showMessage({
                type: "default",
                color: 'white',
                backgroundColor: colors.danger,
                message: "Mohon pilih Kecamatan!"
            });
            return;
        }

        // Gabungkan kecamatan dan desa menjadi alamat tunggal
        const alamat = `${kirim.kecamatan}, ${kirim.desa}`;  // Penggabungan yang benar
        const formattedDate = new Date(kirim.waktupendataan).toISOString().split('T')[0];
        const dataToSend = {
            ...kirim,
            alamat, // Gunakan kecamatan dan desa yang sudah digabung menjadi alamat
            formattedDate,

        };

        console.log("Data yang dikirim:", dataToSend);
        setLoading(true)

        // Kirim request dengan axios
        axios.post(apiURL + 'ibuhamilanemia', dataToSend)
            .then(response => {
                setLoading(false)
                console.log('Respons dari server:', response);
                if (response.data.status === 200) {
                    Alert.alert(MYAPP, "Data berhasil dimasukkan!");
                    navigation.replace("Laporan", {
                        nik: kirim.nik || "",
                        namaibu: kirim.namaibu || "",
                        kelompok_resiko: "Ibu Hamil Anemia",
                    });
                } else {
                    showMessage({
                        type: 'default',
                        color: 'white',
                        backgroundColor: colors.danger,
                        message: 'Gagal memasukkan data, coba lagi.'
                    });
                }
            })
            .catch(error => {
                setLoading(false)
                console.error('Terjadi kesalahan dari server:', error);
                showMessage({
                    type: "default",
                    color: "white",
                    backgroundColor: colors.danger,
                    message: "Terjadi kesalahan, coba lagi nanti."
                });
            });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
            <View>
                <MyHeader title="Ibu Hamil Anemia" />
            </View>

            {loading && <MyLoading />}

            <ScrollView>
                <View style={{ padding: 20 }}>

                    <MyInputSecond
                        value={kirim.namaibu}
                        onChangeText={(x) => setKirim({ ...kirim, namaibu: x })}
                        placeholder="Isi Nama Ibu"
                        label="Nama Ibu"
                    />
                    <MyGap jarak={10} />

                    <MyInputSecond
                        value={kirim.anakke}
                        onChangeText={(x) => setKirim({ ...kirim, anakke: x })}
                        placeholder="Isi Anak ke-"
                        label="Anak ke-"
                        keyboardType='numeric'
                    />
                    <MyGap jarak={10} />

                    <MyInputSecond
                        value={kirim.nik}
                        onChangeText={(x) => setKirim({ ...kirim, nik: x })}
                        placeholder="Isi NIK"
                        label="NIK"
                        keyboardType='numeric'
                    />
                    <MyGap jarak={10} />

                    <MyInputSecond
                        value={kirim.usiaibu}
                        onChangeText={(x) => setKirim({ ...kirim, usiaibu: x })}
                        placeholder="Isi Usia ibu"
                        label="Usia Ibu"
                        rightLabel="Tahun"
                        keyboardType="numeric"
                    />
                    <MyGap jarak={10} />

                    <MyPickerSecond
                        value={kirim.kecamatan}
                        data={kecamatanOptions.map(kecamatan => ({ label: kecamatan, value: kecamatan }))}
                        onValueChange={(value) => {
                            console.log("Kecamatan yang dipilih:", value);
                            setKirim({ ...kirim, kecamatan: value });
                            handleKecamatanChange(value); // Update desa ketika kecamatan berubah
                        }}
                        label="Kecamatan"
                    />
                    <MyGap jarak={10} />

                    <MyPickerSecond
                        value={kirim.desa}
                        data={filteredDesas}
                        onValueChange={(x) => setKirim({ ...kirim, desa: x })}
                        label="Desa"
                    />
                    <MyGap jarak={10} />

                    <MyInputSecond
                        value={kirim.usiakehamilan}
                        onChangeText={(x) => setKirim({ ...kirim, usiakehamilan: x })}
                        placeholder="Isi Usia Kehamilan"
                        label="Usia Kehamilan"
                        rightLabel="Minggu"
                        keyboardType="numeric"
                    />
                    <MyGap jarak={10} />

                    <MyInputSecond
                        value={kirim.hasilpengukuranhb} // Mengubah menjadi hasil pengukuran HB
                        onChangeText={(x) => setKirim({ ...kirim, hasilpengukuranhb: x })}
                        placeholder="Isi Hasil Pengukuran HB"
                        label="Hasil Pengukuran HB"
                        keyboardType="numeric"
                    />
                    <MyGap jarak={10} />

                    <MyCalendar
                        value={kirim.waktupendataan || new Date()}
                        onDateChange={handleDateChange}
                        label="Waktu Pendataan"
                    />
                    <MyGap jarak={10} />

                    <MyInputSecond
                        value={kirim.pendata}
                        onChangeText={(x) => setKirim({ ...kirim, pendata: x })}
                        placeholder="Isi Pendata"
                        label="Pendata"
                    />
                    <MyGap jarak={10} />

                    <View style={{}}>
                        <MyPickerSecond value={kirim.kepemilikan_jamban_sehat} onValueChange={(x) => {
                            console.log("Kepemilikan Jamban Sehat : ", x)
                            setKirim({ ...kirim, kepemilikan_jamban_sehat: x })
                        }} data={[
                            { label: 'Ya', value: 'Ya' },
                            { label: 'Tidak', value: 'Tidak' }
                        ]} label="Kepemilikan Jamban Sehat" />

                    </View>
                    <MyGap jarak={10} />

                    <View style={{}}>
                        <MyPickerSecond value={kirim.keluarga_perokok} onValueChange={(x) => {
                            console.log("Apakah Terdapat Keluarga Perokok di dalam Rumah? : ", x)
                            setKirim({ ...kirim, keluarga_perokok: x })
                        }} data={[
                            { label: 'Ya', value: 'Ya' },
                            { label: 'Tidak', value: 'Tidak' }
                        ]} label="Apakah Terdapat Keluarga Perokok di dalam Rumah?" />

                    </View>
                    <MyGap jarak={10} />


                    <View style={{}}>
                        <MyPickerSecond value={kirim.kepemilikan_jkn} onValueChange={(x) => {
                            console.log("Kepemilikan JKN : ", x)
                            setKirim({ ...kirim, kepemilikan_jkn: x })
                        }} data={[
                            { label: 'Ya', value: 'Ya' },
                            { label: 'Tidak', value: 'Tidak' }
                        ]} label="Kepemilikan JKN" />

                    </View>
                    <MyGap jarak={10} />

                    {/* Tombol Simpan */}
                    <TouchableWithoutFeedback onPress={handleSimpan}>
                        <View style={{ padding: 10, backgroundColor: colors.primary, borderRadius: 50 }}>
                            <Text style={{ fontFamily: fonts.primary[700], textAlign: 'center', color: colors.white }}>
                                Selanjutnya
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
