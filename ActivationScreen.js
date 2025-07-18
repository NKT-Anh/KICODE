import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Alert, TouchableOpacity,
  ActivityIndicator, ScrollView, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import SHA256 from 'crypto-js/sha256';
import { useNavigation } from '@react-navigation/native';
import { SECRET_BASIC, SECRET_ADVANCED } from '@env';

export default function ActivationScreen() {
  const navigation = useNavigation();
  const [machineId, setMachineId] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('basic');

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      setLoading(true);

      let id = await AsyncStorage.getItem('device_id');
      if (!id) {
        id = uuid.v4();
        await AsyncStorage.setItem('device_id', id);
      }

      setMachineId(id);

      const savedKey = await AsyncStorage.getItem('activation_key');
      const expectedBasic = SHA256(id + SECRET_BASIC).toString();
      const expectedAdvanced = SHA256(id + SECRET_ADVANCED).toString();

      if (savedKey === expectedBasic || savedKey === expectedAdvanced) {
        navigation.replace('Home');
      }
    } catch (err) {
      Alert.alert("Lỗi", "Không thể khởi tạo ứng dụng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitKey = async () => {
    if (!inputKey.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập key kích hoạt!");
      return;
    }

    try {
      setLoading(true);
      const expectedBasic = SHA256(machineId + SECRET_BASIC).toString();
      const expectedAdvanced = SHA256(machineId + SECRET_ADVANCED).toString();

      if (inputKey === expectedBasic || inputKey === expectedAdvanced) {
        await AsyncStorage.setItem('activation_key', inputKey);
        Alert.alert("Thành công", "Đã kích hoạt ứng dụng!");
        navigation.replace('Home');
      } else {
        Alert.alert("Sai key", "Key không đúng với mã máy!");
      }
    } catch (err) {
      Alert.alert("Lỗi", err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(machineId);
      Alert.alert("Thành công", "Đã sao chép mã máy!");
    } catch (err) {
      Alert.alert("Lỗi", "Không thể sao chép mã máy");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang xử lý...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🔐 Kích hoạt ứng dụng</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
          <Image
            source={require('./assets/zalo.png')}
            style={{ width: 22, height: 22, marginRight: 6 }}
            resizeMode="contain"
          />
          <TouchableOpacity
            onPress={async () => {
              await Clipboard.setStringAsync('0977797378');
              Alert.alert('Đã sao chép', 'Đã sao chép số Zalo 0977797378!');
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.zaloHint, { textDecorationLine: 'underline', color: '#007AFF', marginBottom: 0 }]}>
              0977797378
            </Text>
          </TouchableOpacity>
          <Text style={[styles.zaloHint, { marginBottom: 0 }]}>: Hồ Ngọc Trung Kiên</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Mã máy của bạn:</Text>
          <TouchableOpacity
            style={styles.codeContainer}
            onPress={copyToClipboard}
          >
            <Text selectable style={styles.code}>{machineId}</Text>
            <Ionicons name="copy-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.hint}>Nhấn để sao chép mã máy</Text>
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.label}>Chọn loại key:</Text>
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <TouchableOpacity
              style={[
                styles.typeBtn,
                selectedType === 'basic' && styles.typeBtnActive,
              ]}
              onPress={() => setSelectedType('basic')}
            >
              <Text style={selectedType === 'basic' ? styles.typeTextActive : styles.typeText}>Căn bản</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeBtn,
                selectedType === 'advanced' && styles.typeBtnActive,
              ]}
              onPress={() => setSelectedType('advanced')}
            >
              <Text style={selectedType === 'advanced' ? styles.typeTextActive : styles.typeText}>Nâng cao</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        <View style={styles.section}>
          <Text style={styles.label}>Nhập Key kích hoạt:</Text>
          <TextInput
            style={styles.input}
            value={inputKey}
            onChangeText={setInputKey}
            placeholder="Nhập key được cấp"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitKey}
        >
          <Text style={styles.submitButtonText}>Kích hoạt</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.submitButton}
          onPress={() => navigation.navigate('Admin')}
        >
          <Text>
            admin
          </Text>
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  zaloHint: {
    color: '#d9534f',
    fontSize: 15,
    marginBottom: 0,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  code: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontFamily: 'monospace',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  typeBtn: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  typeBtnActive: {
    backgroundColor: '#007AFF',
  },
  typeText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  typeTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
