import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
    Image,
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
            modules: '10/20 modules',
            image: require('../assets/images/course1.png'),
            lastOnline: 'Last online at 07:08:24',
            progress: 50, // percentage
            status: 'ongoing',
            isLive: true,
        },
        {
            id: 2,
            title: 'Organic Farming Techniques',
            modules: '8/15 modules',
            image: require('../assets/images/course1.png'),
            lastOnline: 'Last online at 06:45:12',
            progress: 53,
            status: 'ongoing',
            isLive: false,
        },
        {
            id: 3,
            title: 'Modern Irrigation Systems',
            modules: '5/12 modules',
            image: require('../assets/images/course1.png'),
            lastOnline: 'Last online at 09:30:15',
            progress: 42,
            status: 'ongoing',
            isLive: true,
        },
    ];

    const completedCourses = [
        {
            id: 4,
            title: 'Advanced Farming Techniques',
            modules: '20/20 modules',
            image: require('../assets/images/course1.png'),
            lastOnline: 'Completed on 05:15:23',
            progress: 100,
            status: 'completed',
            isLive: false,
        },
        {
            id: 5,
            title: 'Sustainable Agriculture',
            modules: '15/15 modules',
            image: require('../assets/images/course1.png'),
            lastOnline: 'Completed on 04:22:18',
            progress: 100,
            status: 'completed',
            isLive: false,
        },
        {
            id: 6,
            title: 'Soil Health Management',
            modules: '10/10 modules',
            image: require('../assets/images/course1.png'),
            lastOnline: 'Completed on 03:15:45',
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
        <View key={course.id} className="bg-white rounded-xl shadow-md p-4 mb-4 border border-lime-200">
            {/* Course Image and Live Indicator */}
            <TouchableOpacity onPress={() => handleResume(course.id)}>
                <View className="relative mb-4">
                    <Image
                        source={course.image}
                        className="w-full h-40 rounded-xl"
                        resizeMode="cover"
                    />

                    {/* Status Badge */}
                    <View className={`absolute bottom-3 left-3 ${course.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'} px-3 py-1 rounded-full flex-row items-center`}>
                        <Ionicons name="checkmark-circle" size={12} color="white" />
                        <Text className="text-white text-xs font-medium ml-1">{course.status === 'completed' ? 'COMPLETED' : 'IN PROGRESS'}</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Course Info */}
            <View className="mb-4">
                {/* Course Title */}
                <Text className="text-gray-900 text-lg font-bold mb-2">
                    {course.title}
                </Text>

                {/* Last Online */}
                <Text className="text-gray-600 text-sm mb-3">
                    {course.lastOnline}
                </Text>

                {/* Progress Bar */}
                <ProgressLine progress={course.progress} color={'#78BB1B'} bg={'#E5E5E5'} />

                {/* modules Count */}
                <Text className="text-gray-700 text-sm mt-3 font-medium">
                    {course.modules}
                </Text>
            </View>

            {/* Resume Button */}
            <View className="flex-row justify-end">
                <TouchableOpacity
                    className="bg-primary px-6 py-3 rounded-xl flex-row items-center"
                    onPress={() => handleResume(course.id)}
                >
                    <Text className="text-white font-semibold text-sm mr-2">
                        {course.status === 'completed' ? 'Review' : 'Resume'}
                    </Text>
                    <Ionicons
                        name={course.status === 'completed' ? 'refresh' : 'play'}
                        size={16}
                        color="white"
                    />
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
                        className="w-[40px] h-[40px] bg-[#67b00019] border border-gray-200 rounded-full items-center justify-center"
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Ionicons name="person-outline" size={25} color="#314C1C" />
                    </TouchableOpacity>
                </View>

                {/* Divider */}
                <View className="items-center">
                    <View className="w-60 h-0.5 bg-gray-300"></View>
                </View>

                {/* Tab Buttons */}
                <View className="flex-row mx-6 mt-4 mb-6">
                    <TouchableOpacity
                        className={`px-5 py-2 border border-primary rounded-full mr-3 ${activeTab === 'Ongoing'
                            ? 'bg-primary'
                            : 'bg-[#67b00019]'
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
                        className={`px-5 border border-primary py-2 rounded-full ${activeTab === 'Completed'
                            ? 'bg-primary'
                            : 'bg-[#67b00019]'
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