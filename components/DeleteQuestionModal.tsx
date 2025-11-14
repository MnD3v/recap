'use client';

type DeleteQuestionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  questionText: string;
};

export function DeleteQuestionModal({ isOpen, onClose, onConfirm, questionText }: DeleteQuestionModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-3xl border border-gray-800 bg-gray-950 p-8 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            Supprimer la question ?
          </h2>
          <p className="mt-3 text-sm text-gray-400">
            Êtes-vous sûr de vouloir supprimer cette question ?
          </p>
          <div className="mt-4 rounded-xl border border-gray-800 bg-gray-900 p-3">
            <p className="text-sm text-gray-300">{questionText}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-gray-700 px-6 py-3 text-sm font-semibold text-white transition hover:border-gray-600 hover:bg-gray-900"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

