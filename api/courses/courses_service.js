// src/firebase/courseService.js
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';


// get course details (top-level)
export async function getCourse(courseId) {
    try {
        const courseRef = doc(db, 'courses', courseId);
        const snap = await getDoc(courseRef);
        if (!snap.exists()) {
            throw new Error('Course not found');
        }
        return { id: snap.id, ...snap.data() };
    } catch (error) {
        console.error('Error fetching course:', error);
        throw error;
    }
}

// get modules for a course, ordered
export async function getCourseModules(courseId) {
    try {
        const modulesCol = collection(db, 'courses', courseId, 'modules');
        // Try with order field first, if it fails, get all without ordering
        let snap;
        try {
            const q = query(modulesCol, orderBy('order', 'asc'));
            snap = await getDocs(q);
        } catch (orderError) {
            console.log('Order field not found, fetching without ordering');
            // Fallback: get all modules without ordering
            snap = await getDocs(modulesCol);
        }

        const modules = snap.docs.map(d => ({
            id: d.id,
            ...d.data()
        }));

        // // If no order field exists, sort by title or creation date
        // if (modules.length > 0 && !modules[0].order) {
        //     modules.sort((a, b) => {
        //         // Try to sort by createdAt if available
        //         if (a.createdAt && b.createdAt) {
        //             return new Date(a.createdAt) - new Date(b.createdAt);
        //         }
        //         // Fallback to alphabetical by title
        //         return a.title.localeCompare(b.title);
        //     });
        // }

        return modules;
    } catch (error) {
        console.error('Error fetching course modules:', error);
        throw error;
    }
}

// enroll user (userId is the Firebase Auth uid)
export async function enrollUserToCourse(userId, courseId) {
    try {
        const enrollRef = doc(db, 'users', userId, 'enrollments', courseId);
        // create with initial progress empty
        await setDoc(enrollRef, {
            courseId: courseId,
            enrolledAt: new Date(),
            progress: {},
            status: 'ongoing' // or 'completed'
        });
        return true;
    } catch (error) {
        console.error('Error enrolling user:', error);
        throw error;
    }
}

// get enrollment / progress
export async function getUserEnrollment(userId, courseId) {
    try {
        const ref = doc(db, 'users', userId, 'enrollments', courseId);
        const snap = await getDoc(ref);
        return snap.exists() ? snap.data() : null;
    } catch (error) {
        console.error('Error fetching user enrollment:', error);
        return null; // Return null instead of throwing to allow graceful fallback
    }
}

// mark module complete (atomic update)
export async function setModuleCompleted(userId, courseId, moduleId, completed = true) {
    try {
        const ref = doc(db, 'users', userId, 'enrollments', courseId);
        await updateDoc(ref, {
            [`progress.${moduleId}`]: completed
        });
        // update nested field progress.moduleId = true
        // if all modules are completed, also set status to 'completed'
        const enrollmentSnap = await getDoc(ref);
        if (enrollmentSnap.exists()) {
            const enrollmentData = enrollmentSnap.data();
            const allModules = await getCourseModules(courseId);
            const completedModules = Object.values(enrollmentData.progress).filter(Boolean).length;
            if (completedModules === allModules.length) {
                await updateDoc(ref, {
                    status: 'completed'
                });
                console.log('User enrolled course status updated to completed');
            }
        }
        
    } catch (error) {
        console.error('Error updating module completion:', error);
        throw error;
    }
}

// Enhanced function to add course with modules and proper order
export async function addCourseWithModulesOrdered() {
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

        // STEP 2: Add modules as subcollection with proper order
        const modules = [
            {
                title: "Introduction",
                description: "In this module, you will learn the basics of harvesting.",
                type: "video",
                videoUrl: "eCwRVJyjKA4",
                duration: "6 min",
                completed: false,
                order: 1, // Added order field
            },
            {
                title: "Advanced Techniques",
                description: "Learn advanced techniques for harvesting crops.",
                type: "video",
                videoUrl: "eCwRVJyjKA4",
                duration: "12 min",
                completed: false,
                order: 2, // Added order field
            },
            {
                title: "Advanced Techniques Quiz",
                description: "Test your knowledge with a short quiz.",
                type: "quiz",
                quizId: "jhbfjhsebuhwe",
                duration: "Quiz",
                completed: false,
                order: 3, // Added order field
            },
            {
                title: "Best Practices",
                description: "Learn the best practices for effective harvesting.",
                type: "video",
                videoUrl: "eCwRVJyjKA4",
                duration: "8 min",
                completed: false,
                order: 4, // Added order field
            },
            {
                title: "Final Assessment",
                description: "Complete the final quiz to earn your certificate.",
                type: "quiz",
                quizId: "finalquizid123",
                duration: "Quiz",
                completed: false,
                order: 5, // Added order field
            }
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
        throw error;
    }
}


// Function to update existing modules with order field
export async function addOrderToExistingModules(courseId) {
    try {
        const modulesCol = collection(db, 'courses', courseId, 'modules');
        const snap = await getDocs(modulesCol);

        const modules = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Sort by creation date and assign order
        modules.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        for (let i = 0; i < modules.length; i++) {
            const moduleRef = doc(db, 'courses', courseId, 'modules', modules[i].id);
            await updateDoc(moduleRef, {
                order: i + 1
            });
        }

        console.log('Order field added to existing modules');
    } catch (error) {
        console.error('Error adding order to modules:', error);
        throw error;
    }
}



export async function addCourseWithModules() {
    try {
        // STEP 1: Create a course document
        const courseId = doc(collection(db, 'courses')).id; // Generate unique ID
        const courseRef = doc(db, 'courses', courseId);

        // i want to store generated id as id field in document
        await setDoc(courseRef, {
            id: courseId,
            title: "How to Harvest More Effectively",
            description: "Learn how to harvest crops more efficiently and sell them for higher profits.",
            category: "Agriculture",
            level: "Beginner",
            duration: 420, // in minutes (7 hours)
            price: 500,
            thumbnail: "https://example.com/course-thumbnail.jpg",
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
                videoUrl: "eCwRVJyjKA4",
                duration: "6 min",
                completed: true,
                order: 1,
            },
            {
                title: "Advanced Techniques",
                description: "Learn advanced techniques for harvesting crops.",
                type: "video",
                videoUrl: "mZXetb1TPEg",
                duration: "12 min",
                completed: false,
                order: 2,
            },
            {
                title: "Advanced Techniques Quiz",
                description: "Test your knowledge with a short quiz.",
                type: "quiz",
                quizId: "jhbfjhsebuhwe",
                duration: "12 min",
                completed: false,
                order: 3,
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


// Add modules to existing course 
export async function addModulesToExistingCourse(courseId, modules = null) {
    try {
        const modulesCollectionRef = collection(db, "courses", courseId, "modules");

        const modules = [
            {
                title: "Introduction",
                order: 1,
                description: "In this module, you will learn the basics of harvesting.",
                type: "video",
                videoUrl: "eCwRVJyjKA4",
                duration: "6 min",
                completed: true,
            },
            {
                title: "Advanced Techniques",
                order: 2,
                description: "Learn advanced techniques for harvesting crops.",
                type: "video",
                videoUrl: "eCwRVJyjKA4",
                duration: "6 min",
                completed: true,
            },
            {
                title: "Advanced Techniques",
                order: 3,
                description: "Learn advanced techniques for harvesting crops.",
                type: "video",
                videoUrl: "mZXetb1TPEg",
                duration: "12 min",
                completed: false,
            },
            {
                title: "Advanced Techniques Quiz",
                order: 4,
                description: "Test your knowledge with a short quiz.",
                type: "quiz",
                quizId: "jhbfjhsebuhwe",
                duration: "12 min",
                completed: false,
            },
        ];

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
        console.error("Error adding modules to existing course:", error);
    }
}

// // Run Create once to add a quiz
// (async () => {
//     await addCourseWithModules();
// })();

// (async () => {
//     await addModulesToExistingCourse('6');
// })();
