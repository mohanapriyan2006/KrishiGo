import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import ProgressLine from '../components/ProgressLine';

const JourneyScreen = () => {

    const navigation = useNavigation();

    const [activeTab, setActiveTab] = useState('Ongoing');

    const journeyData = [
        {
            id: 1,
            title: 'Introduction to Agriculture',
            lessons: '10/20 Lessons',
            lastOnline: 'Last online at 07:08:24',
            progress: 50, // percentage
            status: 'ongoing',
            isLive: true,
        },
        {
            id: 2,
            title: 'Introduction to Agriculture',
            lessons: '10/20 Lessons',
            lastOnline: 'Last online at 07:08:24',
            progress: 50,
            status: 'ongoing',
            isLive: true,
        },
        {
            id: 3,
            title: 'Introduction to Agriculture',
            lessons: '10/20 Lessons',
            lastOnline: 'Last online at 07:08:24',
            progress: 50,
            status: 'ongoing',
            isLive: true,
        },
    ];

    const completedCourses = [
        {
            id: 4,
            title: 'Advanced Farming Techniques',
            lessons: '20/20 Lessons',
            lastOnline: 'Completed on 05:15:23',
            progress: 100,
            status: 'completed',
            isLive: false,
        },
        {
            id: 5,
            title: 'Sustainable Agriculture',
            lessons: '15/15 Lessons',
            lastOnline: 'Completed on 04:22:18',
            progress: 100,
            status: 'completed',
            isLive: false,
        },
    ];

    const displayData = activeTab === 'Ongoing' ? journeyData : completedCourses;

    const handleResume = (courseId) => {
        console.log('Resuming course:', courseId);
        navigation.navigate('CourseDetails', { courseId });
    };


    const renderCourseCard = (course) => (
        <View key={course.id} className="bg-primary rounded-2xl p-5 mb-4 shadow-lg">
            {/* Live Indicator */}
            {course.isLive && (
                <View className="flex-row items-center mb-3">
                    <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                    <Text className="text-white text-xs opacity-90">
                        {course.lastOnline}
                    </Text>
                </View>
            )}

            {/* Course Title */}
            <Text className="text-white text-lg font-bold mb-2">
                {course.title}
            </Text>

            {/* Progress Bar */}
            <ProgressLine progress={course.progress} />

            {/* Lessons Count */}
            <Text className="text-white text-sm mt-3 opacity-90">
                {course.lessons}
            </Text>


            {/* Resume Button */}
            <View className="flex-row justify-end">
                <TouchableOpacity
                    className="bg-white px-6 py-2 rounded-lg"
                    onPress={() => handleResume(course.id)}
                >
                    <Text className="text-primaryDark font-semibold text-sm tracking-wider">
                        {course.status === 'completed' ? 'Review' : 'Resume'}
                    </Text>
                </TouchableOpacity>
            </View>


        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 mt-10" showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View className="flex-row justify-between items-center px-6 py-3 bg-white">
                    <Text className="text-2xl font-bold text-gray-900">My journey</Text>
                    <TouchableOpacity
                        className="w-[50px] h-[50px] bg-[#67b00019] rounded-full items-center justify-center"
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Ionicons name="person-outline" size={30} color="#314C1C" />
                    </TouchableOpacity>
                </View>

                {/* Divider */}
                <View className="items-center">
                    <View className="w-60 h-0.5 bg-gray-300"></View>
                </View>

                {/* Tab Buttons */}
                <View className="flex-row mx-6 mt-4 mb-6">
                    <TouchableOpacity
                        className={`px-5 py-2 border-2 border-primaryDark rounded-full mr-3 ${activeTab === 'Ongoing'
                            ? 'bg-primary'
                            : 'bg-gray-200'
                            }`}
                        onPress={() => setActiveTab('Ongoing')}
                    >
                        <Text className={`font-medium text-sm ${activeTab === 'Ongoing'
                            ? 'text-white'
                            : 'text-gray-700'
                            }`}>
                            Ongoing
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`px-5 border-2 border-primaryDark py-2 rounded-full ${activeTab === 'Completed'
                            ? 'bg-primary'
                            : 'bg-gray-200'
                            }`}
                        onPress={() => setActiveTab('Completed')}
                    >
                        <Text className={`font-medium text-sm ${activeTab === 'Completed'
                            ? 'text-white'
                            : 'text-gray-700'
                            }`}>
                            Completed
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Course Cards */}
                <View className="px-6">
                    {displayData.map(course => renderCourseCard(course))}
                </View>

                {/* Empty State */}
                {displayData.length === 0 && (
                    <View className="items-center justify-center py-12">
                        <Ionicons name="book-outline" size={64} color="#9CA3AF" />
                        <Text className="text-gray-500 text-lg font-medium mt-4">
                            No {activeTab.toLowerCase()} courses
                        </Text>
                        <Text className="text-gray-400 text-sm mt-2 text-center px-8">
                            {activeTab === 'Ongoing'
                                ? 'Start a new course to begin your learning journey'
                                : 'Complete some courses to see them here'
                            }
                        </Text>
                    </View>
                )}

                {/* Bottom Spacing for Tab Bar */}
                <View className="h-24" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default JourneyScreen;