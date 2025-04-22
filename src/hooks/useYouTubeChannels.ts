import { useState, useEffect } from 'react';
import { fetchChannelByUrl } from '../api/youtube';

export interface YouTubeChannel {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: { medium: { url: string } };
  };
  userDescription?: string;
  badges?: string[];
}

interface CategoryConfig {
  url: string;
  description?: string;
  badges?: string[];
}

const initialCategories: { [key: string]: CategoryConfig[] } = {
  economy: [],
  history: [],
  geopolitics: [],
  english: [],
  german: [],
  nutrition: [],
  psychology: [],
  tech: [],
};

export const useYouTubeChannels = () => {
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('economy');
  const [lastCategory, setLastCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState(initialCategories);
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  // Load categories from localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem('userCategories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Save categories to localStorage
  const saveCategories = (updatedCategories: typeof categories) => {
    localStorage.setItem('userCategories', JSON.stringify(updatedCategories));
    setCategories(updatedCategories);
  };

  // Handle errors
  const handleError = (errorMsg: string, details: string[]) => {
    setError(errorMsg);
    setErrorDetails(details);
    setLoading(false);
  };

  // Fetch channels for a category
  const fetchChannels = async (category: string) => {
    if (category === lastCategory && channels.length > 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setErrorDetails([]);

    try {
      const channelConfigs = categories[category];
      if (!channelConfigs || channelConfigs.length === 0) {
        setChannels([]);
        setLastCategory(category);
        setLoading(false);
        return;
      }

      const fetchedChannels: YouTubeChannel[] = [];
      for (const config of channelConfigs) {
        if (!config.url) continue;

        try {
          const cacheKey = `yt_channel_${category}_${config.url}`;
          const channelData = await fetchChannelByUrl(config.url, cacheKey, CACHE_DURATION);
          fetchedChannels.push(
            ...channelData.map((channel: YouTubeChannel) => ({
              ...channel,
              userDescription: config.description,
              badges: config.badges,
            }))
          );
        } catch (err: any) {
          console.error(`Error fetching channel ${config.url}:`, err.message);
        }
      }

      setChannels(fetchedChannels.slice(0, 6));
      setLastCategory(category);
      setLoading(false);
    } catch (err: any) {
      handleError('Something went wrong.', ['Please try again or add a new channel.']);
    }
  };

  // Daily limit tracking
  const getDailyLimitKey = (category: string) => `daily_limit_${category}_${new Date().toDateString()}`;
  const MAX_DAILY_ADDS = 5;

  const canAddChannel = (category: string) => {
    const limitKey = getDailyLimitKey(category);
    const limitData = localStorage.getItem(limitKey);
    if (!limitData) return true;

    const { count, timestamp } = JSON.parse(limitData);
    const now = Date.now();
    if (now - timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(limitKey);
      return true;
    }

    return count < MAX_DAILY_ADDS;
  };

  const incrementDailyCount = (category: string) => {
    const limitKey = getDailyLimitKey(category);
    const limitData = localStorage.getItem(limitKey);
    const now = Date.now();

    let count = 1;
    if (limitData) {
      const { count: existingCount, timestamp } = JSON.parse(limitData);
      if (now - timestamp < 24 * 60 * 60 * 1000) {
        count = existingCount + 1;
      }
    }

    localStorage.setItem(limitKey, JSON.stringify({ count, timestamp: now }));
  };

  return {
    channels,
    loading,
    error,
    errorDetails,
    activeCategory,
    categories,
    setActiveCategory,
    setChannels,
    setError,
    setErrorDetails,
    fetchChannels,
    saveCategories,
    canAddChannel,
    incrementDailyCount,
    handleError,
  };
};