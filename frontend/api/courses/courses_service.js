// src/firebase/courseService.js
import { doc, collection, getDoc, getDocs, query, orderBy, addDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';


// get course details (top-level)
export async function getCourse(courseId) {
    const courseRef = doc(db, 'courses', courseId);
    const snap = await getDoc(courseRef);
    if (!snap.exists()) throw new Error('Course not found');
    return { id: snap.id, ...snap.data() };
}

// get modules for a course, ordered
export async function getCourseModules(courseId) {
    const modulesCol = collection(db, 'courses', courseId, 'modules');
    const q = query(modulesCol, orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// enroll user (userId is the Firebase Auth uid)
export async function enrollUserToCourse(userId, courseId) {
    const enrollRef = doc(db, 'users', userId, 'enrollments', courseId);
    // create with initial progress empty
    await setDoc(enrollRef, {
        enrolledAt: now(),
        progress: {}
    });
    return true;
}

// get enrollment / progress
export async function getUserEnrollment(userId, courseId) {
    const ref = doc(db, 'users', userId, 'enrollments', courseId);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
}

// mark module complete (atomic update)
export async function setModuleCompleted(userId, courseId, moduleId, completed = true) {
    const ref = doc(db, 'users', userId, 'enrollments', courseId);
    // update nested field progress.moduleId = true
    await updateDoc(ref, {
        [`progress.${moduleId}`]: completed
    });
}



// /**
//  * Create a new course in Firestore
//  * @param {Object} courseData - Course info
//  * @returns {string} - ID of the created course
//  */
// export async function createCourse(courseData) {
//     try {
//         const courseRef = await addDoc(collection(db, "courses"), {
//             title: courseData.title,
//             description: courseData.description,
//             duration: courseData.duration || "4 weeks",
//             createdAt: new Date(),
//         });
//         console.log("Course created with ID:", courseRef.id);
//         return courseRef.id;
//     } catch (error) {
//         console.error("Error creating course:", error);
//         throw error;
//     }
// }


// /**
//  * Add a module to a specific course
//  * @param {string} courseId - The ID of the course
//  * @param {Object} moduleData - Module info
//  */
// export async function addModuleToCourse(courseId, moduleData) {
//     try {
//         const moduleRef = await addDoc(collection(db, "courses", courseId, "modules"), {
//             title: moduleData.title,
//             content: moduleData.content,
//             order: moduleData.order,
//             createdAt: new Date(),
//         });
//         console.log("Module added with ID:", moduleRef.id);
//         return moduleRef.id;
//     } catch (error) {
//         console.error("Error adding module:", error);
//         throw error;
//     }
// }



export async function addCourseWithModules() {
    try {
        // STEP 1: Create a course document
        const courseId = "courseId"; // You can use a generated ID if you want
        const courseRef = doc(db, "courses", courseId);

        await setDoc(courseRef, {
            title: "How to Harvest More Effectively",
            description: "Learn how to harvest crops more efficiently and sell them for higher profits.",
            category: "Agriculture",
            level: "Beginner",
            duration: 420, // in minutes (7 hours)
            price: 500,
            thumbnail: "https://example.com/course-thumbnail.jpg",
            videoUrl: "https://example.com/course-intro.mp4",
            instructor: {
                name: "John Doe",
                bio: "An expert in organic farming with 10+ years of experience.",
                profilePicture: "https://example.com/johndoe.jpg",
            },
            ratings: {
                average: 4.5,
                totalRatings: 120,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        console.log("Course added successfully!");

        // STEP 2: Add modules as subcollection
        const modules = [
            {
                title: "Introduction",
                description: "In this module, you will learn the basics of harvesting.",
                type: "video",
                videoUrl: "https://example.com/module1.mp4",
                duration: "6 min",
                completed: true,
            },
            {
                title: "Advanced Techniques",
                description: "Learn advanced techniques for harvesting crops.",
                type: "video",
                videoUrl: "https://example.com/module2.mp4",
                duration: "12 min",
                completed: false,
            },
            {
                title: "Advanced Techniques Quiz",
                description: "Test your knowledge with a short quiz.",
                type: "quiz",
                quizId: "jhbfjhsebuhwe",
                duration: "12 min",
                completed: false,
            },
        ];

        const modulesCollectionRef = collection(courseRef, "modules");

        for (const module of modules) {
            await addDoc(modulesCollectionRef, {
                ...module,
                courseId: courseId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        }

        console.log("Modules added successfully!");
    } catch (error) {
        console.error("Error adding course with modules:", error);
    }
}

// // Run Create once to add a quiz
// (async () => {
//     await addCourseWithModules();
// })();
