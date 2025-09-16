import { db } from "../../config/firebase";
import { doc, setDoc, collection, addDoc, getDocs } from "firebase/firestore";

/**
 * CREATE QUIZ WITH QUESTIONS
 */
export async function createQuiz() {
  try {
    // STEP 1: Create a quiz document
    const quizId = "quizId1"; // You can also use auto-generated IDs
    const quizRef = doc(db, "quizzes", quizId);

    await setDoc(quizRef, {
      moduleId: "moduleId3", // Reference to parent module
      title: "Quiz on Best Practices",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log("✅ Quiz document created successfully!");

    // STEP 2: Add questions in subcollection
    const questions = [
      {
        question: "What is the best time to harvest crops?",
        options: ["Early morning", "Afternoon", "Evening", "Night"],
        correctAnswer: "Early morning",
      },
      {
        question: "Which tool is most effective for harvesting?",
        options: ["Sickle", "Shovel", "Hoe", "Plow"],
        correctAnswer: "Sickle",
      },
    ];

    const questionsCollectionRef = collection(quizRef, "questions");

    for (const q of questions) {
      await addDoc(questionsCollectionRef, {
        ...q,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    console.log("✅ Questions added successfully!");
  } catch (error) {
    console.error("❌ Error creating quiz:", error.message);
  }
}

/**
 * GET ALL QUIZZES WITH QUESTIONS
 */
export async function getAllQuizzes() {
  try {
    const quizzesSnapshot = await getDocs(collection(db, "quizzes"));
    const quizzes = [];

    for (const quizDoc of quizzesSnapshot.docs) {
      const quizData = { id: quizDoc.id, ...quizDoc.data() };

      // Fetch questions for this quiz
      const questionsSnapshot = await getDocs(collection(quizDoc.ref, "questions"));
      const questions = questionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      quizzes.push({ ...quizData, questions });
    }

    console.log("📚 Quizzes fetched successfully:", quizzes);
    return quizzes;
  } catch (error) {
    console.error("❌ Error fetching quizzes:", error.message);
    return [];
  }
}

// Run Create once to add a quiz
// (async () => {
//   await createQuiz();

//   // Fetch all quizzes
//   const allQuizzes = await getAllQuizzes();
//   console.log(JSON.stringify(allQuizzes, null, 2));
// })();
