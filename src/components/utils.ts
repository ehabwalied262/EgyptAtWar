import { safeLocalStorage } from './safeLocalStorage';

export const getCacheKey = (category: string, identifier: string) => `yt_channel_${category}_${identifier}`;
export const getDailyLimitKey = (category: string) => `daily_limit_${category}_${new Date().toDateString()}`;
export const getLikesKey = (channelId: string) => `channel_likes_${channelId}`;
export const CACHE_DURATION = 24 * 60 * 60 * 1000;
export const MAX_DAILY_ADDS = 5;

export const canAddChannel = (category: string) => {
  const limitKey = getDailyLimitKey(category);
  const limitData = safeLocalStorage.getItem(limitKey);
  if (!limitData) return true;

  try {
    const { count, timestamp } = JSON.parse(limitData);
    const now = Date.now();
    if (now - timestamp > 24 * 60 * 60 * 1000) {
      safeLocalStorage.removeItem(limitKey);
      return true;
    }
    return count < MAX_DAILY_ADDS;
  } catch (err) {
    console.error('Failed to parse daily limit:', err);
    return false;
  }
};

export const incrementDailyCount = (category: string) => {
  const limitKey = getDailyLimitKey(category);
  const limitData = safeLocalStorage.getItem(limitKey);
  const now = Date.now();

  let count = 1;
  if (limitData) {
    try {
      const { count: existingCount, timestamp } = JSON.parse(limitData);
      if (now - timestamp < 24 * 60 * 60 * 1000) {
        count = existingCount + 1;
      }
    } catch (err) {
      console.error('Failed to parse daily limit:', err);
    }
  }

  safeLocalStorage.setItem(limitKey, JSON.stringify({ count, timestamp: now }));
};

export const extractChannelInfo = (link: string) => {
    const urlPatterns = [
      // Channel handle: https://www.youtube.com/@username
      { regex: /youtube\.com\/@([\w-]+)/, type: 'handle' },
      // Channel ID: https://www.youtube.com/channel/UC...
      { regex: /youtube\.com\/channel\/([\w-]+)/, type: 'id' },
    ];
  
    for (const pattern of urlPatterns) {
      const match = link.match(pattern.regex);
      if (match) {
        return { type: pattern.type, value: match[1] };
      }
    }
  
    return null;
  };