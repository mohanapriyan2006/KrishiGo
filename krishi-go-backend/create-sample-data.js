const { db } = require("./config/firebase");

async function createSampleData() {
  try {
    // --- Create sample user ---
    const userData = {
      name: "Vijay Kumar T",
      email: "vijay@example.com",
      phone: "+91 9876543210",
      location: "Karnataka, West Aea",
      points: 6490,
      level: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userRef = await db.collection("users").add(userData);
    console.log("Sample user created with ID:", userRef.id);

    // --- Create sample challenges ---
    const challenges = [
      {
        title: "Complete Challenge",
        description: "Complete your daily farming tasks",
        points: 100,
        difficulty: "easy",
        category: "daily",
        duration: "1 day",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Water Conservation",
        description: "Implement water-saving techniques in your farm",
        points: 250,
        difficulty: "medium",
        category: "sustainability",
        duration: "1 week",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Organic Farming",
        description: "Switch to organic farming methods",
        points: 500,
        difficulty: "hard",
        category: "organic",
        duration: "1 month",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (let challenge of challenges) {
      const challengeRef = await db.collection("challenges").add(challenge);
      console.log("Challenge created with ID:", challengeRef.id);
    }

    // --- Create sample rewards ---
    const rewards = [
      {
        title: "Reward 1",
        description: "Daily login bonus",
        points: 100,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Reward 2",
        description: "Complete 1 challenge",
        points: 200,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (let reward of rewards) {
      const rewardRef = await db.collection("rewards").add(reward);
      console.log("Reward created with ID:", rewardRef.id);
    }

    // --- Create sample courses ---
    const courses = [
      {
        title: "Introduction to Organic Farming",
        description: "Learn the basics of organic farming methods.",
        videoUrl: "https://example.com/video1",
        quiz: [
          {
            question: "What is organic farming?",
            options: ["Chemical-free", "High-tech", "None"],
            answer: "Chemical-free",
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Water Conservation in Agriculture",
        description: "Best practices for saving water in farming.",
        videoUrl: "https://example.com/video2",
        quiz: [
          {
            question: "Which method saves most water?",
            options: ["Flood irrigation", "Drip irrigation", "Sprinkler"],
            answer: "Drip irrigation",
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (let course of courses) {
      const courseRef = await db.collection("courses").add(course);
      console.log("Course created with ID:", courseRef.id);
    }

    console.log("✅ All sample data created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating sample data:", error);
    process.exit(1);
  }
}

createSampleData();
