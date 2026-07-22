// Default homepage layout — used whenever the HomeSection collection is
// empty (a fresh install, or before the admin has customized anything).
// These values intentionally match what the homepage showed before this
// config system existed, so turning this feature on doesn't change
// anything visually until someone actually edits a section.
export const DEFAULT_HOME_SECTIONS = [
  { kind: 'hero', order: 0, enabled: true },
  { kind: 'category-strip', order: 1, enabled: true },
  { kind: 'best-sellers', title: 'Shop by Type', limit: 8, order: 2, enabled: true },
  { kind: 'flash-sale', title: 'Flash Sale', limit: 4, order: 3, enabled: true },
  { kind: 'banner', order: 4, enabled: true },
  { kind: 'new-arrivals', title: 'New Arrivals', limit: 4, order: 5, enabled: true },
  { kind: 'featured', title: "Editor's Selection", limit: 8, order: 6, enabled: true },
  { kind: 'testimonials', order: 7, enabled: true },
  { kind: 'trust', order: 8, enabled: true },
  { kind: 'newsletter', order: 9, enabled: true },
];
