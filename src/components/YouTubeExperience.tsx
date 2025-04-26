import { useState, useEffect } from 'react';
import { safeLocalStorage } from './safeLocalStorage'; // Assuming same safeLocalStorage as YouTubeCarousel

interface Experience {
  id: string;
  channelName: string;
  channelAvatar: string;
  review: string;
}

const dummyExperiences: Experience[] = [
  {
    id: '1',
    channelName: 'Vox',
    channelAvatar: 'https://via.placeholder.com/64',
    review: 'Vox’s explainer videos helped me understand complex topics like economics and geopolitics in a simple way!',
  },
  {
    id: '2',
    channelName: 'Kurzgesagt',
    channelAvatar: 'https://via.placeholder.com/64',
    review: 'Kurzgesagt’s animations made science fun and accessible. I learned so much about the universe!',
  },
  {
    id: '3',
    channelName: 'CrashCourse',
    channelAvatar: 'https://via.placeholder.com/64',
    review: 'CrashCourse was my go-to for history lessons. It’s like having a great teacher in my pocket.',
  },
  {
    id: '4',
    channelName: 'TED-Ed',
    channelAvatar: 'https://via.placeholder.com/64',
    review: 'TED-Ed’s videos inspired me to think critically and explore new ideas every day.',
  },
  {
    id: '5',
    channelName: 'Numberphile',
    channelAvatar: 'https://via.placeholder.com/64',
    review: 'Numberphile made math exciting for me. Their videos are both fun and educational!',
  },
  {
    id: '6',
    channelName: 'Vsauce',
    channelAvatar: 'https://via.placeholder.com/64',
    review: 'Vsauce blew my mind with their deep dives into science and philosophy. Highly recommend!',
  },
];

const YouTubeExperience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [channelLink, setChannelLink] = useState('');
  const [review, setReview] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Load experiences from localStorage on mount
  useEffect(() => {
    const savedExperiences = safeLocalStorage.getItem('userExperiences');
    if (savedExperiences) {
      try {
        const parsed = JSON.parse(savedExperiences);
        if (Array.isArray(parsed)) {
          setExperiences([...dummyExperiences, ...parsed]);
        }
      } catch (err) {
        console.error('Failed to parse saved experiences:', err);
      }
    } else {
      setExperiences(dummyExperiences);
    }
  }, []);

  // Save experiences to localStorage
  const saveExperiences = (newExperiences: Experience[]) => {
    try {
      safeLocalStorage.setItem('userExperiences', JSON.stringify(newExperiences.filter(exp => !dummyExperiences.some(d => d.id === exp.id))));
      setExperiences(newExperiences);
    } catch (err) {
      console.error('Failed to save experiences:', err);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!channelLink || !review) {
      setError('Please enter a channel link and your experience.');
      return;
    }

    // Basic validation for YouTube channel link
    const isValidLink = channelLink.includes('youtube.com') && (channelLink.includes('/@') || channelLink.includes('/channel/'));
    if (!isValidLink) {
      setError('Please enter a valid YouTube channel URL (e.g., https://www.youtube.com/@username).');
      return;
    }

    // Extract channel name from link (simplified, ideally use API)
    const channelName = channelLink.split('/').pop()?.replace('@', '') || 'Unknown Channel';

    const newExperience: Experience = {
      id: Date.now().toString(),
      channelName,
      channelAvatar: 'https://via.placeholder.com/64', // Placeholder, can be replaced with API call
      review,
    };

    const updatedExperiences = [newExperience, ...experiences].slice(0, 6); // Keep only 6 cards
    saveExperiences(updatedExperiences);
    setChannelLink('');
    setReview('');
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-white text-center mb-8">
        Share Your Learning Journey
      </h2>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="bg-gray-800 rounded-lg p-6 flex space-x-4 hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={exp.channelAvatar}
              alt={exp.channelName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">{exp.channelName}</h3>
              <p className="text-gray-300 text-sm">{exp.review}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Share Your Experience Box */}
      <div className="bg-gray-900 rounded-lg p-8 max-w-2xl mx-auto">
        <h3 className="text-2xl font-semibold text-white text-center mb-4">
          Share Your Experience
        </h3>
        <p className="text-gray-300 text-center mb-6">
          Tell us how a YouTube channel helped you learn and grow!
        </p>
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}
        <div className="space-y-4">
          <input
            type="text"
            value={channelLink}
            onChange={(e) => setChannelLink(e.target.value)}
            placeholder="Enter YouTube channel URL (e.g., https://www.youtube.com/@username)"
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="How did this channel help you?"
            rows={4}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSubmit}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Share Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default YouTubeExperience;