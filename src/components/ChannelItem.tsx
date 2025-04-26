import { useState, useEffect } from 'react';
import type { YouTubeChannel, ChannelItemProps } from './types'; // Use import type for types
import { fetchChannelByLink } from './api'; // Regular import for value

const ChannelItem = ({ channel, onEdit, onDelete, onShowDetails, userId }: ChannelItemProps) => {
  const [channelData, setChannelData] = useState<YouTubeChannel | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState(channel.description || '');
  const [editTags, setEditTags] = useState<string[]>(channel.badges || []);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchChannelByLink(channel.handle);
        setChannelData(data[0]);
      } catch (err) {
        console.error(`Failed to fetch channel data for ${channel.handle}:`, err);
      }
    };
    fetchData();
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

  const truncatedDescription = channel.description && channel.description.length > 100
    ? `${channel.description.slice(0, 100)}...`
    : channel.description;

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
        {channel.addedBy === userId && (
          <div className="flex space-x-4">
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
          </div>
        )}
      </div>
      {channel.description && (
        <div className="mt-2 text-sm text-gray-400">
          <p>
            {truncatedDescription}
            {channel.description.length > 100 && (
              <button
                onClick={() => channelData && onShowDetails({ ...channelData, userDescription: channel.description, badges: channel.badges, addedBy: channel.addedBy })}
                className="text-blue-400 hover:text-blue-300 ml-2"
              >
                See More
              </button>
            )}
          </p>
        </div>
      )}
        {(channel.badges || []).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
            {(channel.badges || []).map((badge, index) => (
            <span
                key={index}
                className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md"
            >
                {badge}
            </span>
            ))}
        </div>
        )}
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
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default ChannelItem;