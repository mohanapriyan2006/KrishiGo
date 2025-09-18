import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useContext, useEffect, useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { getUserEnrollment } from '../../api/courses/courses_service';
import { DataContext } from '../../hooks/DataContext';
import AIChatSpace from '../AIComponents/AIChatSpace';


const { width } = Dimensions.get('window');

const CourseVideo = ({ navigation, route }) => {

    const { user, modules } = useContext(DataContext);

    // Get parameters from navigation
    const moduleId = route?.params?.moduleId;
    const courseId = route?.params?.courseId;
    const courseTitle = route?.params?.courseTitle || "Course Title";

    let youtubeVideoId = 'eCwRVJyjKA4';
    youtubeVideoId = route?.params?.videoUrl || youtubeVideoId;

    const [isPlaying, setIsPlaying] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);

    const [isCompleted, setIsCompleted] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [moduleData, setModuleData] = useState(null);

    useEffect(() => {
        if (modules && moduleId) {
            const mod = modules.find(m => m.id === moduleId);
            setModuleData(mod);
        }
    }, [modules, moduleId]);


    // Check if module is already completed when component loads
    useEffect(() => {
        const checkModuleCompletion = async () => {
            if (user && courseId && moduleId) {
                try {
                    const enrollment = await getUserEnrollment(user.uid, courseId);
                    if (enrollment?.progress?.[moduleId]) {
                        setIsCompleted(true);
                    }
                } catch (error) {
                    console.error('Error checking module completion:', error);
                }
            }
        };

        checkModuleCompletion();
    }, [user, courseId, moduleId]);

    // Handle marking module as completed
    const handleMarkCompleted = async () => {
        // if (!user) {
        //     Alert.alert('Login Required', 'Please log in to track your progress');
        //     return;
        // }

        // if (!courseId || !moduleId) {
        //     Alert.alert('Error', 'Course or module information is missing');
        //     return;
        // }

        // setIsUpdating(true);
        // try {
        //     const newCompletedState = !isCompleted;
        //     await setModuleCompleted(user.uid, courseId, moduleId, newCompletedState);
        //     setIsCompleted(newCompletedState);

        //     Alert.alert(
        //         'Success!',
        //         newCompletedState ? 'Module marked as completed!' : 'Module marked as incomplete',
        //         [
        //             {
        //                 text: 'Continue Learning',
        //                 onPress: () => navigation?.goBack()
        //             },
        //             {
        //                 text: 'Stay Here',
        //                 style: 'cancel'
        //             }
        //         ]
        //     );
        // } catch (error) {
        //     console.error('Error updating module completion:', error);
        //     Alert.alert('Error', 'Failed to update progress. Please try again.');
        // } finally {
        //     setIsUpdating(false);
        // }

        navigation?.goBack();
    };


    const transcript = `Efficient harvesting is a multi-stage process that begins long before the first crop is picked. It is rooted in meticulous planning and the integration of appropriate technology. The first critical step is precision timing, which involves monitoring crop maturity indicators specific to each plant—such as color, size, sugar content (Brix level), or firmness—to harvest at the exact moment of peak quality and marketable yield, ensuring the product has the best possible shelf life and nutritional value. 
    
    To execute the harvest with minimal waste and labor expense, farmers must select the right tools for their scale; this spectrum ranges from ergonomic hand tools like tapered harvesting knives and padded collection bags that reduce bruising for small-scale or delicate operations, to mechanical aids like wheeled harvest carts and adjustable platform trailers that minimize worker fatigue and handling, all the way up to specialized harvesting machinery for large-scale farms, such as potato combines or grape harvesters, which can dramatically increase the speed and volume of collection.
    
    Immediately following the harvest, the chain of efficiency continues with proactive post-harvest handling; this includes rapid field cooling (hydro-cooling or forced-air cooling) to remove field heat and halt degradation, gentle cleaning and sorting to remove damaged produce that can spoil entire batches, and proper storage in environments with controlled temperature and humidity to slow respiration rates and preserve the product's weight, appearance, and taste until it reaches the market. This entire efficient process is designed to deliver a larger volume of higher-quality goods to the point of sale with less overall cost from waste, spoilage, and redundant labor.

Selling for a higher profit ratio requires a strategic shift from simply being a producer to becoming a savvy marketer who understands value addition and market dynamics. The foundation of this is thorough market analysis, which means identifying and targeting lucrative sales channels; this could mean direct-to-consumer sales at farmers' markets or through Community Supported Agriculture (CSA) subscriptions, which often capture the full retail price, or building relationships with high-end restaurants, local grocery co-ops, and specialty stores whose customers are willing to pay a premium for freshness, locality, and unique varieties. To further justify a higher price point, farmers must actively work on value addition, which involves transforming the raw commodity into a more desirable product. This can be achieved through superior grading and consistent packaging that signals quality, pursuing organic, biodynamic, or other third-party certifications that verify your farming practices, or even minimal processing, such as washing and bagging greens, creating pre-cut vegetable mixes, or bundling products into convenient meal kits.

Ultimately, the highest profit margins are secured by practicing strategic pricing rather than just accepting the commodity price; this involves calculating your true cost of production to ensure profitability, creating a sense of scarcity and urgency by highlighting seasonal availability, and telling the story of your farm—your sustainable practices, your family's history, your passion—to build a brand that consumers trust and are loyal to, making them choose your product over a cheaper, anonymous alternative. By mastering the entire chain from field to customer, you effectively control both your costs and your revenue, thereby maximizing the profit ratio on every unit you sell.

`;


    const handlePlayPause = () => {
        setShowPlayer(true);
        setIsPlaying(true);
    };

    const onStateChange = (state) => {
        if (state === 'ended') {
            setIsPlaying(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="light-content" backgroundColor="#374151" />

            {/* Header */}
            <View className="flex-row items-center justify-center px-4 py-3 mt-10 relative">
                <TouchableOpacity
                    onPress={() => navigation?.goBack()}
                    className="w-8 h-8 rounded-full bg-primary absolute left-5 items-center justify-center mr-4"
                >
                    <Feather name="chevron-left" size={20} color="white" />
                </TouchableOpacity>
                <Text className=" text-lg font-semibold">Course video</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Course Title */}
                <View className="p-4 bg-white">
                    <Text className="text-xl font-bold text-gray-900 text-center leading-8">
                        {courseTitle}
                    </Text>
                </View>

                {/* Video Player */}
                <View className="mx-4 mb-6">
                    <View className="bg-gray-100 overflow-hidden" style={{ aspectRatio: 16 / 9 }}>
                        {showPlayer ? (
                            <YoutubePlayer
                                height={((width - 32) * 9) / 16}
                                play={isPlaying}
                                videoId={youtubeVideoId}
                                onChangeState={onStateChange}
                            />
                        ) : (
                            <View className="flex-1 border-[0.5px] border-primary rounded-xl relative">
                                {/* Farm Illustration Background */}
                                <Image source={require('../../assets/images/course1.png')}
                                    style={{ width: width - 32, height: ((width - 32) * 9) / 16, opacity: 0.4 }}
                                />

                                {/* Play Button Overlay */}
                                <TouchableOpacity
                                    onPress={handlePlayPause}
                                    className="absolute inset-0 items-center justify-center"
                                    activeOpacity={0.8}
                                >
                                    <View className="w-14 h-14 bg-lime-600/80 rounded-full items-center justify-center">
                                        <Feather
                                            name="play"
                                            size={28}
                                            color="white"
                                            style={{ marginLeft: 2 }}
                                        />
                                    </View>
                                </TouchableOpacity>

                            </View>
                        )}
                    </View>
                </View>

                {/* Introduction Section */}
                <View className="px-4 mb-4 ">
                    <Text className="text-xl text-center font-bold text-gray-900">
                        {moduleData?.title || 'Module Title'}
                    </Text>
                    <Text className="text-gray-600 text-center leading-6">
                        {moduleData?.description || 'Module description goes here. This is a brief overview of the video content.'}
                    </Text>
                </View>

                {/* Transcript Section */}
                <View className="px-4 mb-8">
                    <Text className="text-xl font-bold text-gray-900 mb-4">
                        Content
                    </Text>

                    <View className="bg-green-50 p-4 rounded-xl">
                        <Text className="text-gray-700 leading-7 text-base">
                            {transcript}
                        </Text>
                    </View>
                </View>


                {/* Action Buttons */}
                <View className="flex-row items-center justify-center mb-10 gap-4 px-4">
                    <TouchableOpacity
                        className="flex-1 bg-green-50 border-[0.5px] border-lime-500 py-4 rounded-xl items-center"
                        activeOpacity={0.8}
                        onPress={() => navigation?.goBack()}
                    >
                        <Text className="text-primaryDark font-semibold ">Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`flex-1 py-4 rounded-xl items-center ${isCompleted ? 'bg-primary' : 'bg-green-50 border-[0.5px] border-lime-500'
                            }`}
                        activeOpacity={0.8}
                        onPress={handleMarkCompleted}
                        disabled={isUpdating}
                    >
                        <Text className={`${isCompleted ? 'text-white' : 'text-primaryDark'} font-semibold`}>
                            {isUpdating
                                ? 'Updating...'
                                : isCompleted
                                    ? '✓ Completed'
                                    : 'Mark as completed'
                            }
                        </Text>
                    </TouchableOpacity>
                </View>


            </ScrollView>

            {/* AI Chat Space */}
            <AIChatSpace />

        </SafeAreaView>
    );
};

export default CourseVideo;