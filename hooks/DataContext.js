import { auth } from '../config/firebase';
import { getCourse, getCourseModules, getUserEnrollment } from '../api/courses/courses_service';
import { createContext, use, useCallback, useEffect, useState } from 'react'

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

const DataProvider = ({ children }) => {

    const user = auth.currentUser;

    const [courseId, setCourseId] = useState("courseId"); // Replace with actual course ID or get from props/context
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [enrollment, setEnrollment] = useState(null);
    const [loading, setLoading] = useState({
        CourseDetails: true,
        Modules: true,
        enrolling: false,
    });


    return (
        <DataContext.Provider
            value={{
                user,
                course, modules, enrollment, courseId, setCourseId,
                loading, setCourse, setModules, setEnrollment, setLoading
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export default DataProvider;
