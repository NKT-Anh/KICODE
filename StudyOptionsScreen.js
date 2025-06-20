import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SHA256 from 'crypto-js/sha256';

import { SECRET_BASIC, SECRET_ADVANCED } from '@env';

const StudyOptionsScreen = () => {
  const navigation = useNavigation();
  const [keyType, setKeyType] = useState(null);

  useEffect(() => {
    checkKeyType();
  }, []);

  const checkKeyType = async () => {
    try {
      const deviceId = await AsyncStorage.getItem('device_id');
      const activationKey = await AsyncStorage.getItem('activation_key');
      if (deviceId && activationKey) {
        const basicKey = SHA256(deviceId + SECRET_BASIC).toString();
        const advancedKey = SHA256(deviceId + SECRET_ADVANCED).toString();
        if (activationKey === basicKey) setKeyType('basic');
        else if (activationKey === advancedKey) setKeyType('advanced');
        else setKeyType(null);
      }
    } catch (err) {
      console.log("Lỗi khi kiểm tra loại key:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn chương trình học</Text>
      
      <View style={styles.buttonContainer}>
        {keyType === 'advanced' && (
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('AdvancedStudy')}
          >
            <Text style={styles.buttonText}>Tin học nâng cao</Text>
          </TouchableOpacity>
        )}
        {keyType === 'basic' && (
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('BasicStudy')}
          >
            <Text style={styles.buttonText}>Tin học căn bản</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StudyOptionsScreen;