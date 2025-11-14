'use client';

import { FormEvent, useState, useEffect } from 'react';

type AddQuestionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: string) => Promise<void>;
  editingQuestion?: { id: string; question: string } | null;
};

export function AddQuestionModal({ isOpen, onClose, onSubmit, editingQuestion }: AddQuestionModalProps) {
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update question when editing
  useEffect(() => {
    if (editingQuestion) {
      setQuestion(editingQuestion.question);
    } else {
      setQuestion('');
    }
  }, [editingQuestion]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(question.trim());
      setQuestion('');
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la question:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-gray-800 bg-gray-950 p-8 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            {editingQuestion ? 'Modifier la question' : 'Ajouter une question'}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Formulez une question intelligente par rapport au contenu de la vidéo
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="question" className="mb-2 block text-sm font-medium text-gray-300">
              Votre question
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ex: Quelles sont les étapes clés abordées dans cette section ?"
              rows={4}
              className="w-full rounded-2xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition focus:border-gray-600 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-full border border-gray-700 px-6 py-3 text-sm font-semibold text-white transition hover:border-gray-600 hover:bg-gray-900 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !question.trim()}
              className="flex-1 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (editingQuestion ? 'Modification...' : 'Ajout...') : (editingQuestion ? 'Modifier la question' : 'Ajouter la question')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

