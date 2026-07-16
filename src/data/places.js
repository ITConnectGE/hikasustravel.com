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
  // Adjara is published as a region detail page. Its name is auto-linked site-wide (localized + Latin form) to this page,
  // and its own body cross-links other entities via the shared auto-linker.
  {
    slug: 'adjara', name: 'Adjara', published: true,
    seoKey: 'adjara', contentKey: 'adjara',
    image: '/images/files/Batumi%20Black%20Sea%20Coast.jpg',
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
  // Guria is published as a region detail page. Its name is auto-linked site-wide (localized + Latin form) to this page,
  // and its own body cross-links other entities via the shared auto-linker.
  {
    slug: 'guria', name: 'Guria', published: true,
    seoKey: 'guria', contentKey: 'guria',
    image: '/images/files/georgia-home.jpg',
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
  // Imereti is published as a region detail page. Its name is auto-linked site-wide (localized + Latin form) to this
  // page, and its own body cross-links other entities via the shared auto-linker.
  {
    slug: 'imereti', name: 'Imereti', published: true,
    seoKey: 'imereti', contentKey: 'imereti',
    image: '/images/files/bagrati-cathedral.jpg',
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
  // Kakheti is published as a region detail page. Its name is auto-linked site-wide (localized + Latin form) to this
  // page, and its own body cross-links other entities via the shared auto-linker.
  {
    slug: 'kakheti', name: 'Kakheti', published: true,
    seoKey: 'kakheti', contentKey: 'kakheti',
    image: '/images/files/kakheti-vineyard.jpg',
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
  // Kvemo Kartli is published as a region detail page. Its name is auto-linked site-wide to this page. The hyphenated slug uses camelCase
  // seo/content keys (kvemoKartli) so the seoData.js object key needs no quoting.
  {
    slug: 'kvemo-kartli', name: 'Kvemo Kartli', published: true,
    seoKey: 'kvemoKartli', contentKey: 'kvemoKartli',
    image: '/images/files/georgia-home.jpg',
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
  // Lechkhumi is published as a region detail page. Its name is auto-linked site-wide (localized + Latin form) to this
  // page. This is the
  // SPLIT-OUT lechkhumi card — the combined `racha-lechkhumi` parent below stays
  // untouched for its dependents.
  {
    slug: 'lechkhumi', name: 'Lechkhumi', published: true,
    seoKey: 'lechkhumi', contentKey: 'lechkhumi',
    image: '/images/files/georgia-home.jpg',
    // Region-level "things to do" guide, served (like Kvemo Kartli's) at
    // /georgia/lechkhumi/things-to-do-in-lechkhumi via the CitySubPage dispatcher.
    thingsToDo: {
      seoKey: 'thingsToDoLechkhumi', contentKey: 'thingsToDoLechkhumi',
      image: '/images/files/georgia-home.jpg',
      address: { addressRegion: 'Lechkhumi' },
      attractions: [
        'Tvishi Family Wineries', 'Lailashi', 'Green Lake',
        'Rioni Valley', 'Tskhenistskali Valley',
      ],
    },
  },
  // Mtskheta-Mtianeti is published as a region detail page. Its name is auto-linked site-wide to this page. The hyphenated slug uses
  // camelCase seo/content keys (mtskhetaMtianeti) so the seoData.js key needs no
  // quoting.
  {
    slug: 'mtskheta-mtianeti', name: 'Mtskheta-Mtianeti', published: true,
    seoKey: 'mtskhetaMtianeti', contentKey: 'mtskhetaMtianeti',
    image: '/images/files/Ananuri%20Fortress%20and%20Zhinvali%20Reservoir.jpg',
    // Region-level "things to do" guide, served (like Kvemo Kartli's) at
    // /georgia/mtskheta-mtianeti/things-to-do-in-mtskheta-mtianeti via the CitySubPage dispatcher.
    thingsToDo: {
      seoKey: 'thingsToDoMtskhetaMtianeti', contentKey: 'thingsToDoMtskhetaMtianeti',
      image: '/images/files/Ananuri%20Fortress%20and%20Zhinvali%20Reservoir.jpg',
      address: { addressRegion: 'Mtskheta-Mtianeti' },
      attractions: [
        'Mtskheta', 'Georgian Military Highway', 'Ananuri Fortress',
        'Gudauri', 'Gergeti Trinity Church',
      ],
    },
  },
  // Racha is published as a region detail page. Its name is auto-linked site-wide (localized + Latin form) to this page.
  // This SPLIT-OUT `racha`
  // card carries the landing page; the combined `racha-lechkhumi` parent below
  // stays untouched for its dependents.
  {
    slug: 'racha', name: 'Racha', published: true,
    seoKey: 'racha', contentKey: 'racha',
    image: '/images/files/shaori-reservoir.jpg',
    // Region-level "things to do" guide, served (like Samegrelo's/Lechkhumi's) at
    // /georgia/racha/things-to-do-in-racha via the CitySubPage dispatcher.
    thingsToDo: {
      seoKey: 'thingsToDoRacha', contentKey: 'thingsToDoRacha',
      image: '/images/files/shaori-reservoir.jpg',
      address: { addressRegion: 'Racha' },
      attractions: [
        'Khvanchkara Family Wineries', 'Nikortsminda Cathedral', 'Shaori Lake', 'Oni', 'Rioni Valley',
      ],
    },
  },
  // Combined entry kept for its dependents (Ambrolauri/Oni cities + 20 places
  // parented to it, and the Places-hub location labels), but hidden from the
  // Regions listing now that Racha and Lechkhumi are separate cards.
  { slug: 'racha-lechkhumi', name: 'Racha-Lechkhumi', published: false, hideFromHub: true },
  // Samegrelo is published as a region detail page. Its name is auto-linked site-wide (localized + Latin form) to this
  // page, and its own body cross-links other entities via the shared auto-linker.
  {
    slug: 'samegrelo', name: 'Samegrelo', published: true,
    seoKey: 'samegrelo', contentKey: 'samegrelo',
    image: '/images/files/georgia-home.jpg',
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
  // Samtskhe-Javakheti is published as a region detail page. Its name is
  // auto-linked site-wide to this page. The hyphenated slug uses
  // camelCase seo/content keys (samtskheJavakheti) so the seoData.js key needs no
  // quoting.
  {
    slug: 'samtskhe-javakheti', name: 'Samtskhe-Javakheti', published: true,
    seoKey: 'samtskheJavakheti', contentKey: 'samtskheJavakheti',
    image: '/images/files/vardzia-cave-monastery.jpg',
    // Region-level "things to do" guide, served at
    // /georgia/samtskhe-javakheti/things-to-do-in-samtskhe-javakheti via the
    // CitySubPage dispatcher.
    thingsToDo: {
      seoKey: 'thingsToDoSamtskheJavakheti', contentKey: 'thingsToDoSamtskheJavakheti',
      image: '/images/files/vardzia-cave-monastery.jpg',
      address: { addressRegion: 'Samtskhe-Javakheti' },
      attractions: [
        'Vardzia Cave Monastery', 'Rabati Fortress', 'Borjomi', 'Khertvisi Fortress', 'Lake Paravani',
      ],
    },
  },
  // Shida Kartli is published as a region detail page. Its name is auto-linked site-wide to this page. The hyphenated slug uses camelCase
  // seo/content keys (shidaKartli) so the seoData.js key needs no quoting.
  {
    slug: 'shida-kartli', name: 'Shida Kartli', published: true,
    seoKey: 'shidaKartli', contentKey: 'shidaKartli',
    image: '/images/files/Uplistsikhe%20Cave%20Town.jpg',
    // Region-level "things to do" guide, served at
    // /georgia/shida-kartli/things-to-do-in-shida-kartli via the CitySubPage
    // dispatcher.
    thingsToDo: {
      seoKey: 'thingsToDoShidaKartli', contentKey: 'thingsToDoShidaKartli',
      image: '/images/files/Uplistsikhe%20Cave%20Town.jpg',
      address: { addressRegion: 'Shida Kartli' },
      attractions: [
        'Uplistsikhe Cave City', 'Gori', 'Stalin Museum', 'Ateni Sioni', 'Mtkvari Valley',
      ],
    },
  },
  // Svaneti is published as a region detail page. Its name is auto-linked site-wide to this page. Single-word slug, so the seo/content
  // keys are plain `svaneti`.
  {
    slug: 'svaneti', name: 'Svaneti', published: true,
    seoKey: 'svaneti', contentKey: 'svaneti',
    image: '/images/files/Koruldi%20Lakes.jpg',
    // Region-level "things to do" guide, served at
    // /georgia/svaneti/things-to-do-in-svaneti via the CitySubPage dispatcher.
    thingsToDo: {
      seoKey: 'thingsToDoSvaneti', contentKey: 'thingsToDoSvaneti',
      image: '/images/files/Koruldi%20Lakes.jpg',
      address: { addressRegion: 'Svaneti' },
      attractions: [
        'Mestia-Ushguli Trek', 'Svan Towers', 'Ushguli', 'Chalaadi Glacier', 'Tetnuldi',
      ],
    },
    // Contextual inline body photos (own), rendered as real <figure> blocks in the
    // per-locale body HTML (NOT the hero, NOT a gallery grid). One ImageObject each
    // into the @graph via RegionPage. representativeOfPage stays false (hero only).
    imageObjects: [
      {
        base: 'svaneti-alpine-meadow-georgia', width: 1024, height: 1024,
        name: 'Alpine meadow in Svaneti, Georgia',
        caption: 'A green alpine meadow below forested mountains and a snowy peak in Svaneti',
        description: 'A boulder-strewn green alpine meadow below the forested ridges and snow peaks of the Greater Caucasus, Svaneti, Georgia.',
        locationName: 'Svaneti', locality: 'Mestia', region: 'Svaneti', geo: { lat: 43.0451, lng: 42.7289 },
      },
      {
        base: 'ushguli-village-shkhara-svaneti-georgia', width: 1217, height: 864,
        name: 'Ushguli village and Svan towers below Mount Shkhara, Svaneti, Georgia',
        caption: 'The medieval Svan towers of Ushguli village below Mount Shkhara, Upper Svaneti',
        description: 'Ushguli, a UNESCO-listed community of medieval Svan tower-houses at about 2,100 m, one of Europe\'s highest continuously inhabited villages, below Mount Shkhara (5,201 m), Upper Svaneti, Georgia.',
        locationName: 'Ushguli', locality: 'Ushguli', region: 'Svaneti', geo: { lat: 42.9169, lng: 43.0136 },
      },
      {
        base: 'svaneti-glacier-valley-georgia', width: 1024, height: 1024,
        name: 'Glacier and alpine valley in Svaneti, Georgia',
        caption: 'A glacier and snow-streaked peaks above a green alpine valley in Svaneti',
        description: 'A glacier and snow-streaked peaks above a green alpine valley crossed by a hiking trail in the high Greater Caucasus, Svaneti, Georgia.',
        locationName: 'Svaneti', locality: 'Mestia', region: 'Svaneti', geo: { lat: 43.0451, lng: 42.7289 },
      },
      {
        base: 'becho-village-svaneti-georgia', width: 1024, height: 1024,
        name: 'Svan village in the Becho valley, Svaneti, Georgia',
        caption: 'A Svan mountain village in the Becho valley beneath the Ushba peaks',
        description: 'A small Svan village of stone houses among fields and forest in the Becho valley west of Mestia, below the peaks around Mount Ushba, Svaneti, Georgia.',
        locationName: 'Becho', locality: 'Becho', region: 'Svaneti', geo: { lat: 43.06, lng: 42.66 },
      },
      {
        base: 'svaneti-hiking-trail-signpost-georgia', width: 1024, height: 1024,
        name: 'Hiking trail signpost above Mestia, Svaneti, Georgia',
        caption: 'A trail signpost to Becho, Koruldi Lakes and Mestia below Svaneti\'s peaks',
        description: 'A yellow hiking trail signpost above Mestia pointing to Becho, the Koruldi Lakes and Mestia, below the jagged Ushba–Chatyn peaks, Svaneti, Georgia.',
        locationName: 'Mestia (Koruldi trail)', locality: 'Mestia', region: 'Svaneti', geo: { lat: 43.07, lng: 42.71 },
      },
    ],
  },
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
    // Contextual body photos (our own). These render as real inline <figure>
    // blocks embedded in the per-locale body HTML (pages.json), NOT via the
    // data-driven gallery and NOT as the hero (which stays tbilisi.jpg).
    // `imageObjects` feeds ONE ImageObject per photo into the CityPage JSON-LD
    // @graph (brand credit Hikasus Travel). contentUrl uses the largest shipped
    // variant (`width`w). Verbatim from the image SEO package
    // (REPLACE-BRAND → Hikasus Travel via BRAND, /images/files path).
    imageObjects: [
      {
        base: 'mtkvari-river-old-tbilisi-cliffs-georgia', width: 1448, height: 1086,
        name: 'Old Tbilisi cliffs above the Mtkvari River, Georgia',
        caption: 'Old Tbilisi houses on the cliffs above the Mtkvari River, reflected in the water',
        description: 'Houses of Old Tbilisi perched on the cliffs above the Mtkvari (Kura) River, reflected in the water below Mtatsminda hill, Tbilisi, Georgia.',
        locationName: 'Old Tbilisi, Mtkvari River', locality: 'Tbilisi', region: 'Tbilisi', geo: { lat: 41.6893, lng: 44.8117 },
      },
      {
        base: 'narikala-fortress-tbilisi-georgia', width: 1448, height: 1086,
        name: 'Narikala Fortress above Old Tbilisi, Georgia',
        caption: 'The walls and St Nicholas Church of Narikala Fortress above Old Tbilisi',
        description: 'The 4th-century Narikala Fortress on the Sololaki ridge above Old Tbilisi, with St Nicholas Church (rebuilt 1996) within its walls, Tbilisi, Georgia.',
        locationName: 'Narikala Fortress', locality: 'Tbilisi', region: 'Tbilisi', geo: { lat: 41.6875, lng: 44.8090 },
      },
      {
        base: 'gabriadze-clock-tower-tbilisi-georgia', width: 1086, height: 1448,
        name: 'Rezo Gabriadze Clock Tower, old Tbilisi, Georgia',
        caption: 'The leaning Rezo Gabriadze Clock Tower in old Tbilisi',
        description: 'The whimsical leaning clock tower built in 2010 by artist and puppeteer Rezo Gabriadze beside his Marionette Theatre in old Tbilisi, faced with hand-painted ceramic tiles, Georgia.',
        locationName: 'Gabriadze Clock Tower', locality: 'Tbilisi', region: 'Tbilisi', geo: { lat: 41.6935, lng: 44.8073 },
      },
    ],
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
    seoKey: 'kutaisi', contentKey: 'kutaisi',
    // HERO replaced: was the shared georgia-home.jpg placeholder (the "wrong
    // Sighnaghi cover" was actually this generic placeholder — used by ~217 entries,
    // so it is NOT deleted). Now the own Colchis Fountain landscape (1448x1086, crops
    // well as a wide CSS-background hero); image-set() upgrades AVIF-capable browsers.
    // og:image / twitter:image auto-derive from this hero.
    image: '/images/files/colchis-fountain-kutaisi-georgia-1448w.webp',
    imageAvif: '/images/files/colchis-fountain-kutaisi-georgia-1448w.avif',
    // Own photos → one ImageObject each into the CityPage @graph (brand credit
    // Hikasus Travel; contentUrl at the largest shipped variant). Hero flagged
    // hero:true → representativeOfPage; the 2 inline body photos render as real
    // <figure> blocks in the per-locale body HTML. Region Imereti.
    imageObjects: [
      {
        base: 'colchis-fountain-kutaisi-georgia', width: 1448, height: 1086, hero: true,
        name: 'Colchis Fountain and Meskhishvili Theatre, Kutaisi, Imereti, Georgia',
        caption: 'The golden Colchis Fountain lit at dusk before the Meskhishvili Theatre in central Kutaisi',
        description: 'The Colchis Fountain (2011, architect Davit Gogichaishvili) on David Aghmashenebeli Square, topped with golden replicas of ancient Colchian artifacts, before the 1861 Meskhishvili Theatre, Kutaisi, Imereti, Georgia.',
        locationName: 'Colchis Fountain, David Aghmashenebeli Square', locality: 'Kutaisi', region: 'Imereti', geo: { lat: 42.2694, lng: 42.7058 },
      },
      {
        base: 'colchis-fountain-night-kutaisi-georgia', width: 1448, height: 1086,
        name: 'Colchis Fountain illuminated at night, Kutaisi, Georgia',
        caption: 'Golden Colchian figures and water jets of the Colchis Fountain lit at night',
        description: 'The Colchis Fountain in Kutaisi illuminated at night, with 30 gilded figures of Colchian animals modelled on Bronze Age gold from Vani, Imereti, Georgia.',
        locationName: 'Colchis Fountain', locality: 'Kutaisi', region: 'Imereti', geo: { lat: 42.2694, lng: 42.7058 },
      },
      {
        base: 'kutaisi-green-bazaar-churchkhela-georgia', width: 1536, height: 1024,
        name: 'Green Bazaar market, Kutaisi, Imereti, Georgia',
        caption: 'Churchkhela and produce stalls at the Green Bazaar in Kutaisi',
        description: "Strings of churchkhela above stalls of cheese, pickles, spices and vegetables at the Green Bazaar, Kutaisi's central food market, Imereti, Georgia.",
        locationName: 'Green Bazaar, Kutaisi', locality: 'Kutaisi', region: 'Imereti', geo: { lat: 42.2662, lng: 42.7089 },
      },
    ],
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
    seoKey: 'chiatura', contentKey: 'chiatura',
    // Cover/hero = our own Chiatura town-panorama photo (replaces the generic
    // georgia-home.jpg placeholder). Rendered as the CSS-background hero via
    // HeroSection image-set (webp `image` + avif `imageAvif`); og:image/twitter
    // auto-derive from `image`. Native max width is 1448 (no upscale).
    image: '/images/files/chiatura-town-panorama-imereti-georgia-1448w.webp',
    imageAvif: '/images/files/chiatura-town-panorama-imereti-georgia-1448w.avif',
    // Contextual body photos (our own). These render as real inline <figure>
    // blocks embedded in the per-locale body HTML (pages.json), NOT via the
    // data-driven gallery. `imageObjects` below feeds ONE ImageObject per photo
    // into the CityPage JSON-LD @graph (brand credit Hikasus Travel; the town
    // panorama is the hero → representativeOfPage). contentUrl uses the largest
    // shipped variant (`width`w). Region is Imereti (NOT Kakheti). Verbatim from
    // the image SEO package (REPLACE-BRAND → Hikasus Travel, /images/files path).
    imageObjects: [
      {
        base: 'chiatura-town-panorama-imereti-georgia', width: 1448, height: 1086, hero: true,
        name: 'Panorama of Chiatura in its gorge, Imereti, Georgia',
        caption: 'Panorama of Chiatura town in its gorge with autumn forest and cliffs',
        description: 'A panorama of Chiatura filling the narrow Kvirila River gorge, ringed by autumn forest and cliffs, Imereti, Georgia.',
        locationName: 'Chiatura', locality: 'Chiatura', region: 'Imereti', geo: { lat: 42.2900, lng: 43.2833 },
      },
      {
        base: 'chiatura-cable-car-gondola-imereti-georgia', width: 1448, height: 1086,
        name: 'Chiatura cable car gondola over the town, Imereti, Georgia',
        caption: 'A modern gondola of the Chiatura cable car crossing the gorge above the town',
        description: "A modern gondola of Chiatura's rebuilt aerial ropeway, originally a 1950s Soviet miners' cable car, crossing the Kvirila gorge above the town, Imereti, Georgia.",
        locationName: 'Chiatura', locality: 'Chiatura', region: 'Imereti', geo: { lat: 42.2900, lng: 43.2833 },
      },
      {
        base: 'chiatura-cable-car-cabin-imereti-georgia', width: 1448, height: 1086,
        name: 'Modern cable car cabin at a Chiatura station, Imereti, Georgia',
        caption: 'A modern glass gondola cabin at a Chiatura cable car station',
        description: "A modern glass gondola cabin at a station of Chiatura's rebuilt aerial ropeway, Imereti, Georgia.",
        locationName: 'Chiatura', locality: 'Chiatura', region: 'Imereti', geo: { lat: 42.2900, lng: 43.2833 },
      },
      {
        base: 'katskhi-pillar-imereti-georgia', width: 1086, height: 1448,
        name: 'Katskhi Pillar near Chiatura, Imereti, Georgia',
        caption: 'The Katskhi Pillar, a 40-metre limestone monolith with a church on top, near Chiatura',
        description: 'The Katskhi Pillar, a natural limestone monolith about 40 metres high near Chiatura, topped by the church of Maximus the Confessor, historically used by stylite monks, Imereti, Georgia.',
        locationName: 'Katskhi Pillar', locality: 'Katskhi', region: 'Imereti', geo: { lat: 42.2933, lng: 43.2144 },
      },
      {
        base: 'mghvimevi-monastery-chiatura-imereti-georgia', width: 1448, height: 1086,
        name: 'Mghvimevi Monastery near Chiatura, Imereti, Georgia',
        caption: 'The 13th-century Mghvimevi Monastery built into the cliff above Chiatura',
        description: 'Mghvimevi Monastery, a 13th-century convent built into the cliff face and natural caves above the Kvirila River near Chiatura, Imereti, Georgia.',
        locationName: 'Mghvimevi Monastery', locality: 'Chiatura', region: 'Imereti', geo: { lat: 42.2969, lng: 43.2789 },
      },
      {
        base: 'chiatura-swan-lake-park-imereti-georgia', width: 1448, height: 1086,
        name: 'Swan pond in a Chiatura park, Imereti, Georgia',
        caption: 'Mute swans on the pond of a landscaped park in Chiatura',
        description: 'Mute swans on the pond of a landscaped central park in Chiatura, Imereti, Georgia.',
        locationName: 'Chiatura', locality: 'Chiatura', region: 'Imereti', geo: { lat: 42.2900, lng: 43.2833 },
      },
      {
        base: 'chiatura-hillside-sign-imereti-georgia', width: 1537, height: 1023,
        name: 'Hillside above the town of Chiatura, Imereti, Georgia',
        caption: 'A hillside sign above the town of Chiatura among autumn forest',
        description: 'A hillside sign above the town of Chiatura on the forested cliffs of the Kvirila gorge in autumn, Imereti, Georgia.',
        locationName: 'Chiatura', locality: 'Chiatura', region: 'Imereti', geo: { lat: 42.2900, lng: 43.2833 },
      },
      {
        base: 'chiatura-caucasus-mountains-view-imereti-georgia', width: 1448, height: 1086,
        name: 'Caucasus peaks near Chiatura, Imereti, Georgia',
        caption: 'Snow-capped Caucasus peaks beyond the autumn hills near Chiatura',
        description: 'Snow-capped peaks of the Greater Caucasus rising beyond the autumn-coloured hills and cliffs around Chiatura, Imereti, Georgia.',
        locationName: 'Chiatura', locality: 'Chiatura', region: 'Imereti', geo: { lat: 42.2900, lng: 43.2833 },
      },
    ],
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
    seoKey: 'telavi', contentKey: 'telavi',
    // Cover/hero = the Telavi town-view photo (represents the destination, not a
    // single attraction). Rendered as the existing CSS-background hero via
    // HeroSection with image-set(avif, webp); og:image derives from `image`.
    image: '/images/files/telavi-town-view-erekle-ii-monument-kakheti-georgia-1600w.webp',
    imageAvif: '/images/files/telavi-town-view-erekle-ii-monument-kakheti-georgia-1600w.avif',
    thingsToDo: {
      seoKey: 'thingsToDoTelavi', contentKey: 'thingsToDoTelavi', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Telavi' },
      attractions: ['Batonis Tsikhe', 'Alaverdi Monastery', 'Ikalto Monastery', 'Tsinandali Estate', 'Gremi', 'Shuamta Monasteries', 'Nadikvari Viewpoint'],
    },
    // Telavi photos (our own). CityPage uses the one flagged `hero: true` as the
    // cover/background hero, and places the others (each with an `afterChunk`
    // index) as real responsive <picture>/<img> BETWEEN body sections — never a
    // bottom block. Each base has -{1200,1600,2400}w.{avif,webp} in /images/files/.
    // `name`/`description`/`locationName`/`geo` feed the ImageObject JSON-LD; the
    // per-locale `alt` and `caption` maps drive the <img alt>, <figcaption> and
    // the localized ImageObject caption. Strings live here (not pages.json)
    // because the Telavi page-content block only exists in English and falls back
    // all-or-nothing, which would force English captions on non-English pages —
    // these 7-language maps guarantee each locale's own. `afterChunk` = insert the
    // figure after the Nth body chunk (chunk 0 = intro, then one per <h2>).
    gallery: [
      {
        base: 'erekle-ii-statue-telavi-kakheti-georgia', width: 1600, height: 1205, afterChunk: 0,
        name: 'Equestrian statue of King Erekle II, Telavi, Kakheti, Georgia',
        description: 'The 8.5-metre bronze equestrian statue of King Erekle II (sculptor Merab Merabishvili, 1971) in central Telavi, beside Batonis Tsikhe palace, overlooking the Alazani Valley and Greater Caucasus.',
        locationName: 'Monument to King Erekle II, Telavi', geo: { lat: 41.9192, lng: 45.4731 },
        alt: {
          en: "Bronze equestrian statue of King Erekle II in central Telavi, Kakheti, Georgia, above the Alazani Valley",
          de: "Bronzenes Reiterstandbild von König Erekle II. im Zentrum von Telawi, Kachetien, Georgien, über dem Alazani-Tal",
          fr: "Statue équestre en bronze du roi Héraclius II au centre de Telavi, Kakhétie, Géorgie, au-dessus de la vallée de l'Alazani",
          es: "Estatua ecuestre de bronce del rey Erekle II en el centro de Telavi, Kajetia, Georgia, sobre el valle del Alazani",
          nl: "Bronzen ruiterstandbeeld van koning Erekle II in het centrum van Telavi, Kachetië, Georgië, boven de Alazani-vallei",
          cs: "Bronzová jezdecká socha krále Erekleho II. v centru Telavi, Kachetie, Gruzie, nad údolím Alazani",
          pl: "Brązowy pomnik konny króla Herakliusza II w centrum Telawi, Kachetia, Gruzja, nad doliną Alazani",
        },
        caption: {
          en: "In the heart of Telavi stands the 8.5-metre bronze equestrian statue of King Erekle II, sculpted by Merab Merabishvili in 1971, beside the king's palace at Batonis Tsikhe and overlooking the Alazani Valley.",
          de: "Im Herzen von Telawi steht das 8,5 Meter hohe bronzene Reiterstandbild von König Erekle II., 1971 vom Bildhauer Merab Merabischwili geschaffen, neben dem Königspalast Batonis Zikhe und mit Blick über das Alazani-Tal.",
          fr: "Au cœur de Telavi se dresse la statue équestre en bronze de 8,5 mètres du roi Héraclius II, sculptée par Merab Merabichvili en 1971, à côté du palais royal de Batonis Tsikhe et dominant la vallée de l'Alazani.",
          es: "En el corazón de Telavi se alza la estatua ecuestre de bronce de 8,5 metros del rey Erekle II, esculpida por Merab Merabishvili en 1971, junto al palacio real de Batonis Tsikhe y con vistas al valle del Alazani.",
          nl: "In het hart van Telavi staat het 8,5 meter hoge bronzen ruiterstandbeeld van koning Erekle II, in 1971 gemaakt door beeldhouwer Merab Merabisjvili, naast het koninklijk paleis Batonis Tsikhe en met uitzicht over de Alazani-vallei.",
          cs: "V srdci Telavi stojí 8,5 metru vysoká bronzová jezdecká socha krále Erekleho II., kterou v roce 1971 vytvořil sochař Merab Merabišvili, vedle královského paláce Batonis Tsikhe a s výhledem na údolí Alazani.",
          pl: "W sercu Telawi wznosi się 8,5-metrowy brązowy pomnik konny króla Herakliusza II, wykonany przez rzeźbiarza Meraba Merabiszwilego w 1971 roku, obok królewskiego pałacu Batonis Tsikhe, z widokiem na dolinę Alazani.",
        },
      },
      {
        base: 'telavi-town-view-erekle-ii-monument-kakheti-georgia', width: 1600, height: 1205, hero: true,
        name: 'Telavi old town from the King Erekle II monument, Kakheti, Georgia',
        description: 'The red-roofed old town of Telavi, former capital of the Kakheti kingdom, seen from the King Erekle II monument, with the Alazani Valley and Greater Caucasus beyond.',
        locationName: 'Telavi, Kakheti', geo: { lat: 41.9192, lng: 45.4731 },
        alt: {
          en: "View over Telavi old town from the King Erekle II monument, Kakheti, Georgia, with the Alazani Valley beyond",
          de: "Blick über die Altstadt von Telawi vom König-Erekle-II.-Denkmal, Kachetien, Georgien, mit dem Alazani-Tal",
          fr: "Vue sur la vieille ville de Telavi depuis le monument au roi Héraclius II, Kakhétie, Géorgie, et la vallée de l'Alazani",
          es: "Vista del casco antiguo de Telavi desde el monumento al rey Erekle II, Kajetia, Georgia, con el valle del Alazani",
          nl: "Uitzicht over de oude stad van Telavi vanaf het monument voor koning Erekle II, Kachetië, Georgië, met de Alazani-vallei",
          cs: "Pohled na staré město Telavi od pomníku krále Erekleho II., Kachetie, Gruzie, s údolím Alazani v pozadí",
          pl: "Widok na stare miasto Telawi od pomnika króla Herakliusza II, Kachetia, Gruzja, z doliną Alazani w tle",
        },
        caption: {
          en: "From beside the King Erekle II monument, the red-roofed old town of Telavi spreads toward the vineyards of the Alazani Valley and the Greater Caucasus — the former capital of the Kakheti kingdom.",
          de: "Vom König-Erekle-II.-Denkmal aus erstreckt sich die Altstadt von Telawi mit ihren roten Ziegeldächern zu den Weinbergen des Alazani-Tals und dem Großen Kaukasus — die einstige Hauptstadt des Königreichs Kachetien.",
          fr: "Depuis le monument au roi Héraclius II, la vieille ville de Telavi aux toits rouges s'étend vers les vignobles de la vallée de l'Alazani et le Grand Caucase — ancienne capitale du royaume de Kakhétie.",
          es: "Desde el monumento al rey Erekle II, el casco antiguo de Telavi, de tejados rojos, se extiende hacia los viñedos del valle del Alazani y el Gran Cáucaso — la antigua capital del reino de Kajetia.",
          nl: "Vanaf het monument voor koning Erekle II strekt de oude stad van Telavi met haar rode daken zich uit naar de wijngaarden van de Alazani-vallei en de Grote Kaukasus — de voormalige hoofdstad van het koninkrijk Kachetië.",
          cs: "Od pomníku krále Erekleho II. se staré město Telavi s červenými střechami rozprostírá k vinicím údolí Alazani a Velkému Kavkazu — bývalé hlavní město Kachetského království.",
          pl: "Od pomnika króla Herakliusza II stare miasto Telawi o czerwonych dachach rozciąga się ku winnicom doliny Alazani i Wielkiemu Kaukazowi — dawna stolica królestwa Kachetii.",
        },
      },
      {
        base: 'telavi-park-promenade-kakheti-georgia', width: 1600, height: 1205, afterChunk: 7,
        name: 'Central park and promenade, Telavi, Kakheti, Georgia',
        description: 'A landscaped park and promenade in central Telavi, Kakheti, with views of the Greater Caucasus at dusk.',
        locationName: 'Telavi, Kakheti', geo: { lat: 41.9192, lng: 45.4731 },
        alt: {
          en: "Landscaped park and promenade in central Telavi, Kakheti, Georgia, with the Greater Caucasus at dusk",
          de: "Angelegter Park und Promenade im Zentrum von Telawi, Kachetien, Georgien, mit dem Großen Kaukasus in der Abenddämmerung",
          fr: "Parc paysager et promenade au centre de Telavi, Kakhétie, Géorgie, avec le Grand Caucase au crépuscule",
          es: "Parque ajardinado y paseo en el centro de Telavi, Kajetia, Georgia, con el Gran Cáucaso al atardecer",
          nl: "Aangelegd park en promenade in het centrum van Telavi, Kachetië, Georgië, met de Grote Kaukasus in de schemering",
          cs: "Upravený park a promenáda v centru Telavi, Kachetie, Gruzie, s Velkým Kavkazem za soumraku",
          pl: "Zadbany park i promenada w centrum Telawi, Kachetia, Gruzja, z Wielkim Kaukazem o zmierzchu",
        },
        caption: {
          en: "A landscaped park and promenade in central Telavi offers open views of the Greater Caucasus — a quiet stop between the town's museums, wineries and the Batonis Tsikhe fortress.",
          de: "Ein angelegter Park mit Promenade im Zentrum von Telawi bietet freie Sicht auf den Großen Kaukasus — ein ruhiger Halt zwischen den Museen, Weingütern und der Festung Batonis Zikhe.",
          fr: "Un parc paysager et sa promenade au centre de Telavi offrent une vue dégagée sur le Grand Caucase — une halte paisible entre les musées, les caves et la forteresse Batonis Tsikhe.",
          es: "Un parque ajardinado con paseo en el centro de Telavi ofrece vistas abiertas al Gran Cáucaso — una parada tranquila entre los museos, las bodegas y la fortaleza Batonis Tsikhe.",
          nl: "Een aangelegd park met promenade in het centrum van Telavi biedt vrij uitzicht op de Grote Kaukasus — een rustige stop tussen de musea, wijnhuizen en het fort Batonis Tsikhe.",
          cs: "Upravený park s promenádou v centru Telavi nabízí volný výhled na Velký Kavkaz — klidné zastavení mezi muzei, vinařstvími a pevností Batonis Tsikhe.",
          pl: "Zadbany park z promenadą w centrum Telawi oferuje otwarty widok na Wielki Kaukaz — spokojny przystanek między muzeami, winiarniami a twierdzą Batonis Tsikhe.",
        },
      },
      {
        base: 'batonis-tsikhe-fortress-evening-telavi-kakheti-georgia', width: 1600, height: 1205, afterChunk: 3,
        name: 'Batonis Tsikhe fortress at dusk, Telavi, Kakheti, Georgia',
        description: 'The walls and tower of Batonis Tsikhe, the royal residence of King Erekle II in central Telavi, Kakheti, in warm evening light; today home to the Telavi history museum.',
        locationName: 'Batonis Tsikhe, Telavi', geo: { lat: 41.9200, lng: 45.4750 },
        alt: {
          en: "Batonis Tsikhe fortress walls and tower in Telavi, Kakheti, Georgia, in warm evening light",
          de: "Festungsmauern und Turm der Batonis-Zikhe-Festung in Telawi, Kachetien, Georgien, im warmen Abendlicht",
          fr: "Remparts et tour de la forteresse Batonis Tsikhe à Telavi, Kakhétie, Géorgie, sous la lumière chaude du soir",
          es: "Murallas y torre de la fortaleza Batonis Tsikhe en Telavi, Kajetia, Georgia, con la cálida luz del atardecer",
          nl: "Vestingmuren en toren van fort Batonis Tsikhe in Telavi, Kachetië, Georgië, in warm avondlicht",
          cs: "Hradby a věž pevnosti Batonis Tsikhe v Telavi, Kachetie, Gruzie, v teplém večerním světle",
          pl: "Mury i wieża twierdzy Batonis Tsikhe w Telawi, Kachetia, Gruzja, w ciepłym świetle wieczoru",
        },
        caption: {
          en: "Evening light on the walls of Batonis Tsikhe, the royal residence of King Erekle II in central Telavi and today home to the town's history museum.",
          de: "Abendlicht auf den Mauern von Batonis Zikhe, der königlichen Residenz von Erekle II. im Zentrum von Telawi, heute Sitz des Stadtgeschichtsmuseums.",
          fr: "Lumière du soir sur les murs de Batonis Tsikhe, résidence royale d'Héraclius II au centre de Telavi, aujourd'hui musée d'histoire de la ville.",
          es: "Luz del atardecer sobre los muros de Batonis Tsikhe, residencia real del rey Erekle II en el centro de Telavi y hoy sede del museo de historia de la ciudad.",
          nl: "Avondlicht op de muren van Batonis Tsikhe, de koninklijke residentie van koning Erekle II in het centrum van Telavi en tegenwoordig het historisch museum van de stad.",
          cs: "Večerní světlo na hradbách Batonis Tsikhe, královského sídla Erekleho II. v centru Telavi, dnes sídla městského historického muzea.",
          pl: "Wieczorne światło na murach Batonis Tsikhe, królewskiej rezydencji Herakliusza II w centrum Telawi, dziś siedziby miejskiego muzeum historii.",
        },
      },
    ],
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
    seoKey: 'gori', contentKey: 'gori',
    // HERO replaced: was the shared georgia-home.jpg placeholder (the "wrong
    // Sighnaghi cover" was actually this generic placeholder — used by ~217 entries,
    // so NOT deleted). Now the own Gori town panorama (1448x1086, crops well as a
    // wide CSS-background hero); image-set() upgrades AVIF-capable browsers.
    // og:image / twitter:image auto-derive from this hero.
    image: '/images/files/gori-town-panorama-georgia-1448w.webp',
    imageAvif: '/images/files/gori-town-panorama-georgia-1448w.avif',
    // Own photos → one ImageObject each into the CityPage @graph (brand credit
    // Hikasus Travel; contentUrl at the largest shipped variant). Hero flagged
    // hero:true → representativeOfPage; the 5 inline body photos render as real
    // <figure> blocks in the per-locale body HTML. Region Shida Kartli.
    imageObjects: [
      {
        base: 'gori-town-panorama-georgia', width: 1448, height: 1086, hero: true,
        name: 'Panorama of Gori, Shida Kartli, Georgia',
        caption: 'Panorama of Gori in the Kartli plain with snow-dusted Caucasus peaks beyond',
        description: 'A panorama of Gori spread across the Kartli plain at the confluence of the Mtkvari and Liakhvi rivers, with the Greater Caucasus beyond, Shida Kartli, Georgia.',
        locationName: 'Gori', locality: 'Gori', region: 'Shida Kartli', geo: { lat: 41.9847, lng: 44.1086 },
      },
      {
        base: 'uplistsikhe-cave-town-georgia', width: 1448, height: 1086,
        name: 'Uplistsikhe cave town near Gori, Shida Kartli, Georgia',
        caption: 'The rock-hewn cave town of Uplistsikhe above the Mtkvari valley near Gori',
        description: 'Uplistsikhe, a rock-hewn cave town about 3,000 years old on the Mtkvari river near Gori, once a pagan religious centre and Silk Road trading post, Shida Kartli, Georgia.',
        locationName: 'Uplistsikhe', locality: 'Uplistsikhe', region: 'Shida Kartli', geo: { lat: 41.9686, lng: 44.2072 },
      },
      {
        base: 'stalin-museum-gori-georgia', width: 1448, height: 1086,
        name: 'Joseph Stalin Museum, Gori, Shida Kartli, Georgia',
        caption: 'The sandstone arcades of the Joseph Stalin Museum in Gori',
        description: 'The Soviet-era Joseph Stalin Museum in Gori, dedicated to the Soviet leader born in the town in 1879, with its arcaded carved-sandstone facade, Shida Kartli, Georgia.',
        locationName: 'Joseph Stalin Museum', locality: 'Gori', region: 'Shida Kartli', geo: { lat: 41.9863, lng: 44.1156 },
      },
      {
        base: 'gori-central-park-georgia', width: 1448, height: 1086,
        name: 'Central park in Gori with the Stalin Museum, Shida Kartli, Georgia',
        caption: 'The landscaped central park of Gori with the Stalin Museum building behind',
        description: 'The landscaped central park of Gori with clipped topiary, leading to the Soviet-era Joseph Stalin Museum, Shida Kartli, Georgia.',
        locationName: 'Gori', locality: 'Gori', region: 'Shida Kartli', geo: { lat: 41.9863, lng: 44.1156 },
      },
      {
        base: 'gori-aerial-view-georgia', width: 1448, height: 1086,
        name: 'Aerial view of Gori, Shida Kartli, Georgia',
        caption: 'Aerial view of Gori with its stadium and autumn old town by the river',
        description: 'An elevated view of Gori with its stadium and low old-town roofs stretching toward the river and hills of the Kartli plain, Shida Kartli, Georgia.',
        locationName: 'Gori', locality: 'Gori', region: 'Shida Kartli', geo: { lat: 41.9847, lng: 44.1086 },
      },
      {
        base: 'gori-church-view-georgia', width: 1448, height: 1086,
        name: 'Church in Gori among autumn rooftops, Shida Kartli, Georgia',
        caption: 'A Georgian Orthodox church among the autumn rooftops of Gori',
        description: 'A domed Georgian Orthodox church among the autumn trees and rooftops of Gori, beneath the surrounding hills, Shida Kartli, Georgia.',
        locationName: 'Gori', locality: 'Gori', region: 'Shida Kartli', geo: { lat: 41.9847, lng: 44.1086 },
      },
    ],
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
    slug: 'kazbegi', name: 'Kazbegi (Stepantsminda)', region: 'mtskheta-mtianeti', published: true,
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
    parentType: 'city', parent: 'ambrolauri', formerParent: 'racha-lechkhumi', published: true,
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
    parentType: 'city', parent: 'oni', formerParent: 'racha-lechkhumi', published: true,
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
    // HERO replaced: was the shared georgia-home.jpg placeholder (the "wrong
    // Sighnaghi cover"). Now our own Diamond Bridge wide view (1445x1088,
    // landscape — crops fine as a CSS-background hero); image-set() upgrades
    // AVIF-capable browsers. og:image / twitter:image auto-derive from this hero.
    image: '/images/files/diamond-bridge-dashbashi-canyon-georgia-1445w.webp',
    imageAvif: '/images/files/diamond-bridge-dashbashi-canyon-georgia-1445w.avif',
    // Own photos → one ImageObject each into the SitePage @graph (brand credit
    // Hikasus Travel; contentUrl at the largest shipped variant). Hero flagged
    // hero:true → representativeOfPage; the 3 inline body photos render as real
    // <figure> blocks in the per-locale body HTML. Region Kvemo Kartli.
    imageObjects: [
      {
        base: 'diamond-bridge-dashbashi-canyon-georgia', width: 1445, height: 1088, hero: true,
        name: 'Diamond Bridge over Dashbashi Canyon, Kvemo Kartli, Georgia',
        caption: 'The Diamond Bridge glass suspension bridge over Dashbashi Canyon near Tsalka',
        description: 'The 240-metre Diamond Bridge (opened 2022) spanning Dashbashi Canyon about 280 metres above the Khrami River, with a diamond-shaped glass café at its centre, near Tsalka, Kvemo Kartli, Georgia.',
        locationName: 'Dashbashi Canyon Diamond Bridge', locality: 'Tsalka', region: 'Kvemo Kartli', geo: { lat: 41.6394, lng: 44.1103 },
      },
      {
        base: 'diamond-bridge-glass-capsule-dashbashi-canyon-georgia', width: 1086, height: 1448,
        name: 'Diamond-shaped glass café on the Diamond Bridge, Dashbashi Canyon, Georgia',
        caption: 'The diamond-shaped glass café hanging beneath the Diamond Bridge over Dashbashi Canyon',
        description: 'The two-level diamond-shaped glass café suspended at the centre of the Diamond Bridge over Dashbashi Canyon, Kvemo Kartli, Georgia.',
        locationName: 'Dashbashi Canyon Diamond Bridge', locality: 'Tsalka', region: 'Kvemo Kartli', geo: { lat: 41.6394, lng: 44.1103 },
      },
      {
        base: 'diamond-restaurant-dashbashi-canyon-georgia', width: 1448, height: 1086,
        name: 'Diamond Restaurant at Dashbashi Canyon, Kvemo Kartli, Georgia',
        caption: 'The Diamond Restaurant building at Dashbashi Canyon near Tsalka',
        description: 'The Diamond Restaurant beside the Diamond Bridge at Dashbashi Canyon, serving Georgian cuisine with canyon views, near Tsalka, Kvemo Kartli, Georgia.',
        locationName: 'Diamond Restaurant, Dashbashi Canyon', locality: 'Tsalka', region: 'Kvemo Kartli', geo: { lat: 41.6394, lng: 44.1103 },
      },
      {
        base: 'dashbashi-canyon-zipline-georgia', width: 1445, height: 1088,
        name: 'Zipline across Dashbashi Canyon, Kvemo Kartli, Georgia',
        caption: 'A visitor ziplining across Dashbashi Canyon above the green gorge',
        description: 'A visitor riding a zipline across Dashbashi Canyon, high above the wooded basalt cliffs near the Diamond Bridge, Kvemo Kartli, Georgia.',
        locationName: 'Dashbashi Canyon', locality: 'Tsalka', region: 'Kvemo Kartli', geo: { lat: 41.6394, lng: 44.1103 },
      },
    ],
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
    // Cover/hero = our own Chavchavadze palace photo (the gallery item flagged
    // `hero: true`), served as the CSS-background hero via HeroSection image-set
    // (webp `image` + avif `imageAvif`). og:image/twitter:image auto-derive from
    // `image` (no separate ogImage) — same convention as the Telavi CityPage hero.
    image: '/images/files/tsinandali-estate-chavchavadze-house-kakheti-georgia-1536w.webp',
    imageAvif: '/images/files/tsinandali-estate-chavchavadze-house-kakheti-georgia-1536w.avif',
    // Photo set (our own). SitePage uses the one flagged `hero: true` as the
    // cover/background hero (NOT rendered inline); the rest (each with an
    // `afterChunk` index) render as real responsive <picture>/<img> BETWEEN body
    // sections — never a bottom block. Same mechanism as the Telavi CityPage
    // gallery, but these originals top out at 1536px, so each base ships
    // -{768,1200,1536}w.{avif,webp} in /images/files/ (body-image fallback <img>
    // = -1200w.webp, 1200x800; the ImageObject contentUrl uses the largest
    // -1536w.webp). `afterChunk` = insert the figure after the Nth body chunk
    // (chunk 0 = intro, then one per <h2>). Per-locale `alt`/`caption` maps live
    // here (not pages.json) so every locale shows its own strings;
    // `name`/`description`/`locationName`/`geo`/`locality`/`region`/`country`
    // feed the per-image ImageObject JSON-LD (brand credit; the hero item gets
    // representativeOfPage:true).
    gallery: [
      {
        base: 'tsinandali-estate-chavchavadze-house-kakheti-georgia', width: 1200, height: 800, hero: true,
        name: 'Chavchavadze palace and garden, Tsinandali Estate, Kakheti, Georgia',
        description: "The Italianate palace of Prince Alexander Chavchavadze at Tsinandali Estate, overlooking Georgia's first European-style landscape garden (laid out in the 1830s), Kakheti.",
        locationName: 'Tsinandali Estate', geo: { lat: 41.8945, lng: 45.5705 },
        locality: 'Tsinandali', region: 'Kakheti', country: 'GE',
        alt: {
          en: 'The 19th-century Chavchavadze palace and landscaped garden at Tsinandali Estate, Kakheti, Georgia, in autumn',
          de: 'Der Chavchavadze-Palast aus dem 19. Jahrhundert und der Landschaftsgarten des Anwesens Tsinandali, Kachetien, Georgien, im Herbst',
          fr: 'Le palais Chavchavadze du XIXe siècle et son jardin paysager au domaine de Tsinandali, Kakhétie, Géorgie, en automne',
          es: 'El palacio Chavchavadze del siglo XIX y el jardín paisajístico de la finca Tsinandali, Kajetia, Georgia, en otoño',
          nl: 'Het 19e-eeuwse Chavchavadze-paleis en de landschapstuin van landgoed Tsinandali, Kachetië, Georgië, in de herfst',
          cs: 'Palác Chavchavadze z 19. století a krajinná zahrada usedlosti Tsinandali, Kachetie, Gruzie, na podzim',
          pl: 'XIX-wieczny pałac Chavchavadze i ogród krajobrazowy w posiadłości Tsinandali, Kachetia, Gruzja, jesienią',
        },
        caption: {
          en: "At Tsinandali Estate, the Italianate palace of Prince Alexander Chavchavadze looks out over Georgia's first European-style landscape garden, laid out in the 1830s and still a highlight of any Kakheti wine tour.",
          de: 'Auf dem Anwesen Tsinandali blickt der italienisch geprägte Palast von Fürst Alexander Chavchavadze über Georgiens ersten Landschaftsgarten im europäischen Stil, angelegt in den 1830er Jahren und bis heute ein Höhepunkt jeder Weintour durch Kachetien.',
          fr: "Au domaine de Tsinandali, le palais d'inspiration italienne du prince Alexandre Chavchavadze domine le premier jardin paysager de style européen de Géorgie, aménagé dans les années 1830 et toujours incontournable lors d'un circuit œnologique en Kakhétie.",
          es: 'En la finca Tsinandali, el palacio de estilo italiano del príncipe Alexander Chavchavadze se asoma al primer jardín paisajístico de estilo europeo de Georgia, creado en la década de 1830 y aún hoy imprescindible en cualquier ruta del vino por Kajetia.',
          nl: 'Op landgoed Tsinandali kijkt het Italianiserende paleis van prins Alexander Chavchavadze uit over de eerste landschapstuin in Europese stijl van Georgië, aangelegd in de jaren 1830 en nog altijd een hoogtepunt van elke wijntour door Kachetië.',
          cs: 'Na usedlosti Tsinandali shlíží italsky laděný palác knížete Alexandra Chavchavadzeho na první krajinnou zahradu v evropském stylu v Gruzii, založenou ve 30. letech 19. století a dodnes vrchol každého vinařského výletu po Kachetii.',
          pl: 'W posiadłości Tsinandali włoski w stylu pałac księcia Aleksandra Chavchavadzego spogląda na pierwszy w Gruzji ogród krajobrazowy w stylu europejskim, założony w latach 30. XIX wieku i wciąż będący atrakcją każdej trasy winiarskiej po Kachetii.',
        },
      },
      {
        base: 'tsinandali-estate-boxwood-maze-kakheti-georgia', width: 1200, height: 800, afterChunk: 3,
        name: 'Boxwood maze and wish tree, Tsinandali Estate garden, Kakheti, Georgia',
        description: 'A wish tree hung with ribbons in the clipped boxwood maze of the 19th-century Tsinandali Estate garden, Kakheti.',
        locationName: 'Tsinandali Estate', geo: { lat: 41.8945, lng: 45.5705 },
        locality: 'Tsinandali', region: 'Kakheti', country: 'GE',
        alt: {
          en: 'Wish tree hung with ribbons in the boxwood maze of the Tsinandali Estate garden, Kakheti, Georgia',
          de: 'Wunschbaum mit Bändern im Buchsbaum-Labyrinth des Gartens von Tsinandali, Kachetien, Georgien',
          fr: 'Arbre à vœux orné de rubans dans le labyrinthe de buis du jardin du domaine de Tsinandali, Kakhétie, Géorgie',
          es: 'Árbol de los deseos con cintas en el laberinto de boj del jardín de la finca Tsinandali, Kajetia, Georgia',
          nl: 'Wensboom met linten in het buxusdoolhof van de tuin van landgoed Tsinandali, Kachetië, Georgië',
          cs: 'Strom přání ozdobený stuhami v zimostrázovém bludišti zahrady Tsinandali, Kachetie, Gruzie',
          pl: 'Drzewo życzeń ozdobione wstążkami w bukszpanowym labiryncie ogrodu posiadłości Tsinandali, Kachetia, Gruzja',
        },
        caption: {
          en: "In the boxwood maze of the Tsinandali garden, visitors tie ribbons to a wish tree — one of the quieter corners of Prince Chavchavadze's 19th-century park.",
          de: 'Im Buchsbaum-Labyrinth des Gartens von Tsinandali binden Besucher Bänder an einen Wunschbaum — eine der stilleren Ecken des Parks von Fürst Chavchavadze aus dem 19. Jahrhundert.',
          fr: "Dans le labyrinthe de buis du jardin de Tsinandali, les visiteurs nouent des rubans à un arbre à vœux — l'un des coins les plus paisibles du parc du XIXe siècle du prince Chavchavadze.",
          es: 'En el laberinto de boj del jardín de Tsinandali, los visitantes atan cintas a un árbol de los deseos, uno de los rincones más tranquilos del parque decimonónico del príncipe Chavchavadze.',
          nl: 'In het buxusdoolhof van de tuin van Tsinandali knopen bezoekers linten aan een wensboom — een van de rustigere hoekjes van het 19e-eeuwse park van prins Chavchavadze.',
          cs: 'V zimostrázovém bludišti zahrady Tsinandali návštěvníci uvazují stuhy na strom přání — jedno z klidnějších zákoutí parku knížete Chavchavadzeho z 19. století.',
          pl: 'W bukszpanowym labiryncie ogrodu Tsinandali odwiedzający wiążą wstążki na drzewie życzeń — jednym z cichszych zakątków XIX-wiecznego parku księcia Chavchavadzego.',
        },
      },
      {
        base: 'tsinandali-estate-garden-autumn-kakheti-georgia', width: 1200, height: 800, afterChunk: 4,
        name: 'Tsinandali Estate garden in autumn, Kakheti, Georgia',
        description: 'Autumn in the landscaped garden of Tsinandali Estate, planted with species from every continent, around the Chavchavadze palace-museum, Kakheti.',
        locationName: 'Tsinandali Estate', geo: { lat: 41.8945, lng: 45.5705 },
        locality: 'Tsinandali', region: 'Kakheti', country: 'GE',
        alt: {
          en: 'Autumn colours in the landscaped garden of Tsinandali Estate with the Chavchavadze palace, Kakheti, Georgia',
          de: 'Herbstfarben im Landschaftsgarten des Anwesens Tsinandali mit dem Chavchavadze-Palast, Kachetien, Georgien',
          fr: "Couleurs d'automne dans le jardin paysager du domaine de Tsinandali avec le palais Chavchavadze, Kakhétie, Géorgie",
          es: 'Colores otoñales en el jardín paisajístico de la finca Tsinandali con el palacio Chavchavadze, Kajetia, Georgia',
          nl: 'Herfstkleuren in de landschapstuin van landgoed Tsinandali met het Chavchavadze-paleis, Kachetië, Georgië',
          cs: 'Podzimní barvy v krajinné zahradě usedlosti Tsinandali s palácem Chavchavadze, Kachetie, Gruzie',
          pl: 'Jesienne barwy w ogrodzie krajobrazowym posiadłości Tsinandali z pałacem Chavchavadze, Kachetia, Gruzja',
        },
        caption: {
          en: "Autumn settles over the Tsinandali garden, planted with trees and shrubs from every continent around Prince Alexander Chavchavadze's palace-museum in Kakheti.",
          de: 'Der Herbst legt sich über den Garten von Tsinandali, der mit Bäumen und Sträuchern aus allen Kontinenten rund um das Palast-Museum von Fürst Alexander Chavchavadze in Kachetien bepflanzt ist.',
          fr: "L'automne s'installe sur le jardin de Tsinandali, planté d'arbres et d'arbustes de tous les continents autour du palais-musée du prince Alexandre Chavchavadze en Kakhétie.",
          es: 'El otoño se instala en el jardín de Tsinandali, plantado con árboles y arbustos de todos los continentes alrededor del palacio-museo del príncipe Alexander Chavchavadze en Kajetia.',
          nl: 'De herfst daalt neer over de tuin van Tsinandali, beplant met bomen en struiken van elk continent rond het paleismuseum van prins Alexander Chavchavadze in Kachetië.',
          cs: 'Podzim se snáší nad zahradou Tsinandali, osázenou stromy a keři ze všech kontinentů kolem palácového muzea knížete Alexandra Chavchavadzeho v Kachetii.',
          pl: 'Jesień zstępuje na ogród Tsinandali, obsadzony drzewami i krzewami ze wszystkich kontynentów wokół pałacu-muzeum księcia Aleksandra Chavchavadzego w Kachetii.',
        },
      },
    ],
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
    parentType: 'city', parent: 'kvareli', formerParent: 'kakheti', published: true,
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
    parentType: 'city', parent: 'gurjaani', formerParent: 'kakheti', published: true,
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
    // Own original photograph (the former Wikimedia CC-BY-2.0 image was replaced,
    // so its attribution was removed). `image` is the WebP the CSS hero renders
    // and the URL used by og:image fallback / the ImageObject; `imageAvif` is the
    // smaller variant served to AVIF-capable browsers via CSS image-set().
    image: '/images/files/batonis-tsikhe-telavi-kakheti-georgia-1600w.webp',
    imageAvif: '/images/files/batonis-tsikhe-telavi-kakheti-georgia-1600w.avif',
    // Dedicated 1.91:1 social-share image (og:image / twitter:image).
    ogImage: { src: '/images/files/batonis-tsikhe-telavi-kakheti-georgia-og-1200x630.jpg', width: 1200, height: 630 },
    // Image SEO/AEO metadata. The hero is a CSS background (no <img alt>), so the
    // localized alt text lives here and is emitted as the ImageObject caption,
    // og:image:alt and twitter:image:alt per locale.
    imageMeta: {
      width: 1600, height: 1205,
      name: 'Batonis Tsikhe fortress, Telavi, Kakheti, Georgia',
      description: 'The royal residence of King Erekle II in central Telavi, Kakheti, with the Alazani Valley and Greater Caucasus behind.',
      locationName: 'Batonis Tsikhe, Telavi',
      locality: 'Telavi', region: 'Kakheti', country: 'GE',
      geo: { lat: 41.9200, lng: 45.4750 },
      alt: {
        en: 'Batonis Tsikhe fortress walls and church bell tower in Telavi, Kakheti, Georgia, above the Alazani Valley',
        de: 'Festungsmauern und Kirchturm der Batonis-Zikhe-Festung in Telawi, Kachetien, Georgien, über dem Alazani-Tal',
        fr: "Remparts et clocher de la forteresse Batonis Tsikhe à Telavi, Kakhétie, Géorgie, au-dessus de la vallée de l'Alazani",
        es: 'Murallas y campanario de la fortaleza Batonis Tsikhe en Telavi, Kajetia, Georgia, sobre el valle del Alazani',
        nl: 'Vestingmuren en kerktoren van fort Batonis Tsikhe in Telavi, Kachetië, Georgië, boven de Alazani-vallei',
        cs: 'Hradby a zvonice pevnosti Batonis Tsikhe v Telavi, Kachetie, Gruzie, nad údolím Alazani',
        pl: 'Mury i dzwonnica twierdzy Batonis Tsikhe w Telawi, Kachetia, Gruzja, nad doliną Alazani',
      },
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
    // On the Georgian Military Highway between Mtskheta and Gudauri; not inside
    // any city we publish, so parented on the Mtskheta-Mtianeti region.
    slug: 'ananuri-fortress', name: 'Ananuri Fortress',
    parentType: 'region', parent: 'mtskheta-mtianeti', published: true,
    seoKey: 'ananuriFortress', contentKey: 'ananuriFortress',
    image: '/images/files/Ananuri%20Fortress%20and%20Zhinvali%20Reservoir.jpg',
    // Body/gallery photos (our own). Cover/hero above is unchanged. Each renders
    // as a real lazy responsive <picture>/<img> BETWEEN body sections (via its
    // `afterChunk` index) — same Option-A mechanism as the Telavi CityPage /
    // Tsinandali SitePage gallery. These originals top out below the default
    // 1536px, so each item overrides `widths` (and the portrait its fallback
    // `<img>` width) — Telavi/Tsinandali defaults are untouched. Region is
    // Mtskheta-Mtianeti (NOT Kakheti). Per-locale alt/caption maps drive every
    // locale's own strings; name/description/geo/locality feed the per-image
    // ImageObject JSON-LD (brand credit Hikasus Travel; body images, so
    // representativeOfPage stays false — the hero is untouched).
    gallery: [
      {
        base: 'ananuri-fortress-complex-georgia', width: 1200, height: 900,
        widths: [768, 1200, 1448], afterChunk: 1,
        name: 'Ananuri fortress complex above the Zhinvali Reservoir, Georgia',
        description: 'The Ananuri fortress complex — crenellated towers and the 1689 Church of the Assumption — above the Zhinvali Reservoir on the Georgian Military Road, former seat of the dukes of Aragvi, Mtskheta-Mtianeti, Georgia.',
        locationName: 'Ananuri Fortress', geo: { lat: 42.1643, lng: 44.7042 },
        locality: 'Ananuri', region: 'Mtskheta-Mtianeti', country: 'GE',
        alt: {
          en: 'Ananuri fortress complex with its towers and Church of the Assumption above the Zhinvali Reservoir, Georgia',
          de: 'Festungskomplex Ananuri mit Türmen und Mariä-Entschlafens-Kirche über dem Zhinvali-Stausee, Georgien',
          fr: "Le complexe fortifié d'Ananouri, ses tours et son église de l'Assomption au-dessus du réservoir de Jinvali, Géorgie",
          es: 'El complejo fortificado de Ananuri con sus torres y la iglesia de la Asunción sobre el embalse de Zhinvali, Georgia',
          nl: 'Het vestingcomplex Ananuri met torens en Hemelvaartkerk boven het Zhinvali-stuwmeer, Georgië',
          cs: 'Pevnostní komplex Ananuri s věžemi a kostelem Nanebevzetí nad Žinvalskou přehradou, Gruzie',
          pl: 'Kompleks twierdzy Ananuri z wieżami i kościołem Wniebowzięcia nad Zbiornikiem Żinwalskim, Gruzja',
        },
        caption: {
          en: 'The classic view of Ananuri: crenellated towers and the domed Church of the Assumption above the Zhinvali Reservoir, once the seat of the dukes of Aragvi.',
          de: 'Der klassische Blick auf Ananuri: zinnenbewehrte Türme und die gewölbte Mariä-Entschlafens-Kirche über dem Zhinvali-Stausee, einst Sitz der Fürsten von Aragwi.',
          fr: "La vue classique d'Ananouri : tours crénelées et église de l'Assomption à coupole au-dessus du réservoir de Jinvali, ancien siège des ducs d'Aragvi.",
          es: 'La vista clásica de Ananuri: torres almenadas y la cupulada iglesia de la Asunción sobre el embalse de Zhinvali, antigua sede de los duques de Aragvi.',
          nl: 'Het klassieke uitzicht op Ananuri: gekanteelde torens en de koepelkerk van de Hemelvaart boven het Zhinvali-stuwmeer, ooit de zetel van de hertogen van Aragvi.',
          cs: 'Klasický pohled na Ananuri: cimbuřové věže a kopulový kostel Nanebevzetí nad Žinvalskou přehradou, kdysi sídlo vévodů z Aragvi.',
          pl: 'Klasyczny widok Ananuri: blankowane wieże i kopułowy kościół Wniebowzięcia nad Zbiornikiem Żinwalskim, dawna siedziba książąt Aragwi.',
        },
      },
      {
        base: 'ananuri-fortress-towers-georgia', width: 1086, height: 1448,
        widths: [768, 1086], fallbackWidth: 1086, afterChunk: 3,
        name: 'Towers of Ananuri fortress, Mtskheta-Mtianeti, Georgia',
        description: 'The towers and crenellated curtain wall of Ananuri fortress, seat of the dukes of Aragvi, on the Georgian Military Road, Mtskheta-Mtianeti, Georgia.',
        locationName: 'Ananuri Fortress', geo: { lat: 42.1643, lng: 44.7042 },
        locality: 'Ananuri', region: 'Mtskheta-Mtianeti', country: 'GE',
        alt: {
          en: 'Stone towers and curtain wall of Ananuri fortress on the Georgian Military Road, Mtskheta-Mtianeti, Georgia',
          de: 'Steintürme und Ringmauer der Festung Ananuri an der Georgischen Heerstraße, Mzcheta-Mtianeti, Georgien',
          fr: "Tours de pierre et courtine de la forteresse d'Ananouri sur la Route militaire géorgienne, Mtskheta-Mtianeti, Géorgie",
          es: 'Torres de piedra y muralla de la fortaleza de Ananuri en la Carretera Militar de Georgia, Mtsjeta-Mtianeti, Georgia',
          nl: 'Stenen torens en ringmuur van fort Ananuri aan de Georgische Militaire Weg, Mtscheta-Mtianeti, Georgië',
          cs: 'Kamenné věže a hradba pevnosti Ananuri na Gruzínské vojenské cestě, Mccheta-Mtianeti, Gruzie',
          pl: 'Kamienne wieże i mur twierdzy Ananuri przy Gruzińskiej Drodze Wojennej, Mccheta-Mtianeti, Gruzja',
        },
        caption: {
          en: 'A Caucasian shepherd dog rests on the square below Ananuri, whose stone towers and battlements guarded the Georgian Military Road for the dukes of Aragvi.',
          de: 'Ein kaukasischer Hirtenhund ruht auf dem Platz unterhalb von Ananuri, dessen Steintürme und Zinnen für die Fürsten von Aragwi die Georgische Heerstraße bewachten.',
          fr: "Un chien de berger du Caucase se repose sur la place au pied d'Ananouri, dont les tours de pierre gardaient la Route militaire géorgienne pour les ducs d'Aragvi.",
          es: 'Un perro pastor del Cáucaso descansa en la plaza al pie de Ananuri, cuyas torres de piedra vigilaban la Carretera Militar de Georgia para los duques de Aragvi.',
          nl: 'Een Kaukasische herdershond rust op het plein onder Ananuri, waarvan de stenen torens de Georgische Militaire Weg bewaakten voor de hertogen van Aragvi.',
          cs: 'Kavkazský pastevecký pes odpočívá na náměstí pod Ananuri, jehož kamenné věže střežily Gruzínskou vojenskou cestu pro vévody z Aragvi.',
          pl: 'Owczarek kaukaski odpoczywa na placu pod Ananuri, którego kamienne wieże strzegły Gruzińskiej Drogi Wojennej dla książąt Aragwi.',
        },
      },
      {
        base: 'ananuri-church-of-assumption-georgia', width: 1200, height: 900,
        widths: [768, 1200, 1448], afterChunk: 4,
        name: 'Church of the Assumption, Ananuri fortress, Georgia',
        description: 'The domed Church of the Assumption (Ghvtismshobeli), built in 1689 within Ananuri fortress, known for its richly carved stone facades, Mtskheta-Mtianeti, Georgia.',
        locationName: 'Ananuri Fortress', geo: { lat: 42.1643, lng: 44.7042 },
        locality: 'Ananuri', region: 'Mtskheta-Mtianeti', country: 'GE',
        alt: {
          en: 'The domed 1689 Church of the Assumption within Ananuri fortress, Mtskheta-Mtianeti, Georgia',
          de: 'Die gewölbte Mariä-Entschlafens-Kirche von 1689 in der Festung Ananuri, Mzcheta-Mtianeti, Georgien',
          fr: "L'église de l'Assomption de 1689 à coupole dans la forteresse d'Ananouri, Mtskheta-Mtianeti, Géorgie",
          es: 'La cupulada iglesia de la Asunción de 1689 en la fortaleza de Ananuri, Mtsjeta-Mtianeti, Georgia',
          nl: 'De koepelkerk van de Hemelvaart uit 1689 binnen fort Ananuri, Mtscheta-Mtianeti, Georgië',
          cs: 'Kopulový kostel Nanebevzetí z roku 1689 v pevnosti Ananuri, Mccheta-Mtianeti, Gruzie',
          pl: 'Kopułowy kościół Wniebowzięcia z 1689 roku w twierdzy Ananuri, Mccheta-Mtianeti, Gruzja',
        },
        caption: {
          en: 'Within the walls of Ananuri rises the Church of the Assumption, built in 1689 and famous for the carved cross and grapevine motifs on its stone facades.',
          de: 'Innerhalb der Mauern von Ananuri erhebt sich die 1689 erbaute Mariä-Entschlafens-Kirche, berühmt für das geschnitzte Kreuz und die Weinranken an ihren Steinfassaden.',
          fr: "Dans l'enceinte d'Ananouri se dresse l'église de l'Assomption, bâtie en 1689 et célèbre pour la croix et les vignes sculptées sur ses façades de pierre.",
          es: 'Dentro de los muros de Ananuri se alza la iglesia de la Asunción, construida en 1689 y célebre por la cruz y las vides talladas en sus fachadas de piedra.',
          nl: 'Binnen de muren van Ananuri verrijst de Hemelvaartkerk uit 1689, beroemd om het gebeeldhouwde kruis en de wijnranken op haar stenen gevels.',
          cs: 'V hradbách Ananuri se tyčí kostel Nanebevzetí z roku 1689, proslulý vytesaným křížem a vinnou révou na kamenných průčelích.',
          pl: 'W murach Ananuri wznosi się kościół Wniebowzięcia z 1689 roku, słynący z rzeźbionego krzyża i winorośli na kamiennych fasadach.',
        },
      },
      {
        base: 'zhinvali-reservoir-aragvi-valley-georgia', width: 1200, height: 900,
        widths: [768, 1200, 1448], afterChunk: 5,
        name: 'Zhinvali Reservoir on the Aragvi River, Mtskheta-Mtianeti, Georgia',
        description: 'The Zhinvali Reservoir, an artificial lake on the Aragvi River below Ananuri fortress, ringed by the forested foothills of the Greater Caucasus, Mtskheta-Mtianeti, Georgia.',
        locationName: 'Zhinvali Reservoir', geo: { lat: 42.1450, lng: 44.7200 },
        locality: 'Zhinvali', region: 'Mtskheta-Mtianeti', country: 'GE',
        alt: {
          en: 'The turquoise Zhinvali Reservoir on the Aragvi River below Ananuri, Mtskheta-Mtianeti, Georgia',
          de: 'Der türkisfarbene Zhinvali-Stausee am Fluss Aragwi unterhalb von Ananuri, Mzcheta-Mtianeti, Georgien',
          fr: "Le réservoir turquoise de Jinvali sur la rivière Aragvi en contrebas d'Ananouri, Mtskheta-Mtianeti, Géorgie",
          es: 'El turquesa embalse de Zhinvali en el río Aragvi bajo Ananuri, Mtsjeta-Mtianeti, Georgia',
          nl: 'Het turquoise Zhinvali-stuwmeer aan de rivier de Aragvi onder Ananuri, Mtscheta-Mtianeti, Georgië',
          cs: 'Tyrkysová Žinvalská přehrada na řece Aragvi pod Ananuri, Mccheta-Mtianeti, Gruzie',
          pl: 'Turkusowy Zbiornik Żinwalski na rzece Aragwi poniżej Ananuri, Mccheta-Mtianeti, Gruzja',
        },
        caption: {
          en: 'Just below Ananuri, the Aragvi River widens into the turquoise Zhinvali Reservoir, ringed by the forested foothills of the Greater Caucasus.',
          de: 'Kurz unterhalb von Ananuri weitet sich der Fluss Aragwi zum türkisfarbenen Zhinvali-Stausee, umgeben von den bewaldeten Ausläufern des Großen Kaukasus.',
          fr: "Juste en contrebas d'Ananouri, la rivière Aragvi s'élargit en un réservoir turquoise de Jinvali, cerné par les contreforts boisés du Grand Caucase.",
          es: 'Justo bajo Ananuri, el río Aragvi se ensancha en el turquesa embalse de Zhinvali, rodeado por las estribaciones boscosas del Gran Cáucaso.',
          nl: 'Vlak onder Ananuri verbreedt de rivier de Aragvi zich tot het turquoise Zhinvali-stuwmeer, omringd door de beboste uitlopers van de Grote Kaukasus.',
          cs: 'Těsně pod Ananuri se řeka Aragvi rozšiřuje do tyrkysové Žinvalské přehrady, obklopené zalesněnými předhůřími Velkého Kavkazu.',
          pl: 'Tuż poniżej Ananuri rzeka Aragwi rozlewa się w turkusowy Zbiornik Żinwalski, otoczony zalesionymi wzgórzami Wielkiego Kaukazu.',
        },
      },
      {
        base: 'ananuri-souvenir-market-georgia', width: 1200, height: 900,
        widths: [768, 1200, 1445], afterChunk: 6,
        name: 'Souvenir market at Ananuri, Mtskheta-Mtianeti, Georgia',
        description: 'A roadside souvenir market below Ananuri fortress selling felt shepherd hats, sheepskins and wool knitwear to travellers on the Georgian Military Road, Mtskheta-Mtianeti, Georgia.',
        locationName: 'Ananuri', geo: { lat: 42.1643, lng: 44.7042 },
        locality: 'Ananuri', region: 'Mtskheta-Mtianeti', country: 'GE',
        alt: {
          en: 'Roadside souvenir market with felt hats and wool ponchos at Ananuri, Mtskheta-Mtianeti, Georgia',
          de: 'Souvenirmarkt am Straßenrand mit Filzhüten und Wollponchos bei Ananuri, Mzcheta-Mtianeti, Georgien',
          fr: "Marché de souvenirs en bord de route avec chapeaux en feutre et ponchos en laine à Ananouri, Mtskheta-Mtianeti, Géorgie",
          es: 'Mercado de souvenirs junto a la carretera con gorros de fieltro y ponchos de lana en Ananuri, Mtsjeta-Mtianeti, Georgia',
          nl: "Souvenirmarkt langs de weg met vilten mutsen en wollen poncho's bij Ananuri, Mtscheta-Mtianeti, Georgië",
          cs: 'Silniční trh se suvenýry s plstěnými čepicemi a vlněnými pončy u Ananuri, Mccheta-Mtianeti, Gruzie',
          pl: 'Przydrożny targ z pamiątkami z filcowymi czapkami i wełnianymi ponczami przy Ananuri, Mccheta-Mtianeti, Gruzja',
        },
        caption: {
          en: 'At the roadside stalls below Ananuri, vendors sell felt shepherd hats, sheepskins and wool knitwear to travellers on the Georgian Military Road.',
          de: 'An den Ständen unterhalb von Ananuri verkaufen Händler Filzhüte, Schaffelle und Wollstrickwaren an Reisende auf der Georgischen Heerstraße.',
          fr: "Aux étals au pied d'Ananouri, les marchands vendent chapeaux de berger en feutre, peaux de mouton et tricots de laine aux voyageurs de la Route militaire géorgienne.",
          es: 'En los puestos al pie de Ananuri, los vendedores ofrecen gorros de fieltro, pieles de oveja y prendas de lana a los viajeros de la Carretera Militar de Georgia.',
          nl: 'Bij de kraampjes onder Ananuri verkopen handelaren vilten herdersmutsen, schapenvachten en wollen breigoed aan reizigers op de Georgische Militaire Weg.',
          cs: 'U stánků pod Ananuri prodávají obchodníci plstěné pastýřské čepice, ovčí kůže a vlněné pletené zboží cestovatelům na Gruzínské vojenské cestě.',
          pl: 'Przy straganach pod Ananuri sprzedawcy oferują filcowe pasterskie czapki, owcze skóry i wełniane wyroby podróżnym na Gruzińskiej Drodze Wojennej.',
        },
      },
    ],
  },
  {
    slug: 'uplistsikhe', name: 'Uplistsikhe',
    parentType: 'city', parent: 'gori', formerParent: 'shida-kartli', published: true,
    seoKey: 'uplistsikhe', contentKey: 'uplistsikhe',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'ateni-sioni', name: 'Ateni Sioni',
    parentType: 'city', parent: 'gori', formerParent: 'shida-kartli', published: true,
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
    // Cover/hero = our own Gori Fortress photo (the citadel with the Georgian
    // flag), replacing the generic georgia-home.jpg placeholder. Rendered as the
    // CSS-background hero via HeroSection image-set (webp `image` + avif
    // `imageAvif`); og:image/twitter auto-derive from `image`. Native max width
    // is 1264 (no upscale). Region is Shida Kartli, locality Gori.
    image: '/images/files/gori-fortress-georgia-1264w.webp',
    imageAvif: '/images/files/gori-fortress-georgia-1264w.avif',
    // Contextual body photos (our own). The 3 non-hero images render as real
    // inline <figure> blocks embedded in the per-locale body HTML (pages.json),
    // matched to their descriptions. `imageObjects` feeds ONE ImageObject per
    // photo into the SitePage JSON-LD @graph (brand credit Hikasus Travel; the
    // cover is flagged hero → representativeOfPage). contentUrl uses the largest
    // shipped variant (`width`w). Verbatim from the image SEO package.
    imageObjects: [
      {
        base: 'gori-fortress-georgia', width: 1264, height: 842, hero: true,
        name: 'Gori Fortress with the Georgian flag, Shida Kartli, Georgia',
        caption: 'The stone walls of Gori Fortress with the Georgian flag flying above at dusk',
        description: 'Gori Fortress, a citadel on a rocky hill above the town of Gori, its stone ramparts lit at dusk with the Georgian flag flying from the keep, Shida Kartli, Georgia.',
        locationName: 'Gori Fortress', locality: 'Gori', region: 'Shida Kartli', geo: { lat: 41.9847, lng: 44.1067 },
      },
      {
        base: 'memorial-georgian-warrior-heroes-gori-georgia', width: 1448, height: 1086,
        name: 'Memorial of Georgian Warrior Heroes, Gori, Shida Kartli, Georgia',
        caption: 'The bronze seated warriors of the Memorial of Georgian Warrior Heroes below Gori Fortress',
        description: "The Memorial of Georgian Warrior Heroes ('Requiem') at the foot of Gori Fortress: eight wounded warriors seated in a circle on stone blocks, sculpted by Giorgi Ochiauri 1981–85 and relocated from Vake Park, Tbilisi, in 2009, Shida Kartli, Georgia.",
        locationName: 'Memorial of Georgian Warrior Heroes', locality: 'Gori', region: 'Shida Kartli', geo: { lat: 41.9853, lng: 44.1075 },
      },
      {
        base: 'gori-fortress-gateway-georgia', width: 1024, height: 1536,
        name: 'Archway in the walls of Gori Fortress, Shida Kartli, Georgia',
        caption: 'The town of Gori framed by a pointed stone archway in the fortress walls',
        description: 'A pointed stone archway in the walls of Gori Fortress framing the rooftops of Gori and the surrounding hills, Shida Kartli, Georgia.',
        locationName: 'Gori Fortress', locality: 'Gori', region: 'Shida Kartli', geo: { lat: 41.9847, lng: 44.1067 },
      },
      {
        base: 'gori-fortress-caucasus-view-georgia', width: 1536, height: 1024,
        name: 'Caucasus view from Gori Fortress, Shida Kartli, Georgia',
        caption: 'Snow-capped Caucasus peaks seen over the rampart of Gori Fortress at sunrise',
        description: 'The snow-capped peaks of the Greater Caucasus on the northern horizon, seen over the cobblestone rampart of Gori Fortress at sunrise, Shida Kartli, Georgia.',
        locationName: 'Gori Fortress', locality: 'Gori', region: 'Shida Kartli', geo: { lat: 41.9847, lng: 44.1067 },
      },
    ],
  },
  {
    slug: 'stalin-museum-gori', name: 'Stalin Museum',
    parentType: 'city', parent: 'gori', published: true,
    seoKey: 'stalinMuseumGori', contentKey: 'stalinMuseumGori',
    // Cover/hero = our own corner-facade photo of the museum, replacing the
    // generic georgia-home.jpg placeholder. Rendered as the CSS-background hero
    // via HeroSection image-set (webp `image` + avif `imageAvif`); og:image and
    // twitter auto-derive from `image`. Native max width is 1370 (no upscale).
    // The landscape corner view is the hero rather than the portrait arcade shot
    // (1009x1559): the hero is a full-viewport `cover` background, which crops a
    // portrait to a ~40% mid-band on desktop, cutting both the roofline and the
    // column bases. The portrait runs inline beside the architecture text instead.
    image: '/images/files/stalin-museum-gori-building-georgia-1370w.webp',
    imageAvif: '/images/files/stalin-museum-gori-building-georgia-1370w.avif',
    // Contextual body photos (our own). The 3 non-hero images render as real
    // inline <figure> blocks embedded in the per-locale body HTML (pages.json),
    // matched to their descriptions. `imageObjects` feeds ONE ImageObject per
    // photo into the SitePage JSON-LD @graph (brand credit Hikasus Travel; the
    // cover is flagged hero → representativeOfPage). contentUrl uses the largest
    // shipped variant (`width`w). Region is Shida Kartli, locality Gori. Verbatim
    // from the image SEO package (REPLACE-BRAND → Hikasus Travel).
    imageObjects: [
      {
        base: 'stalin-museum-gori-building-georgia', width: 1370, height: 1148, hero: true,
        name: 'Joseph Stalin Museum building, Gori, Shida Kartli, Georgia',
        caption: 'The corner facade and arcaded ground floor of the Joseph Stalin Museum in Gori',
        description: 'The corner facade of the Joseph Stalin Museum in Gori, with arcades of pointed arches around the ground floor, blending Stalinist monumental architecture with Georgian and Gothic detailing, Shida Kartli, Georgia.',
        locationName: 'Joseph Stalin Museum', locality: 'Gori', region: 'Shida Kartli', geo: { lat: 41.9863, lng: 44.1156 },
      },
      {
        base: 'stalin-museum-gori-arcades-georgia', width: 1009, height: 1559,
        name: 'Arcades of the Joseph Stalin Museum, Gori, Shida Kartli, Georgia',
        caption: 'The stone arcades and arched windows of the Joseph Stalin Museum in Gori',
        description: 'The arcaded facade of the Joseph Stalin Museum in Gori, a two-storey palazzo faced in Eklar stone, begun in 1951 to a design by Archil Kurdiani and opened as a museum in 1957, Shida Kartli, Georgia.',
        locationName: 'Joseph Stalin Museum', locality: 'Gori', region: 'Shida Kartli', geo: { lat: 41.9863, lng: 44.1156 },
      },
      {
        base: 'stalin-museum-gori-exhibition-hall-georgia', width: 1536, height: 1024,
        name: 'Exhibition hall of the Stalin Museum, Gori, Shida Kartli, Georgia',
        caption: 'A marble bust and archive photographs in an exhibition hall of the Stalin Museum in Gori',
        description: "An exhibition hall of the Joseph Stalin Museum in Gori with a marble bust and archive photographs; the museum's six halls hold tens of thousands of items and retain their 1957 layout, with a hall on the Soviet repressions added in 2010, Shida Kartli, Georgia.",
        locationName: 'Joseph Stalin Museum', locality: 'Gori', region: 'Shida Kartli', geo: { lat: 41.9863, lng: 44.1156 },
      },
      {
        base: 'stalin-museum-railway-carriage-gori-georgia', width: 1477, height: 1065,
        name: "Stalin's armoured railway carriage, Gori, Shida Kartli, Georgia",
        caption: "Stalin's green armoured Pullman railway carriage on display at the museum in Gori",
        description: 'The green armour-plated Pullman railway carriage displayed beside the Joseph Stalin Museum in Gori: 83 tonnes, used by Stalin from 1941 including journeys to the Tehran, Yalta and Potsdam conferences, brought from Rostov-on-Don in 1985, Shida Kartli, Georgia.',
        locationName: 'Joseph Stalin Museum', locality: 'Gori', region: 'Shida Kartli', geo: { lat: 41.9863, lng: 44.1156 },
      },
    ],
  },
  {
    slug: 'prometheus-cave', name: 'Prometheus Cave',
    parentType: 'region', parent: 'imereti', published: true,
    seoKey: 'prometheusCave', contentKey: 'prometheusCave',
    // Cover/hero = our own Prometheus Cave photo (replaces the generic
    // georgia-home.jpg placeholder). Rendered as the CSS-background hero via
    // HeroSection image-set (webp `image` + avif `imageAvif`); og:image/twitter
    // auto-derive from `image`. Native max width is 1536 (no upscale).
    image: '/images/files/prometheus-cave-imereti-georgia-1536w.webp',
    imageAvif: '/images/files/prometheus-cave-imereti-georgia-1536w.avif',
    // Contextual body photos (our own). The 5 non-hero images render as real
    // inline <figure> blocks embedded in the per-locale body HTML (pages.json),
    // NOT via the data-driven gallery. `imageObjects` feeds ONE ImageObject per
    // photo into the SitePage JSON-LD @graph (brand credit Hikasus Travel; the
    // cover is flagged hero → representativeOfPage). contentUrl uses the largest
    // shipped variant (`width`w). Region is Imereti, locality Kumistavi. Verbatim
    // from the image SEO package (REPLACE-BRAND → Hikasus Travel, /images/files path).
    imageObjects: [
      {
        base: 'prometheus-cave-imereti-georgia', width: 1536, height: 1024, hero: true,
        name: 'Prometheus Cave illuminated chamber, Kumistavi, Imereti, Georgia',
        caption: 'A colourfully lit chamber of Prometheus Cave with a walkway among stalactites',
        description: "A colourfully illuminated chamber of Prometheus (Kumistavi) Cave near Tskaltubo, one of Georgia's largest karst caves, with a walkway among stalactites and stalagmites, Imereti, Georgia.",
        locationName: 'Prometheus Cave (Kumistavi)', locality: 'Kumistavi', region: 'Imereti', geo: { lat: 42.3767, lng: 42.6000 },
      },
      {
        base: 'prometheus-cave-illuminated-chamber-imereti-georgia', width: 1536, height: 1024,
        name: 'Illuminated stalactites in Prometheus Cave, Kumistavi, Imereti, Georgia',
        caption: 'Stalactites and stalagmites under coloured lighting in Prometheus Cave',
        description: 'Stalactites and stalagmites under coloured LED lighting in Prometheus (Kumistavi) Cave, Imereti, Georgia.',
        locationName: 'Prometheus Cave (Kumistavi)', locality: 'Kumistavi', region: 'Imereti', geo: { lat: 42.3767, lng: 42.6000 },
      },
      {
        base: 'prometheus-cave-colored-lighting-imereti-georgia', width: 1536, height: 1024,
        name: 'Walkway through a lit hall of Prometheus Cave, Kumistavi, Imereti, Georgia',
        caption: 'A walkway winding through a colour-lit hall of Prometheus Cave',
        description: 'A visitor walkway winding through a colourfully lit hall of Prometheus (Kumistavi) Cave, Imereti, Georgia.',
        locationName: 'Prometheus Cave (Kumistavi)', locality: 'Kumistavi', region: 'Imereti', geo: { lat: 42.3767, lng: 42.6000 },
      },
      {
        base: 'prometheus-cave-natural-walkway-imereti-georgia', width: 1448, height: 1086,
        name: 'Natural formations and boardwalk in Prometheus Cave, Kumistavi, Imereti, Georgia',
        caption: 'Natural rock formations and a boardwalk in a hall of Prometheus Cave',
        description: 'Natural stalactites, flowstone and a boardwalk in a hall of Prometheus (Kumistavi) Cave, Imereti, Georgia.',
        locationName: 'Prometheus Cave (Kumistavi)', locality: 'Kumistavi', region: 'Imereti', geo: { lat: 42.3767, lng: 42.6000 },
      },
      {
        base: 'prometheus-cave-stalactite-column-imereti-georgia', width: 1086, height: 1448,
        name: 'Flowstone column in Prometheus Cave, Kumistavi, Imereti, Georgia',
        caption: 'A towering flowstone column with visitors in Prometheus Cave',
        description: 'A towering flowstone column, one of the largest formations along the walking route through Prometheus (Kumistavi) Cave, Imereti, Georgia.',
        locationName: 'Prometheus Cave (Kumistavi)', locality: 'Kumistavi', region: 'Imereti', geo: { lat: 42.3767, lng: 42.6000 },
      },
      {
        base: 'prometheus-cave-cavern-bridge-imereti-georgia', width: 1086, height: 1448,
        name: 'Walkway bridge in a Prometheus Cave hall, Kumistavi, Imereti, Georgia',
        caption: 'A walkway bridge crossing a large illuminated cavern in Prometheus Cave',
        description: "A metal walkway bridging a broad, illuminated hall of Prometheus (Kumistavi) Cave, Georgia's largest show cave, Imereti.",
        locationName: 'Prometheus Cave (Kumistavi)', locality: 'Kumistavi', region: 'Imereti', geo: { lat: 42.3767, lng: 42.6000 },
      },
    ],
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
    parentType: 'city', parent: 'kazbegi', published: true,
    seoKey: 'gergetiTrinityChurch', contentKey: 'gergetiTrinityChurch',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'gveleti-waterfalls', name: 'Gveleti Waterfalls',
    parentType: 'city', parent: 'kazbegi', published: true,
    seoKey: 'gveletiWaterfalls', contentKey: 'gveletiWaterfalls',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'juta', name: 'Juta & the Chaukhi Massif',
    parentType: 'city', parent: 'kazbegi', published: true,
    seoKey: 'juta', contentKey: 'juta',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'truso-valley', name: 'Truso Valley',
    parentType: 'city', parent: 'kazbegi', published: true,
    seoKey: 'trusoValley', contentKey: 'trusoValley',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'arsha-waterfall', name: 'Arsha Waterfall',
    parentType: 'city', parent: 'kazbegi', published: true,
    seoKey: 'arshaWaterfall', contentKey: 'arshaWaterfall',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'elia-hill-kazbegi', name: 'Elia Hill (St. Elias Church)',
    parentType: 'city', parent: 'kazbegi', published: true,
    seoKey: 'eliaHill', contentKey: 'eliaHill',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'gergeti-glacier', name: 'Gergeti Glacier',
    parentType: 'city', parent: 'kazbegi', published: true,
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
    parentType: 'city', parent: 'martvili', formerParent: 'samegrelo', published: true,
    seoKey: 'martviliCanyon', contentKey: 'martviliCanyon',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'martvili-monastery', name: 'Martvili Monastery (Chkondidi)',
    parentType: 'city', parent: 'martvili', formerParent: 'samegrelo', published: true,
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
    parentType: 'city', parent: 'zugdidi', formerParent: 'samegrelo', published: true,
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
    parentType: 'city', parent: 'mestia', formerParent: 'svaneti', published: true,
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
    parentType: 'city', parent: 'mestia', formerParent: 'svaneti', published: true,
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
    parentType: 'city', parent: 'mestia', formerParent: 'svaneti', published: true,
    seoKey: 'tetnuldiSkiResort', contentKey: 'tetnuldiSkiResort',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'cross-over-mestia', name: 'The Cross Over Mestia',
    parentType: 'city', parent: 'mestia', formerParent: 'svaneti', published: true,
    seoKey: 'crossOverMestia', contentKey: 'crossOverMestia',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'shkhara-glacier', name: 'Shkhara Glacier',
    parentType: 'city', parent: 'ushguli', formerParent: 'svaneti', published: true,
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
    parentType: 'city', parent: 'chiatura', formerParent: 'imereti', published: true,
    seoKey: 'katskhiPillar', contentKey: 'katskhiPillar',
    // HERO = the landscape summit-church photo (own). The portrait church shot
    // (1086x1448) would crop to a mid-pillar band in the wide CSS-background hero
    // (summit church + base cut on desktop), so it goes inline instead; this
    // 1536x1024 landscape fills the hero with minimal trim. image-set() upgrades
    // AVIF-capable browsers to the .avif.
    image: '/images/files/katskhi-pillar-summit-church-imereti-georgia-1536w.webp',
    imageAvif: '/images/files/katskhi-pillar-summit-church-imereti-georgia-1536w.avif',
    // Dedicated 1.91:1 social-share image (og:image / twitter:image) for the hero.
    ogImage: { src: '/images/files/katskhi-pillar-summit-church-imereti-georgia-og-1200x630.jpg', width: 1200, height: 630 },
    // Hero image SEO/AEO metadata. The hero is a CSS background (no <img alt>), so
    // the localized alt lives here and is emitted as the hero ImageObject caption
    // (representativeOfPage:true), og:image:alt and twitter:image:alt per locale.
    imageMeta: {
      width: 1536, height: 1024,
      name: 'Church on top of the Katskhi Pillar, Imereti, Georgia',
      description: "The small church, monks' cells and wine cellar on the flat summit of the Katskhi Pillar, reached only by a long metal ladder, near Chiatura, Imereti, Georgia.",
      locationName: 'Katskhi Pillar',
      locality: 'Katskhi', region: 'Imereti', country: 'GE',
      geo: { lat: 42.2933, lng: 43.2144 },
      alt: {
        en: "The church and monks' cells on top of the Katskhi Pillar with the climbing ladder, Imereti, Georgia",
        de: 'Die Kirche und Mönchszellen auf der Katskhi-Säule mit der Aufstiegsleiter, Imeretien, Georgien',
        fr: "L'église et les cellules des moines au sommet du pilier de Katskhi avec l'échelle d'accès, Iméréthie, Géorgie",
        es: 'La iglesia y las celdas de los monjes en lo alto del pilar de Katskhi con la escalera de acceso, Imericia, Georgia',
        nl: 'De kerk en monnikencellen op de top van de Katskhi-pilaar met de klimladder, Imereti, Georgië',
        cs: 'Kostel a mnišské cely na vrcholu Katskhijského sloupu s výstupovým žebříkem, Imeretie, Gruzie',
        pl: 'Kościół i cele mnichów na szczycie filaru Katskhi z drabiną wejściową, Imeretia, Gruzja',
      },
    },
    // Contextual inline body photos (own), rendered as real <figure> blocks in the
    // per-locale body HTML (NOT the hero, NOT a gallery grid). One ImageObject each
    // into the @graph. representativeOfPage stays false (only the hero is that).
    imageObjects: [
      {
        base: 'katskhi-pillar-church-imereti-georgia', width: 1086, height: 1448,
        name: 'Katskhi Pillar with clifftop church, near Chiatura, Imereti, Georgia',
        caption: 'The Katskhi Pillar, a 40-metre limestone monolith topped by a church, near Chiatura',
        description: 'The Katskhi Pillar, a natural limestone monolith about 40 metres high near Chiatura, topped by the church of Maximus the Confessor and historically used by stylite monks, Imereti, Georgia.',
        locationName: 'Katskhi Pillar', locality: 'Katskhi', region: 'Imereti', geo: { lat: 42.2933, lng: 43.2144 },
      },
      {
        base: 'katskhi-pillar-autumn-imereti-georgia', width: 1024, height: 1536,
        name: 'Katskhi Pillar above autumn forest, Imereti, Georgia',
        caption: 'The Katskhi Pillar rising above autumn forest, near Chiatura',
        description: 'The Katskhi Pillar rising above autumn forest near Chiatura, a 40-metre limestone monolith topped by a church, Imereti, Georgia.',
        locationName: 'Katskhi Pillar', locality: 'Katskhi', region: 'Imereti', geo: { lat: 42.2933, lng: 43.2144 },
      },
    ],
  },
  {
    slug: 'abastumani-observatory', name: 'Abastumani Astrophysical Observatory',
    // Parented on the spa town of Abastumani (local destination) for the URL,
    // with the region kept as metadata. Abastumani has no landing page of its
    // own, so parentType 'place' routes the site + shows a Places-to-Visit
    // breadcrumb rather than a dead town link. `formerParent` drives the 301.
    parentType: 'place', parent: 'abastumani', region: 'samtskhe-javakheti',
    formerParent: 'samtskhe-javakheti', published: true,
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
    parentType: 'city', parent: 'borjomi', formerParent: 'samtskhe-javakheti', published: true,
    seoKey: 'greenMonastery', contentKey: 'greenMonastery',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'sapara-monastery', name: 'Sapara Monastery',
    parentType: 'city', parent: 'akhaltsikhe', formerParent: 'samtskhe-javakheti', published: true,
    seoKey: 'saparaMonastery', contentKey: 'saparaMonastery',
    image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'timotesubani-monastery', name: 'Timotesubani Monastery',
    parentType: 'city', parent: 'borjomi', formerParent: 'samtskhe-javakheti', published: true,
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
    parentType: 'city', parent: 'tskaltubo', formerParent: 'imereti', published: true,
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
    parentType: 'city', parent: 'chiatura', formerParent: 'imereti', published: true,
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
  // A site parented on a local destination that has no landing page (parentType
  // 'place') carries its region explicitly, so the card location line still
  // shows the region even though the URL parent is the town/resort.
  if (site.parentType === 'place') {
    return { cityId: null, regionId: site.region || null }
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
  for (const s of sites) if (s.published) pages.push({
    path: cleanPath(sitePath(s)), seoKey: s.seoKey, image: s.image,
    // Optional image-SEO extras (only sites that define them). The dedicated
    // social image + its dimensions and the per-locale alt text feed the static
    // og:image / og:image:alt tags emitted by prerender.js.
    ogImage: s.ogImage?.src, ogImageWidth: s.ogImage?.width, ogImageHeight: s.ogImage?.height,
    imageAlt: s.imageMeta?.alt,
  })
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
  // Places to Visit re-parented from a region slug to a more specific local
  // destination (city/town/resort). The old regional URL — and its even older
  // /regions/<region>/<slug> form — 301-redirect directly to the new URL. Driven
  // by each site's `formerParent`, so adding a re-parented site needs no new rule.
  for (const s of sites) if (s.published && s.formerParent) {
    out.push({ from: `georgia/${s.formerParent}/${s.slug}`, to: cleanPath(sitePath(s)) })
    out.push({ from: `georgia/regions/${s.formerParent}/${s.slug}`, to: cleanPath(sitePath(s)) })
  }
  // Renamed Places to Visit — old slug 301-redirects to its new home.
  //   Russia–Georgia Friendship Monument -> Gudauri Panorama
  out.push({ from: 'georgia/gudauri/russia-georgia-friendship-monument', to: 'georgia/gudauri/gudauri-panorama' })
  // Renamed city — kazbegi-stepantsminda -> kazbegi. Redirect the old city page,
  // its things-to-do guide, and every city-parented site (Gergeti Trinity, Juta,
  // Truso, etc.) directly to the new slug — one hop each, no chains.
  const kazbegiOld = 'kazbegi-stepantsminda'
  const kazbegiNew = 'kazbegi'
  out.push({ from: `georgia/${kazbegiOld}`, to: `georgia/${kazbegiNew}` })
  out.push({
    from: `georgia/${kazbegiOld}/things-to-do-in-${kazbegiOld}`,
    to: `georgia/${kazbegiNew}/things-to-do-in-${kazbegiNew}`,
  })
  for (const s of sites) {
    if (s.published && s.parentType === 'city' && s.parent === kazbegiNew) {
      out.push({ from: `georgia/${kazbegiOld}/${s.slug}`, to: `georgia/${kazbegiNew}/${s.slug}` })
    }
  }
  return out
}

const cleanPath = (p) => p.replace(/^\//, '')
