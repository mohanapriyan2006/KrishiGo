// import { Ionicons } from '@expo/vector-icons';


// import { useNavigation } from '@react-navigation/native';
// import { useContext, useEffect, useState } from 'react';
// import {
//     Image,
//     SafeAreaView,
//     ScrollView,
//     Text,
//     TouchableOpacity,
//     View
// } from 'react-native';
// import { getCourseById } from '../api/courses/all_courses_service';
// import { getCourseModules } from '../api/courses/courses_service';
// import { getUserEnrolledCourses } from '../api/user/user_service';
// import ProgressLine from '../components/ProgressLine';
// import { DataContext } from '../hooks/DataContext';

// const JourneyScreen = () => {

//     const navigation = useNavigation();

//     const [activeTab, setActiveTab] = useState('Ongoing');

//     const sampleJourneyData = [
//         {
//             id: 1,
//             title: 'Introduction to Agriculture',
//             modules: '10/20 modules',
//             image: require('../assets/images/course1.png'),
//             lastOnline: 'Last online at 07:08:24',
//             progress: 50, // percentage
//             status: 'ongoing',
//             isLive: true,
//         },
//         {
//             id: 2,
//             title: 'Organic Farming Techniques',
//             modules: '8/15 modules',
//             image: require('../assets/images/course1.png'),
//             lastOnline: 'Last online at 06:45:12',
//             progress: 53,
//             status: 'ongoing',
//             isLive: false,
//         },
//         {
//             id: 3,
//             title: 'Modern Irrigation Systems',
//             modules: '5/12 modules',
//             image: require('../assets/images/course1.png'),
//             lastOnline: 'Last online at 09:30:15',
//             progress: 42,
//             status: 'ongoing',
//             isLive: true,
//         },
//     ];

//     const sampleCompletedCourses = [
//         {
//             id: 4,
//             title: 'Advanced Farming Techniques',
//             modules: '20/20 modules',
//             image: require('../assets/images/course1.png'),
//             lastOnline: 'Completed on 05:15:23',
//             progress: 100,
//             status: 'completed',
//             isLive: false,
//         },
//         {
//             id: 5,
//             title: 'Sustainable Agriculture',
//             modules: '15/15 modules',
//             image: require('../assets/images/course1.png'),
//             lastOnline: 'Completed on 04:22:18',
//             progress: 100,
//             status: 'completed',
//             isLive: false,
//         },
//         {
//             id: 6,
//             title: 'Soil Health Management',
//             modules: '10/10 modules',
//             image: require('../assets/images/course1.png'),
//             lastOnline: 'Completed on 03:15:45',
//             progress: 100,
//             status: 'completed',
//             isLive: false,
//         },
//     ];

//     const { user, userDetails } = useContext(DataContext);

//     const [journeyData, setJourneyData] = useState([]);
//     const [onProgressCourses, setOnProgressCourses] = useState(sampleJourneyData);
//     const [completedCourses, setCompletedCourses] = useState(sampleCompletedCourses);
//     const [enrollmentDetails , setEnrollmentDetails] = useState([]);

//     const getEnrollmentDetails = async () => {
//         if(!user) return;
//         const details = await getUserEnrolledCourses(user.uid);
//         setEnrollmentDetails(details);
//         console.log('Enrollment details fetched');
//         if(details && details.length > 0) {
//             const detailedCourses = [];
//             for(const enrollment of details) {
//                 const course = await getCourseById(enrollment.courseId);
//                 if(course) {
//                     detailedCourses.push({
//                         ...course,
//                         progress: enrollment.progress,
//                         status: enrollment.status
//                     });
//                 }
//             }
//             const ongoing = detailedCourses.filter(c => c.status === 'ongoing');
//             const completed = detailedCourses.filter(c => c.status === 'completed');
//             setOnProgressCourses(ongoing);
//             setCompletedCourses(completed);
//             setJourneyData(activeTab === 'Ongoing' ? ongoing : completed);
//         }
//     }



//     useEffect(() => {
//         getEnrollmentDetails();
//     }, []);

//     useEffect(() => {
//         setJourneyData(activeTab === 'Ongoing' ? onProgressCourses : completedCourses);
//     }, [activeTab]);

//     const handleResume = (courseId) => {
//         console.log('Resuming course:', courseId);
//         navigation.navigate('CourseDetails', { courseId });
//     };

//     const getModuleCompletionStatus = async (courseId) => {
//         if (enrollmentDetails.length === 0) return '0/0 modules completed';
//         const courseModules = await getCourseModules(courseId);
//         const completedModules = courseModules.filter(m => m.completed).length;
//         return `${completedModules}/${courseModules.length} modules completed`;
//     }

//     const getProgressPercentage = async (courseId) => {
//         const enrollment = enrollmentDetails.find(e => e.courseId === courseId);
//         if (!enrollment) return 0;
//         const courseModules = await getCourseModules(courseId);
//         const totalModules = courseModules.length;
//         const completedModules = enrollment ?
//         Object.values(enrollment.progress || {}).filter(Boolean).length : 0;
//         const progressPercentage = totalModules > 0 ?
//         Math.round((completedModules / totalModules) * 100) : 0;
//         return progressPercentage;
//     }




//     const renderCourseCard = (course) => (
//         <View key={course.id} className="bg-white rounded-xl shadow-md p-4 mb-4 border border-lime-200">
//             {/* Course Image and Live Indicator */}
//             <TouchableOpacity onPress={() => handleResume(course.id)}>
//                 <View className="relative mb-4">
//                     <Image
//                         source={course.image}
//                         className="w-full h-40 rounded-xl"
//                         resizeMode="cover"
//                     />

//                     {/* Status Badge */}
//                     <View className={`absolute bottom-3 left-3 ${course.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'} px-3 py-1 rounded-full flex-row items-center`}>
//                         <Ionicons name={`${course.status === 'completed' ? 'checkmark-circle' : 'time'}`} size={12} color="white" />
//                         <Text className="text-white text-xs font-medium ml-1">{course.status === 'completed' ? 'COMPLETED' : 'IN PROGRESS'}</Text>
//                     </View>
//                 </View>
//             </TouchableOpacity>

//             {/* Course Info */}
//             <View className="mb-4">
//                 {/* Course Title */}
//                 <Text className="text-gray-900 text-lg font-bold mb-2">
//                     {course.title}
//                 </Text>

//                 {/* Duration*/}
//                 <Text className="text-gray-600 text-sm mb-3">
//                     Duration - {course.duration || 'N/A'}
//                 </Text>

//                 {/* Progress Bar */}
//                 <ProgressLine progress={40} color={'#78BB1B'} bg={'#E5E5E5'} />

//                 {/* modules Count */}
//                 <Text className="text-gray-700 text-sm mt-3 font-medium">
//                     {getModuleCompletionStatus(course.id) || '0/0 modules completed'}
//                 </Text>
//             </View>

//             {/* Resume Button */}
//             <View className="flex-row justify-end">
//                 <TouchableOpacity
//                     className="bg-primary px-6 py-3 rounded-xl flex-row items-center"
//                     onPress={() => handleResume(course.id)}
//                 >
//                     <Text className="text-white font-semibold text-sm mr-2">
//                         {course.status === 'completed' ? 'Review' : 'Resume'}
//                     </Text>
//                     <Ionicons
//                         name={course.status === 'completed' ? 'refresh' : 'play'}
//                         size={16}
//                         color="white"
//                     />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );

//     return (
//         <SafeAreaView className="flex-1 bg-gray-50">
//             <ScrollView className="flex-1 mt-10" showsVerticalScrollIndicator={false}>

//                 {/* Header */}
//                 <View className="flex-row justify-between items-center px-6 py-3 bg-white">
//                     <Text className="text-2xl font-bold text-gray-900">My journey</Text>
//                     <TouchableOpacity
//                         className="w-[40px] h-[40px] bg-[#67b00019] border border-gray-200 rounded-full items-center justify-center"
//                         onPress={() => navigation.navigate('Profile')}
//                     >
//                         <Ionicons name="person-outline" size={25} color="#314C1C" />
//                     </TouchableOpacity>
//                 </View>

//                 {/* Divider */}
//                 <View className="items-center">
//                     <View className="w-60 h-0.5 bg-gray-300"></View>
//                 </View>

//                 {/* Tab Buttons */}
//                 <View className="flex-row mx-6 mt-4 mb-6">
//                     <TouchableOpacity
//                         className={`px-5 py-2 border border-primary rounded-full mr-3 ${activeTab === 'Ongoing'
//                             ? 'bg-primary'
//                             : 'bg-[#67b00019]'
//                             }`}
//                         onPress={() => setActiveTab('Ongoing')}
//                     >
//                         <Text className={`font-medium text-sm ${activeTab === 'Ongoing'
//                             ? 'text-white'
//                             : 'text-gray-700'
//                             }`}>
//                             Ongoing
//                         </Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         className={`px-5 border border-primary py-2 rounded-full ${activeTab === 'Completed'
//                             ? 'bg-primary'
//                             : 'bg-[#67b00019]'
//                             }`}
//                         onPress={() => setActiveTab('Completed')}
//                     >
//                         <Text className={`font-medium text-sm ${activeTab === 'Completed'
//                             ? 'text-white'
//                             : 'text-gray-700'
//                             }`}>
//                             Completed
//                         </Text>
//                     </TouchableOpacity>

//                 </View>

//                 {/* Course Cards */}
//                 <View className="px-6">
//                     {journeyData.map(course => renderCourseCard(course))}
//                 </View>

//                 {/* Empty State */}
//                 {journeyData.length === 0 && (
//                     <View className="items-center justify-center py-12">
//                         <Ionicons name="book-outline" size={64} color="#9CA3AF" />
//                         <Text className="text-gray-500 text-lg font-medium mt-4">
//                             No {activeTab.toLowerCase()} courses
//                         </Text>
//                         <Text className="text-gray-400 text-sm mt-2 text-center px-8">
//                             {activeTab === 'Ongoing'
//                                 ? 'Start a new course to begin your learning journey'
//                                 : 'Complete some courses to see them here'
//                             }
//                         </Text>
//                     </View>
//                 )}

//                 {/* Bottom Spacing for Tab Bar */}
//                 <View className="h-24" />
//             </ScrollView>
//         </SafeAreaView>
//     );
// };

// export default JourneyScreen;


// ...existing code...
import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    FlatList,
    Image,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { getCourseById } from '../api/courses/all_courses_service';
import { getCourseModules } from '../api/courses/courses_service';
import { getUserEnrolledCourses } from '../api/user/user_service';
import ProgressLine from '../components/ProgressLine';
import { DataContext } from '../hooks/DataContext';

const JourneyScreen = ({ navigation }) => {
    const { user , getCourseImage } = useContext(DataContext);
    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState('Ongoing');
    const [loading, setLoading] = useState(false);
    // Removed unused enrollmentDetails state
    const [onProgressCourses, setOnProgressCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);

    // Fallback samples if no data
    // const sampleJourneyData = useMemo(() => ([
    //     {
    //         id: 'sample-1',
    //         title: 'Introduction to Agriculture',
    //         duration: 'N/A',
    //         thumbnail: null,
    //         localImage: require('../assets/images/course1.png'),
    //         progress: 50,
    //         status: 'ongoing',
    //         modulesText: '10/20 modules',
    //     },
    //     {
    //         id: 'sample-2',
    //         title: 'Organic Farming Techniques',
    //         duration: 'N/A',
    //         thumbnail: null,
    //         localImage: require('../assets/images/course1.png'),
    //         progress: 53,
    //         status: 'ongoing',
    //         modulesText: '8/15 modules',
    //     },
    //     {
    //         id: 'sample-3',
    //         title: 'Modern Irrigation Systems',
    //         duration: 'N/A',
    //         thumbnail: null,
    //         localImage: require('../assets/images/course1.png'),
    //         progress: 42,
    //         status: 'ongoing',
    //         modulesText: '5/12 modules',
    //     },
    // ]), []);

    // const sampleCompletedCourses = useMemo(() => ([
    //     {
    //         id: 'sample-4',
    //         title: 'Advanced Farming Techniques',
    //         duration: 'N/A',
    //         thumbnail: null,
    //         localImage: require('../assets/images/course1.png'),
    //         progress: 100,
    //         status: 'completed',
    //         modulesText: '20/20 modules',
    //     },
    //     {
    //         id: 'sample-5',
    //         title: 'Sustainable Agriculture',
    //         duration: 'N/A',
    //         thumbnail: null,
    //         localImage: require('../assets/images/course1.png'),
    //         progress: 100,
    //         status: 'completed',
    //         modulesText: '15/15 modules',
    //     },
    //     {
    //         id: 'sample-6',
    //         title: 'Soil Health Management',
    //         duration: 'N/A',
    //         thumbnail: null,
    //         localImage: require('../assets/images/course1.png'),
    //         progress: 100,
    //         status: 'completed',
    //         modulesText: '10/10 modules',
    //     },
    // ]), []);

    const [journeyData, setJourneyData] = useState([]);

    const buildCourseViewModels = async (details) => {
        const results = await Promise.all(details.map(async (enrollment) => {
            const course = await getCourseById(enrollment.courseId);
            const modules = await getCourseModules(enrollment.courseId);

            const totalModules = Array.isArray(modules) ? modules.length : 0;
            const completedCount = enrollment?.progress
                ? Object.values(enrollment.progress).filter(Boolean).length
                : 0;

            const progress = totalModules > 0
                ? Math.round((completedCount / totalModules) * 100)
                : 0;

            const status = enrollment?.status || (progress === 100 ? 'completed' : 'ongoing');

            return {
                id: course?.id || course?.courseId || enrollment.courseId,
                title: course?.title || 'Untitled course',
                duration: course?.duration || 'N/A',
                thumbnail: course?.thumbnail || null,
                localImage: null, // fallback handled in render
                progress,
                status,
                // expose counts for i18n formatting
                completedCount,
                totalModules,
            };
        }));

        return results;
    };

    const getEnrollmentDetailsSafe = async () => {
        if (!user) {
            // No user yet; 
            return;
        }

        setLoading(true);
        try {
            const details = await getUserEnrolledCourses(user.uid);

            if (!details || details.length === 0) {
                return;
            }

            const viewModels = await buildCourseViewModels(details);
            const ongoing = viewModels.filter(c => c.status === 'ongoing');
            const completed = viewModels.filter(c => c.status === 'completed');

            setOnProgressCourses(ongoing);
            setCompletedCourses(completed);
            setJourneyData(activeTab === 'Ongoing' ? ongoing : completed);
        } catch (e) {
            console.log('Failed to load enrollments:', e?.message || e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getEnrollmentDetailsSafe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, activeTab]);

    // Keep visible list in sync when tab or data changes
    useEffect(() => {
        setJourneyData(activeTab === 'Ongoing' ? onProgressCourses : completedCourses);
    }, [activeTab, onProgressCourses, completedCourses]);

    const handleResume = (courseId) => {
        navigation.navigate('CourseDetails', { courseId });
    };

    const renderHeader = () => (
        <View>
            {/* Header */}
            <View className="flex-row justify-between items-center  py-3 bg-white">
                <Text className="text-2xl font-bold text-gray-900">{t('journey.title')}</Text>
                <TouchableOpacity
                    className="w-[40px] h-[40px] bg-[#67b00019] border border-gray-200 rounded-full items-center justify-center"
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Ionicons name="person-outline" size={25} color="#314C1C" />
                </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="items-center">
                <View className="w-60 h-0.5 bg-gray-300" />
            </View>

            {/* Tabs */}
            <View className="flex-row mx-6 mt-4 mb-6">
                <TouchableOpacity
                    className={`px-5 py-2 border border-primary rounded-full mr-3 ${activeTab === 'Ongoing' ? 'bg-primary' : 'bg-[#67b00019]'}`}
                    onPress={() => setActiveTab('Ongoing')}
                >
                    <Text className={`font-medium text-sm ${activeTab === 'Ongoing' ? 'text-white' : 'text-gray-700'}`}>
                        {t('journey.ongoing')}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`px-5 border border-primary py-2 rounded-full ${activeTab === 'Completed' ? 'bg-primary' : 'bg-[#67b00019]'}`}
                    onPress={() => setActiveTab('Completed')}
                >
                    <Text className={`font-medium text-sm ${activeTab === 'Completed' ? 'text-white' : 'text-gray-700'}`}>
                        {t('journey.completed')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderCourseCard = ({ item: course }) => {
        const imgSource = getCourseImage(course.id);

        return (
            <View key={course.id} className="bg-white rounded-xl shadow-md p-4 mb-4 border border-lime-200">
                <TouchableOpacity onPress={() => handleResume(course.id)}>
                    <View className="relative mb-4">
                        <Image
                            source={imgSource}
                            className="w-full h-40 rounded-xl"
                            resizeMode="cover"
                        />

                        {/* Status Badge */}
                        <View
                            className={`absolute bottom-3 left-3 ${course.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'} px-3 py-1 rounded-full flex-row items-center`}
                        >
                            <Ionicons
                                name={course.status === 'completed' ? 'checkmark-circle' : 'time'}
                                size={12}
                                color="white"
                            />
                            <Text className="text-white text-xs font-medium ml-1">
                                {course.status === 'completed' ? t('journey.statusCompleted') : t('journey.statusInProgress')}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Course Info */}
                <View className="mb-4">
                    <Text className="text-gray-900 text-lg font-bold mb-2">
                        {course.title}
                    </Text>

                    <Text className="text-gray-600 text-sm mb-3">
                        {t('journey.durationLabel')} - {course.duration || t('journey.na')}
                    </Text>

                    <ProgressLine progress={course.progress || 0} color={'#78BB1B'} bg={'#E5E5E5'} />

                    <Text className="text-gray-700 text-sm mt-3 font-medium">
                        {t('journey.modulesCount', { completed: course.completedCount || 0, total: course.totalModules || 0 })}
                    </Text>
                </View>

                {/* Resume/Review Button */}
                <View className="flex-row justify-end">
                    <TouchableOpacity
                        className="bg-primary px-6 py-3 rounded-xl flex-row items-center"
                        onPress={() => handleResume(course.id)}
                    >
                        <Text className="text-white font-semibold text-sm mr-2">
                            {course.status === 'completed' ? t('journey.review') : t('journey.resume')}
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
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50 pt-10">
            <FlatList
                data={journeyData}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderCourseCard}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={
                    <View className="items-center justify-center py-12">
                        <Ionicons name="book-outline" size={64} color="#9CA3AF" />
                        <Text className="text-gray-500 text-lg font-medium mt-4">
                            {activeTab === 'Ongoing' ? t('journey.emptyOngoingTitle') : t('journey.emptyCompletedTitle')}
                        </Text>
                        <Text className="text-gray-400 text-sm mt-2 text-center px-8">
                            {activeTab === 'Ongoing'
                                ? t('journey.emptyOngoingSubtitle')
                                : t('journey.emptyCompletedSubtitle')}
                        </Text>
                    </View>
                }

                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 96 }}
                showsVerticalScrollIndicator={false}
            />
            {loading && (
                <View className="absolute inset-0 bg-lime-950/20 items-center justify-center">
                    <ActivityIndicator size="large" color="#78BB1B" />
                </View>
            )}
        </SafeAreaView>
    );
};

export default JourneyScreen;