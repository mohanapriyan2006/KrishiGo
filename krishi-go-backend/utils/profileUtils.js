const calculateLevel = (points) => {
  if (points < 1000) return 1;
  if (points < 2500) return 2;
  if (points < 5000) return 3;
  if (points < 10000) return 4;
  return Math.floor(points / 2000) + 1;
};

const calculateWorkingHours = (joinedDate, activityLevel = 'medium') => {
  const now = new Date();
  const joined = joinedDate.toDate ? joinedDate.toDate() : new Date(joinedDate);
  const daysDiff = Math.floor((now - joined) / (1000 * 60 * 60 * 24));
  
  // Estimate working hours based on activity
  let hoursPerDay = 2; // Default
  if (activityLevel === 'high') hoursPerDay = 4;
  if (activityLevel === 'low') hoursPerDay = 1;
  
  return Math.max(daysDiff * hoursPerDay, 0);
};

const getCoursesCount = async (db, userId) => {
  try {
    const coursesSnapshot = await db.collection('userCourses')
      .where('userId', '==', userId)
      .get();
    return coursesSnapshot.size;
  } catch (error) {
    return 0;
  }
};

const formatPhoneNumber = (phone) => {
  // Format phone number for display
  if (!phone) return '';
  if (phone.startsWith('+91')) return phone;
  if (phone.startsWith('91')) return `+${phone}`;
  if (phone.length === 10) return `+91 ${phone}`;
  return phone;
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^(\+91|91)?[6789]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

module.exports = {
  calculateLevel,
  calculateWorkingHours,
  getCoursesCount,
  formatPhoneNumber,
  validateEmail,
  validatePhone
};