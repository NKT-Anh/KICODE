import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SHA256 from 'crypto-js/sha256';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { SECRET_BASIC, SECRET_ADVANCED } from '@env';
import { SafeAreaView } from 'react-native-safe-area-context';
const AdminScreen = () => {
  const [machineId, setMachineId] = useState('');
  const [selectedType, setSelectedType] = useState('basic');
  const [generatedKey, setGeneratedKey] = useState('');
  const [keys, setKeys] = useState([]);
  const [filterType, setFilterType] = useState('all');

  const getHashedId = (id) => SHA256(id.trim()).toString();
  const generateKey = (id, secret) => SHA256(id.trim() + secret).toString();

  const handleGenerateKey = () => {
    if (!machineId) return Alert.alert('Vui lòng nhập mã máy');
    const key = generateKey(
      machineId,
      selectedType === 'basic' ? SECRET_BASIC : SECRET_ADVANCED
    );
    setGeneratedKey(key);
  };

  const handleCopyKey = async () => {
    if (generatedKey) {
      await Clipboard.setStringAsync(generatedKey);
      Alert.alert('Đã sao chép key');
    }
  };

  const handleSaveKey = async () => {
    if (!machineId) return Alert.alert('Vui lòng nhập mã máy');
    const hashId = getHashedId(machineId);
    const keyData = {
      basicKey: generateKey(machineId, SECRET_BASIC),
      advancedKey: generateKey(machineId, SECRET_ADVANCED),
    };
    try {
      await AsyncStorage.setItem(`machine_keys_${hashId}`, JSON.stringify(keyData));
      setMachineId('');
      setGeneratedKey('');
      loadKeys();
    } catch (e) {
      Alert.alert('Lỗi lưu key', e.message);
    }
  };

  const handleDeleteKey = async (hashId) => {
    try {
      await AsyncStorage.removeItem(`machine_keys_${hashId}`);
      loadKeys();
    } catch (e) {
      Alert.alert('Lỗi xóa key', e.message);
    }
  };

  const loadKeys = async () => {
    const allKeys = await AsyncStorage.getAllKeys();
    const machineKeys = allKeys.filter((key) => key.startsWith('machine_keys_'));
    const stored = await AsyncStorage.multiGet(machineKeys);
    const parsed = stored.map(([key, value]) => {
      const hashId = key.replace('machine_keys_', '');
      const obj = JSON.parse(value);
      return { hashId, ...obj };
    });
    setKeys(parsed);
  };

  useEffect(() => {
    loadKeys();
  }, []);

  const filteredKeys = keys.filter((item) => {
    if (filterType === 'basic') return item.basicKey;
    if (filterType === 'advanced') return item.advancedKey;
    return true;
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <Text style={styles.header}>Quản lý Key Offline</Text>

      <TextInput
        placeholder="Nhập mã máy"
        style={styles.input}
        value={machineId}
        onChangeText={setMachineId}
      />

      <View style={styles.typeRow}>
        <TouchableOpacity
          style={[styles.typeButton, selectedType === 'basic' && styles.typeActive]}
          onPress={() => setSelectedType('basic')}
        >
          <Text style={styles.typeText}>Căn bản</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, selectedType === 'advanced' && styles.typeActive]}
          onPress={() => setSelectedType('advanced')}
        >
          <Text style={styles.typeText}>Nâng cao</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={handleGenerateKey}>
        <Text style={styles.actionText}>Sinh Key</Text>
      </TouchableOpacity>

      {generatedKey !== '' && (
        <View style={styles.keyCard}>
          <Text style={styles.keyText}>Key: {generatedKey.slice(0, 30)}...</Text>
          <TouchableOpacity onPress={handleCopyKey}>
            <Ionicons name="copy-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
    </SafeAreaView>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 10,
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#007AFF',
  },
  typeActive: {
    backgroundColor: '#007AFF',
  },
  typeText: {
    color: 'black',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  keyCard: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  keyText: { fontSize: 13, color: '#333' },
});
