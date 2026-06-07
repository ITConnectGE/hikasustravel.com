export const navLinks = [
  { to: '/about-us', labelKey: 'nav.aboutUs' },
  {
    labelKey: 'nav.tours',
    children: [
      { to: '/group-tours', labelKey: 'nav.groupTours' },
      { to: '/private-tours', labelKey: 'nav.privateTours' },
    ],
  },
  {
    labelKey: 'nav.destinations',
    children: [
      { to: '/georgia', labelKey: 'nav.allDestinations' },
      { to: '/georgia/regions', labelKey: 'nav.regions' },
      { to: '/georgia/cities', labelKey: 'nav.cities' },
      { to: '/georgia/places-to-visit', labelKey: 'nav.placesToVisit' },
    ],
  },
  { to: '/about-georgia', labelKey: 'nav.aboutGeorgia' },
  { to: '/shuttle-service', labelKey: 'nav.shuttleService' },
  { to: '/contact', labelKey: 'nav.contactUs' },
]

export const footerLinks = [
  { to: '/about-us', labelKey: 'footer.about' },
  { to: '/about-georgia', labelKey: 'footer.aboutGeorgia' },
  { to: '/group-tours', labelKey: 'footer.groupTours' },
  { to: '/private-tours', labelKey: 'footer.privateTours' },
  { to: '/faq', labelKey: 'footer.faq' },
  { to: '/privacy-policy', labelKey: 'footer.privacyPolicy' },
  { to: '/terms-and-conditions', labelKey: 'footer.termsConditions' },
  { to: '/contact', labelKey: 'footer.contact' },
]

export const contactInfo = {
  address: '111a Vakhtang Gorgasali Street, Tbilisi 0114, Georgia',
  phoneBelgium: '+32 468 32 06 98',
  phoneGeorgia: '+995 551 098 077',
  email: 'info@hikasustravel.com',
  instagramUrl: 'https://www.instagram.com/hikasus_travel',
  instagramHandle: 'hikasus_travel',
}
