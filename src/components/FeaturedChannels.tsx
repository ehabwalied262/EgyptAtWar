import { useState, useEffect } from 'react';

interface ChannelCard {
  id: string;
  channelName: string;
  channelAvatar: string;
  review: string;
  channelLink: string;
}

const dummyChannels: ChannelCard[] = [
  { id: '1', channelName: 'Vox', channelAvatar: '/egypt-map.png', review: 'Explains complex topics like economics and geopolitics.', channelLink: 'https://www.youtube.com/@Vox' },
  { id: '2', channelName: 'Kurzgesagt', channelAvatar: '/egypt-map.png', review: 'Stunning animations about science and big ideas.', channelLink: 'https://www.youtube.com/@kurzgesagt' },
  { id: '3', channelName: 'CrashCourse', channelAvatar: '/egypt-map.png', review: 'Engaging lessons on history, science, and more.', channelLink: 'https://www.youtube.com/@crashcourse' },
  { id: '4', channelName: 'TED-Ed', channelAvatar: '/egypt-map.png', review: 'Thought-provoking videos to explore new ideas.', channelLink: 'https://www.youtube.com/@TEDEd' },
  { id: '5', channelName: 'Numberphile', channelAvatar: '/egypt-map.png', review: 'Makes math exciting with fun content.', channelLink: 'https://www.youtube.com/@numberphile' },
  { id: '6', channelName: 'Vsauce', channelAvatar: '/egypt-map.png', review: 'Deep dives into science and philosophy.', channelLink: 'https://www.youtube.com/@Vsauce' },
  { id: '7', channelName: 'Khan Academy', channelAvatar: '/egypt-map.png', review: 'Comprehensive lessons in math and science.', channelLink: 'https://www.youtube.com/@khanacademy' },
  { id: '8', channelName: 'Veritasium', channelAvatar: '/egypt-map.png', review: 'Explores scientific concepts through experiments.', channelLink: 'https://www.youtube.com/@veritasium' },
  { id: '9', channelName: 'CGP Grey', channelAvatar: '/egypt-map.png', review: 'Simplifies politics and geography with animations.', channelLink: 'https://www.youtube.com/@CGPGrey' },
  { id: '10', channelName: '3Blue1Brown', channelAvatar: '/egypt-map.png', review: 'Visually stunning explanations of advanced math.', channelLink: 'https://www.youtube.com/@3blue1brown' },
  { id: '11', channelName: 'SmarterEveryDay', channelAvatar: '/egypt-map.png', review: 'Explores science through engineering experiments.', channelLink: 'https://www.youtube.com/@smartereveryday' },
  { id: '12', channelName: 'Organic Chemistry Tutor', channelAvatar: '/egypt-map.png', review: 'Clear tutorials on math and chemistry.', channelLink: 'https://www.youtube.com/@TheOrganicChemistryTutor' },
  { id: '13', channelName: 'PBS Space Time', channelAvatar: '/egypt-map.png', review: 'Delves into astrophysics and space.', channelLink: 'https://www.youtube.com/@pbsspacetime' },
  { id: '14', channelName: 'MinutePhysics', channelAvatar: '/egypt-map.png', review: 'Explains physics in quick animations.', channelLink: 'https://www.youtube.com/@minutephysics' },
  { id: '15', channelName: 'AsapSCIENCE', channelAvatar: '/egypt-map.png', review: 'Answers scientific questions with fun videos.', channelLink: 'https://www.youtube.com/@AsapSCIENCE' },
  { id: '16', channelName: 'National Geographic', channelAvatar: '/egypt-map.png', review: 'Documentaries about nature and culture.', channelLink: 'https://www.youtube.com/@NatGeo' },
  { id: '17', channelName: 'SciShow', channelAvatar: '/egypt-map.png', review: 'Explores the unexpected in everyday life.', channelLink: 'https://www.youtube.com/@SciShow' },
  { id: '18', channelName: 'It’s Okay To Be Smart', channelAvatar: '/egypt-map.png', review: 'Explains science behind the world.', channelLink: 'https://www.youtube.com/@itsokaytobesmart' },
  { id: '19', channelName: 'Physics Girl', channelAvatar: '/egypt-map.png', review: 'Explores physics with experiments.', channelLink: 'https://www.youtube.com/@physicsgirl' },
  { id: '20', channelName: 'Seeker', channelAvatar: '/egypt-map.png', review: 'Investigates the science around us.', channelLink: 'https://www.youtube.com/@Seeker' },
  { id: '21', channelName: 'The Infographics Show', channelAvatar: '/egypt-map.png', review: 'Animated infographics on various topics.', channelLink: 'https://www.youtube.com/@TheInfographicsShow' },
  { id: '22', channelName: 'Real Engineering', channelAvatar: '/egypt-map.png', review: 'Explores engineering and technology.', channelLink: 'https://www.youtube.com/@realengineering' },
  { id: '23', channelName: 'Real Science', channelAvatar: '/egypt-map.png', review: 'Delves into scientific discoveries.', channelLink: 'https://www.youtube.com/@realscience' },
  { id: '24', channelName: 'Stand-up Maths', channelAvatar: '/egypt-map.png', review: 'Makes mathematics entertaining.', channelLink: 'https://www.youtube.com/@standupmaths' },
];

const FeaturedChannels = () => {
  const [hoveredChannel, setHoveredChannel] = useState<ChannelCard | null>(null);
  const [typedText, setTypedText] = useState<string>('');

  // Handle typing effect for description
  useEffect(() => {
    if (!hoveredChannel) {
      setTypedText('');
      return;
    }

    let index = 0;
    setTypedText(''); // Reset text when new channel is hovered
    const interval = setInterval(() => {
      if (index < hoveredChannel.review.length) {
        setTypedText((prev) => prev + (hoveredChannel.review[index] || '')); // Ensure no undefined
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30); // Typing speed: 30ms per character

    return () => clearInterval(interval); // Cleanup interval on unmount or hover change
  }, [hoveredChannel]);

  const handleMouseLeave = () => {
    setHoveredChannel(null);
    setTypedText(''); // Ensure text is cleared
  };

  // Split channels into 4 rows with wave-like lengths
  const rows = [
    dummyChannels.slice(0, 10), // Row 1: 10 channels (longest)
    dummyChannels.slice(10, 16), // Row 2: 6 channels (shorter)
    dummyChannels.slice(16, 21), // Row 3: 5 channels (medium)
    dummyChannels.slice(21, 24), // Row 4: 3 channels (shortest)
  ];

  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-8">
      <style>
        {`
          .channels-wrapper {
            width: 100%;
            max-width: 1200px; /* Max width for larger screens */
            position: relative;
          }
          .intro-text {
            text-align: center;
            margin-bottom: 40px;
            color: white;
          }
          .channels-container {
            display: flex;
            flex-direction: column;
            gap: 30px; /* Space between rows */
            align-items: flex-end; /* Align rows to the right */
            width: 100%;
          }
          .channel-row {
            display: flex;
            gap: 15px; /* Space between avatars in a row */
            padding: 5px;
          }
          .channel-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
          }
          .channel-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%; /* Circular shape */
            object-fit: cover;
            transition: all 0.4s ease;
          }
          .hovered-container {
            position: fixed;
            left: 20px;
            top: 45%;
            transform: translateY(-50%);
            width: 400px; /* Fixed width for consistency */
            background: rgba(0, 0, 0, 0.8); /* Semi-transparent black background */
            border: 1px solid rgba(255, 255, 255, 0.2); /* Subtle border */
            border-radius: 10px;
            padding: 15px;
            display: flex;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .hovered-container.visible {
            opacity: 1;
          }
          .hovered-container .channel-avatar {
            width: 70px;
            height: 70px;
            border-radius: 50%; /* Keep circular shape */
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.5); /* Glow effect */
            margin-right: 15px;
          }
          .hovered-content {
            display: flex;
            flex-direction: column;
            flex: 1;
          }
          .hovered-channel-name {
            color: white;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .description-box {
            color: white;
            font-size: 16px;
            display: flex;
            align-items: center;
          }
          .channel-name {
            color: white;
            font-size: 10px;
            margin-top: 6px;
            text-align: center;
            max-width: 60px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .typing-cursor::after {
            content: '|';
            animation: blink 0.8s infinite;
            margin-left: 4px;
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          @media (max-width: 640px) {
            .channels-wrapper {
              max-width: 100%;
            }
            .intro-text {
              margin-bottom: 20px;
            }
            .intro-text h2 {
              font-size: 1.5rem; /* Smaller heading on mobile */
            }
            .intro-text p {
              font-size: 0.875rem; /* Smaller paragraph on mobile */
            }
            .channels-container {
              align-items: center; /* Center on mobile */
              gap: 10px; /* Smaller gap on mobile */
            }
            .channel-row {
              gap: 8px; /* Smaller gap between avatars */
              padding: 3px;
            }
            .channel-avatar {
              width: 24px;
              height: 24px;
            }
            .channel-name {
              font-size: 8px;
              max-width: 50px;
            }
            .hovered-container {
              left: 50%;
              transform: translateX(-50%) translateY(-50%); /* Center on mobile */
              width: 90%; /* Responsive width */
              max-width: 300px;
              padding: 10px;
            }
            .hovered-container .channel-avatar {
              width: 50px;
              height: 50px;
              margin-right: 10px;
            }
            .hovered-channel-name {
              font-size: 14px;
            }
            .description-box {
              font-size: 14px;
            }
          }
        `}
      </style>

      {/* Channels Wrapper */}
      <div className="channels-wrapper">
        {/* Introductory Text (above the channels) */}
        <div className="intro-text">
          <h2 className="text-3xl font-bold mb-4">Explore Our Curated YouTube Channels</h2>
          <p className="text-lg text-gray-300">Discover educational and inspiring content!</p>
        </div>

        {/* Channels Container (on the right) */}
        <div className="channels-container">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="channel-row">
              {row.map((channel) => (
                <div
                  key={channel.id}
                  className="channel-item"
                  onMouseEnter={() => setHoveredChannel(channel)}
                  onMouseLeave={handleMouseLeave}
                >
                  <a href={channel.channelLink} target="_blank" rel="noopener noreferrer">
                    <img
                      src={channel.channelAvatar}
                      alt={channel.channelName}
                      className="channel-avatar"
                    />
                  </a>
                  <span className="channel-name">{channel.channelName}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Hovered Container (appears on the left side) */}
        {hoveredChannel && (
          <div className={`hovered-container ${hoveredChannel ? 'visible' : ''}`}>
            <a href={hoveredChannel.channelLink} target="_blank" rel="noopener noreferrer">
              <img
                src={hoveredChannel.channelAvatar}
                alt={hoveredChannel.channelName}
                className="channel-avatar"
              />
            </a>
            <div className="hovered-content">
              <div className="hovered-channel-name">{hoveredChannel.channelName}</div>
              <div className="description-box">
                <span className="typing-cursor">{typedText}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedChannels;