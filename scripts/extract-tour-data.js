import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import * as cheerio from 'cheerio'

const HTML_DIR = join(import.meta.dirname, '..', '..', 'hikasustravel.com')
const OUTPUT_FILE = join(import.meta.dirname, '..', 'src', 'data', 'tours.js')

function getHtmlFilename(slug, type) {
  if (type === 'group') return `group-tours-${slug}.html`
  return `private-tours-${slug}.html`
}

function extractItinerary($) {
  const items = []
  $('.itinerary-item').each((i, el) => {
    const $el = $(el)
    const title = $el.find('h3').text().trim()
    const content = $el.find('.itinerary-content').html()?.trim() || ''
    if (title) items.push({ title, content })
  })
  return items
}

function extractAccommodations($) {
  const rows = []
  // Actual HTML structure: <div class='pricing-grid-row pricing-hotels-row'>
  //   <div class='pricing-travelers'>City</div>
  //   <div class='pricing-luxury'>Hotel</div>
  //   <div class='pricing-midrange'>Hotel</div>
  //   <div class='pricing-economy'>Hotel</div>
  // </div>
  $('.pricing-grid-row.pricing-hotels-row').each((i, el) => {
    const $el = $(el)
    const city = $el.find('.pricing-travelers').text().trim()
    const luxury = $el.find('.pricing-luxury').text().trim()
    const midRange = $el.find('.pricing-midrange').text().trim()
    const economy = $el.find('.pricing-economy').text().trim()
    if (city) rows.push({ city, luxury, midRange, economy })
  })
  return rows
}

function extractPricing($) {
  const rows = []
  // Find pricing rows that are NOT hotel rows and NOT header rows
  // Structure: <div class='pricing-grid-row'>
  //   <div class='pricing-travelers'>1</div>
  //   <div class='pricing-luxury'>€2270</div>
  //   <div class='pricing-midrange'>€1930</div>
  //   <div class='pricing-economy'>€1750</div>
  // </div>
  // They appear inside .pricing-grid.pricing-grid-travelers
  const pricingGrid = $('.pricing-grid-travelers')
  if (!pricingGrid.length) return rows

  pricingGrid.find('.pricing-grid-row').each((i, el) => {
    const $el = $(el)
    if ($el.hasClass('pricing-grid-header') || $el.hasClass('pricing-hotels-row')) return
    const travelers = $el.find('.pricing-travelers').text().trim()
    const luxury = $el.find('.pricing-luxury').text().trim()
    const midRange = $el.find('.pricing-midrange').text().trim()
    const economy = $el.find('.pricing-economy').text().trim()
    if (travelers && travelers !== 'Number of travelers' && travelers !== '') {
      rows.push({ travelers, luxury, midRange, economy })
    }
  })
  return rows
}

function extractIncluded($) {
  const items = []
  // Structure: <div class="included-notincluded">
  //   <div class="list">
  //     <h2>What's Included</h2>
  //     <div><ul><li>...</li></ul></div>
  //   </div>
  //   <div class="list">
  //     <h2>What's Not Included</h2>
  //     ...
  //   </div>
  // </div>
  $('.included-notincluded .list').each((i, el) => {
    const $el = $(el)
    const heading = $el.find('h2').text().trim().toLowerCase()
    if (heading.includes('not included')) return // skip "not included"
    if (heading.includes('included')) {
      $el.find('ul li').each((j, li) => {
        const t = $(li).text().trim()
        if (t) items.push(t)
      })
    }
  })
  return items
}

function extractNotIncluded($) {
  const items = []
  $('.included-notincluded .list').each((i, el) => {
    const $el = $(el)
    const heading = $el.find('h2').text().trim().toLowerCase()
    if (heading.includes('not included')) {
      $el.find('ul li').each((j, li) => {
        const t = $(li).text().trim()
        if (t) items.push(t)
      })
    }
  })
  return items
}

function extractGallery($) {
  const items = []
  $('.gallery-cell').each((i, el) => {
    const $el = $(el)
    const img = $el.find('img')
    const src = img.attr('src') || img.attr('data-flickity-lazyload') || ''
    const caption = $el.find('.gallery-caption').text().trim() || ''
    if (src) {
      const normalizedSrc = src.startsWith('/') ? src : '/' + src
      items.push({ src: normalizedSrc, caption })
    }
  })
  return items
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\\'/g, "'")
}

function extractMap($, html) {
  const map = {
    center: [44.0, 42.0],
    zoom: 7,
    markers: [],
    routeCoordinates: [],
  }

  // Extract initializeTourMap call: initializeTourMap('tour-map', lat, lng, zoom, title)
  const initMatch = html.match(/initializeTourMap\s*\(\s*['"][^'"]+['"]\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*(\d+)/)
  if (initMatch) {
    const lat = parseFloat(initMatch[1])
    const lng = parseFloat(initMatch[2])
    map.center = [lng, lat]
    map.zoom = parseInt(initMatch[3])
  }

  // Extract marker coordinates from addCustomMarker calls
  // addCustomMarker(map, [lng, lat], 'img/pennant.svg', 20, 20, 0, -10)
  const markerCoords = []
  const markerRegex = /addCustomMarker\s*\(\s*map\s*,\s*\[\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\]/g
  let m
  while ((m = markerRegex.exec(html)) !== null) {
    markerCoords.push([parseFloat(m[1]), parseFloat(m[2])])
  }

  // Extract locationData array - has {title, text} entries matched by index to markers
  const locationDataMatch = html.match(/const\s+locationData\s*=\s*\[([\s\S]*?)\];/)
  const locationEntries = []
  if (locationDataMatch) {
    // Parse {title: "...", text: "..."} entries
    const entryRegex = /\{\s*title:\s*"([^"]*)"\s*,\s*text:\s*"([^"]*)"\s*\}/g
    let entry
    while ((entry = entryRegex.exec(locationDataMatch[1])) !== null) {
      locationEntries.push({
        title: decodeHtmlEntities(entry[1]),
        description: decodeHtmlEntities(entry[2]),
      })
    }
  }

  // Combine marker coordinates with location data (matched by index)
  for (let i = 0; i < markerCoords.length; i++) {
    const locData = locationEntries[i] || { title: '', description: '' }
    map.markers.push({
      coordinates: markerCoords[i],
      title: locData.title,
      description: locData.description,
    })
  }

  // Extract routeCoordinates
  const routeMatch = html.match(/(?:const\s+)?routeCoordinates\s*=\s*\[([\s\S]*?)\];/)
  if (routeMatch) {
    const coordRegex = /\[\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\]/g
    let coordMatch
    while ((coordMatch = coordRegex.exec(routeMatch[1])) !== null) {
      map.routeCoordinates.push([parseFloat(coordMatch[1]), parseFloat(coordMatch[2])])
    }
  }

  return map
}

const toursBasicData = [
  { slug: 'georgia-group-tour', type: 'group', title: 'Georgia Group Tour', heroImage: '/images/files/Gergeti-Church.jpg', days: 14, description: 'Join our expertly guided 14-day group tour through Georgia, experiencing the best of this incredible country with fellow travelers.', listingDescription: 'Join our expertly guided 14-day group tour through Georgia.' },
  { slug: 'experience-georgias-rich-culture-coastal-beauty-5-day-tour-from-tbilisi-to-batumi', type: 'private', title: "Experience Georgia's Rich Culture and Coastal Beauty: 5-Day Tour from Tbilisi to Batumi", heroImage: '/images/files/batumi-coastal-tour.jpg', days: 5, description: "Embark on a captivating 5-day journey through Georgia, starting and ending in Tbilisi, the country's vibrant capital.", listingDescription: "Embark on a captivating 5-day journey through Georgia, starting and ending in Tbilisi, the country's vibrant capital." },
  { slug: 'sulfur-baths-and-sipping-wine-5-days-of-georgian-delights', type: 'private', title: 'Sulfur Baths and Sipping Wine: 5 Days of Georgian Delights', heroImage: '/images/files/sulfur-baths-wine-tour.jpg', days: 5, description: "Delve into the heart of Georgia's rich heritage on this 5-day tour, blending historic landmarks, breathtaking landscapes, and the country's celebrated hospitality.", listingDescription: "Delve into the heart of Georgia's rich heritage on this 5-day tour, blending historic landmarks, breathtaking landscapes, and the country's celebrated hospitality." },
  { slug: 'tbilisi-to-treasures-a-6-day-journey-through-georgias-icons-and-hidden-gems', type: 'private', title: "Tbilisi to Treasures: A 6-Day Journey Through Georgia's Icons and Hidden Gems", heroImage: '/images/files/georgia-tour-02.jpg', days: 6, description: "Georgia's rich culture, history, and natural beauty await on this 6-day tour that begins and ends in the vibrant city of Tbilisi.", listingDescription: "Georgia's rich culture, history, and natural beauty await on this 6-day tour that begins and ends in the vibrant city of Tbilisi." },
  { slug: 'georgias-cultural-wonders-7-day-adventure-from-kutaisi-to-tbilisi-and-beyond', type: 'private', title: "Georgia's Cultural Wonders: 7-Day Adventure from Kutaisi to Tbilisi and Beyond", heroImage: '/images/files/cultural-wonders-kutaisi.jpg', days: 7, description: 'Immerse yourself in the captivating charm of Georgia on this 7-day cultural journey, beginning in the historic city of Kutaisi.', listingDescription: 'Immerse yourself in the captivating charm of Georgia on this 7-day cultural journey, beginning in the historic city of Kutaisi.' },
  { slug: 'experience-the-heart-of-georgia-8-day-journey-of-culture-nature-wine-tastings', type: 'private', title: 'Experience the Heart of Georgia: 8-Day Journey of Culture, Nature, Wine Tastings', heroImage: '/images/files/culture-nature-wine-tour.jpg', days: 8, description: "Immerse yourself in the best of Georgia's cultural heritage, breathtaking landscapes, and celebrated wine traditions on this 8-day tour.", listingDescription: "Immerse yourself in the best of Georgia's cultural heritage, breathtaking landscapes, and celebrated wine traditions on this 8-day tour." },
  { slug: 'immerse-yourself-in-georgia-8-day-cultural-and-adventure-journey-through-the-caucasus', type: 'private', title: 'Immerse Yourself in Georgia: 8-Day Cultural and Adventure Journey Through the Caucasus', heroImage: '/images/files/cultural-adventure-caucasus.jpg', days: 8, description: 'Dive into the wonders of Georgia on this 8-day adventure, blending cultural discovery, historic landmarks, and exhilarating outdoor activities.', listingDescription: 'Dive into the wonders of Georgia on this 8-day adventure, blending cultural discovery, historic landmarks, and exhilarating outdoor activities.' },
  { slug: 'ultimate-georgia-exploration-9-day-tour-from-kutaisi-to-tbilisi-and-hidden-gems', type: 'private', title: 'Ultimate Georgia Exploration: 9-Day Tour from Kutaisi to Tbilisi and Hidden Gems', heroImage: '/images/files/ultimate-exploration-kutaisi.jpg', days: 9, description: 'Start your Georgian journey in Kutaisi, a city steeped in history, where the serene Gelati and Motsameta Monasteries await.', listingDescription: 'Start your Georgian journey in Kutaisi, a city steeped in history, where the serene Gelati and Motsameta Monasteries await.' },
  { slug: 'wander-wonder-and-wine-9-days-of-georgias-best', type: 'private', title: "Wander, Wonder and Wine: 9 Days of Georgia's Best", heroImage: '/images/files/wander-wonder-wine-tour.jpg', days: 9, description: "Unearth the rich layers of Georgia's history, culture, and natural beauty on this 9-day adventure.", listingDescription: "Unearth the rich layers of Georgia's history, culture, and natural beauty on this 9-day adventure." },
  { slug: 'wine-wonders-and-the-caucasus-a-9-day-adventure-in-georgia', type: 'private', title: 'Wine, Wonders, and the Caucasus: A 9-Day Adventure in Georgia', heroImage: '/images/files/wine-caucasus-adventure.jpg', days: 9, description: 'Discover the essence of Georgia on this 9-day tour packed with unforgettable experiences.', listingDescription: 'Discover the essence of Georgia on this 9-day tour packed with unforgettable experiences.' },
  { slug: 'georgia-in-10-days-where-every-corner-has-a-story-and-every-meal-is-a-celebration', type: 'private', title: 'Georgia in 10 Days: Where Every Corner Has a Story and Every Meal is a Celebration', heroImage: '/images/files/georgia-10-days-celebration.jpg', days: 10, description: "This thoughtfully crafted itinerary invites you to explore Georgia's most iconic landmarks alongside its best-kept secrets.", listingDescription: "This thoughtfully crafted itinerary invites you to explore Georgia's most iconic landmarks alongside its best-kept secrets." },
  { slug: 'georgias-wonders-11-day-grand-tour-from-kutaisi-to-kazbegi-and-batumi', type: 'private', title: "Georgia's Wonders: 11-Day Grand Tour from Kutaisi to Kazbegi and Batumi", heroImage: '/images/files/georgia-wonders-grand-tour.jpg', days: 11, description: 'Begin your Georgian adventure in the vibrant city of Kutaisi, where history and natural wonders collide.', listingDescription: 'Begin your Georgian adventure in the vibrant city of Kutaisi, where history and natural wonders collide.' },
  { slug: '12-day-ultimate-georgia-adventure-tour-tbilisi-kazbegi-mestia-kutaisi-batumi', type: 'private', title: '12-Day Ultimate Georgia Adventure Tour: Tbilisi, Kazbegi, Mestia, Kutaisi, Batumi', heroImage: '/images/files/ultimate-georgia-adventure.jpg', days: 12, description: 'Embark on the ultimate Georgian adventure with this comprehensive 12-day journey through historic landmarks, breathtaking landscapes, and vibrant cities.', listingDescription: 'Embark on the ultimate Georgian adventure with this comprehensive 12-day journey through historic landmarks, breathtaking landscapes, and vibrant cities.' },
  { slug: 'grand-georgia-adventure-13-day-cultural-and-scenic-journey', type: 'private', title: 'Grand Georgia Adventure: 13-Day Cultural and Scenic Journey', heroImage: '/images/files/grand-georgia-cultural-journey.jpg', days: 13, description: "Trace the pathways of Georgia's rich history and breathtaking landscapes, starting from the historic city of Kutaisi.", listingDescription: "Trace the pathways of Georgia's rich history and breathtaking landscapes, starting from the historic city of Kutaisi." },
  { slug: 'ultimate-15-day-georgia-tour-from-tbilisi-to-svaneti--wine-culture-and-natural-beauty', type: 'private', title: 'Ultimate 15-Day Georgia Tour: From Tbilisi to Svaneti \u2013 Wine, Culture, and Natural Beauty', heroImage: '/images/files/svaneti-wine-culture-tour.jpg', days: 15, description: 'Embark on a 15-day adventure through Georgia, a land where ancient history, breathtaking landscapes, and rich traditions come together.', listingDescription: 'Embark on a 15-day adventure through Georgia, a land where ancient history, breathtaking landscapes, and rich traditions come together.' },
  { slug: 'georgia-on-my-mind-20-days-of-tasting-trekking-and-total-relaxation', type: 'private', title: 'Georgia on my Mind: 20 Days of Tasting, Trekking, and Total Relaxation', heroImage: '/images/files/georgia-20-days-relaxation.jpg', days: 20, description: 'Venture across Georgia on a 20-day adventure filled with cultural heritage, scenic landscapes, and culinary delights.', listingDescription: 'Venture across Georgia on a 20-day adventure filled with cultural heritage, scenic landscapes, and culinary delights.' },
]

function processAllTours() {
  const tours = []

  for (const tourBase of toursBasicData) {
    const filename = getHtmlFilename(tourBase.slug, tourBase.type)
    const filepath = join(HTML_DIR, filename)

    let html
    try {
      html = readFileSync(filepath, 'utf-8')
    } catch (err) {
      console.error(`Could not read ${filename}: ${err.message}`)
      tours.push({
        ...tourBase,
        tileImage: tourBase.heroImage,
        listingImage: tourBase.heroImage,
        itinerary: [],
        accommodations: [],
        pricing: [],
        included: [],
        notIncluded: [],
        gallery: [],
        map: null,
        tourFormTitle: tourBase.title,
      })
      continue
    }

    console.log(`Processing: ${filename}`)
    const $ = cheerio.load(html)

    const itinerary = extractItinerary($)
    const accommodations = extractAccommodations($)
    const pricing = extractPricing($)
    const included = extractIncluded($)
    const notIncluded = extractNotIncluded($)
    const gallery = extractGallery($)
    const map = extractMap($, html)

    const tour = {
      slug: tourBase.slug,
      type: tourBase.type,
      title: tourBase.title,
      heroImage: tourBase.heroImage,
      tileImage: tourBase.heroImage,
      listingImage: tourBase.heroImage,
      days: tourBase.days,
      description: tourBase.description,
      listingDescription: tourBase.listingDescription,
      itinerary,
      accommodations,
      pricing,
      included,
      notIncluded,
      gallery,
      map,
      tourFormTitle: tourBase.title,
    }

    // Group tour specific data
    if (tourBase.type === 'group') {
      tour.groupDates = ['June 15 - June 28, 2025', 'September 7 - September 20, 2025']
      tour.pricePerPerson = '2,450'
      tour.singleSupplement = '450'
      tour.groupSummary = [
        { label: 'Duration', value: '14 days / 13 nights' },
        { label: 'Group Size', value: 'Max 16 travelers' },
        { label: 'Available Dates', type: 'dates', values: ['June 15 - June 28, 2025', 'September 7 - September 20, 2025'] },
        { label: 'Price', value: 'From \u20AC2,450 per person' },
      ]
    }

    console.log(`  Itinerary: ${itinerary.length}, Accommodations: ${accommodations.length}, Pricing: ${pricing.length}, Included: ${included.length}, NotIncluded: ${notIncluded.length}, Gallery: ${gallery.length}, Markers: ${map.markers.length}, Route: ${map.routeCoordinates.length}`)
    tours.push(tour)
  }

  return tours
}

function generateToursFile(tours) {
  let output = '// Tour data - comprehensive data extracted from all 16 tour HTML pages\n'
  output += '// Auto-generated by scripts/extract-tour-data.js\n\n'
  output += 'export const tours = '
  output += JSON.stringify(tours, null, 2)
  output += '\n'

  writeFileSync(OUTPUT_FILE, output, 'utf-8')
  console.log(`\nWrote ${tours.length} tours to ${OUTPUT_FILE}`)
  console.log(`File size: ${(readFileSync(OUTPUT_FILE).length / 1024).toFixed(1)} KB`)
}

const tours = processAllTours()
generateToursFile(tours)
