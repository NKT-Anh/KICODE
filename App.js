import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ActivationScreen from './ActivationScreen';
import HomeScreen from './HomeScreen';
import StudyOptionsScreen from './StudyOptionsScreen';
import BasicStudyScreen from './BasicStudyScreen';
import AdvancedStudyScreen from './AdvancedStudyScreen';
import PracticeTestScreen from './PracticeTestScreen';
import WrongQuestionsScreen from './WrongQuestionsScreen';
import AdminScreen from './AdminScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Activation'>
        <Stack.Screen name="Activation" component={ActivationScreen} options={{ title: 'Kích hoạt' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Trang chủ' ,headerShown: false }} />
        <Stack.Screen name="StudyOptions" component={StudyOptionsScreen} options={{ title: 'Ôn tập' }} />
        <Stack.Screen name="BasicStudy" component={BasicStudyScreen} options={{ title: 'Ôn tập tin học căn bản' }} />
        <Stack.Screen name="AdvancedStudy" component={AdvancedStudyScreen} options={{ title: 'Ôn tập tin học nâng cao' }} />
        <Stack.Screen name="PracticeTest" component={PracticeTestScreen} options={{ title: 'Kiểm tra' }} />
        <Stack.Screen name="WrongQuestions" component={WrongQuestionsScreen} options={{ title: 'Câu hỏi thường sai' }} />
        <Stack.Screen name="Admin" component={AdminScreen} options={{ title: 'Quản lý Key' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
