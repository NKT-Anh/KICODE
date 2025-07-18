import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image,Modal } from 'react-native';

const BasicStudyScreen = () => {
  const [questions, setQuestions] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const flatListRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    loadAllQuestions();
  }, []);

  const loadAllQuestions = () => {
    try {
      setLoading(true);
      
      const kienThucChung = require('./CauHoiCanBan/kien_thuc_chung.json');
      const lanInternet = require('./CauHoiCanBan/Lan va Internet.json');
      const excel = require('./CauHoiCanBan/Microsoft Excel.json');
      const powerpoint = require('./CauHoiCanBan/Microsoft Power Point.json');
      const word = require('./CauHoiCanBan/Microsoft_Word.json');
      // const windows = require('./CauHoiCanBan/windows_questions.json');

      setQuestions({
        'Kiến thức chung': kienThucChung.questions || [],
        'Mạng LAN và Internet': lanInternet.questions || [],
        'Microsoft Excel': excel.questions || [],
        'Microsoft PowerPoint': powerpoint.questions || [],
        'Microsoft Word': word.questions || [],
        // 'Windows': windows.questions || []
      });
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };
  const imageMap = {
  '133.png': require('./assets/133.png'),
  '134.png': require('./assets/134.png'),
  '135.png': require('./assets/135.png'),
  '136.png': require('./assets/136.png'),
  '137.png': require('./assets/137.png'),
  '138.png': require('./assets/138.png'),
  '139.png': require('./assets/139.png'),
  '140.png': require('./assets/140.png'),

  '142.png': require('./assets/142.png'),
  // thêm các ảnh khác nếu có
};
  const renderQuestion = ({ item: question, index }) => {
    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          Câu {index + 1}: {question.question}
        </Text>
        {/* Hiển thị ảnh nếu có */}
        {question.image && (
          <TouchableOpacity
            onPress={() => {
              setSelectedImage(imageMap[question.image] || { uri: question.image });
              setModalVisible(true);
            }}
          >
            <Image
              source={imageMap[question.image] || { uri: question.image }}
              style={styles.questionImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        {question.options.map((option, optIndex) => {
          const isCorrect = option === question.answer;
          return (
            <Text 
              key={optIndex} 
              style={[
                styles.answerText,
                isCorrect && styles.correctAnswerText
              ]}
            >
              {String.fromCharCode(65 + optIndex)}. {option}
            </Text>
          );
        })}
      </View>
    );
  };

  const renderTopicSelector = () => {
    return (
      <View style={styles.topicSelector}>
        {Object.keys(questions).map((topic) => (
          <TouchableOpacity
            key={topic}
            style={[
              styles.topicButton,
              selectedTopic === topic && styles.selectedTopicButton
            ]}
            onPress={() => {
              setSelectedTopic(topic);
              flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
            }}
          >
            <Text style={[
              styles.topicButtonText,
              selectedTopic === topic && styles.selectedTopicButtonText
            ]}>
              {topic}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <Text style={styles.loadingText}>Đang tải câu hỏi...</Text>;
    }
    
    if (!selectedTopic) {
      return <Text style={styles.selectTopicText}>Vui lòng chọn chủ đề để xem câu hỏi</Text>;
    }

    return (
      <FlatList
        ref={flatListRef}
        data={questions[selectedTopic]}
        renderItem={renderQuestion}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={true}
      />
    );
  };
<Modal visible={modalVisible} transparent={true}>
  <View style={styles.modalContainer}>
    <TouchableOpacity
      style={styles.modalBackground}
      onPress={() => setModalVisible(false)}
    >
      <Image
        source={selectedImage}
        style={styles.fullImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  </View>
</Modal>

  return (
    <View style={styles.container}>
      {renderTopicSelector()}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topicSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  topicButton: {
    padding: 10,
    margin: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  selectedTopicButton: {
    backgroundColor: '#007AFF',
  },
  topicButtonText: {
    color: '#333',
  },
  selectedTopicButtonText: {
    color: '#fff',
  },
  flatListContent: {
    padding: 15,
  },
  questionContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  answerText: {
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 5,
  },
  correctAnswerText: {
    color: '#28a745',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  selectTopicText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#666',
  },
    questionImage: {
    width: 200,
    height: 150,
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '80%',
  },
});

export default BasicStudyScreen;