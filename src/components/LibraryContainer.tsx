// src/components/LibraryContainer.tsx
import { useState } from "react";
import LibraryHeroSection from "./LibraryHeroSection.astro";
import LibraryFilterBar from "./LibraryFilterBar.astro";
import LibraryFeaturedGrid from "./LibraryFeaturedGrid.astro";

export default function LibraryContainer() {
  const [category, setCategory] = useState("zionism");

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 flex flex-col w-full max-w-full overflow-x-hidden">
        <div className="w-full">
          <LibraryHeroSection />
        </div>

        <div className="w-full">
          <LibraryFilterBar onFilterChange={setCategory} />
        </div>

        <div className="w-full flex-1">
          <LibraryFeaturedGrid category={category} />
        </div>
      </div>
    </div>
  );
}
