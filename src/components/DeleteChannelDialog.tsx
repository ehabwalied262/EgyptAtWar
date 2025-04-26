interface DeleteChannelDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    channelHandle: string;
  }
  
  const DeleteChannelDialog = ({ isOpen, onClose, onConfirm, channelHandle }: DeleteChannelDialogProps) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg w-11/12 max-w-md animate-dialog-open">
          <h3 className="text-lg font-semibold text-white mb-4">Confirm Delete</h3>
          <p className="text-gray-200 mb-6">Are you sure you want to delete the channel "{channelHandle}"?</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default DeleteChannelDialog;