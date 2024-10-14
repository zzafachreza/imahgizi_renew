import { View, Text, SafeAreaView, ScrollView, TouchableWithoutFeedback } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors, fonts } from '../../utils';
import { MyCalendar, MyGap, MyHeader, MyInputSecond, MyRadio } from '../../components';
import MyPickerSecond from '../../components/MyPickerSecond';
import kecamatanDesa from '../../components/Kecamatan/kecamatan.json';
import axios from 'axios';
import { apiURL, badutaGiziAPI, ibuhamilkekAPI, MYAPP } from '../../utils/localStorage';
import { Alert } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import MyLoading from '../../components/MyLoading';


export default function BadutaGizi({ navigation }) {
    const [kirim, setKirim] = useState({
        namabayi: '',
        namaibuayah: '',
        nikibuayah: '',
        usiaibu: '',
        kecamatan: '',
        desa: '',
        usiaanak: '',
        hasilpengukuranbb: '',
        hasilpengukurantb: '',
        kelamin: '',
        waktupendataan: new Date(),
        pendata: '',
        kepemilikan_jamban_sehat: '',
        keluarga_perokok: '',
        kepemilikan_jkn: '',
        kelengkapan_imunisasi: '',
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
        setKirim((prevState) => ({
            ...prevState,
            kelamin: 'Laki-laki'
        }))
    }, [])

    useEffect(() => {
        // Inisialisasi nilai default untuk setiap picker
        setKirim((prevState) => ({
            ...prevState,
            kelengkapan_imunisasi: 'Lengkap', // Nilai default pertama untuk Kelengkapan Imunisasi
            kepemilikan_jamban_sehat: 'Ya',  // Nilai default pertama untuk Kepemilikan Jamban Sehat
            keluarga_perokok: 'Ya',          // Nilai default pertama untuk Keluarga Perokok
            kepemilikan_jkn: 'Ya'            // Nilai default pertama untuk Kepemilikan JKN
        }));
    }, []);

    const handleKecamatanChange = (kecamatan) => {
        console.log("Kecamatan yang dipilih:", kecamatan);
        setKirim((prevState) => ({ ...prevState, kecamatan }));

        // Filter desa berdasarkan kecamatan yang dipilih
        const filtered = kecamatanDesa.filter(item => item.Kecamatan === kecamatan);
        const desaOptions = filtered.map(item => ({ label: item.Desa, value: item.Desa }));

        setFilteredDesas(desaOptions);

        if (desaOptions.length > 0) {
            setKirim((prevState) => ({ ...prevState, desa: desaOptions[0].value }));
        } else {
            setKirim((prevState) => ({ ...prevState, desa: '' }));
        }
    };

    const handleDateChange = (date) => {
        console.log("Tanggal yang dipilih:", date);
        setKirim((prevState) => ({ ...prevState, waktupendataan: date }));
    };

    const handleSimpan = () => {
        // Validasi Input
        const requiredFields = [
            { field: kirim.namabayi, message: "Mohon isi Nama Bayi!" },
            { field: kirim.kelamin, message: "Mohon pilih Jenis Kelamin!" },
            { field: kirim.namaibuayah, message: "Mohon isi Nama Ibu / Ayah!" },
            { field: kirim.nikibuayah, message: "Mohon isi NIK Ibu / Ayah!" },
            { field: kirim.usiaibu, message: "Mohon isi Usia Ibu!" },
            { field: kirim.usiaanak, message: "Mohon isi Usia Anak!" },
            { field: kirim.hasilpengukuranbb, message: "Mohon isi Hasil Pengukuran BB!" },
            { field: kirim.hasilpengukurantb, message: "Mohon isi Hasil Pengukuran TB!" },
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

        // Gabungkan kecamatan dan desa menjadi alamat
        const alamat = `${kirim.kecamatan}, ${kirim.desa}`;
        const formattedDate = new Date(kirim.waktupendataan).toISOString().split('T')[0];
        const dataToSend = {
            ...kirim,
            alamat, // Tambahkan alamat yang berisi kecamatan dan desa
            formattedDate,

        };

        console.log("Data yang dikirim:", dataToSend);
        setLoading(true)

        axios.post(apiURL + 'badutagizi', dataToSend)
            .then(response => {
                setLoading(false)
                console.log('Respons dari server:', response);
                if (response.data.status === 200) {
                    Alert.alert(MYAPP, "Data berhasil dimasukkan!");
                    navigation.replace("Laporan", {
                        nik: kirim.nikibuayah || "",
                        namabayi: kirim.namabayi || "",
                        namaibu: kirim.namaibuayah || "",
                        kelompok_resiko: "Baduta Gizi Kurang / Gizi Buruk",
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
                <MyHeader title="Baduta Gizi Kurang / Gizi Buruk" />
            </View>

            {loading && <MyLoading />}

            <ScrollView>
                <View style={{ padding: 20 }}>

                    <MyInputSecond
                        value={kirim.namaibu}
                        onChangeText={(x) => setKirim({ ...kirim, namabayi: x })}
                        placeholder="Isi Nama Bayi"
                        label="Nama Bayi"
                    />
                    <MyGap jarak={10} />

                    <MyPickerSecond value={kirim.kelamin} onValueChange={(x) => {
                        console.log("Jenis Kelamin yang dipilih:", x);
                        setKirim({ ...kirim, kelamin: x })
                    }} label="Jenis Kelamin" data={[
                        { label: 'Laki-laki', value: 'Laki-laki' },
                        { label: 'Perempuan', value: 'Perempuan' }
                    ]} />
                    <MyGap jarak={10} />

                    <MyInputSecond value={kirim.namaibuayah} onChangeText={(x) => setKirim({ ...kirim, namaibuayah: x })} label="Nama Ibu / Ayah" placeholder="Isi Nama Ibu / Ayah" />
                    <MyGap jarak={10} />

                    <MyInputSecond
                        value={kirim.nikibuayah}
                        onChangeText={(x) => setKirim({ ...kirim, nikibuayah: x })}
                        placeholder="Isi NIK Ibu / Ayah"
                        label="NIK Ibu / Ayah"
                        keyboardType='numeric'
                    />
                    <MyGap jarak={10} />

                    <MyInputSecond
                        value={kirim.usiaibu}
                        onChangeText={(x) => setKirim({ ...kirim, usiaibu: x })}
                        placeholder="Isi Usia Ibu"
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
                            handleKecamatanChange(value);
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
                        value={kirim.usiaanak}
                        onChangeText={(x) => setKirim({ ...kirim, usiaanak: x })}
                        placeholder="Isi Usia Anak"
                        label="Usia Anak"

                        keyboardType="numeric"
                    />
                    <MyGap jarak={10} />

                    <MyInputSecond
                        value={kirim.hasilpengukuranbb}
                        onChangeText={(x) => setKirim({ ...kirim, hasilpengukuranbb: x })}
                        placeholder="Isi Hasil Pengukuran BB"
                        label="Hasil Pengukuran BB"
                        rightLabel="Kg"
                        keyboardType="numeric"
                    />
                    <MyGap jarak={10} />

                    <MyInputSecond
                        value={kirim.hasilpengukurantb}
                        onChangeText={(x) => setKirim({ ...kirim, hasilpengukurantb: x })}
                        placeholder="Isi Hasil Pengukuran TB"
                        label="Hasil Pengukuran TB"
                        rightLabel="Cm"
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
                        <MyPickerSecond value={kirim.kelengkapan_imunisasi} onValueChange={(x) => {
                            console.log("Kelengkapan Imunisasi : ", x)
                            setKirim({ ...kirim, kelengkapan_imunisasi: x })
                        }} data={[
                            { label: 'Lengkap', value: 'Lengkap' },
                            { label: 'Tidak Lengkap', value: 'Tidak Lengkap' }
                        ]} label="Kelengkapan Imunisasi" />

                    </View>

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

                    {/* Radiobutton Kepemilikan JKN */}
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
