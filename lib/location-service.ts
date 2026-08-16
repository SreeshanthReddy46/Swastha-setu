export interface KnownLocation {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  aliases: string[];
}

export const KNOWN_INDIAN_LOCATIONS: KnownLocation[] = [
  // Andhra Pradesh & Telangana
  {
    id: 'hyd',
    name: 'Hyderabad',
    state: 'Telangana',
    latitude: 17.3850,
    longitude: 78.4867,
    aliases: ['hyderabad', 'secunderabad', 'హైదరాబాద్', 'हैदराबाद', 'hyderabadu', 'cyberabad', 'afzalgunj', 'musheerabad', 'koti']
  },
  {
    id: 'tirupati',
    name: 'Tirupati',
    state: 'Andhra Pradesh',
    latitude: 13.6288,
    longitude: 79.4192,
    aliases: ['tirupati', 'తిరుపతి', 'तिरुपति', 'svims', 'ruia', 'alipiri', 'renigunta', 'chandragiri']
  },
  {
    id: 'chittoor',
    name: 'Chittoor',
    state: 'Andhra Pradesh',
    latitude: 13.2172,
    longitude: 79.1003,
    aliases: ['chittoor', 'చిత్తూరు', 'चित्तूर', 'chittor', 'palamaner', 'pakala', 'kanipakam']
  },
  {
    id: 'vizag',
    name: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    latitude: 17.6868,
    longitude: 83.2185,
    aliases: ['visakhapatnam', 'vizag', 'విశాఖపట్నం', 'విశాఖ', 'विशाखापट्टनम', 'waltair', 'gajuwaka', 'kgh']
  },
  {
    id: 'vijayawada',
    name: 'Vijayawada',
    state: 'Andhra Pradesh',
    latitude: 16.5062,
    longitude: 80.6480,
    aliases: ['vijayawada', 'విజయవాడ', 'विजयवाड़ा', 'bezawada', 'gannavaram', 'mangalagiri']
  },
  {
    id: 'guntur',
    name: 'Guntur',
    state: 'Andhra Pradesh',
    latitude: 16.3067,
    longitude: 80.4365,
    aliases: ['guntur', 'గుంటూరు', 'गुंटूर', 'tenali', 'narasaraopet']
  },
  {
    id: 'warangal',
    name: 'Warangal',
    state: 'Telangana',
    latitude: 17.9689,
    longitude: 79.5941,
    aliases: ['warangal', 'వరంగల్', 'वारंगल', 'hanamkonda', 'kazipet', 'mgm']
  },
  {
    id: 'medak',
    name: 'Medak',
    state: 'Telangana',
    latitude: 18.0461,
    longitude: 78.2612,
    aliases: ['medak', 'మెదక్', 'मेडक', 'sangareddy', 'narsapur']
  },
  {
    id: 'siddipet',
    name: 'Siddipet',
    state: 'Telangana',
    latitude: 18.1018,
    longitude: 78.8520,
    aliases: ['siddipet', 'సిద్దిపేట', 'सिद्दिपेट', 'gajwel', 'dubbak']
  },
  {
    id: 'madanapalle',
    name: 'Madanapalle',
    state: 'Andhra Pradesh',
    latitude: 13.5512,
    longitude: 78.5034,
    aliases: ['madanapalle', 'మదనపల్లె', 'मदनपल्ले', 'annamayya', 'rayachoti', 'horsley hills']
  },

  // Delhi NCR
  {
    id: 'delhi',
    name: 'New Delhi',
    state: 'Delhi',
    latitude: 28.6139,
    longitude: 77.2090,
    aliases: ['delhi', 'new delhi', 'नई दिल्ली', 'दिल्ली', 'aiims delhi', 'safdarjung', 'noida', 'gurgaon', 'gurugram', 'faridabad', 'ghaziabad', 'south delhi', 'dwarka', 'rohini', 'connaught place']
  },

  // Karnataka
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    latitude: 12.9716,
    longitude: 77.5946,
    aliases: ['bengaluru', 'bangalore', 'ಬೆಂಗಳೂರು', 'बैंगलोर', 'बेंगलुरु', 'nimhans', 'victoria hospital', 'whitefield', 'koramangala', 'indiranagar', 'jayanagar', 'electronic city', 'hebbal']
  },
  {
    id: 'mysuru',
    name: 'Mysuru',
    state: 'Karnataka',
    latitude: 12.2958,
    longitude: 76.6394,
    aliases: ['mysuru', 'mysore', 'ಮೈಸೂರು', 'मैसूर', 'kr hospital']
  },
  {
    id: 'mangalore',
    name: 'Mangaluru',
    state: 'Karnataka',
    latitude: 12.9141,
    longitude: 74.8560,
    aliases: ['mangalore', 'mangaluru', 'ಮಂಗಳೂರು', 'मंगलोर', 'wenlock', 'surathkal', 'udupi']
  },

  // Tamil Nadu
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    latitude: 13.0827,
    longitude: 80.2707,
    aliases: ['chennai', 'madras', 'சென்னை', 'चेन्नई', 'mmc', 'rajiv gandhi hospital', 'tambaram', 'guindy', 'adyar', 'anna nagar', 'egmore', 'central']
  },
  {
    id: 'madurai',
    name: 'Madurai',
    state: 'Tamil Nadu',
    latitude: 9.9252,
    longitude: 78.1198,
    aliases: ['madurai', 'மதுரை', 'मदुरै', 'rajaji hospital', 'grh']
  },
  {
    id: 'coimbatore',
    name: 'Coimbatore',
    state: 'Tamil Nadu',
    latitude: 11.0168,
    longitude: 76.9558,
    aliases: ['coimbatore', 'கோயம்புத்தூர்', 'கோவை', 'कोयंबटूर', 'cmch', 'pollachi', 'tirupur']
  },

  // Maharashtra
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    latitude: 19.0760,
    longitude: 72.8777,
    aliases: ['mumbai', 'bombay', 'मुंबई', 'kem hospital', 'tata memorial', 'parel', 'bandra', 'andheri', 'dadar', 'thane', 'navi mumbai', 'borivali', 'kurla']
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    latitude: 18.5204,
    longitude: 73.8567,
    aliases: ['pune', 'poona', 'पुणे', 'sassoon', 'kothrud', 'shivajinagar', 'hadapsar', 'pcmc', 'pimpri', 'chinchwad', 'wakad', 'hinjewadi']
  },
  {
    id: 'nagpur',
    name: 'Nagpur',
    state: 'Maharashtra',
    latitude: 21.1458,
    longitude: 79.0882,
    aliases: ['nagpur', 'नागपुर', 'gmch nagpur', 'aiims nagpur']
  },

  // West Bengal
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    latitude: 22.5726,
    longitude: 88.3639,
    aliases: ['kolkata', 'calcutta', 'কলকাতা', 'कोलकाता', 'sskm', 'calcutta medical college', 'howrah', 'salt lake', 'new town', 'sealdah', 'dum dum']
  },

  // Uttar Pradesh
  {
    id: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    latitude: 26.8467,
    longitude: 80.9462,
    aliases: ['lucknow', 'लखनऊ', 'kgmu', 'sgpgi', 'hazratganj', 'gomti nagar', 'alambagh', 'charbagh']
  },
  {
    id: 'raebareli',
    name: 'Rae Bareli',
    state: 'Uttar Pradesh',
    latitude: 26.2236,
    longitude: 81.2403,
    aliases: ['rae bareli', 'raebareli', 'रायबरेली', 'aiims raebareli', 'munshiganj', 'lalganj']
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    latitude: 25.3176,
    longitude: 82.9739,
    aliases: ['varanasi', 'banaras', 'kashi', 'वाराणसी', 'बनारस', 'काशी', 'bhu', 'sunderlal hospital']
  },
  {
    id: 'kanpur',
    name: 'Kanpur',
    state: 'Uttar Pradesh',
    latitude: 26.4499,
    longitude: 80.3319,
    aliases: ['kanpur', 'कानपुर', 'gsvm', 'hallet']
  },
  {
    id: 'agra',
    name: 'Agra',
    state: 'Uttar Pradesh',
    latitude: 27.1767,
    longitude: 78.0081,
    aliases: ['agra', 'आगरा', 'sn medical college']
  },
  {
    id: 'prayagraj',
    name: 'Prayagraj',
    state: 'Uttar Pradesh',
    latitude: 25.4358,
    longitude: 81.8463,
    aliases: ['prayagraj', 'allahabad', 'प्रयागराज', 'इलाहाबाद', 'srn hospital', 'mln medical college']
  },

  // Bihar
  {
    id: 'patna',
    name: 'Patna',
    state: 'Bihar',
    latitude: 25.5941,
    longitude: 85.1376,
    aliases: ['patna', 'पटना', 'aiims patna', 'pmch', 'danapur', 'phulwarisharif', 'kankarbagh']
  },
  {
    id: 'muzaffarpur',
    name: 'Muzaffarpur',
    state: 'Bihar',
    latitude: 26.1209,
    longitude: 85.3647,
    aliases: ['muzaffarpur', 'मुजफ्फरपुर', 'skmch', 'sadar hospital muzaffarpur']
  },

  // Odisha
  {
    id: 'bhubaneswar',
    name: 'Bhubaneswar',
    state: 'Odisha',
    latitude: 20.2961,
    longitude: 85.8245,
    aliases: ['bhubaneswar', 'ଭୁବନେଶ୍ୱର', 'भुवनेश्वर', 'aiims bhubaneswar', 'capital hospital', 'khurda', 'patia', 'khandagiri']
  },
  {
    id: 'cuttack',
    name: 'Cuttack',
    state: 'Odisha',
    latitude: 20.4625,
    longitude: 85.8828,
    aliases: ['cuttack', 'କଟକ', 'कटक', 'scb medical college', 'mangalabag']
  },

  // Rajasthan
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    latitude: 26.9124,
    longitude: 75.7873,
    aliases: ['jaipur', 'जयपुर', 'sms hospital', 'pink city', 'vaishali nagar', 'mansarovar', 'malviya nagar']
  },
  {
    id: 'jodhpur',
    name: 'Jodhpur',
    state: 'Rajasthan',
    latitude: 26.2389,
    longitude: 73.0243,
    aliases: ['jodhpur', 'जोधपुर', 'aiims jodhpur', 'snmc jodhpur']
  },

  // Gujarat
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    latitude: 23.0225,
    longitude: 72.5714,
    aliases: ['ahmedabad', 'અમદાવાદ', 'અમદાવાદ', 'अहमदाबाद', 'civil hospital ahmedabad', 'bjmc', 'gandhinagar', 'maninagar', 'sg highway', 'navrangpura']
  },
  {
    id: 'surat',
    name: 'Surat',
    state: 'Gujarat',
    latitude: 21.1702,
    longitude: 72.8311,
    aliases: ['surat', 'સુરત', 'सूरत', 'smimer', 'new civil hospital surat']
  },

  // Kerala
  {
    id: 'kozhikode',
    name: 'Kozhikode',
    state: 'Kerala',
    latitude: 11.2588,
    longitude: 75.7804,
    aliases: ['kozhikode', 'calicut', 'കോഴിക്കോട്', 'कोझिकोड', 'calicut medical college', 'mch calicut']
  },
  {
    id: 'kochi',
    name: 'Kochi',
    state: 'Kerala',
    latitude: 9.9312,
    longitude: 76.2673,
    aliases: ['kochi', 'cochin', 'കൊച്ചി', 'कोच्चि', 'ernakulam', 'kalamassery', 'kakkanad', 'edappally']
  },
  {
    id: 'thiruvananthapuram',
    name: 'Thiruvananthapuram',
    state: 'Kerala',
    latitude: 8.5241,
    longitude: 76.9366,
    aliases: ['thiruvananthapuram', 'trivandrum', 'തിരുവനന്തപുരം', 'तिरुवनंतपुरम', 'mch trivandrum', 'sree chitra']
  },

  // Madhya Pradesh
  {
    id: 'bhopal',
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    latitude: 23.2599,
    longitude: 77.4126,
    aliases: ['bhopal', 'भोपाल', 'aiims bhopal', 'gmc bhopal', 'hamidia']
  },
  {
    id: 'indore',
    name: 'Indore',
    state: 'Madhya Pradesh',
    latitude: 22.7196,
    longitude: 75.8577,
    aliases: ['indore', 'इंदौर', 'my hospital', 'mgmmc indore', 'vijay nagar']
  },

  // Punjab / Chandigarh / Haryana
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    state: 'Chandigarh',
    latitude: 30.7333,
    longitude: 76.7794,
    aliases: ['chandigarh', 'चंडीगढ़', 'ਚੰਡੀਗੜ੍ਹ', 'pgimer', 'pgi chandigarh', 'gmch 32', 'mohali', 'panchkula']
  },

  // Assam / North East
  {
    id: 'guwahati',
    name: 'Guwahati',
    state: 'Assam',
    latitude: 26.1445,
    longitude: 91.7362,
    aliases: ['guwahati', 'gauhati', 'গুৱাহাটী', 'गुवाहाटी', 'gmch guwahati', 'dispur', 'aiims guwahati']
  },

  // Jharkhand
  {
    id: 'ranchi',
    name: 'Ranchi',
    state: 'Jharkhand',
    latitude: 23.3441,
    longitude: 85.3096,
    aliases: ['ranchi', 'राँची', 'रांची', 'rims ranchi', 'doranda']
  },

  // Chhattisgarh
  {
    id: 'raipur',
    name: 'Raipur',
    state: 'Chhattisgarh',
    latitude: 21.2514,
    longitude: 81.6296,
    aliases: ['raipur', 'रायपुर', 'aiims raipur', 'mekahara']
  },

  // Uttarakhand
  {
    id: 'dehradun',
    name: 'Dehradun',
    state: 'Uttarakhand',
    latitude: 30.3165,
    longitude: 78.0322,
    aliases: ['dehradun', 'देहरादून', 'doon hospital', 'aiims rishikesh', 'rishikesh']
  },

  // Goa
  {
    id: 'panaji',
    name: 'Panaji',
    state: 'Goa',
    latitude: 15.4909,
    longitude: 73.8278,
    aliases: ['panaji', 'panjim', 'पणजी', 'goa medical college', 'bambolim', 'margao']
  }
];

/**
 * Scan natural language user text (transcription or symptom list) to detect spoken/written city or landmark.
 */
export function detectLocationFromText(text: string): KnownLocation | null {
  if (!text) return null;
  const clean = text.toLowerCase().replace(/[,.:;!?'"()]/g, ' ');
  const words = clean.split(/\s+/).filter(Boolean);

  // Direct alias matching (longest phrases first)
  for (const loc of KNOWN_INDIAN_LOCATIONS) {
    for (const alias of loc.aliases) {
      if (alias.includes(' ')) {
        if (clean.includes(alias.toLowerCase())) {
          return loc;
        }
      } else {
        if (words.includes(alias.toLowerCase())) {
          return loc;
        }
      }
    }
  }

  return null;
}

/**
 * Find location by coordinates or return the closest known city name.
 */
export function findClosestCityName(lat: number, lng: number): string {
  let closest = KNOWN_INDIAN_LOCATIONS[0];
  let minDistance = Infinity;

  for (const loc of KNOWN_INDIAN_LOCATIONS) {
    const dLat = (lat - loc.latitude) * Math.PI / 180;
    const dLng = (lng - loc.longitude) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat * Math.PI / 180) * Math.cos(loc.latitude * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = 6371 * c;

    if (dist < minDistance) {
      minDistance = dist;
      closest = loc;
    }
  }

  if (minDistance <= 60) {
    return `${closest.name}, ${closest.state}`;
  }
  return `${lat.toFixed(2)}° N, ${lng.toFixed(2)}° E`;
}
