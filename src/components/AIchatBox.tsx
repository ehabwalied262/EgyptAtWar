import React, { useState, useEffect, useRef } from 'react';

// Define the Message type
interface Message {
  text: string;
  isUser: boolean;
  isTyping?: boolean;
}

// Define the ChatTab type
interface ChatTab {
  id: number;
  name: string;
  messages: Message[];
}

// Define the bot-specific tabs type
interface BotTabs {
  nutrition: ChatTab[];
  hobbies: ChatTab[];
}

const AIChatBox: React.FC = () => {
  // Separate tabs for each bot
  const [botTabs, setBotTabs] = useState<BotTabs>({
    nutrition: [{ id: 1, name: "Chat 1", messages: [] }], // Removed initial intro message
    hobbies: [{ id: 1, name: "Chat 1", messages: [] }], // Removed initial intro message
  });
  const [activeTabId, setActiveTabId] = useState<number>(1);
  const [input, setInput] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("nutrition"); // Default filter
  const [displayedIntro, setDisplayedIntro] = useState<string>(""); // State for animated intro text
  const [currentQuestionSet, setCurrentQuestionSet] = useState<number>(0); // Tracks the current set of questions
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const filterItems = ["Nutrition", "Hobbies"];

  // Get the current bot's tabs based on the selected filter
  const currentTabs = botTabs[selectedFilter as keyof BotTabs];
  const activeTab = currentTabs.find((tab) => tab.id === activeTabId) || currentTabs[0];

  // Bot introduction and questions based on selected filter
  const botInfo = {
    nutrition: {
      name: "Asfour",
      avatar: "/asfour.png",
      intro: "Hi there! I’m Asfour, your Nutrition mentor. I’m here to help you eat healthier, boost your immunity, and prevent diseases with tips tailored for Egyptian cuisine. Let’s make smarter food choices together!",
      tip: "Asfour is not a doctor, so don’t take medical advice from him. He’s here to guide you on healthy eating habits!",
      questions: [
        "What’s a healthy breakfast option with Egyptian ingredients?",
        "How can I boost my immunity with food?",
        "What are some low-calorie Egyptian snacks?",
        "Is koshari a healthy meal option?",
        "What foods help with better digestion?",
        "Can I eat ful medames every day?",
        "What’s the best diet for weight loss?",
        "Are there healthy alternatives to fried taameya?",
        "How much water should I drink daily?",
        "What are the benefits of molokhia for health?",
        "How can I reduce sugar in my diet?",
        "What’s a balanced lunch idea for work?",
      ],
    },
    hobbies: {
      name: "Nousa",
      avatar: "/nousa.png",
      intro: "Hey hey! I’m Nousa, your Hobbies mentor. I’ll guide you to discover and develop hobbies that match your personality. Want to read without distractions or try something new? I’ve got you covered!",
      tip: "Nousa can’t do magic, but she’ll help you master a new hobby in just a few hours!",
      questions: [
        "What’s a good hobby for a busy schedule?",
        "How can I start painting as a beginner?",
        "What are some indoor hobbies for rainy days?",
        "How do I read books without distractions?",
        "What’s a fun hobby to do with friends?",
        "How can I learn to play a musical instrument?",
        "What are some creative writing tips?",
        "How do I start a small garden at home?",
        "What’s a relaxing hobby to reduce stress?",
        "How can I get into photography?",
        "What are some DIY craft ideas?",
        "How do I start learning to cook as a hobby?",
      ],
    },
  };

  const currentBot = botInfo[selectedFilter as keyof typeof botInfo];
  const currentQuestions = currentBot.questions.slice(currentQuestionSet * 4, (currentQuestionSet + 1) * 4);

  // Reset active tab when filter changes
  useEffect(() => {
    setActiveTabId(currentTabs[0].id); // Set to the first tab of the new bot
  }, [selectedFilter, currentTabs]);

  // Animate the intro text when the filter changes
  useEffect(() => {
    setDisplayedIntro(""); // Reset the displayed intro text
    let index = 0;
    const fullIntro = currentBot.intro;

    const typeIntro = () => {
      if (index < fullIntro.length) {
        setDisplayedIntro(fullIntro.slice(0, index + 1));
        index++;
        requestAnimationFrame(typeIntro);
      }
    };

    // Start the animation with a slight delay for better UX
    const timer = setTimeout(() => requestAnimationFrame(typeIntro), 300);
    return () => clearTimeout(timer); // Cleanup on unmount or filter change
  }, [selectedFilter, currentBot.intro]);

  // Auto-swipe questions every 4 seconds

  const [isQuestionsVisible, setIsQuestionsVisible] = useState<boolean>(true);
  useEffect(() => {
    const totalSets = Math.ceil(currentBot.questions.length / 4); // Total sets of 4 questions
    const interval = setInterval(() => {
      setIsQuestionsVisible(false); // Hide the current set
      setTimeout(() => {
        setCurrentQuestionSet((prev) => (prev + 1) % totalSets);
        setIsQuestionsVisible(true); // Show the new set
      }, 300); // Delay matches the fade-out duration
    }, 4000); // 4 seconds
  
    return () => clearInterval(interval); // Cleanup on unmount or filter change
  }, [selectedFilter, currentBot.questions]);

  const handleQuestionClick = (question: string) => {
    // Add the question as a user message
    setBotTabs((prev) => {
      const newBotTabs = { ...prev };
      const currentBotTabs = [...newBotTabs[selectedFilter as keyof BotTabs]];
      const tabIndex = currentBotTabs.findIndex((tab) => tab.id === activeTabId);
      currentBotTabs[tabIndex].messages = [...currentBotTabs[tabIndex].messages, { text: question, isUser: true }];
      newBotTabs[selectedFilter as keyof BotTabs] = currentBotTabs;
      return newBotTabs;
    });

    // Simulate bot response with typing animation
    setTimeout(() => {
      let index = 0;
      const botResponse = "Thank you, I have received your message!";
      setBotTabs((prev) => {
        const newBotTabs = { ...prev };
        const currentBotTabs = [...newBotTabs[selectedFilter as keyof BotTabs]];
        const tabIndex = currentBotTabs.findIndex((tab) => tab.id === activeTabId);
        currentBotTabs[tabIndex].messages = [...currentBotTabs[tabIndex].messages, { text: "", isUser: false, isTyping: true }];
        newBotTabs[selectedFilter as keyof BotTabs] = currentBotTabs;
        return newBotTabs;
      });

      const typeCharacter = () => {
        if (index < botResponse.length) {
          setBotTabs((prev) => {
            const newBotTabs = { ...prev };
            const currentBotTabs = [...newBotTabs[selectedFilter as keyof BotTabs]];
            const tabIndex = currentBotTabs.findIndex((tab) => tab.id === activeTabId);
            currentBotTabs[tabIndex].messages[currentBotTabs[tabIndex].messages.length - 1].text = botResponse.slice(0, index + 1);
            newBotTabs[selectedFilter as keyof BotTabs] = currentBotTabs;
            return newBotTabs;
          });
          index++;
          requestAnimationFrame(typeCharacter);
        } else {
          setBotTabs((prev) => {
            const newBotTabs = { ...prev };
            const currentBotTabs = [...newBotTabs[selectedFilter as keyof BotTabs]];
            const tabIndex = currentBotTabs.findIndex((tab) => tab.id === activeTabId);
            currentBotTabs[tabIndex].messages[currentBotTabs[tabIndex].messages.length - 1].isTyping = false;
            newBotTabs[selectedFilter as keyof BotTabs] = currentBotTabs;
            return newBotTabs;
          });
        }
      };
      requestAnimationFrame(typeCharacter);
    }, 500); // Delay before bot starts typing
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message to the active tab of the current bot
    setBotTabs((prev) => {
      const newBotTabs = { ...prev };
      const currentBotTabs = [...newBotTabs[selectedFilter as keyof BotTabs]];
      const tabIndex = currentBotTabs.findIndex((tab) => tab.id === activeTabId);
      currentBotTabs[tabIndex].messages = [...currentBotTabs[tabIndex].messages, { text, isUser: true }];
      newBotTabs[selectedFilter as keyof BotTabs] = currentBotTabs;
      return newBotTabs;
    });
    setInput("");

    // Simulate bot response with typing animation
    setTimeout(() => {
      let index = 0;
      const botResponse = "Thank you, I have received your message!";
      setBotTabs((prev) => {
        const newBotTabs = { ...prev };
        const currentBotTabs = [...newBotTabs[selectedFilter as keyof BotTabs]];
        const tabIndex = currentBotTabs.findIndex((tab) => tab.id === activeTabId);
        currentBotTabs[tabIndex].messages = [...currentBotTabs[tabIndex].messages, { text: "", isUser: false, isTyping: true }];
        newBotTabs[selectedFilter as keyof BotTabs] = currentBotTabs;
        return newBotTabs;
      });

      const typeCharacter = () => {
        if (index < botResponse.length) {
          setBotTabs((prev) => {
            const newBotTabs = { ...prev };
            const currentBotTabs = [...newBotTabs[selectedFilter as keyof BotTabs]];
            const tabIndex = currentBotTabs.findIndex((tab) => tab.id === activeTabId);
            currentBotTabs[tabIndex].messages[currentBotTabs[tabIndex].messages.length - 1].text = botResponse.slice(0, index + 1);
            newBotTabs[selectedFilter as keyof BotTabs] = currentBotTabs;
            return newBotTabs;
          });
          index++;
          requestAnimationFrame(typeCharacter);
        } else {
          setBotTabs((prev) => {
            const newBotTabs = { ...prev };
            const currentBotTabs = [...newBotTabs[selectedFilter as keyof BotTabs]];
            const tabIndex = currentBotTabs.findIndex((tab) => tab.id === activeTabId);
            currentBotTabs[tabIndex].messages[currentBotTabs[tabIndex].messages.length - 1].isTyping = false;
            newBotTabs[selectedFilter as keyof BotTabs] = currentBotTabs;
            return newBotTabs;
          });
        }
      };
      requestAnimationFrame(typeCharacter);
    }, 500); // Delay before bot starts typing
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const toggleWidth = () => {
    setIsExpanded((prev) => !prev);
  };

  const addNewTab = () => {
    if (currentTabs.length >= 6) return; // Limit to 6 tabs per bot
    const newId = Math.max(...currentTabs.map((tab) => tab.id)) + 1;
    setBotTabs((prev) => {
      const newBotTabs = { ...prev };
      const currentBotTabs = [...newBotTabs[selectedFilter as keyof BotTabs]];
      currentBotTabs.push({ id: newId, name: `Chat ${newId}`, messages: [] });
      newBotTabs[selectedFilter as keyof BotTabs] = currentBotTabs;
      return newBotTabs;
    });
    setActiveTabId(newId);
  };

  const closeTab = (id: number) => {
    setBotTabs((prev) => {
      const newBotTabs = { ...prev };
      const currentBotTabs = [...newBotTabs[selectedFilter as keyof BotTabs]];
      const filteredTabs = currentBotTabs.filter((tab) => tab.id !== id);
      if (filteredTabs.length === 0) {
        const newId = 1;
        filteredTabs.push({ id: newId, name: "Chat 1", messages: [] });
        setActiveTabId(newId);
      } else if (activeTabId === id) {
        setActiveTabId(filteredTabs[0].id);
      }
      newBotTabs[selectedFilter as keyof BotTabs] = filteredTabs;
      return newBotTabs;
    });
  };

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    };

    scrollToBottom();
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [activeTab.messages]);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Description Section */}
      <div className="w-full md:w-2/3 text-white">
        <h2 className="text-3xl font-bold mb-4">Discover Your Virtual Mentors!</h2>
        <p className="text-lg leading-relaxed">
          Use our virtual mentors to learn, grow, and explore in a simple and fun way. Pick your favorite and start your journey today!
        </p>

        {/* Filter Bar */}
        <div className="mt-6 p-4 flex space-x-4 overflow-x-auto whitespace-nowrap text-white">
          {filterItems.map((item) => (
            <div
              key={item}
              className={`border border-white/50 px-3 py-1 rounded-md cursor-pointer flex-shrink-0 transition-all duration-300 ease-in-out ${
                selectedFilter === item.toLowerCase()
                  ? "bg-white text-gray-900"
                  : "hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setSelectedFilter(item.toLowerCase())}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Bot Introduction with Typing Animation */}
        <div className="mt-6 flex items-start gap-4">
          <img
            src={currentBot.avatar}
            alt={`${currentBot.name} avatar`}
            className="w-12 h-12 rounded-full"
          />
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm max-w-[70%] shadow-md">
            <p className="text-black">{displayedIntro}</p>
          </div>
        </div>
      </div>

      {/* Chat Box Section */}
      <div
        className={`w-full ${isExpanded ? "md:w-2/3" : "md:w-1/3"} border border-gray-400 bg-blank shadow-lg flex flex-col rounded-lg overflow-hidden relative transition-all duration-300 ease-in-out`}
      >
        {/* Header with Bot Avatar, Name, and Resize Icon */}
        <div className="p-2 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img
              src={currentBot.avatar}
              alt={`${currentBot.name} avatar`}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-md text-gray-800">{currentBot.name}</span>
          </div>
          <button onClick={toggleWidth} className="text-gray-600 hover:text-gray-800 transition">
            <i className={`fas fa-arrows-alt-h ${isExpanded ? "text-blue-500" : ""}`}></i>
          </button>
        </div>

        <section className="w-full font-sans flex flex-col h-[500px]">
          {/* Tab Bar */}
          <div className="p-2 border-b border-gray-200 flex items-center gap-1 overflow-x-auto">
            {currentTabs.map((tab) => (
              <div
                key={tab.id}
                title={tab.name}
                className={`flex items-center px-2 py-1 rounded-t-lg cursor-pointer transition text-sm ${
                  tab.id === activeTabId ? "bg-blue-100 text-black" : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => setActiveTabId(tab.id)}
              >
                <span>{tab.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="ml-1 text-xs text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={addNewTab}
              className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-600 hover:bg-gray-300 rounded transition text-sm"
              disabled={currentTabs.length >= 6}
            >
              +
            </button>
          </div>

          {/* Scrollable Chat Section (Tip Box + Suggested Questions + Messages) */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5">
            {/* Tip Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5 shadow-lg">
              <p className="text-sm leading-relaxed text-black">
                <strong>{selectedFilter === "nutrition" ? "Note:" : "Note:"}</strong> {currentBot.tip}
              </p>
            </div>

            {/* Suggested Questions */}
            <div className="mb-5">
            <h3 className="text-sm font-semibold text-black mb-2">Suggested Questions:</h3>
            <div className={`grid grid-cols-2 gap-2 transition-opacity duration-300 ${isQuestionsVisible ? 'opacity-100' : 'opacity-0'}`}>
              {currentQuestions.map((question, index) => (
                <div
                  key={`${currentQuestionSet}-${index}`} // Key changes with question set to trigger animation
                  className="animate-slideInFade"
                  style={{ animationDelay: `${index * 0.1}s` }} // Staggered delay for each question
                >
                  <button
                    onClick={() => handleQuestionClick(question)}
                    className="bg-gray-100 border border-gray-300 rounded-lg p-2 text-sm text-black hover:bg-gray-200 hover:scale-105 hover:shadow-md transition-all duration-300 ease-in-out w-full text-left"
                  >
                    {question}
                  </button>
                </div>
              ))}
            </div>
          </div>

            {/* Chat Messages */}
            <div className="flex flex-col gap-4">
              {activeTab.messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${message.isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm max-w-[70%] shadow-md ${
                      message.isUser ? "bg-green-50 border-green-200" : ""
                    } ${message.isTyping ? "animate-pulse" : ""}`}
                  >
                    <p className="text-black">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input Box (Fixed) */}
          <div className="w-full p-5 border-t border-gray-200">
            <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-full p-3 shadow-md">
              <input
                type="text"
                placeholder="Type your message here..."
                className="flex-1 bg-transparent outline-none text-black placeholder-gray-500 text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
              />
              <button
                onClick={handleSubmit}
                className={`rounded-full p-2 transition ${
                  input.trim()
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!input.trim()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Font Awesome CDN */}
        <style>
          {`
            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

            @keyframes slideInFade {
        0% {
          opacity: 0;
          transform: translateY(10px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-slideInFade {
        animation: slideInFade 0.3s ease-in-out forwards;
      }
    `}


        </style>
      </div>
    </div>
  );
};

export default AIChatBox;