import React, { useEffect, useState, useCallback, useContext } from 'react';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Alert
} from 'react-native';
import { getCourse, getCourseModules, enrollUserToCourse, getUserEnrollment, setModuleCompleted } from '../../api/courses/courses_service';
import AIChatSpace from '../AIComponents/AIChatSpace';
import { DataContext } from '../../hooks/DataContext';
import { isLoading } from 'expo-font';

// ✅ Sample fallback data based on your schema
const sampleCourse = {
    title: "How to Harvest More Effectively",
    description: "Learn how to harvest crops more efficiently and sell them for higher profits.",
    category: "Agriculture",
    level: "Beginner",
    duration: 420, // 7 hours in minutes
    price: 500,
    thumbnail: "https://example.com/course-thumbnail.jpg",
    videoUrl: "https://example.com/course-intro.mp4",
    instructor: {
        name: "John Doe",
        bio: "An expert in organic farming with 10+ years of experience.",
        profilePicture: "https://example.com/johndoe.jpg"
    },
    ratings: {
        average: 4.5,
        totalRatings: 120
    },
    points: 1000
};

const sampleModules = [
    {
        id: "moduleId1",
        courseId: "courseId",
        title: "Introduction",
        description: "In this module, you will learn the basics of harvesting.",
        type: "video",
        videoUrl: "https://example.com/module1.mp4",
        duration: "6 min",
        completed: true,
        order: 1
    },
    {
        id: "moduleId2",
        courseId: "courseId",
        title: "Advanced Techniques",
        description: "Learn advanced techniques for harvesting crops.",
        type: "video",
        videoUrl: "https://example.com/module2.mp4",
        duration: "12 min",
        completed: false,
        order: 2
    },
    {
        id: "moduleId3",
        courseId: "courseId",
        title: "Advanced Techniques Quiz",
        description: "Test your knowledge with a comprehensive quiz.",
        type: "quiz",
        quizId: "jhbfjhsebuhwe",
        duration: "Quiz",
        completed: false,
        order: 3
    },
    {
        id: "moduleId4",
        courseId: "courseId",
        title: "Best Practices",
        description: "Learn the best practices for effective harvesting.",
        type: "video",
        videoUrl: "https://example.com/module4.mp4",
        duration: "8 min",
        completed: false,
        order: 4
    },
    {
        id: "moduleId5",
        courseId: "courseId",
        title: "Final dtfg",
        description: "Complete the final quiz to earn your certificate.",
        type: "quiz",
        quizId: "finalquizid123",
        duration: "Quiz",
        completed: false,
        order: 5
    }
];

const CourseDetails = ({ navigation, route }) => {

    const { user, course,
        courseId, setCourseId,
        modules, enrollment,
        loading, setCourse,
        setModules, setEnrollment,
        setLoading } = useContext(DataContext);

    // const courseId = route?.params?.courseId ?? 'courseId';\


    // Load data from API with fallback to sample data
    const loadCourseData = useCallback(async () => {
        try {
            setLoading(pre => ({ ...pre, CourseDetails: true, Modules: true }));

            let courseData = null;
            let modulesData = [];

            try {
                // Try to fetch from API
                courseData = await getCourse(courseId);
                modulesData = await getCourseModules(courseId);
                // console.log('Fetched course data from API', courseData);
                // console.log('Fetched modules data from API', modulesData);
            } catch (apiError) {
                console.log('API Error, using sample data:', apiError.message);
            }

            // Use API data if available, otherwise use sample data
            setCourse(courseData || sampleCourse);
            setModules((modulesData && modulesData.length > 0) ? modulesData : sampleModules);

            // Try to get enrollment data if user is logged in
            if (user) {
                try {
                    const enrollmentData = await getUserEnrollment(user.uid, courseId);
                    setEnrollment(enrollmentData);
                } catch (enrollError) {
                    console.log('Enrollment fetch error:', enrollError.message);
                    setEnrollment(null);
                }
            }
        } catch (error) {
            console.error('Load data error:', error);
            // Even on error, provide sample data
            setCourse(sampleCourse);
            setModules(sampleModules);
            setEnrollment(null);
        } finally {
            setLoading(prev => ({ ...prev, CourseDetails: false, Modules: false }));
        }
    }, [courseId, user]);

    useEffect(() => {
        loadCourseData();
    }, [loadCourseData]);

    const handleEnrollNow = async () => {
        // if (!user) {
        //     Alert.alert('Login required', 'Please log in to enroll in this course');
        //     navigation.navigate('Login');
        //     return;
        // }

        // setEnrolling(true);
        // try {
        //     await enrollUserToCourse(user.uid, courseId);
        //     const enrollmentData = await getUserEnrollment(user.uid, courseId);
        //     setEnrollment(enrollmentData);
        //     Alert.alert('Success!', 'You are now enrolled in this course!');
        // } catch (error) {
        //     console.error('Enrollment error:', error);
        //     Alert.alert('Error', error.message || 'Failed to enroll. Please try again.');
        // } finally {
        //     setEnrolling(false);
        // }

        // // sample usage

        setLoading(prev => ({ ...prev, enrolling: true }));
        setTimeout(() => {
            setLoading(prev => ({ ...prev, enrolling: false }));
            Alert.alert('Success!', 'You are now enrolled in this course!');
        }, 1500);
    }

    const handleModulePress = (module) => {
        // if (!enrollment && course !== sampleCourse) {
        //     Alert.alert('Enrollment Required', 'Please enroll in this course to access modules');
        //     return;
        // }

        if (module.type === 'quiz') {
            navigation.navigate('Quiz', {
                courseTitle: course?.title || sampleCourse.title,
                moduleId: module.id,
                courseId,
                quizId: module.quizId
            });
        } else {
            navigation.navigate('CourseVideo', {
                courseTitle: course?.title || sampleCourse.title,
                moduleId: module.id,
                courseId,
                videoUrl: module.videoUrl
            });
        }

        // // // For sample usage
        // navigation.navigate('CourseVideo', {
        //     moduleId: module.id,
        //     courseId,
        //     videoUrl: module.videoUrl
        // });
    };

    // const toggleModuleComplete = async (moduleId) => {
    //     if (!user || !enrollment) {
    //         Alert.alert('Login required', 'Please log in to track progress');
    //         return;
    //     }

    //     try {
    //         const isCompleted = enrollment?.progress?.[moduleId] === true;
    //         await setModuleCompleted(user.uid, courseId, moduleId, !isCompleted);
    //         const updatedEnrollment = await getUserEnrollment(user.uid, courseId);
    //         setEnrollment(updatedEnrollment);
    //     } catch (error) {
    //         console.error('Toggle complete error:', error);
    //         Alert.alert('Error', 'Could not update progress. Please try again.');
    //     }
    // };

    if (loading.CourseDetails || loading.Modules) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#78BB1B" />
                <Text className="mt-4 text-gray-600">Loading course details...</Text>
            </SafeAreaView>
        );
    }

    const isEnrolled = !!enrollment;
    const totalModules = modules.length;
    const completedModules = enrollment ?
        Object.values(enrollment.progress || {}).filter(Boolean).length : 0;
    const progressPercentage = totalModules > 0 ?
        Math.round((completedModules / totalModules) * 100) : 0;

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
                <Text className="text-lg font-semibold">Course Details</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Course Hero Section */}
                <View className="bg-green-50 border border-lime-200 shadow-lg mx-4 mt-4 p-6 rounded-2xl">
                    <View className="flex-row items-start justify-between">
                        <View className="flex-1 pr-4">
                            <Text className="text-xl font-bold mb-3">
                                {course?.title}
                            </Text>

                            {/* Points Badge */}
                            <View className="flex-row items-center mb-4">
                                <View className="bg-yellow-500 px-3 py-1 rounded-full flex-row items-center">
                                    <MaterialIcons name="stars" size={16} color="white" />
                                    <Text className="text-white text-sm font-semibold ml-1">
                                        {course?.points || '1000+'} pts
                                    </Text>
                                </View>
                            </View>

                            {/* Course Stats */}
                            <View className="flex-row items-center">
                                <View className="flex-row items-center mr-4">
                                    <Feather name="clock" size={14} color="gray" />
                                    <Text className="text-gray-500 text-sm ml-1">
                                        {Math.ceil((course?.duration || 420) / 60)}hrs
                                    </Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Feather name="book-open" size={14} color="gray" />
                                    <Text className="text-gray-500 text-sm ml-1">{totalModules} modules</Text>
                                </View>
                            </View>

                            {/* Progress Bar (only if enrolled) */}
                            {isEnrolled && (
                                <View className="mt-4">
                                    <View className="flex-row justify-between items-center mb-1">
                                        <Text className="text-sm text-gray-600">Progress</Text>
                                        <Text className="text-sm font-semibold text-primary">
                                            {progressPercentage}%
                                        </Text>
                                    </View>
                                    <View className="w-full bg-gray-200 rounded-full h-2">
                                        <View
                                            className="bg-primary h-2 rounded-full"
                                            style={{ width: `${progressPercentage}%` }}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Course Image */}
                        <Image
                            // source={course?.thumbnail ? { uri: course.thumbnail } : require('../../assets/images/course1.png')}
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
                        {course?.description}
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
                <View className="items-center mt-6">
                    <View className="w-80 h-0.5 bg-gray-300"></View>
                </View>

                {/* Course Modules */}
                <View className="px-4 mt-6">
                    <Text className="text-xl font-bold text-gray-900 mb-4">
                        Course modules
                    </Text>

                    {modules.map((module, index) => {
                        const isCompleted = enrollment?.progress?.[module.id] === true;
                        return (
                            <TouchableOpacity
                                key={module.id}
                                onPress={() => handleModulePress(module)}
                                className="mb-3 mx-2 flex-row items-center"
                                activeOpacity={0.7}
                            >
                                {/* Module Number/Status */}
                                <View className="items-center justify-center bg-gray-100 border-[0.5px] border-primary rounded-2xl h-20 px-2 mr-2">
                                    <TouchableOpacity
                                        className="w-8 h-8 rounded-full items-center justify-center"
                                        disabled={!isEnrolled}
                                    >
                                        {isCompleted ? (
                                            <View className="w-8 h-8 bg-primary rounded-full items-center justify-center">
                                                <Feather name="check" size={16} color="white" />
                                            </View>
                                        ) : (
                                            <View className="w-8 h-8 border-2 border-gray-300 rounded-full items-center justify-center">
                                                <Text className="text-gray-600 font-semibold">{index + 1}</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>

                                {/* Module Info */}
                                <View className="flex-1 flex-row items-center bg-green-50 border-[0.5px] border-primary rounded-xl h-20 px-4">
                                    <View className="flex-1">
                                        <View className="flex-row items-center mb-1">
                                            <Text className="text-gray-900 font-semibold text-base mr-2">
                                                {module.title}
                                            </Text>
                                            <View className={`px-2 py-1 rounded-full ${module.type === 'quiz' ? 'bg-yellow-500/50' : 'bg-green-100'
                                                }`}>
                                                <Text className={`${module.type === 'quiz' ? 'text-yellow-700' : 'text-lime-700'
                                                    } text-xs font-medium`}>
                                                    {module.duration}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text className="text-gray-600 text-sm">
                                            {module.description?.split(' ').slice(0, 8).join(' ')}...
                                        </Text>
                                    </View>

                                    {/* Play Button or Quiz Button */}
                                    <TouchableOpacity
                                        className={`w-8 h-8 ${module.type === 'quiz' ? 'bg-yellow-500' : 'bg-primary'
                                            } rounded-full items-center justify-center ml-3`}
                                        onPress={() => handleModulePress(module)}
                                    >
                                        <Feather
                                            name={module.type === 'quiz' ? "zap" : "play"}
                                            size={14}
                                            color="white"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Spacer for bottom button */}
                <View className="h-20" />
            </ScrollView>

            {/* Enroll Button */}
            <View className="px-4 pb-6 bg-white border-t border-gray-100">
                <TouchableOpacity
                    onPress={handleEnrollNow}
                    className={`py-4 rounded-xl items-center ${isEnrolled ? 'bg-green-500' : 'bg-primary'
                        }`}
                    activeOpacity={0.8}
                    disabled={loading.enrolling || isEnrolled}
                >
                    <Text className="text-white font-semibold text-lg">
                        {isEnrolled ? '✓ Enrolled' : (loading.enrolling ? 'Enrolling...' : 'Enroll now')}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* AI Chat Space */}
            <AIChatSpace />
        </SafeAreaView>
    );
};

export default CourseDetails;