// import { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import ReactPlayer from 'react-player/youtube';
// import { safeLocalStorage } from './safeLocalStorage';

// interface Caption {
//   text: string;
//   start: number;
//   duration: number;
// }

// interface Question {
//   id: string;
//   text: string;
//   answer?: string;
// }

// interface Video {
//   url: string;
//   category: string;
// }

// const VideoAnalyzer = () => {
//   const [videoUrl, setVideoUrl] = useState('');
//   const [category, setCategory] = useState('');
//   const [newCategory, setNewCategory] = useState('');
//   const [categories, setCategories] = useState<string[]>([]);
//   const [videos, setVideos] = useState<Video[]>([]);
//   const [captions, setCaptions] = useState<Caption[]>([]);
//   const [captionLanguage, setCaptionLanguage] = useState('en');
//   const [currentTime, setCurrentTime] = useState(0);
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [errorDetails, setErrorDetails] = useState<string[]>([]);
//   const [showSidebar, setShowSidebar] = useState(true);
//   const [showGenerateCaptionsDialog, setShowGenerateCaptionsDialog] = useState(false);
//   const [lastProcessedSegment, setLastProcessedSegment] = useState(-1);
//   const playerRef = useRef<ReactPlayer>(null);

//   const YOUTUBE_API_KEY = 'AIzaSyAxab3WsoosQR-TKWdN9IT7YRj6C-VPXlc'; // استبدل بـ YouTube API Key
//   const GEMINI_API_KEY =  "AIzaSyB0JkJ5L3zNsAbYdGiHMhR3KoBzVoGo6-I"

//   // Load videos and categories from localStorage
//   useEffect(() => {
//     const savedVideos = safeLocalStorage.getItem('userVideos');
//     if (savedVideos) {
//       try {
//         const parsed = JSON.parse(savedVideos);
//         if (Array.isArray(parsed)) {
//           setVideos(parsed);
//         }
//       } catch (err) {
//         console.error('Failed to parse saved videos:', err);
//       }
//     }

//     const savedCategories = safeLocalStorage.getItem('userCategories');
//     if (savedCategories) {
//       try {
//         const parsed = JSON.parse(savedCategories);
//         if (Array.isArray(parsed)) {
//           setCategories(parsed);
//         }
//       } catch (err) {
//         console.error('Failed to parse saved categories:', err);
//       }
//     }
//   }, []);

//   // Save videos to localStorage
//   const saveVideos = (updatedVideos: Video[]) => {
//     try {
//       safeLocalStorage.setItem('userVideos', JSON.stringify(updatedVideos));
//       setVideos(updatedVideos);
//     } catch (err) {
//       console.error('Failed to save videos:', err);
//     }
//   };

//   // Save categories to localStorage
//   const saveCategories = (updatedCategories: string[]) => {
//     try {
//       safeLocalStorage.setItem('userCategories', JSON.stringify(updatedCategories));
//       setCategories(updatedCategories);
//     } catch (err) {
//       console.error('Failed to save categories:', err);
//     }
//   };

//   // Extract video ID from YouTube URL
//   const extractVideoId = (url: string): string | null => {
//     try {
//       const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
//       const urlObj = new URL(normalizedUrl);
//       const hostname = urlObj.hostname.toLowerCase();
//       if (hostname.includes('youtube.com') && urlObj.searchParams.get('v')) {
//         return urlObj.searchParams.get('v');
//       }
//       if (hostname === 'youtu.be') {
//         return urlObj.pathname.split('/')[1]?.split('?')[0];
//       }
//       return null;
//     } catch {
//       return null;
//     }
//   };

//   // Fetch captions from YouTube
//   const fetchCaptions = async (videoId: string, language: string) => {
//     try {
//       // Get caption tracks
//       const captionResponse = await axios.get('https://www.googleapis.com/youtube/v3/captions', {
//         params: {
//           part: 'snippet',
//           videoId,
//           key: YOUTUBE_API_KEY,
//         },
//       });

//       const captionTrack = captionResponse.data.items.find(
//         (item: any) => item.snippet.language === language || item.snippet.language === `${language}-${language.toUpperCase()}`
//       );

//       if (!captionTrack) {
//         throw new Error(`No captions available in ${language}.`);
//       }

//       // Fetch caption content (XML format)
//       const captionContentResponse = await axios.get(
//         `https://www.googleapis.com/youtube/v3/captions/${captionTrack.id}`,
//         {
//           params: {
//             key: YOUTUBE_API_KEY,
//             tfmt: 'vtt', // WebVTT format
//           },
//         }
//       );

//       // Parse WebVTT captions
//       const vttLines = captionContentResponse.data.split('\n');
//       const parsedCaptions: Caption[] = [];
//       let currentCaption: Partial<Caption> = {};

//       for (let i = 0; i < vttLines.length; i++) {
//         const line = vttLines[i].trim();
//         if (line.includes('-->')) {
//           const [start, end] = line.split(' --> ').map((time) => {
//             const [hours, minutes, seconds] = time.split(':');
//             const [sec, ms] = seconds.split('.');
//             return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(sec) + parseInt(ms) / 1000;
//           });
//           currentCaption.start = start;
//           currentCaption.duration = end - start;
//         } else if (line && !line.startsWith('WEBVTT') && !line.startsWith('NOTE') && currentCaption.start !== undefined) {
//           currentCaption.text = line;
//           parsedCaptions.push(currentCaption as Caption);
//           currentCaption = {};
//         }
//       }

//       return parsedCaptions;
//     } catch (err: any) {
//       console.error('Failed to fetch captions:', err);
//       throw new Error(err.message);
//     }
//   };

//   // Generate captions using Gemini API
//   const generateCaptions = async (videoId: string) => {
//     try {
//       // Note: Gemini API doesn't directly support audio transcription, so we'd need a workaround
//       // For simplicity, we'll assume we have a transcript generation capability
//       const response = await axios.post(
//         'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
//         {
//           contents: [
//             {
//               parts: [
//                 {
//                   text: `Generate a transcript for a YouTube video with ID ${videoId}. The transcript should be in ${captionLanguage} and formatted as a list of text segments with approximate timestamps (start time in seconds). Example format:
// [
//   {"text": "Welcome to the video", "start": 0, "duration": 2},
//   {"text": "Let's discuss the topic", "start": 2, "duration": 3}
// ]`,
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${GEMINI_API_KEY}`,
//           },
//         }
//       );

//       const generated = JSON.parse(response.data.candidates[0].content.parts[0].text);
//       return generated.map((item: any) => ({
//         text: item.text,
//         start: item.start,
//         duration: item.duration,
//       })) as Caption[];
//     } catch (err: any) {
//       console.error('Failed to generate captions:', err);
//       throw new Error('Could not generate captions. Please try again later.');
//     }
//   };

//   // Generate questions for a segment using Gemini API
//   const generateQuestions = async (captionText: string, segmentIndex: number) => {
//     try {
//       const response = await axios.post(
//         'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
//         {
//           contents: [
//             {
//               parts: [
//                 {
//                   text: `Analyze the following video transcript segment and generate 1-2 open-ended questions to help the user engage with the content. The questions should encourage critical thinking and relate to the main ideas in the segment. Return the questions in a JSON array.

// Segment: ${captionText}

// Example output:
// [
//   "What is the main idea discussed in this segment?",
//   "How does this segment contribute to the overall video?"
// ]`,
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${GEMINI_API_KEY}`,
//           },
//         }
//       );

//       const questions = JSON.parse(response.data.candidates[0].content.parts[0].text);
//       return questions.map((q: string, i: number) => ({ id: `q${segmentIndex}_${i}`, text: q }));
//     } catch (err: any) {
//       console.error('Failed to generate questions:', err);
//       return [];
//     }
//   };

//   // Answer a specific question using Gemini API
//   const answerQuestion = async (question: string, captionText: string) => {
//     try {
//       const response = await axios.post(
//         'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
//         {
//           contents: [
//             {
//               parts: [
//                 {
//                   text: `Based on the following video transcript segment, provide a concise answer to the question: "${question}". Format the answer as plain text with bullet points for key points if applicable.

// Segment: ${captionText}

// Example answer:
// The main idea is to introduce the topic.
// - The speaker provides background information.
// - Key examples are used to illustrate the concept.`,
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${GEMINI_API_KEY}`,
//           },
//         }
//       );

//       return response.data.candidates[0].content.parts[0].text;
//     } catch (err: any) {
//       console.error('Failed to answer question:', err);
//       return 'Sorry, I couldn’t generate an answer. Please try again.';
//     }
//   };

//   // Handle adding a video
//   const handleAddVideo = async () => {
//     if (!videoUrl) {
//       setError('Please enter a YouTube video URL.');
//       setErrorDetails(['Enter a valid URL like https://youtu.be/TE8qgLjdoC0']);
//       return;
//     }

//     if (!category && !newCategory) {
//       setError('Please select or enter a category.');
//       setErrorDetails(['Choose an existing category or add a new one.']);
//       return;
//     }

//     const videoId = extractVideoId(videoUrl);
//     if (!videoId) {
//       setError('Invalid YouTube URL.');
//       setErrorDetails(['Please enter a valid YouTube video URL.']);
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setErrorDetails([]);
//     setShowGenerateCaptionsDialog(false);

//     try {
//       // Add new category if provided
//       let selectedCategory = category;
//       if (newCategory) {
//         const trimmedCategory = newCategory.trim().toLowerCase();
//         if (trimmedCategory && !categories.includes(trimmedCategory)) {
//           const updatedCategories = [...categories, trimmedCategory];
//           saveCategories(updatedCategories);
//           selectedCategory = trimmedCategory;
//         } else {
//           selectedCategory = trimmedCategory;
//         }
//         setNewCategory('');
//       }

//       // Fetch captions
//       let fetchedCaptions: Caption[] = [];
//       try {
//         fetchedCaptions = await fetchCaptions(videoId, captionLanguage);
//         setCaptions(fetchedCaptions);
//       } catch (err: any) {
//         setError('No captions available.');
//         setErrorDetails([err.message, 'Would you like to generate captions using AI?']);
//         setShowGenerateCaptionsDialog(true);
//         setLoading(false);
//         return;
//       }

//       // Generate initial questions for the first 30 seconds
//       const initialSegment = fetchedCaptions
//         .filter((c) => c.start < 30)
//         .map((c) => c.text)
//         .join(' ');
//       if (initialSegment) {
//         const initialQuestions = await generateQuestions(initialSegment, 0);
//         setQuestions(initialQuestions);
//         setLastProcessedSegment(0);
//       }

//       // Save video
//       const newVideo = { url: videoUrl, category: selectedCategory };
//       saveVideos([...videos, newVideo]);

//       setVideoUrl('');
//       setCategory('');
//       setLoading(false);
//     } catch (err: any) {
//       setError('Failed to add video.');
//       setErrorDetails([err.message]);
//       setLoading(false);
//     }
//   };

//   // Handle generating captions with AI
//   const handleGenerateCaptions = async () => {
//     const videoId = extractVideoId(videos[videos.length - 1]?.url);
//     if (!videoId) {
//       setError('Invalid video.');
//       setErrorDetails(['Please try adding the video again.']);
//       setShowGenerateCaptionsDialog(false);
//       return;
//     }

//     setLoading(true);
//     try {
//       const generatedCaptions = await generateCaptions(videoId);
//       setCaptions(generatedCaptions);

//       // Generate initial questions
//       const initialSegment = generatedCaptions
//         .filter((c) => c.start < 30)
//         .map((c) => c.text)
//         .join(' ');
//       if (initialSegment) {
//         const initialQuestions = await generateQuestions(initialSegment, 0);
//         setQuestions(initialQuestions);
//         setLastProcessedSegment(0);
//       }

//       setShowGenerateCaptionsDialog(false);
//       setLoading(false);
//     } catch (err: any) {
//       setError('Failed to generate captions.');
//       setErrorDetails([err.message]);
//       setShowGenerateCaptionsDialog(false);
//       setLoading(false);
//     }
//   };

//   // Handle question click
//   const handleQuestionClick = async (question: Question) => {
//     if (question.answer) {
//       setQuestions(questions.map((q) => (q.id === question.id ? { ...q, answer: undefined } : q)));
//       return;
//     }

//     const segmentIndex = parseInt(question.id.split('_')[0].replace('q', ''));
//     const segmentStart = segmentIndex * 30;
//     const segmentCaptions = captions
//       .filter((c) => c.start >= segmentStart && c.start < segmentStart + 30)
//       .map((c) => c.text)
//       .join(' ');
//     const answer = await answerQuestion(question.text, segmentCaptions);
//     setQuestions(questions.map((q) => (q.id === question.id ? { ...q, answer } : q)));
//   };

//   // Generate questions for new segments
//   useEffect(() => {
//     if (captions.length === 0 || currentTime <= 0) return;

//     const currentSegment = Math.floor(currentTime / 30);
//     if (currentSegment > lastProcessedSegment) {
//       const segmentStart = currentSegment * 30;
//       const segmentCaptions = captions
//         .filter((c) => c.start >= segmentStart && c.start < segmentStart + 30)
//         .map((c) => c.text)
//         .join(' ');

//       if (segmentCaptions) {
//         generateQuestions(segmentCaptions, currentSegment).then((newQuestions) => {
//           setQuestions((prev) => [...prev, ...newQuestions]);
//           setLastProcessedSegment(currentSegment);
//         });
//       }
//     }
//   }, [currentTime, captions, lastProcessedSegment]);

//   // Sync captions with video time
//   const handleProgress = (state: { playedSeconds: number }) => {
//     setCurrentTime(state.playedSeconds);
//   };

//   // Render captions with fade-in animation
//   const renderCaptions = () => {
//     return captions.map((caption, index) => {
//       const isActive = currentTime >= caption.start && currentTime < caption.start + caption.duration;
//       return (
//         <p
//           key={index}
//           className={`text-sm transition-opacity duration-300 ${
//             isActive ? 'text-white font-semibold opacity-100' : 'text-gray-400 opacity-50'
//           }`}
//         >
//           {caption.text}
//         </p>
//       );
//     });
//   };

//   return (
//     <div className="max-w-7xl mx-auto py-8 px-4">
//       <style>
//         {`
//           .sidebar {
//             transition: transform 0.3s ease-in-out;
//           }
//           .sidebar-hidden {
//             transform: translateX(100%);
//           }
//           .caption-container {
//             max-height: 200px;
//             overflow-y: auto;
//           }
//           .caption-container::-webkit-scrollbar {
//             width: 6px;
//           }
//           .caption-container::-webkit-scrollbar-thumb {
//             background-color: #4b5563;
//             border-radius: 3px;
//           }
//           .caption-container::-webkit-scrollbar-track {
//             background-color: #1f2937;
//           }
//           @keyframes fadeIn {
//             from { opacity: 0; }
//             to { opacity: 1; }
//           }
//           .animate-fade-in {
//             animation: fadeIn 0.3s ease-in;
//           }
//         `}
//       </style>

//       <h2 className="text-2xl font-bold mb-6 text-white">Video Analyzer</h2>

//       {/* Video Input */}
//       <div className="mb-6 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
//         <input
//           type="text"
//           value={videoUrl}
//           onChange={(e) => setVideoUrl(e.target.value)}
//           placeholder="Enter YouTube video URL (e.g., https://youtu.be/TE8qgLjdoC0)"
//           className="px-4 py-2 w-full md:w-1/3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <select
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           className="px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">Select Category</option>
//           {categories.map((cat) => (
//             <option key={cat} value={cat}>
//               {cat.charAt(0).toUpperCase() + cat.slice(1)}
//             </option>
//           ))}
//         </select>
//         <input
//           type="text"
//           value={newCategory}
//           onChange={(e) => setNewCategory(e.target.value)}
//           placeholder="Or add new category"
//           className="px-4 py-2 w-full md:w-1/4 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <select
//           value={captionLanguage}
//           onChange={(e) => setCaptionLanguage(e.target.value)}
//           className="px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="en">English</option>
//           <option value="ar">Arabic</option>
//         </select>
//         <button
//           onClick={handleAddVideo}
//           className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
//           disabled={loading}
//         >
//           {loading ? 'Adding...' : 'Add Video'}
//         </button>
//       </div>

//       {/* Error Display */}
//       {error && (
//         <div className="text-center p-4 mb-6 bg-red-100 border border-red-400 rounded-lg">
//           <p className="text-red-600 text-lg font-semibold">{error}</p>
//           {errorDetails.map((detail, index) => (
//             <p key={index} className="text-sm text-red-500 mt-2">{detail}</p>
//           ))}
//         </div>
//       )}

//       {/* Generate Captions Dialog */}
//       {showGenerateCaptionsDialog && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-gray-100 p-6 rounded-lg max-w-md w-full animate-fade-in">
//             <h3 className="text-lg font-semibold mb-4 text-gray-800">No Captions Available</h3>
//             <p className="text-gray-600 mb-4">
//               No captions are available for this video in {captionLanguage.toUpperCase()}. Would you like to generate captions using AI?
//             </p>
//             <div className="flex justify-end space-x-2">
//               <button
//                 onClick={() => setShowGenerateCaptionsDialog(false)}
//                 className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleGenerateCaptions}
//                 className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
//               >
//                 Generate Captions
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Video and Captions */}
//       {videos.length > 0 && (
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           <div className="lg:col-span-3">
//             <div className="relative" style={{ paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
//               <ReactPlayer
//                 ref={playerRef}
//                 url={videos[videos.length - 1].url} // Show the latest video
//                 width="100%"
//                 height="100%"
//                 style={{ position: 'absolute', top: 0, left: 0 }}
//                 playing
//                 controls
//                 onProgress={handleProgress}
//               />
//             </div>
//             <div className="mt-4 caption-container p-4 bg-gray-800 rounded-lg">
//               {captions.length > 0 ? (
//                 renderCaptions()
//               ) : (
//                 <p className="text-gray-400 text-sm">No captions available for this video.</p>
//               )}
//             </div>
//           </div>

//           {/* Questions Sidebar */}
//           <div
//             className={`lg:col-span-1 bg-gray-800 p-4 rounded-lg sidebar ${showSidebar ? '' : 'sidebar-hidden'}`}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-white">Suggested Questions</h3>
//               <button
//                 onClick={() => setShowSidebar(!showSidebar)}
//                 className="text-gray-200 hover:text-white"
//               >
//                 <i className={`fas fa-${showSidebar ? 'chevron-right' : 'chevron-left'}`}></i>
//               </button>
//             </div>
//             {questions.length > 0 ? (
//               <ul className="space-y-4">
//                 {questions.map((question) => (
//                   <li key={question.id} className="bg-gray-700 p-3 rounded-lg">
//                     <button
//                       onClick={() => handleQuestionClick(question)}
//                       className="text-white text-left w-full hover:text-blue-300"
//                     >
//                       {question.text}
//                     </button>
//                     {question.answer && (
//                       <div className="mt-2 text-gray-200 text-sm">
//                         <p className="whitespace-pre-wrap">{question.answer}</p>
//                         <button
//                           onClick={() => handleQuestionClick(question)}
//                           className="mt-1 text-blue-400 hover:text-blue-300"
//                         >
//                           Close
//                         </button>
//                       </div>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-400 text-sm">No questions generated yet.</p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoAnalyzer;