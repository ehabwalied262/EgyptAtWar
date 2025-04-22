import { useState } from 'react';

interface AddChannelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string, description: string, tags: string[]) => void;
  initialUrl?: string;
  initialDescription?: string;
  initialTags?: string[];
}

export const AddChannelDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialUrl = '',
  initialDescription = '',
  initialTags = [],
}: AddChannelDialogProps) => {
  const [url, setUrl] = useState(initialUrl);
  const [description, setDescription] = useState(initialDescription);
  const [tags, setTags] = useState(initialTags.join(', '));

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

  const handleSubmit = () => {
    if (!description) {
      alert('Please provide a description.');
      return;
    }
    const tagArray = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    onSubmit(url, description, tagArray);
    setUrl('');
    setDescription('');
    setTags('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-100 p-6 rounded-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          {initialUrl ? 'Edit Channel' : 'Add a Channel'}
        </h3>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube channel URL (e.g., https://www.youtube.com/@NutritionFactsOrg)"
          className="w-full p-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Explain why this channel is beneficial (max 200 characters)"
          maxLength={200}
          className="w-full p-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          rows={4}
        />
        <input
          type="text"
          value={tags}
          onChange={handleTagsInput}
          onKeyDown={handleTagsKeyDown}
          placeholder="Enter tags (e.g., Independent, Science-Based)"
          className="w-full p-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            {initialUrl ? 'Save' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};