import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { createContext, useEffect, useState } from 'react';
import { getAllCourses } from '../api/courses/all_courses_service';
import { auth, db } from '../config/firebase';

export const DataContext = createContext();

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

// Sample course data
const sampleAllCourses = [
    {
        id: 1,
        title: 'Organic Farming Basics',
        instructor: 'Dr. Rajesh Kumar',
        duration: '4 weeks',
        rating: 4.8,
        image: require('../assets/images/course1.png'),
        category: 'Organic',
        level: 'Beginner',
        description: 'Learn the fundamentals of organic farming practices and sustainable agriculture.'
    },
    {
        id: 2,
        title: 'Modern Irrigation Techniques',
        instructor: 'Prof. Meera Sharma',
        duration: '6 weeks',
        rating: 4.9,
        image: require('../assets/images/course1.png'),
        category: 'Technology',
        level: 'Intermediate',
        description: 'Master water-efficient irrigation systems and smart farming technologies.'
    },
    {
        id: 3,
        title: 'Crop Disease Management',
        instructor: 'Dr. Anil Verma',
        duration: '5 weeks',
        rating: 4.7,
        image: require('../assets/images/course1.png'),
        category: 'Health',
        level: 'Advanced',
        description: 'Identify, prevent, and treat common crop diseases using sustainable methods.'
    },
    {
        id: 4,
        title: 'Sustainable Livestock Farming',
        instructor: 'Dr. Priya Patel',
        duration: '8 weeks',
        rating: 4.6,
        image: require('../assets/images/course1.png'),
        category: 'Livestock',
        level: 'Intermediate',
        description: 'Ethical and sustainable practices for modern livestock management.'
    },
    {
        id: 5,
        title: 'Soil Health & Nutrition',
        instructor: 'Prof. Suresh Reddy',
        duration: '3 weeks',
        rating: 4.9,
        image: require('../assets/images/course1.png'),
        category: 'Soil',
        level: 'Beginner',
        description: 'Understanding soil composition, testing, and nutrient management.'
    },
    {
        id: 6,
        title: 'Precision Agriculture',
        instructor: 'Dr. Kavita Singh',
        duration: '7 weeks',
        rating: 4.8,
        image: require('../assets/images/course1.png'),
        category: 'Technology',
        level: 'Advanced',
        description: 'Use AI, IoT, and data analytics for precision farming solutions.'
    }
];

const DataProvider = ({ children }) => {

    const navigation = useNavigation();

    const user = auth.currentUser;


    const [loading, setLoading] = useState({
        courseDetails: true,
        modules: true,
        enrolling: false,
        allCourses: false
    });

    const [wishlistedCourses, setWishlistedCourses] = useState([]);

    const [userDetails, setUserDetails] = useState(null);

    const fetchUserDetails = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                return;
            }

            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUserDetails(userData);
                console.log("Fetched user details:", userData);
            } else {
                // Fallback to display name from auth if no Firestore doc exists
                setUserDetails({
                    name: user.displayName?.split(" ")[0] || "User",
                    email: "No email",
                    phone: "No phone",
                });
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            setUserDetails({
                name: "User",
                email: "No email",
                phone: "No phone",
            });
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);


    // -----------------------------------------------------------------------------
    // ------------- All Course State & Methods -------------
    // -----------------------------------------------------------------------------

    const [allCourses, setAllCourses] = useState([]);

    useEffect(() => {
        const loadAllCourses = async () => {
            try {
                setLoading(prev => ({ ...prev, allCourses: true }));
                getAllCourses().then(courses => {
                    setAllCourses(courses);
                }).catch(err => {
                    console.error("Error fetching all courses:", err);
                    setAllCourses(sampleAllCourses); // Fallback to sample courses on error
                });
            } catch (error) {
                console.error("Error loading all courses:", error);
            } finally {
                setLoading(prev => ({ ...prev, allCourses: false }));
            }
        };

        loadAllCourses();
    }, []);




    // -----------------------------------------------------------------------------
    // -------------  Course Details State & Methods -------------
    // -----------------------------------------------------------------------------


    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    // const [enrollment, setEnrollment] = useState(null);
    const [enrollment, setEnrollment] = useState(false);


    return (
        <DataContext.Provider
            value={{
                user, loading, setLoading,
                userDetails, setUserDetails, fetchUserDetails,
                allCourses, setAllCourses,
                wishlistedCourses, setWishlistedCourses,
                course, modules, enrollment,
                setCourse, setModules, setEnrollment,
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export default DataProvider;
