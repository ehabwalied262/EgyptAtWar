import { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface YouTubeChannel {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: { medium: { url: string } };
  };
  userDescription?: string;
  badges?: string[];
  likes?: number;
  addedBy?: string;
}

const initialCategories: { [key: string]: { handle: string; description?: string; badges?: string[]; addedBy?: string }[] } = {
  economy: [],
  history: [],
  geopolitics: [],
  english: [],
  german: [],
  nutrition: [],
  psychology: [],
  tech: [],
};

interface ChannelItemProps {
  channel: { handle: string; description?: string; badges?: string[]; addedBy?: string };
  onEdit: (channel: { handle: string; description?: string; badges?: string[]; addedBy?: string }) => void;
  onDelete: (handle: string) => void;
  userId: string;
}

const ChannelItem = ({ channel, onEdit, onDelete, userId }: ChannelItemProps) => {
  const [channelData, setChannelData] = useState<YouTubeChannel | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState(channel.description || '');
  const [editTags, setEditTags] = useState<string[]>(channel.badges || []);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const data = await fetchChannelByLink(channel.handle);
        setChannelData(data[0]);
      } catch (err) {
        console.error(`Failed to fetch channel data for ${channel.handle}:`, err);
      }
    };
    fetchChannelData();
  }, [channel.handle]);

  const handleSaveEdit = () => {
    onEdit({ ...channel, description: editDescription, badges: editTags });
    setIsEditing(false);
  };

  const removeTag = (index: number) => {
    setEditTags(editTags.filter((_, i) => i !== index));
  };

  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.endsWith(' ') && !value.includes('-')) {
      const lastTag = value.trim().split(' ').slice(-1)[0];
      if (lastTag && !editTags.includes(lastTag)) {
        setEditTags([...editTags, lastTag]);
        setNewTag('');
      } else {
        setNewTag('');
      }
    } else {
      setNewTag(value);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !editTags.includes(newTag.trim())) {
      setEditTags([...editTags, newTag.trim()]);
      setNewTag('');
    }
  };

  return (
    <li className="bg-gray-700 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {channelData ? (
            <>
              <img
                src={channelData.snippet.thumbnails.medium.url}
                alt={channelData.snippet.title}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-gray-200 truncate">{channelData.snippet.title}</span>
            </>
          ) : (
            <span className="text-gray-200 truncate">{channel.handle}</span>
          )}
        </div>
        <div className="flex space-x-4">
          {channel.addedBy === userId && (
            <>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-400 hover:text-blue-300"
              >
                <i className="fas fa-pen"></i>
              </button>
              <button
                onClick={() => onDelete(channel.handle)}
                className="text-red-400 hover:text-red-300"
              >
                <i className="fas fa-trash"></i>
              </button>
            </>
          )}
        </div>
      </div>
      {isEditing && (
        <div className="mt-4 space-y-3">
          <div className="relative">
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Edit description (max 200 characters)"
              maxLength={200}
              className="w-full p-2 bg-gray-600 text-gray-200 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <span className="absolute bottom-2 right-2 text-xs text-gray-400">
              {200 - editDescription.length} characters left
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {editTags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md flex items-center"
              >
                {tag}
                <button
                  onClick={() => removeTag(index)}
                  className="ml-1 text-white hover:text-gray-200"
                >
                  <i className="fas fa-times"></i>
                </button>
              </span>
            ))}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={handleTagInput}
                placeholder="New tag"
                className="p-1 bg-gray-600 text-gray-200 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addTag}
                className="text-blue-400 hover:text-blue-300"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem(key);
      } catch (err) {
        console.error(`Failed to get ${key} from localStorage:`, err);
        return null;
      }
    }
    return null;
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, value);
      } catch (err) {
        console.error(`Failed to set ${key} in localStorage:`, err);
      }
    }
  },
  removeItem: (key: string) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key);
      } catch (err) {
        console.error(`Failed to remove ${key} from localStorage:`, err);
      }
    }
  },
  clear: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.clear();
      } catch (err) {
        console.error('Failed to clear localStorage:', err);
      }
    }
  },
};

const YouTubeCarousel = () => {
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState('economy');
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [lastCategory, setLastCategory] = useState<string | null>(null);
  const [newChannelLink, setNewChannelLink] = useState('');
  const [newChannelDescription, setNewChannelDescription] = useState('');
  const [newChannelTags, setNewChannelTags] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [showManagePanel, setShowManagePanel] = useState(false);
  const [categories, setCategories] = useState(initialCategories);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingChannel, setEditingChannel] = useState<{ handle: string; description?: string; badges?: string[]; addedBy?: string } | null>(null);
  const [likes, setLikes] = useState<{ [key: string]: number }>({});
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = safeLocalStorage.getItem('userId') || uuidv4();
      setUserId(storedUserId);
      safeLocalStorage.setItem('userId', storedUserId);
    }
  }, []);

  const API_KEY = 'AIzaSyAxab3WsoosQR-TKWdN9IT7YRj6C-VPXlc';
  const getCacheKey = (category: string, identifier: string) => `yt_channel_${category}_${identifier}`;
  const CACHE_DURATION = 24 * 60 * 60 * 1000;
  const getDailyLimitKey = (category: string) => `daily_limit_${category}_${new Date().toDateString()}`;
  const MAX_DAILY_ADDS = 5;
  const getLikesKey = (channelId: string) => `channel_likes_${channelId}`;

  const canAddChannel = (category: string) => {
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

  const incrementDailyCount = (category: string) => {
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

  const loadLikes = () => {
    const likesData: { [key: string]: number } = {};
    Object.keys(categories).forEach((category) => {
      categories[category as keyof typeof categories].forEach((config) => {
        const channelId = extractChannelInfo(config.handle)?.value || config.handle;
        const likesKey = getLikesKey(channelId);
        const storedLikes = safeLocalStorage.getItem(likesKey);
        if (storedLikes) {
          likesData[channelId] = parseInt(storedLikes, 10);
        }
      });
    });
    return likesData;
  };

  const handleLike = (channelId: string) => {
    const likesKey = getLikesKey(channelId);
    const currentLikes = likes[channelId] || 0;
    const newLikes = currentLikes + 1;

    setLikes((prev) => ({
      ...prev,
      [channelId]: newLikes,
    }));

    safeLocalStorage.setItem(likesKey, newLikes.toString());
  };

  useEffect(() => {
    console.log('Loading categories from localStorage');
    const savedCategories = safeLocalStorage.getItem('userCategories');
    if (savedCategories) {
      try {
        const parsed = JSON.parse(savedCategories);
        if (parsed && typeof parsed === 'object') {
          setCategories(parsed);
        } else {
          console.error('Invalid categories format in localStorage');
          setCategories(initialCategories);
        }
      } catch (err) {
        console.error('Failed to parse saved categories:', err);
        setCategories(initialCategories);
      }
    }
    setLikes(loadLikes());
  }, []);

  const saveCategories = (updatedCategories: typeof categories) => {
    try {
      safeLocalStorage.setItem('userCategories', JSON.stringify(updatedCategories));
      setCategories(updatedCategories);
      setLikes(loadLikes());
    } catch (err) {
      console.error('Failed to save categories:', err);
    }
  };

  const extractChannelInfo = (link: string): { type: 'id' | 'handle' | 'video'; value: string } | null => {
  try {
    let normalizedLink = link;
    if (!normalizedLink.startsWith('http')) {
      normalizedLink = `https://${normalizedLink}`;
    }
    const url = new URL(normalizedLink);
    let path = url.pathname;
    const hostname = url.hostname.toLowerCase();

    if (hostname === 'youtube.com' || hostname === 'www.youtube.com' || hostname === 'm.youtube.com' || hostname === 'youtu.be') {
      // Channel URL with /channel/
      if (path.startsWith('/channel/')) {
        const channelId = path.split('/channel/')[1]?.split('/')[0];
        if (channelId) return { type: 'id', value: channelId };
      }
      // Channel URL with /@
      if (path.startsWith('/@')) {
        const handle = path.split('/')[1];
        if (handle) return { type: 'handle', value: handle };
      }
      // Video URL with /watch
      if (path.startsWith('/watch') && url.searchParams.get('v')) {
        const videoId = url.searchParams.get('v');
        if (videoId) return { type: 'video', value: videoId };
      }
      // Short video URL (youtu.be)
      if (hostname === 'youtu.be') {
        const videoId = path.split('/')[1]?.split('?')[0]; // Remove query parameters
        if (videoId) return { type: 'video', value: videoId };
      }
    }
    return null;
  } catch {
    return null;
  }
};

  const fetchChannelByLink = async (link: string) => {
    console.log('fetchChannelByLink called with link:', link);
    const channelInfo = extractChannelInfo(link);
    if (!channelInfo) {
      throw new Error('Invalid channel or video link.');
    }

    const { type, value } = channelInfo;
    const cacheKey = getCacheKey(activeCategory, value);
    const cachedData = safeLocalStorage.getItem(cacheKey);

    if (cachedData) {
      try {
        const { channels, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_DURATION) {
          console.log(`Using cached data for ${type} ${value}`);
          return channels;
        }
      } catch (err) {
        console.error('Failed to parse cached data:', err);
      }
    }

    try {
      let channelId = value;
      if (type === 'video') {
        const videoResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
          params: {
            part: 'snippet',
            id: value,
            key: API_KEY,
          },
        });

        if (!videoResponse.data.items.length) {
          throw new Error(`No video found for ID ${value}`);
        }

        channelId = videoResponse.data.items[0].snippet.channelId;
      }

      const params: any = { part: 'snippet', key: API_KEY };
      if (type === 'id' || type === 'video') {
        params.id = channelId;
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
      throw new Error(`No channel found for ${type} ${value}. Please ensure the link is correct.`);
    }
  };

  const fetchChannels = async (category: string) => {
    console.log('fetchChannels called with category:', category);
    if (!category) {
      console.error('Category is undefined or empty');
      setChannels([]);
      setLoading(false);
      setError('Invalid category');
      setErrorDetails(['Please select a valid category.']);
      return;
    }

    if (category === lastCategory && channels.length > 0) {
      console.log('Returning cached channels for:', category);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setErrorDetails([]);

    try {
      const channelConfigs = categories[category as keyof typeof categories] || [];
      console.log('Channel configs:', channelConfigs);
      if (!channelConfigs.length) {
        console.log('No channels in category:', category);
        setChannels([]);
        setLastCategory(category);
        setLoading(false);
        return;
      }

      const fetchedChannels: YouTubeChannel[] = [];
      const tempErrorDetails: string[] = [];

      for (const config of channelConfigs) {
        if (!config.handle) {
          console.log('Skipping invalid handle:', config);
          continue;
        }

        try {
          const channelData = await fetchChannelByLink(config.handle);
          fetchedChannels.push(
            ...channelData.map((channel: YouTubeChannel) => ({
              ...channel,
              userDescription: config.description,
              badges: config.badges,
              addedBy: config.addedBy,
              likes: likes[channel.id] || 0,
            }))
          );
        } catch (err: any) {
          console.error(`Error fetching channel ${config.handle}:`, err.message);
          tempErrorDetails.push(`Failed to load channel ${config.handle}.`);
        }
      }

      if (fetchedChannels.length === 0 && tempErrorDetails.length > 0) {
        console.log('No channels fetched, setting error details:', tempErrorDetails);
        setError(null);
        setErrorDetails(tempErrorDetails);
        setChannels([]);
        setLastCategory(category);
        setLoading(false);
        return;
      }

      if (tempErrorDetails.length > 0) {
        console.log('Some channels failed to load:', tempErrorDetails);
        setErrorDetails(tempErrorDetails);
      }

      console.log('Fetched channels:', fetchedChannels);
      setChannels(fetchedChannels.sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 6));
      setLastCategory(category);
      setLoading(false);
    } catch (err: any) {
      console.error('General error fetching channels:', err.message);
      setError('Something went wrong.');
      setErrorDetails(['We couldn’t load the channels. Please try again or add a new channel.']);
      setChannels([]);
      setLastCategory(category);
      setLoading(false);
    }
  };

  const handleAddChannel = async () => {
    console.log('handleAddChannel called with link:', newChannelLink);
    if (!newChannelLink) {
      setError('Please enter a channel or video link.');
      setErrorDetails(['Enter a valid YouTube channel or video URL (e.g., https://www.youtube.com/@Psych2go or https://www.youtube.com/watch?v=VideoID).']);
      return;
    }

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|m\.youtube\.com|youtu\.be)\/(@[a-zA-Z0-9_-]+|channel\/[a-zA-Z0-9_-]+|watch\?v=[a-zA-Z0-9_-]+)$/;
    if (!youtubeRegex.test(newChannelLink)) {
      setError('Invalid YouTube URL.');
      setErrorDetails(['Please enter a valid YouTube channel or video URL.']);
      return;
    }

    if (!canAddChannel(activeCategory)) {
      setError('Daily limit reached.');
      setErrorDetails([
        `You've added the maximum of ${MAX_DAILY_ADDS} channels for ${activeCategory} today.`,
        'Try again tomorrow or choose another category.',
      ]);
      return;
    }

    setShowDialog(true);
  };

  const handleDialogSubmit = async () => {
    console.log('handleDialogSubmit called');
    if (!newChannelDescription) {
      setError('Please provide a reason why this channel is useful.');
      setErrorDetails(['The description is required to add a channel.']);
      setShowDialog(false);
      return;
    }

    setLoading(true);
    setError(null);
    setErrorDetails([]);
    setShowDialog(false);

    try {
      const channelData = await fetchChannelByLink(newChannelLink);
      const cleanHandle = newChannelLink;
      const tags = newChannelTags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      if (categories[activeCategory as keyof typeof categories].some((c) => c.handle === cleanHandle)) {
        setError('Channel already added.');
        setErrorDetails([`This channel is already in ${activeCategory}.`]);
        setNewChannelLink('');
        setNewChannelDescription('');
        setNewChannelTags('');
        setLoading(false);
        return;
      }

      const updatedCategories = {
        ...categories,
        [activeCategory]: [
          ...categories[activeCategory as keyof typeof categories],
          {
            handle: cleanHandle,
            description: newChannelDescription,
            badges: tags,
            addedBy: userId || 'anonymous',
          },
        ],
      };

      saveCategories(updatedCategories);
      setChannels([
        ...channels,
        ...channelData.map((channel: YouTubeChannel) => ({
          ...channel,
          userDescription: newChannelDescription,
          badges: tags,
          addedBy: userId || 'anonymous',
          likes: likes[channel.id] || 0,
        })),
      ].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 6));
      incrementDailyCount(activeCategory);
      setNewChannelLink('');
      setNewChannelDescription('');
      setNewChannelTags('');
      setLoading(false);
    } catch (err: any) {
      console.error(`Error adding channel ${newChannelLink}:`, err.message);
      setError('Could not add channel.');
      setErrorDetails([err.message]);
      setNewChannelLink('');
      setNewChannelDescription('');
      setNewChannelTags('');
      setLoading(false);
    }
  };

  const handleDeleteChannel = (handle: string) => {
    console.log('handleDeleteChannel called with handle:', handle);
    const updatedCategories = {
      ...categories,
      [activeCategory]: categories[activeCategory as keyof typeof categories].filter(
        (c) => c.handle !== handle
      ),
    };

    saveCategories(updatedCategories);
    setChannels(channels.filter((channel) => !handle.includes(channel.id)));
  };

  const handleEditChannel = (channel: { handle: string; description?: string; badges?: string[]; addedBy?: string }) => {
    console.log('handleEditChannel called with channel:', channel);
    setEditingChannel(channel);
    setShowManagePanel(true);
  };

  const handleSaveEdit = async () => {
    console.log('handleSaveEdit called');
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => {
        setIsClosing(true);
        setTimeout(() => {
          setShowManagePanel(false);
          setIsClosing(false);
          setSaved(false);
          setChannels((prevChannels) =>
            prevChannels.map((ch) =>
              editingChannel && editingChannel.handle.includes(ch.id)
                ? {
                    ...ch,
                    userDescription: editingChannel.description,
                    badges: editingChannel.badges,
                    addedBy: editingChannel.addedBy,
                  }
                : ch
            ).sort((a, b) => (b.likes || 0) - (a.likes || 0))
          );
          setEditingChannel(null);
        }, 300);
      }, 1000);
    } catch (err) {
      console.error('Error saving edit:', err);
      setError('Failed to save changes.');
      setErrorDetails(['Something went wrong while saving. Please try again.']);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTagsInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.endsWith(' ')) {
      value = value.trim() + ', ';
    }
    setNewChannelTags(value);
  };

  const handleTagsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setNewChannelTags((prev) => (prev.trim() ? prev.trim() + ', ' : prev));
    }
  };

  useEffect(() => {
    const handleFilterChange = (event: CustomEvent) => {
      const newCategory = event.detail.category.replace('-', ' ').toLowerCase();
      const categoryKey = newCategory.includes('nutrition')
        ? 'nutrition'
        : newCategory.includes('geo-politics')
        ? 'geopolitics'
        : newCategory;
      console.log('Filter changed to:', categoryKey);
      setActiveCategory(categoryKey);
      setRetryCount((prev) => {
        console.log('Incrementing retryCount to:', prev + 1);
        return prev + 1;
      });
    };

    console.log('Adding filterChange event listener');
    window.addEventListener('filterChange', handleFilterChange as EventListener);
    return () => {
      console.log('Removing filterChange event listener');
      window.removeEventListener('filterChange', handleFilterChange as EventListener);
    };
  }, []);

  useEffect(() => {
    console.log('useEffect triggered for fetchChannels, activeCategory:', activeCategory);
    console.log('Current channels:', channels);
    console.log('Current categories:', categories);
    fetchChannels(activeCategory);
  }, [retryCount, activeCategory, categories]);

  const filterItems = ['Economy', 'History', 'Geopolitics', 'English', 'German', 'Nutrition', 'Psychology', 'Tech'];

  console.log('Rendering YouTubeCarousel, loading:', loading, 'channels:', channels, 'activeCategory:', activeCategory);

  try {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        {console.log('JSX rendering started, activeCategory:', activeCategory)}
        <style>
          {`
            @keyframes dialog-open {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
            }
            @keyframes dialog-close {
              from { opacity: 1; transform: scale(1); }
              to { opacity: 0; transform: scale(0.9); }
            }
            .animate-dialog-open {
              animation: dialog-open 0.3s ease-out forwards;
            }
            .animate-dialog-close {
              animation: dialog-close 0.3s ease-out forwards;
            }
            .overflow-x-auto::-webkit-scrollbar {
              height: 8px;
            }
            .overflow-x-auto::-webkit-scrollbar-thumb {
              background-color: #4b5563;
              border-radius: 4px;
            }
            .overflow-x-auto::-webkit-scrollbar-track {
              background-color: #1f2937;
            }
            @media (min-width: 640px) {
              .max-w-2xl { max-width: 32rem; }
              .max-w-md { max-width: 28rem; }
            }
            @media (max-width: 639px) {
              .w-11/12 { width: 95%; }
            }
          `}
        </style>

        <div className="flex justify-between items-center mb-6">
          <div className="text-white p-4 flex space-x-4 overflow-x-auto whitespace-nowrap">
            {filterItems.map((item) => (
              <div
                key={item}
                className={`border border-white/50 px-3 py-1 rounded-md cursor-pointer hover:bg-blank hover:text-darkBackground flex-shrink-0 transition-all duration-300 ease-in-out ${
                  activeCategory === item.toLowerCase() ? 'bg-blank text-darkBackground' : ''
                }`}
                onClick={() => {
                  const categoryKey = item.toLowerCase().includes('nutrition')
                    ? 'nutrition'
                    : item.toLowerCase().includes('geo-politics')
                    ? 'geopolitics'
                    : item.toLowerCase();
                  console.log('Category clicked:', categoryKey);
                  setActiveCategory(categoryKey);
                  setRetryCount((prev) => {
                    console.log('Incrementing retryCount to:', prev + 1);
                    return prev + 1;
                  });
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 flex items-center space-x-4">
          <input
            type="text"
            value={newChannelLink}
            onChange={(e) => setNewChannelLink(e.target.value)}
            placeholder="Enter channel or video URL (e.g., https://www.youtube.com/@Psych2go or https://www.youtube.com/watch?v=VideoID)"
            className="px-4 py-2 w-full max-w-md bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddChannel}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Add Channel
          </button>
        </div>

        {showDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-100 p-6 rounded-lg max-w-md w-full animate-dialog-open">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Why is this channel useful?</h3>
              <textarea
                value={newChannelDescription}
                onChange={(e) => setNewChannelDescription(e.target.value)}
                placeholder="Explain why this channel is beneficial (max 200 characters)"
                maxLength={200}
                className="w-full p-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                rows={4}
              />
              <input
                type="text"
                value={newChannelTags}
                onChange={handleTagsInput}
                onKeyDown={handleTagsKeyDown}
                placeholder="Enter tags (e.g., Independent, Science-Based)"
                className="w-full p-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowDialog(false);
                    setNewChannelLink('');
                    setNewChannelDescription('');
                    setNewChannelTags('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDialogSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {showManagePanel && editingChannel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`bg-gray-800 p-6 rounded-lg w-11/12 max-w-2xl ${isClosing ? 'animate-dialog-close' : 'animate-dialog-open'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Edit Channel</h3>
                <button
                  onClick={() => {
                    setIsClosing(true);
                    setTimeout(() => {
                      setShowManagePanel(false);
                      setIsClosing(false);
                      setEditingChannel(null);
                    }, 300);
                  }}
                  className="text-gray-200 hover:text-white"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <ul className="space-y-4 max-h-80 overflow-y-auto">
                <ChannelItem
                  key={editingChannel.handle}
                  channel={editingChannel}
                  onEdit={handleEditChannel}
                  onDelete={handleDeleteChannel}
                  userId={userId || 'anonymous'}
                />
              </ul>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setIsClosing(true);
                    setTimeout(() => {
                      setShowManagePanel(false);
                      setIsClosing(false);
                      setEditingChannel(null);
                    }, 300);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                  ) : saved ? (
                    <i className="fas fa-check mr-2"></i>
                  ) : null}
                  {isSaving ? 'Saving...' : saved ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteDialog && editingChannel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-11/12 max-w-md animate-dialog-open">
              <h3 className="text-lg font-semibold text-white mb-4">Confirm Delete</h3>
              <p className="text-gray-200 mb-6">Are you sure you want to delete this channel?</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setEditingChannel(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDeleteChannel(editingChannel.handle);
                    setShowDeleteDialog(false);
                    setEditingChannel(null);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center p-4">
            <p className="text-red-600 text-lg font-semibold">{error}</p>
            {errorDetails.map((detail, index) => (
              <p key={index} className="text-sm text-gray-600 mt-2">{detail}</p>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading channels...</p>
          </div>
        ) : channels.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-gray-700 text-lg font-semibold">
              No channels added yet for {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Add a channel using a channel or video URL (e.g., https://www.youtube.com/@Psych2go) to get started.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-white">
              Featured Channels - {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {channels.map((channel) => (
                <div key={channel.id} className="relative flex space-x-4 p-4 bg-gray-800 rounded-lg">
                  <a
                    href={`https://www.youtube.com/channel/${channel.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                  >
                    <img
                      src={channel.snippet?.thumbnails?.medium?.url || 'https://via.placeholder.com/96'}
                      alt={channel.snippet?.title || 'Channel'}
                      className="w-24 h-24 rounded-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </a>
                  <div className="flex-1">
                    <h3
                      className="text-lg font-semibold text-white mb-2 select-text cursor-text"
                      dangerouslySetInnerHTML={{ __html: channel.snippet?.title || 'Unknown Channel' }}
                    />
                    <p className="text-sm text-gray-400 mb-2">{channel.userDescription || 'No description provided.'}</p>
                    <div className="flex flex-wrap gap-2">
                      {channel.badges?.length ? (
                        channel.badges.map((badge) => (
                          <span
                            key={badge}
                            className="inline-block bg-gray-600 text-white text-xs px-2 py-1 rounded-md"
                          >
                            {badge}
                          </span>
                        ))
                      ) : null}
                    </div>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => handleLike(channel.id)}
                        className="text-red-400 hover:text-red-300 flex items-center"
                      >
                        <i className="fas fa-heart mr-1"></i>
                        <span>{channel.likes || 0}</span>
                      </button>
                    </div>
                  </div>
                  {channel.addedBy === (userId || 'anonymous') && (
                    <div className="absolute top-2 right-2 flex space-x-4">
                      <button
                        onClick={() => {
                          const channelToEdit = categories[activeCategory as keyof typeof categories].find((c) =>
                            c.handle.includes(channel.id)
                          );
                          if (channelToEdit) {
                            handleEditChannel(channelToEdit);
                          }
                        }}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <i className="fas fa-pen"></i>
                      </button>
                      <button
                        onClick={() => {
                          const channelToDelete = categories[activeCategory as keyof typeof categories].find((c) =>
                            c.handle.includes(channel.id)
                          );
                          if (channelToDelete) {
                            setEditingChannel(channelToDelete);
                            setShowDeleteDialog(true);
                          }
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
          </>
        )}
      </div>
    );
  } catch (err) {
    console.error('Rendering error:', err);
    return (
      <div className="text-center p-4">
        <p className="text-red-600 text-lg font-semibold">Something went wrong</p>
        <p className="text-sm text-gray-600 mt-2">Please try again later or contact support.</p>
      </div>
    );
  }
};

export default YouTubeCarousel;