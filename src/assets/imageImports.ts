// This file imports all images explicitly to work with Vite/React

// Import statement pattern for Vite - this imports images correctly
// Change these paths if your images are stored differently
import recycleWorthPoster from './img/recycle-all-it-s-worth-poster.jpg';
import trashedObjects from './img/composition-different-trashed-objects.jpg'; 
import lightBulb from './img/recycle-icon-compact-fluorescent-light-bulb-against-white-background.jpg';
import garbageScattered from './img/many-kinds-garbage-were-scattered-dark-floor.jpg';

// Create an array of imported images
export const carouselImages = [
  recycleWorthPoster,
  trashedObjects,
  lightBulb,
  garbageScattered
];

// Export individual images as well
export {
  recycleWorthPoster,
  trashedObjects,
  lightBulb,
  garbageScattered
};

// Placeholder images if imports fail
export const placeholderImages = [
  "https://placehold.co/1200x800/4CAF50/FFFFFF/png?text=E-Waste+Management+1",
  "https://placehold.co/1200x800/8BC34A/FFFFFF/png?text=Recycle+Electronics+2",
  "https://placehold.co/1200x800/CDDC39/333333/png?text=Sustainable+E-Waste+3",
  "https://placehold.co/1200x800/AFB42B/FFFFFF/png?text=Community+Collection+4"
];
