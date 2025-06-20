import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Dimensions, Modal ,Image  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import SHA256 from 'crypto-js/sha256';

import { loadAndShuffleQuestions } from './src/utils/questionLoader';

import { styles } from './src/styles/practiceTestStyles';

const { width, height } = Dimensions.get('window');

const SECRET_BASIC = 'secret_basic';
const SECRET_ADVANCED = 'secret_advanced';

const PracticeTestScreen = ({ navigation }) => {
  const [testQuestions, setTestQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [testType, setTestType] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [keyType, setKeyType] = useState(null);
  const timerRef = useRef(null);
  const scrollViewRef = useRef(null);
  const questionLayouts = useRef({});
  const [showQuestionIndexDrawer, setShowQuestionIndexDrawer] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState({});

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

  const handleTestTypeSelect = (type) => {
    setTestType(type);
  };

  useEffect(() => {
    if (testType) {
      setLoading(true);
      setTestQuestions([]);
      setSelectedAnswers({});
      setShowResults(false);
      setTimeLeft(30 * 60);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      questionLayouts.current = {};
      setFlaggedQuestions({});

      try {
        const shuffledQuestions = loadAndShuffleQuestions(testType);
        setTestQuestions(shuffledQuestions);
      } catch (error) {
        console.error('Error loading questions in PracticeTestScreen:', error);
        Alert.alert('Lỗi', 'Không thể tải câu hỏi. Vui lòng thử lại.');
        setTestType(null);
      } finally {
        setLoading(false);
      }
    }
  }, [testType]);

  useEffect(() => {
    if (testQuestions.length > 0 && !showResults) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            handleSubmitTest();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [testQuestions, showResults]);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    if (!showResults) {
      setSelectedAnswers({
        ...selectedAnswers,
        [questionIndex]: optionIndex,
      });
    }
  };

  const handleFlagToggle = (questionIndex) => {
      setFlaggedQuestions(prevState => ({
          ...prevState,
          [questionIndex]: !prevState[questionIndex]
      }));
  };

  const getStoragePath = async () => {
    try {
      const deviceId = await AsyncStorage.getItem('device_id');
      return `${FileSystem.documentDirectory}wrong_questions_${deviceId}.json`;
    } catch (err) {
      console.log("Lỗi khi lấy đường dẫn lưu trữ:", err);
      return null;
    }
  };

  const saveWrongQuestions = async (wrongQuestions) => {
    try {
      const savedQuestions = await AsyncStorage.getItem('wrong_questions');
      let existingQuestions = savedQuestions ? JSON.parse(savedQuestions) : [];
      wrongQuestions.forEach(newQuestion => {
        const existingIndex = existingQuestions.findIndex(
          q => q.question === newQuestion.question
        );

        if (existingIndex !== -1) {
          existingQuestions[existingIndex].wrongCount += 1;
          existingQuestions[existingIndex].userAnswer = newQuestion.userAnswer;
        } else {
          existingQuestions.push({
            ...newQuestion,
            wrongCount: 1
          });
        }
      });
      await AsyncStorage.setItem('wrong_questions', JSON.stringify(existingQuestions));
    } catch (err) {
      console.log("Lỗi khi lưu câu hỏi sai:", err);
    }
  };

  const handleSubmitTest = () => {
    const unansweredQuestions = testQuestions
      .map((_, index) => selectedAnswers[index] === undefined ? index + 1 : null)
      .filter(Boolean);

    if (unansweredQuestions.length > 0) {
      Alert.alert(
        "Xác nhận nộp bài",
        `Bạn còn ${unansweredQuestions.length} câu chưa làm (Câu ${unansweredQuestions.join(', ')}). Bạn có chắc chắn muốn nộp bài?`,
        [
          {
            text: "Hủy",
            style: "cancel"
          },
          {
            text: "Nộp bài",
            onPress: () => {
              const wrongQuestions = testQuestions
                .map((question, index) => {
                  const userAnswer = question.options[selectedAnswers[index]];
                  if (userAnswer !== question.answer) {
                    return {
                      question: question.question,
                      options: question.options,
                      answer: question.answer,
                      userAnswer: userAnswer
                    };
                  }
                  return null;
                })
                .filter(Boolean);

              if (wrongQuestions.length > 0) {
                saveWrongQuestions(wrongQuestions);
              }

              setShowResults(true);
              clearInterval(timerRef.current);
            }
          }
        ]
      );
    } else {
      const wrongQuestions = testQuestions
        .map((question, index) => {
          const userAnswer = question.options[selectedAnswers[index]];
          if (userAnswer !== question.answer) {
            return {
              question: question.question,
              options: question.options,
              answer: question.answer,
              userAnswer: userAnswer
            };
          }
          return null;
        })
        .filter(Boolean);

      if (wrongQuestions.length > 0) {
        saveWrongQuestions(wrongQuestions);
      }

      setShowResults(true);
      clearInterval(timerRef.current);
    }
  };

  const handleRetry = () => {
      setTestType(null);
      setTestQuestions([]);
      setSelectedAnswers({});
      setShowResults(false);
      setTimeLeft(30 * 60);
      questionLayouts.current = {};
      setFlaggedQuestions({});
  };

  const handleExit = () => {
    Alert.alert(
      'Thoát',
      'Xác nhận rời khỏi.',
      [
        {
          text: 'Không',
          style: 'cancel'
        },
        {
          text: 'Có',
          onPress: () => {
            if (navigation?.canGoBack?.()) {
              navigation.goBack();
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const scrollToQuestion = (index) => {
      if (scrollViewRef.current && questionLayouts.current[index] !== undefined) {
          scrollViewRef.current.scrollTo({ y: questionLayouts.current[index], animated: true });
      }
       setShowQuestionIndexDrawer(false);
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
};
  const renderQuestion = (question, index) => {
    const selectedOptionIndex = selectedAnswers[index];
    const correctAnswer = question.answer;
    const isFlagged = !!flaggedQuestions[index];

    return (
      <View
        key={index}
        style={styles.questionContainer}
        onLayout={(event) => {
          questionLayouts.current[index] = event.nativeEvent.layout.y;
        }}
      >
        <View style={styles.questionHeader}>
             <Text style={styles.questionText}>
               Câu {index + 1}: {question.question}
             </Text>
             {!showResults && (
                 <TouchableOpacity onPress={() => handleFlagToggle(index)} style={styles.flagButton}>
                     <Icon name={isFlagged ? 'flag' : 'flag-o'} size={20} color={isFlagged ? '#ff9800' : '#666'} />
                 </TouchableOpacity>
             )}
        </View>
        {question.image && imageMap[question.image] && (
          <Image
          source = {imageMap[question.image]}
          style={{ width: '100%', height: 180, marginVertical: 10, borderRadius: 8, backgroundColor: '#eee' }}
          resizeMode="contain"
          onError={() => console.log('Error loading image:', question.image)}
          />
        )}
        {question.options.map((option, optIndex) => {
          const isSelected = selectedOptionIndex === optIndex;
          const isCorrect = option === correctAnswer;
          const isWrongSelected = isSelected && !isCorrect && showResults;
          const isCorrectUnselected = !isSelected && isCorrect && showResults;

          return (
            <TouchableOpacity
              key={optIndex}
              style={styles.optionButton}
              onPress={() => handleAnswerSelect(index, optIndex)}
              disabled={showResults}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.selectedOptionText,
                  isWrongSelected && styles.wrongAnswerText,
                  isCorrectUnselected && styles.correctAnswerText,
                ]}
              >
                {String.fromCharCode(65 + optIndex)}. {option}
              </Text>
            </TouchableOpacity>
          );
        })}
        {showResults && selectedOptionIndex === undefined && (
            <Text style={styles.skippedQuestionText}>Chưa trả lời</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {!testType ? (
        <View style={styles.testTypeSelection}>
          <Text style={styles.testTypeTitle}>Chọn loại bài thi:</Text>
          {keyType === 'basic' && (
            <TouchableOpacity
              style={styles.testTypeButton}
              onPress={() => handleTestTypeSelect('basic')}
            >
              <Text style={styles.testTypeButtonText}>Bài thi Cơ bản (45 câu)</Text>
            </TouchableOpacity>
          )}
          {keyType === 'advanced' && (
            <TouchableOpacity
              style={styles.testTypeButton}
              onPress={() => handleTestTypeSelect('advanced')}
            >
              <Text style={styles.testTypeButtonText}>Bài thi Nâng cao (45 câu)</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <>
           <View style={styles.header}>
               <Text style={styles.timerText}>Thời gian còn lại: {formatTime(timeLeft)}</Text>
               {!showResults && (
                   <TouchableOpacity onPress={() => setShowQuestionIndexDrawer(true)} style={styles.indexButton}>
                       <Text style={styles.indexButtonText}>Câu hỏi</Text>
                   </TouchableOpacity>
               )}
           </View>
          <ScrollView style={styles.scrollView} ref={scrollViewRef}>
            {loading ? (
              <Text style={styles.loadingText}>Đang tải câu hỏi...</Text>
            ) : testQuestions.length > 0 ? (
                testQuestions.map((question, index) => renderQuestion(question, index))
              ) : (
                <Text style={styles.noQuestionsText}>Đang tạo bộ đề thi.</Text>
              )
            }

            {!loading && testQuestions.length > 0 && !showResults && (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitTest}
              >
                <Text style={styles.submitButtonText}>
                  Nộp bài
                </Text>
              </TouchableOpacity>
            )}

            {showResults && testQuestions.length > 0 && (
              <View style={styles.resultsContainer}>
                  <Text style={styles.resultsTitle}>Kết quả:</Text>
                  <Text style={styles.resultsText}>
                      Số câu đúng: {Object.keys(selectedAnswers).filter(index => {
                        const question = testQuestions[index];
                        const selectedOptionIndex = selectedAnswers[index];
                         if (question && selectedOptionIndex !== undefined && question.options && question.options[selectedOptionIndex] !== undefined) {
                            return question.options[selectedOptionIndex] === question.answer;
                        }
                        return false;
                      }).length}
                  </Text>
                  <Text style={styles.resultsText}>
                      Tổng số câu: {testQuestions.length}
                  </Text>
                  <Text style={styles.resultsText}>
                      Điểm số: {((Object.keys(selectedAnswers).filter(index => {
                        const question = testQuestions[index];
                        const selectedOptionIndex = selectedAnswers[index];
                         if (question && selectedOptionIndex !== undefined && question.options && question.options[selectedOptionIndex] !== undefined) {
                            return question.options[selectedOptionIndex] === question.answer;
                        }
                        return false;
                      }).length / testQuestions.length) * 10).toFixed(2)}
                  </Text>

                  {/* Question Status Table */}
                  <View style={styles.statusTableContainer}>
                      <Text style={styles.statusTableTitle}>Trạng thái câu hỏi:</Text>
                      <View style={styles.statusGrid}>
                          {testQuestions.slice(0, 45).map((question, index) => {
                              const selectedOptionIndex = selectedAnswers[index];
                              const isAnswered = selectedOptionIndex !== undefined;
                              const isFlagged = !!flaggedQuestions[index];
                              let indicatorStyle = isAnswered ? styles.statusIndicatorCorrect : styles.statusIndicatorSkipped; // Green for answered, Yellow for skipped

                               if (showResults) {
                                    const isCorrect = isAnswered ? question.options[selectedOptionIndex] === question.answer : false;
                                     indicatorStyle = isAnswered ? (isCorrect ? styles.statusIndicatorCorrect : styles.statusIndicatorIncorrect) : styles.statusIndicatorSkipped;
                               }

                              return (
                                  <TouchableOpacity
                                       key={index}
                                       style={[styles.statusIndicatorButton, isFlagged && styles.statusIndicatorFlagged]}
                                       onPress={() => scrollToQuestion(index)}
                                   >
                                      <View style={[styles.statusIndicator, indicatorStyle]}>
                                          <Text style={styles.statusIndicatorText}>{index + 1}</Text>
                                      </View>
                                  </TouchableOpacity>
                              );
                          })}
                      </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#007AFF', marginTop: 15 }]}
                    onPress={handleRetry}
                  >
                    <Text style={styles.actionButtonText}>Làm lại</Text>
                  </TouchableOpacity>
                   <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#6c757d', marginTop: 10 }]}
                    onPress={handleExit}
                  >
                    <Text style={styles.actionButtonText}>Thoát</Text>
                  </TouchableOpacity>

              </View>
            )}
          </ScrollView>

            <Modal
            animationType="slide"
            transparent={true}
            visible={showQuestionIndexDrawer}
            onRequestClose={() => setShowQuestionIndexDrawer(false)}
            >
            <View style={styles.drawerOverlay}>
                <View style={styles.drawerContainer}>
                <View style={styles.drawerHeader}>
                    <Text style={styles.drawerTitle}>📋 Danh sách câu hỏi</Text>
                    <TouchableOpacity onPress={() => setShowQuestionIndexDrawer(false)}>
                    <Text style={styles.drawerCloseButton}>❌</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.drawerGrid}>
                    {testQuestions.slice(0, 45).map((_, index) => {
                    const isAnswered = selectedAnswers[index] !== undefined;
                    const isFlagged = !!flaggedQuestions[index];
                    const buttonStyle = [
                        styles.drawerQuestionButton,
                        isAnswered ? styles.drawerQuestionButtonAnswered : styles.drawerQuestionButtonUnanswered,
                        isFlagged && styles.drawerQuestionButtonFlagged,
                    ];
                    return (
                        <TouchableOpacity
                        key={index}
                        style={buttonStyle}
                        onPress={() => {
                            scrollToQuestion(index);
                            setShowQuestionIndexDrawer(false);
                        }}
                        >
                        <Text style={styles.drawerQuestionButtonText}>{index + 1}</Text>
                        </TouchableOpacity>
                    );
                    })}
                </ScrollView>
                </View>
            </View>
            </Modal>

        </>
      )}
    </View>
  );
};

export default PracticeTestScreen;
