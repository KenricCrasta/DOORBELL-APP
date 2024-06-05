import { StatusBar } from 'expo-status-bar';
import {TouchableOpacity,ImageBackground, StyleSheet, Text, View, ScrollView } from 'react-native';
import { Image } from 'react-native';
import * as SplashScreen from "expo-splash-screen";
import { useFonts} from  'expo-font';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useState,useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebaseconfig';
import {getStorage, ref, getDownloadURL, listAll, getMetadata} from 'firebase/storage';

initializeApp(firebaseConfig);


export default function Gallery(){
    let [fontsLoaded] = useFonts({ 
        bold: require("./assets/FONTS/Poppins-Bold.ttf"),
        regular: require("./assets/FONTS/Poppins-Regular.ttf"),
        medium: require("./assets/FONTS/Poppins-Medium.ttf"),
        light: require("./assets/FONTS/Poppins-Light.ttf"),
        xlight: require("./assets/FONTS/Poppins-ExtraLight.ttf"),
        xbold: require("./assets/FONTS/Poppins-ExtraBold.ttf"),
        thin: require("./assets/FONTS/Poppins-Thin.ttf"),
      });
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

    //get images

    const [imageUrls, setImageUrls] =useState([]);
    //const navigation=useNavigation()
    useEffect(()=>{
      const fetching = async () => {
        try{
        const store=getStorage();
        const foldref= ref(store,'/processed_images');
        //const referen = ref(store,'/Capture.jpg');

         const {items} =await listAll(foldref);
         const metadataPromises = items.map(async (item) => {
          const metadata = await getMetadata(item);
          return { url: await getDownloadURL(item), createdAt: metadata.timeCreated };
      });
      const metadataList = await Promise.all(metadataPromises);
         const urls =[];
         
         /*for (const item of items){
          const url =await getDownloadURL(item);
          urls.push(url);
         }
         console.log(urls);*/
         metadataList.sort((a, b) => b.createdAt - a.createdAt);
            const sortedUrls = metadataList.map((metadata) => metadata.url);
            console.log(sortedUrls);           
            setImageUrls(sortedUrls);
      }
      catch(error)
      {
        console.error('Error fetching Image: ',error);
      }
      };
      fetching();
    const interval= setInterval(fetching,5000);

    return() =>clearInterval(interval);
  },[]);

    return (
        <View style={styles.container}>
        <View style={styles.topbar}>
            <Text style={styles.topbartext}>GALLERY</Text>  
        </View>
        <ScrollView contentContainerStyle={styles.imagegrid}>
              {imageUrls.map((url,index)=>(
                <Image key={index} source={{uri:url}} style={styles.image}/>
              )) 

              }
            </ScrollView>
        </View>
    )

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
        elevation: 5,
        zIndex: 1,
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
    imagegrid:
    {
      display:'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      
      alignItems: 'center',
      justifyContent: 'center',
      top: '20%'

    },
    image:
    {
        alignItems: 'center',
       justifyContent: 'center',
       width: '95%',
        height: 200,
        margin: 5,
        borderRadius: 25,
        // elevation: 5,
    },
});