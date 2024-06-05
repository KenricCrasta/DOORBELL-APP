import { StatusBar } from 'expo-status-bar';
import {TouchableOpacity,ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Image } from 'react-native';
import * as SplashScreen from "expo-splash-screen";
import { useFonts} from  'expo-font';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useState,useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebaseconfig';
import {getStorage, ref, getDownloadURL, listAll} from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
//import {database} from 'firebase/database';
import {getDatabase, ref as rdref , set} from 'firebase/database'


//firebase initialization:
initializeApp(firebaseConfig);

export default function Landing() {
  
  const [url, setUrl] =useState();
  const navigation=useNavigation()
  useEffect(()=>{
    const db =getDatabase();
 const liveRef = rdref(db, '/live');
 set(liveRef, { live: 0 })
  .then(() => console.log('Data set'))
  .catch((error) => console.error('Error setting data:', error));
    const func = async () => {
      try{
      const store=getStorage();
      const referen = ref(store,'/Capture.jpg');
      await getDownloadURL(referen).then((x)=>{
        setUrl(x);
      })
    }
    catch
    {
      console.error('Error fetching Image: ',error);
    }
    };
    func();
    const interval= setInterval(func,5000);

    return() =>clearInterval(interval);
  },[]);

    let [fontsLoaded] = useFonts({
        bold: require("./assets/FONTS/Poppins-Bold.ttf"),
        regular: require("./assets/FONTS/Poppins-Regular.ttf"),
        medium: require("./assets/FONTS/Poppins-Medium.ttf"),
        light: require("./assets/FONTS/Poppins-Light.ttf"),
        xlight: require("./assets/FONTS/Poppins-ExtraLight.ttf"),
        xbold: require("./assets/FONTS/Poppins-ExtraBold.ttf"),
        thin: require("./assets/FONTS/Poppins-Thin.ttf"),
      });

      
      const handlePress = () => {
        // Execute code when the component is touched
        
      };
      const handlePress2 = () => {
        // Execute code when the component is touched
        
        Alert.alert('OPEN LIVE VIEW');
      };
      const onlayoutrootview = useCallback(async()=>{
        if(fontsLoaded)
        {
          await SplashScreen.hideAsync();
        }
      },{fontsLoaded});

    if(!fontsLoaded)
    {
      return null;
    }

    
    return (
      <View style={styles.container}>
        <View style={styles.topbar}>
            <Text style={styles.topbartext}>HOME</Text>
        </View>
        <View style={styles.image}>
            <Image source={{uri: url} } style={styles.img} />
        </View>
        <TouchableOpacity style={styles.gallery} onPress={() => navigation.navigate('Gallery')}><Text style={styles.buttxt}>GALLERY</Text></TouchableOpacity>
        <TouchableOpacity style={styles.notify} onPress={() => navigation.navigate('Live')}><Text style={styles.buttxt}>LIVE</Text></TouchableOpacity>    
        <StatusBar style="auto" />
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'rgb( 218 223 225)',
      flex: 1,
      alignItems: "center",
      justifyContent: 'center',
      
    },
    text:{ 
        fontFamily: "light",
        fontSize: 60,
         },
    topbar:
    {
        backgroundColor: 'whitesmoke',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 70,
        position: 'absolute',
        top: '0%',
        borderRadius: 10,
        elevation: 5
        },
    topbartext:
    {
        fontFamily: "light",
        color: 'black',
        fontSize: 30,
        position: 'absolute',
        bottom: '1%',
        elevation: 5
    },
    image:
    {
        height: 150,
        width: '75%',
        borderRadius: 25,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position:'absolute',
        bottom: '60%',
        overflow: 'hidden',
        elevation: 5
    },
    img:
    {
        flex: 1,
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        borderRadius: 25,
        display: 'flex',
        flexDirection: 'row',
        objectFit:'contain'
    },
    gallery:
    {
      backgroundColor: 'black',
        color: 'white',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        height: '10%',
        position: 'absolute',
          top: '50%',
          //left: '-45%',
        borderRadius: 50,
        elevation: 5
    },
    buttxt:
    {
      fontFamily: "light",
      color: 'white',
      display: 'flex',
      flexDirection: 'row',
      justifyContent:'center',
      fontSize: 20,
    },
    notify:
    {
      backgroundColor: 'black',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        height: '10%',
        position: 'absolute',
          top: '65%',
          //left: '-45%',
        borderRadius: 50,
        elevation: 5
    }

  });