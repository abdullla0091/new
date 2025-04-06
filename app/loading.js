export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4 mx-auto"></div>
        <p className="text-white">Loading page...</p>
      </div>
    </div>
  );
} 