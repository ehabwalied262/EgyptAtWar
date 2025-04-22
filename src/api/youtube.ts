import axios from 'axios';
import { YouTubeChannel } from '../hooks/useYouTubeChannels';

const API_KEY = 'AIzaSyAxab3WsoosQR-TKWdN9IT7YRj6C-VPXlc';

// Extract channel ID or handle from URL
const extractChannelInfo = (url: string) => {
  const handleMatch = url.match(/youtube\.com\/@([^\s/?]+)/);
  const idMatch = url.match(/youtube\.com\/channel\/([^\s/?]+)/);
  return {
    handle: handleMatch ? handleMatch[1] : null,
    channelId: idMatch ? idMatch[1] : null,
  };
};

export const fetchChannelByUrl = async (url: string, cacheKey: string, cacheDuration: number) => {
  const { handle, channelId } = extractChannelInfo(url);
  if (!handle && !channelId) {
    throw new Error('Invalid YouTube channel URL.');
  }

  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    const { channels, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < cacheDuration) {
      console.log(`Using cached data for ${handle || channelId}`);
      return channels;
    }
  }

  try {
    const params = handle
      ? { part: 'snippet', forUsername: handle, key: API_KEY }
      : { part: 'snippet', id: channelId, key: API_KEY };

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
      throw new Error(`No channel found for ${handle || channelId}`);
    }

    localStorage.setItem(cacheKey, JSON.stringify({ channels: channelData, timestamp: Date.now() }));
    return channelData;
  } catch (err: any) {
    throw new Error(err.message);
  }
};