import { Feather, Ionicons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { removeCourseFromWishlist } from '../../api/user/user_service';
import { DataContext } from '../../hooks/DataContext';

const sampleSavedCourses = [
    {
        id: 1,
        title: 'Organic Farming Basics',
        instructor: 'Jane Doe',
        rating: 4.5,
        duration: '3h 20m',
        level: 'Beginner',
        image: require('../../assets/images/course1.png'),
        description: 'Learn the fundamentals of organic farming and sustainable agriculture.'
    },
    {
        id: 2,
        title: 'Advanced Irrigation Techniques',
        instructor: 'John Smith',
        rating: 4.7,
        duration: '4h 10m',
        level: 'Intermediate',
        image: require('../../assets/images/course1.png'),
        description: 'Explore modern irrigation methods to optimize water usage in farming.'
    },
    {
        id: 3,
        title: 'Precision Agriculture with IoT',
        instructor: 'Alice Johnson',
        rating: 4.9,
        duration: '5h 00m',
        level: 'Advanced',
        image: require('../../assets/images/course1.png'),
        description: 'Utilize IoT technologies to enhance precision farming practices.'
    }
];

const SavedCourses = ({ navigation }) => {
    // Sample saved courses data - in real app this would come from storage/API
    const { user, wishlistedCourses, setWishlistedCourses } = useContext(DataContext);

    const [selectedSort, setSelectedSort] = useState('Alphabetical');
    const sortOptions = ['Alphabetical', 'Rating'];

    const removeCourse = async (courseId, courseTitle) => {
        Alert.alert(
            'Remove Course',
            `Remove "${courseTitle}" from your saved courses?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        await removeCourseFromWishlist(user.uid, courseId);
                        setWishlistedCourses(prev => prev.filter(course => course.id !== courseId));
                        Alert.alert('Removed', 'Course removed from saved list');
                    }
                }
            ]
        );
    };

    const handleCoursePress = (course) => {
        navigation?.navigate('CourseDetails', { courseId: course.id });
        console.log('Navigate to course:', course.title);

    };

    const getSortedCourses = () => {
        const coursesCopy = [...wishlistedCourses];

        switch (selectedSort) {
            case 'Alphabetical':
                return coursesCopy.sort((a, b) => a.title.localeCompare(b.title));
            case 'Rating':
                return coursesCopy.sort((a, b) => b.rating - a.rating);
            default:
                return coursesCopy;
        }
    };

    const renderSortOptions = () => (
        <View className="px-4 mb-4 mt-4">
            <FlatList
                data={sortOptions}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => setSelectedSort(item)}
                        className={`mr-3 px-4 py-2 rounded-full border ${selectedSort === item
                            ? 'bg-primary border-primary'
                            : 'bg-white border-gray-300'
                            }`}
                    >
                        <Text className={`font-medium ${selectedSort === item
                            ? 'text-white'
                            : 'text-gray-700'
                            }`}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );

    const renderCourseCard = ({ item }) => (
        <TouchableOpacity
            onPress={() => handleCoursePress(item)}
            className="bg-white rounded-2xl p-4 mx-4 mb-4 shadow-sm border border-lime-200"
            activeOpacity={0.7}
        >
            <View className="flex-row">
                {/* Course Image */}
                <View className="relative mr-4">
                    <Image
                        source={item.image}
                        className="w-20 h-20 rounded-xl"
                        resizeMode="cover"
                    />
                    {/* Level Badge */}
                    <View className="absolute -top-1 -right-1">
                        <View className={`p-1 rounded-full ${item.level === 'Beginner' ? 'bg-green-500' :
                            item.level === 'Intermediate' ? 'bg-orange-500' : 'bg-red-500'
                            }`}>
                            <Text className="text-white text-xs font-medium">{item.level}</Text>
                        </View>
                    </View>
                </View>

                {/* Course Info */}
                <View className="flex-1">
                    {/* Header with remove button */}
                    <View className="flex-row justify-between items-start mb-1">
                        <Text className="text-lg font-bold text-gray-900 flex-1 mr-2" numberOfLines={2}>
                            {item.title}
                        </Text>
                        <TouchableOpacity
                            onPress={() => removeCourse(item.id, item.title)}
                            className="w-8 h-8 items-center justify-center"
                        >
                            <Ionicons name="heart" size={20} color="#EF4444" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-primary font-medium text-sm mb-1">
                        by {item.instructor.name}
                    </Text>

                    {/* Stats Row */}
                    <View className="flex-row items-center mb-2">
                        <View className="flex-row items-center mr-4">
                            <Ionicons name="star" size={14} color="#FBB040" />
                            <Text className="text-gray-600 text-sm ml-1">{item.rating}</Text>
                        </View>

                        <View className="flex-row items-center mr-4">
                            <Ionicons name="time-outline" size={14} color="#6B7280" />
                            <Text className="text-gray-600 text-sm ml-1">{item.duration}</Text>
                        </View>

                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View className="flex-1 items-center justify-center px-6 py-20">
            <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
                <Ionicons name="bookmark-outline" size={40} color="#6B7280" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-2">No Saved Courses</Text>
            <Text className="text-gray-600 text-center mb-6 leading-6">
                You haven&apos;t saved any courses yet. Browse our course catalog and save courses you&apos;re interested in.
            </Text>
            <TouchableOpacity
                onPress={() => navigation?.navigate('SearchCourses')}
                className="bg-primary px-6 py-3 rounded-xl"
            >
                <Text className="text-white font-semibold">Browse Courses</Text>
            </TouchableOpacity>
        </View>
    );


    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 mt-10 bg-white">
                <TouchableOpacity
                    onPress={() => navigation?.goBack()}
                    className="w-8 h-8 rounded-full bg-primary items-center justify-center"
                >
                    <Feather name="chevron-left" size={20} color="white" />
                </TouchableOpacity>

                <Text className="text-2xl font-bold text-gray-900">Saved Courses</Text>

                <TouchableOpacity
                    onPress={() => navigation?.navigate('SearchCourses')}
                    className="w-8 h-8 items-center justify-center"
                >
                    <Feather name="plus" size={24} color="#059669" />
                </TouchableOpacity>
            </View>

            {wishlistedCourses.length > 0 ? (
                <FlatList
                    data={getSortedCourses()}
                    renderItem={renderCourseCard}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <View>
                            {renderSortOptions()}
                        </View>
                    }
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            ) : (
                renderEmptyState()
            )}
        </SafeAreaView>
    );
};

export default SavedCourses;

