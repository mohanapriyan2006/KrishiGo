import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { setModuleCompleted } from '../api/courses/courses_service';
import { DataContext } from '../hooks/DataContext';
import ProgressLine from './ProgressLine';


const quiz_templates = [
    require('../assets/images/quiz_templates/quiz_template1.png'),
    require('../assets/images/quiz_templates/quiz_template2.png'),
    require('../assets/images/quiz_templates/quiz_template5.png'),
    require('../assets/images/quiz_templates/quiz_template3.png'),
    require('../assets/images/quiz_templates/quiz_template4.png'),
];


const QuizScreen = ({ navigation, route }) => {


    const { user } = useContext(DataContext)
    const { t } = useTranslation();
    const moduleId = route?.params?.moduleId;
    const courseId = route?.params?.courseId;
    // eslint-disable-next-line no-unused-vars
    const quizId = route?.params?.quizId;

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [score, setScore] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(120);
    const [isAnswered, setIsAnswered] = useState(false);
    const [quizImage, setQuizImage] = useState(quiz_templates[0]);

    const shuffleQuizImage = () => {
        const currentIndex = quiz_templates.indexOf(quizImage);
        const nextIndex = (currentIndex + 1) % quiz_templates.length;
        setQuizImage(quiz_templates[nextIndex]);
    };

    // Multiple quiz questions
    const quizQuestions = [
        {
            question: "Q1. Sustainable agriculture mainly focuses on:",
            options: [
                "Maximizing production at any cost",
                "Balancing environment, economy, and society",
                "Using only chemical fertilizers",
                "Exporting all farm produce"
            ],
            correctAnswer: 1
        },
        {
            question: "Q2. Which practice helps preserve soil quality?",
            options: [
                "Continuous monocropping",
                "Heavy machinery use",
                "Crop rotation",
                "Excessive irrigation"
            ],
            correctAnswer: 2
        },
        {
            question: "Q3. Organic farming avoids the use of:",
            options: [
                "Natural fertilizers",
                "Synthetic pesticides",
                "Crop diversity",
                "Biological pest control"
            ],
            correctAnswer: 1
        }
    ];

    const currentQuestionData = quizQuestions[currentQuestion - 1];

    const handleAnswerSelect = (index) => {
        if (!isAnswered) {
            setSelectedAnswer(index);
        }
    };

    const handleSubmitAnswer = () => {
        setIsAnswered(true);
        if (selectedAnswer === currentQuestionData.correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNext = async () => {
        if (currentQuestion < quizQuestions.length) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else if (currentQuestion === quizQuestions.length) {
            try { await setModuleCompleted(user.uid, courseId, moduleId) } catch (e) { console.log(e) }
            navigation.goBack();
            Alert.alert(t('quiz.completedTitle'), t('quiz.completedMsg', { score, total: quizQuestions.length }));
        }
        shuffleQuizImage();
    };

    const handlePrevious = () => {
        if (currentQuestion > 1) {
            setCurrentQuestion(currentQuestion - 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        }
    };

    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const getOptionStyle = (index) => {
        if (!isAnswered) {
            return selectedAnswer === index
                ? 'bg-lime-100 border-lime-500'
                : 'bg-gray-50 border-gray-200';
        }

        if (index === currentQuestionData.correctAnswer) {
            return 'bg-lime-100 border-lime-500';
        } else if (index === selectedAnswer && index !== currentQuestionData.correctAnswer) {
            return 'bg-red-100 border-red-500';
        } else {
            return 'bg-gray-50 border-gray-200';
        }
    };

    const getOptionIcon = (index) => {
        if (!isAnswered && selectedAnswer === index) {
            return '✓';
        } else if (isAnswered && index === currentQuestionData.correctAnswer) {
            return '✓';
        } else if (isAnswered && index === selectedAnswer && index !== currentQuestionData.correctAnswer) {
            return '✗';
        }
        return '';
    };



    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="light-content" backgroundColor="#8bc34a" />

            {/* Header */}
            <View className="bg-primary px-4 h-[80px] flex-row justify-between items-end pb-3">
                <TouchableOpacity
                    className="w-8 h-8 bg-white/20 rounded-full items-center justify-center"
                    onPress={() => navigation.goBack()}>
                    <Text className="text-white text-lg">←</Text>
                </TouchableOpacity>

                <View className="flex-row items-center gap-4">
                    <View className="bg-white/20 px-3 py-1 rounded-full">
                        <Text className="text-white font-semibold">{t('quiz.score', { score })}</Text>
                    </View>

                    <View className="flex-row items-center bg-white/20 px-3 py-1 rounded-full">
                        <Text className="text-white mr-2">⏱</Text>
                        <Text className="text-white font-semibold">{formatTime(timeRemaining)}</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1">
                {/* Illustration Container */}
                <View className="relative mx-1 my-1 rounded-2xl overflow-hidden min-h-[240px]">
                    {/* Question Board */}
                    <View className="mx-10 my-8 bg-amber-200/40 rounded-lg absolute top-[40%] z-40 ">
                        <Text className="text-gray-800 text-lg font-bold leading-6">
                            {currentQuestionData.question}
                        </Text>
                    </View>

                    <View>
                        <Image source={quizImage}
                            style={{ height: 220, width: '110%' }}
                            className="absolute -bottom-[220px] z-1" />
                    </View>

                </View>

                {/* Progress Bar */}
                <View className="mx-4 mb-4">
                    <Text className="text-gray-600 text-sm mb-2">
                        {t('quiz.progress', { current: currentQuestion, total: quizQuestions.length })}
                    </Text>
                    <ProgressLine progress={(currentQuestion / quizQuestions.length) * 100} color='#78BB1B' bg='#7eff574c' />
                </View>

                {/* Answer Options */}
                <View className="mx-4 gap-3">
                    {currentQuestionData.options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleAnswerSelect(index)}
                            className={`p-4 rounded-xl border-2 ${getOptionStyle(index)}`}
                            disabled={isAnswered}
                        >
                            <View className="flex-row items-center">
                                <View className="w-6 h-6 rounded-full border-2 mr-3 items-center justify-center border-gray-300">
                                    <Text className="text-sm font-bold">{getOptionIcon(index)}</Text>
                                </View>
                                <Text className="flex-1 text-base text-gray-700">
                                    {option}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Submit Button */}
                {selectedAnswer !== null && !isAnswered && (
                    <TouchableOpacity
                        onPress={handleSubmitAnswer}
                        className="mx-4 mt-4 bg-primary py-4 rounded-xl items-center"
                    >
                        <Text className="text-white font-semibold text-lg">{t('quiz.submitAnswer')}</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            {/* Bottom Navigation */}
            <View className="flex-row justify-between mx-4 mb-4 mt-6">
                <TouchableOpacity
                    onPress={handlePrevious}
                    disabled={currentQuestion === 1}
                    className={`flex-1 mr-2 border border-primary py-4 rounded-xl flex-row items-center justify-center ${currentQuestion === 1 ? 'bg-gray-200' : 'bg-lime-100'
                        }`}
                >
                    <Text className="text-primaryDark font-semibold">{t('quiz.previous')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleNext}
                    disabled={!isAnswered}
                    className={`flex-1 ml-2 py-4 border border-primary rounded-xl flex-row items-center justify-center ${!isAnswered ? 'bg-gray-200' : currentQuestion === quizQuestions.length ? 'bg-primary' : 'bg-lime-100'
                        }`}
                >
                    <Text className={`${currentQuestion === quizQuestions.length ? 'text-white' : 'text-primaryDark'} font-semibold`}>
                        {currentQuestion === quizQuestions.length ? t('quiz.finish') : t('quiz.next')}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export { QuizScreen };

