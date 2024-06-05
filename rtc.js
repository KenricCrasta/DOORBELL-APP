import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RTCView, mediaDevices } from 'react-native-webrtc';

export default function App() {
  const [remoteStream, setRemoteStream] = useState(null);
yar
  useEffect(() => {
    const initializeStream = async () => {
      try {
        const stream = await mediaDevices.getUserMedia({ video: true });
        setRemoteStream(stream);
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };
    initializeStream();
  }, []);

  return (
    <View style={styles.container}>
      {remoteStream && <RTCView streamURL={remoteStream.toURL()} style={styles.remoteVideo} />}
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
  remoteVideo: {
    flex: 1,
    width: '100%',
  },
});
