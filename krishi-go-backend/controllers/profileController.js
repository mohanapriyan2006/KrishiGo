const { db } = require('../config/firebase');
const { 
  calculateLevel, 
  calculateWorkingHours, 
  getCoursesCount,
  formatPhoneNumber,
  validateEmail,
  validatePhone 
} = require('../utils/profileUtils');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user data
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userData = userDoc.data();
    
    // Calculate working hours
    const workingHours = calculateWorkingHours(userData.joinedAt || new Date());
    
    // Get courses count
    const coursesCount = await getCoursesCount(db, userId);
    
    // Get user preferences
    const preferencesDoc = await db.collection('userPreferences').doc(userId).get();
    const preferences = preferencesDoc.exists ? preferencesDoc.data() : {};
    
    const profile = {
      personalInfo: {
        id: userId,
        name: userData.name || '',
        email: userData.email || '',
        phone: formatPhoneNumber(userData.phone || ''),
        location: userData.location || '',
        profileImage: userData.profileImage || null,
        joinedAt: userData.joinedAt,
        lastLogin: userData.lastLogin
      },
      stats: {
        points: userData.totalPoints || 0,
        level: calculateLevel(userData.totalPoints || 0),
        workingHours: workingHours,
        coursesCount: coursesCount,
        completedCourses: userData.completedCourses || 0
      },
      settings: {
        language: preferences.language || 'english',
        notifications: preferences.notifications !== false,
        darkMode: preferences.darkMode || false,
        emailNotifications: preferences.emailNotifications !== false
      },
      activityLevel: userData.activityLevel || 'medium',
      isEmailVerified: userData.isEmailVerified || false,
      isPhoneVerified: userData.isPhoneVerified || false
    };
    
    res.json(profile);
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, phone, location } = req.body;
    
    // Validate input
    const errors = [];
    if (email && !validateEmail(email)) {
      errors.push('Invalid email format');
    }
    if (phone && !validatePhone(phone)) {
      errors.push('Invalid phone number format');
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    // Check if user exists
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prepare update data
    const updateData = {
      updatedAt: new Date()
    };
    
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase().trim();
    if (phone) updateData.phone = formatPhoneNumber(phone.trim());
    if (location) updateData.location = location.trim();
    
    // Update user document
    await db.collection('users').doc(userId).update(updateData);
    
    // Get updated profile
    const updatedDoc = await db.collection('users').doc(userId).get();
    const updatedData = updatedDoc.data();
    
    res.json({
      message: 'Profile updated successfully',
      personalInfo: {
        id: userId,
        name: updatedData.name,
        email: updatedData.email,
        phone: updatedData.phone,
        location: updatedData.location
      }
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update user settings
const updateUserSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { language, notifications, darkMode, emailNotifications } = req.body;
    
    const settingsData = {
      userId,
      updatedAt: new Date()
    };
    
    if (language) settingsData.language = language;
    if (notifications !== undefined) settingsData.notifications = notifications;
    if (darkMode !== undefined) settingsData.darkMode = darkMode;
    if (emailNotifications !== undefined) settingsData.emailNotifications = emailNotifications;
    
    await db.collection('userPreferences').doc(userId).set(settingsData, { merge: true });
    
    res.json({
      message: 'Settings updated successfully',
      settings: settingsData
    });
    
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Change language
const changeLanguage = async (req, res) => {
  try {
    const { userId } = req.params;
    const { language } = req.body;
    
    const supportedLanguages = ['english', 'hindi', 'tamil', 'telugu', 'kannada', 'malayalam'];
    
    if (!supportedLanguages.includes(language.toLowerCase())) {
      return res.status(400).json({ 
        message: 'Unsupported language',
        supportedLanguages 
      });
    }
    
    await db.collection('userPreferences').doc(userId).set({
      language: language.toLowerCase(),
      updatedAt: new Date()
    }, { merge: true });
    
    res.json({
      message: 'Language updated successfully',
      language: language.toLowerCase()
    });
    
  } catch (error) {
    console.error('Change language error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Upload profile image
const uploadProfileImage = async (req, res) => {
  try {
    const { userId } = req.params;
    const { imageUrl } = req.body; // In real app, you'd handle file upload
    
    await db.collection('users').doc(userId).update({
      profileImage: imageUrl,
      updatedAt: new Date()
    });
    
    res.json({
      message: 'Profile image updated successfully',
      imageUrl
    });
    
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user data
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userData = userDoc.data();
    
    // Get detailed course statistics
    const coursesSnapshot = await db.collection('userCourses')
      .where('userId', '==', userId)
      .get();
    
    let completedCourses = 0;
    let inProgressCourses = 0;
    let totalLessonsCompleted = 0;
    
    coursesSnapshot.forEach(doc => {
      const course = doc.data();
      if (course.progress >= 100) {
        completedCourses++;
      } else if (course.progress > 0) {
        inProgressCourses++;
      }
      totalLessonsCompleted += course.completedLessons || 0;
    });
    
    // Get activity data
    const activitySnapshot = await db.collection('userActivity')
      .where('userId', '==', userId)
      .get();
    
    const workingHours = calculateWorkingHours(userData.joinedAt || new Date());
    
    const stats = {
      points: {
        total: userData.totalPoints || 0,
        level: calculateLevel(userData.totalPoints || 0),
        nextLevelPoints: Math.ceil((calculateLevel(userData.totalPoints || 0)) * 1000)
      },
      courses: {
        total: coursesSnapshot.size,
        completed: completedCourses,
        inProgress: inProgressCourses,
        lessonsCompleted: totalLessonsCompleted
      },
      activity: {
        workingHours: workingHours,
        joinedDaysAgo: Math.floor((new Date() - (userData.joinedAt?.toDate() || new Date())) / (1000 * 60 * 60 * 24)),
        totalSessions: activitySnapshot.size,
        lastActive: userData.lastLogin
      }
    };
    
    res.json(stats);
    
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Logout user (invalidate session)
const logoutUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Update last logout time
    await db.collection('users').doc(userId).update({
      lastLogout: new Date(),
      isOnline: false
    });
    
    // In a real app, you might invalidate JWT tokens here
    // For now, we'll just log the logout
    await db.collection('userActivity').add({
      userId,
      activity: 'logout',
      timestamp: new Date(),
      ip: req.ip || 'unknown'
    });
    
    res.json({
      message: 'Logged out successfully'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserSettings,
  changeLanguage,
  uploadProfileImage,
  getUserStats,
  logoutUser
};