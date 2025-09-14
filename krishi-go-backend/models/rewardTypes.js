const REWARD_TYPES = {
  DAILY_REWARD_1: {
    id: 'daily_reward_1',
    name: 'Reward 1',
    points: 100,
    description: 'Daily reward - first claim',
    category: 'daily'
  },
  DAILY_REWARD_2: {
    id: 'daily_reward_2',
    name: 'Reward 2',
    points: 100,
    description: 'Daily reward - second claim',
    category: 'daily'
  },
  REFERRAL_BONUS: {
    id: 'referral_bonus',
    name: 'Referral Bonus',
    points: 50,
    description: 'Earned by referring a friend',
    category: 'referral'
  }
};

module.exports = { REWARD_TYPES };
