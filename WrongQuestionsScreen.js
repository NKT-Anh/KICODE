import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WrongQuestionsScreen = () => {
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWrongQuestions();
  }, []);

  const loadWrongQuestions = async () => {
    try {
      const savedQuestions = await AsyncStorage.getItem('wrong_questions');
      if (savedQuestions) {
        const questions = JSON.parse(savedQuestions);
        questions.sort((a, b) => b.wrongCount - a.wrongCount);
        setWrongQuestions(questions);
      }
    } catch (err) {
      console.log("Lỗi khi tải câu hỏi sai:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (index) => {
    try {
      const newQuestions = [...wrongQuestions];
      newQuestions.splice(index, 1);
      await AsyncStorage.setItem('wrong_questions', JSON.stringify(newQuestions));
      setWrongQuestions(newQuestions);
    } catch (err) {
      console.log("Lỗi khi xóa câu hỏi:", err);
      Alert.alert("Lỗi", "Không thể xóa câu hỏi. Vui lòng thử lại.");
    }
  };

  const handleClearAll = async () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có muốn xóa tất cả câu hỏi khỏi danh sách không?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xóa tất cả", 
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('wrong_questions');
              setWrongQuestions([]);
            } catch (err) {
              console.log("Lỗi khi xóa tất cả câu hỏi:", err);
              Alert.alert("Lỗi", "Không thể xóa tất cả câu hỏi. Vui lòng thử lại.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderQuestion = ({ item, index }) => {
    return (
      <View style={styles.questionContainer}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>Câu {index + 1}</Text>
          <View style={styles.headerRight}>
            <Text style={styles.wrongCount}>Sai {item.wrongCount} lần</Text>
            <TouchableOpacity 
              onPress={() => {
                Alert.alert(
                  "Xác nhận xóa",
                  "Bạn có muốn xóa câu hỏi này khỏi danh sách không?",
                  [
                    { text: "Hủy", style: "cancel" },
                    { 
                      text: "Xóa", 
                      onPress: () => handleDeleteQuestion(index),
                      style: "destructive"
                    }
                  ]
                );
              }}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Đã ôn tập</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.questionText}>{item.question}</Text>
        
        <View style={styles.answersContainer}>
          {item.options.map((option, optIndex) => {
            const isCorrect = option === item.answer;
            const isWrong = item.userAnswer === option && option !== item.answer;
            
            return (
              <View 
                key={optIndex} 
                style={[
                  styles.answerItem,
                  isCorrect && styles.correctAnswer,
                  isWrong && styles.wrongAnswer
                ]}
              >
                <Text style={styles.answerText}>
                  {String.fromCharCode(65 + optIndex)}. {option}
                </Text>
                {isCorrect && <Text style={styles.answerLabel}>✓ Đáp án đúng</Text>}
                {isWrong && <Text style={styles.answerLabel}>✗ Đáp án của bạn</Text>}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Đang tải câu hỏi...</Text>
      </View>
    );
  }

  if (wrongQuestions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Chưa có câu hỏi nào được lưu</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh sách câu hỏi sai</Text>
        <TouchableOpacity 
          onPress={handleClearAll}
          style={styles.clearAllButton}
        >
          <Text style={styles.clearAllButtonText}>Đã hoàn thành</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={wrongQuestions}
        renderItem={renderQuestion}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  clearAllButton: {
    padding: 8,
    backgroundColor: '#33CCFF',
    borderRadius: 5,
  },
  clearAllButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  questionContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  wrongCount: {
    fontSize: 14,
    color: '#dc3545',
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#33CCFF',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  questionText: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
  },
  answersContainer: {
    gap: 10,
  },
  answerItem: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f8f9fa',
  },
  correctAnswer: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  wrongAnswer: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
  },
  answerText: {
    fontSize: 15,
  },
  answerLabel: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#666',
  },
});

export default WrongQuestionsScreen; 