import { Suspense } from 'react';
import { SignInContent } from '../signin-content';

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800"><p className="text-white">Chargement...</p></div>}>
      <SignInContent />
    </Suspense>
  );
}
