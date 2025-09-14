function getTodayStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
}

function getTodayEnd() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
}

function isNewDay(lastClaimDate) {
  if (!lastClaimDate) return true;
  const today = new Date().toDateString();
  return new Date(lastClaimDate).toDateString() !== today;
}

module.exports = { getTodayStart, getTodayEnd, isNewDay };
