import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { YouTubeChannel, Categories, ChannelConfig } from './types';
import { safeLocalStorage } from './safeLocalStorage';
import { canAddChannel, incrementDailyCount, getLikesKey, extractChannelInfo } from './utils';
import { fetchChannelByLink } from './api';
import AddChannelDialog from './AddChannelDialog';
import EditChannelDialog from './EditChannelDialog';
import DeleteChannelDialog from './DeleteChannelDialog';
import ChannelDetailsDialog from './ChannelDetailsDialog';

const initialCategories: Categories = {
  economy: [],
  history: [],
  geopolitics: [],
  english: [],
  german: [],
  nutrition: [],
  psychology: [],
  tech: [],
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
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [editingChannel, setEditingChannel] = useState<ChannelConfig | null>(null);
  const [deletingChannel, setDeletingChannel] = useState<string | null>(null);
  const [detailsChannel, setDetailsChannel] = useState<YouTubeChannel | null>(null);
  const [categories, setCategories] = useState(initialCategories);
  const [likes, setLikes] = useState<{ [key: string]: boolean }>({});
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = safeLocalStorage.getItem('userId') || uuidv4();
      setUserId(storedUserId);
      safeLocalStorage.setItem('userId', storedUserId);
    }
  }, []);

  const loadLikes = () => {
    const likesData: { [key: string]: boolean } = {};
    Object.keys(categories).forEach((category) => {
      categories[category].forEach((config) => {
        const channelId = config.handle;
        const likesKey = getLikesKey(channelId);
        const storedLikes = safeLocalStorage.getItem(likesKey);
        if (storedLikes !== null) {
          likesData[channelId] = storedLikes === 'true';
        }
      });
    });
    return likesData;
  };

  useEffect(() => {
    const savedCategories = safeLocalStorage.getItem('userCategories');
    if (savedCategories) {
      try {
        const parsed = JSON.parse(savedCategories);
        if (parsed && typeof parsed === 'object') {
          setCategories(parsed);
        }
      } catch (err) {
        console.error('Failed to parse saved categories:', err);
        setCategories(initialCategories);
      }
    }
    setLikes(loadLikes());
  }, []);

  const saveCategories = (updatedCategories: Categories) => {
    try {
      safeLocalStorage.setItem('userCategories', JSON.stringify(updatedCategories));
      setCategories(updatedCategories);
      setLikes(loadLikes());
    } catch (err) {
      console.error('Failed to save categories:', err);
    }
  };

  const fetchChannels = async (category: string) => {
    if (!category) {
      setChannels([]);
      setLoading(false);
      setError('Invalid category');
      setErrorDetails(['Please select a valid category.']);
      return;
    }
  
    if (category === lastCategory && channels.length > 0) {
      setLoading(false);
      return;
    }
  
    setLoading(true);
    setError(null);
    setErrorDetails([]);
  
    try {
      const channelConfigs = categories[category] || [];
      if (!channelConfigs.length) {
        setChannels([]);
        setLastCategory(category);
        setLoading(false);
        return;
      }
  
      const fetchedChannels: YouTubeChannel[] = [];
      const tempErrorDetails: string[] = [];
  
      for (const config of channelConfigs) {
        if (!config.handle) continue;
  
        try {
          // بنستخدم channel.id مباشرة، بس fetchChannelByLink بيحتاج URL أو @handle
          // مؤقتًا، هنفترض إن config.handle هو channel.id
          const channelData = await fetchChannelByLink(`https://www.youtube.com/channel/${config.handle}`);
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
          tempErrorDetails.push(`Failed to load channel ${config.handle}.`);
        }
      }
  
      if (fetchedChannels.length === 0 && tempErrorDetails.length > 0) {
        setError(null);
        setErrorDetails(tempErrorDetails);
        setChannels([]);
        setLastCategory(category);
        setLoading(false);
        return;
      }
  
      if (tempErrorDetails.length > 0) {
        setErrorDetails(tempErrorDetails);
      }
  
      setChannels(fetchedChannels.sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 6));
      setLastCategory(category);
      setLoading(false);
    } catch (err: any) {
      setError('Something went wrong.');
      setErrorDetails(['We couldn’t load the channels. Please try again or add a new channel.']);
      setChannels([]);
      setLastCategory(category);
      setLoading(false);
    }
  };

  const handleAddChannel = async () => {
    if (!newChannelLink) {
      setError('Please enter a channel link.');
      setErrorDetails(['Enter a valid YouTube channel URL (e.g., https://www.youtube.com/@username).']);
      return;
    }

    // Check if the link is a valid channel link
    const channelInfo = extractChannelInfo(newChannelLink);
    if (!channelInfo) {
      setError('Invalid channel link.');
      setErrorDetails(['Please provide a valid YouTube channel URL (e.g., https://www.youtube.com/@username or https://www.youtube.com/channel/UC...). Video links are not allowed.']);
      return;
    }

    if (!canAddChannel(activeCategory)) {
      setError('Daily limit reached.');
      setErrorDetails([
        `You've added the maximum of ${5} channels for ${activeCategory} today.`,
        'Try again tomorrow or choose another category.',
      ]);
      return;
    }

    setShowAddDialog(true);
  };

  const handleAddDialogSubmit = async (description: string, tags: string[]) => {
    setLoading(true);
    setError(null);
    setErrorDetails([]);
    setShowAddDialog(false);
  
    try {
      const channelData = await fetchChannelByLink(newChannelLink);
      if (!channelData[0]?.id) {
        throw new Error('Could not retrieve channel ID.');
      }
      const channelId = channelData[0].id; // استخدام channel.id من البيانات المرجعة
  
      // Ensure categories[activeCategory] is an array
      const categoryChannels = categories[activeCategory] || [];
      if (categoryChannels.some((c) => c.handle === channelId)) {
        setError('Channel already added.');
        setErrorDetails([`This channel is already in ${activeCategory}.`]);
        setNewChannelLink('');
        setLoading(false);
        return;
      }
  
      const updatedCategories = {
        ...categories,
        [activeCategory]: [
          ...(categoryChannels),
          {
            handle: channelId, // حفظ channel.id كـ handle
            description,
            badges: tags || [],
            addedBy: userId || 'anonymous',
          },
        ],
      };
  
      saveCategories(updatedCategories);
      setChannels([
        ...channels,
        ...channelData.map((channel: YouTubeChannel) => ({
          ...channel,
          userDescription: description,
          badges: tags || [],
          addedBy: userId || 'anonymous',
          likes: likes[channel.id] || 0,
        })),
      ].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 6));
      incrementDailyCount(activeCategory);
      setNewChannelLink('');
      setLoading(false);
    } catch (err: any) {
      setError('Could not add channel.');
      setErrorDetails([err.message]);
      setNewChannelLink('');
      setLoading(false);
    }
  };

  const handleEditChannel = (channel: ChannelConfig) => {
    console.log('handleEditChannel called with:', channel);
    setEditingChannel(channel);
    setShowEditDialog(true);
  };

  const handleSaveEdit = (updatedChannel: ChannelConfig) => {
    const updatedCategories = {
      ...categories,
      [activeCategory]: categories[activeCategory].map((c) =>
        c.handle === updatedChannel.handle
          ? { ...updatedChannel, badges: updatedChannel.badges || [] }
          : c
      ),
    };

    saveCategories(updatedCategories);
    setChannels(channels.map((ch) =>
      updatedChannel.handle.includes(ch.id)
        ? { ...ch, userDescription: updatedChannel.description, badges: updatedChannel.badges || [] }
        : ch
    ).sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 6));
    setShowEditDialog(false);
    setEditingChannel(null);
  };

  const handleDeleteChannel = (handle: string) => {
    console.log('handleDeleteChannel called with:', handle);
    setDeletingChannel(handle);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (deletingChannel) {
      const updatedCategories = {
        ...categories,
        [activeCategory]: categories[activeCategory].filter((c) => c.handle !== deletingChannel),
      };

      saveCategories(updatedCategories);
      setChannels(channels.filter((channel) => !deletingChannel.includes(channel.id)));
      setShowDeleteDialog(false);
      setDeletingChannel(null);
    }
  };

  const handleLike = (channelId: string) => {
    const likesKey = getLikesKey(channelId);
    const currentLiked = likes[channelId] || false;
    const newLiked = !currentLiked;
  
    setLikes((prev) => ({
      ...prev,
      [channelId]: newLiked,
    }));
  
    safeLocalStorage.setItem(likesKey, newLiked.toString());
  };

  useEffect(() => {
    const handleFilterChange = (event: CustomEvent) => {
      const newCategory = event.detail.category.replace('-', ' ').toLowerCase();
      const categoryKey = newCategory.includes('nutrition')
        ? 'nutrition'
        : newCategory.includes('geo-politics')
        ? 'geopolitics'
        : newCategory;
      // Only set activeCategory if it's a valid category
      if (Object.keys(categories).includes(categoryKey)) {
        setActiveCategory(categoryKey);
        setRetryCount((prev) => prev + 1);
      } else {
        console.warn(`Invalid category: ${categoryKey}`);
        setActiveCategory('economy');
      }
    };

    window.addEventListener('filterChange', handleFilterChange as EventListener);
    return () => {
      window.removeEventListener('filterChange', handleFilterChange as EventListener);
    };
  }, [categories]);

  useEffect(() => {
    fetchChannels(activeCategory);
  }, [retryCount, activeCategory, categories]);

  const filterItems = ['Economy', 'History', 'Geopolitics', 'English', 'German', 'Nutrition', 'Psychology', 'Tech'];

  return (
    
    <div className="max-w-7xl mx-auto py-8 px-8">
      <div className="text-left mb-6">
      <h2 className="text-2xl font-semibold text-white">
        YouTube is your free, world-class school
      </h2>
      <p className="text-lg text-gray-300 mt-2">
        Pick a category that sparks your curiosity and start learning today!
      </p>
    </div>
      <style>
        {`
          @keyframes dialog-open {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-dialog-open {
            animation: dialog-open 0.3s ease-out forwards;
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
                setActiveCategory(categoryKey);
                setRetryCount((prev) => prev + 1);
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
          placeholder="Enter channel URL (e.g., https://www.youtube.com/@username)"
          className="px-4 py-2 w-full max-w-md bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddChannel}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Add Channel
        </button>
      </div>

      <AddChannelDialog
        isOpen={showAddDialog}
        onClose={() => {
          setShowAddDialog(false);
          setNewChannelLink('');
        }}
        onSubmit={handleAddDialogSubmit}
        newChannelLink={newChannelLink}
      />

      {editingChannel && (
        <EditChannelDialog
          isOpen={showEditDialog}
          onClose={() => {
            setShowEditDialog(false);
            setEditingChannel(null);
          }}
          onSave={handleSaveEdit}
          channel={editingChannel}
        />
      )}

      <DeleteChannelDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeletingChannel(null);
        }}
        onConfirm={handleConfirmDelete}
        channelHandle={deletingChannel || ''}
      />

      <ChannelDetailsDialog
        isOpen={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        channel={detailsChannel}
      />

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
            Add a channel using a channel URL (e.g., https://www.youtube.com/@username) to get started.
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
                  {channel.userDescription && (
                    <p className="text-sm text-gray-400 mb-2">
                      {channel.userDescription.length > 100
                        ? `${channel.userDescription.slice(0, 100)}...`
                        : channel.userDescription}
                      {channel.userDescription.length > 100 && (
                        <button
                          onClick={() => {
                            setDetailsChannel(channel);
                            setShowDetailsDialog(true);
                          }}
                          className="text-blue-400 hover:text-blue-300 ml-2"
                        >
                          See More
                        </button>
                      )}
                    </p>
                  )}
                  {Array.isArray(channel.badges) && channel.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {channel.badges.map((badge) => (
                        <span
                          key={badge}
                          className="inline-block bg-gray-600 text-white text-xs px-2 py-1 rounded-md"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-end justify-end mt-4">
                  <button
                    onClick={() => handleLike(channel.id)}
                    className={`flex items-center ${likes[channel.id] ? 'text-blue-400' : 'text-gray-400'} hover:text-blue-300`}
                  >
                    <i className={`fas fa-thumbs-up ${likes[channel.id] ? 'fa-solid' : ''} mr-1`}></i>
                  </button>
                </div>
                </div>
                {channel.addedBy === (userId || 'anonymous') && (
                <div className="absolute top-2 right-2 flex space-x-4">
                  <button
                    onClick={() => {
                      console.log('Edit button clicked for channel:', channel.id);
                      const channelToEdit = categories[activeCategory].find((c) => c.handle === channel.id);
                      console.log('channelToEdit:', channelToEdit);
                      if (channelToEdit) {
                        handleEditChannel(channelToEdit);
                      } else {
                        console.error('Channel to edit not found:', channel.id);
                      }
                    }}
                    className="text-blue-400 hover:text-blue-300 pt-2 pr-2"
                  >
                    <i className="fas fa-pen"></i>
                  </button>
                  <button
                    onClick={() => {
                      console.log('Delete button clicked for channel:', channel.id);
                      const channelToDelete = categories[activeCategory].find((c) => c.handle === channel.id);
                      console.log('channelToDelete:', channelToDelete);
                      if (channelToDelete) {
                        handleDeleteChannel(channelToDelete.handle);
                      } else {
                        console.error('Channel to delete not found:', channel.id);
                      }
                    }}
                    className="text-red-400 hover:text-red-300 pt-2 pr-2"
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
};

export default YouTubeCarousel;