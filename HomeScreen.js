import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      const deviceId = await AsyncStorage.getItem('device_id');
      const wrongQuestions = await AsyncStorage.getItem('wrong_questions');

      await AsyncStorage.multiRemove([
        'user_id',
        'username',
        'is_admin',
        'key_type',
        'activation_key'
      ]);

      if (deviceId) {
        await AsyncStorage.setItem('device_id', deviceId);
      }
      if (wrongQuestions) {
        await AsyncStorage.setItem('wrong_questions', wrongQuestions);
      }

      console.log('Đăng xuất thành công');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Activation' }],
      });
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      "Xác nhận đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Đăng xuất", onPress: handleLogout, style: "destructive" }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trang chủ</Text>
        <TouchableOpacity onPress={confirmLogout}>
          <View style={styles.logoutContent}>
            <Icon name="sign-out" size={20} color="#dc3545" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Chào mừng bạn đến với KICODE!</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('StudyOptions')}
          >
            <Text style={styles.buttonText}>Ôn tập</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('PracticeTest')}
          >
            <Text style={styles.buttonText}>Thi thử</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.wrongQuestionsButton]}
            onPress={() => navigation.navigate('WrongQuestions')}
          >
            <Text style={styles.buttonText}>Câu hỏi cần lưu ý</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  logoutText: {
    marginLeft: 6,
    color: '#dc3545',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent : 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
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
  wrongQuestionsButton: {
    backgroundColor: '#ff9800',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
