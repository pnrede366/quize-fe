// Profile-specific utility functions
export const getPlanDetails = (user) => {
  if (!user.isPremium) return null;

  const expiryDate = new Date(user.premiumExpiresAt);
  const now = new Date();
  const daysLeft = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
  
  // Calculate plan duration
  const createdDate = new Date(user.createdAt);
  const totalDays = Math.ceil((expiryDate - createdDate) / (1000 * 60 * 60 * 24));
  
  let planName = "Premium";
  if (totalDays >= 300) planName = "Yearly Premium";
  else if (totalDays >= 60) planName = "Quarterly Premium";
  else if (totalDays >= 15) planName = "Monthly Premium";

  return {
    planName,
    expiryDate: expiryDate.toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'short', 
      year: 'numeric' 
    }),
    daysLeft,
    isExpiring: daysLeft <= 7,
  };
};

// Re-export shared utilities from helper
export { getDifficultyBadge, calculatePercentage } from "../../../helper/utility";

