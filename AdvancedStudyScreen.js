import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const AdvancedStudyScreen = () => {
  const [questions, setQuestions] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadAllQuestions();
  }, []);

  const loadAllQuestions = () => {
    try {
      setLoading(true);
      
      // Load JSON files using require with correct paths
      const word = require('./CauHoiNangCao/word.json');
      const excel = require('./CauHoiNangCao/excel.json');
      const ppt = require('./CauHoiNangCao/ppt.json');

      // Organize questions by topic
      setQuestions({
        'Microsoft Word': word.questions || [],
        'Microsoft Excel': excel.questions || [],
        'Microsoft PowerPoint': ppt.questions || []
      });
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = ({ item: question, index }) => {
    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          Câu {index + 1}: {question.question}
        </Text>
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
});

export default AdvancedStudyScreen; 