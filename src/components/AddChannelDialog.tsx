import { useState } from 'react';

interface AddChannelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (description: string, tags: string[]) => void;
  newChannelLink: string;
}

const AddChannelDialog = ({ isOpen, onClose, onSubmit, newChannelLink }: AddChannelDialogProps) => {
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!description) {
      setError('Please provide a reason why this channel is useful.');
      return;
    }
    const tagArray = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    onSubmit(description, tagArray);
    setDescription('');
    setTags('');
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
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Why is this channel useful?</h3>
        <p className="text-sm text-gray-600 mb-2">Channel: {newChannelLink}</p>
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
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddChannelDialog;