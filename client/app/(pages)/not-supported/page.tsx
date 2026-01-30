export default function NotSupported() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h1 className="text-3xl font-bold text-white">
            Mobile View Not Supported
          </h1>
        </div>
        
        <div className="space-y-4 text-gray-300">
          <p className="text-lg">
            This application is currently only available on desktop devices.
          </p>
          <p className="text-sm">
            Please access this site from a desktop or laptop computer with a screen width of at least 1024px for the best experience.
          </p>
        </div>

        <div className="pt-6">
          <div className="inline-flex items-center space-x-2 text-gray-400">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm">Desktop Only</span>
          </div>
        </div>
      </div>
    </div>
  );
}
