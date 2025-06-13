export const travelTimes = {
    // 1. Delhi-Jaipur route (280km)
    'Delhi-Jaipur': {
      'Delhi-Gurgaon': 45,
      'Gurgaon-Behror': 75,
      'Behror-Kishangarh': 90,
      'Kishangarh-Ajmer': 45,
      'Ajmer-Jaipur': 120
    },
    'Jaipur-Delhi': {
      'Jaipur-Ajmer': 120,
      'Ajmer-Kishangarh': 45,
      'Kishangarh-Behror': 90,
      'Behror-Gurgaon': 75,
      'Gurgaon-Delhi': 45
    },

    // 2. Delhi-Chandigarh route (250km)
    'Delhi-Chandigarh': {
      'Delhi-Panipat': 60,
      'Panipat-Karnal': 45,
      'Karnal-Ambala': 60,
      'Ambala-Chandigarh': 45
    },
    'Chandigarh-Delhi': {
      'Chandigarh-Ambala': 45,
      'Ambala-Karnal': 60,
      'Karnal-Panipat': 45,
      'Panipat-Delhi': 60
    },

    // 3. Delhi-Agra route (200km)
    'Delhi-Agra': {
      'Delhi-Faridabad': 30,
      'Faridabad-Mathura': 90,
      'Mathura-Agra': 60
    },
    'Agra-Delhi': {
      'Agra-Mathura': 60,
      'Mathura-Faridabad': 90,
      'Faridabad-Delhi': 30
    },

    // 4. Jaipur-Udaipur route (400km)
    'Jaipur-Udaipur': {
      'Jaipur-Ajmer': 120,
      'Ajmer-Bhilwara': 150,
      'Bhilwara-Chittorgarh': 90,
      'Chittorgarh-Udaipur': 120
    },
    'Udaipur-Jaipur': {
      'Udaipur-Chittorgarh': 120,
      'Chittorgarh-Bhilwara': 90,
      'Bhilwara-Ajmer': 150,
      'Ajmer-Jaipur': 120
    },

    // 5. Delhi-Jammu route (600km)
    'Delhi-Jammu': {
      'Delhi-Sonipat': 30,
      'Sonipat-Panipat': 30,
      'Panipat-Ludhiana': 240,
      'Ludhiana-Pathankot': 180,
      'Pathankot-Jammu': 120
    },
    'Jammu-Delhi': {
      'Jammu-Pathankot': 120,
      'Pathankot-Ludhiana': 180,
      'Ludhiana-Panipat': 240,
      'Panipat-Sonipat': 30,
      'Sonipat-Delhi': 30
    },

    // 6. Delhi-Dehradun route (250km)
    'Delhi-Dehradun': {
      'Delhi-Ghaziabad': 30,
      'Ghaziabad-Meerut': 45,
      'Meerut-Muzaffarnagar': 60,
      'Muzaffarnagar-Haridwar': 90,
      'Haridwar-Dehradun': 60
    },
    'Dehradun-Delhi': {
      'Dehradun-Haridwar': 60,
      'Haridwar-Muzaffarnagar': 90,
      'Muzaffarnagar-Meerut': 60,
      'Meerut-Ghaziabad': 45,
      'Ghaziabad-Delhi': 30
    },

    // 7. Jaipur-Jodhpur route (350km)
    'Jaipur-Jodhpur': {
      'Jaipur-Ajmer': 120,
      'Ajmer-Beawar': 60,
      'Beawar-Pali': 90,
      'Pali-Jodhpur': 120
    },
    'Jodhpur-Jaipur': {
      'Jodhpur-Pali': 120,
      'Pali-Beawar': 90,
      'Beawar-Ajmer': 60,
      'Ajmer-Jaipur': 120
    },

    // 8. Delhi-Lucknow route (500km)
    'Delhi-Lucknow': {
      'Delhi-Ghaziabad': 30,
      'Ghaziabad-Aligarh': 120,
      'Aligarh-Kanpur': 180,
      'Kanpur-Lucknow': 90
    },
    'Lucknow-Delhi': {
      'Lucknow-Kanpur': 90,
      'Kanpur-Aligarh': 180,
      'Aligarh-Ghaziabad': 120,
      'Ghaziabad-Delhi': 30
    },

    // 9. Chandigarh-Manali route (300km)
    'Chandigarh-Manali': {
      'Chandigarh-Rupnagar': 45,
      'Rupnagar-Bilaspur': 90,
      'Bilaspur-Mandi': 120,
      'Mandi-Manali': 120
    },
    'Manali-Chandigarh': {
      'Manali-Mandi': 120,
      'Mandi-Bilaspur': 120,
      'Bilaspur-Rupnagar': 90,
      'Rupnagar-Chandigarh': 45
    },

    // 10. Amritsar-Delhi route (450km)
    'Amritsar-Delhi': {
      'Amritsar-Jalandhar': 60,
      'Jalandhar-Ludhiana': 60,
      'Ludhiana-Ambala': 120,
      'Ambala-Panipat': 90,
      'Panipat-Delhi': 60
    },
    'Delhi-Amritsar': {
      'Delhi-Panipat': 60,
      'Panipat-Ambala': 90,
      'Ambala-Ludhiana': 120,
      'Ludhiana-Jalandhar': 60,
      'Jalandhar-Amritsar': 60
    }
  };


export  const amenitiesList = [
  "Wi-Fi", "Water Bottle", "Charging Point", "Blanket", "Snacks", "Reading Light",
  "Air Conditioning", "Reclining Seats", "Onboard Restroom", "TV/Entertainment System",
  "USB Charging Ports", "Emergency Exit", "Fire Extinguisher", "Luggage Storage"
];
export const busStands = {
  // Delhi
  Delhi: [
    "ISBT Kashmere Gate",
    "ISBT Anand Vihar",
    "Sarai Kale Khan Bus Terminal"
  ],
  // Jaipur
  Jaipur: [
    "Sindhi Camp Bus Stand",
    "Narayan Singh Circle Bus Stand",
    "Durgapura Bus Stop"
  ],
  // Chandigarh
  Chandigarh: [
    "ISBT Sector 43",
    "ISBT Sector 17",
    "Manimajra Bus Stand"
  ],
  // Agra
  Agra: [
    "Idgah Bus Stand",
    "ISBT Agra",
    "Bijli Ghar Bus Stand"
  ],
  // Gurgaon
  Gurgaon: [
    "Gurgaon Bus Stand",
    "IFFCO Chowk Bus Stop",
    "Rajiv Chowk Bus Stop"
  ],
  // Behror
  Behror: [
    "Behror Main Bus Stand",
    "NH-48 Bypass Stop"
  ],
  // Kishangarh
  Kishangarh: [
    "Kishangarh Bus Stand",
    "Rajasthan Roadways Bus Stand"
  ],
  // Ajmer
  Ajmer: [
    "Ajmer Dargah Bus Stand",
    "Makhupura Bus Stand",
    "Madar Gate Bus Stop"
  ],
  // Panipat
  Panipat: [
    "Panipat Bus Stand",
    "Panipat Refinery Bus Stop"
  ],
  // Karnal
  Karnal: [
    "Karnal Bus Stand",
    "Kunjpura Road Bus Stop"
  ],
  // Ambala
  Ambala: [
    "Ambala Cantt Bus Stand",
    "Ambala City Bus Stand"
  ],
  // Faridabad
  Faridabad: [
    "Faridabad Bus Stand",
    "Ballabgarh Bus Stand"
  ],
  // Mathura
  Mathura: [
    "Mathura Bus Stand",
    "Krishna Janmabhoomi Bus Stop"
  ],
  // Bhilwara
  Bhilwara: [
    "Bhilwara Bus Stand",
    "Bhopal Ganj Bus Stand"
  ],
  // Chittorgarh
  Chittorgarh: [
    "Chittorgarh Bus Stand",
    "Collectorate Circle Bus Stop"
  ],
  // Udaipur
  Udaipur: [
    "Udaipur City Bus Stand",
    "Udiapole Bus Stand",
    "Hiran Magri Bus Stop"
  ],
  // Sonipat
  Sonipat: [
    "Sonipat Bus Stand",
    "Murthal Road Bus Stop"
  ],
  // Ludhiana
  Ludhiana: [
    "Ludhiana Bus Stand",
    "ISBT Ludhiana",
    "Jagraon Bridge Bus Stop"
  ],
  // Pathankot
  Pathankot: [
    "Pathankot Bus Stand",
    "Mamun Cantt Bus Stop"
  ],
  // Jammu
  Jammu: [
    "Jammu Bus Stand",
    "Narwal Bus Stand",
    "Bahu Plaza Bus Stop"
  ],
  // Ghaziabad
  Ghaziabad: [
    "Ghaziabad Bus Stand",
    "Lohia Nagar Bus Stop",
    "Old Bus Stand"
  ],
  // Meerut
  Meerut: [
    "Meerut Bus Stand",
    "Bhainsali Bus Stand",
    "Sohrab Gate Bus Stand"
  ],
  // Muzaffarnagar
  Muzaffarnagar: [
    "Muzaffarnagar Bus Stand",
    "New MZN Roadways"
  ],
  // Haridwar
  Haridwar: [
    "Haridwar Bus Stand",
    "Rishikul Bus Stop",
    "BHEL Bus Stand"
  ],
  // Dehradun
  Dehradun: [
    "Dehradun ISBT",
    "Prince Chowk Bus Stop",
    "Clock Tower Bus Stand"
  ],
  // Beawar
  Beawar: [
    "Beawar Bus Stand",
    "Ajmer Road Bus Stop"
  ],
  // Pali
  Pali: [
    "Pali Bus Stand",
    "Jawai Bandh Bus Stop"
  ],
  // Jodhpur
  Jodhpur: [
    "Jodhpur Bus Stand",
    "Paota Bus Stand",
    "Rai Ka Bagh Bus Stand"
  ],
  // Aligarh
  Aligarh: [
    "Aligarh Bus Stand",
    "Gandhi Park Bus Stop"
  ],
  // Kanpur
  Kanpur: [
    "Kanpur Bus Stand",
    "Jhakarkati Bus Stand",
    "Naubasta Bus Stop"
  ],
  // Lucknow
  Lucknow: [
    "Alambagh Bus Stand",
    "Kaiserbagh Bus Stand",
    "Charbagh Bus Stand"
  ],
  // Rupnagar
  Rupnagar: [
    "Rupnagar Bus Stand",
    "Railway Road Bus Stop"
  ],
  // Bilaspur
  Bilaspur: [
    "Bilaspur Bus Stand",
    "Nehru Chowk Bus Stop"
  ],
  // Mandi
  Mandi: [
    "Mandi Bus Stand",
    "Victoria Bridge Bus Stop"
  ],
  // Manali
  Manali: [
    "Manali Bus Stand",
    "Private Volvo Stand"
  ],
  // Amritsar
  Amritsar: [
    "Amritsar Bus Stand",
    "Golden Temple Gate Bus Stop"
  ],
  // Jalandhar
  Jalandhar: [
    "Jalandhar Bus Stand",
    "ISBT Jalandhar",
    "Hoshiarpur Chowk Bus Stop"
  ]
};


export const routePairs = [
  // 1. Delhi-Jaipur (popular route)
  {
    name: "Delhi-Jaipur Superfast",
    forward: {
      key: 'Delhi-Jaipur',
      stops: ['Gurgaon', 'Behror', 'Kishangarh', 'Ajmer'],
      isOvernight: false
    },
    reverse: {
      key: 'Jaipur-Delhi',
      stops: ['Ajmer', 'Kishangarh', 'Behror', 'Gurgaon'],
      isOvernight: false
    },
    frequency: 'daily'
  },
  // 2. Delhi-Chandigarh (mountain route)
  {
    name: "Delhi-Chandigarh Volvo",
    forward: {
      key: 'Delhi-Chandigarh',
      stops: ['Panipat', 'Karnal', 'Ambala'],
      isOvernight: false
    },
    reverse: {
      key: 'Chandigarh-Delhi',
      stops: ['Ambala', 'Karnal', 'Panipat'],
      isOvernight: false
    },
    frequency: 'daily'
  },
  // 3. Delhi-Agra (Taj Mahal route)
  {
    name: "Delhi-Agra Express",
    forward: {
      key: 'Delhi-Agra',
      stops: ['Faridabad', 'Mathura'],
      isOvernight: false
    },
    reverse: {
      key: 'Agra-Delhi',
      stops: ['Mathura', 'Faridabad'],
      isOvernight: false
    },
    frequency: 'daily'
  },
  // 4. Jaipur-Udaipur (Rajasthan route)
  {
    name: "Jaipur-Udaipur Royal",
    forward: {
      key: 'Jaipur-Udaipur',
      stops: ['Ajmer', 'Bhilwara', 'Chittorgarh'],
      isOvernight: true
    },
    reverse: {
      key: 'Udaipur-Jaipur',
      stops: ['Chittorgarh', 'Bhilwara', 'Ajmer'],
      isOvernight: true
    },
    frequency: 'daily'
  },
  // 5. Delhi-Jammu (overnight)
  {
    name: "Delhi-Jammu Deluxe",
    forward: {
      key: 'Delhi-Jammu',
      stops: ['Sonipat', 'Panipat', 'Ludhiana', 'Pathankot'],
      isOvernight: true
    },
    reverse: {
      key: 'Jammu-Delhi',
      stops: ['Pathankot', 'Ludhiana', 'Panipat', 'Sonipat'],
      isOvernight: true
    },
    frequency: 'daily'
  },
  // 6. Delhi-Dehradun (hill station)
  {
    name: "Delhi-Dehradun AC",
    forward: {
      key: 'Delhi-Dehradun',
      stops: ['Ghaziabad', 'Meerut', 'Muzaffarnagar', 'Haridwar'],
      isOvernight: false
    },
    reverse: {
      key: 'Dehradun-Delhi',
      stops: ['Haridwar', 'Muzaffarnagar', 'Meerut', 'Ghaziabad'],
      isOvernight: false
    },
    frequency: 'daily'
  },
  // 7. Jaipur-Jodhpur (desert route)
  {
    name: "Jaipur-Jodhpur Desert Queen",
    forward: {
      key: 'Jaipur-Jodhpur',
      stops: ['Ajmer', 'Beawar', 'Pali'],
      isOvernight: false
    },
    reverse: {
      key: 'Jodhpur-Jaipur',
      stops: ['Pali', 'Beawar', 'Ajmer'],
      isOvernight: false
    },
    frequency: 'daily'
  },
  // 8. Delhi-Lucknow (capital connection)
  {
    name: "Delhi-Lucknow Double Decker",
    forward: {
      key: 'Delhi-Lucknow',
      stops: ['Ghaziabad', 'Aligarh', 'Kanpur'],
      isOvernight: true
    },
    reverse: {
      key: 'Lucknow-Delhi',
      stops: ['Kanpur', 'Aligarh', 'Ghaziabad'],
      isOvernight: true
    },
    frequency: 'daily'
  },
  // 9. Chandigarh-Manali (mountain express)
  {
    name: "Chandigarh-Manali Volvo",
    forward: {
      key: 'Chandigarh-Manali',
      stops: ['Rupnagar', 'Bilaspur', 'Mandi'],
      isOvernight: false
    },
    reverse: {
      key: 'Manali-Chandigarh',
      stops: ['Mandi', 'Bilaspur', 'Rupnagar'],
      isOvernight: false
    },
    frequency: 'daily'
  },
  // 10. Amritsar-Delhi (golden temple route)
  {
    name: "Amritsar-Delhi Superfast",
    forward: {
      key: 'Amritsar-Delhi',
      stops: ['Jalandhar', 'Ludhiana', 'Ambala', 'Panipat'],
      isOvernight: true
    },
    reverse: {
      key: 'Delhi-Amritsar',
      stops: ['Panipat', 'Ambala', 'Ludhiana', 'Jalandhar'],
      isOvernight: true
    },
    frequency: 'daily'
  }
];