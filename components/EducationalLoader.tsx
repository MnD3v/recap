'use client';

interface EducationalLoaderProps {
  message?: string;
}

export function EducationalLoader({ message = "Chargement..." }: EducationalLoaderProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center">
        {/* Animated Book Icon */}
        <div className="relative mx-auto mb-8 h-24 w-24">
          {/* Book Pages */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-20 w-16">
              {/* Left Page */}
              <div 
                className="absolute left-0 top-0 h-full w-1/2 origin-right rounded-l-lg border-2 border-indigo-500 bg-gradient-to-br from-indigo-950 to-indigo-900"
                style={{
                  animation: 'bookFlip 2s ease-in-out infinite',
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="absolute left-1 top-2 space-y-1">
                  <div className="h-0.5 w-4 bg-indigo-400/50 rounded"></div>
                  <div className="h-0.5 w-3 bg-indigo-400/50 rounded"></div>
                  <div className="h-0.5 w-4 bg-indigo-400/50 rounded"></div>
                </div>
              </div>
              
              {/* Right Page */}
              <div 
                className="absolute right-0 top-0 h-full w-1/2 origin-left rounded-r-lg border-2 border-indigo-500 bg-gradient-to-bl from-indigo-950 to-indigo-900"
                style={{
                  animation: 'bookFlip 2s ease-in-out infinite 1s',
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="absolute right-1 top-2 space-y-1">
                  <div className="h-0.5 w-4 bg-indigo-400/50 rounded"></div>
                  <div className="h-0.5 w-3 bg-indigo-400/50 rounded"></div>
                  <div className="h-0.5 w-4 bg-indigo-400/50 rounded"></div>
                </div>
              </div>
              
              {/* Book Spine */}
              <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-indigo-600"></div>
            </div>
          </div>

          {/* Floating Graduation Cap */}
          <div 
            className="absolute -right-2 -top-2"
            style={{
              animation: 'graduationFloat 3s ease-in-out infinite',
            }}
          >
            <svg className="h-8 w-8 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
            </svg>
          </div>

          {/* Floating Pencil */}
          <div 
            className="absolute -left-2 -bottom-2"
            style={{
              animation: 'pageFloat 2.5s ease-in-out infinite',
            }}
          >
            <svg className="h-6 w-6 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="mb-4 text-xl font-semibold text-white">
          {message}
        </h2>

        {/* Animated Dots */}
        <div className="flex items-center justify-center gap-2">
          <div 
            className="h-2 w-2 rounded-full bg-indigo-500"
            style={{
              animation: 'dotPulse 1.5s ease-in-out infinite',
            }}
          ></div>
          <div 
            className="h-2 w-2 rounded-full bg-indigo-500"
            style={{
              animation: 'dotPulse 1.5s ease-in-out infinite 0.3s',
            }}
          ></div>
          <div 
            className="h-2 w-2 rounded-full bg-indigo-500"
            style={{
              animation: 'dotPulse 1.5s ease-in-out infinite 0.6s',
            }}
          ></div>
        </div>

        {/* Progress Line */}
        <div className="mx-auto mt-8 h-1 w-48 overflow-hidden rounded-full bg-gray-800">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600"
            style={{
              animation: 'pencilWrite 2s ease-in-out infinite',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

