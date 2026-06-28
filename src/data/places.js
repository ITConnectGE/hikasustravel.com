/**
 * Central registry for the Destinations section.
 *
 * One source of truth for which region / city / tourist-site pages exist,
 * how they relate, and what their canonical URLs are. Routing, the build
 * scripts (prerender.js, generate-sitemap.js) and the destination components
 * all read from here, so adding a new place is a data edit — set
 * `published: true` and add its content to pages.json + SEO to seoData.js.
 *
 * URL scheme (all language-prefixed at runtime, e.g. /en/...). The whole
 * Georgia destinations tree is rooted at /georgia:
 *   Hub:        /georgia | /georgia/regions | /georgia/cities | /georgia/places-to-visit
 *   Region:     /georgia/regions/<slug>
 *   City:       /georgia/<slug>
 *   Things to do: /georgia/<city>/things-to-do-in-<city>
 *   Site:       /georgia/<city>/<slug>     (city-parented)
 *               /georgia/<region>/<slug>   (region-parented; the region slug
 *               sits at the same level as a city slug — namespaces are disjoint)
 *
 * The previous scheme lived under /destinations/... and the city/things-to-do
 * pages under /destinations/cities/<slug> and /things-to-do-in-<slug>; those
 * old URLs now 301-redirect here (see legacyRedirects()).
 *
 * A tourist site nests under its parent CITY when it is clearly inside that
 * city, otherwise under its REGION. Each site therefore has exactly ONE
 * canonical URL; other pages (a nearby city, the global places-to-visit hub)
 * link to that single URL rather than duplicating it.
 *
 * A city's "things to do" guide is data-driven too: give the city a
 * `thingsToDo` block (seoKey + contentKey + image + attractions list) and the
 * route, sitemap, prerender, and the city page's CTA card all pick it up.
 */

export const SITE_URL = 'https://www.hikasustravel.com'

// ---------------------------------------------------------------------------
// Regions of Georgia (tourism taxonomy). `name` is the English/house-style
// proper name used for schema + fallback; localized names come from pages.json.
// ---------------------------------------------------------------------------
// Listed alphabetically by name — this is the order shown on the Regions hub.
// `hideFromHub` keeps an entry in the registry (so dependent cities/sites still
// resolve their parent) while excluding its card from the Regions listing —
// used for the combined Racha-Lechkhumi entry, now split into separate Racha and
// Lechkhumi cards on the hub. None of the new entries are published yet, so they
// render as non-clickable "coming soon" cards until their detail pages exist.
export const regions = [
  // Abkhazia has no region *detail* page (published stays false, so it is left
  // out of region detail sitemap/prerender/redirects and the
  // /georgia/regions/abkhazia route). Its card instead links to the dedicated
  // informational page at /<lang>/abkhazia via `linkPath`.
  { slug: 'abkhazia', name: 'Abkhazia', published: false, linkPath: '/abkhazia' },
  // Adjara is published as a region detail page. `noAutolink` keeps it out of the
  // automatic internal-linker for now (both its own body and site-wide mentions
  // of "Adjara"), so linking can be handled separately later.
  {
    slug: 'adjara', name: 'Adjara', published: true,
    seoKey: 'adjara', contentKey: 'adjara',
    image: '/images/files/Batumi%20Black%20Sea%20Coast.jpg',
    noAutolink: true,
    // Region-level "things to do" guide, served (like a city's) at
    // /georgia/adjara/things-to-do-in-adjara via the CitySubPage dispatcher.
    thingsToDo: {
      seoKey: 'thingsToDoAdjara', contentKey: 'thingsToDoAdjara',
      image: '/images/files/Batumi%20Black%20Sea%20Coast.jpg',
      address: { addressRegion: 'Adjara' },
      attractions: [
        'Batumi', 'Batumi Boulevard', 'Black Sea Beaches', 'Batumi Botanical Garden',
        'Mtirala National Park', 'Machakhela National Park', 'Gonio Fortress',
        'Makhuntseti Waterfall',
      ],
    },
  },
  // Guria is published as a region detail page. `noAutolink` keeps it out of the
  // automatic internal-linker for now (both its own body and site-wide mentions
  // of "Guria"), so linking can be handled separately later.
  {
    slug: 'guria', name: 'Guria', published: true,
    seoKey: 'guria', contentKey: 'guria',
    image: '/images/files/georgia-home.jpg',
    noAutolink: true,
    // Region-level "things to do" guide, served (like Adjara's) at
    // /georgia/guria/things-to-do-in-guria via the CitySubPage dispatcher.
    thingsToDo: {
      seoKey: 'thingsToDoGuria', contentKey: 'thingsToDoGuria',
      image: '/images/files/georgia-home.jpg',
      address: { addressRegion: 'Guria' },
      attractions: [
        'Family Tea Farms', 'Gomi Mountain', 'Ureki', 'Ozurgeti', 'Lanchkhuti',
      ],
    },
  },
  // Imereti is published as a region detail page. `noAutolink` keeps it out of
  // the automatic internal-linker for now (both its own body and site-wide
  // mentions of "Imereti"), so linking can be handled separately later.
  {
    slug: 'imereti', name: 'Imereti', published: true,
    seoKey: 'imereti', contentKey: 'imereti',
    image: '/images/files/bagrati-cathedral.jpg',
    noAutolink: true,
    // Region-level "things to do" guide, served (like Adjara's/Guria's) at
    // /georgia/imereti/things-to-do-in-imereti via the CitySubPage dispatcher.
    thingsToDo: {
      seoKey: 'thingsToDoImereti', contentKey: 'thingsToDoImereti',
      image: '/images/files/bagrati-cathedral.jpg',
      address: { addressRegion: 'Imereti' },
      attractions: [
        'Gelati Monastery', 'Bagrati Cathedral', 'Prometheus Cave', 'Okatse Canyon', 'Martvili Canyon', 'Tskaltubo',
      ],
    },
  },
  // Kakheti is published as a region detail page. `noAutolink` keeps it out of
  // the automatic internal-linker for now (both its own body and site-wide
  // mentions of "Kakheti"), so linking can be handled separately later.
  {
    slug: 'kakheti', name: 'Kakheti', published: true,
    seoKey: 'kakheti', contentKey: 'kakheti',
    image: '/images/files/kakheti-vineyard.jpg',
    noAutolink: true,
    // Region-level "things to do" guide, served (like Adjara's/Guria's) at
    // /georgia/kakheti/things-to-do-in-kakheti via the CitySubPage dispatcher.
    thingsToDo: {
      seoKey: 'thingsToDoKakheti', contentKey: 'thingsToDoKakheti',
      image: '/images/files/kakheti-vineyard.jpg',
      address: { addressRegion: 'Kakheti' },
      attractions: [
        'Family Wineries', 'Kvareli Wine Cave', 'Shumi Winery', 'Sighnaghi', 'Telavi', 'Bodbe Monastery', 'Alaverdi Cathedral', 'Alazani Valley',
      ],
    },
  },
  // Kvemo Kartli is published as a region detail page. `noAutolink` keeps it out
  // of the automatic internal-linker for now. The hyphenated slug uses camelCase
  // seo/content keys (kvemoKartli) so the seoData.js object key needs no quoting.
  {
    slug: 'kvemo-kartli', name: 'Kvemo Kartli', published: true,
    seoKey: 'kvemoKartli', contentKey: 'kvemoKartli',
    image: '/images/files/georgia-home.jpg',
    noAutolink: true,
    // Region-level "things to do" guide, served (like Adjara's/Guria's) at
    // /georgia/kvemo-kartli/things-to-do-in-kvemo-kartli via the CitySubPage dispatcher.
    thingsToDo: {
      seoKey: 'thingsToDoKvemoKartli', contentKey: 'thingsToDoKvemoKartli',
      image: '/images/files/georgia-home.jpg',
      address: { addressRegion: 'Kvemo Kartli' },
      attractions: [
        'Dmanisi Archaeological Site', 'Dashbashi Canyon', 'Diamond Bridge',
        'Bolnisi Sioni Cathedral', 'Rustavi',
      ],
    },
  },
  { slug: 'lechkhumi', name: 'Lechkhumi', published: false },
  { slug: 'mtskheta-mtianeti', name: 'Mtskheta-Mtianeti', published: false },
  { slug: 'racha', name: 'Racha', published: false },
  // Combined entry kept for its dependents (Ambrolauri/Oni cities + 20 places
  // parented to it, and the Places-hub location labels), but hidden from the
  // Regions listing now that Racha and Lechkhumi are separate cards.
  { slug: 'racha-lechkhumi', name: 'Racha-Lechkhumi', published: false, hideFromHub: true },
  // Samegrelo is published as a region detail page. `noAutolink` keeps it out of
  // the automatic internal-linker for now (both its own body and site-wide
  // mentions of "Samegrelo"), so linking can be handled separately later.
  {
    slug: 'samegrelo', name: 'Samegrelo', published: true,
    seoKey: 'samegrelo', contentKey: 'samegrelo',
    image: '/images/files/georgia-home.jpg',
    noAutolink: true,
    // Region-level "things to do" guide, served (like Adjara's/Guria's) at
    // /georgia/samegrelo/things-to-do-in-samegrelo via the CitySubPage dispatcher.
    thingsToDo: {
      seoKey: 'thingsToDoSamegrelo', contentKey: 'thingsToDoSamegrelo',
      image: '/images/files/georgia-home.jpg',
      address: { addressRegion: 'Samegrelo' },
      attractions: [
        'Martvili Canyon', 'Balda Canyon', 'Tobavarchkhili Lakes', 'Dadiani Palace', 'Zugdidi',
      ],
    },
  },
  { slug: 'samtskhe-javakheti', name: 'Samtskhe-Javakheti', published: false },
  { slug: 'shida-kartli', name: 'Shida Kartli', published: false },
  { slug: 'svaneti', name: 'Svaneti', published: false },
]

// ---------------------------------------------------------------------------
// Cities. Published cities carry the keys their detail page needs:
//   seoKey     -> key in src/data/seoData.js
//   contentKey -> key in src/i18n/locales/<lang>/pages.json (HTML body + FAQ)
//   image      -> hero image path
//   region     -> parent region slug (for breadcrumbs / cross-links)
// ---------------------------------------------------------------------------
export const cities = [
  {
    slug: 'tbilisi', name: 'Tbilisi', region: null, published: true,
    seoKey: 'tbilisi', contentKey: 'tbilisi', image: '/images/files/tbilisi.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoTbilisi', contentKey: 'thingsToDoTbilisi', image: '/images/files/tbilisi.jpg',
      address: { addressLocality: 'Tbilisi' },
      attractions: [
        'Old Town (Dzveli Tbilisi)', 'Abanotubani Sulfur Baths', 'Narikala Fortress',
        'Holy Trinity Cathedral (Sameba)', 'Georgian National Museum', 'Rustaveli Avenue', 'Mtatsminda',
      ],
    },
  },
  {
    slug: 'akhaltsikhe', name: 'Akhaltsikhe', region: 'samtskhe-javakheti', published: true,
    seoKey: 'akhaltsikhe', contentKey: 'akhaltsikhe', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoAkhaltsikhe', contentKey: 'thingsToDoAkhaltsikhe', image: '/images/files/georgia-home.jpg',
      address: { addressRegion: 'Samtskhe-Javakheti' },
      attractions: ['Rabati Castle', 'Vardzia cave monastery', 'Khertvisi Fortress', 'Sapara Monastery', 'Borjomi'],
    },
  },
  {
    slug: 'ambrolauri', name: 'Ambrolauri', region: 'racha-lechkhumi', published: true,
    seoKey: 'ambrolauri', contentKey: 'ambrolauri', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoAmbrolauri', contentKey: 'thingsToDoAmbrolauri', image: '/images/files/georgia-home.jpg',
      address: { addressRegion: 'Racha' },
      attractions: ['Khvanchkara wineries', 'Nikortsminda Cathedral', 'Shaori Lake', 'Racha villages', 'Rioni River'],
    },
  },
  {
    slug: 'bakuriani', name: 'Bakuriani', region: 'samtskhe-javakheti', published: true,
    seoKey: 'bakuriani', contentKey: 'bakuriani', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoBakuriani', contentKey: 'thingsToDoBakuriani', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Bakuriani' },
      attractions: [
        'Didveli Ski Area', 'Kokhta Ski Area', 'Ski and Snowboard Lessons',
        'Snow Activities (Sledding and Snowmobiling)', 'Forest Hiking Trails', 'Mountain Biking',
        'Kukushka Narrow-Gauge Railway', 'Borjomi',
      ],
    },
  },
  {
    slug: 'bakhmaro', name: 'Bakhmaro', region: 'guria', published: true,
    seoKey: 'bakhmaro', contentKey: 'bakhmaro', image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'gomismta', name: 'Gomismta (Gomi Mountain)', region: 'guria', published: true,
    seoKey: 'gomismta', contentKey: 'gomismta', image: '/images/files/georgia-home.jpg',
    // Gomismta is a highland resort, not a city. It keeps its existing
    // /georgia/gomismta detail page (so URL / SEO / content are untouched) but
    // is classified as a Place to Visit: the Cities hub and the featured-cities
    // strip skip `classifyAs: 'place'` entries, and the Places to Visit hub
    // includes them, using `placeLocation` for the card's location line.
    classifyAs: 'place',
    placeLocation: { cityId: null, municipalityId: 'ozurgeti', regionId: 'guria' },
  },
  {
    slug: 'kutaisi', name: 'Kutaisi', region: 'imereti', published: true,
    seoKey: 'kutaisi', contentKey: 'kutaisi', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoKutaisi', contentKey: 'thingsToDoKutaisi', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Kutaisi' },
      attractions: ['Gelati Monastery', 'Bagrati Cathedral', 'Motsameta Monastery', 'Prometheus Cave', 'Martvili Canyon', 'Okatse Canyon', 'Sataplia Nature Reserve', 'Tskaltubo'],
    },
  },
  {
    slug: 'tskaltubo', name: 'Tskaltubo', region: 'imereti', published: true,
    seoKey: 'tskaltubo', contentKey: 'tskaltubo', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoTskaltubo', contentKey: 'thingsToDoTskaltubo', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Tskaltubo' },
      attractions: ['Tskaltubo Soviet Sanatoriums', 'Tskaltubo Mineral Baths', 'Tskaltubo Central Park', 'Prometheus Cave', 'Sataplia Nature Reserve'],
    },
  },
  {
    slug: 'chiatura', name: 'Chiatura', region: 'imereti', published: true,
    seoKey: 'chiatura', contentKey: 'chiatura', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoChiatura', contentKey: 'thingsToDoChiatura', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Chiatura' },
      attractions: ['Chiatura Cable Cars', 'Katskhi Pillar', 'Mghvimevi Monastery', 'Kvirila River Canyon'],
    },
  },
  {
    slug: 'batumi', name: 'Batumi', region: 'adjara', published: true,
    seoKey: 'batumi', contentKey: 'batumi', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoBatumi', contentKey: 'thingsToDoBatumi', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Batumi' },
      attractions: [
        'Batumi Boulevard', 'Ali and Nino Sculpture', 'Batumi Botanical Garden',
        'Old Batumi (Europe Square)', 'Gonio Fortress', 'Argo Cable Car', 'Makhuntseti Waterfall',
      ],
    },
  },
  {
    slug: 'mtskheta', name: 'Mtskheta', region: 'mtskheta-mtianeti', published: true,
    seoKey: 'mtskheta', contentKey: 'mtskheta', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoMtskheta', contentKey: 'thingsToDoMtskheta', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Mtskheta' },
      attractions: ['Svetitskhoveli Cathedral', 'Jvari Monastery', 'Samtavro Monastery', 'Shio-Mgvime Monastery', 'Armaztsikhe-Bagineti', 'Zedazeni Monastery', 'Bebristsikhe Fortress'],
    },
  },
  {
    slug: 'ushguli', name: 'Ushguli', region: 'svaneti', published: true,
    seoKey: 'ushguli', contentKey: 'ushguli', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoUshguli', contentKey: 'thingsToDoUshguli', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Ushguli' },
      attractions: ['Ushguli Svan Towers', 'Lamaria Church', 'Mount Shkhara & Glacier', 'Chazhashi Village'],
    },
  },
  {
    slug: 'mestia', name: 'Mestia', region: 'svaneti', published: true,
    seoKey: 'mestia', contentKey: 'mestia', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoMestia', contentKey: 'thingsToDoMestia', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Mestia' },
      attractions: ['Svan Towers', 'Svaneti History and Ethnography Museum', 'Margiani House Museum', 'Chalaadi Glacier', 'Ushguli', 'Hatsvali Cable Car', 'Tetnuldi Ski Resort'],
    },
  },
  {
    slug: 'zugdidi', name: 'Zugdidi', region: 'samegrelo', published: true,
    seoKey: 'zugdidi', contentKey: 'zugdidi', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoZugdidi', contentKey: 'thingsToDoZugdidi', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Zugdidi' },
      attractions: ['Dadiani Palace', 'Dadiani Palace Gardens', 'Zugdidi Market', 'Anaklia Black Sea Coast'],
    },
  },
  {
    slug: 'martvili', name: 'Martvili', region: 'samegrelo', published: true,
    seoKey: 'martvili', contentKey: 'martvili', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoMartvili', contentKey: 'thingsToDoMartvili', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Martvili' },
      attractions: ['Martvili Canyon', 'Martvili Monastery', 'Balda Canyon', 'Abasha River'],
    },
  },
  {
    slug: 'telavi', name: 'Telavi', region: 'kakheti', published: true,
    seoKey: 'telavi', contentKey: 'telavi', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoTelavi', contentKey: 'thingsToDoTelavi', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Telavi' },
      attractions: ['Batonis Tsikhe', 'Alaverdi Monastery', 'Ikalto Monastery', 'Tsinandali Estate', 'Gremi', 'Shuamta Monasteries', 'Nadikvari Viewpoint'],
    },
  },
  {
    slug: 'oni', name: 'Oni', region: 'racha-lechkhumi', published: true,
    seoKey: 'oni', contentKey: 'oni', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoOni', contentKey: 'thingsToDoOni', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Oni' },
      attractions: ['Oni Synagogue', 'Rioni River Valley', 'Shovi Mountain Resort', 'Racha Villages'],
    },
  },
  {
    slug: 'gurjaani', name: 'Gurjaani', region: 'kakheti', published: true,
    seoKey: 'gurjaani', contentKey: 'gurjaani', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoGurjaani', contentKey: 'thingsToDoGurjaani', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Gurjaani' },
      attractions: ['Gurjaani Kvelatsminda Church', 'Velistsikhe Wine Museum', 'Nekresi Monastery', 'Alazani Valley'],
    },
  },
  {
    slug: 'sighnaghi', name: 'Sighnaghi', region: 'kakheti', published: true,
    seoKey: 'sighnaghi', contentKey: 'sighnaghi', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoSighnaghi', contentKey: 'thingsToDoSighnaghi', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Sighnaghi' },
      attractions: ['Sighnaghi City Walls', 'Bodbe Monastery', 'Alazani Valley Viewpoint', 'Sighnaghi Museum'],
    },
  },
  {
    slug: 'rustavi', name: 'Rustavi', region: 'kvemo-kartli', published: true,
    seoKey: 'rustavi', contentKey: 'rustavi', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoRustavi', contentKey: 'thingsToDoRustavi', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Rustavi' },
      attractions: ['Rustavi International Motorpark', 'Rustavi Central Park', 'Rustavi History Museum', 'David Gareja Monastery'],
    },
  },
  {
    slug: 'kvareli', name: 'Kvareli', region: 'kakheti', published: true,
    seoKey: 'kvareli', contentKey: 'kvareli', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoKvareli', contentKey: 'thingsToDoKvareli', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Kvareli' },
      attractions: ['Khareba Winery Wine Tunnel', 'Nekresi Monastery', 'Kvareli Lake', 'Ilia Chavchavadze Museum'],
    },
  },
  {
    slug: 'gori', name: 'Gori', region: 'shida-kartli', published: true,
    seoKey: 'gori', contentKey: 'gori', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoGori', contentKey: 'thingsToDoGori', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Gori' },
      attractions: ['Joseph Stalin Museum', 'Gori Fortress', 'Uplistsikhe Cave Town', 'Great Patriotic War Museum'],
    },
  },
  {
    slug: 'borjomi', name: 'Borjomi', region: 'samtskhe-javakheti', published: true,
    seoKey: 'borjomi', contentKey: 'borjomi', image: '/images/files/borjomi-town.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoBorjomi', contentKey: 'thingsToDoBorjomi', image: '/images/files/borjomi-town.jpg',
      address: { addressLocality: 'Borjomi' },
      attractions: [
        'Borjomi Central Park', 'Borjomi Mineral Water Spring', 'Borjomi Sulfur Pools',
        'Borjomi Cable Car', 'Borjomi-Kharagauli National Park', 'Likani Romanov Palace Grounds',
      ],
    },
  },
  {
    slug: 'kazbegi-stepantsminda', name: 'Kazbegi (Stepantsminda)', region: 'mtskheta-mtianeti', published: true,
    seoKey: 'kazbegiStepantsminda', contentKey: 'kazbegiStepantsminda', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoKazbegiStepantsminda', contentKey: 'thingsToDoKazbegiStepantsminda', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Stepantsminda' },
      attractions: ['Gergeti Trinity Church', 'Juta Valley & Chaukhi Mountains', 'Truso Valley', 'Gergeti Glacier', 'Gveleti Waterfalls', 'Dariali Gorge', 'Gudauri Panorama'],
    },
  },
  {
    slug: 'gudauri', name: 'Gudauri', region: 'mtskheta-mtianeti', published: true,
    seoKey: 'gudauri', contentKey: 'gudauri', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoGudauri', contentKey: 'thingsToDoGudauri', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Gudauri' },
      attractions: ['Gudauri Ski Resort', 'Gudauri Panorama', 'Ananuri Fortress', 'Kazbegi (Stepantsminda)'],
    },
  },
  {
    slug: 'dmanisi', name: 'Dmanisi', region: 'kvemo-kartli', published: true,
    seoKey: 'dmanisi', contentKey: 'dmanisi', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoDmanisi', contentKey: 'thingsToDoDmanisi', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Dmanisi' },
      attractions: ['Dmanisi Archaeological Site', 'Dmanisi Medieval Town Ruins', 'Dmanisi Sioni Cathedral', 'Dmanisi Museum-Reserve'],
    },
  },
  {
    slug: 'bolnisi', name: 'Bolnisi', region: 'kvemo-kartli', published: true,
    seoKey: 'bolnisi', contentKey: 'bolnisi', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoBolnisi', contentKey: 'thingsToDoBolnisi', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Bolnisi' },
      attractions: [
        'Bolnisi Sioni Cathedral', 'German Heritage (Katharinenfeld)', 'Dmanisi Archaeological Site',
        'Kvemo Kartli Countryside', 'Local Markets and Life', 'Kvemo Kartli Wineries',
      ],
    },
  },
]

// ---------------------------------------------------------------------------
// Tourist sites. `parentType` = 'city' | 'region', `parent` = that slug.
// None are published yet; they appear on the places-to-visit hub as plain
// text (no link) until their detail page is created.
// ---------------------------------------------------------------------------
export const sites = [
  {
    slug: 'tsageri-history-museum', name: 'Tsageri History Museum',
    parentType: 'region', parent: 'racha-lechkhumi', published: true,
    seoKey: 'tsageriHistoryMuseum', contentKey: 'tsageriHistoryMuseum',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'sairme-pillars', name: 'The Sairme Pillars',
    parentType: 'region', parent: 'racha-lechkhumi', published: true,
    seoKey: 'sairmePillars', contentKey: 'sairmePillars',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'rachkha-waterfall', name: 'Rachkha Waterfall',
    parentType: 'region', parent: 'racha-lechkhumi', published: true,
    seoKey: 'rachkhaWaterfall', contentKey: 'rachkhaWaterfall',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'verdzistava-waterfall', name: 'Verdzistava Waterfall',
    parentType: 'region', parent: 'racha-lechkhumi', published: true,
    seoKey: 'verdzistavaWaterfall', contentKey: 'verdzistavaWaterfall',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'zubi-fortress', name: 'Zubi Fortress',
    parentType: 'region', parent: 'racha-lechkhumi', published: true,
    seoKey: 'zubiFortress', contentKey: 'zubiFortress',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'orbeli-fortress', name: 'Orbeli Fortress',
    parentType: 'region', parent: 'racha-lechkhumi', published: true,
    seoKey: 'orbeliFortress', contentKey: 'orbeliFortress',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'lailashi-pool-okronishi', name: 'The Lailashi Pool (Okronishi)',
    parentType: 'region', parent: 'racha-lechkhumi', published: true,
    seoKey: 'lailashiPool', contentKey: 'lailashiPool',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'kulbaki-lakes', name: 'The Kulbaki Lakes',
    parentType: 'region', parent: 'racha-lechkhumi', published: true,
    seoKey: 'kulbakiLakes', contentKey: 'kulbakiLakes',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'cholevi-lake', name: 'Cholevi Lake (Lake of Love)',
    parentType: 'region', parent: 'racha-lechkhumi', published: true,
    seoKey: 'choleviLake', contentKey: 'choleviLake',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'khvanchkara-wine-monument', name: 'The Khvanchkara Wine Monument',
    parentType: 'region', parent: 'racha-lechkhumi', published: true,
    seoKey: 'khvanchkaraMonument', contentKey: 'khvanchkaraMonument',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'love-waterfall', name: 'The Love Waterfall (Sikvaruli)',
    parentType: 'region', parent: 'racha-lechkhumi', published: true,
    seoKey: 'loveWaterfall', contentKey: 'loveWaterfall',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'minda-fortress', name: 'Minda Fortress',
    parentType: 'region', parent: 'racha-lechkhumi', published: true,
    seoKey: 'mindaFortress', contentKey: 'mindaFortress',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'nikortsminda-cathedral', name: 'Nikortsminda Cathedral',
    parentType: 'region', parent: 'racha-lechkhumi', published: true,
    seoKey: 'nikortsmindaCathedral', contentKey: 'nikortsmindaCathedral',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'oni-synagogue', name: 'The Oni Synagogue',
    parentType: 'region', parent: 'racha-lechkhumi', published: true,
    seoKey: 'oniSynagogue', contentKey: 'oniSynagogue',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'shaori-lake', name: 'Shaori Lake',
    parentType: 'region', parent: 'racha-lechkhumi', published: true,
    seoKey: 'shaoriLake', contentKey: 'shaoriLake',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'udziro-lake', name: 'Udziro Lake',
    parentType: 'region', parent: 'racha-lechkhumi', published: true,
    seoKey: 'udziroLake', contentKey: 'udziroLake',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'khvamli-mountain', name: 'Khvamli Mountain',
    parentType: 'region', parent: 'racha-lechkhumi', published: true,
    seoKey: 'khvamliMountain', contentKey: 'khvamliMountain',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'ghvirishi-waterfall', name: 'Ghvirishi Waterfall',
    parentType: 'region', parent: 'racha-lechkhumi', published: true,
    seoKey: 'ghvirishiWaterfall', contentKey: 'ghvirishiWaterfall',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'askhi-massif', name: 'The Askhi Massif',
    parentType: 'region', parent: 'racha-lechkhumi', published: true,
    seoKey: 'askhiMassif', contentKey: 'askhiMassif',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'dekhviri-fortress', name: 'Dekhviri Fortress',
    parentType: 'region', parent: 'racha-lechkhumi', published: true,
    seoKey: 'dekhviriFortress', contentKey: 'dekhviriFortress',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'dmanisi-museum-reserve', name: 'Dmanisi Museum Reserve',
    parentType: 'city', parent: 'dmanisi', published: true,
    seoKey: 'dmanisiMuseumReserve', contentKey: 'dmanisiMuseumReserve',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'dmanisi-sioni-cathedral', name: 'Dmanisi Sioni Cathedral',
    parentType: 'city', parent: 'dmanisi', published: true,
    seoKey: 'dmanisiSioniCathedral', contentKey: 'dmanisiSioniCathedral',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'rustavi-central-park', name: 'Rustavi Central Park',
    parentType: 'city', parent: 'rustavi', published: true,
    seoKey: 'rustaviCentralPark', contentKey: 'rustaviCentralPark',
    image: '/images/files/rustavi-central-park-lake.jpg',
  },
  {
    slug: 'rustavi-fortress', name: 'Rustavi Fortress',
    parentType: 'city', parent: 'rustavi', published: true,
    seoKey: 'rustaviFortress', contentKey: 'rustaviFortress',
    image: '/images/files/rustavi-fortress.jpg',
  },
  {
    slug: 'rustavi-history-museum', name: 'The Rustavi History Museum',
    parentType: 'city', parent: 'rustavi', published: true,
    seoKey: 'rustaviHistoryMuseum', contentKey: 'rustaviHistoryMuseum',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'algeti-national-park', name: 'Algeti National Park',
    parentType: 'region', parent: 'kvemo-kartli', published: true,
    seoKey: 'algetiNationalPark', contentKey: 'algetiNationalPark',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'birtvisi-fortress', name: 'Birtvisi Fortress',
    parentType: 'region', parent: 'kvemo-kartli', published: true,
    seoKey: 'birtvisiFortress', contentKey: 'birtvisiFortress',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'bolnisi-museum', name: 'The Bolnisi Museum',
    parentType: 'city', parent: 'bolnisi', published: true,
    seoKey: 'bolnisiMuseum', contentKey: 'bolnisiMuseum',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'bolnisi-sioni-cathedral', name: 'Bolnisi Sioni Cathedral',
    parentType: 'city', parent: 'bolnisi', published: true,
    seoKey: 'bolnisiSioniCathedral', contentKey: 'bolnisiSioniCathedral',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'tsughrughasheni-church', name: 'Tsughrughasheni Church',
    parentType: 'city', parent: 'bolnisi', published: true,
    seoKey: 'tsughrughasheniChurch', contentKey: 'tsughrughasheniChurch',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'tsalka-dashbashi-canyon', name: 'Tsalka (Dashbashi) Canyon',
    parentType: 'region', parent: 'kvemo-kartli', published: true,
    seoKey: 'tsalkaDashbashiCanyon', contentKey: 'tsalkaDashbashiCanyon',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'ujarma-fortress', name: 'Ujarma Fortress',
    parentType: 'region', parent: 'kakheti', published: true,
    seoKey: 'ujarmaFortress', contentKey: 'ujarmaFortress',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'tsinandali-estate', name: 'Tsinandali Estate',
    parentType: 'city', parent: 'telavi', published: true,
    seoKey: 'tsinandaliEstate', contentKey: 'tsinandaliEstate',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'telavi-bazaar', name: 'The Telavi Bazaar',
    parentType: 'city', parent: 'telavi', published: true,
    seoKey: 'telaviBazaar', contentKey: 'telaviBazaar',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'sighnaghi-museum', name: 'The Sighnaghi Museum',
    parentType: 'city', parent: 'sighnaghi', published: true,
    seoKey: 'sighnaghiMuseum', contentKey: 'sighnaghiMuseum',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'shumi-winery', name: 'Shumi Winery',
    parentType: 'city', parent: 'telavi', published: true,
    seoKey: 'shumiWinery', contentKey: 'shumiWinery',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'shuamta-monasteries', name: 'The Shuamta Monasteries',
    parentType: 'city', parent: 'telavi', published: true,
    seoKey: 'shuamtaMonasteries', contentKey: 'shuamtaMonasteries',
    image: '/images/files/georgia-home.jpg',
  },
  {
    // Thematic/cultural explainer (not a place): uses Article-class TravelGuide
    // schema rather than TouristAttraction — see SitePage jsonLd.
    slug: 'rtveli-georgian-grape-harvest', name: 'Rtveli: The Georgian Grape Harvest',
    parentType: 'region', parent: 'kakheti', published: true,
    seoKey: 'rtveli', contentKey: 'rtveli', schemaType: 'TravelGuide',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'pankisi-gorge', name: 'Pankisi Gorge',
    parentType: 'region', parent: 'kakheti', published: true,
    seoKey: 'pankisiGorge', contentKey: 'pankisiGorge',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'kvetera-fortress', name: 'Kvetera Fortress',
    parentType: 'region', parent: 'kakheti', published: true,
    seoKey: 'kveteraFortress', contentKey: 'kveteraFortress',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'nekresi-monastery', name: 'Nekresi Monastery',
    parentType: 'region', parent: 'kakheti', published: true,
    seoKey: 'nekresiMonastery', contentKey: 'nekresiMonastery',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'lagodekhi-national-park', name: 'Lagodekhi National Park',
    parentType: 'region', parent: 'kakheti', published: true,
    seoKey: 'lagodekhiNationalPark', contentKey: 'lagodekhiNationalPark',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'vashlovani-national-park', name: 'Vashlovani National Park',
    parentType: 'region', parent: 'kakheti', published: true,
    seoKey: 'vashlovaniNationalPark', contentKey: 'vashlovaniNationalPark',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'kvareli-wine-cave-khareba', name: 'Kvareli Wine Cave (Khareba)',
    parentType: 'city', parent: 'kvareli', published: true,
    seoKey: 'kvareliWineCave', contentKey: 'kvareliWineCave',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'ikalto-monastery', name: 'Ikalto Monastery',
    parentType: 'city', parent: 'telavi', published: true,
    seoKey: 'ikaltoMonastery', contentKey: 'ikaltoMonastery',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'gurjaani-kvelatsminda', name: 'Gurjaani Kvelatsminda',
    parentType: 'region', parent: 'kakheti', published: true,
    seoKey: 'gurjaaniKvelatsminda', contentKey: 'gurjaaniKvelatsminda',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'gremi-archangels-complex', name: 'Gremi Archangels\' Complex',
    parentType: 'region', parent: 'kakheti', published: true,
    seoKey: 'gremiArchangelsComplex', contentKey: 'gremiArchangelsComplex',
    image: '/images/files/gremi-archangels-complex.jpg',
  },
  {
    slug: 'gombori-pass', name: 'The Gombori Pass',
    parentType: 'region', parent: 'kakheti', published: true,
    seoKey: 'gomboriPass', contentKey: 'gomboriPass',
    image: '/images/files/gombori-pass.jpg',
  },
  {
    slug: 'giant-plane-tree-telavi', name: 'The Giant Plane Tree of Telavi',
    parentType: 'city', parent: 'telavi', published: true,
    seoKey: 'giantPlaneTreeTelavi', contentKey: 'giantPlaneTreeTelavi',
    image: '/images/files/giant-plane-tree-telavi.jpg',
    imageCredit: {
      author: 'Maia Tsignadze',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:%E1%83%AD%E1%83%90%E1%83%93%E1%83%90%E1%83%A0%E1%83%98_%E1%83%93%E1%83%90_%E1%83%97%E1%83%94%E1%83%9A%E1%83%90%E1%83%95%E1%83%98%E1%83%A1_%E1%83%AE%E1%83%94%E1%83%93%E1%83%98._%E1%83%9B%E1%83%90%E1%83%98%E1%83%90_%E1%83%AC%E1%83%98%E1%83%92%E1%83%9C%E1%83%90%E1%83%AB%E1%83%94.2021.jpg',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    },
  },
  {
    slug: 'erekle-ii-statue-telavi', name: 'Equestrian Statue of King Erekle II',
    parentType: 'city', parent: 'telavi', published: true,
    seoKey: 'erekleIIStatueTelavi', contentKey: 'erekleIIStatueTelavi',
    image: '/images/files/erekle-ii-statue-telavi.jpg',
    imageCredit: {
      author: 'MIKHEIL',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Irakli_II,_telavi.jpg',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    },
  },
  {
    slug: 'david-gareja-monastery', name: 'David Gareja',
    parentType: 'region', parent: 'kakheti', published: true,
    seoKey: 'davidGarejaMonastery', contentKey: 'davidGarejaMonastery',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'bodbe-monastery', name: 'Bodbe Monastery',
    parentType: 'city', parent: 'sighnaghi', published: true,
    seoKey: 'bodbeMonastery', contentKey: 'bodbeMonastery',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'batonistsikhe-fortress', name: 'Batonistsikhe Fortress',
    parentType: 'city', parent: 'telavi', published: true,
    seoKey: 'batonistsikheFortress', contentKey: 'batonistsikheFortress',
    image: '/images/files/batonistsikhe-fortress-telavi.jpg',
    imageCredit: {
      author: 'shankar s.',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Remains_of_the_old_fortress_at_Telavi_(31134073816).jpg',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    },
  },
  {
    slug: 'alaverdi-monastery', name: 'Alaverdi Cathedral',
    parentType: 'city', parent: 'telavi', published: true,
    seoKey: 'alaverdiMonastery', contentKey: 'alaverdiMonastery',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'ali-and-nino-statue', name: 'Ali & Nino Statue',
    parentType: 'city', parent: 'batumi', published: true,
    seoKey: 'aliAndNinoStatue', contentKey: 'aliAndNinoStatue',
    image: '/images/files/Ali%20and%20Nino%20Statue%20Sunset.jpg',
  },
  {
    slug: 'alphabetic-tower', name: 'Alphabetic Tower',
    parentType: 'city', parent: 'batumi', published: true,
    seoKey: 'alphabeticTower', contentKey: 'alphabeticTower',
    image: '/images/files/Batumi.jpg',
  },
  {
    slug: 'argo-cable-car', name: 'Argo Cable Car',
    parentType: 'city', parent: 'batumi', published: true,
    seoKey: 'argoCableCar', contentKey: 'argoCableCar',
    image: '/images/files/Batumi%20Black%20Sea%20Coast.jpg',
  },
  {
    slug: 'batumi-boulevard', name: 'Batumi Boulevard',
    parentType: 'city', parent: 'batumi', published: true,
    seoKey: 'batumiBoulevard', contentKey: 'batumiBoulevard',
    image: '/images/files/batumi-coastal-tour.jpg',
  },
  {
    slug: 'batumi-central-mosque', name: 'Batumi Central Mosque',
    parentType: 'city', parent: 'batumi', published: true,
    seoKey: 'batumiCentralMosque', contentKey: 'batumiCentralMosque',
    image: '/images/files/Batumi.jpg',
  },
  {
    slug: 'batumi-dolphinarium', name: 'Batumi Dolphinarium',
    parentType: 'city', parent: 'batumi', published: true,
    seoKey: 'batumiDolphinarium', contentKey: 'batumiDolphinarium',
    image: '/images/files/batumi-coastal-tour.jpg',
  },
  {
    slug: 'batumi-piazza', name: 'Batumi Piazza',
    parentType: 'city', parent: 'batumi', published: true,
    seoKey: 'batumiPiazza', contentKey: 'batumiPiazza',
    image: '/images/files/Batumi.jpg',
  },
  {
    slug: 'batumi-dancing-fountains', name: 'Batumi Dancing Fountains',
    parentType: 'city', parent: 'batumi', published: true,
    seoKey: 'batumiDancingFountains', contentKey: 'batumiDancingFountains',
    image: '/images/files/Batumi%20Black%20Sea%20Coast.jpg',
  },
  {
    slug: 'europe-square-batumi', name: 'Europe Square',
    parentType: 'city', parent: 'batumi', published: true,
    seoKey: 'europeSquareBatumi', contentKey: 'europeSquareBatumi',
    image: '/images/files/Batumi.jpg',
  },
  {
    slug: 'goderdzi-pass', name: 'Goderdzi Pass',
    parentType: 'city', parent: 'batumi', published: true,
    seoKey: 'goderdziPass', contentKey: 'goderdziPass',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'gonio-fortress', name: 'Gonio Fortress',
    parentType: 'city', parent: 'batumi', published: true,
    seoKey: 'gonioFortress', contentKey: 'gonioFortress',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'machakhela-national-park', name: 'Machakhela National Park',
    parentType: 'city', parent: 'batumi', published: true,
    seoKey: 'machakhelaNationalPark', contentKey: 'machakhelaNationalPark',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'makhuntseti-waterfall-queen-tamar-bridge', name: 'Makhuntseti Waterfall & Queen Tamar Bridge',
    parentType: 'city', parent: 'batumi', published: true,
    seoKey: 'makhuntsetiWaterfall', contentKey: 'makhuntsetiWaterfall',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'mtirala-national-park', name: 'Mtirala National Park',
    parentType: 'city', parent: 'batumi', published: true,
    seoKey: 'mtiralaNationalPark', contentKey: 'mtiralaNationalPark',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'petra-fortress', name: 'Petra Fortress',
    parentType: 'city', parent: 'batumi', published: true,
    seoKey: 'petraFortress', contentKey: 'petraFortress',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'georgia-in-miniatures-shekvetili', name: 'Georgia in Miniatures Park',
    parentType: 'region', parent: 'guria', published: true,
    seoKey: 'georgiaInMiniatures', contentKey: 'georgiaInMiniatures',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'musicians-park-shekvetili', name: 'Musicians Park',
    parentType: 'region', parent: 'guria', published: true,
    seoKey: 'musiciansPark', contentKey: 'musiciansPark',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'shekvetili-dendrological-park', name: 'Shekvetili Dendrological Park',
    parentType: 'region', parent: 'guria', published: true,
    seoKey: 'dendrologicalPark', contentKey: 'dendrologicalPark',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'shemokmedi-monastery', name: 'Shemokmedi Monastery',
    parentType: 'region', parent: 'guria', published: true,
    seoKey: 'shemokmediMonastery', contentKey: 'shemokmediMonastery',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'ureki-beach', name: 'Ureki Beach',
    parentType: 'region', parent: 'guria', published: true,
    seoKey: 'urekiBeach', contentKey: 'urekiBeach',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'narikala-fortress', name: 'Narikala Fortress',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'narikalaFortress', contentKey: 'narikalaFortress',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'national-botanical-garden-of-georgia', name: 'National Botanical Garden of Georgia',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'nationalBotanicalGarden', contentKey: 'nationalBotanicalGarden',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'tbilisi-opera-and-ballet-theatre', name: 'Tbilisi Opera and Ballet Theatre',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'operaBalletTheatre', contentKey: 'operaBalletTheatre',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'parliament-of-georgia', name: 'Parliament of Georgia',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'parliamentOfGeorgia', contentKey: 'parliamentOfGeorgia',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'rezo-gabriadze-marionette-theatre', name: 'Rezo Gabriadze Marionette Theatre and Clock Tower',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'gabriadzeMarionetteTheatre', contentKey: 'gabriadzeMarionetteTheatre',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'rike-park', name: 'Rike Park',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'rikePark', contentKey: 'rikePark',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'rike-narikala-cable-car', name: 'Rike–Narikala Cable Car',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'rikeNarikalaCableCar', contentKey: 'rikeNarikalaCableCar',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'rustaveli-avenue', name: 'Rustaveli Avenue',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'rustaveliAvenue', contentKey: 'rustaveliAvenue',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'shardeni-street', name: 'Jan Shardeni Street',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'shardeniStreet', contentKey: 'shardeniStreet',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'sioni-cathedral', name: 'Sioni Cathedral',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'sioniCathedral', contentKey: 'sioniCathedral',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'tamada-statue', name: 'Tamada (Toastmaster) Statue',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'tamadaStatue', contentKey: 'tamadaStatue',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'tbilisi-juma-mosque', name: 'Tbilisi Juma Mosque',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'jumaMosque', contentKey: 'jumaMosque',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'tbilisi-zoo', name: 'Tbilisi Zoo',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'tbilisiZoo', contentKey: 'tbilisiZoo',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'georgian-museum-of-fine-arts', name: 'Georgian Museum of Fine Arts',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'georgianMuseumFineArts', contentKey: 'georgianMuseumFineArts',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'national-centre-of-manuscripts', name: 'Korneli Kekelidze Georgian National Centre of Manuscripts',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'nationalCentreOfManuscripts', contentKey: 'nationalCentreOfManuscripts',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'museum-history-georgian-jews', name: 'Museum of History of Georgian Jews (David Baazov Museum)',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'museumHistoryGeorgianJews', contentKey: 'museumHistoryGeorgianJews',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'georgian-national-museum', name: 'Georgian National Museum (Simon Janashia Museum)',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'georgianNationalMuseum', contentKey: 'georgianNationalMuseum',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'open-air-museum-of-ethnography', name: 'Tbilisi Open Air Museum of Ethnography (Giorgi Chitaia Museum)',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'openAirMuseumEthnography', contentKey: 'openAirMuseumEthnography',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'tbilisi-funicular', name: 'Tbilisi Funicular',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'tbilisiFunicular', contentKey: 'tbilisiFunicular',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'abanotubani-sulfur-baths', name: 'Abanotubani Sulfur Baths',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'abanotubaniSulfurBaths', contentKey: 'abanotubaniSulfurBaths',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'chreli-abano', name: 'Chreli Abano (Orbeliani Baths)',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'chreliAbano', contentKey: 'chreliAbano',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'anchiskhati-basilica', name: 'Anchiskhati Basilica',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'anchiskhatiBasilica', contentKey: 'anchiskhatiBasilica',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'ateshgah-fire-temple', name: 'The Ateshgah Fire Temple',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'ateshgahFireTemple', contentKey: 'ateshgahFireTemple',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'bazari-orbeliani', name: 'Bazari Orbeliani',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'bazariOrbeliani', contentKey: 'bazariOrbeliani',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'dezerter-bazaar', name: 'Dezerter Bazaar',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'dezerterBazaar', contentKey: 'dezerterBazaar',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'dry-bridge-market', name: 'The Dry Bridge Market',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'dryBridgeMarket', contentKey: 'dryBridgeMarket',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'freedom-square', name: 'Freedom Square',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'freedomSquare', contentKey: 'freedomSquare',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'great-synagogue-tbilisi', name: 'The Great Synagogue of Tbilisi',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'greatSynagogue', contentKey: 'greatSynagogue',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'holy-trinity-cathedral-sameba', name: 'Holy Trinity Cathedral (Sameba)',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'holyTrinityCathedral', contentKey: 'holyTrinityCathedral',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'leghvtakhevi-waterfall', name: 'Leghvtakhevi Waterfall',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'leghvtakheviWaterfall', contentKey: 'leghvtakheviWaterfall',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'metekhi-church', name: 'Metekhi Church',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'metekhiChurch', contentKey: 'metekhiChurch',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'mother-of-georgia-kartlis-deda', name: 'Mother of Georgia (Kartlis Deda)',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'motherOfGeorgia', contentKey: 'motherOfGeorgia',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'mtatsminda-park', name: 'Mtatsminda Park',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'mtatsmindaPark', contentKey: 'mtatsmindaPark',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'bridge-of-peace', name: 'The Bridge of Peace',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'bridgeOfPeace', contentKey: 'bridgeOfPeace',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'chronicles-of-georgia', name: 'The Chronicles of Georgia',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'chroniclesOfGeorgia', contentKey: 'chroniclesOfGeorgia',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'jvari-monastery', name: 'Jvari Monastery',
    parentType: 'city', parent: 'mtskheta', published: true,
    seoKey: 'jvariMonastery', contentKey: 'jvariMonastery',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'samtavro-monastery', name: 'Samtavro Monastery',
    parentType: 'city', parent: 'mtskheta', published: true,
    seoKey: 'samtavroMonastery', contentKey: 'samtavroMonastery',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'shio-mgvime-monastery', name: 'Shio-Mgvime Monastery',
    parentType: 'city', parent: 'mtskheta', published: true,
    seoKey: 'shioMgvimeMonastery', contentKey: 'shioMgvimeMonastery',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'svetitskhoveli-cathedral', name: 'Svetitskhoveli Cathedral',
    parentType: 'city', parent: 'mtskheta', published: true,
    seoKey: 'svetitskhoveliCathedral', contentKey: 'svetitskhoveliCathedral',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'gudauri-panorama', name: 'Gudauri Panorama',
    parentType: 'city', parent: 'gudauri', published: true,
    seoKey: 'russiaGeorgiaFriendshipMonument', contentKey: 'russiaGeorgiaFriendshipMonument',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'uplistsikhe', name: 'Uplistsikhe',
    parentType: 'region', parent: 'shida-kartli', published: true,
    seoKey: 'uplistsikhe', contentKey: 'uplistsikhe',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'ateni-sioni', name: 'Ateni Sioni',
    parentType: 'region', parent: 'shida-kartli', published: true,
    seoKey: 'ateniSioni', contentKey: 'ateniSioni',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'bateti-lake', name: 'Bateti Lake',
    parentType: 'region', parent: 'shida-kartli', published: true,
    seoKey: 'batetiLake', contentKey: 'batetiLake',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'kintsvisi-monastery', name: 'Kintsvisi Monastery',
    parentType: 'region', parent: 'shida-kartli', published: true,
    seoKey: 'kintsvisiMonastery', contentKey: 'kintsvisiMonastery',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'kvatakhevi-monastery', name: 'Kvatakhevi Monastery',
    parentType: 'region', parent: 'shida-kartli', published: true,
    seoKey: 'kvatakheviMonastery', contentKey: 'kvatakheviMonastery',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'samtavisi-cathedral', name: 'Samtavisi Cathedral',
    parentType: 'region', parent: 'shida-kartli', published: true,
    seoKey: 'samtavisiCathedral', contentKey: 'samtavisiCathedral',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'giorgi-tatulashvili-ceramics-studio', name: 'Giorgi Tatulashvili Ceramics Studio & Museum',
    parentType: 'city', parent: 'gori', published: true,
    seoKey: 'giorgiTatulashviliCeramics', contentKey: 'giorgiTatulashviliCeramics',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'gori-fortress', name: 'Gori Fortress',
    parentType: 'city', parent: 'gori', published: true,
    seoKey: 'goriFortress', contentKey: 'goriFortress',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'stalin-museum-gori', name: 'Stalin Museum',
    parentType: 'city', parent: 'gori', published: true,
    seoKey: 'stalinMuseumGori', contentKey: 'stalinMuseumGori',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'prometheus-cave', name: 'Prometheus Cave',
    parentType: 'region', parent: 'imereti', published: true,
    seoKey: 'prometheusCave', contentKey: 'prometheusCave',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'gelati-monastery', name: 'Gelati Monastery',
    parentType: 'city', parent: 'kutaisi', published: true,
    seoKey: 'gelatiMonastery', contentKey: 'gelatiMonastery',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'motsameta-monastery', name: 'Motsameta Monastery',
    parentType: 'city', parent: 'kutaisi', published: true,
    seoKey: 'motsametaMonastery', contentKey: 'motsametaMonastery',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'vardzia', name: 'Vardzia',
    parentType: 'region', parent: 'samtskhe-javakheti', published: true,
    seoKey: 'vardzia', contentKey: 'vardzia',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'gergeti-trinity-church', name: 'Gergeti Trinity Church',
    parentType: 'city', parent: 'kazbegi-stepantsminda', published: true,
    seoKey: 'gergetiTrinityChurch', contentKey: 'gergetiTrinityChurch',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'gveleti-waterfalls', name: 'Gveleti Waterfalls',
    parentType: 'city', parent: 'kazbegi-stepantsminda', published: true,
    seoKey: 'gveletiWaterfalls', contentKey: 'gveletiWaterfalls',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'juta', name: 'Juta & the Chaukhi Massif',
    parentType: 'city', parent: 'kazbegi-stepantsminda', published: true,
    seoKey: 'juta', contentKey: 'juta',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'truso-valley', name: 'Truso Valley',
    parentType: 'city', parent: 'kazbegi-stepantsminda', published: true,
    seoKey: 'trusoValley', contentKey: 'trusoValley',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'arsha-waterfall', name: 'Arsha Waterfall',
    parentType: 'city', parent: 'kazbegi-stepantsminda', published: true,
    seoKey: 'arshaWaterfall', contentKey: 'arshaWaterfall',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'elia-hill-kazbegi', name: 'Elia Hill (St. Elias Church)',
    parentType: 'city', parent: 'kazbegi-stepantsminda', published: true,
    seoKey: 'eliaHill', contentKey: 'eliaHill',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'gergeti-glacier', name: 'Gergeti Glacier',
    parentType: 'city', parent: 'kazbegi-stepantsminda', published: true,
    seoKey: 'gergetiGlacier', contentKey: 'gergetiGlacier',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'batumi-botanical-garden', name: 'Batumi Botanical Garden',
    parentType: 'city', parent: 'batumi', published: true,
    seoKey: 'batumiBotanicalGarden', contentKey: 'batumiBotanicalGarden',
    image: '/images/files/Batumi%20Botanical%20Garden.jpg',
  },
  {
    slug: 'martvili-canyon', name: 'Martvili Canyon',
    parentType: 'region', parent: 'samegrelo', published: true,
    seoKey: 'martviliCanyon', contentKey: 'martviliCanyon',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'martvili-monastery', name: 'Martvili Monastery (Chkondidi)',
    parentType: 'region', parent: 'samegrelo', published: true,
    seoKey: 'martviliMonastery', contentKey: 'martviliMonastery',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'nokalakevi', name: 'Nokalakevi (Archaeopolis)',
    parentType: 'region', parent: 'samegrelo', published: true,
    seoKey: 'nokalakevi', contentKey: 'nokalakevi',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'tobavarchkhili-lakes', name: 'Tobavarchkhili (the Silver Lakes)',
    parentType: 'region', parent: 'samegrelo', published: true,
    seoKey: 'tobavarchkhili', contentKey: 'tobavarchkhili',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'paliastomi-lake-kolkheti-national-park', name: 'Paliastomi Lake & Kolkheti National Park',
    parentType: 'region', parent: 'samegrelo', published: true,
    seoKey: 'paliastomiKolkheti', contentKey: 'paliastomiKolkheti',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'dadiani-palace-museum', name: 'The Dadiani Palace Museum',
    parentType: 'region', parent: 'samegrelo', published: true,
    seoKey: 'dadianiPalaceMuseum', contentKey: 'dadianiPalaceMuseum',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'enguri-dam', name: 'The Enguri Dam',
    parentType: 'region', parent: 'samegrelo', published: true,
    seoKey: 'enguriDam', contentKey: 'enguriDam',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'intsra-waterfall', name: 'The Intsra Waterfall',
    parentType: 'region', parent: 'samegrelo', published: true,
    seoKey: 'intsraWaterfall', contentKey: 'intsraWaterfall',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'kolkheti-national-park', name: 'Kolkheti National Park',
    parentType: 'region', parent: 'samegrelo', published: true,
    seoKey: 'kolkhetiNationalPark', contentKey: 'kolkhetiNationalPark',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'chalaadi-glacier', name: 'Chalaadi Glacier',
    parentType: 'region', parent: 'svaneti', published: true,
    seoKey: 'chalaadiGlacier', contentKey: 'chalaadiGlacier',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'mikheil-khergiani-house-museum', name: 'Mikheil Khergiani House Museum',
    parentType: 'city', parent: 'mestia', published: true,
    seoKey: 'mikheilKhergianiHouseMuseum', contentKey: 'mikheilKhergianiHouseMuseum',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'svaneti-museum-history-ethnography', name: 'Svaneti Museum of History and Ethnography',
    parentType: 'city', parent: 'mestia', published: true,
    seoKey: 'svanetiMuseumHistoryEthnography', contentKey: 'svanetiMuseumHistoryEthnography',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'koruldi-lakes', name: 'Koruldi Lakes',
    parentType: 'region', parent: 'svaneti', published: true,
    seoKey: 'koruldiLakes', contentKey: 'koruldiLakes',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'mount-ushba', name: 'Mount Ushba',
    parentType: 'region', parent: 'svaneti', published: true,
    seoKey: 'mountUshba', contentKey: 'mountUshba',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'tetnuldi-ski-resort', name: 'Tetnuldi Ski Resort',
    parentType: 'region', parent: 'svaneti', published: true,
    seoKey: 'tetnuldiSkiResort', contentKey: 'tetnuldiSkiResort',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'cross-over-mestia', name: 'The Cross Over Mestia',
    parentType: 'region', parent: 'svaneti', published: true,
    seoKey: 'crossOverMestia', contentKey: 'crossOverMestia',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'shkhara-glacier', name: 'Shkhara Glacier',
    parentType: 'region', parent: 'svaneti', published: true,
    seoKey: 'shkharaGlacier', contentKey: 'shkharaGlacier',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'svan-towers', name: 'Svan Towers',
    parentType: 'region', parent: 'svaneti', published: true,
    seoKey: 'svanTowers', contentKey: 'svanTowers',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'lamaria-church', name: 'Lamaria Church',
    parentType: 'city', parent: 'ushguli', published: true,
    seoKey: 'lamariaChurch', contentKey: 'lamariaChurch',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'margiani-house-museum', name: 'Margiani House Museum',
    parentType: 'city', parent: 'mestia', published: true,
    seoKey: 'margianiHouseMuseum', contentKey: 'margianiHouseMuseum',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'katskhi-pillar', name: 'Katskhi Pillar',
    parentType: 'region', parent: 'imereti', published: true,
    seoKey: 'katskhiPillar', contentKey: 'katskhiPillar',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'abastumani-observatory', name: 'Abastumani Astrophysical Observatory',
    parentType: 'region', parent: 'samtskhe-javakheti', published: true,
    seoKey: 'abastumaniObservatory', contentKey: 'abastumaniObservatory',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'akhaltsikhe-synagogue', name: 'The Akhaltsikhe Synagogue',
    parentType: 'city', parent: 'akhaltsikhe', published: true,
    seoKey: 'akhaltsikheSynagogue', contentKey: 'akhaltsikheSynagogue',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'rabati-fortress', name: 'Rabati Fortress',
    parentType: 'city', parent: 'akhaltsikhe', published: true,
    seoKey: 'rabatiFortress', contentKey: 'rabatiFortress',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'borjomi-central-park', name: 'Borjomi Central Park',
    parentType: 'city', parent: 'borjomi', published: true,
    seoKey: 'borjomiCentralPark', contentKey: 'borjomiCentralPark',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'borjomi-sulphur-pools', name: 'Borjomi Sulphur Pools',
    parentType: 'city', parent: 'borjomi', published: true,
    seoKey: 'borjomiSulphurPools', contentKey: 'borjomiSulphurPools',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'borjomi-kharagauli-national-park', name: 'Borjomi-Kharagauli National Park',
    parentType: 'region', parent: 'samtskhe-javakheti', published: true,
    seoKey: 'borjomiKharagauliNationalPark', contentKey: 'borjomiKharagauliNationalPark',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'green-monastery', name: 'The Green Monastery (Mtsvane Monastery)',
    parentType: 'region', parent: 'samtskhe-javakheti', published: true,
    seoKey: 'greenMonastery', contentKey: 'greenMonastery',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'sapara-monastery', name: 'Sapara Monastery',
    parentType: 'region', parent: 'samtskhe-javakheti', published: true,
    seoKey: 'saparaMonastery', contentKey: 'saparaMonastery',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'timotesubani-monastery', name: 'Timotesubani Monastery',
    parentType: 'region', parent: 'samtskhe-javakheti', published: true,
    seoKey: 'timotesubaniMonastery', contentKey: 'timotesubaniMonastery',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'khertvisi-fortress', name: 'Khertvisi Fortress',
    parentType: 'region', parent: 'samtskhe-javakheti', published: true,
    seoKey: 'khertvisiFortress', contentKey: 'khertvisiFortress',
    image: '/images/files/khertvisi-fortress.jpg',
  },
  {
    slug: 'tmogvi-fortress', name: 'Tmogvi Fortress',
    parentType: 'region', parent: 'samtskhe-javakheti', published: true,
    seoKey: 'tmogviFortress', contentKey: 'tmogviFortress',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'lake-paravani', name: 'Lake Paravani',
    parentType: 'region', parent: 'samtskhe-javakheti', published: true,
    seoKey: 'lakeParavani', contentKey: 'lakeParavani',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'poka-nunnery', name: 'Poka Nunnery (St. Nino Monastery of Poka)',
    parentType: 'region', parent: 'samtskhe-javakheti', published: true,
    seoKey: 'pokaNunnery', contentKey: 'pokaNunnery',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'vani-archaeological-museum', name: 'Vani Archaeological Museum',
    parentType: 'region', parent: 'imereti', published: true,
    seoKey: 'vaniArchaeologicalMuseum', contentKey: 'vaniArchaeologicalMuseum',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'ubisa-monastery', name: 'Ubisa Monastery',
    parentType: 'region', parent: 'imereti', published: true,
    seoKey: 'ubisaMonastery', contentKey: 'ubisaMonastery',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'tskaltubo-sanatoriums', name: 'Tskaltubo Sanatoriums',
    parentType: 'city', parent: 'tskaltubo', published: true,
    seoKey: 'tskaltuboSanatoriums', contentKey: 'tskaltuboSanatoriums',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'tetra-cave', name: 'Tetra Cave',
    parentType: 'region', parent: 'imereti', published: true,
    seoKey: 'tetraCave', contentKey: 'tetraCave',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'sataplia-nature-reserve', name: 'Sataplia Nature Reserve',
    parentType: 'region', parent: 'imereti', published: true,
    seoKey: 'satapliaNatureReserve', contentKey: 'satapliaNatureReserve',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'okatse-kinchkha-waterfall', name: 'Okatse (Kinchkha) Waterfall',
    parentType: 'region', parent: 'imereti', published: true,
    seoKey: 'okatseKinchkhaWaterfall', contentKey: 'okatseKinchkhaWaterfall',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'mghvimevi-monastery', name: 'Mghvimevi Monastery',
    parentType: 'region', parent: 'imereti', published: true,
    seoKey: 'mghvimeviMonastery', contentKey: 'mghvimeviMonastery',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'chiatura-cable-cars', name: 'Chiatura Cable Cars',
    parentType: 'city', parent: 'chiatura', published: true,
    seoKey: 'chiaturaCableCars', contentKey: 'chiaturaCableCars',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'bagrati-cathedral', name: 'Bagrati Cathedral',
    parentType: 'city', parent: 'kutaisi', published: true,
    seoKey: 'bagratiCathedral', contentKey: 'bagratiCathedral',
    image: '/images/files/bagrati-cathedral.jpg',
  },
  {
    slug: 'colchis-fountain-kutaisi', name: 'Colchis Fountain',
    parentType: 'city', parent: 'kutaisi', published: true,
    seoKey: 'colchisFountain', contentKey: 'colchisFountain',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'white-bridge-kutaisi', name: 'White Bridge',
    parentType: 'city', parent: 'kutaisi', published: true,
    seoKey: 'whiteBridgeKutaisi', contentKey: 'whiteBridgeKutaisi',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'green-bazaar-kutaisi', name: 'Green Bazaar (Mtsvane Bazari)',
    parentType: 'city', parent: 'kutaisi', published: true,
    seoKey: 'greenBazaar', contentKey: 'greenBazaar',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'kutaisi-state-historical-museum', name: 'Kutaisi State Historical Museum',
    parentType: 'city', parent: 'kutaisi', published: true,
    seoKey: 'kutaisiMuseum', contentKey: 'kutaisiMuseum',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'kutaisi-synagogue', name: 'Kutaisi Synagogue',
    parentType: 'city', parent: 'kutaisi', published: true,
    seoKey: 'kutaisiSynagogue', contentKey: 'kutaisiSynagogue',
    image: '/images/files/georgia-home.jpg',
  },
]

// Wineries are intentionally an empty, scaffolded list — no winery pages are
// published yet. Add entries here (same shape as sites) when ready.
export const wineries = []

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------
export const getRegion = (slug) => regions.find((r) => r.slug === slug) || null
export const getCity = (slug) => cities.find((c) => c.slug === slug) || null
export const getSite = (slug) => sites.find((s) => s.slug === slug) || null

// ---------------------------------------------------------------------------
// Canonical path builders (NOT language-prefixed — callers add /<lang>).
// The whole tree is rooted at /georgia.
// ---------------------------------------------------------------------------
export const destinationsBase = '/georgia'
export const regionsHubPath = '/georgia/regions'
export const citiesHubPath = '/georgia/cities'
export const placesHubPath = '/georgia/places-to-visit'

export const regionPath = (slug) => `/georgia/regions/${slug}`
export const cityPath = (slug) => `/georgia/${slug}`
export const thingsToDoPath = (citySlug) => `/georgia/${citySlug}/things-to-do-in-${citySlug}`
// Both city- and region-parented sites live directly under /georgia/<parent>/<slug>.
// For region-parented sites the region slug sits at the same level as a city slug
// — region and city slug namespaces are disjoint, so there is no collision. The
// region LANDING pages stay at /georgia/regions/<slug>; old region-site URLs
// (/georgia/regions/<region>/<slug>) 301-redirect here (see legacyRedirects()).
export const sitePath = (site) => `/georgia/${site.parent}/${site.slug}`

// Stable location IDs for a tourist site, derived from its structured parent
// (never from its title or URL text). A city-parented site reports that city
// plus the city's region; a region-parented site reports only the region. The
// hub maps these IDs to translated city/region labels for each language, so the
// location line stays factually identical across all languages and every future
// site is covered automatically.
const _cityBySlug = Object.fromEntries(cities.map((c) => [c.slug, c]))
export function siteLocation(site) {
  if (site.parentType === 'city') {
    const city = _cityBySlug[site.parent]
    return { cityId: site.parent, regionId: city ? city.region : null }
  }
  return { cityId: null, regionId: site.parent }
}

// ---------------------------------------------------------------------------
// Build-pipeline helpers: published destination detail pages, plus the legacy
// flat city URLs that must redirect to their new nested location.
// ---------------------------------------------------------------------------
export function publishedDestinationPages() {
  const pages = []
  for (const r of regions) if (r.published) {
    pages.push({ path: cleanPath(regionPath(r.slug)), seoKey: r.seoKey, image: r.image })
    if (r.thingsToDo) {
      pages.push({
        path: cleanPath(thingsToDoPath(r.slug)),
        seoKey: r.thingsToDo.seoKey,
        image: r.thingsToDo.image || r.image,
      })
    }
  }
  for (const c of cities) if (c.published) {
    pages.push({ path: cleanPath(cityPath(c.slug)), seoKey: c.seoKey, image: c.image })
    if (c.thingsToDo) {
      pages.push({
        path: cleanPath(thingsToDoPath(c.slug)),
        seoKey: c.thingsToDo.seoKey,
        image: c.thingsToDo.image || c.image,
      })
    }
  }
  for (const s of sites) if (s.published) pages.push({ path: cleanPath(sitePath(s)), seoKey: s.seoKey, image: s.image })
  return pages
}

// Old URLs -> their new /georgia home. Consumed by the build (static redirect
// stubs in prerender.js) and mirrored client-side by the SPA router.
//   `from` = old path (no leading slash); `to` = new path (no leading slash).
export function legacyRedirects() {
  const out = [
    { from: 'destinations', to: cleanPath(destinationsBase) },
    { from: 'destinations/regions', to: cleanPath(regionsHubPath) },
    { from: 'destinations/cities', to: cleanPath(citiesHubPath) },
    { from: 'destinations/places-to-visit', to: cleanPath(placesHubPath) },
  ]
  for (const c of cities) {
    if (!c.published) continue
    out.push({ from: `destinations/cities/${c.slug}`, to: cleanPath(cityPath(c.slug)) }) // old nested city
    out.push({ from: `destinations/${c.slug}`, to: cleanPath(cityPath(c.slug)) })        // legacy flat city
    if (c.thingsToDo) out.push({ from: `things-to-do-in-${c.slug}`, to: cleanPath(thingsToDoPath(c.slug)) })
  }
  for (const r of regions) if (r.published) {
    out.push({ from: `destinations/regions/${r.slug}`, to: cleanPath(regionPath(r.slug)) })
    // Bare /things-to-do-in-<region> -> the canonical nested URL (mirrors cities).
    if (r.thingsToDo) out.push({ from: `things-to-do-in-${r.slug}`, to: cleanPath(thingsToDoPath(r.slug)) })
  }
  // Region-parented Places to Visit dropped the /regions/ segment:
  //   /georgia/regions/<region>/<slug>  ->  /georgia/<region>/<slug>
  for (const s of sites) if (s.published && s.parentType === 'region') {
    out.push({ from: `georgia/regions/${s.parent}/${s.slug}`, to: cleanPath(sitePath(s)) })
  }
  // Renamed Places to Visit — old slug 301-redirects to its new home.
  //   Russia–Georgia Friendship Monument -> Gudauri Panorama
  out.push({ from: 'georgia/gudauri/russia-georgia-friendship-monument', to: 'georgia/gudauri/gudauri-panorama' })
  return out
}

const cleanPath = (p) => p.replace(/^\//, '')
