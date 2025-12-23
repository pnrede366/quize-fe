// Global/Shared Utility Functions

/**
 * Get difficulty level based on numeric difficulty value
 * @param {number} difficulty - Numeric difficulty (0-10)
 * @returns {string} - Difficulty level name
 */
export const getDifficultyLevel = (difficulty) => {
  if (difficulty <= 2) return "easy";
  if (difficulty <= 5) return "medium";
  if (difficulty <= 8) return "hard";
  return "expert";
};

/**
 * Get difficulty badge information
 * @param {number} difficulty - Numeric difficulty (0-10)
 * @param {string} format - Format type: 'variant' (for Badge component) or 'color' (for custom styling)
 * @returns {Object} - Badge object with label and variant/color
 */
export const getDifficultyBadge = (difficulty, format = 'variant') => {
  if (difficulty <= 2) {
    return format === 'variant' 
      ? { label: "Easy", variant: "easy" }
      : { label: "Easy", color: "bg-green-500" };
  }
  if (difficulty <= 5) {
    return format === 'variant'
      ? { label: "Medium", variant: "medium" }
      : { label: "Medium", color: "bg-yellow-500" };
  }
  if (difficulty <= 8) {
    return format === 'variant'
      ? { label: "Hard", variant: "hard" }
      : { label: "Hard", color: "bg-orange-500" };
  }
  return format === 'variant'
    ? { label: "Expert", variant: "expert" }
    : { label: "Expert", color: "bg-red-500" };
};

/**
 * Get difficulty badge with full color classes (for inline styling)
 * @param {number} difficulty - Numeric difficulty (0-10)
 * @returns {Object} - Badge object with label and full color classes
 */
export const getDifficultyBadgeWithColor = (difficulty) => {
  if (difficulty <= 2) return { label: "Easy", color: "bg-green-500 text-green-100" };
  if (difficulty <= 5) return { label: "Medium", color: "bg-yellow-500 text-yellow-100" };
  if (difficulty <= 8) return { label: "Hard", color: "bg-orange-500 text-orange-100" };
  return { label: "Expert", color: "bg-red-500 text-red-100" };
};

/**
 * Filter quizzes by difficulty level
 * @param {Array} quizzes - Array of quiz objects
 * @param {string} filterDifficulty - Filter value: 'all', 'easy', 'medium', 'hard', 'expert'
 * @returns {Array} - Filtered array of quizzes
 */
export const filterQuizzesByDifficulty = (quizzes, filterDifficulty) => {
  if (filterDifficulty === "all") return quizzes;
  
  return quizzes.filter((quiz) => {
    const difficulty = quiz.difficulty;
    if (filterDifficulty === "easy") return difficulty <= 2;
    if (filterDifficulty === "medium") return difficulty > 2 && difficulty <= 5;
    if (filterDifficulty === "hard") return difficulty > 5 && difficulty <= 8;
    if (filterDifficulty === "expert") return difficulty > 8;
    return true;
  });
};

/**
 * Format number with locale string
 * @param {number} num - Number to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (num) => {
  return num.toLocaleString();
};

/**
 * Calculate percentage
 * @param {number} score - Score value
 * @param {number} total - Total value
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} - Percentage string
 */
export const calculatePercentage = (score, total, decimals = 0) => {
  return ((score / total) * 100).toFixed(decimals);
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user is authenticated
 */
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};

/**
 * Get user data from localStorage
 * @returns {Object|null} - User object or null
 */
export const getUserFromStorage = () => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

