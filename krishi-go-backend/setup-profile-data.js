const { db } = require('./config/firebase');
const { calculateLevel, calculateWorkingHours } = require('./utils/profileUtils');

async function setupProfileData() {
  console.log('👤 Setting up KrishiGo Profile System...\n');
  
  try {
    // Create sample user matching your screenshot
    const userData = {
      name: 'Vijay Kumar T',
      email: 'vijaykumar.t@gmail.com',
      phone: '+91 12345-67890',
      location: 'Coimbatore, Tamil Nadu',
      totalPoints: 8490,
      level: calculateLevel(8490),
      joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      lastLogin: new Date(),
      isActive: true,
      activityLevel: 'high',
      completedCourses: 12,
      isEmailVerified: true,
      isPhoneVerified: true,
      profileImage: null
    };
    
    const userRef = await db.collection('users').add(userData);
    const userId = userRef.id;
    console.log(`✅ Created user: ${userData.name} (ID: ${userId})`);
    console.log(`   📊 Points: ${userData.totalPoints}`);
    console.log(`   🏆 Level: ${userData.level}`);
    console.log(`   📍 Location: ${userData.location}`);
    
    // Create user preferences
    const preferencesData = {
      userId,
      language: 'english',
      notifications: true,
      darkMode: false,
      emailNotifications: true,
      smsNotifications: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('userPreferences').doc(userId).set(preferencesData);
    console.log(`✅ Created user preferences`);
    
    // Create sample courses for the user
    const sampleCourses = [
      {
        userId,
        courseId: 'course_001',
        title: 'Organic Farming Basics',
        category: 'organic',
        totalLessons: 10,
        completedLessons: 10,
        progress: 100,
        enrolledAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        isActive: false
      },
      {
        userId,
        courseId: 'course_002', 
        title: 'Sustainable Agriculture',
        category: 'sustainability',
        totalLessons: 15,
        completedLessons: 12,
        progress: 80,
        enrolledAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        userId,
        courseId: 'course_003',
        title: 'Water Conservation Techniques',
        category: 'water',
        totalLessons: 8,
        completedLessons: 3,
        progress: 37,
        enrolledAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isActive: true
      }
    ];
    
    for (let course of sampleCourses) {
      await db.collection('userCourses').add(course);
      console.log(`✅ Created course: ${course.title} (${course.progress}% complete)`);
    }
    
    // Create some user activity logs
    const activities = [
      {
        userId,
        activity: 'login',
        timestamp: new Date(),
        ip: '192.168.1.1'
      },
      {
        userId,
        activity: 'course_access',
        courseId: 'course_002',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        ip: '192.168.1.1'
      },
      {
        userId,
        activity: 'profile_update',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        ip: '192.168.1.1'
      }
    ];
    
    for (let activity of activities) {
      await db.collection('userActivity').add(activity);
    }
    console.log(`✅ Created ${activities.length} activity logs`);
    
    // Calculate and display stats
    const workingHours = calculateWorkingHours(userData.joinedAt, userData.activityLevel);
    const totalCourses = sampleCourses.length;
    const completedCourses = sampleCourses.filter(c => c.progress >= 100).length;
    
    console.log('\n🎉 Profile system setup completed!');
    console.log('\n📋 Profile Summary:');
    console.log(`   👤 Name: ${userData.name}`);
    console.log(`   📧 Email: ${userData.email}`);
    console.log(`   📱 Phone: ${userData.phone}`);
    console.log(`   📍 Location: ${userData.location}`);
    console.log(`   🏆 Points: ${userData.totalPoints} pts`);
    console.log(`   ⏰ Working Hours: ${workingHours} hrs`);
    console.log(`   📚 Courses: ${completedCourses}/${totalCourses} completed`);
    console.log(`   🌐 Language: ${preferencesData.language}`);
    
    console.log(`\n🔗 Test your Profile API:`);
    console.log(`   GET http://localhost:5000/api/profile/${userId}`);
    console.log(`   GET http://localhost:5000/api/profile/${userId}/stats`);
    console.log(`\n🚀 Start server: npm run dev`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up profile data:', error);
    process.exit(1);
  }
}

setupProfileData();