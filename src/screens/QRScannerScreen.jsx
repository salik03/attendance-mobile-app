import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Modal } from 'react-native';
import { Camera } from 'expo-camera';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import supabase from './supabase';


const QRScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const cameraRef = useRef(null);
  const [message, setMessage] = useState(null);
  const [shouldRestart, setShouldRestart] = useState(false);
  const [isInputModalVisible, setInputModalVisible] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [status, setStatus] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (scannedData) {
      const token = getTokenFromUrl(scannedData);
      if (token) {
        const fetchData = async () => {
          try {
            const response = await checkTokenValidity(token);
            handleTokenValidity(response);
          } catch (error) {
            console.error('Error during token validity check:', error);
          }
        };

        fetchData();
      }
    }
  }, [scannedData]);

  const handleTokenValidity = (status) => {
    setStatus(status); // Set the status
    switch (status) {
      case 'valid':
        setMessage('Your attendance was marked');
        setInputModalVisible(true);
        break;
      case 'invalid':
        setMessage('You\'re scanning a wrong QR');
        break;
      case 'expired':
        setMessage('Time of attendance has passed');
        break;
      default:
        setMessage('Unknown status: ' + status);
        break;
    }
  };

  const handleBarCodeScanned = ({ data }) => {
    if (!shouldRestart) {
      setScannedData(data);
    }
  };

  const handleModalSubmit = () => {
    if (emailInput.trim() && nameInput.trim()) {
      setInputModalVisible(false);
      feedData(emailInput, nameInput);
      setScannedData(null); // Set scannedData to null to show the Camera component again
    } else {
      Alert.alert('Error', 'Please enter valid email and name.');
    }
  };
  
  const handleModalCancel = () => {
    setInputModalVisible(false);
    setMessage(null);
    setStatus(null); // Clear the status
    setScannedData(null); // Set scannedData to null to show the Camera component again
  };

  
  const handleRestartButtonPress = () => {
    setScannedData(null);
    setMessage(null);
    setStatus(null); // Reset the status to clear the styles
    setShouldRestart(true);

    setTimeout(() => {
      setShouldRestart(false);
    }, 3000); // Set a timeout to prevent quick consecutive presses
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const checkTokenValidity = async (token) => {
    try {
      const response = await fetch(
        `https://sixc1f0487-145f-4e33-8897-641d33f1d0e6.onrender.com/check_status/${token}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.status;
      } else {
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.error("Error during token validity check:", error);
      return 'unknown error, inform faculty!';
    }
  };

  const feedData = async (mail, name) => {
    try {
      let { data: prevData, err } = await supabase
        .from("attendance")
        .select("*");

      if (prevData) {
        console.log(prevData.length);
      }

      const { data, error } = await supabase
        .from("attendance")
        .insert([{ id: prevData.length + 1, mail: mail, displayname: name }])
        .select();

      if (data) {
        console.log(data);
      }

      if (error) {
        console.log(error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getTokenFromUrl = (url) => {
    const queryString = url.split("?")[1];
    if (queryString) {
      const queryParams = queryString.split("&");
      for (const param of queryParams) {
        const [key, value] = param.split("=");
        if (key === "token") {
          return value;
        }
      }
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: getStatusColor(status) }]}>
      {scannedData ? (
        <>
          {status === 'valid' && (
            <Modal isVisible={isInputModalVisible}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalHeading}>Microsoft Login</Text>
                <Text>Email:</Text>
                <TextInput
                  style={styles.modalInput}
                  value={emailInput}
                  onChangeText={(text) => setEmailInput(text)}
                />
                <Text>Name:</Text>
                <TextInput
                  style={styles.modalInput}
                  value={nameInput}
                  onChangeText={(text) => setNameInput(text)}
                />
                <TouchableOpacity onPress={handleModalSubmit} style={styles.modalButton}>
                  <Text>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleModalCancel} style={styles.modalButton}>
                  <Text>Cancel</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          )}
          {message && <Text style={[styles.message, { color: getStatusTextColor(status) }]}>{message}</Text>}
          <TouchableOpacity onPress={handleRestartButtonPress} style={styles.restartButton}>
            <Text style={styles.restartButtonText}>Restart QR Check</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Camera
          style={styles.camera}
          ref={cameraRef}
          onBarCodeScanned={handleBarCodeScanned}
        />
      )}
    </View>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'valid':
      return 'lightgreen';
    default:
      return 'lightcoral';
  }
};

const getStatusTextColor = (status) => {
  switch (status) {
    case 'valid':
      return 'white';
    default:
      return 'black';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  restartButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 16,
  },  
  scannedText: {
    color: 'black',
    fontSize: 16,
    marginBottom: 10,
  },
  message: {
    color: 'black',
    fontSize: 16,
    marginTop: 10,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
    padding: 8,
  },
  modalButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default QRScannerScreen;