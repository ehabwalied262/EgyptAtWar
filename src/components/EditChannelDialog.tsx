import { useState } from 'react';
import type { ChannelConfig } from './types'; // Use import type for ChannelConfig

interface EditChannelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (channel: ChannelConfig) => void;
  channel: ChannelConfig;
}

const EditChannelDialog = ({ isOpen, onClose, onSave, channel }: EditChannelDialogProps) => {
  const [description, setDescription] = useState(channel.description || '');
  const [tags, setTags] = useState(channel.badges?.join(', ') || '');
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!description) {
      setError('Please provide a description.');
      return;
    }
    const tagArray = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    onSave({ ...channel, description, badges: tagArray });
    setError(null);
  };

  const handleTagsInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.endsWith(' ')) {
      value = value.trim() + ', ';
    }
    setTags(value);
  };

  const handleTagsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setTags((prev) => (prev.trim() ? prev.trim() + ', ' : prev));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-100 p-6 rounded-lg max-w-md w-full animate-dialog-open">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Edit Channel</h3>
        <p className="text-sm text-gray-600 mb-2">Channel: {channel.handle}</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Edit description (max 200 characters)"
          maxLength={200}
          className="w-full p-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          rows={4}
        />
        <input
          type="text"
          value={tags}
          onChange={handleTagsInput}
          onKeyDown={handleTagsKeyDown}
          placeholder="Edit tags (e.g., Independent, Science-Based)"
          className="w-full p-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditChannelDialog;