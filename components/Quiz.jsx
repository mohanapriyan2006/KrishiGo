import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import ProgressLine from './ProgressLine';

const QuizScreen = () => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [score, setScore] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(120);
    const [isAnswered, setIsAnswered] = useState(false);

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

    const handleNext = () => {
        if (currentQuestion < quizQuestions.length) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        }
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
                ? 'bg-green-100 border-green-500'
                : 'bg-gray-50 border-gray-200';
        }

        if (index === currentQuestionData.correctAnswer) {
            return 'bg-green-100 border-green-500';
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
            <View className="bg-green-500 px-4 py-3 flex-row justify-between items-center">
                <TouchableOpacity className="w-8 h-8 bg-white/20 rounded-full items-center justify-center">
                    <Text className="text-white text-lg">←</Text>
                </TouchableOpacity>

                <View className="flex-row items-center space-x-4">
                    <View className="bg-white/20 px-3 py-1 rounded-full">
                        <Text className="text-white font-semibold">Score: {score}</Text>
                    </View>

                    <View className="flex-row items-center bg-white/20 px-3 py-1 rounded-full">
                        <Text className="text-white mr-2">⏱</Text>
                        <Text className="text-white font-semibold">{formatTime(timeRemaining)}</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1">
                {/* Illustration Container */}
                <View className="relative bg-gradient-to-b from-green-200 to-green-100 mx-4 mt-4 rounded-2xl overflow-hidden min-h-48">
                    {/* Question Board */}
                    <View className="mx-6 my-8 bg-gradient-to-b from-amber-50 to-amber-200 border-4 border-amber-800 rounded-lg p-4 relative shadow-lg">
                        <Text className="text-gray-800 text-base font-medium leading-6">
                            {currentQuestionData.question}
                        </Text>

                        {/* Board corners */}
                        <View className="absolute -top-2 -left-2 w-4 h-4 bg-amber-800 rounded-full" />
                        <View className="absolute -top-2 -right-2 w-4 h-4 bg-amber-800 rounded-full" />
                        <View className="absolute -bottom-2 -left-2 w-4 h-4 bg-amber-800 rounded-full" />
                        <View className="absolute -bottom-2 -right-2 w-4 h-4 bg-amber-800 rounded-full" />
                    </View>
                </View>

                {/* Progress Bar */}
                <View className="mx-4 mb-4">
                    <Text className="text-gray-600 text-sm mb-2">
                        Question {currentQuestion} of {quizQuestions.length}
                    </Text>
                    <ProgressLine progress={(currentQuestion / quizQuestions.length) * 100} color='#78BB1B' bg='#7eff574c' />
                </View>

                {/* Answer Options */}
                <View className="mx-4 space-y-3">
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
                        className="mx-4 mt-4 bg-blue-500 py-4 rounded-xl items-center"
                    >
                        <Text className="text-white font-semibold text-lg">Submit Answer</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            {/* Bottom Navigation */}
            <View className="flex-row justify-between mx-4 mb-4 mt-6">
                <TouchableOpacity
                    onPress={handlePrevious}
                    disabled={currentQuestion === 1}
                    className={`flex-1 mr-2 py-4 rounded-xl flex-row items-center justify-center ${currentQuestion === 1 ? 'bg-gray-200' : 'bg-green-200'
                        }`}
                >
                    <Text className="text-green-800 font-semibold">← Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleNext}
                    disabled={!isAnswered || currentQuestion === quizQuestions.length}
                    className={`flex-1 ml-2 py-4 rounded-xl flex-row items-center justify-center ${!isAnswered || currentQuestion === quizQuestions.length ? 'bg-gray-200' : 'bg-green-200'
                        }`}
                >
                    <Text className="text-green-800 font-semibold">
                        {currentQuestion === quizQuestions.length ? 'Finish' : 'Next →'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export { QuizScreen };
