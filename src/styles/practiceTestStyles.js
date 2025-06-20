import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
   header: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'center',
       padding: 10,
       backgroundColor: '#fff',
       borderBottomWidth: 1,
       borderBottomColor: '#ddd',
   },
  testTypeSelection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  testTypeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  testTypeButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  testTypeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  disabledButtonText: {
    color: '#666666',
  },
  timerContainer: {
      // Styles moved to header
  },
  timerText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#dc3545',
  },
    indexButton: {
        padding: 5,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
    },
    indexButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
  scrollView: {
    flex: 1,
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
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    // marginBottom: 10, // Removed since it's in questionHeader now
    flex: 1,
    marginRight: 10,
  },
    flagButton: {
        padding: 5,
    },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  optionText: {
    fontSize: 14,
    marginLeft: 5,
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
    correctAnswerText: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  wrongAnswerText: {
    color: '#dc3545',
    fontWeight: 'bold'
  },
  skippedQuestionText: {
      fontSize: 14,
      color: '#6c757d',
      marginTop: 5,
      fontStyle: 'italic',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
   noQuestionsText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#666',
   },
   submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
   },
   submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
   },
   resultsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e9ecef',
    borderRadius: 10,
    alignItems: 'center',
   },
    resultsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
   resultsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
   },
   actionButton: {
       padding: 12,
       borderRadius: 10,
       width: '80%',
       alignItems: 'center',
   },
   actionButtonText: {
       color: '#fff',
       fontSize: 16,
       fontWeight: 'bold',
   },
   statusTableContainer: {
       marginTop: 20,
       width: '100%',
       alignItems: 'center',
   },
   statusTableTitle: {
       fontSize: 16,
       fontWeight: 'bold',
       marginBottom: 10,
   },
   statusGrid: {
       flexDirection: 'row',
       flexWrap: 'wrap',
       justifyContent: 'center',
   },
    statusIndicatorButton: {
        width: '14.28%',
        aspectRatio: 1,
        padding: 3,
    },
   statusIndicator: {
       flex: 1,
       borderRadius: 5,
       justifyContent: 'center',
       alignItems: 'center',
   },
   statusIndicatorText: {
       fontSize: 12,
       fontWeight: 'bold',
       color: '#fff',
   },
   statusIndicatorCorrect: {
       backgroundColor: '#28a745',
   },
   statusIndicatorIncorrect: {
       backgroundColor: '#dc3545',
   },
   statusIndicatorSkipped: {
       backgroundColor: '#ffc107',
   },
    statusIndicatorFlagged: {
        borderWidth: 2,
        borderColor: '#ff9800',
    },
    // Styles for the Question Index Drawer
    drawerContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    drawerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
        padding: 15,
        backgroundColor: '#fff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    drawerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    drawerCloseButton: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#dc3545',
    },
    drawerGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
        backgroundColor: '#fff',
        width: '80%',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    drawerQuestionButton: {
        width: '16.66%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        borderRadius: 5,
        margin: 2,
    },
    drawerQuestionButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    drawerQuestionButtonUnanswered: {
        backgroundColor: '#cccccc',
    },
    drawerQuestionButtonAnswered: {
        backgroundColor: '#28a745',
    },
    drawerQuestionButtonFlagged: {
         borderWidth: 2,
         borderColor: '#ff9800',
    },
    drawerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // nền mờ
        justifyContent: 'flex-end',
      },
      
      drawerContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        maxHeight: '80%',
      },
      
      drawerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
      },
      
      drawerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
      },
      
      drawerCloseButton: {
        fontSize: 24,
        color: '#888',
      },
      
      drawerGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
      },
      
      drawerQuestionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderWidth: 1,
        borderColor: '#ccc',
      },
      
      drawerQuestionButtonUnanswered: {
        backgroundColor: '#f0f0f0',
      },
      
      drawerQuestionButtonAnswered: {
        backgroundColor: '#4caf50',
      },
      
      drawerQuestionButtonFlagged: {
        borderColor: '#f44336',
        borderWidth: 2,
      },
      
      drawerQuestionButtonText: {
        color: '#000',
        fontWeight: 'bold',
      },
      
      lockText: {
        position: 'absolute',
        right: 10,
        fontSize: 20,
      },
}); 