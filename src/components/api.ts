import axios from 'axios';
import { safeLocalStorage } from './safeLocalStorage';
import { extractChannelInfo, getCacheKey, CACHE_DURATION } from './utils';
import type { YouTubeChannel } from './types';

const API_KEY = 'AIzaSyAxab3WsoosQR-TKWdN9IT7YRj6C-VPXlc';

export const fetchChannelByLink = async (link: string): Promise<YouTubeChannel[]> => {
  // Check if the link is a channel ID
  const isChannelId = /^[UC][\w-]{22}$/.test(link);
  let channelInfo = isChannelId ? { type: 'id', value: link } : extractChannelInfo(link);

  if (!channelInfo) {
    throw new Error('Invalid channel link. Please provide a valid YouTube channel URL (e.g., https://www.youtube.com/@username or https://www.youtube.com/channel/UC...) or a channel ID.');
  }

  const { type, value } = channelInfo;
  const cacheKey = getCacheKey('temp', value);
  const cachedData = safeLocalStorage.getItem(cacheKey);

  if (cachedData) {
    try {
      const { channels, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return channels;
      }
    } catch (err) {
      console.error('Failed to parse cached data:', err);
    }
  }

  try {
    const params: any = { part: 'snippet', key: API_KEY };
    if (type === 'id') {
      params.id = value;
    } else {
      params.forHandle = value;
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', { params });

    const channelData = response.data.items.map((item: any) => ({
      id: item.id,
      snippet: {
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnails: { medium: item.snippet.thumbnails.medium },
      },
    }));

    if (channelData.length === 0) {
      throw new Error(`No channel found for ${type} ${value}`);
    }

    safeLocalStorage.setItem(
      cacheKey,
      JSON.stringify({ channels: channelData, timestamp: Date.now() })
    );
    return channelData;
  } catch (err: any) {
    if (err.response?.status === 403) {
      throw new Error('API limit reached. Please try again tomorrow or contact support.');
    }
    throw new Error(`No channel found for ${type} ${value}. Please ensure the link is a valid YouTube channel URL or ID.`);
  }
};