import { useEffect, useState } from 'react';

interface Article {
  imageSrc: string;
  altText: string;
  title: string;
  author: string;
  slug: string;
}

interface LibraryFeaturedGridProps {
  category: string;
  allArticles: Article[];
}

export default function LibraryFeaturedGrid({ category, allArticles }: LibraryFeaturedGridProps) {
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  useEffect(() => {
    // تصفية المقالات بناءً على الفئة المختارة
    const filtered = allArticles
      .filter(article => {
        const folderName = article.slug.split('/')[2]; // استخراج topic من الـ slug (مثل /library/zionism/...)
        return folderName === category;
      });
    setFilteredArticles(filtered);
  }, [category, allArticles]);

  return (
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
  );
}