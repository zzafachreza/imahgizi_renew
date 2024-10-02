import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Color, colors, fonts } from '../../utils';
import { getData, storeData, MYAPP } from '../../utils/localStorage';
import { MyButton, MyGap, MyHeader } from '../../components';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';


export default function Profile({ navigation }) {
    const [user, setUser] = useState({});
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isFocused) {
            getData('user').then(res => {
                console.log('Data user dari localStorage:', res);
                if (res && res.data) {
                    setUser(res.data); // akses data user di dalam objek "data"
                }
                setLoading(false);
            });
        }
    }, [isFocused]);

    const btnKeluar = () => {
        Alert.alert(MYAPP, 'Apakah kamu yakin akan keluar?', [
            {
                text: 'Batal',
                style: 'cancel'
            },
            {
                text: 'Keluar',
                onPress: () => {
                    storeData('user', null);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Splash' }],
                    });
                }
            }
        ]);
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <MyHeader title="Profil" />
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                <View style={styles.contentContainer}>
                    <Text style={styles.label}>Nama Lengkap</Text>
                    <View style={styles.inputBox}>
                        <Text style={styles.value}>{user.nama_lengkap}</Text>
                    </View>

                    <Text style={styles.label}>Username</Text>
                    <View style={styles.inputBox}>
                        <Text style={styles.value}>{user.username}</Text>
                    </View>

                    <Text style={styles.label}>Nomor WhatsApp</Text>
                    <View style={styles.inputBox}>
                        <Text style={styles.value}>{user.nomor_wa}</Text>
                    </View>

                    <Text style={styles.label}>Alamat Lengkap</Text>
                    <View style={styles.inputBox}>
                        <Text style={styles.value}>{user.alamat}</Text>
                    </View>

                    <Text style={styles.label}>Kata Sandi</Text>
                    <View style={styles.inputBox}>
                        <Text style={styles.value}>********</Text>
                    </View>

                    <MyGap jarak={10} />

                   <View style={{
                    
                   }}>
                   <MyButton
                        title="Edit Profil"
                        warna={colors.primary}
                        onPress={() => navigation.navigate('AccountEdit', user)}
                    />
                    <MyGap jarak={20} />
                    <MyButton
                        title="Keluar"
                        warna={Color.blueGray[500]}
                        onPress={btnKeluar}
                    />
                   </View>

                   <View style={{
                    padding:10,
                    marginBottom:20
                   }}>

                   </View>

                
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
        padding:0
    },
    label: {
        fontSize: 16,
        color: colors.primary,
        fontFamily: fonts.primary[700],
        marginBottom: 5,
    },
    inputBox: {
        backgroundColor: '#F5F5F5',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
    },
    value: {
        fontSize: 16,
        color: colors.primary,
        fontFamily: fonts.primary[600],
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
});
