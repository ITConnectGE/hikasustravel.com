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
    // Cover/hero = our own qvevri photo, replacing the previous kakheti-vineyard.jpg
    // (a relevant shot, not a placeholder — it stays in use by the things-to-do guide
    // below and by a tour, so the file is kept). Rendered as the CSS-background hero
    // via HeroSection image-set (webp `image` + avif `imageAvif`); og:image/twitter
    // auto-derive from `image` through useSEO. Native max width is 1448 (no upscale).
    image: '/images/files/qvevri-clay-vessels-kakheti-georgia-1448w.webp',
    imageAvif: '/images/files/qvevri-clay-vessels-kakheti-georgia-1448w.avif',
    // Cover + the one contextual body photo (our own). The vineyard renders as a real
    // inline <figure> in the per-locale body HTML (pages.json), by the wine/vineyard
    // text; the qvevri cover is the hero and is NOT repeated inline. `imageObjects`
    // feeds ONE ImageObject per photo into the RegionPage JSON-LD @graph (brand credit
    // Hikasus Travel; the cover flagged hero → representativeOfPage). contentUrl uses
    // the largest shipped variant (`width`w). Region is Kakheti. Verbatim from the
    // image SEO package (REPLACE-BRAND → Hikasus Travel).
    imageObjects: [
      {
        base: 'qvevri-clay-vessels-kakheti-georgia', width: 1448, height: 1086, hero: true,
        name: 'Qvevri clay wine vessels, Kakheti, Georgia',
        caption: 'Large clay qvevri wine vessels lined up against a stone wall in Kakheti',
        description: "Egg-shaped clay qvevri, the vessels traditionally buried in the ground to ferment and age Georgian wine — a method on UNESCO's Intangible Cultural Heritage list since 2013 — in Kakheti, Georgia.",
        // No `locality`: both shots are region-level (per the package, which carries
        // addressRegion only), so addressLocality drops out rather than claiming
        // Kakheti — a region — is a town. Coordinates are region-level/approximate.
        locationName: 'Kakheti', region: 'Kakheti', geo: { lat: 41.9200, lng: 45.4750 },
      },
      {
        base: 'kakheti-vineyard-sunset-georgia', width: 1448, height: 1086,
        name: 'Vineyard in Kakheti at sunrise, Georgia',
        caption: 'Rows of vines in a Kakheti vineyard at sunrise',
        description: "Rows of vines in a vineyard in Kakheti, the region that produces the majority of Georgia's wine, at sunrise.",
        locationName: 'Kakheti', region: 'Kakheti', geo: { lat: 41.9200, lng: 45.4750 },
      },
    ],
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
    seoKey: 'bakuriani', contentKey: 'bakuriani',
    // Cover/hero = our own Bakuriani ski-slope photo (16:9, native max 1600),
    // replacing the generic georgia-home.jpg placeholder. Rendered as the
    // CSS-background hero via HeroSection image-set (webp `image` + avif
    // `imageAvif`); og:image/twitter auto-derive from `image`. No upscale.
    image: '/images/files/bakuriani-ski-slope-georgia-1600w.webp',
    imageAvif: '/images/files/bakuriani-ski-slope-georgia-1600w.avif',
    // Contextual body photos (our own). The 4 non-hero images render as real
    // inline <figure> blocks embedded in the per-locale body HTML (pages.json),
    // matched to their descriptions. `imageObjects` feeds ONE ImageObject per
    // photo into the CityPage JSON-LD @graph (brand credit Hikasus Travel; the
    // cover is flagged hero → representativeOfPage). contentUrl uses the variant
    // named by `width`. Region Samtskhe-Javakheti, locality Bakuriani.
    // Verbatim from the image SEO package (REPLACE-BRAND → Hikasus Travel).
    imageObjects: [
      {
        base: 'bakuriani-ski-slope-georgia', width: 1600, height: 900, hero: true,
        name: 'Ski slope at Bakuriani, Samtskhe-Javakheti, Georgia',
        caption: 'Skiers on a groomed piste beside a chairlift among snow-covered spruce forest at Bakuriani',
        description: 'Skiers on a groomed piste beside a chairlift at Bakuriani ski resort, on the northern slope of the Trialeti Range at about 1,700 m, Borjomi municipality, Samtskhe-Javakheti, Georgia.',
        locationName: 'Bakuriani', locality: 'Bakuriani', region: 'Samtskhe-Javakheti', geo: { lat: 41.7500, lng: 43.5330 },
      },
      {
        base: 'bakuriani-chairlift-forest-georgia', width: 1600, height: 900,
        name: 'Chairlift through spruce forest at Bakuriani, Georgia',
        caption: 'A chairlift climbing through snow-laden spruce forest toward the summit at Bakuriani',
        description: 'A chairlift rising through snow-covered spruce forest toward the summit at Bakuriani ski resort, Samtskhe-Javakheti, Georgia.',
        locationName: 'Bakuriani', locality: 'Bakuriani', region: 'Samtskhe-Javakheti', geo: { lat: 41.7500, lng: 43.5330 },
      },
      {
        base: 'bakuriani-mountain-panorama-georgia', width: 1200, height: 900,
        name: 'Mountain panorama at Bakuriani, Georgia',
        caption: 'Snow-covered ridges and open pistes seen from a summit at Bakuriani',
        description: 'Snow-covered ridges and open pistes above the tree line at Bakuriani ski resort, looking across the Trialeti Range, Samtskhe-Javakheti, Georgia.',
        locationName: 'Bakuriani', locality: 'Bakuriani', region: 'Samtskhe-Javakheti', geo: { lat: 41.7500, lng: 43.5330 },
      },
      {
        base: 'bakuriani-chairlift-view-georgia', width: 2104, height: 1216,
        name: 'View from a chairlift at Bakuriani, Georgia',
        caption: 'View from a chairlift over snowy forest toward a distant peak at Bakuriani',
        description: 'The view from a chairlift at Bakuriani over snow-covered forest toward the peaks of the Trialeti Range, Samtskhe-Javakheti, Georgia.',
        locationName: 'Bakuriani', locality: 'Bakuriani', region: 'Samtskhe-Javakheti', geo: { lat: 41.7500, lng: 43.5330 },
      },
      {
        base: 'bakuriani-slope-cafe-georgia', width: 1600, height: 2644,
        name: 'Slope-side cafe on a snowy plateau at Bakuriani, Georgia',
        caption: 'Skiers and a slope-side cafe on a snowy plateau with mountain views at Bakuriani',
        description: 'Skiers and a slope-side cafe on a snowy plateau at Bakuriani ski resort, with the snow-covered ridges of the Trialeti Range beyond, Samtskhe-Javakheti, Georgia.',
        locationName: 'Bakuriani', locality: 'Bakuriani', region: 'Samtskhe-Javakheti', geo: { lat: 41.7500, lng: 43.5330 },
      },
    ],
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
    seoKey: 'ushguli', contentKey: 'ushguli',
    // Cover/hero = Ushguli Svan-towers photo (13:8, native max 2000 — the source
    // was fake-upscaled, so 2000 is the honest detail ceiling; no 2400 variant),
    // replacing the generic georgia-home.jpg placeholder. Rendered as the
    // CSS-background hero via HeroSection image-set (webp `image` + avif
    // `imageAvif`); og:image/twitter auto-derive from `image`. Distinct from the
    // Svaneti region page's own ushguli-village-shkhara-svaneti-georgia — both kept.
    image: '/images/files/ushguli-svan-towers-village-svaneti-georgia-2000w.webp',
    imageAvif: '/images/files/ushguli-svan-towers-village-svaneti-georgia-2000w.avif',
    // Hero ImageObject → CityPage JSON-LD @graph (representativeOfPage:true; the
    // hero is a CSS background with no <img alt>, so this carries the metadata).
    // Verbatim from the image SEO package. ⚠️ CREDIT UNRESOLVED: the image shows
    // signs of being an upscaled/stock file, not an owner original — creditText /
    // copyrightNotice / creator are intentionally left as REPLACE-BRAND until the
    // origin is confirmed. Do NOT set these to Hikasus Travel yet.
    imageObjects: [
      {
        base: 'ushguli-svan-towers-village-svaneti-georgia', width: 2000, height: 1231, hero: true,
        name: 'Svan tower-houses in Ushguli, Upper Svaneti, Georgia',
        caption: 'Medieval Svan stone tower-houses in Ushguli village above the green Enguri valley, Upper Svaneti',
        description: "Medieval Svan stone tower-houses in the Ushguli community at around 2,100 m at the head of the Enguri gorge, Upper Svaneti — a UNESCO World Heritage Site and one of Europe's highest continuously inhabited settlements, Georgia.",
        creditText: 'REPLACE-BRAND', copyrightNotice: '© REPLACE-BRAND', creator: 'REPLACE-BRAND',
        locationName: 'Ushguli', locality: 'Ushguli', region: 'Svaneti', geo: { lat: 42.9169, lng: 43.0136 },
      },
    ],
    thingsToDo: {
      seoKey: 'thingsToDoUshguli', contentKey: 'thingsToDoUshguli', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Ushguli' },
      attractions: ['Ushguli Svan Towers', 'Lamaria Church', 'Mount Shkhara & Glacier', 'Chazhashi Village'],
    },
  },
  {
    slug: 'mestia', name: 'Mestia', region: 'svaneti', published: true,
    seoKey: 'mestia', contentKey: 'mestia',
    // Hero = owner's own Mestia Svan-tower photo. Native ceiling is 1541 (BELOW
    // the usual 1600 rung), so the ladder is 768/1200/1541 only — NO 1600/2400
    // variant is generated or referenced, and the ImageObject contentUrl points at
    // the 1541 rung. Visible background is the `.hero--mestia` CSS class (heroClass)
    // so the image-set ladder + `background-position: center center` apply;
    // HeroSection then omits its inline background. Distinct from the Ushguli
    // Svan-tower images and the Svaneti region page images — all kept.
    image: '/images/files/mestia-svan-tower-houses-svaneti-georgia-1541.webp',
    imageAvif: '/images/files/mestia-svan-tower-houses-svaneti-georgia-1541.avif',
    heroClass: 'hero--mestia',
    // Dedicated 1.91:1 social-share image (og:image / twitter:image).
    ogImage: { src: '/images/files/mestia-svan-tower-houses-svaneti-georgia-og.jpg', width: 1200, height: 630 },
    // Image SEO/AEO metadata (owner's own photo → brand credit, set by CityPage).
    // Hero is a CSS background (no <img alt>), so the localized alt lives here and
    // is emitted as the ImageObject caption + og:image:alt/twitter:image:alt per
    // locale. Verbatim from mestia-hero-image-package.md. width/height = 1541 rung.
    imageMeta: {
      width: 1541, height: 1020,
      name: 'Svan stone tower houses in Mestia with shingled roofs and a forested slope behind, Upper Svaneti, Georgia',
      description: 'Svan stone tower houses in Mestia, seen past a dry-stone wall in the foreground, with shingle-roofed dwellings attached at their base and a forested slope and river gorge behind. Mestia is the administrative centre of Mestia Municipality in Samegrelo-Zemo Svaneti, in the Greater Caucasus of Georgia (the country).',
      locationName: 'Mestia, Mestia Municipality, Samegrelo-Zemo Svaneti, Georgia',
      locality: 'Mestia', region: 'Samegrelo-Zemo Svaneti', country: 'GE',
      geo: { lat: 43.04556, lng: 42.72972 },
      alt: {
        en: 'Svan stone tower houses in Mestia with shingled roofs and a forested slope behind, Upper Svaneti, Georgia',
        de: 'Swanische Wehrtürme in Mestia mit Schindeldächern vor bewaldetem Hang, Oberswanetien, Georgien',
        fr: "Tours-maisons svanes à Mestia, toits de bardeaux et versant boisé à l'arrière, Haute-Svanétie, Géorgie",
        es: 'Torres-vivienda svanas en Mestia, con tejados de tablilla y ladera boscosa detrás, Alta Esvanetia, Georgia',
        nl: 'Svanetische woontorens in Mestia met houten daken en een beboste helling erachter, Boven-Svaneti, Georgië',
        cs: 'Svanské obytné věže v Mestii se šindelovými střechami a zalesněným svahem v pozadí, Horní Svanetie, Gruzie',
        pl: 'Swańskie wieże mieszkalne w Mestii z gontowymi dachami i zalesionym stokiem w tle, Górna Swanetia, Gruzja',
      },
    },
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
    seoKey: 'rustavi', contentKey: 'rustavi',
    // Cover/hero = our own Rustavi Fortress photo, replacing the generic
    // georgia-home.jpg placeholder. Rendered as the CSS-background hero via
    // HeroSection image-set (webp `image` + avif `imageAvif`); og:image/twitter
    // auto-derive from `image`. Native max width is 1448 (no upscale). Distinct
    // from the Rustavi Fortress PLACE page's own rustavi-fortress.jpg — both kept.
    image: '/images/files/rustavi-fortress-georgia-1448w.webp',
    imageAvif: '/images/files/rustavi-fortress-georgia-1448w.avif',
    // Contextual body photos (our own). The 4 non-hero images render as real
    // inline <figure> blocks embedded in the per-locale body HTML (pages.json),
    // matched to their descriptions. `imageObjects` feeds ONE ImageObject per
    // photo into the CityPage JSON-LD @graph (brand credit Hikasus Travel; the
    // cover is flagged hero → representativeOfPage). contentUrl uses the largest
    // shipped variant (`width`w). Region is Kvemo Kartli, locality Rustavi.
    // Verbatim from the image SEO package (REPLACE-BRAND → Hikasus Travel).
    imageObjects: [
      {
        base: 'rustavi-fortress-georgia', width: 1448, height: 1086, hero: true,
        name: 'Rustavi Fortress ruins, Kvemo Kartli, Georgia',
        caption: 'The stone ruins of Rustavi Fortress above the Mtkvari River',
        description: 'The cobblestone walls of Rustavi Fortress on the Mtkvari River, remains of the medieval city that flourished in the 12th–13th centuries and was destroyed in 1265, Kvemo Kartli, Georgia.',
        locationName: 'Rustavi Fortress', locality: 'Rustavi', region: 'Kvemo Kartli', geo: { lat: 41.5492, lng: 45.0069 },
      },
      {
        base: 'rustavi-metallurgical-plant-building-georgia', width: 1448, height: 1086,
        name: 'Rustavi Metallurgical Plant administrative building, Kvemo Kartli, Georgia',
        caption: 'The monumental Soviet-era administrative building of the Rustavi Metallurgical Plant',
        description: 'The monumental Soviet-era administrative building of the Rustavi Metallurgical Plant, with clock tower, colonnade and a sculpture group in front; the plant, begun in 1944, produced its first steel in 1950, Kvemo Kartli, Georgia.',
        locationName: 'Rustavi Metallurgical Plant', locality: 'Rustavi', region: 'Kvemo Kartli', geo: { lat: 41.5606, lng: 44.9908 },
      },
      {
        base: 'rustavi-street-art-mural-georgia', width: 1448, height: 1086,
        name: 'Street mural in Rustavi, Kvemo Kartli, Georgia',
        caption: 'A street mural of a bridge and snowy mountain between two faces on a concrete wall in Rustavi',
        description: 'A painted street mural on a concrete wall in Rustavi, showing a bridge and snow-capped mountain between two cartoon faces, Kvemo Kartli, Georgia.',
        locationName: 'Rustavi', locality: 'Rustavi', region: 'Kvemo Kartli', geo: { lat: 41.5495, lng: 44.9930 },
      },
      {
        base: 'rustavi-street-art-portrait-mural-georgia', width: 1448, height: 1086,
        name: 'Portrait street mural in Rustavi, Kvemo Kartli, Georgia',
        caption: "A street mural of a woman's face with lettering on a concrete wall in Rustavi",
        description: "A signed portrait street mural dated 2018 on a concrete wall in Rustavi, one of many along the city's Soviet-planned streets, Kvemo Kartli, Georgia.",
        locationName: 'Rustavi', locality: 'Rustavi', region: 'Kvemo Kartli', geo: { lat: 41.5495, lng: 44.9930 },
      },
      {
        base: 'rustavi-central-park-georgia', width: 1672, height: 941,
        name: 'Central park in Rustavi, Kvemo Kartli, Georgia',
        caption: 'A cypress-lined avenue hung with Georgian flags in the central park of Rustavi',
        description: 'A cypress-lined avenue strung with Georgian flags in the central park of Rustavi, Kvemo Kartli, Georgia.',
        locationName: 'Rustavi central park', locality: 'Rustavi', region: 'Kvemo Kartli', geo: { lat: 41.5495, lng: 44.9930 },
      },
    ],
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
    // Hero: real Alaverdi Cathedral (owner's own photo) via the .hero--alaverdi
    // image-set() ladder (styles.css). `image`/`imageAvif` = the 1448 top rung
    // (native 1448×1086, 4:3 — no crop); the CSS class controls the visible
    // background, and `image` feeds the ImageObject contentUrl. Ladder is
    // 768/1200/1448 — NO 640/1280/1600/2400 rung (would upscale past native).
    // Files live under /images/kakheti/ (per the image SEO package).
    image: '/images/kakheti/alaverdi-cathedral-georgia-1448.webp',
    imageAvif: '/images/kakheti/alaverdi-cathedral-georgia-1448.avif',
    heroClass: 'hero--alaverdi',
    // Dedicated 1.91:1 social-share image (og:image / twitter:image), .jpg default.
    ogImage: { src: '/images/kakheti/alaverdi-cathedral-georgia-og.jpg', width: 1200, height: 630 },
    // Image SEO/AEO metadata (owner's own photo → brand credit, set by SitePage).
    // Hero is a CSS background (no <img alt>), so the localized alt lives here and
    // is emitted as og:image:alt/twitter:image:alt per locale; the richer `caption`
    // map feeds the ImageObject caption. Verbatim from the image SEO package.
    // width/height = 1448 rung. Coordinates per package.
    imageMeta: {
      width: 1448, height: 1086,
      name: 'Alaverdi Cathedral, an 11th-century Georgian Orthodox church with a tall conical dome and stone defensive walls, before the Caucasus mountains in Kakheti, Georgia',
      description: 'Alaverdi Cathedral (Alaverdi Monastery), an 11th-century Georgian Orthodox cathedral built by King Kvirike III of Kakheti, with a tall conical dome rising over 50 metres and encircled by stone defensive walls. For centuries it was the tallest church in Georgia; it stands over the Alazani Valley against the Greater Caucasus in Kakheti, Georgia (the country).',
      locationName: 'Alaverdi Cathedral (Alaverdi Monastery), Kakheti, Georgia',
      region: 'Kakheti', country: 'GE',
      geo: { lat: 42.032497, lng: 45.377108 },
      alt: {
        en: 'Alaverdi Cathedral, an 11th-century Georgian Orthodox church with a tall conical dome and stone defensive walls, before the Caucasus mountains in Kakheti, Georgia',
        de: 'Kathedrale von Alaverdi, eine georgisch-orthodoxe Kirche aus dem 11. Jahrhundert mit hoher Kegelkuppel und steinernen Wehrmauern, vor dem Kaukasus in Kachetien, Georgien',
        fr: 'Cathédrale d\'Alaverdi, église orthodoxe géorgienne du XIᵉ siècle à haute coupole conique et murailles de pierre, devant les montagnes du Caucase en Kakhétie, Géorgie',
        es: 'Catedral de Alaverdi, iglesia ortodoxa georgiana del siglo XI con alta cúpula cónica y murallas de piedra, ante las montañas del Cáucaso en Kajetia, Georgia',
        nl: 'Kathedraal van Alaverdi, een 11e-eeuwse Georgisch-orthodoxe kerk met hoge kegelvormige koepel en stenen verdedigingsmuren, voor de Kaukasus in Kachetië, Georgië',
        cs: 'Katedrála Alaverdi, gruzínský pravoslavný kostel z 11. století s vysokou kuželovou kupolí a kamennými hradbami, před pohořím Kavkaz v Kachetii, Gruzie',
        pl: 'Katedra Alaverdi, gruziński prawosławny kościół z XI wieku z wysoką stożkową kopułą i kamiennymi murami obronnymi, na tle Kaukazu w Kachetii, Gruzja',
      },
      caption: {
        en: 'Alaverdi Cathedral in Kakheti — built in the 11th century by King Kvirike III, its 50-metre dome made it Georgia\'s tallest church for centuries, rising over the Alazani Valley against the Greater Caucasus.',
        de: 'Die Kathedrale von Alaverdi in Kachetien — im 11. Jahrhundert von König Kwirike III. erbaut; ihre 50 m hohe Kuppel machte sie jahrhundertelang zur höchsten Kirche Georgiens, über dem Alasani-Tal vor dem Großen Kaukasus.',
        fr: 'La cathédrale d\'Alaverdi en Kakhétie — édifiée au XIᵉ siècle par le roi Kvirike III, sa coupole de 50 m en fit longtemps la plus haute église de Géorgie, dominant la vallée de l\'Alazani face au Grand Caucase.',
        es: 'La catedral de Alaverdi en Kajetia — construida en el siglo XI por el rey Kvirike III, su cúpula de 50 m la convirtió durante siglos en la iglesia más alta de Georgia, sobre el valle del Alazani frente al Gran Cáucaso.',
        nl: 'De kathedraal van Alaverdi in Kachetië — in de 11e eeuw gebouwd door koning Kvirike III; haar 50 meter hoge koepel maakte haar eeuwenlang de hoogste kerk van Georgië, boven de Alazani-vallei tegen de Grote Kaukasus.',
        cs: 'Katedrála Alaverdi v Kachetii — postavená v 11. století králem Kvirikem III.; její 50metrová kupole z ní po staletí činila nejvyšší kostel Gruzie, tyčící se nad Alazanským údolím proti Velkému Kavkazu.',
        pl: 'Katedra Alaverdi w Kachetii — wzniesiona w XI wieku przez króla Kwirike III; jej 50-metrowa kopuła przez wieki czyniła ją najwyższym kościołem Gruzji, górując nad doliną Alazani na tle Wielkiego Kaukazu.',
      },
    },
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
    // Hero: real Alphabetic Tower (owner's own photo) via the .hero--alphabetic-
    // tower image-set() ladder (styles.css), replacing the reused generic Batumi.jpg
    // city photo. Native 4:3 (1448x1086), just under the usual 1600 rung, so the
    // ladder is exactly 768/1200/1448 with the top breakpoint at min-width:1200. NO
    // 1600/2400 rung, no upscale. The CSS class controls the visible background
    // (`background-position: center center`; open sky left = H1 zone; no scrim).
    // `image`/`imageAvif` = the 1448 top rung, feeding the ImageObject contentUrl.
    image: '/images/files/alphabetic-tower-batumi-georgia-1448.webp',
    imageAvif: '/images/files/alphabetic-tower-batumi-georgia-1448.avif',
    heroClass: 'hero--alphabetic-tower',
    // Dedicated 1.91:1 social-share image (og:image / twitter:image), .jpg default.
    ogImage: { src: '/images/files/alphabetic-tower-batumi-georgia-og.jpg', width: 1200, height: 630 },
    // Hero image SEO/AEO metadata (owner's own photo → brand credit, set by
    // SitePage). Hero is a CSS background (no <img alt>), so the localized alt lives
    // here and is emitted as og:image:alt/twitter:image:alt per locale; the `caption`
    // map feeds the hero ImageObject caption. Verbatim from alphabetic-tower-images-
    // package.md. width/height = 1448 rung; coordinates per package. First Batumi/
    // Adjara hero.
    imageMeta: {
      width: 1448, height: 1086,
      name: 'The Alphabetic Tower in Batumi, a steel double-helix tower carrying Georgian alphabet letters, topped by a glass sphere, Georgia',
      description: 'The Alphabetic Tower in Batumi, a 130-metre openwork steel tower whose two helical bands rise like a DNA strand carrying the 33 aluminium letters of the Georgian alphabet, crowned by a geodesic glass sphere, seen in evening light with a modern high-rise beside it. The tower stands in Miracle Park on the Batumi Boulevard, in the Adjara region of Georgia (the country).',
      locationName: 'Alphabetic Tower, Miracle Park, Batumi, Adjara, Georgia',
      locality: 'Batumi', region: 'Adjara', country: 'GE',
      geo: { lat: 41.65594, lng: 41.63944 },
      alt: {
        en: 'The Alphabetic Tower in Batumi, a steel double-helix tower carrying Georgian alphabet letters, topped by a glass sphere, Georgia',
        de: 'Der Alphabet-Turm in Batumi, ein stählerner Doppelhelix-Turm mit georgischen Buchstaben und einer Glaskugel an der Spitze, Georgien',
        fr: "La tour de l'Alphabet à Batoumi, tour d'acier en double hélice portant les lettres de l'alphabet géorgien, coiffée d'une sphère de verre, Géorgie",
        es: 'La Torre del Alfabeto en Batumi, una torre de acero en doble hélice con letras del alfabeto georgiano, coronada por una esfera de cristal, Georgia',
        nl: 'De Alfabettoren in Batoemi, een stalen dubbele-helixtoren met Georgische letters, bekroond door een glazen bol, Georgië',
        cs: 'Věž abecedy v Batumi, ocelová věž ve tvaru dvojité šroubovice s písmeny gruzínské abecedy, zakončená skleněnou koulí, Gruzie',
        pl: 'Wieża Alfabetu w Batumi, stalowa wieża w kształcie podwójnej helisy z literami gruzińskiego alfabetu, zwieńczona szklaną kulą, Gruzja',
      },
      caption: {
        en: 'The 130-metre Alphabetic Tower on Batumi Boulevard celebrates the Georgian script: two steel bands spiral up like a strand of DNA, carrying all 33 letters of the alphabet in four-metre aluminium. A glass sphere with a rotating restaurant and viewing deck crowns the top.',
        de: 'Der 130 Meter hohe Alphabet-Turm am Boulevard von Batumi feiert die georgische Schrift: Zwei Stahlbänder winden sich wie ein DNA-Strang empor und tragen alle 33 Buchstaben des Alphabets aus vier Meter hohem Aluminium. Eine Glaskugel mit Drehrestaurant und Aussichtsdeck krönt die Spitze.',
        fr: "La tour de l'Alphabet, haute de 130 mètres sur le boulevard de Batoumi, célèbre l'écriture géorgienne : deux bandes d'acier s'enroulent comme un brin d'ADN, portant les 33 lettres de l'alphabet en aluminium de quatre mètres. Une sphère de verre avec restaurant tournant et terrasse panoramique couronne le sommet.",
        es: 'La Torre del Alfabeto, de 130 metros, en el bulevar de Batumi celebra la escritura georgiana: dos bandas de acero se enroscan como una hebra de ADN portando las 33 letras del alfabeto en aluminio de cuatro metros. Una esfera de cristal con restaurante giratorio y mirador corona la cima.',
        nl: 'De 130 meter hoge Alfabettoren aan de boulevard van Batoemi eert het Georgische schrift: twee stalen banden winden zich omhoog als een DNA-streng en dragen alle 33 letters van het alfabet in vier meter hoog aluminium. Een glazen bol met draaiend restaurant en uitzichtdek bekroont de top.',
        cs: 'Stotřicetimetrová Věž abecedy na batumském bulváru oslavuje gruzínské písmo: dva ocelové pásy se vinou vzhůru jako vlákno DNA a nesou všech 33 písmen abecedy ze čtyřmetrového hliníku. Vrchol korunuje skleněná koule s otočnou restaurací a vyhlídkou.',
        pl: 'Licząca 130 metrów Wieża Alfabetu przy bulwarze w Batumi sławi gruzińskie pismo: dwie stalowe wstęgi wiją się w górę jak nić DNA, niosąc wszystkie 33 litery alfabetu z czterometrowego aluminium. Szczyt wieńczy szklana kula z obrotową restauracją i tarasem widokowym.',
      },
    },
    // One contextual inline body image (real <figure class="body-img body-img--
    // portrait"> in the per-locale body, placed at the end of each locale's "The
    // structure" section — the full base-to-sphere portrait complements the
    // structural description). Rendered via SitePage's inlineImageObjects @graph
    // map: stable @id (#inline-full-height), contentUrl at the 941 rung (portrait
    // ceiling; no `w` suffix), localized name (=alt) + caption, brand credit, NO
    // representativeOfPage (that's the hero's). Verbatim from the image package.
    inlineImageObjects: [
      {
        base: 'alphabetic-tower-full-height-batumi-georgia', width: 941, height: 1672, anchor: 'inline-full-height',
        description: "A full-height view of the Alphabetic Tower in Batumi from its base to the crowning glass sphere, the two helical steel bands lined with the aluminium letters of the Georgian alphabet against a clear sky, with street-level surroundings at the foot. The tower stands in Miracle Park on the Batumi Boulevard, in the Adjara region of Georgia (the country).",
        locationName: 'Alphabetic Tower, Miracle Park, Batumi, Adjara, Georgia',
        locality: 'Batumi', region: 'Adjara', geo: { lat: 41.65594, lng: 41.63944 },
        name: {
          en: 'Full view of the Alphabetic Tower in Batumi from base to glass sphere, its helix bands lined with Georgian letters, Georgia',
          de: 'Gesamtansicht des Alphabet-Turms in Batumi vom Fuß bis zur Glaskugel, die Helixbänder mit georgischen Buchstaben besetzt, Georgien',
          fr: "Vue complète de la tour de l'Alphabet à Batoumi, de la base à la sphère de verre, ses bandes hélicoïdales bordées de lettres géorgiennes, Géorgie",
          es: 'Vista completa de la Torre del Alfabeto en Batumi, desde la base hasta la esfera de cristal, con sus bandas helicoidales llenas de letras georgianas, Georgia',
          nl: 'Volledig zicht op de Alfabettoren in Batoemi van voet tot glazen bol, met helixbanden vol Georgische letters, Georgië',
          cs: 'Celkový pohled na Věž abecedy v Batumi od paty po skleněnou kouli, s šroubovicovými pásy plnými gruzínských písmen, Gruzie',
          pl: 'Pełny widok Wieży Alfabetu w Batumi od podstawy po szklaną kulę, z helisami pełnymi gruzińskich liter, Gruzja',
        },
        caption: {
          en: "Seen in full, the tower's DNA form is unmistakable — the designers' idea was that language is the genetic code of the Georgian nation, written here letter by letter into the structure itself.",
          de: 'In der Gesamtansicht ist die DNA-Form des Turms unverkennbar – die Idee der Entwerfer war, dass die Sprache der genetische Code der georgischen Nation ist, hier Buchstabe für Buchstabe in das Bauwerk selbst geschrieben.',
          fr: "Vue en entier, la forme d'ADN de la tour est incontestable : pour ses concepteurs, la langue est le code génétique de la nation géorgienne, inscrit ici lettre par lettre dans la structure même.",
          es: 'Vista por completo, la forma de ADN de la torre es inconfundible: la idea de sus diseñadores era que la lengua es el código genético de la nación georgiana, escrito aquí letra a letra en la propia estructura.',
          nl: 'In volle lengte is de DNA-vorm van de toren onmiskenbaar — het idee van de ontwerpers was dat taal de genetische code van de Georgische natie is, hier letter voor letter in het bouwwerk zelf geschreven.',
          cs: 'V celkovém pohledu je tvar DNA věže nezaměnitelný – myšlenkou návrhářů bylo, že jazyk je genetickým kódem gruzínského národa, zde vepsaným písmeno po písmenu do samotné stavby.',
          pl: 'Widziana w całości, forma DNA wieży jest nie do pomylenia — ideą projektantów było, że język to kod genetyczny gruzińskiego narodu, zapisany tu litera po literze w samej konstrukcji.',
        },
      },
    ],
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
    // Hero = owner's own Narikala gate-view photo (landscape, native 1537 →
    // variants capped at 1537; NO 1600/2400 variant), replacing the generic
    // georgia-home.jpg placeholder. Native ceiling 1537 (BELOW the usual 1600
    // rung) → ladder 768/1200/1537 only, ImageObject contentUrl at the 1537 rung.
    // Visible background is the `.hero--narikala` CSS class (heroClass below) so
    // the image-set ladder + `background-position: center center` apply;
    // HeroSection then omits its inline background. Slug scoped to the GATE view
    // (`-gate-`) on purpose — a Tbilisi Old Town / things-to-do page may later
    // want a different Narikala shot (panorama, cable car); NOT genericised, and
    // distinct from the `narikala-fortress-tbilisi-georgia` inline image on the
    // Tbilisi city page. Region is Tbilisi (Sololaki ridge), NOT any other region.
    image: '/images/files/narikala-fortress-gate-tbilisi-georgia-1537.webp',
    imageAvif: '/images/files/narikala-fortress-gate-tbilisi-georgia-1537.avif',
    heroClass: 'hero--narikala',
    // Dedicated 1.91:1 social-share image (og:image / twitter:image) — the safe
    // .jpg default for scrapers.
    ogImage: { src: '/images/files/narikala-fortress-gate-tbilisi-georgia-og.jpg', width: 1200, height: 630 },
    // Image SEO/AEO metadata (owner's own photo → brand credit, set by SitePage).
    // Hero is a CSS background (no <img alt>), so the localized alt lives here and
    // is emitted as the ImageObject caption + og:image:alt/twitter:image:alt per
    // locale. Verbatim from narikala-fortress-hero-image-package.md. width/height
    // = 1537 rung. Coordinates approximate per package (verify if leaning on them).
    imageMeta: {
      width: 1537, height: 1023,
      name: 'Cobbled ramp up to the stone gate of Narikala Fortress with St Nicholas Church behind, Tbilisi, Georgia',
      description: "A cobbled ramp lined with ornamental lamp posts leads up to the stone gatehouse of Narikala Fortress, with the fortress's stone-and-brick walls and the conical dome of St Nicholas Church rising on the Sololaki ridge behind. Narikala stands above the Old Town of Tbilisi, the capital of Georgia (the country).",
      locationName: 'Narikala Fortress, Sololaki ridge, Tbilisi, Georgia',
      locality: 'Tbilisi', region: 'Tbilisi', country: 'GE',
      geo: { lat: 41.6875, lng: 44.8090 },
      alt: {
        en: 'Cobbled ramp up to the stone gate of Narikala Fortress with St Nicholas Church behind, Tbilisi, Georgia',
        de: 'Gepflasterte Rampe zum Steintor der Festung Narikala, dahinter die Nikolaikirche, Tiflis, Georgien',
        fr: "Rampe pavée menant à la porte en pierre de la forteresse de Narikala, l'église Saint-Nicolas derrière, Tbilissi, Géorgie",
        es: 'Rampa empedrada hasta la puerta de piedra de la fortaleza de Narikala, con la iglesia de San Nicolás detrás, Tiflis, Georgia',
        nl: 'Geplaveide oprit naar de stenen poort van de Narikala-vesting, met de Sint-Nicolaaskerk erachter, Tbilisi, Georgië',
        cs: 'Dlážděná rampa k kamenné bráně pevnosti Narikala, za ní kostel svatého Mikuláše, Tbilisi, Gruzie',
        pl: 'Brukowany podjazd do kamiennej bramy twierdzy Narikala, za nią cerkiew św. Mikołaja, Tbilisi, Gruzja',
      },
    },
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
    // Hero: real Holy Trinity Cathedral / Sameba (owner's own photo) via the
    // .hero--sameba image-set() ladder (styles.css), replacing the georgia-home.jpg
    // placeholder. `image`/`imageAvif` = the 1600 top rung (native 1672x941, 16:9;
    // 1672 dropped as redundant with 1600). Ladder 768/1200/1600 — NO 1672/2400
    // rung. The CSS class controls the visible background with `background-position:
    // center center`. `image` feeds the ImageObject contentUrl (1600 rung).
    image: '/images/files/sameba-holy-trinity-cathedral-tbilisi-georgia-1600.webp',
    imageAvif: '/images/files/sameba-holy-trinity-cathedral-tbilisi-georgia-1600.avif',
    heroClass: 'hero--sameba',
    // Dedicated 1.91:1 social-share image (og:image / twitter:image), .jpg default.
    ogImage: { src: '/images/files/sameba-holy-trinity-cathedral-tbilisi-georgia-og.jpg', width: 1200, height: 630 },
    // Hero image SEO/AEO metadata (owner's own photo → brand credit, set by
    // SitePage). Hero is a CSS background (no <img alt>), so the localized alt lives
    // here and is emitted as og:image:alt/twitter:image:alt per locale; the `caption`
    // map feeds the hero ImageObject caption. Verbatim from sameba-cathedral-images-
    // package.md. width/height = 1600 rung; coordinates per package (Elia Hill/
    // Avlabari — distinct from Narikala/Kartlis Deda across the river on Sololaki).
    imageMeta: {
      width: 1600, height: 900,
      name: 'The Holy Trinity Cathedral (Sameba) in Tbilisi, a large tiered stone church with a gilded dome, under dramatic clouds, Georgia',
      description: 'The Holy Trinity Cathedral of Tbilisi, known as Sameba, a large modern cross-dome cathedral of pale stone rising in tiers to a gilded central dome and cross, seen from the plaza under a dramatic cloudy sky. Consecrated in 2004, it stands on Elia Hill in the Avlabari district of Tbilisi, capital of Georgia (the country).',
      locationName: 'Holy Trinity Cathedral (Sameba), Elia Hill, Avlabari, Tbilisi, Georgia',
      locality: 'Tbilisi', region: 'Tbilisi', country: 'GE',
      geo: { lat: 41.6975, lng: 44.8171 },
      alt: {
        en: 'The Holy Trinity Cathedral (Sameba) in Tbilisi, a large tiered stone church with a gilded dome, under dramatic clouds, Georgia',
        de: 'Die Dreifaltigkeitskathedrale (Sameba) in Tiflis, eine große gestufte Steinkirche mit vergoldeter Kuppel, unter dramatischen Wolken, Georgien',
        fr: "La cathédrale de la Sainte-Trinité (Sameba) à Tbilissi, grande église de pierre à étages coiffée d'une coupole dorée, sous des nuages spectaculaires, Géorgie",
        es: 'La catedral de la Santísima Trinidad (Sameba) en Tiflis, una gran iglesia de piedra escalonada con cúpula dorada, bajo nubes espectaculares, Georgia',
        nl: 'De Heilige-Drie-eenheidskathedraal (Sameba) in Tbilisi, een grote getrapte stenen kerk met een vergulde koepel, onder dramatische wolken, Georgië',
        cs: 'Katedrála Nejsvětější Trojice (Sameba) v Tbilisi, velký stupňovitý kamenný chrám se zlacenou kupolí, pod dramatickými mraky, Gruzie',
        pl: 'Katedra Trójcy Świętej (Sameba) w Tbilisi, wielki schodkowy kamienny kościół ze złoconą kopułą, pod dramatycznymi chmurami, Gruzja',
      },
      caption: {
        en: 'Sameba, the Holy Trinity Cathedral, was built between 1995 and 2004 on Elia Hill above Avlabari. The third-tallest Orthodox cathedral in the world, its gilded dome and cross are visible across the city.',
        de: 'Sameba, die Dreifaltigkeitskathedrale, wurde zwischen 1995 und 2004 auf dem Elia-Hügel über Awlabari erbaut. Als dritthöchste orthodoxe Kathedrale der Welt sind ihre vergoldete Kuppel und ihr Kreuz in der ganzen Stadt zu sehen.',
        fr: "Sameba, la cathédrale de la Sainte-Trinité, fut bâtie entre 1995 et 2004 sur la colline d'Elia, au-dessus d'Avlabari. Troisième plus haute cathédrale orthodoxe du monde, sa coupole et sa croix dorées se voient de toute la ville.",
        es: 'Sameba, la catedral de la Santísima Trinidad, se construyó entre 1995 y 2004 en la colina de Elia, sobre Avlabari. Tercera catedral ortodoxa más alta del mundo, su cúpula y su cruz doradas se ven desde toda la ciudad.',
        nl: 'Sameba, de Heilige-Drie-eenheidskathedraal, werd tussen 1995 en 2004 gebouwd op de Elia-heuvel boven Avlabari. Als op twee na hoogste orthodoxe kathedraal ter wereld zijn haar vergulde koepel en kruis in de hele stad te zien.',
        cs: 'Sameba, katedrála Nejsvětější Trojice, byla postavena v letech 1995–2004 na kopci Elia nad Avlabari. Jako třetí nejvyšší pravoslavná katedrála na světě jsou její zlacená kupole a kříž vidět z celého města.',
        pl: 'Sameba, katedra Trójcy Świętej, powstała w latach 1995–2004 na wzgórzu Elia nad Avlabari. Jako trzecia najwyższa cerkiew prawosławna na świecie, jej złocona kopuła i krzyż są widoczne z całego miasta.',
      },
    },
    // Two contextual inline body images (real <figure> in the per-locale body):
    // (1) blue-hour landscape after the "A landmark…" section, (2) portrait facade
    // after the "Architecture and exterior" section. Rendered via SitePage's
    // inlineImageObjects @graph map: stable @id (#inline-blue-hour / #inline-facade),
    // contentUrl at each image's top rung (no `w` suffix), localized name (=alt) +
    // caption, brand credit, NO representativeOfPage (that's the hero's). Verbatim
    // from sameba-cathedral-images-package.md.
    inlineImageObjects: [
      {
        base: 'sameba-cathedral-blue-hour-tbilisi-georgia', width: 1600, height: 900, anchor: 'inline-blue-hour',
        description: 'A blue-hour view of the floodlit Holy Trinity Cathedral of Tbilisi, its lit stone facade and gilded dome glowing above a lamplit plaza lined with carved stone crosses, on Elia Hill in the Avlabari district of Tbilisi, capital of Georgia (the country).',
        locationName: 'Holy Trinity Cathedral (Sameba), Elia Hill, Avlabari, Tbilisi, Georgia',
        locality: 'Tbilisi', region: 'Tbilisi', geo: { lat: 41.6975, lng: 44.8171 },
        name: {
          en: 'The floodlit Holy Trinity Cathedral of Tbilisi at blue hour, with its lamplit plaza and stone crosses, Georgia',
          de: 'Die angestrahlte Dreifaltigkeitskathedrale von Tiflis zur blauen Stunde, mit beleuchtetem Vorplatz und Steinkreuzen, Georgien',
          fr: "La cathédrale de la Sainte-Trinité de Tbilissi illuminée à l'heure bleue, avec son parvis éclairé et ses croix de pierre, Géorgie",
          es: 'La catedral de la Santísima Trinidad de Tiflis iluminada a la hora azul, con su explanada alumbrada y cruces de piedra, Georgia',
          nl: 'De aangelichte Heilige-Drie-eenheidskathedraal van Tbilisi tijdens het blauwe uur, met verlicht plein en stenen kruisen, Georgië',
          cs: 'Nasvícená katedrála Nejsvětější Trojice v Tbilisi za modré hodiny, s osvětleným náměstím a kamennými kříži, Gruzie',
          pl: 'Podświetlona katedra Trójcy Świętej w Tbilisi o niebieskiej godzinie, z oświetlonym placem i kamiennymi krzyżami, Gruzja',
        },
        caption: {
          en: 'At dusk the cathedral and its avenue of carved stone crosses are floodlit, and the gilded dome glows above Avlabari.',
          de: 'In der Dämmerung werden die Kathedrale und ihre Allee gemeißelter Steinkreuze angestrahlt, und die vergoldete Kuppel leuchtet über Awlabari.',
          fr: "Au crépuscule, la cathédrale et son allée de croix de pierre sculptées sont illuminées, et la coupole dorée rayonne au-dessus d'Avlabari.",
          es: 'Al anochecer, la catedral y su avenida de cruces de piedra talladas se iluminan, y la cúpula dorada brilla sobre Avlabari.',
          nl: 'Bij schemering worden de kathedraal en haar laan met gebeeldhouwde stenen kruisen aangelicht, en gloeit de vergulde koepel boven Avlabari.',
          cs: 'Za soumraku jsou katedrála a její alej tesaných kamenných křížů nasvíceny a zlacená kupole září nad Avlabari.',
          pl: 'O zmierzchu katedra i jej aleja rzeźbionych kamiennych krzyży są podświetlone, a złocona kopuła jaśnieje nad Avlabari.',
        },
      },
      {
        base: 'sameba-cathedral-facade-tbilisi-georgia', width: 1024, height: 1536, anchor: 'inline-facade',
        description: 'The main west facade of the Holy Trinity Cathedral of Tbilisi seen from below, rising in receding tiers of arches toward the gilded central dome and cross, on Elia Hill in the Avlabari district of Tbilisi, capital of Georgia (the country).',
        locationName: 'Holy Trinity Cathedral (Sameba), Elia Hill, Avlabari, Tbilisi, Georgia',
        locality: 'Tbilisi', region: 'Tbilisi', geo: { lat: 41.6975, lng: 44.8171 },
        name: {
          en: 'The main facade of the Holy Trinity Cathedral of Tbilisi seen from below, rising in tiers to its gilded dome, Georgia',
          de: 'Die Hauptfassade der Dreifaltigkeitskathedrale von Tiflis von unten gesehen, in Stufen zur vergoldeten Kuppel aufsteigend, Georgien',
          fr: "La façade principale de la cathédrale de la Sainte-Trinité de Tbilissi vue d'en bas, s'élevant en étages vers sa coupole dorée, Géorgie",
          es: 'La fachada principal de la catedral de la Santísima Trinidad de Tiflis vista desde abajo, ascendiendo en niveles hasta su cúpula dorada, Georgia',
          nl: 'De hoofdgevel van de Heilige-Drie-eenheidskathedraal van Tbilisi van onderaf gezien, in trappen oplopend naar de vergulde koepel, Georgië',
          cs: 'Hlavní průčelí katedrály Nejsvětější Trojice v Tbilisi při pohledu zdola, stupňovitě se zvedající k zlacené kupoli, Gruzie',
          pl: 'Główna fasada katedry Trójcy Świętej w Tbilisi widziana z dołu, wznosząca się stopniowo ku złoconej kopule, Gruzja',
        },
        caption: {
          en: "The west front rises in receding tiers of arches toward the dome — the cathedral's design emphasises height, drawing the eye upward to the gilded cupola and cross.",
          de: 'Die Westfront steigt in zurückweichenden Bogenstufen zur Kuppel auf – der Bau betont die Höhe und lenkt den Blick hinauf zur vergoldeten Kuppel und zum Kreuz.',
          fr: "La façade ouest s'élève en gradins d'arcs successifs vers la coupole : l'édifice met l'accent sur la hauteur, attirant le regard vers la coupole et la croix dorées.",
          es: 'La fachada oeste se eleva en niveles escalonados de arcos hacia la cúpula: el diseño enfatiza la altura y dirige la mirada hacia la cúpula y la cruz doradas.',
          nl: 'De westgevel stijgt in terugwijkende boogtrappen naar de koepel — het ontwerp benadrukt hoogte en trekt de blik omhoog naar de vergulde koepel en het kruis.',
          cs: 'Západní průčelí se zvedá v ustupujících stupních oblouků ke kupoli – stavba zdůrazňuje výšku a vede pohled vzhůru ke zlacené kupoli a kříži.',
          pl: 'Fasada zachodnia wznosi się cofającymi się kondygnacjami łuków ku kopule — bryła podkreśla wysokość, kierując wzrok ku złoconej kopule i krzyżowi.',
        },
      },
    ],
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
    // Hero: real Kartlis Deda / Mother of Georgia statue (owner's own drone photo)
    // via the .hero--kartlis-deda image-set() ladder (styles.css), replacing the
    // georgia-home.jpg placeholder. `image`/`imageAvif` = the 1448 top rung (native
    // 1448x1086, 4:3 — no crop); the CSS class controls the visible background with
    // the deliberate `background-position: center 40%` (statue is tall). Ladder is
    // 768/1200/1448 — NO 1600/2400 rung. `image` feeds the ImageObject contentUrl.
    image: '/images/files/kartlis-deda-statue-tbilisi-georgia-1448.webp',
    imageAvif: '/images/files/kartlis-deda-statue-tbilisi-georgia-1448.avif',
    heroClass: 'hero--kartlis-deda',
    // Dedicated 1.91:1 social-share image (og:image / twitter:image), .jpg default.
    ogImage: { src: '/images/files/kartlis-deda-statue-tbilisi-georgia-og.jpg', width: 1200, height: 630 },
    // Hero image SEO/AEO metadata (owner's own photo → brand credit, set by
    // SitePage). Hero is a CSS background (no <img alt>), so the localized alt lives
    // here and is emitted as og:image:alt/twitter:image:alt per locale; the `caption`
    // map feeds the hero ImageObject caption. Verbatim from kartlis-deda-hero-package.md.
    // width/height = 1448 rung; coordinates per package (distinct from Narikala's).
    imageMeta: {
      width: 1448, height: 1086,
      name: 'The Kartlis Deda (Mother of Georgia) aluminium statue on Sololaki Hill, holding a bowl of wine and a sword, Tbilisi, Georgia',
      description: 'The Kartlis Deda (Mother of Georgia) monument on Sololaki Hill above Tbilisi, a 20-metre aluminium statue of a woman in Georgian national dress holding a bowl of wine in her left hand and a sword in her right, seen in warm evening light above the wooded hillside. Erected in 1958 by sculptor Elguja Amashukeli, it overlooks the Old Town of Tbilisi, capital of Georgia (the country).',
      locationName: 'Kartlis Deda, Sololaki Hill, Tbilisi, Georgia',
      locality: 'Tbilisi', region: 'Tbilisi', country: 'GE',
      geo: { lat: 41.688056, lng: 44.804583 },
      alt: {
        en: 'The Kartlis Deda (Mother of Georgia) aluminium statue on Sololaki Hill, holding a bowl of wine and a sword, Tbilisi, Georgia',
        de: 'Die Aluminiumstatue Kartlis Deda (Mutter Georgiens) auf dem Sololaki-Hügel, mit Weinschale und Schwert, Tiflis, Georgien',
        fr: 'La statue en aluminium Kartlis Deda (Mère de la Géorgie) sur la colline de Sololaki, tenant une coupe de vin et une épée, Tbilissi, Géorgie',
        es: 'La estatua de aluminio Kartlis Deda (Madre de Georgia) en la colina de Sololaki, con un cuenco de vino y una espada, Tiflis, Georgia',
        nl: 'Het aluminium standbeeld Kartlis Deda (Moeder van Georgië) op de Sololaki-heuvel, met een schaal wijn en een zwaard, Tbilisi, Georgië',
        cs: 'Hliníková socha Kartlis Deda (Matka Gruzie) na kopci Sololaki, s miskou vína a mečem, Tbilisi, Gruzie',
        pl: 'Aluminiowy pomnik Kartlis Deda (Matka Gruzji) na wzgórzu Sololaki, z czarą wina i mieczem, Tbilisi, Gruzja',
      },
      caption: {
        en: "Kartlis Deda, the Mother of Georgia, was raised on Sololaki Hill in 1958 for Tbilisi's 1,500th anniversary. The 20-metre aluminium figure by Elguja Amashukeli holds a bowl of wine for friends in one hand and a sword for enemies in the other.",
        de: 'Kartlis Deda, die Mutter Georgiens, wurde 1958 zum 1500-jährigen Jubiläum von Tiflis auf dem Sololaki-Hügel errichtet. Die 20 Meter hohe Aluminiumfigur von Elguja Amaschukeli hält in der einen Hand eine Weinschale für Freunde und in der anderen ein Schwert für Feinde.',
        fr: "Kartlis Deda, la Mère de la Géorgie, fut érigée sur la colline de Sololaki en 1958 pour le 1500e anniversaire de Tbilissi. La figure en aluminium de 20 mètres d'Elguja Amachoukeli tient d'une main une coupe de vin pour les amis et de l'autre une épée pour les ennemis.",
        es: 'Kartlis Deda, la Madre de Georgia, se erigió en la colina de Sololaki en 1958 por el 1500 aniversario de Tiflis. La figura de aluminio de 20 metros de Elguja Amashukeli sostiene en una mano un cuenco de vino para los amigos y en la otra una espada para los enemigos.',
        nl: 'Kartlis Deda, de Moeder van Georgië, werd in 1958 op de Sololaki-heuvel opgericht voor het 1500-jarig bestaan van Tbilisi. Het 20 meter hoge aluminium beeld van Elguja Amasjoekeli houdt in de ene hand een schaal wijn voor vrienden en in de andere een zwaard voor vijanden.',
        cs: 'Kartlis Deda, Matka Gruzie, byla na kopci Sololaki vztyčena roku 1958 k 1500. výročí Tbilisi. Dvacetimetrová hliníková socha od Elgudži Amašukeliho drží v jedné ruce misku vína pro přátele a ve druhé meč pro nepřátele.',
        pl: 'Kartlis Deda, Matkę Gruzji, wzniesiono na wzgórzu Sololaki w 1958 roku z okazji 1500-lecia Tbilisi. Dwudziestometrowa aluminiowa figura autorstwa Elguji Amaszukeli trzyma w jednej ręce czarę wina dla przyjaciół, a w drugiej miecz dla wrogów.',
      },
    },
    // One contextual inline body image (real <figure class="body-img"> in the
    // per-locale body, placed right after each locale's "The symbolism" paragraph).
    // Rendered via SitePage's inlineImageObjects @graph map: stable @id
    // (#inline-bowl-sword), contentUrl at the 1600 rung (no `w` suffix), localized
    // name (=alt) + caption, brand credit, NO representativeOfPage (that's the
    // hero's). Verbatim from kartlis-deda-inline-package.md.
    inlineImageObjects: [
      {
        base: 'kartlis-deda-bowl-and-sword-tbilisi-georgia', width: 1600, height: 900, anchor: 'inline-bowl-sword',
        description: "A close-up of the Kartlis Deda (Mother of Georgia) statue on Sololaki Hill against a clear blue sky, showing the aluminium figure's crowned head, the bowl of wine raised in her left hand and the sword held across her body in her right hand. The monument stands above Tbilisi, capital of Georgia (the country).",
        locationName: 'Kartlis Deda, Sololaki Hill, Tbilisi, Georgia',
        locality: 'Tbilisi', region: 'Tbilisi', geo: { lat: 41.688056, lng: 44.804583 },
        name: {
          en: 'Close-up of the Kartlis Deda statue against a blue sky, holding a bowl of wine in her left hand and a sword in her right, Tbilisi, Georgia',
          de: 'Nahaufnahme der Statue Kartlis Deda vor blauem Himmel, mit einer Weinschale in der linken und einem Schwert in der rechten Hand, Tiflis, Georgien',
          fr: 'Gros plan de la statue Kartlis Deda sur ciel bleu, tenant une coupe de vin dans la main gauche et une épée dans la droite, Tbilissi, Géorgie',
          es: 'Primer plano de la estatua Kartlis Deda contra un cielo azul, con un cuenco de vino en la mano izquierda y una espada en la derecha, Tiflis, Georgia',
          nl: 'Close-up van het standbeeld Kartlis Deda tegen een blauwe lucht, met een schaal wijn in de linkerhand en een zwaard in de rechter, Tbilisi, Georgië',
          cs: 'Detail sochy Kartlis Deda proti modré obloze, s miskou vína v levé ruce a mečem v pravé, Tbilisi, Gruzie',
          pl: 'Zbliżenie pomnika Kartlis Deda na tle błękitnego nieba, z czarą wina w lewej dłoni i mieczem w prawej, Tbilisi, Gruzja',
        },
        caption: {
          en: 'The two objects Kartlis Deda holds sum up her meaning: a bowl of wine for those who come as friends, and a sword for those who come as enemies.',
          de: 'Die beiden Gegenstände in den Händen von Kartlis Deda fassen ihre Bedeutung zusammen: eine Weinschale für alle, die als Freunde kommen, und ein Schwert für alle, die als Feinde kommen.',
          fr: "Les deux objets que tient Kartlis Deda résument son sens : une coupe de vin pour ceux qui viennent en amis, et une épée pour ceux qui viennent en ennemis.",
          es: 'Los dos objetos que sostiene Kartlis Deda resumen su significado: un cuenco de vino para quienes vienen como amigos y una espada para quienes vienen como enemigos.',
          nl: 'De twee voorwerpen die Kartlis Deda vasthoudt vatten haar betekenis samen: een schaal wijn voor wie als vriend komt, en een zwaard voor wie als vijand komt.',
          cs: 'Dva předměty, které Kartlis Deda drží, vystihují její smysl: miska vína pro ty, kdo přicházejí jako přátelé, a meč pro ty, kdo přicházejí jako nepřátelé.',
          pl: 'Dwa przedmioty, które trzyma Kartlis Deda, streszczają jej znaczenie: czara wina dla tych, którzy przychodzą jako przyjaciele, i miecz dla tych, którzy przychodzą jako wrogowie.',
        },
      },
    ],
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
    // Hero: real Bridge of Peace (owner's own photo) via the .hero--bridge-of-peace
    // image-set() ladder (styles.css), replacing the georgia-home.jpg placeholder.
    // First FULL 4-rung ladder (native 4096x2730, 3:2): 768/1200/1600/2400, top
    // breakpoint at min-width:1600 → 2400 rung. NO native-4096 rung, NO upscale.
    // The CSS class controls the visible background (`background-position: center
    // center`, no scrim). `image`/`imageAvif` = the 2400 top rung, feeding the
    // ImageObject contentUrl (2400) + the og fallback reference.
    image: '/images/files/bridge-of-peace-tbilisi-georgia-2400.webp',
    imageAvif: '/images/files/bridge-of-peace-tbilisi-georgia-2400.avif',
    heroClass: 'hero--bridge-of-peace',
    // Dedicated 1.91:1 social-share image (og:image / twitter:image), .jpg default.
    ogImage: { src: '/images/files/bridge-of-peace-tbilisi-georgia-og.jpg', width: 1200, height: 630 },
    // Hero image SEO/AEO metadata (owner's own photo → brand credit, set by
    // SitePage). Hero is a CSS background (no <img alt>), so the localized alt lives
    // here and is emitted as og:image:alt/twitter:image:alt per locale; the `caption`
    // map feeds the hero ImageObject caption. Verbatim from bridge-of-peace-hero-
    // package.md. width/height = 2400 rung; coordinates per package (the bridge over
    // the Mtkvari — distinct from the other Tbilisi pages).
    imageMeta: {
      width: 2400, height: 1600,
      name: 'The Bridge of Peace, a curved glass-and-steel pedestrian bridge over the Mtkvari, with the Tbilisi skyline behind, Georgia',
      description: 'The Bridge of Peace in Tbilisi, a bow-shaped pedestrian bridge with an undulating steel-and-glass canopy spanning the Mtkvari River between Rike Park and the Old Town, with the landscaped park in the foreground and the city skyline, including a modern glass tower, behind. Designed by Michele De Lucchi and opened in 2010, it stands in central Tbilisi, capital of Georgia (the country).',
      locationName: 'Bridge of Peace, Mtkvari River, Tbilisi, Georgia',
      locality: 'Tbilisi', region: 'Tbilisi', country: 'GE',
      geo: { lat: 41.6929, lng: 44.8082 },
      alt: {
        en: 'The Bridge of Peace, a curved glass-and-steel pedestrian bridge over the Mtkvari, with the Tbilisi skyline behind, Georgia',
        de: 'Die Friedensbrücke, eine geschwungene Fußgängerbrücke aus Glas und Stahl über die Mtkwari, mit der Skyline von Tiflis dahinter, Georgien',
        fr: 'Le pont de la Paix, passerelle piétonne courbe en verre et acier au-dessus de la Mtkvari, avec la silhouette de Tbilissi en arrière-plan, Géorgie',
        es: 'El puente de la Paz, una pasarela peatonal curva de vidrio y acero sobre el Mtkvari, con el perfil urbano de Tiflis detrás, Georgia',
        nl: 'De Vredesbrug, een gebogen voetgangersbrug van glas en staal over de Mtkvari, met de skyline van Tbilisi erachter, Georgië',
        cs: 'Most míru, zakřivená pěší lávka ze skla a oceli přes Mtkvari, s panoramatem Tbilisi v pozadí, Gruzie',
        pl: 'Most Pokoju, wygięta kładka piesza ze szkła i stali nad Mtkwari, z panoramą Tbilisi w tle, Gruzja',
      },
      caption: {
        en: 'The Bridge of Peace, designed by Italian architect Michele De Lucchi and opened in 2010, links Rike Park with the Old Town across the Mtkvari. Its glass canopy carries thousands of LEDs that light up in the evening.',
        de: 'Die Friedensbrücke, entworfen vom italienischen Architekten Michele De Lucchi und 2010 eröffnet, verbindet den Rike-Park über die Mtkwari mit der Altstadt. Ihr Glasdach trägt Tausende LEDs, die abends aufleuchten.',
        fr: "Le pont de la Paix, conçu par l'architecte italien Michele De Lucchi et inauguré en 2010, relie le parc Rike à la vieille ville par-dessus la Mtkvari. Sa verrière porte des milliers de LED qui s'illuminent le soir.",
        es: 'El puente de la Paz, diseñado por el arquitecto italiano Michele De Lucchi e inaugurado en 2010, une el parque Rike con el casco antiguo sobre el Mtkvari. Su cubierta de vidrio lleva miles de LED que se encienden al anochecer.',
        nl: "De Vredesbrug, ontworpen door de Italiaanse architect Michele De Lucchi en geopend in 2010, verbindt het Rike-park over de Mtkvari met de oude stad. Haar glazen kap draagt duizenden leds die 's avonds oplichten.",
        cs: 'Most míru, navržený italským architektem Michelem De Lucchim a otevřený v roce 2010, spojuje park Rike se Starým Městem přes řeku Mtkvari. Jeho skleněné zastřešení nese tisíce LED, které se večer rozzáří.',
        pl: 'Most Pokoju, zaprojektowany przez włoskiego architekta Michele De Lucchiego i otwarty w 2010 roku, łączy park Rike ze Starym Miastem nad Mtkwari. Jego szklane zadaszenie kryje tysiące diod LED, które rozświetlają się wieczorem.',
      },
    },
  },
  {
    slug: 'chronicles-of-georgia', name: 'The Chronicles of Georgia',
    parentType: 'city', parent: 'tbilisi', published: true,
    seoKey: 'chroniclesOfGeorgia', contentKey: 'chroniclesOfGeorgia',
    // Hero = owner's own drone photo of the Chronicles of Georgia monument,
    // replacing the generic georgia-home.jpg placeholder. Landscape 4:3, native
    // 1448 (BELOW the usual 1600 rung) → hero ladder is 768/1200/1448 only; NO
    // 1600/2400 variant is generated or referenced, and the ImageObject contentUrl
    // points at the 1448 rung. Visible background is the `.hero--chronicles` CSS
    // class (heroClass below) so the image-set ladder + `background-position:
    // center center` apply; HeroSection then omits its inline background. Region is
    // Tbilisi (Keeni Hill, above the Tbilisi Sea), NOT any other region.
    image: '/images/files/chronicles-of-georgia-monument-tbilisi-georgia-1448.webp',
    imageAvif: '/images/files/chronicles-of-georgia-monument-tbilisi-georgia-1448.avif',
    heroClass: 'hero--chronicles',
    // Dedicated 1.91:1 social-share image (og:image / twitter:image).
    ogImage: { src: '/images/files/chronicles-of-georgia-monument-tbilisi-georgia-og.jpg', width: 1200, height: 630 },
    // Image SEO/AEO metadata (owner's own drone photo → brand credit, set by
    // SitePage). Hero is a CSS background (no <img alt>), so the localized alt lives
    // here and is emitted as the ImageObject caption + og:image:alt/twitter:image:alt
    // per locale. Verbatim from chronicles-of-georgia-hero-image-package.md.
    // width/height = 1448 rung. Coordinates from Wikipedia infobox (well-sourced).
    imageMeta: {
      width: 1448, height: 1086,
      name: 'The Chronicles of Georgia monument, giant relief-covered pillars above the Tbilisi Sea, Tbilisi, Georgia',
      description: 'An aerial view of the Chronicles of Georgia (History Memorial of Georgia), a monumental ensemble of sixteen towering pillars covered in bronze and copper reliefs on Keeni Hill above the Tbilisi Sea, with a paved plaza, a monumental staircase and a small chapel on the grounds. Created by Zurab Tsereteli from 1985, it stands on the northern edge of Tbilisi, the capital of Georgia (the country).',
      locationName: 'Chronicles of Georgia, Keeni Hill, Tbilisi, Georgia',
      locality: 'Tbilisi', region: 'Tbilisi', country: 'GE',
      geo: { lat: 41.770503, lng: 44.810438 },
      alt: {
        en: 'The Chronicles of Georgia monument, giant relief-covered pillars above the Tbilisi Sea, Tbilisi, Georgia',
        de: 'Das Denkmal Chronik Georgiens, riesige reliefverzierte Säulen über dem Tifliser Meer, Tiflis, Georgien',
        fr: 'Le monument des Chroniques de Géorgie, piliers géants couverts de reliefs au-dessus de la mer de Tbilissi, Tbilissi, Géorgie',
        es: 'El monumento Crónicas de Georgia, pilares gigantes cubiertos de relieves sobre el mar de Tiflis, Tiflis, Georgia',
        nl: 'Het monument Kronieken van Georgië, reusachtige met reliëfs bedekte pijlers boven de Tbilisi-zee, Tbilisi, Georgië',
        cs: 'Památník Kroniky Gruzie, obří sloupy pokryté reliéfy nad Tbiliským mořem, Tbilisi, Gruzie',
        pl: 'Pomnik Kroniki Gruzji, gigantyczne pokryte reliefami filary nad Morzem Tbiliskim, Tbilisi, Gruzja',
      },
    },
    // One contextual inline body image (real <figure class="body-img"> in the
    // per-locale body, placed at the end of each locale's "The monument" section —
    // the stairway-approach view showing the two relief registers it describes).
    // Rendered via SitePage's inlineImageObjects @graph map: stable @id
    // (#inline-stairway), contentUrl at the 1448 rung (no `w` suffix), localized
    // name (=alt) + caption, brand credit, contentLocation matching the hero, NO
    // representativeOfPage (that's the hero's). Verbatim from chronicles-inline-
    // package.md. Hero above is untouched — inline-only addition.
    inlineImageObjects: [
      {
        base: 'chronicles-of-georgia-pillars-stairway-georgia', width: 1448, height: 1086, anchor: 'inline-stairway',
        description: 'The grand staircase of the Chronicles of Georgia monument climbing up to the colossal relief-covered pillars, the upper registers carrying the kings, queens and heroes of Georgia and the lower band scenes from the life of Christ, under a clear blue sky. The monument stands on Keeni Hill above the Tbilisi Sea, on the northern edge of Tbilisi, capital of Georgia (the country).',
        locationName: 'Chronicles of Georgia, Keeni Hill, Tbilisi, Georgia',
        locality: 'Tbilisi', region: 'Tbilisi', geo: { lat: 41.770503, lng: 44.810438 },
        name: {
          en: 'The grand stairway leading up to the colossal carved pillars of the Chronicles of Georgia monument, Tbilisi, Georgia',
          de: 'Die große Freitreppe hinauf zu den kolossalen Reliefpfeilern des Denkmals Chronik Georgiens, Tiflis, Georgien',
          fr: 'Le grand escalier menant aux piliers sculptés colossaux du monument des Chroniques de la Géorgie, Tbilissi, Géorgie',
          es: 'La gran escalinata que sube hacia los colosales pilares tallados del monumento Crónicas de Georgia, Tiflis, Georgia',
          nl: 'De grote trap omhoog naar de kolossale gebeeldhouwde pijlers van het monument Kronieken van Georgië, Tbilisi, Georgië',
          cs: 'Velké schodiště stoupající ke kolosálním tesaným pilířům památníku Kroniky Gruzie, Tbilisi, Gruzie',
          pl: 'Wielkie schody prowadzące do kolosalnych rzeźbionych filarów pomnika Kroniki Gruzji, Tbilisi, Gruzja',
        },
        caption: {
          en: "The stairway approach shows the monument's two worlds at once: Georgia's kings, queens and heroes tower on the upper registers, while scenes from the life of Christ run along the lower band.",
          de: 'Der Aufgang über die Treppe zeigt die zwei Welten des Denkmals zugleich: Auf den oberen Registern ragen Georgiens Könige, Königinnen und Helden auf, während das untere Band Szenen aus dem Leben Christi zeigt.',
          fr: "L'approche par l'escalier révèle d'un coup les deux mondes du monument : rois, reines et héros de Géorgie dominent les registres supérieurs, tandis que la bande inférieure déroule des scènes de la vie du Christ.",
          es: 'La subida por la escalinata muestra a la vez los dos mundos del monumento: los reyes, reinas y héroes de Georgia se alzan en los registros superiores, mientras la banda inferior recorre escenas de la vida de Cristo.',
          nl: 'De trap toont in één blik de twee werelden van het monument: Georgiës koningen, koninginnen en helden torenen op de bovenste registers, terwijl de onderste band scènes uit het leven van Christus toont.',
          cs: 'Pohled od schodiště ukazuje oba světy památníku najednou: v horních registrech se tyčí gruzínští králové, královny a hrdinové, zatímco spodní pás nese výjevy ze života Krista.',
          pl: 'Podejście schodami ukazuje naraz dwa światy pomnika: w górnych rejestrach górują królowie, królowe i bohaterowie Gruzji, a dolny pas przedstawia sceny z życia Chrystusa.',
        },
      },
    ],
  },
  {
    slug: 'jvari-monastery', name: 'Jvari Monastery',
    parentType: 'city', parent: 'mtskheta', published: true,
    seoKey: 'jvariMonastery', contentKey: 'jvariMonastery',
    // Hero: real Jvari Monastery (eastern-apse view, owner's own photo) via the
    // .hero--jvari image-set() ladder (styles.css). `image`/`imageAvif` = the 1540
    // top rung; the CSS class controls the visible background, and `image` feeds
    // the ImageObject contentUrl (1540 rung, per package). Native ceiling 1540 —
    // ladder 768/1200/1540, NO 1600/2400 rung.
    image: '/images/files/jvari-monastery-mtskheta-georgia-1540.webp',
    imageAvif: '/images/files/jvari-monastery-mtskheta-georgia-1540.avif',
    heroClass: 'hero--jvari',
    // Dedicated 1.91:1 social-share image (og:image / twitter:image), .jpg default.
    ogImage: { src: '/images/files/jvari-monastery-mtskheta-georgia-og.jpg', width: 1200, height: 630 },
    // Image SEO/AEO metadata (owner's own photo → brand credit, set by SitePage).
    // Hero is a CSS background (no <img alt>), so the localized alt lives here and
    // is emitted as the ImageObject caption + og:image:alt/twitter:image:alt per
    // locale. Verbatim from jvari-monastery-hero-package.md. width/height = 1540
    // rung. Coordinates approximate per package.
    imageMeta: {
      width: 1540, height: 1021,
      name: 'The 6th-century Jvari Monastery, a domed stone tetraconch church with carved reliefs, on its hilltop above Mtskheta, Georgia',
      description: 'The Jvari Monastery (Church of the Holy Cross) above Mtskheta, an early-medieval domed tetraconch of warm tuff stone with a single dome on an octagonal drum, figural bas-reliefs of its royal patrons on the eastern apse, and the ruins of the older Small Church and fortification walls beside it. Jvari stands on a hilltop over the confluence of the Aragvi and Mtkvari rivers in Mtskheta, Mtskheta-Mtianeti, Georgia (the country).',
      locationName: 'Jvari Monastery, Mtskheta, Mtskheta-Mtianeti, Georgia',
      locality: 'Mtskheta', region: 'Mtskheta-Mtianeti', country: 'GE',
      geo: { lat: 41.8380, lng: 44.7328 },
      alt: {
        en: 'The 6th-century Jvari Monastery, a domed stone tetraconch church with carved reliefs, on its hilltop above Mtskheta, Georgia',
        de: 'Das Kloster Dschwari aus dem 6. Jahrhundert, eine kuppelbekrönte steinerne Tetrakonchoskirche mit Reliefs, auf dem Hügel über Mzcheta, Georgien',
        fr: 'Le monastère de Djvari, église tétraconque en pierre à coupole du VIe siècle ornée de reliefs, sur sa colline au-dessus de Mtskheta, Géorgie',
        es: 'El monasterio de Yvari, iglesia tetracónica de piedra con cúpula del siglo VI y relieves tallados, sobre su colina junto a Mtsjeta, Georgia',
        nl: 'Het 6e-eeuwse Jvari-klooster, een stenen tetraconch-kerk met koepel en reliëfs, op de heuvel boven Mtscheta, Georgië',
        cs: 'Klášter Džvari ze 6. století, kamenný tetrakonchový kostel s kupolí a reliéfy, na kopci nad Mcchetou, Gruzie',
        pl: 'VI-wieczny klasztor Dżwari, kamienny tetrakonchowy kościół z kopułą i reliefami, na wzgórzu nad Mcchetą, Gruzja',
      },
    },
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
    // Hero = owner's own Svetitskhoveli photo (landscape, native 1540 → variants
    // capped at 1540; NO 1600/2400 variant), replacing the generic georgia-home.jpg
    // placeholder. Native ceiling is 1540 (BELOW the usual 1600 rung), so the ladder
    // is 768/1200/1540 only and the ImageObject contentUrl points at the 1540 rung.
    // Visible background is the `.hero--svetitskhoveli` CSS class (heroClass below)
    // so the image-set ladder + `background-position: center center` apply; HeroSection
    // then omits its inline background. First Mtskheta-cluster image — filename kept
    // scoped to Svetitskhoveli (not genericised); a future Mtskheta town-page image
    // gets a distinct suffix. Region is Mtskheta-Mtianeti (NOT Kakheti/Shida Kartli).
    image: '/images/files/svetitskhoveli-cathedral-mtskheta-georgia-1540.webp',
    imageAvif: '/images/files/svetitskhoveli-cathedral-mtskheta-georgia-1540.avif',
    heroClass: 'hero--svetitskhoveli',
    // Dedicated 1.91:1 social-share image (og:image / twitter:image) — the safe
    // .jpg default for scrapers.
    ogImage: { src: '/images/files/svetitskhoveli-cathedral-mtskheta-georgia-og.jpg', width: 1200, height: 630 },
    // Image SEO/AEO metadata (owner's own photo → brand credit, set by SitePage).
    // Hero is a CSS background (no <img alt>), so the localized alt lives here and
    // is emitted as the ImageObject caption + og:image:alt/twitter:image:alt per
    // locale. Verbatim from svetitskhoveli-hero-image-package.md. width/height = 1540 rung.
    imageMeta: {
      width: 1540, height: 1021,
      name: 'Svetitskhoveli Cathedral in Mtskheta, stone cross-dome church with a conical dome and fortified wall, Georgia',
      description: 'The 11th-century Svetitskhoveli Cathedral in Mtskheta, an elongated cross-in-square stone church of sandy tuff with a faceted drum and conical dome, its arcaded facades carved in relief, with the fortified stone wall, gatehouse and bell tower of the complex to the right. Mtskheta lies in Mtskheta-Mtianeti, in eastern Georgia (the country).',
      locationName: 'Svetitskhoveli Cathedral, Mtskheta, Mtskheta-Mtianeti, Georgia',
      locality: 'Mtskheta', region: 'Mtskheta-Mtianeti', country: 'GE',
      geo: { lat: 41.8419, lng: 44.7211 },
      alt: {
        en: 'Svetitskhoveli Cathedral in Mtskheta, stone cross-dome church with a conical dome and fortified wall, Georgia',
        de: 'Swetizchoweli-Kathedrale in Mzcheta, steinerne Kreuzkuppelkirche mit Kegeldach und Wehrmauer, Georgien',
        fr: 'Cathédrale de Svétitskhovéli à Mtskheta, église en pierre à coupole conique et muraille fortifiée, Géorgie',
        es: 'Catedral de Svetitsjoveli en Mtsjeta, iglesia de piedra con cúpula cónica y muralla fortificada, Georgia',
        nl: 'Svetitskhoveli-kathedraal in Mtscheta, stenen kruiskoepelkerk met kegeldak en verdedigingsmuur, Georgië',
        cs: 'Katedrála Sveticchoveli v Mccchetě, kamenný křížový chrám s kuželovou kupolí a hradbou, Gruzie',
        pl: 'Katedra Sweticchoweli w Mcchecie, kamienny kościół z kopułą i murem obronnym, Gruzja',
      },
    },
  },
  {
    slug: 'gudauri-panorama', name: 'Gudauri Panorama',
    parentType: 'city', parent: 'gudauri', published: true,
    seoKey: 'russiaGeorgiaFriendshipMonument', contentKey: 'russiaGeorgiaFriendshipMonument',
    // Hero: real Gudauri Panorama / Russia-Georgia Friendship Monument (owner's own
    // photo, faces pre-blurred) via the .hero--gudauri-panorama image-set() ladder
    // (styles.css), replacing the georgia-home.jpg placeholder. Native 4:3
    // (1448x1086) — just under the usual 1600 rung, so the ladder is exactly
    // 768/1200/1448 with the top breakpoint at min-width:1200. NO 1600/2400 rung,
    // no upscale. The CSS class controls the visible background (`background-
    // position: center center`; no scrim beyond the shared .coverme::after). H1 is
    // centre-anchored by the shared HeroSection (not changed here). `image`/
    // `imageAvif` = the 1448 top rung, feeding the ImageObject contentUrl (1448).
    image: '/images/files/gudauri-panorama-friendship-monument-georgia-1448.webp',
    imageAvif: '/images/files/gudauri-panorama-friendship-monument-georgia-1448.avif',
    heroClass: 'hero--gudauri-panorama',
    // Dedicated 1.91:1 social-share image (og:image / twitter:image), .jpg default.
    ogImage: { src: '/images/files/gudauri-panorama-friendship-monument-georgia-og.jpg', width: 1200, height: 630 },
    // Hero image SEO/AEO metadata (owner's own photo, faces pre-blurred → brand
    // credit, set by SitePage). Hero is a CSS background (no <img alt>), so the
    // localized alt lives here and is emitted as og:image:alt/twitter:image:alt per
    // locale; the `caption` map feeds the hero ImageObject caption. Verbatim from
    // gudauri-panorama-hero-package.md. width/height = 1448 rung; coordinates per
    // package. Region Mtskheta-Mtianeti. Metadata frames the site as a viewpoint /
    // Soviet-era mural, not a current celebration of "friendship".
    imageMeta: {
      width: 1448, height: 1086,
      name: "The Gudauri Panorama, a curved Soviet-era monument with a colourful mosaic mural above the Devil's Valley on the Georgian Military Highway, Georgia",
      description: "The Gudauri Panorama, officially the Russia-Georgia Friendship Monument, a large semicircular stone-and-concrete structure on the Georgian Military Highway above the Devil's Valley, its inner wall covered by a colourful tile mosaic of Georgian and Russian historical scenes, with a paved viewing terrace and arches opening to the Caucasus mountains. Built in 1983 near Gudauri in the Mtskheta-Mtianeti region of Georgia (the country).",
      locationName: 'Gudauri Panorama (Russia-Georgia Friendship Monument), Georgian Military Highway, Gudauri, Georgia',
      locality: 'Gudauri', region: 'Mtskheta-Mtianeti', country: 'GE',
      geo: { lat: 42.4920, lng: 44.4527 },
      alt: {
        en: "The Gudauri Panorama, a curved Soviet-era monument with a colourful mosaic mural above the Devil's Valley on the Georgian Military Highway, Georgia",
        de: 'Das Gudauri-Panorama, ein geschwungenes Denkmal aus der Sowjetzeit mit buntem Mosaik über dem Teufelstal an der Georgischen Heerstraße, Georgien',
        fr: "Le panorama de Gudauri, monument incurvé de l'époque soviétique orné d'une mosaïque colorée au-dessus de la vallée du Diable, sur la route militaire géorgienne, Géorgie",
        es: 'El panorama de Gudauri, un monumento curvo de la era soviética con un colorido mosaico sobre el valle del Diablo, en la carretera militar georgiana, Georgia',
        nl: 'Het Gudauri-panorama, een gebogen monument uit de Sovjettijd met een kleurrijk mozaïek boven de Duivelsvallei aan de Georgische Militaire Weg, Georgië',
        cs: 'Gudauri Panorama, zakřivený památník ze sovětské éry s barevnou mozaikou nad Ďáblovým údolím na Gruzínské vojenské cestě, Gruzie',
        pl: 'Panorama Gudauri, wygięty pomnik z czasów sowieckich z barwną mozaiką nad Diablą Doliną przy Gruzińskiej Drodze Wojennej, Gruzja',
      },
      caption: {
        en: "Built in 1983 to mark the bicentennial of the 1783 Treaty of Georgievsk, this semicircular monument on the Georgian Military Highway is lined with a mosaic mural of Georgian and Russian history. Today it is best known as a viewpoint over the Devil's Valley.",
        de: '1983 zum 200. Jahrestag des Vertrags von Georgijewsk (1783) errichtet, ist dieses halbrunde Denkmal an der Georgischen Heerstraße innen mit einem Mosaik zur georgischen und russischen Geschichte ausgekleidet. Heute ist es vor allem als Aussichtspunkt über das Teufelstal bekannt.',
        fr: "Édifié en 1983 pour le bicentenaire du traité de Guéorguievsk (1783), ce monument semi-circulaire de la route militaire géorgienne est tapissé d'une mosaïque retraçant l'histoire géorgienne et russe. On le connaît aujourd'hui surtout comme belvédère sur la vallée du Diable.",
        es: 'Construido en 1983 por el bicentenario del Tratado de Gueórguievsk (1783), este monumento semicircular de la carretera militar georgiana está revestido con un mosaico de historia georgiana y rusa. Hoy se conoce sobre todo como mirador sobre el valle del Diablo.',
        nl: 'Gebouwd in 1983 voor het tweehonderdjarig bestaan van het Verdrag van Georgijevsk (1783), is dit halfronde monument aan de Georgische Militaire Weg vanbinnen bekleed met een mozaïek over de Georgische en Russische geschiedenis. Nu vooral bekend als uitzichtpunt over de Duivelsvallei.',
        cs: 'Postaven roku 1983 ke dvoustému výročí Georgijevské smlouvy (1783), tento půlkruhový památník na Gruzínské vojenské cestě je uvnitř vyzdoben mozaikou gruzínských a ruských dějin. Dnes je znám hlavně jako vyhlídka na Ďáblovo údolí.',
        pl: 'Zbudowany w 1983 roku z okazji dwustulecia traktatu w Georgijewsku (1783), ten półkolisty pomnik przy Gruzińskiej Drodze Wojennej wyłożony jest mozaiką przedstawiającą historię Gruzji i Rosji. Dziś znany głównie jako punkt widokowy na Diablą Dolinę.',
      },
    },
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
    // Cover/hero = our own Prince's Church photo (16:9, native max 1600),
    // replacing the generic georgia-home.jpg placeholder. Rendered as the
    // CSS-background hero via HeroSection image-set (webp `image` + avif
    // `imageAvif`); og:image/twitter auto-derive from `image`. No upscale.
    // Distinct from the Gori page's own uplistsikhe-cave-town-georgia — both kept.
    image: '/images/files/uplistsikhe-princes-church-basilica-georgia-1600w.webp',
    imageAvif: '/images/files/uplistsikhe-princes-church-basilica-georgia-1600w.avif',
    // Contextual body photos (our own). The 3 non-hero images render as real
    // inline <figure> blocks embedded in the per-locale body HTML (pages.json),
    // matched to their descriptions. `imageObjects` feeds ONE ImageObject per
    // photo into the SitePage JSON-LD @graph (brand credit Hikasus Travel; the
    // cover is flagged hero → representativeOfPage). contentUrl uses the variant
    // named by `width`. Region Shida Kartli, locality Uplistsikhe.
    // Verbatim from the image SEO package (REPLACE-BRAND → Hikasus Travel).
    imageObjects: [
      {
        base: 'uplistsikhe-princes-church-basilica-georgia', width: 1600, height: 900, hero: true,
        name: "Prince's Church basilica at Uplistsikhe, Shida Kartli, Georgia",
        caption: "The 10th-century Prince's Church basilica above the rock-cut caves of Uplistsikhe",
        description: "Uplistsulis Eklesia, the 10th-century triple-nave Prince's Church, standing above the rock-cut caves of Uplistsikhe cave town, built over what was probably the site's most important pagan temple, Shida Kartli, Georgia.",
        locationName: 'Uplistsikhe', locality: 'Uplistsikhe', region: 'Shida Kartli', geo: { lat: 41.9686, lng: 44.2072 },
      },
      {
        base: 'uplistsikhe-rock-cut-halls-georgia', width: 1600, height: 900,
        name: 'Rock-cut halls at Uplistsikhe, Shida Kartli, Georgia',
        caption: 'Large rock-cut halls with arched ceilings carved into the sandstone at Uplistsikhe',
        description: 'Large rock-cut halls with arched ceilings on the central terraces of Uplistsikhe cave town, including chambers such as the Hall of Queen Tamar and the Temple of Makvliani, Shida Kartli, Georgia.',
        locationName: 'Uplistsikhe', locality: 'Uplistsikhe', region: 'Shida Kartli', geo: { lat: 41.9686, lng: 44.2072 },
      },
      {
        base: 'uplistsikhe-cave-dwellings-walls-georgia', width: 1600, height: 900,
        name: 'Cave dwellings and walls at Uplistsikhe, Shida Kartli, Georgia',
        caption: 'Cave dwellings and cobblestone retaining walls along the streets of Uplistsikhe',
        description: 'Cave dwellings, terraces and cobblestone retaining walls in Uplistsikhe cave town, a rock-hewn settlement of some 40,000 square metres where around 150 of an estimated 700 caves survive, Shida Kartli, Georgia.',
        locationName: 'Uplistsikhe', locality: 'Uplistsikhe', region: 'Shida Kartli', geo: { lat: 41.9686, lng: 44.2072 },
      },
      {
        base: 'uplistsikhe-mtkvari-valley-view-georgia', width: 1600, height: 900,
        name: 'View over the Mtkvari valley from Uplistsikhe, Shida Kartli, Georgia',
        caption: 'The Mtkvari River and Kartli plain seen from the carved rock plateau of Uplistsikhe',
        description: 'The Mtkvari (Kura) River and the Kartli plain seen from the rock plateau of Uplistsikhe; the river formed the cave town’s natural defence and its valley carried the Silk Road caravan route, Shida Kartli, Georgia.',
        locationName: 'Uplistsikhe', locality: 'Uplistsikhe', region: 'Shida Kartli', geo: { lat: 41.9686, lng: 44.2072 },
      },
    ],
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
    // Hero: real Gelati Monastery (owner's own photo) via the .hero--gelati
    // image-set() ladder (styles.css), replacing the georgia-home.jpg placeholder.
    // Native ~7:5 (1491x1055) — just under the usual 1600 rung, so the ladder is
    // exactly 768/1200/1491 with the top breakpoint at min-width:1200. NO 1600/2400
    // rung, no upscale. The CSS class controls the visible background
    // (`background-position: center center`, cloudy sky upper-left = H1 zone, no
    // scrim). `image`/`imageAvif` = the 1491 top rung, feeding the ImageObject
    // contentUrl (1491) + the og fallback reference.
    image: '/images/files/gelati-monastery-kutaisi-georgia-1491.webp',
    imageAvif: '/images/files/gelati-monastery-kutaisi-georgia-1491.avif',
    heroClass: 'hero--gelati',
    // Dedicated 1.91:1 social-share image (og:image / twitter:image), .jpg default.
    ogImage: { src: '/images/files/gelati-monastery-kutaisi-georgia-og.jpg', width: 1200, height: 630 },
    // Hero image SEO/AEO metadata (owner's own photo → brand credit, set by
    // SitePage). Hero is a CSS background (no <img alt>), so the localized alt lives
    // here and is emitted as og:image:alt/twitter:image:alt per locale; the `caption`
    // map feeds the hero ImageObject caption. Verbatim from gelati-monastery-hero-
    // package.md. width/height = 1491 rung; coordinates per package. Region Imereti.
    imageMeta: {
      width: 1491, height: 1055,
      name: 'The medieval Gelati Monastery near Kutaisi, its domed cathedral and bell tower in stone, under a cloudy sky, Georgia',
      description: 'The Gelati Monastery near Kutaisi, a medieval Georgian monastic complex of honey-coloured stone, with the domed Church of the Virgin, a bell tower with a green-tiled roof, subsidiary churches and a cobbled path across the lawn, under a dramatic cloudy sky. Founded in 1106 by King David the Builder, Gelati is a UNESCO World Heritage Site in the Imereti region of Georgia (the country).',
      locationName: 'Gelati Monastery, Kutaisi, Imereti, Georgia',
      locality: 'Kutaisi', region: 'Imereti', country: 'GE',
      geo: { lat: 42.29472, lng: 42.76806 },
      alt: {
        en: 'The medieval Gelati Monastery near Kutaisi, its domed cathedral and bell tower in stone, under a cloudy sky, Georgia',
        de: 'Das mittelalterliche Kloster Gelati bei Kutaissi, seine kuppelbekrönte Kathedrale und der Glockenturm aus Stein, unter bewölktem Himmel, Georgien',
        fr: 'Le monastère médiéval de Ghélati près de Koutaïssi, sa cathédrale à coupole et son clocher de pierre, sous un ciel nuageux, Géorgie',
        es: 'El monasterio medieval de Gelati cerca de Kutaisi, su catedral con cúpula y su campanario de piedra, bajo un cielo nublado, Georgia',
        nl: 'Het middeleeuwse Gelati-klooster bij Koetaisi, met zijn koepelkathedraal en stenen klokkentoren, onder een bewolkte lucht, Georgië',
        cs: 'Středověký klášter Gelati u Kutaisi, jeho kupolová katedrála a kamenná zvonice pod zataženou oblohou, Gruzie',
        pl: 'Średniowieczny klasztor Gelati koło Kutaisi, jego kopułowa katedra i kamienna dzwonnica pod zachmurzonym niebem, Gruzja',
      },
      caption: {
        en: "Gelati Monastery was founded in 1106 by King David the Builder and became one of medieval Georgia's great centres of learning. A UNESCO World Heritage Site, it holds the tomb of King David and famous 12th-century mosaics inside its main church.",
        de: 'Das Kloster Gelati wurde 1106 von König David dem Erbauer gegründet und zu einem der großen Bildungszentren des mittelalterlichen Georgien. Als UNESCO-Welterbe birgt es das Grab König Davids und berühmte Mosaiken aus dem 12. Jahrhundert in seiner Hauptkirche.',
        fr: "Le monastère de Ghélati fut fondé en 1106 par le roi David le Bâtisseur et devint l'un des grands foyers de savoir de la Géorgie médiévale. Inscrit au patrimoine mondial de l'UNESCO, il abrite le tombeau du roi David et de célèbres mosaïques du XIIe siècle dans son église principale.",
        es: 'El monasterio de Gelati fue fundado en 1106 por el rey David el Constructor y se convirtió en uno de los grandes centros de saber de la Georgia medieval. Patrimonio de la Humanidad de la UNESCO, alberga la tumba del rey David y célebres mosaicos del siglo XII en su iglesia principal.',
        nl: 'Het Gelati-klooster werd in 1106 gesticht door koning David de Bouwer en groeide uit tot een van de grote leercentra van middeleeuws Georgië. Als UNESCO-werelderfgoed herbergt het het graf van koning David en beroemde 12e-eeuwse mozaïeken in de hoofdkerk.',
        cs: 'Klášter Gelati založil roku 1106 král David Stavitel a stal se jedním z velkých vzdělávacích center středověké Gruzie. Jako památka UNESCO ukrývá hrob krále Davida a slavné mozaiky z 12. století ve své hlavní kostele.',
        pl: 'Klasztor Gelati założył w 1106 roku król Dawid Budowniczy i stał się jednym z wielkich ośrodków nauki średniowiecznej Gruzji. Wpisany na listę UNESCO, kryje grób króla Dawida i słynne XII-wieczne mozaiki w swojej głównej świątyni.',
      },
    },
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
    // Hero = owner's own drone photo of the Vardzia cave-monastery cliff face,
    // replacing the generic georgia-home.jpg placeholder. Landscape 4:3, native
    // 1448 (BELOW the usual 1600 rung) → hero ladder 768/1200/1448 only; NO
    // 1600/2400 variant is generated or referenced, ImageObject contentUrl points
    // at the 1448 rung. Visible background is the `.hero--vardzia` CSS class
    // (heroClass) so the image-set ladder + `background-position: center center`
    // apply; HeroSection then omits its inline background. Region is Samtskhe-
    // Javakheti (Aspindza Municipality), NOT any other region. Distinct from the
    // unrelated `vardzia-cave-monastery.jpg` region/things-to-do image (untouched).
    image: '/images/files/vardzia-cave-monastery-cliff-face-georgia-1448.webp',
    imageAvif: '/images/files/vardzia-cave-monastery-cliff-face-georgia-1448.avif',
    heroClass: 'hero--vardzia',
    // Dedicated 1.91:1 social-share image (og:image / twitter:image) — hero only;
    // the inline image gets NO OG variant.
    ogImage: { src: '/images/files/vardzia-cave-monastery-cliff-face-georgia-og.jpg', width: 1200, height: 630 },
    // Hero image SEO/AEO metadata (owner's own drone photo → brand credit, set by
    // SitePage). Hero is a CSS background (no <img alt>), so the localized alt lives
    // here and is emitted as the ImageObject caption + og:image:alt/twitter:image:alt
    // per locale. Verbatim from vardzia-image-package.md. width/height = 1448 rung.
    imageMeta: {
      width: 1448, height: 1086,
      name: 'The honeycombed cliff face of Vardzia cave monastery above the Mtkvari valley, Samtskhe-Javakheti, Georgia',
      description: 'The cliff face of the Vardzia cave monastery, a 12th-century rock-cut complex of hundreds of chambers, tunnels and stairways carved into the tuff of Erusheti Mountain on the left bank of the Mtkvari River, with visitors on the walkways for scale and the river valley beyond. Vardzia lies in Aspindza Municipality, Samtskhe-Javakheti, in southern Georgia (the country).',
      locationName: 'Vardzia, Aspindza Municipality, Samtskhe-Javakheti, Georgia',
      locality: 'Vardzia', region: 'Samtskhe-Javakheti', country: 'GE',
      geo: { lat: 41.3811, lng: 43.2847 },
      alt: {
        en: 'The honeycombed cliff face of Vardzia cave monastery above the Mtkvari valley, Samtskhe-Javakheti, Georgia',
        de: 'Die wabenartige Felswand des Höhlenklosters Wardsia über dem Mtkwari-Tal, Samzche-Dschawachetien, Georgien',
        fr: "La falaise en nid d'abeille du monastère troglodyte de Vardzia au-dessus de la vallée de la Mtkvari, Samtskhé-Djavakhétie, Géorgie",
        es: 'El acantilado en forma de panal del monasterio rupestre de Vardzia sobre el valle del Mtkvari, Samtsje-Yavajeti, Georgia',
        nl: 'De honingraatvormige rotswand van het grotklooster Vardzia boven het Mtkvari-dal, Samtsche-Dzjavacheti, Georgië',
        cs: 'Voštinová skalní stěna jeskynního kláštera Vardzia nad údolím Mtkvari, Samcche-Džavacheti, Gruzie',
        pl: 'Plastrowa ściana skalna klasztoru jaskiniowego Vardzia nad doliną Mtkwari, Samcche-Dżawachetia, Gruzja',
      },
    },
    // One contextual inline body image (real <figure> in the per-locale body,
    // placed after each locale's "The landscape" section). Rendered via SitePage's
    // inlineImageObjects @graph map: stable @id (#inline-image-1), contentUrl at the
    // 1448 rung (no `w` suffix), localized name+caption, brand credit, NO
    // representativeOfPage (that's the hero's). Verbatim from vardzia-image-package.md.
    inlineImageObjects: [
      {
        base: 'vardzia-cave-monastery-mtkvari-valley-georgia', width: 1448, height: 1086, anchor: 'inline-image-1',
        description: 'A high view over the Mtkvari River valley from the Vardzia cave monastery, with the tuff cliff and its rock-cut chambers on the right, the river, approach road and visitor facilities on the valley floor, and the green highlands of Samtskhe-Javakheti beyond. Vardzia lies in Aspindza Municipality, southern Georgia (the country).',
        locationName: 'Vardzia, Aspindza Municipality, Samtskhe-Javakheti, Georgia',
        locality: 'Vardzia', region: 'Samtskhe-Javakheti', geo: { lat: 41.3811, lng: 43.2847 },
        name: {
          en: 'View over the Mtkvari valley from Vardzia, with the cave monastery in the cliff at right, Samtskhe-Javakheti, Georgia',
          de: 'Blick über das Mtkwari-Tal von Wardsia aus, rechts das Höhlenkloster in der Felswand, Samzche-Dschawachetien, Georgien',
          fr: 'Vue sur la vallée de la Mtkvari depuis Vardzia, le monastère troglodyte dans la falaise à droite, Samtskhé-Djavakhétie, Géorgie',
          es: 'Vista del valle del Mtkvari desde Vardzia, con el monasterio rupestre en el acantilado a la derecha, Samtsje-Yavajeti, Georgia',
          nl: 'Uitzicht over het Mtkvari-dal vanaf Vardzia, rechts het grotklooster in de rotswand, Samtsche-Dzjavacheti, Georgië',
          cs: 'Pohled na údolí Mtkvari z Vardzie, vpravo jeskynní klášter ve skalní stěně, Samcche-Džavacheti, Gruzie',
          pl: 'Widok na dolinę Mtkwari z Vardzii, po prawej klasztor jaskiniowy w ścianie skalnej, Samcche-Dżawachetia, Gruzja',
        },
        caption: {
          en: 'The monastery overlooks the Mtkvari River as it cuts through the Samtskhe-Javakheti highlands. The road and visitor centre below mark the start of the climb up into the cave city.',
          de: 'Das Kloster blickt auf den Fluss Mtkwari, der sich durch das Hochland von Samzche-Dschawachetien schneidet. Die Straße und das Besucherzentrum unten markieren den Beginn des Aufstiegs in die Höhlenstadt.',
          fr: "Le monastère domine la Mtkvari, qui entaille les hautes terres de Samtskhé-Djavakhétie. La route et le centre d'accueil en contrebas marquent le début de la montée vers la cité troglodyte.",
          es: 'El monasterio domina el río Mtkvari, que atraviesa las tierras altas de Samtsje-Yavajeti. La carretera y el centro de visitantes de abajo marcan el inicio del ascenso a la ciudad rupestre.',
          nl: 'Het klooster kijkt uit over de rivier de Mtkvari, die zich door het hoogland van Samtsche-Dzjavacheti snijdt. De weg en het bezoekerscentrum beneden markeren het begin van de klim naar de grotstad.',
          cs: 'Klášter shlíží na řeku Mtkvari, která se zařezává do vysočiny Samcche-Džavacheti. Silnice a návštěvnické centrum dole značí začátek výstupu do jeskynního města.',
          pl: 'Klasztor góruje nad rzeką Mtkwari, która przecina wyżyny Samcche-Dżawachetii. Droga i centrum dla zwiedzających poniżej wyznaczają początek wejścia do jaskiniowego miasta.',
        },
      },
    ],
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
    // Hero = owner's own Juta-valley photo (3:2, native 3140 → variants capped at
    // 2400; NO 3140 variant), replacing the generic georgia-home.jpg placeholder.
    // The visible hero background is defined by the `.hero--juta` CSS class
    // (heroClass below) so the package's responsive image-set() ladder (768→2400)
    // and the deliberate `background-position: center 40%` can be expressed;
    // HeroSection then omits its inline background. `image`/`imageAvif` stay as the
    // JSON-LD contentUrl + og-fallback references. First Kazbegi-cluster image —
    // filename kept scoped to Juta (not genericised). Distinct from any future
    // Kazbegi region-page image.
    image: '/images/files/juta-valley-chaukhi-massif-hammocks-georgia-2400.webp',
    imageAvif: '/images/files/juta-valley-chaukhi-massif-hammocks-georgia-2400.avif',
    heroClass: 'hero--juta',
    // Dedicated 1.91:1 social-share image (og:image / twitter:image) — the safe
    // .jpg default for scrapers.
    ogImage: { src: '/images/files/juta-valley-chaukhi-massif-hammocks-georgia-og.jpg', width: 1200, height: 630 },
    // Image SEO/AEO metadata (owner's own photo → brand credit, set by SitePage).
    // Hero is a CSS background (no <img alt>), so the localized alt lives here and
    // is emitted as the ImageObject caption + og:image:alt/twitter:image:alt per
    // locale. Verbatim from juta-hero-image-package.md. Region Kazbegi.
    imageMeta: {
      width: 2400, height: 1601,
      name: 'Hammocks on an alpine meadow above Juta village, Chaukhi massif at the valley head, Kazbegi, Georgia',
      description: 'View south up the Juta valley from a mountain camp above the village, with hammocks and deckchairs on the alpine meadow in the foreground and the jagged peaks of the Chaukhi massif at the head of the valley. Juta lies in Kazbegi Municipality, Mtskheta-Mtianeti, in the Greater Caucasus of Georgia (the country).',
      locationName: 'Juta, Kazbegi Municipality, Mtskheta-Mtianeti, Georgia',
      locality: 'Juta', region: 'Kazbegi', country: 'GE',
      geo: { lat: 42.5236, lng: 44.7386 },
      alt: {
        en: 'Hammocks on an alpine meadow above Juta village, Chaukhi massif at the valley head, Kazbegi, Georgia',
        de: 'Hängematten auf einer Almwiese oberhalb des Dorfes Juta, dahinter das Chaukhi-Massiv, Kasbegi, Georgien',
        fr: 'Hamacs sur un alpage au-dessus du village de Juta, le massif de Chaukhi au fond de la vallée, Kazbegi, Géorgie',
        es: 'Hamacas en un prado alpino sobre el pueblo de Juta, con el macizo de Chaukhi al fondo del valle, Kazbegi, Georgia',
        nl: 'Hangmatten op een alpenweide boven het dorp Juta, met het Chaukhi-massief aan het einde van de vallei, Kazbegi, Georgië',
        cs: 'Houpací sítě na alpské louce nad vesnicí Juta, v čele údolí masiv Chaukhi, Kazbegi, Gruzie',
        pl: 'Hamaki na alpejskiej łące nad wsią Juta, na końcu doliny masyw Chaukhi, Kazbegi, Gruzja',
      },
    },
    // Two contextual inline body photos (real <figure> in the per-locale body).
    // Rendered via SitePage's inlineImageObjects @graph map: stable @id
    // (#inline-image-1/2), contentUrl at the 1448 rung (no `w` suffix), localized
    // name+caption, brand credit, NO representativeOfPage (that's the hero's).
    // Verbatim from juta-inline-images-package.md. Image 2 is deliberately kept at
    // Kazbegi-municipality level (the frame shows no verifiable Juta/Chaukhi
    // feature) — no Juta/Chaukhi claim, coarse municipality geo.
    inlineImageObjects: [
      {
        base: 'juta-valley-chaukhi-tents-camp-georgia', width: 1448, height: 1086, anchor: 'inline-image-1',
        description: 'Trekking tents pitched on the grass valley floor above Juta, with a footpath crossing the meadow and the jagged peaks of the Chaukhi massif at the head of the valley under building cloud. Juta lies in Kazbegi Municipality, Mtskheta-Mtianeti, in the Greater Caucasus of Georgia (the country).',
        locationName: 'Juta, Kazbegi Municipality, Mtskheta-Mtianeti, Georgia',
        locality: 'Juta', region: 'Kazbegi', geo: { lat: 42.5236, lng: 44.7386 },
        name: {
          en: 'Trekking tents on the alpine meadow in Juta valley below the jagged Chaukhi peaks, Kazbegi, Georgia',
          de: 'Trekkingzelte auf der Almwiese im Juta-Tal unterhalb der zerklüfteten Chaukhi-Gipfel, Kasbegi, Georgien',
          fr: "Tentes de trek sur l'alpage de la vallée de Juta, sous les pics déchiquetés du Chaukhi, Kazbegi, Géorgie",
          es: 'Tiendas de trekking en el prado alpino del valle de Juta, bajo los picos dentados del Chaukhi, Kazbegi, Georgia',
          nl: 'Trekkingtenten op de alpenweide in de Juta-vallei onder de gekartelde Chaukhi-toppen, Kazbegi, Georgië',
          cs: 'Trekové stany na alpské louce v údolí Juta pod rozeklanými vrcholy Chaukhi, Kazbegi, Gruzie',
          pl: 'Namioty trekkingowe na alpejskiej łące w dolinie Juty pod poszarpanymi szczytami Chaukhi, Kazbegi, Gruzja',
        },
        caption: {
          en: "The valley is the usual starting point for the walk up to the Chaukhi Pass, which is generally passable from the second half of June. The massif's highest summit reaches 3,842 metres.",
          de: 'Das Tal ist der übliche Ausgangspunkt für den Aufstieg zum Chaukhi-Pass, der in der Regel ab der zweiten Junihälfte begehbar ist. Der höchste Gipfel des Massivs erreicht 3.842 Meter.',
          fr: 'La vallée est le point de départ habituel de la montée vers le col de Chaukhi, généralement praticable à partir de la seconde moitié de juin. Le plus haut sommet du massif culmine à 3 842 mètres.',
          es: 'El valle es el punto de partida habitual para subir al paso de Chaukhi, transitable por lo general desde la segunda mitad de junio. La cumbre más alta del macizo alcanza los 3.842 metros.',
          nl: 'De vallei is het gebruikelijke vertrekpunt voor de tocht naar de Chaukhi-pas, die doorgaans vanaf de tweede helft van juni begaanbaar is. De hoogste top van het massief reikt tot 3.842 meter.',
          cs: 'Údolí je obvyklým výchozím bodem pro výstup na průsmyk Chaukhi, který bývá schůdný od druhé poloviny června. Nejvyšší vrchol masivu dosahuje 3 842 metrů.',
          pl: 'Dolina jest zwykłym punktem wyjścia na przełęcz Chaukhi, przejezdną zazwyczaj od drugiej połowy czerwca. Najwyższy szczyt masywu osiąga 3842 metry.',
        },
      },
      {
        base: 'kazbegi-winter-ridges-snow-georgia', width: 1448, height: 1086, anchor: 'inline-image-2',
        description: 'Steep brown ridges streaked with snow above a shadowed valley in the Kazbegi mountains under a clear winter sky, with a small group of buildings on a spur and a track crossing the snow-covered slope in the foreground. Kazbegi Municipality lies in Mtskheta-Mtianeti, in the Greater Caucasus of Georgia (the country).',
        locationName: 'Kazbegi Municipality, Mtskheta-Mtianeti, Georgia',
        region: 'Kazbegi', geo: { lat: 42.6591, lng: 44.6414 },
        name: {
          en: 'Snow-streaked brown ridges above a valley in the Kazbegi mountains in winter, Greater Caucasus, Georgia',
          de: 'Schneedurchzogene braune Bergrücken über einem Tal im Kasbegi-Gebirge im Winter, Großer Kaukasus, Georgien',
          fr: "Crêtes brunes striées de neige au-dessus d'une vallée du massif de Kazbegi en hiver, Grand Caucase, Géorgie",
          es: 'Crestas pardas veteadas de nieve sobre un valle de las montañas de Kazbegi en invierno, Gran Cáucaso, Georgia',
          nl: 'Bruine bergruggen met sneeuwstrepen boven een vallei in het Kazbegi-gebergte in de winter, Grote Kaukasus, Georgië',
          cs: 'Hnědé hřebeny protkané sněhem nad údolím v horách Kazbegi v zimě, Velký Kavkaz, Gruzie',
          pl: 'Brązowe grzbiety poprzecinane śniegiem nad doliną w górach Kazbegi zimą, Wielki Kaukaz, Gruzja',
        },
        caption: {
          en: 'Snow lingers on the Kazbegi ridges long past midwinter. The gravel roads into the side valleys of Khevi are dependable only in summer and early autumn.',
          de: 'Auf den Kasbegi-Kämmen liegt weit über den Hochwinter hinaus Schnee. Die Schotterpisten in die Seitentäler von Chewi sind nur im Sommer und Frühherbst verlässlich befahrbar.',
          fr: "La neige s'attarde sur les crêtes de Kazbegi bien après le cœur de l'hiver. Les pistes qui mènent aux vallées latérales de Khevi ne sont fiables qu'en été et au début de l'automne.",
          es: 'La nieve permanece en las crestas de Kazbegi mucho después de pleno invierno. Las pistas de grava hacia los valles laterales de Khevi solo son fiables en verano y a principios de otoño.',
          nl: 'Sneeuw blijft lang na midwinter op de kammen van Kazbegi liggen. De grindwegen naar de zijdalen van Chevi zijn alleen in de zomer en vroege herfst betrouwbaar.',
          cs: 'Sníh se na hřebenech Kazbegi drží dlouho po vrcholu zimy. Šotolinové cesty do bočních údolí Khevi jsou spolehlivé jen v létě a na počátku podzimu.',
          pl: 'Śnieg zalega na grzbietach Kazbegi długo po środku zimy. Szutrowe drogi w boczne doliny Chewi są przejezdne tylko latem i wczesną jesienią.',
        },
      },
      // Third inline (added later): the Blue Abudelauri Lake, placed after each
      // locale's Abudelauri-Lakes paragraph in the "Chaukhi Pass / route to Roshka"
      // section. Distinct @id `#inline-abudelauri` (NOT #inline-image-3) so it never
      // clashes with the numbered pair above. NO representativeOfPage (hero's).
      // GEOGRAPHY: the lake is on the Khevsureti/Dusheti side of the Chaukhi massif,
      // NOT in Juta/Kazbegi — contentLocation + alt/caption keep the "reached from
      // Juta over the Chaukhi Pass" framing verbatim from the package; do NOT
      // relabel it as a Juta/Kazbegi feature. contentUrl at the 1537 rung (native
      // ceiling; no 1600/2400). Coordinates are the lake's, deliberately different
      // from the Juta hero's village coordinate.
      {
        base: 'abudelauri-blue-lake-chaukhi-georgia', width: 1537, height: 1023, anchor: 'inline-abudelauri',
        description: 'The blue glacial Abudelauri Lake, one of three coloured lakes at the foot of the Chaukhi massif, its water an intense blue from suspended glacial sediment, ringed by grassy alpine slopes, pale boulders and footpaths with hikers. The Abudelauri Lakes lie on the Khevsureti side of the Chaukhi massif and are reached from Juta over the Chaukhi Pass, in the Greater Caucasus of Georgia (the country).',
        locationName: 'Abudelauri Lakes, Chaukhi massif, Khevsureti, Dusheti Municipality, Georgia',
        locality: 'Khevsureti', region: 'Dusheti Municipality', geo: { lat: 42.5039, lng: 44.8383 },
        name: {
          en: 'The blue glacial Abudelauri Lake below the Chaukhi massif, with hikers on the surrounding trails, Georgia',
          de: 'Der blaue Gletschersee Abudelauri unterhalb des Chaukhi-Massivs, mit Wanderern auf den umliegenden Pfaden, Georgien',
          fr: "Le lac glaciaire bleu d'Abudelauri au pied du massif de Chaukhi, avec des randonneurs sur les sentiers, Géorgie",
          es: 'El lago glaciar azul de Abudelauri bajo el macizo de Chaukhi, con senderistas en los caminos, Georgia',
          nl: 'Het blauwe gletsjermeer Abudelauri onder het Chaukhi-massief, met wandelaars op de omliggende paden, Georgië',
          cs: 'Modré ledovcové jezero Abudelauri pod masivem Chaukhi, s turisty na okolních stezkách, Gruzie',
          pl: 'Niebieskie polodowcowe jezioro Abudelauri pod masywem Chaukhi, z turystami na okolicznych szlakach, Gruzja',
        },
        caption: {
          en: 'The Blue Lake is one of the three Abudelauri glacial lakes at the foot of the Chaukhi massif; its colour comes from fine glacial sediment. From Juta the lakes are reached over the Chaukhi Pass, a two-day trek down into Khevsureti.',
          de: 'Der Blaue See ist einer der drei Abudelauri-Gletscherseen am Fuß des Chaukhi-Massivs; seine Farbe stammt von feinem Gletschersediment. Von Juta aus erreicht man die Seen über den Chaukhi-Pass – eine zweitägige Wanderung hinab nach Chewsuretien.',
          fr: "Le lac Bleu est l'un des trois lacs glaciaires d'Abudelauri, au pied du massif de Chaukhi ; sa couleur vient des fins sédiments glaciaires. Depuis Juta, on rejoint les lacs par le col de Chaukhi, deux jours de marche vers la Khevsourétie.",
          es: 'El lago Azul es uno de los tres lagos glaciares de Abudelauri, al pie del macizo de Chaukhi; su color proviene del fino sedimento glaciar. Desde Juta se llega por el paso de Chaukhi, dos días de caminata hacia Khevsureti.',
          nl: 'Het Blauwe Meer is een van de drie Abudelauri-gletsjermeren aan de voet van het Chaukhi-massief; de kleur komt van fijn gletsjersediment. Vanuit Juta bereik je de meren via de Chaukhi-pas, een tweedaagse tocht omlaag naar Chevsoeretië.',
          cs: 'Modré jezero je jedním ze tří ledovcových jezer Abudelauri na úpatí masivu Chaukhi; jeho barvu způsobuje jemný ledovcový sediment. Z Juty se k jezerům dostanete přes průsmyk Chaukhi – dvoudenní trek dolů do Chevsuretie.',
          pl: 'Niebieskie Jezioro to jedno z trzech polodowcowych jezior Abudelauri u stóp masywu Chaukhi; jego barwa pochodzi z drobnego osadu lodowcowego. Z Juty do jezior dochodzi się przez przełęcz Chaukhi – dwudniowy trek w dół do Chewsuretii.',
        },
      },
    ],
  },
  {
    slug: 'truso-valley', name: 'Truso Valley',
    parentType: 'city', parent: 'kazbegi', published: true,
    seoKey: 'trusoValley', contentKey: 'trusoValley',
    // Hero = owner's own Truso-valley photo (3:2, native 6144 → variants capped at
    // 2400; NO variant above 2400), replacing the generic georgia-home.jpg
    // placeholder. Visible background is the `.hero--truso-valley` CSS class
    // (heroClass below) so the package's responsive image-set() ladder (768→2400)
    // and the deliberate `background-position: center 72%` (the tower + church sit
    // low in a sky-less frame; a centred crop decapitates the church) can be
    // expressed; HeroSection then omits its inline background. Second Kazbegi-
    // cluster image — distinct from juta-valley-chaukhi-massif-hammocks-georgia
    // (both kept). Village identity unresolved → valley-level naming, no village.
    image: '/images/files/truso-valley-defensive-tower-church-georgia-2400.webp',
    imageAvif: '/images/files/truso-valley-defensive-tower-church-georgia-2400.avif',
    heroClass: 'hero--truso-valley',
    // Dedicated 1.91:1 social-share image (og:image / twitter:image).
    ogImage: { src: '/images/files/truso-valley-defensive-tower-church-georgia-og.jpg', width: 1200, height: 630 },
    // Image SEO/AEO metadata (owner's own photo → brand credit, set by SitePage).
    // Hero is a CSS background (no <img alt>), so the localized alt lives here and
    // is emitted as the ImageObject caption + og:image:alt/twitter:image:alt per
    // locale. Verbatim from truso-valley-hero-image-package.md — deliberately
    // neutral-geographic (no village name, no border/access framing).
    imageMeta: {
      width: 2400, height: 1600,
      name: 'Stone defensive tower and a small church below a ruined tower village, Truso Valley, Kazbegi, Georgia',
      description: 'A tapering stone defensive tower and a small stone church with tiled roofs on the valley floor of Truso, with the ruins of an older tower village on the slope above. Truso Valley lies between the Greater Caucasus and Khokhi ranges in Kazbegi Municipality, Mtskheta-Mtianeti, in the high mountains of Georgia (the country).',
      locationName: 'Truso Valley, Kazbegi Municipality, Mtskheta-Mtianeti, Georgia',
      locality: 'Truso Valley', region: 'Kazbegi', country: 'GE',
      geo: { lat: 42.5033, lng: 44.4497 },
      alt: {
        en: 'Stone defensive tower and a small church below a ruined tower village, Truso Valley, Kazbegi, Georgia',
        de: 'Steinerner Wehrturm und kleine Kirche unterhalb eines verfallenen Turmdorfs, Truso-Tal, Kasbegi, Georgien',
        fr: 'Tour de défense en pierre et petite église sous un village de tours en ruine, vallée de Truso, Kazbegi, Géorgie',
        es: 'Torre defensiva de piedra e iglesia bajo un pueblo de torres en ruinas, valle de Truso, Kazbegi, Georgia',
        nl: 'Stenen verdedigingstoren en kerkje onder een vervallen torendorp, Truso-vallei, Kazbegi, Georgië',
        cs: 'Kamenná obranná věž a kostelík pod zříceninou věžové vesnice, údolí Truso, Kazbegi, Gruzie',
        pl: 'Kamienna wieża obronna i kościół pod ruinami wieżowej wsi, dolina Truso, Kazbegi, Gruzja',
      },
    },
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
    // Hero: real Khertvisi Fortress (towers over the Mtkvari–Paravani confluence,
    // owner's own photo) via the .hero--khertvisi image-set() ladder (styles.css).
    // `image`/`imageAvif` = the 1448 top rung; the CSS class controls the visible
    // background, and `image` feeds the ImageObject contentUrl (1448 rung, per
    // package). Native ceiling 1448 — ladder 768/1200/1448, NO 1600/2400 rung.
    image: '/images/files/khertvisi-fortress-towers-georgia-1448.webp',
    imageAvif: '/images/files/khertvisi-fortress-towers-georgia-1448.avif',
    heroClass: 'hero--khertvisi',
    // Dedicated 1.91:1 social-share image (og:image / twitter:image), .jpg default.
    ogImage: { src: '/images/files/khertvisi-fortress-towers-georgia-og.jpg', width: 1200, height: 630 },
    // Image SEO/AEO metadata (owner's own photo → brand credit, set by SitePage).
    // Hero is a CSS background (no <img alt>), so the localized alt lives here and
    // is emitted as the ImageObject caption + og:image:alt/twitter:image:alt per
    // locale. Verbatim from khertvisi-fortress-hero-package.md. width/height =
    // 1448 rung. Coordinates per package.
    imageMeta: {
      width: 1448, height: 1086,
      name: 'The stone towers and crenellated walls of Khertvisi Fortress on its rocky hill, Samtskhe-Javakheti, Georgia',
      description: 'Khertvisi Fortress, a medieval stronghold of round and rectangular stone towers and crenellated walls rising over a rocky hill above the confluence of the Mtkvari and Paravani rivers, with arid canyon slopes behind and a poplar in the foreground. Khertvisi lies in Aspindza Municipality, Samtskhe-Javakheti, in southern Georgia (the country).',
      locationName: 'Khertvisi Fortress, Aspindza Municipality, Samtskhe-Javakheti, Georgia',
      locality: 'Aspindza Municipality', region: 'Samtskhe-Javakheti', country: 'GE',
      geo: { lat: 41.47778, lng: 43.28528 },
      alt: {
        en: 'The stone towers and crenellated walls of Khertvisi Fortress on its rocky hill, Samtskhe-Javakheti, Georgia',
        de: 'Die Steintürme und Zinnenmauern der Festung Chertwisi auf ihrem Felshügel, Samzche-Dschawachetien, Georgien',
        fr: 'Les tours de pierre et les murs crénelés de la forteresse de Khertvisi sur sa colline rocheuse, Samtskhé-Djavakhétie, Géorgie',
        es: 'Las torres de piedra y murallas almenadas de la fortaleza de Khertvisi sobre su colina rocosa, Samtsje-Yavajeti, Georgia',
        nl: 'De stenen torens en gekantelde muren van de Khertvisi-vesting op haar rotsheuvel, Samtsche-Dzjavacheti, Georgië',
        cs: 'Kamenné věže a cimbuří pevnosti Chertvisi na skalnatém kopci, Samcche-Džavacheti, Gruzie',
        pl: 'Kamienne wieże i blankowane mury twierdzy Chertwisi na skalistym wzgórzu, Samcche-Dżawachetia, Gruzja',
      },
    },
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
    // Hero: real Lake Paravani (owner's own photo) via the .hero--paravani
    // image-set() ladder (styles.css), replacing the georgia-home.jpg placeholder.
    // Native 4:3 (1448x1086), just under the usual 1600 rung, so the ladder is
    // exactly 768/1200/1448 with the top breakpoint at min-width:1200. NO 1600/2400
    // rung, no upscale. The CSS class controls the visible background (`background-
    // position: center center`; big clear sky top ~45% = H1 zone; no scrim beyond
    // the shared .coverme::after). `image`/`imageAvif` = the 1448 top rung, feeding
    // the ImageObject contentUrl (1448) + the og fallback reference.
    image: '/images/files/lake-paravani-javakheti-georgia-1448.webp',
    imageAvif: '/images/files/lake-paravani-javakheti-georgia-1448.avif',
    heroClass: 'hero--paravani',
    // Dedicated 1.91:1 social-share image (og:image / twitter:image), .jpg default.
    ogImage: { src: '/images/files/lake-paravani-javakheti-georgia-og.jpg', width: 1200, height: 630 },
    // Hero image SEO/AEO metadata (owner's own photo → brand credit, set by
    // SitePage). Hero is a CSS background (no <img alt>), so the localized alt lives
    // here and is emitted as og:image:alt/twitter:image:alt per locale; the `caption`
    // map feeds the hero ImageObject caption. Verbatim from lake-paravani-hero-
    // package.md. width/height = 1448 rung; coordinates per package (approx).
    // Region-parented site — locality is the municipality. Region Samtskhe-Javakheti.
    imageMeta: {
      width: 1448, height: 1086,
      name: "Lake Paravani, Georgia's largest lake, blue water ringed by the treeless golden hills of the Javakheti plateau",
      description: 'Lake Paravani on the Javakheti volcanic plateau in southern Georgia, a broad shallow blue lake ringed by treeless golden-grass hills, with a volcanic cone rising on the far shore and a dirt track through basalt-strewn steppe in the foreground. The largest lake in Georgia (the country), it lies at about 2,073 metres in Ninotsminda Municipality, Samtskhe-Javakheti.',
      locationName: 'Lake Paravani, Ninotsminda Municipality, Samtskhe-Javakheti, Georgia',
      locality: 'Ninotsminda Municipality', region: 'Samtskhe-Javakheti', country: 'GE',
      geo: { lat: 41.4500, lng: 43.7833 },
      alt: {
        en: "Lake Paravani, Georgia's largest lake, blue water ringed by the treeless golden hills of the Javakheti plateau",
        de: 'Der Parawani-See, Georgiens größter See, blaues Wasser umgeben von den baumlosen goldenen Hügeln des Dschawachetien-Plateaus',
        fr: 'Le lac Paravani, plus grand lac de Géorgie, aux eaux bleues cerclées par les collines dorées et dénudées du plateau de Djavakhétie',
        es: 'El lago Paravani, el mayor lago de Georgia, de aguas azules rodeadas por las colinas doradas y sin árboles de la meseta de Yavajeti',
        nl: 'Het Paravani-meer, het grootste meer van Georgië, blauw water omringd door de boomloze gouden heuvels van het Javakheti-plateau',
        cs: 'Jezero Paravani, největší jezero Gruzie, modrá hladina obklopená bezlesými zlatavými kopci Javachetské plošiny',
        pl: 'Jezioro Parawani, największe jezioro Gruzji, błękitna tafla otoczona bezleśnymi złocistymi wzgórzami płaskowyżu Dżawachetia',
      },
      caption: {
        en: 'Lake Paravani is the largest lake in Georgia, a shallow volcanic-tectonic lake of about 37 square kilometres lying at over 2,000 metres on the Javakheti plateau. Despite its size it is no deeper than a few metres, and in the harsh highland winters it freezes solid enough to walk on.',
        de: 'Der Parawani-See ist der größte See Georgiens, ein flacher vulkanisch-tektonischer See von rund 37 Quadratkilometern auf über 2.000 Metern im Dschawachetien-Plateau. Trotz seiner Größe ist er nur wenige Meter tief, und in den strengen Hochlandwintern friert er begehbar zu.',
        fr: "Le lac Paravani est le plus grand lac de Géorgie : un lac volcano-tectonique peu profond d'environ 37 kilomètres carrés, à plus de 2 000 mètres sur le plateau de Djavakhétie. Malgré sa taille, il ne dépasse pas quelques mètres de profondeur et gèle entièrement lors des rudes hivers d'altitude.",
        es: 'El lago Paravani es el mayor lago de Georgia: un lago volcánico-tectónico poco profundo de unos 37 kilómetros cuadrados, a más de 2.000 metros en la meseta de Yavajeti. Pese a su tamaño, apenas alcanza unos metros de profundidad y en los duros inviernos de montaña se congela por completo.',
        nl: "Het Paravani-meer is het grootste meer van Georgië: een ondiep vulkanisch-tektonisch meer van zo'n 37 vierkante kilometer, op ruim 2.000 meter op het Javakheti-plateau. Ondanks zijn omvang is het maar enkele meters diep, en in de strenge hooglandwinters vriest het volledig dicht.",
        cs: 'Jezero Paravani je největší jezero Gruzie: mělké vulkanicko-tektonické jezero o rozloze asi 37 kilometrů čtverečních, ležící ve výšce přes 2 000 metrů na Javachetské plošině. Navzdory rozloze je hluboké jen několik metrů a v drsných horských zimách zcela zamrzá.',
        pl: 'Jezioro Parawani to największe jezioro Gruzji: płytkie jezioro wulkaniczno-tektoniczne o powierzchni około 37 kilometrów kwadratowych, położone ponad 2000 metrów n.p.m. na płaskowyżu Dżawachetia. Mimo rozmiarów ma zaledwie kilka metrów głębokości, a w surowe górskie zimy zamarza całkowicie.',
      },
    },
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
    // Cover/hero = our own cliffside-path photo, replacing the generic
    // georgia-home.jpg placeholder (that file stays — 200+ other entries use it).
    // Rendered as the CSS-background hero via HeroSection image-set (webp `image` +
    // avif `imageAvif`); og:image/twitter auto-derive from `image`. Variants cap at
    // 1600w for the portraits (source is 2730x4096; no upscale, no extra variants).
    // The portrait is the hero rather than the landscape cliff-view: on the
    // full-viewport `cover` hero it crops to a ~42% mid-band on desktop, but that
    // band lands coherently on the carved facade, door and path (nothing truncated
    // at both ends) and mobile shows it in full — whereas the landscape carries
    // power lines across its lower frame, which a full-screen hero would show.
    image: '/images/files/mghvimevi-monastery-cliff-path-imereti-georgia-1600w.webp',
    imageAvif: '/images/files/mghvimevi-monastery-cliff-path-imereti-georgia-1600w.avif',
    // Contextual body photos (our own). The 2 non-hero images render as real inline
    // <figure> blocks embedded in the per-locale body HTML (pages.json), matched to
    // their descriptions. `imageObjects` feeds ONE ImageObject per photo into the
    // SitePage JSON-LD @graph (brand credit Hikasus Travel; the cover flagged hero →
    // representativeOfPage). contentUrl uses the largest shipped variant (`width`w).
    // Region is Imereti, locality Chiatura. Verbatim from the image SEO package
    // (REPLACE-BRAND → Hikasus Travel). Filenames are distinct from the Chiatura
    // page's own mghvimevi-monastery-chiatura-imereti-georgia — both sets kept; the
    // package's 4th upload was dropped as a near-duplicate of it and is not here.
    imageObjects: [
      {
        base: 'mghvimevi-monastery-cliff-path-imereti-georgia', width: 1600, height: 2401, hero: true,
        name: 'Mghvimevi Monastery cliffside path and carved facade, Imereti, Georgia',
        caption: 'The carved stone facade of Mghvimevi Monastery and its cliffside path under an overhanging rock',
        description: 'The narrow cliffside path beneath an overhanging rock at Mghvimevi Monastery, past the richly carved stone facade of the church; the monastery was founded in the second half of the 13th century in the Kvirila gorge near Chiatura, Imereti, Georgia.',
        locationName: 'Mghvimevi Monastery', locality: 'Chiatura', region: 'Imereti', geo: { lat: 42.2969, lng: 43.2789 },
      },
      {
        base: 'mghvimevi-monastery-cliff-view-imereti-georgia', width: 2400, height: 1600,
        name: 'Mghvimevi Monastery on the cliff above Chiatura, Imereti, Georgia',
        caption: 'Mghvimevi Monastery on its limestone cliff above the houses of Chiatura in autumn',
        description: 'Mghvimevi Monastery on a limestone cliff at the eastern edge of Chiatura above the Kvirila gorge, reached by a long stairway and a narrow cliff path, Imereti, Georgia.',
        locationName: 'Mghvimevi Monastery', locality: 'Chiatura', region: 'Imereti', geo: { lat: 42.2969, lng: 43.2789 },
      },
      {
        base: 'mghvimevi-monastery-carved-doorway-imereti-georgia', width: 1600, height: 2401,
        name: 'Carved doorway at Mghvimevi Monastery, Imereti, Georgia',
        caption: 'Carved wooden doors of a church at Mghvimevi Monastery open onto the autumn gorge',
        description: 'Carved wooden doors inside Mghvimevi Monastery opening onto the Kvirila gorge; the 13th-century church retains fragments of frescoes including portraits of its founders, Imereti, Georgia.',
        locationName: 'Mghvimevi Monastery', locality: 'Chiatura', region: 'Imereti', geo: { lat: 42.2969, lng: 43.2789 },
      },
    ],
  },
  {
    slug: 'chiatura-cable-cars', name: 'Chiatura Cable Cars',
    parentType: 'city', parent: 'chiatura', published: true,
    seoKey: 'chiaturaCableCars', contentKey: 'chiaturaCableCars',
    // Hero: real Chiatura cable car (NEW 2021 POMA gondola, owner's own photo) via
    // the .hero--chiatura image-set() ladder (styles.css). `image`/`imageAvif` =
    // the 1536 top rung; the CSS class controls the visible background, and
    // `image` feeds the ImageObject contentUrl (1536 rung, per package). Native
    // ceiling 1536 — ladder 768/1200/1536, NO 1600/2400 rung.
    image: '/images/files/chiatura-cable-car-gondola-georgia-1536.webp',
    imageAvif: '/images/files/chiatura-cable-car-gondola-georgia-1536.avif',
    heroClass: 'hero--chiatura',
    // Dedicated 1.91:1 social-share image (og:image / twitter:image), .jpg default.
    ogImage: { src: '/images/files/chiatura-cable-car-gondola-georgia-og.jpg', width: 1200, height: 630 },
    // Image SEO/AEO metadata (owner's own photo → brand credit, set by SitePage).
    // Hero is a CSS background (no <img alt>), so the localized alt lives here and
    // is emitted as the ImageObject caption + og:image:alt/twitter:image:alt per
    // locale. Verbatim from chiatura-cable-car-hero-package.md. width/height =
    // 1536 rung. Coordinates approximate per package.
    imageMeta: {
      width: 1536, height: 1024,
      name: 'A cable-car gondola and tower above the forested hillside town of Chiatura, Imereti, Georgia',
      description: "A modern enclosed cable-car gondola hangs from a galvanised-steel tower above the forested slopes of Chiatura, with the town's houses climbing the hillside behind and autumn trees around. Chiatura is a manganese-mining town in the Kvirila River gorge in the Imereti region of Georgia (the country); its Soviet-era ropeway network was rebuilt with new lines opened in 2021.",
      locationName: 'Chiatura, Imereti, Georgia',
      locality: 'Chiatura', region: 'Imereti', country: 'GE',
      geo: { lat: 42.2897, lng: 43.2869 },
      alt: {
        en: 'A cable-car gondola and tower above the forested hillside town of Chiatura, Imereti, Georgia',
        de: 'Eine Seilbahnkabine und ein Seilbahnmast über der bewaldeten Hangstadt Tschiatura, Imereti, Georgien',
        fr: 'Une cabine de téléphérique et son pylône au-dessus de la ville en pente boisée de Tchiatoura, Iméréthie, Géorgie',
        es: 'Una cabina de teleférico y su torre sobre la ciudad boscosa en ladera de Chiatura, Imereti, Georgia',
        nl: 'Een kabelbaancabine en -mast boven het beboste heuvelstadje Chiatura, Imereti, Georgië',
        cs: 'Kabina lanovky a stožár nad zalesněným svahovým městem Čiatura, Imereti, Gruzie',
        pl: 'Kabina kolejki linowej i słup nad zalesionym, położonym na zboczu miastem Cziatura, Imeretia, Gruzja',
      },
    },
  },
  {
    slug: 'bagrati-cathedral', name: 'Bagrati Cathedral',
    parentType: 'city', parent: 'kutaisi', published: true,
    seoKey: 'bagratiCathedral', contentKey: 'bagratiCathedral',
    // Hero: real Bagrati Cathedral (post-2012 reconstruction, owner's own photo)
    // via the .hero--bagrati image-set() ladder (styles.css). 16:9 source; `image`/
    // `imageAvif` = the 1600 top rung; the CSS class controls the visible
    // background, and `image` feeds the ImageObject contentUrl (1600 rung, per
    // package). Ladder 768/1200/1600 — native is 1672 but the top rung is 1600;
    // NO 2400 or 1672 rung. (The old bagrati-cathedral.jpg stays — still used by
    // the Imereti region page.) No UNESCO claim in the schema (delisted 2017).
    image: '/images/files/bagrati-cathedral-kutaisi-georgia-1600.webp',
    imageAvif: '/images/files/bagrati-cathedral-kutaisi-georgia-1600.avif',
    heroClass: 'hero--bagrati',
    // Dedicated 1.91:1 social-share image (og:image / twitter:image), .jpg default.
    ogImage: { src: '/images/files/bagrati-cathedral-kutaisi-georgia-og.jpg', width: 1200, height: 630 },
    // Image SEO/AEO metadata (owner's own photo → brand credit, set by SitePage).
    // Hero is a CSS background (no <img alt>), so the localized alt lives here and
    // is emitted as the ImageObject caption + og:image:alt/twitter:image:alt per
    // locale. Verbatim from bagrati-cathedral-hero-package.md. width/height = the
    // 1600 rung (1600x900, not the native 1672). Coordinates per package.
    imageMeta: {
      width: 1600, height: 900,
      name: 'Bagrati Cathedral in Kutaisi, a large stone cross-dome church with turquoise roofs on Ukimerioni Hill, Georgia',
      description: 'Bagrati Cathedral on Ukimerioni Hill in Kutaisi, a large cross-in-square stone cathedral of pale limestone with turquoise metal roofs and dome, an arched entrance portico and a separate bell tower, shown in its reconstructed form. Founded by King Bagrat III in the early 11th century, it stands above the Rioni River in Kutaisi, in the Imereti region of Georgia (the country).',
      locationName: 'Bagrati Cathedral, Ukimerioni Hill, Kutaisi, Imereti, Georgia',
      locality: 'Kutaisi', region: 'Imereti', country: 'GE',
      geo: { lat: 42.2773, lng: 42.7043 },
      alt: {
        en: 'Bagrati Cathedral in Kutaisi, a large stone cross-dome church with turquoise roofs on Ukimerioni Hill, Georgia',
        de: 'Die Bagrati-Kathedrale in Kutaissi, eine große steinerne Kreuzkuppelkirche mit türkisen Dächern auf dem Ukimerioni-Hügel, Georgien',
        fr: "La cathédrale de Bagrati à Koutaïssi, grande église en pierre à coupole aux toits turquoise, sur la colline d'Oukimérioni, Géorgie",
        es: 'La catedral de Bagrati en Kutaisi, una gran iglesia de piedra con cúpula y tejados turquesa en la colina de Ukimerioni, Georgia',
        nl: 'De Bagrati-kathedraal in Koetaisi, een grote stenen kruiskoepelkerk met turquoise daken op de Ukimerioni-heuvel, Georgië',
        cs: 'Katedrála Bagrati v Kutaisi, velký kamenný křížový chrám s tyrkysovými střechami na kopci Ukimerioni, Gruzie',
        pl: 'Katedra Bagrati w Kutaisi, duży kamienny kościół z kopułą i turkusowymi dachami na wzgórzu Ukimerioni, Gruzja',
      },
    },
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
    // Hero: real Green Bazaar interior (owner's own photo) via the
    // .hero--kutaisi-bazaar image-set() ladder (styles.css). `image`/`imageAvif`
    // = the 1448 top rung; the CSS class controls the visible background, and
    // `image` feeds the ImageObject contentUrl (1448 rung, per package). Native
    // ceiling 1448 — ladder 768/1200/1448, NO 1600/2400 rung.
    image: '/images/files/kutaisi-green-bazaar-produce-stalls-georgia-1448.webp',
    imageAvif: '/images/files/kutaisi-green-bazaar-produce-stalls-georgia-1448.avif',
    heroClass: 'hero--kutaisi-bazaar',
    // Dedicated 1.91:1 social-share image (og:image / twitter:image), .jpg default.
    ogImage: { src: '/images/files/kutaisi-green-bazaar-produce-stalls-georgia-og.jpg', width: 1200, height: 630 },
    // Image SEO/AEO metadata (owner's own photo → brand credit, set by SitePage).
    // Hero is a CSS background (no <img alt>), so the localized alt lives here and
    // is emitted as the ImageObject caption + og:image:alt/twitter:image:alt per
    // locale. Verbatim from kutaisi-green-bazaar-hero-package.md. width/height =
    // 1448 rung. Coordinates approximate per package.
    imageMeta: {
      width: 1448, height: 1086,
      name: 'Produce stalls under the yellow steel roof of the Kutaisi Green Bazaar covered market, Imereti, Georgia',
      description: "Inside the Kutaisi Green Bazaar, the city's main covered agricultural market: produce stalls piled with vegetables and fruit line a stone-paved aisle beneath a yellow steel-truss roof, with vendors and shoppers among the stalls. The market stands on Paliashvili Street in Kutaisi, capital of the Imereti region of Georgia (the country).",
      locationName: 'Kutaisi Green Bazaar, Paliashvili Street, Kutaisi, Imereti, Georgia',
      locality: 'Kutaisi', region: 'Imereti', country: 'GE',
      geo: { lat: 42.2662, lng: 42.7050 },
      alt: {
        en: 'Produce stalls under the yellow steel roof of the Kutaisi Green Bazaar covered market, Imereti, Georgia',
        de: 'Gemüsestände unter dem gelben Stahldach der überdachten Markthalle des Grünen Basars von Kutaissi, Imereti, Georgien',
        fr: 'Étals de produits frais sous la charpente d\'acier jaune du marché couvert du Bazar vert de Koutaïssi, Iméréthie, Géorgie',
        es: 'Puestos de productos bajo la estructura de acero amarillo del mercado cubierto del Bazar Verde de Kutaisi, Imereti, Georgia',
        nl: 'Groente- en fruitkramen onder het gele stalen dak van de overdekte markt Groene Bazaar van Koetaisi, Imereti, Georgië',
        cs: 'Stánky s produkty pod žlutou ocelovou konstrukcí kryté tržnice Zelený bazar v Kutaisi, Imereti, Gruzie',
        pl: 'Stoiska z produktami pod żółtą stalową konstrukcją zadaszonego targu Zielony Bazar w Kutaisi, Imeretia, Gruzja',
      },
    },
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
    pages.push({
      path: cleanPath(cityPath(c.slug)), seoKey: c.seoKey, image: c.image,
      // Optional image-SEO extras (only cities that define them, e.g. Mestia):
      // dedicated social image + dimensions + per-locale alt for the static
      // og:image / og:image:alt tags. Mirrors the sites branch below.
      ogImage: c.ogImage?.src, ogImageWidth: c.ogImage?.width, ogImageHeight: c.ogImage?.height,
      imageAlt: c.imageMeta?.alt,
    })
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
