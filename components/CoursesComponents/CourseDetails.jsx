import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import AIChatSpace from '../AIComponents/AIChatSpace';

const CourseDetails = ({ navigation }) => {
    const courseModules = [
        {
            id: 1,
            title: 'Introduction',
            duration: '6 min',
            description: 'In this learning you will be learning how to harvest...',
            completed: true,
        },
        {
            id: 2,
            title: 'Advanced Techniques',
            duration: '12 min',
            description: 'In this learning you will be learning how to harvest...',
            completed: false,
        },
        {
            id: 3,
            title: 'Best Practices',
            duration: 'Quiz',
            description: 'In this learning you will be learning how to harvest...',
            completed: false,
        },
        {
            id: 4,
            title: 'Advanced Techniques',
            duration: '12 min',
            description: 'In this learning you will be learning how to harvest...',
            completed: false,
        },
        {
            id: 5,
            title: 'Best Practices',
            duration: 'Quiz',
            description: 'In this learning you will be learning how to harvest...',
            completed: false,
        },
        {
            id: 6,
            title: 'Advanced Techniques',
            duration: '12 min',
            description: 'In this learning you will be learning how to harvest...',
            completed: false,
        },
        {
            id: 7,
            title: 'Best Practices',
            duration: '8 min',
            description: 'In this learning you will be learning how to harvest...',
            completed: false,
        },
    ];

    const handleEnrollNow = () => {
        // Handle enrollment logic here
        console.log('Enrolling in course...');
    };

    const handleModulePress = (moduleId) => {
        // Handle module navigation
        console.log('Opening module:', moduleId);
        const isQuiz = courseModules.find(m => m.id === moduleId)?.duration === 'Quiz';
        if (isQuiz) {
            navigation.navigate('Quiz', { moduleId });
            return;
        }
        navigation.navigate('CourseVideo', { moduleId });
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-center px-4 py-3 mt-10 relative">
                <TouchableOpacity
                    onPress={() => navigation?.goBack()}
                    className="w-8 h-8 rounded-full bg-primary absolute left-5 items-center justify-center mr-4"
                >
                    <Feather name="chevron-left" size={20} color="white" />
                </TouchableOpacity>
                <Text className=" text-lg font-semibold">Course details</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Course Hero Section */}
                <View className="bg-green-50 border border-lime-200 shadow-lg shadow-green-600 mx-4 mt-4 p-6 rounded-2xl">
                    <View className="flex-row items-start justify-between">
                        <View className="flex-1 pr-4">
                            <Text className="text-xl font-bold mb-3">
                                How to Harvest more effectively
                            </Text>

                            {/* Points Badge */}
                            <View className="flex-row items-center mb-4">
                                <View className="bg-yellow-500 px-3 py-1 rounded-full flex-row items-center">
                                    <MaterialIcons name="stars" size={16} color="white" />
                                    <Text className="text-white text-sm font-semibold ml-1">1000+ pts</Text>
                                </View>
                            </View>

                            {/* Course Stats */}
                            <View className="flex-row items-center">
                                <View className="flex-row items-center mr-4">
                                    <Feather name="clock" size={14} color="gray" />
                                    <Text className="text-gray-500 text-sm ml-1">7hrs</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Feather name="book-open" size={14} color="gray" />
                                    <Text className="text-gray-500 text-sm ml-1">30 modules</Text>
                                </View>
                            </View>
                        </View>

                        {/* Illustration */}
                        <Image
                            source={require('../../assets/images/course1.png')}
                            style={{ width: 140, height: 120, opacity: 0.9 }}
                        />

                    </View>
                </View>

                {/* About Section */}
                <View className="px-4 mt-6">
                    <Text className="text-xl font-bold text-gray-900 mb-3">
                        About this course
                    </Text>
                    <Text className="text-gray-600 leading-6 mb-4">
                        In this learning you will be learning how to harvest crops more efficiently and how sell them in a higher profit ratio
                    </Text>

                    {/* Certificate Badge */}
                    <View className="flex items-center justify-center">
                        <View className="bg-green-50 p-4 rounded-xl flex-row items-center">
                            <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mr-3">
                                <MaterialIcons name="verified" size={20} color="white" />
                            </View>
                            <Text className="text-gray-700">
                                Certificate by <Text className="font-semibold text-primaryDark">KrishiGo</Text>
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Divider */}
                <View className="items-center mt-4">
                    <View className="w-80 h-0.5 bg-gray-300"></View>
                </View>

                {/* Course Modules */}
                <View className="px-4 mt-4">
                    <Text className="text-xl font-bold text-gray-900 mb-4">
                        Course modules
                    </Text>

                    {courseModules.map((module, index) => (
                        <TouchableOpacity
                            key={module.id}
                            onPress={() => handleModulePress(module.id)}
                            className=" mb-3 mx-2 flex-row items-center"
                            activeOpacity={0.7}
                        >
                            {/* Module Number/Status */}
                            <View className="items-center justify-center bg-gray-100 border-[0.5px] border-primary rounded-2xl h-20 px-2 mr-2">
                                <View className="w-8 h-8 rounded-full items-center justify-center">
                                    {module.completed ? (
                                        <View className="w-8 h-8 bg-primary rounded-full items-center justify-center">
                                            <Feather name="check" size={16} color="white" />
                                        </View>
                                    ) : (
                                        <View className="w-8 h-8 border-2 border-gray-300 rounded-full items-center justify-center">
                                            <Text className="text-gray-600 font-semibold">{index + 1}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Module Info */}
                            <View className=" flex-1 flex-row items-center bg-green-50 border-[0.5px] border-primary rounded-xl h-20 px-4">
                                <View className="flex-1">
                                    <View className="flex-row items-center mb-1">
                                        <Text className="text-gray-900 font-semibold text-base mr-2">
                                            {module.title}
                                        </Text>
                                        <View className={`px-2 py-1 rounded-full ${module.duration === 'Quiz' ? 'bg-yellow-500/50' : 'bg-green-100'}`}>
                                            <Text className={`${module.duration === 'Quiz' ? 'text-yellow-700' : 'text-lime-700'} text-xs font-medium`}>
                                                {module.duration}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text className="text-gray-600 text-sm">
                                        {module.description.split(' ').slice(0, 10).join(' ')}...
                                    </Text>
                                </View>

                                {/* Play Button or Quiz Button */}
                                <TouchableOpacity
                                    className={`w-8 h-8 ${module.duration === 'Quiz' ? 'bg-yellow-500' : 'bg-primary'} rounded-full items-center justify-center ml-3`}
                                    onPress={() => handleModulePress(module.id)}
                                >
                                    <Feather name={module.duration === 'Quiz' ? "zap" : "play"} size={14} color="white" />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Spacer for bottom button */}
                <View className="h-10" />
            </ScrollView>

            {/* Enroll Button */}
            <View className="px-4 pb-6 bg-white border-t border-gray-100">
                <TouchableOpacity
                    onPress={handleEnrollNow}
                    className="bg-primary py-4 rounded-xl items-center"
                    activeOpacity={0.8}
                >
                    <Text className="text-white font-semibold text-lg">Enroll now</Text>
                </TouchableOpacity>
            </View>

            {/* AI Chat Space */}
            <AIChatSpace />

        </SafeAreaView>
    );
};

export default CourseDetails;