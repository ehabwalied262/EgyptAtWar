import type { YouTubeChannel } from './types';

interface ChannelDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  channel: YouTubeChannel | null;
}

const ChannelDetailsDialog = ({ isOpen, onClose, channel }: ChannelDetailsDialogProps) => {
  if (!isOpen || !channel) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-100 p-6 rounded-lg max-w-md w-full animate-dialog-open">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{channel.snippet.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">{channel.userDescription || 'No description provided.'}</p>
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
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelDetailsDialog;