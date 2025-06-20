import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import database from '@react-native-firebase/database';

const VerifyScreen = ({ navigation }) => {
  const [deviceId, setDeviceId] = useState('');
  const [inputKey, setInputKey] = useState('');

  useEffect(() => {
    const id = DeviceInfo.getUniqueId();
    setDeviceId(id);
  }, []);

  const handleVerify = async () => {
    try {
      const ref = database().ref(`/accessKeys/${deviceId}`);
      const snapshot = await ref.once('value');

      if (!snapshot.exists()) {
        Alert.alert('Lỗi', 'Mã máy không tồn tại. Vui lòng liên hệ Admin.');
        return;
      }

      const data = snapshot.val();
      if (data.key === inputKey) {
        await ref.update({ isUsed: true });

        navigation.navigate('Home');
      } else {
        Alert.alert('Sai key', 'Access key không đúng.');
      }
    } catch (error) {
      Alert.alert('Lỗi hệ thống', error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Mã máy: {deviceId}</Text>
      <TextInput
        placeholder="Nhập access key"
        value={inputKey}
        onChangeText={setInputKey}
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          padding: 10,
          marginVertical: 10,
        }}
      />
      <Button title="Xác nhận" onPress={handleVerify} />
    </View>
  );
};

export default VerifyScreen;
