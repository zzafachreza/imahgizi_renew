import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // saving error
  }
};

export const getData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (e) {
    // error reading value
  }
};


export const apiURL = 'https://nutrishot.okeadmin.com/api/';
export const MYAPP = 'Imah Gizi';
export const api_token = 'd4e729bcd8aab6f0a710e8ca3d31524cb5783dd1d63ddbf32fbed278c435605f';
export const webURL = apiURL.replace("api/", "");
export const webPDF = apiURL.replace("api/", "assets/pdf/");
export const registerAPI = "https://imahgizi.okeadmin.com/api/register";
export const loginAPI = "https://imahgizi.okeadmin.com/api/login";
export const ibuhamilkekAPI = "https://imahgizi.okeadmin.com/api/ibuhamilkek";
export const ibuhamilanemiaAPI = "https://imahgizi.okeadmin.com/api/ibuhamilanemia";
export const badutaGiziAPI = "https://imahgizi.okeadmin.com/api/badutagizi";
export const catinKEKAnemiaAPI = "https://imahgizi.okeadmin.com/api/catinkekanemia";
export const konselingAPI = "https://imahgizi.okeadmin.com/api/konseling";
