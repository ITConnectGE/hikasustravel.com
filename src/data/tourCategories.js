// Tour category assignments for the Private Tours listing filter.
//
// IMPORTANT: filtering uses these stable, language-neutral IDs (and tour slugs)
// only — never translated visible labels. Visible labels are mapped per locale
// in each ui.json under the keys in CATEGORY_LABEL_KEYS below.
//
// Categories are filtering data only: they are NOT shown on tour cards.
// A tour may belong to several categories. "all" is implicit for every tour and
// is only used as the default "no restriction" option.

// Order shown in the dropdown ("all" first as the default).
export const CATEGORY_IDS = [
  'all',
  'cultural-heritage',
  'wine-food',
  'adventure-hiking',
  'nature-mountain',
  'western-georgia-black-sea',
]

// Stable id -> ui.json translation key (visible label per language).
export const CATEGORY_LABEL_KEYS = {
  all: 'tour.catAll',
  'cultural-heritage': 'tour.catCulturalHeritage',
  'wine-food': 'tour.catWineFood',
  'adventure-hiking': 'tour.catAdventureHiking',
  'nature-mountain': 'tour.catNatureMountain',
  'western-georgia-black-sea': 'tour.catWesternBlackSea',
}

// Per-tour assignments, keyed by stable slug (confirmed with the owner).
export const PRIVATE_TOUR_CATEGORIES = {
  'savor-the-flavors-of-kakheti-3-day-wine-and-culture-adventure': ['wine-food', 'cultural-heritage'],
  '5-day-private-tour-from-tbilisi-to-batumi': ['cultural-heritage', 'western-georgia-black-sea'],
  '5-day-georgia-private-tour-tbilisi-wine-and-sulfur-baths': ['wine-food', 'cultural-heritage'],
  'tbilisi-to-treasures-a-6-day-journey-through-georgias-icons-and-hidden-gems': ['cultural-heritage', 'wine-food'],
  'georgias-cultural-wonders-7-day-adventure-from-kutaisi-to-tbilisi-and-beyond': ['cultural-heritage', 'western-georgia-black-sea'],
  'experience-the-heart-of-georgia-8-day-journey-of-culture-nature-wine-tastings': ['cultural-heritage', 'wine-food', 'nature-mountain'],
  'immerse-yourself-in-georgia-8-day-cultural-and-adventure-journey-through-the-caucasus': ['cultural-heritage', 'adventure-hiking', 'nature-mountain'],
  'ultimate-georgia-exploration-9-day-tour-from-kutaisi-to-tbilisi-and-hidden-gems': ['cultural-heritage', 'western-georgia-black-sea'],
  'wander-wonder-and-wine-9-days-of-georgias-best': ['wine-food', 'cultural-heritage', 'nature-mountain'],
  'wine-wonders-and-the-caucasus-a-9-day-adventure-in-georgia': ['wine-food', 'nature-mountain', 'adventure-hiking'],
  'georgia-in-10-days-where-every-corner-has-a-story-and-every-meal-is-a-celebration': ['cultural-heritage', 'wine-food'],
  'georgias-wonders-11-day-grand-tour-from-kutaisi-to-kazbegi-and-batumi': ['nature-mountain', 'western-georgia-black-sea'],
  '12-day-ultimate-georgia-adventure-tour-tbilisi-kazbegi-mestia-kutaisi-batumi': ['nature-mountain', 'adventure-hiking', 'western-georgia-black-sea'],
  'grand-georgia-adventure-13-day-cultural-and-scenic-journey': ['adventure-hiking', 'nature-mountain', 'cultural-heritage'],
  'ultimate-15-day-georgia-tour-from-tbilisi-to-svaneti--wine-culture-and-natural-beauty': ['nature-mountain', 'wine-food', 'cultural-heritage'],
  'georgia-on-my-mind-20-days-of-tasting-trekking-and-total-relaxation': ['wine-food', 'adventure-hiking', 'nature-mountain'],
}
