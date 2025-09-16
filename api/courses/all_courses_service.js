import { db } from "../../config/firebase";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";

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
      thumbnail: "https://example.com/thumbnail.jpg",
      videoUrl: "https://example.com/video.mp4",
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

    console.log("📚 All courses:", courses);
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

// Example test
// (async () => {
//   await createCourse();
//   await getAllCourses();
//   await getCourseById("courseId"); // Replace with actual ID
// })();
