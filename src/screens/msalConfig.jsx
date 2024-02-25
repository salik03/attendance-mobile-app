// import React, { useState, useEffect } from 'react';
// import { WebView } from 'react-native-webview';
// import { View, Text, Button, StyleSheet } from 'react-native';

// const MyWebView = () => {
//   const [receivedData, setReceivedData] = useState(null);
//   const [showWebView, setShowWebView] = useState(true);

//   useEffect(() => {
//     if (receivedData) {
//       console.log('Data fetched:', receivedData);
//     }
//   }, [receivedData]);

//   const handleMessage = (event) => {
//     console.log('Raw data:', event.nativeEvent.data);
//     try {
//       const data = JSON.parse(event.nativeEvent.data);
//       console.log('Parsed data:', data);
//       setReceivedData(data);
//       setShowWebView(false);
//     } catch (error) {
//       console.error('Error parsing data:', error);
//     }
//   };
  
  
  
  

//   const markAttendance = () => {

//     console.log('Attendance marked successfully!');
//   };

//   const closeWebView = () => {
//     setShowWebView(false);
//   };

//   return (
//     <View style={styles.container}>
//       {showWebView && (
//         <WebView
//         style={styles.webView}
//         source={{ uri: 'https://msal-auth-site.vercel.app/' }}
//         onMessage={handleMessage}
//         onLoadStart={() => console.log('WebView is loading')}
//         onLoad={() => console.log('WebView has loaded')}
//         onLoadEnd={() => console.log('WebView has finished loading')}
//       />
      
//       )}
//       {receivedData && (
//         <View style={styles.overlay}>
//           <Text style={styles.overlayText}>
//             Name: {receivedData.displayName}
//           </Text>
//           <Button
//             title="Mark Attendance"
//             onPress={markAttendance}
//             style={styles.button}
//           />
//           <Button
//             title="Close WebView"
//             onPress={closeWebView}
//             style={styles.button}
//           />
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   webView: {
//     flex: 3, // Adjust as needed
//     height: 50, // Adjust as needed
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     padding: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   overlayText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   button: {
//     marginTop: 10,
//   },
// });

// export default MyWebView;