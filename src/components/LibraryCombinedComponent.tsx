import { useState, useEffect } from 'react';

interface Article {
  imageSrc: string;
  altText: string;
  title: string;
  author: string;
  slug: string;
}

interface LibraryCombinedComponentProps {
  allArticles: Article[];
}

export default function LibraryCombinedComponent({ allArticles }: LibraryCombinedComponentProps) {
  const [activeCategory, setActiveCategory] = useState("zionism");
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  // Define the mapping between display names and folder names
  const categoryMapping = {
    "Zionism": "zionism",
    "History": "history",
    "Psychology": "psychology",
    "Nutrition & Health": "nutrition-and-health", // Map to the correct folder name
    "Geo-Politics": "geopolitics", // Map to the correct folder name
  };

  const filterItems = Object.keys(categoryMapping);

  // Filter articles when category changes
  useEffect(() => {
    const filtered = allArticles.filter(article => {
      const folderName = article.slug.split('/')[2]; // Extract topic from slug (e.g., /library/zionism/...)
      return folderName === activeCategory;
    });
    setFilteredArticles(filtered);
  }, [activeCategory, allArticles]);

  const handleFilterClick = (item: string) => {
    // Use the mapping to get the correct folder name
    const normalizedCategory = categoryMapping[item as keyof typeof categoryMapping];
    setActiveCategory(normalizedCategory);
  };

  return (
    <div className="w-full flex-1">
      {/* Filter Bar */}
      <div 
        className="bg-background text-white p-4 flex space-x-4 overflow-x-auto whitespace-nowrap"
        id="filterBar"
      >
        {filterItems.map((item, index) => (
          <div
            key={index}
            className={`border border-white/50 px-3 py-1 rounded-md cursor-pointer hover:bg-blank hover:text-darkBackground flex-shrink-0 transition-all duration-300 ease-in-out ${
              activeCategory === categoryMapping[item as keyof typeof categoryMapping] 
                ? 'bg-blank text-darkBackground' 
                : ''
            }`}
            onClick={() => handleFilterClick(item)}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Featured Grid */}
      <section className="py-4">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-white mb-4">Featured</h2>
          <p className="text-white text-opacity-75 mb-8">Explore our featured recommendations</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredArticles.length > 0 ? (
              filteredArticles.map(item => (
                <a href={item.slug} className="block cursor-pointer" key={item.slug}>
                  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                    <img
                      src={item.imageSrc}
                      alt={item.altText}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-white text-opacity-75 text-sm">{item.author}</p>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <p className="text-white text-opacity-75">No articles found for this category.</p>
            )}
          </div>
        </div>
      </section>

      {/* Styles */}
      <style>{`
        #filterBar {
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
        }

        #filterBar::-webkit-scrollbar {
          height: 6px;
        }

        #filterBar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }

        @media (max-width: 767px) {
          #filterBar {
            padding: 0.75rem;
          }

          #filterBar > div {
            font-size: 0.875rem;
            padding: 0.5rem 1rem;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          #filterBar > div {
            font-size: 1rem;
            padding: 0.75rem 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}