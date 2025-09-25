import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

/**
 * CREATE QUIZ WITH QUESTIONS
 */
export async function createQuiz() {
  try {
    // Generate a unique quiz ID
    const quizId = doc(collection(db, 'quizzes')).id;
    const quizRef = doc(db, "quizzes", quizId);


    await setDoc(quizRef, {
      quizId: quizId,
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
    console.log("❌ Error creating quiz:", error.message);
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
    console.log("❌ Error fetching quizzes:", error.message);
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
