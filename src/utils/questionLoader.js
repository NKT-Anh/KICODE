import kienThucChungBasic from '../../CauHoiCanBan/kien_thuc_chung.json';
import lanInternetBasic from '../../CauHoiCanBan/Lan va Internet.json';
import excelBasic from '../../CauHoiCanBan/Microsoft Excel.json';
import powerpointBasic from '../../CauHoiCanBan/Microsoft Power Point.json';
import wordBasic from '../../CauHoiCanBan/Microsoft_Word.json';
// import windowsBasic from '../../CauHoiCanBan/windows_questions.json';

import wordAdvanced from '../../CauHoiNangCao/word.json';
import excelAdvanced from '../../CauHoiNangCao/excel.json';
import pptAdvanced from '../../CauHoiNangCao/ppt.json'; 


export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};


export const loadAndShuffleQuestions = (type) => {
  let questionsToUse = [];

  try {
    if (type === 'basic') {
      const basicTopics = {
        'Sử dụng Window': kienThucChungBasic.questions || [],
        'Word': wordBasic.questions || [],
        'PPT': powerpointBasic.questions || [],
        'Excel': excelBasic.questions || [],
        'Internet': lanInternetBasic.questions || [],
      };

      // Shuffle và lấy 9 câu mỗi chủ đề, giữ nguyên thứ tự nhóm
      for (const topic in basicTopics) {
        const topicQuestions = basicTopics[topic];
        const selected = shuffleArray([...topicQuestions]).slice(0, 9);
        questionsToUse = questionsToUse.concat(selected);
      }

    } else if (type === 'advanced') {
      const advancedTopics = {
        'Word': wordAdvanced.questions || [],
        'Excel': excelAdvanced.questions || [],
        'PPT': pptAdvanced.questions || [],
      };

      // Shuffle và lấy 15 câu mỗi chủ đề, giữ nguyên thứ tự nhóm
      for (const topic in advancedTopics) {
        const topicQuestions = advancedTopics[topic];
        const selected = shuffleArray([...topicQuestions]).slice(0, 15);
        questionsToUse = questionsToUse.concat(selected);
      }
    }

    // KHÔNG shuffle lại toàn bộ mảng để giữ các nhóm liền kề
    // const finalQuestions = shuffleArray(questionsToUse);

    // Chỉ shuffle đáp án trong từng câu
    const questionsWithShuffledOptions = questionsToUse.map(question => ({
      ...question,
      options: shuffleArray([...question.options])
    }));

    return questionsWithShuffledOptions;

  } catch (error) {
    console.error('Error loading or shuffling questions in questionLoader:', error);
    throw new Error('Failed to load questions'); 
  }
};