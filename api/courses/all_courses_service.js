import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

// Sample course data with prices
const allCourses = [
  {
    id: 1,
    title: 'Organic Farming Basics',
    instructor: 'Dr. Rajesh Kumar',
    duration: '4 weeks',
    rating: 4.8,
    price: 2999,
    image: require('../../assets/images/course1.png'),
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
    price: 4499,
    image: require('../../assets/images/course1.png'),
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
    price: 3999,
    image: require('../../assets/images/course1.png'),
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
    price: 5999,
    image: require('../../assets/images/course1.png'),
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
    price: 1999,
    image: require('../../assets/images/course1.png'),
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
    price: 6999,
    image: require('../../assets/images/course1.png'),
    category: 'Technology',
    level: 'Advanced',
    description: 'Use AI, IoT, and data analytics for precision farming solutions.'
  }
];

/**
 * CREATE MULTIPLE COURSES
 */
export async function createCourses() {
  try {
    console.log("🚀 Starting to create courses...");

    for (const course of allCourses) {
      const courseRef = doc(db, "courses", course.id.toString());

      await setDoc(courseRef, {
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        duration: course.duration,
        price: course.price,
        rating: course.rating,
        image: course.image,
        instructor: {
          name: course.instructor,
          bio: `Expert instructor with years of experience in ${course.category.toLowerCase()}.`,
          profilePicture: "https://example.com/default-instructor.jpg",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      console.log(`✅ Course "${course.title}" created successfully!`);
    }

    console.log("🎉 All courses created successfully!");
  } catch (error) {
    console.error("❌ Error creating courses:", error.message);
  }
}

/**
 * CREATE COURSE
 */
export async function createCourse() {
  try {
    const courseId = "courseId"; // Replace with auto-generated ID if needed
    const courseRef = doc(db, "courses", courseId);

    await setDoc(courseRef, {
      title: "Introduction to Organic Farming",
      description: "Learn the basics of organic farming and sustainable agriculture.",
      category: "Agriculture",
      level: "Beginner",
      duration: 120, // in minutes
      price: 500,
      instructor: {
        name: "John Doe",
        bio: "An expert in organic farming with 10+ years of experience.",
        profilePicture: "https://example.com/johndoe.jpg",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log("✅ Course created successfully!");
  } catch (error) {
    console.error("❌ Error creating course:", error.message);
  }
}

/**
 * GET ALL COURSES
 */
export async function getAllCourses() {
  try {
    const coursesSnapshot = await getDocs(collection(db, "courses"));
    const courses = coursesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // console.log("📚 All courses:", courses);
    return courses;
  } catch (error) {
    console.error("❌ Error fetching courses:", error.message);
    return [];
  }
}

/**
 * GET COURSE BY ID
 */
export async function getCourseById(courseId) {
  try {
    const courseRef = doc(db, "courses", courseId);
    const courseSnap = await getDoc(courseRef);

    if (!courseSnap.exists()) {
      console.log("⚠️ Course not found!");
      return null;
    }

    const course = { id: courseSnap.id, ...courseSnap.data() };
    console.log("🎯 Course details:", course);
    return course;
  } catch (error) {
    console.error("❌ Error fetching course by ID:", error.message);
    return null;
  }
}

// // Example test
// (async () => {
//   await createCourses(); // Create all sample courses
//   await getAllCourses();
//   await getCourseById("1"); // Get first course
// })();