import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps'
import { useState, useRef, useEffect } from 'react'
import * as Location from 'expo-location'
import * as ImagePicker from 'expo-image-picker'
import { app, database, storage } from './firebase.js'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { collection, addDoc, deleteDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore'

export default function App() {

  const [markers, setMarkers] = useState([])
  const [imagePath, setImagePath] = useState(null)

  const [ region, setRegion ] = useState( {
    latitude: 55,
    longitude: 12,
    latitudeDelta: 20,
    longitudeDelta: 20
  })

  const mapView = useRef(null) // reference til map view objektet
  const locationSubscription = useRef(null) //Når vi lukker appen skal den ikke lytte længere

  useEffect(() => {
    async function startListening() {
      let { status } = await Location.requestForegroundPermissionsAsync()
      
    if (status !== 'granted') {
        alert('Ingen adgang til lokation: ' + status)
        return
      }

      locationSubscription.current = await Location.watchPositionAsync({ 
        distanceInterval: 100,
        accuracy: Location.Accuracy.High
      }, location => {
        const { latitude, longitude } = location.coords
        const newRegion = {
          latitude: latitude.latitude, 
          longitude: longitude.longitude,
          latitudeDelta: 20,
          longitudeDelta: 20 
        }
        setRegion(newRegion) // Flytter kortet til den nye lokation
         
        if (mapView.current) {
          mapView.current.animateToRegion(newRegion)
        }
      })
    }
    startListening()
  })

  function addMarker(data) {
    const { latitude, longitude } = data.nativeEvent.coordinate
    const newMarker = {
      coordinate: {latitude, longitude},
      key: data.timeStamp,
      title: "Really good pizza"
    }
    setMarkers([...markers, newMarker])
  }

  function onMarkerPressed(text) {
    Alert.alert(
      'Overskrift',
      '',
      [
        {
          text: 'TILBAGE',
        },
        {
          text: 'Vælg billede',
          onPress: async () => {
            // Create a copy of the noteList and remove the note at the specified id
            await launchImagePicker()
            .then(uploadImage())
          },
        },
      ]
    );
  }

  async function uploadImage() {

    try {
      const res = await fetch(imagePath)
      const blob = await res.blob()

      const uniqueImageID = Date.now().toString();
      

      const storageRef = ref(storage, uniqueImageID)
      
      const snapshot = await uploadBytes(storageRef, blob)
      const downloadURL = await getDownloadURL(snapshot.ref)

      setImagePath(downloadURL)
      return downloadURL

    
  } catch (err) {
      console.log("Fejl: " + err);
  }
  };
  
  async function launchImagePicker() {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true
    })
    if(!result.canceled) {
      setImagePath(result.assets[0].uri)
    } 
  }


  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onLongPress={addMarker}
        >
          {markers.map(marker => (
            <Marker
              coordinate={marker.coordinate}
              key={marker.key}
              title={marker.title}
              onPress={() => onMarkerPressed(marker.title)}
            />
          ))}
      </MapView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%'
  }
});
