// Import all images explicitly
import recycleWorthImage from './img/recycle-all-it-s-worth-poster.jpg';
import trashedObjectsImage from './img/composition-different-trashed-objects.jpg';
import lightBulbImage from './img/recycle-icon-compact-fluorescent-light-bulb-against-white-background.jpg';
import garbageScatteredImage from './img/many-kinds-garbage-were-scattered-dark-floor.jpg';

// Export them for use in components
export const carouselImages = {
  recycleWorth: recycleWorthImage,
  trashedObjects: trashedObjectsImage,
  lightBulb: lightBulbImage,
  garbageScattered: garbageScatteredImage,
};

// Default fallback image if any of the above fail
export const placeholderImage = "https://placehold.co/1200x800/8BC34A/FFFFFF/png?text=E-Waste+Management";
