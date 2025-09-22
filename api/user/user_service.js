import { addDoc, collection, doc, getDocs, query, setDoc, where, writeBatch } from "firebase/firestore";
import { db } from "../../config/firebase";

/**
 * CREATE USER PROFILE
 */
export async function createUserProfile() {
  try {
    // STEP 1: Create a user document
    const userId = "userId123"; // Replace with Firebase Auth UID dynamically
    const userRef = doc(db, "users", userId);

    await setDoc(userRef, {
      authId: "authId123", // Firebase Authentication UID
      email: "user@example.com",
      firstName: "John",
      lastName: "Doe",
      profilePicture: "https://example.com/profile-picture.jpg",
      phoneNumber: "+1234567890",
      address: {
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      rewards: {
        totalPoints: 8490,
        currentPoints: 6490,
        redeemedPoints: 2000,
      },
      preferences: {
        language: "en", // Preferred language
        notificationsEnabled: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log("✅ User profile created successfully!");

    // STEP 2: Add enrolled courses as subcollection
    const enrolledCourses = [
      {
        courseId: "courseId1",
        progress: 50,
        completedModules: ["moduleId1", "moduleId2"],
        enrolledAt: "2025-09-10T08:00:00Z",
        lastAccessed: "2025-09-15T09:00:00Z",
      },
      {
        courseId: "courseId2",
        progress: 100,
        completedModules: ["moduleId1", "moduleId2", "moduleId3"],
        enrolledAt: "2025-08-01T08:00:00Z",
        lastAccessed: "2025-08-20T09:00:00Z",
      },
    ];

    const enrolledCoursesCollectionRef = collection(userRef, "enrolledCourses");

    for (const course of enrolledCourses) {
      await addDoc(enrolledCoursesCollectionRef, {
        ...course,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    console.log("✅ Enrolled courses added successfully!");

    // STEP 3: Add achievements as subcollection
    const achievements = [
      {
        achievementId: "achievement1",
        title: "First Course Completed",
        description: "Completed your first course on KrishiGo.",
        earnedAt: "2025-08-20T09:00:00Z",
      },
    ];

    const achievementsCollectionRef = collection(userRef, "achievements");

    for (const achievement of achievements) {
      await addDoc(achievementsCollectionRef, {
        ...achievement,
        createdAt: new Date().toISOString(),
      });
    }

    console.log("🏆 Achievements added successfully!");
  } catch (error) {
    console.error("❌ Error creating user profile:", error.message);
  }
}

/**
 * GET ALL USERS WITH ENROLLED COURSES AND ACHIEVEMENTS
 */
export async function getAllUsers() {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const users = [];
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = { id: userDoc.id, ...userDoc.data() };
      
      // Fetch enrolled courses for this user
      const enrolledCoursesSnapshot = await getDocs(collection(userDoc.ref, "enrolledCourses"));
      const enrolledCourses = enrolledCoursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Fetch achievements for this user
      const achievementsSnapshot = await getDocs(collection(userDoc.ref, "achievements"));
      const achievements = achievementsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      users.push({ ...userData, enrolledCourses, achievements });
    }

    console.log("📚 Users fetched successfully:", users);
    return users;
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    return [];
  }
}


/**
 *  UPDATE REWARDS POINTS FOR A USER
 */
export async function updateUserRewards(userId, pointsToAdd=0 , redeemedPointsToAdd=0) {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDocs(query(collection(db, "users"), where("authId", "==", userId)));
   if (!userSnap.empty) {
     const userData = userSnap.docs[0].data();

     await setDoc(userRef, {
       rewards: {
         totalPoints: (userData.rewards.totalPoints || 0) + pointsToAdd,
         currentPoints: (userData.rewards.currentPoints || 0) + pointsToAdd,
         redeemedPoints: (userData.rewards.redeemedPoints || 0) + redeemedPointsToAdd,
       },
     }, { merge: true });

     console.log("✅ User rewards updated successfully!");
   } else {
     console.log("❌ User not found.");
   }
  } catch (error) {
    console.error("❌ Error updating user rewards:", error.message);
  }
}

/**
 *  GET ENROLLED COURSES FOR A USER
 */
export async function getUserEnrolledCourses(userId) {
  try {
    const userRef = doc(db, "users", userId);
    const enrolledCoursesSnapshot = await getDocs(collection(userRef, "enrollments"));
    const enrolledCourses = enrolledCoursesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return enrolledCourses;
  } catch (error) {
    console.error("❌ Error fetching enrolled courses:", error.message);
    return [];
  }
}

/** * ADD COURSE TO WISHLIST FOR A USER
 */
export async function addCourseToWishlist(userId, courseId) {
  try {
    const userRef = doc(db, "users", userId);
    const wishlistRef = collection(userRef, "wishlist");

    // Check if course is already in wishlist to prevent duplicates
    const existingQuery = query(wishlistRef, where("courseId", "==", courseId));
    const existingSnapshot = await getDocs(existingQuery);
    
    if (!existingSnapshot.empty) {
      console.log("⚠️ Course already exists in wishlist");
      return; // Course already in wishlist, don't add again
    }

    await addDoc(wishlistRef, {
      courseId,
      addedAt: new Date().toISOString(),
    });

    console.log("✅ Course added to wishlist successfully!");
  } catch (error) {
    console.error("❌ Error adding course to wishlist:", error.message);
    throw error; // Re-throw so UI can handle the error
  }
}


/** * REMOVE COURSE FROM WISHLIST FOR A USER
 */
export async function removeCourseFromWishlist(userId, courseId) {
  try {
    const userRef = doc(db, "users", userId);
    const wishlistRef = collection(userRef, "wishlist");

    const querySnapshot = await getDocs(query(wishlistRef, where("courseId", "==", courseId)));
    const batch = writeBatch(db);

    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log("✅ Course removed from wishlist successfully!");
  } catch (error) {
    console.error("❌ Error removing course from wishlist:", error.message);
    throw error; // Re-throw so UI can handle the error
  }
}


/** * GET WISHLIST FOR A USER
 */
export async function getUserWishlist(userId) {
  try {
    const userRef = doc(db, "users", userId);
    const wishlistRef = collection(userRef, "wishlist");
    const wishlistSnapshot = await getDocs(wishlistRef);
    const wishlist = wishlistSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return wishlist;
  } catch (error) {
    console.error("❌ Error fetching user wishlist:", error.message);
    return [];
  }
}

// // Run once to test
// (async () => {
//   await createUserProfile();

//   const allUsers = await getAllUsers();
//   console.log(JSON.stringify(allUsers, null, 2));
// })();
