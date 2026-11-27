/**
 * Helper to get the corresponding avatar icon for a subforum topic category.
 * Matches loaded subforum configurations and falls back to topic keywords.
 */
export const getSubforumIcon = (category, subforums = []) => {
  if (!category) return '💬';
  const clean = String(category).toLowerCase().trim();

  // 1. Direct match against loaded subforums from backend
  if (Array.isArray(subforums) && subforums.length > 0) {
    const found = subforums.find(s => 
      s.name?.toLowerCase().trim() === clean || 
      s.slug?.toLowerCase().trim() === clean
    );
    if (found?.icon) return found.icon;
  }

  // 2. Comprehensive topic to avatar mapping
  if (clean.includes('stud') || clean.includes('exam') || clean.includes('school') || clean.includes('college')) return '🎓';
  if (clean.includes('h1b') || clean.includes('visa') || clean.includes('gc') || clean.includes('greencard')) return '🌐';
  if (clean.includes('india') || clean.includes('desi')) return '🇮🇳';
  if (clean.includes('cook') || clean.includes('food') || clean.includes('recipe')) return '🍛';
  if (clean.includes('job') || clean.includes('referral') || clean.includes('career') || clean.includes('interview')) return '💼';
  if (clean.includes('kid') || clean.includes('teen') || clean.includes('child') || clean.includes('parent')) return '🧸';
  if (clean.includes('new to') || clean.includes('immigrat') || clean.includes('relocat')) return '🗽';
  if (clean.includes('shop') || clean.includes('store') || clean.includes('deal') || clean.includes('buy')) return '🛍️';
  if (clean.includes('car') || clean.includes('auto') || clean.includes('vehicle')) return '🚗';
  if (clean.includes('house') || clean.includes('real estate') || clean.includes('home') || clean.includes('rent') || clean.includes('room')) return '🏠';
  if (clean.includes('stock') || clean.includes('invest') || clean.includes('finance') || clean.includes('crypto')) return '📈';
  if (clean.includes('travel') || clean.includes('flight') || clean.includes('trip')) return '✈︎';
  if (clean.includes('tech') || clean.includes('it') || clean.includes('code') || clean.includes('software')) return '💻';
  if (clean.includes('other') || clean.includes('general')) return '💬';

  return '💬';
};
