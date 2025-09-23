export const trackFreePollCreation = async (): Promise<boolean> => {
  const key = 'uwazi_free_polls';
  const now = new Date();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  
  const stored = localStorage.getItem(key);
  const data = stored ? JSON.parse(stored) : { count: 0, weekStart: weekStart.toISOString() };
  
  // Reset count if new week
  if (new Date(data.weekStart).getTime() !== weekStart.getTime()) {
    data.count = 0;
    data.weekStart = weekStart.toISOString();
  }
  
  // Check limit
  if (data.count >= 2) {
    return false;
  }
  
  // Increment count
  data.count += 1;
  localStorage.setItem(key, JSON.stringify(data));
  
  return true;
};
