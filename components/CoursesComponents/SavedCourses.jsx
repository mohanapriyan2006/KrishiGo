import { Feather, Ionicons } from '@expo/vector-icons';
import { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

const SavedCourses = ({ navigation }) => {
    const { user, wishlistedCourses, setWishlistedCourses, allCourses, fetchWishlist } = useContext(DataContext);
    const { t } = useTranslation();
    
    const [selectedSort, setSelectedSort] = useState('Alphabetical');
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const sortOptions = ['Alphabetical', 'Rating'];

    // Get actual course objects from allCourses based on wishlist IDs
    const savedCourses = useMemo(() => {
        return allCourses.filter(course => wishlistedCourses.includes(course.id));
    }, [allCourses, wishlistedCourses]);

    const toggleWishlist = async (courseId, courseTitle) => {
        if (wishlistLoading) return;
        if (!user?.uid) {
            alert(t('courses.saved.loginToManage'));
            return;
        }

        Alert.alert(
            t('courses.saved.removeTitle'),
            t('courses.saved.removeConfirm', { title: courseTitle }),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.remove'),
                    style: 'destructive',
                    onPress: async () => {
                        setWishlistLoading(true);
                        try {
                            await removeCourseFromWishlist(user.uid, courseId);
                            setWishlistedCourses(prev => prev.filter(id => id !== courseId));
                            // Refresh to ensure consistency
                            await fetchWishlist(user.uid);
                            Alert.alert(t('courses.saved.removedTitle'), t('courses.saved.removedMsg'));
                        } catch (error) {
                            console.log('Error removing course:', error);
                            alert(t('common.actionFailed'));
                            // Refresh wishlist on error
                            await fetchWishlist(user.uid);
                        } finally {
                            setWishlistLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const removeCourse = async (courseId, courseTitle) => {
        await toggleWishlist(courseId, courseTitle);
    };

    const handleCoursePress = (course) => {
        navigation?.navigate('CourseDetails', { courseId: course.id });
        console.log('Navigate to course:', course.title);

    };

    const getSortedCourses = () => {
        const coursesCopy = [...savedCourses];

        switch (selectedSort) {
            case 'Alphabetical':
                return coursesCopy.sort((a, b) => a.title.localeCompare(b.title));
            case 'Rating':
                return coursesCopy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
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
                            {t(`courses.saved.sort.${item.toLowerCase()}`)}
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
                        <View className={`p-1 rounded-full ${
                            item.level === 'Beginner' ? 'bg-green-500' :
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
                            disabled={wishlistLoading}
                            className={`w-8 h-8 items-center justify-center ${wishlistLoading ? 'opacity-50' : ''}`}
                        >
                            <Ionicons name="heart" size={20} color="#EF4444" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-primary font-medium text-sm mb-1">
                        by {item.instructor?.name || item.instructor}
                    </Text>

                    {/* Stats Row */}
                    <View className="flex-row items-center mb-2">
                        <View className="flex-row items-center mr-4">
                            <Ionicons name="star" size={14} color="#FBB040" />
                            <Text className="text-gray-600 text-sm ml-1">{item.rating || 'N/A'}</Text>
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
            <Text className="text-2xl font-bold text-gray-900 mb-2">{t('courses.saved.emptyTitle')}</Text>
            <Text className="text-gray-600 text-center mb-6 leading-6">
                {t('courses.saved.emptySubtitle')}
            </Text>
            <TouchableOpacity
                onPress={() => navigation?.navigate('SearchCourses')}
                className="bg-primary px-6 py-3 rounded-xl"
            >
                <Text className="text-white font-semibold">{t('courses.saved.browse')}</Text>
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

                <Text className="text-2xl font-bold text-gray-900">{t('courses.saved.title')}</Text>

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

