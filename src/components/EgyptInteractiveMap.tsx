import React, { useState, useEffect } from 'react';
import { regions } from '../data/regionsData';
import type { Region, Subdivision, Area } from '../data/regionsData';

// Filter bar component 
const FilterBar: React.FC<{ areas: Area[]; onFilterChange: (areaId: string) => void }> = ({ areas, onFilterChange }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (areaId: string, index: number) => {
    setActiveIndex(index);
    onFilterChange(areaId);
  };

  return (
    <div className="bg-darkBackground text-white p-4 flex space-x-4 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300" id="filterBar">
      {areas.map((area, index) => (
        <div
          key={area.id}
          className={`border border-white/50 px-3 py-1 rounded-md cursor-pointer flex-shrink-0 transition-all duration-300 ease-in-out ${
            activeIndex === index ? 'bg-blank text-darkBackground' : 'hover:bg-blank hover:text-darkBackground'
          }`}
          onClick={() => handleClick(area.id, index)}
        >
          {area.name}
        </div>
      ))}
    </div>
  );
};

// Main interactive map component
const EgyptInteractiveMap: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedSubdivision, setSelectedSubdivision] = useState<Subdivision | null>(null);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  // Load FancyBox script and CSS
  useEffect(() => {
    // Add FancyBox CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css';
    document.head.appendChild(link);

    // Add FancyBox script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js';
    script.async = true;
    script.onload = () => {
      // Initialize FancyBox
      if (window.Fancybox) {
        window.Fancybox.bind('[data-fancybox]', {
          // Optional: Customize FancyBox options
          Thumbs: { autoStart: false },
        });
      }
    };
    document.body.appendChild(script);

    // Cleanup
    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  // Check URL for region on mount
  useEffect(() => {
    const path = window.location.pathname; // e.g., /maps/greater-cairo
    const regionId = path.split('/maps/')[1];
    if (regionId) {
      const region = regions.find(r => r.id === regionId);
      if (region) {
        setSelectedRegion(region);
      }
    }
  }, []);

  const handleRegionClick = (region: Region) => {
    setSelectedRegion(region);
    setSelectedSubdivision(null);
    setSelectedArea(null);
    window.history.pushState({}, '', `/maps/${region.id}`);
  };

  const handleSubdivisionClick = (subdivision: Subdivision) => {
    setSelectedSubdivision(subdivision);
    setSelectedArea(subdivision.areas[0] || null); // Select the first area by default
  };

  const handleFilterChange = (areaId: string) => {
    if (selectedSubdivision) {
      const area = selectedSubdivision.areas.find(a => a.id === areaId);
      setSelectedArea(area || null);
    }
  };

  const handleBackToRegions = () => {
    setSelectedRegion(null);
    setSelectedSubdivision(null);
    setSelectedArea(null);
    window.history.pushState({}, '', '/maps');
  };

  const handleBackToSubdivisions = () => {
    setSelectedSubdivision(null);
    setSelectedArea(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      {!selectedRegion ? (
        <>
          <h1 className="text-3xl font-bold text-center mb-8">خريطة مصر التفاعلية</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regions.map(region => (
              <a
                key={region.id}
                href={`/maps/${region.id}`}
                onClick={e => {
                  e.preventDefault();
                  handleRegionClick(region);
                }}
                className="bg-gray-800 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition-all duration-300"
              >
                <img src={region.image} alt={region.name} className="w-full h-48 object-cover rounded-t-lg" />
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{region.name}</h2>
                </div>
              </a>
            ))}
          </div>
        </>
      ) : !selectedSubdivision ? (
        <>
          <h1 className="text-3xl font-bold text-center mb-8">{selectedRegion.name}</h1>
          <button
            className="mb-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            onClick={handleBackToRegions}
          >
            العودة إلى المناطق
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedRegion.subdivisions.map(subdivision => (
              <div
                key={subdivision.id}
                className="bg-gray-800 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition-all duration-300"
                onClick={() => handleSubdivisionClick(subdivision)}
              >
                <img src={subdivision.image} alt={subdivision.name} className="w-full h-48 object-cover rounded-t-lg" />
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{subdivision.name}</h2>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-center mb-8">{selectedSubdivision.name}</h1>
          <button
            className="mb-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            onClick={handleBackToSubdivisions}
          >
            العودة إلى الأقسام
          </button>
          <FilterBar
            areas={selectedSubdivision.areas}
            onFilterChange={handleFilterChange}
          />
          {selectedArea && (
            <div className="mt-8 bg-gray-800 p-6 rounded-lg flex flex-col md:flex-row gap-6">
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-4">{selectedArea.name}</h2>
                <p className="text-gray-300">{selectedArea.description}</p>
              </div>
              <div className="md:w-1/3">
                <h3 className="text-xl font-semibold mb-4">معرض الصور</h3>
                <div className="grid grid-cols-2 gap-4">
                  <a href="/egypt-map.png" data-fancybox="gallery" data-caption="صورة 1">
                    <img src="/egypt-map.png" alt="Gallery Image 1" className="w-full h-32 object-cover rounded-lg shadow-md cursor-pointer" />
                  </a>
                  <a href="/egypt-map.png" data-fancybox="gallery" data-caption="صورة 2">
                    <img src="/egypt-map.png" alt="Gallery Image 2" className="w-full h-32 object-cover rounded-lg shadow-md cursor-pointer" />
                  </a>
                  <a href="/egypt-map.png" data-fancybox="gallery" data-caption="صورة 3">
                    <img src="/egypt-map.png" alt="Gallery Image 3" className="w-full h-32 object-cover rounded-lg shadow-md cursor-pointer" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EgyptInteractiveMap;
