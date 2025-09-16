import { Feather, Ionicons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { DataContext } from '../../hooks/DataContext';



const SearchCourses = ({ navigation }) => {

    const { allCourses, loading, wishlistedCourses, setWishlistedCourses } = useContext(DataContext);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All');


    const categories = ['All', 'Organic', 'Technology', 'Health', 'Livestock', 'Soil'];

    // Filter courses based on search and category
    const filteredCourses = allCourses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedFilter === 'All' || course.category === selectedFilter;
        return matchesSearch && matchesCategory;
    });

    if (loading.allCourses) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#78BB1B" />
                <Text className="mt-4 text-gray-600">Loading course details...</Text>
            </SafeAreaView>
        );
    }

    const toggleWishlist = (courseId) => {
        setWishlistedCourses(prev => {
            const isWishlisted = prev.includes(courseId);
            if (isWishlisted) {
                return prev.filter(prev => prev.id !== courseId);
            } else {
                const courseToAdd = allCourses.find(course => course.id === courseId);
                if (courseToAdd) {
                    return [...prev, courseToAdd];
                }
            }
        });
    };

    const handleCoursePress = (course) => {
        navigation?.navigate('CourseDetails', { courseId: course.id });
        console.log('Navigate to course details:', course.title);
        // Navigate to course details screen
    };

    const renderCategoryFilter = () => (
        <View className="px-4 mb-4">
            <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => setSelectedFilter(item)}
                        className={`mr-3 px-4 py-2 rounded-full ${selectedFilter === item
                            ? 'bg-primary'
                            : 'bg-gray-100'
                            }`}
                    >
                        <Text className={`font-medium ${selectedFilter === item
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

    const renderCourseCard = ({ item }) => {
        const isWishlisted = wishlistedCourses.includes(item.id);

        return (
            <TouchableOpacity
                onPress={() => handleCoursePress(item)}
                className="bg-white rounded-2xl p-4 mx-4 mb-4 shadow-sm border border-lime-200"
                activeOpacity={0.7}
            >
                {/* Course Image and Wishlist */}
                <View className="relative mb-3">
                    <Image
                        // source={{ uri: item.image }}
                        source={require("../../assets/images/course1.png")}
                        className="w-full h-40 rounded-xl"
                        resizeMode="cover"
                    />

                    {/* Wishlist Button */}
                    <TouchableOpacity
                        onPress={() => toggleWishlist(item.id)}
                        className={`absolute top-3 right-3 w-10 h-10 rounded-full items-center justify-center ${isWishlisted ? 'bg-red-500' : 'bg-gray-100'
                            }`}
                    >
                        <Ionicons
                            name={isWishlisted ? "heart" : "heart-outline"}
                            size={20}
                            color={isWishlisted ? "white" : "#EF4444"}
                        />
                    </TouchableOpacity>

                    {/* Level Badge */}
                    <View className="absolute bottom-3 left-3">
                        <View className={`px-3 py-1 rounded-full ${item.level === 'Beginner' ? 'bg-green-500' :
                            item.level === 'Intermediate' ? 'bg-orange-500' : 'bg-red-500'
                            }`}>
                            <Text className="text-white text-xs font-medium">{item.level}</Text>
                        </View>
                    </View>


                </View>

                {/* Course Info */}
                <View>
                    <Text className="text-lg font-bold text-gray-900 mb-1" numberOfLines={2}>
                        {item.title}
                    </Text>

                    <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
                        {item.description}
                    </Text>

                    <Text className="text-primaryDark font-medium text-sm mb-3">
                        by {item.instructor.name}
                    </Text>

                    {/* Stats Row */}
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Ionicons name="star" size={16} color="#FBB040" />
                            <Text className="text-gray-700 text-sm ml-1 font-medium">
                                {item.rating}
                            </Text>
                        </View>

                        <View className="flex-row items-center">
                            <Ionicons name="time-outline" size={16} color="#6B7280" />
                            <Text className="text-gray-600 text-sm ml-1">
                                {item.duration}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View className="flex-1 items-center justify-center px-6 py-20">
            <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
                <Feather name="search" size={32} color="#6B7280" />
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-2">No courses found</Text>
            <Text className="text-gray-600 text-center">
                Try adjusting your search or filter to find more courses
            </Text>
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

                <Text className="text-2xl font-bold text-gray-900">Search Courses</Text>

                <TouchableOpacity
                    onPress={() => navigation?.navigate('SavedCourses')}
                    className="w-8 h-8 items-center justify-center relative"
                >
                    <Ionicons name="heart-outline" size={24} color="#059669" />
                    {wishlistedCourses.length > 0 && (
                        <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                            <Text className="text-white text-xs font-bold">
                                {wishlistedCourses.length}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View className="px-4 py-4 bg-white">
                <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
                    <Feather name="search" size={20} color="#6B7280" />
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search courses, instructors..."
                        className="flex-1 ml-3 text-base text-gray-900"
                        placeholderTextColor="#9CA3AF"
                    />
                    {searchQuery ? (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Feather name="x" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>

            {/* Filter Categories */}
            {renderCategoryFilter()}

            {/* Results Count */}
            <View className="px-4 mb-2">
                <Text className="text-gray-600 text-sm">
                    {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
                    {searchQuery ? ` for "${searchQuery}"` : ''}
                </Text>
            </View>

            {/* Course List */}
            <FlatList
                data={filteredCourses}
                renderItem={renderCourseCard}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyState}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            />
        </SafeAreaView>
    );
};

export default SearchCourses;