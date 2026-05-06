/** Destination catalog, trip constraints, persisted plan shape, ranking, booking airports. */

import type { AirportRegion } from './airports'
import { US_AIRPORTS } from './airports'

export type Vibe =
  | 'beach' | 'city' | 'nature' | 'historical' | 'food' | 'nightlife'
  | 'adventure' | 'quiet' | 'tropical' | 'luxury' | 'budget-friendly'

export type Region = 'europe' | 'asia' | 'americas' | 'africa' | 'oceania' | 'caribbean'

export type TripLength = 'weekend' | '3-4 days' | '5-7 days' | '7+ days'

export interface Destination {
  id: string
  city: string
  country: string
  region: Region
  tagline: string
  vibes: Vibe[]
  flightCostByRegion: Record<AirportRegion, number>
  hotelPerNight: number
  dailySpend: number
  flightHours: number
  /** One-way drive hours when driving beats flying from that US region (rental replaces flight cost). */
  driveFromRegion?: Partial<Record<AirportRegion, number>>
  weather: string
  highlights: string[]
  activities: string[]
  bestFor: string[]
  watchOuts: string[]
  sampleDays: { label: string; items: string[] }[]
  imageGradient: string
}

export interface TripConstraints {
  budget: number
  tripLength: TripLength
  scope: 'domestic' | 'national' | 'international'
  homeCity: string
  airportCode?: string
  vibes: Vibe[]
}

export const SCOPE_LABELS: Record<TripConstraints['scope'], string> = {
  domestic: 'US only',
  national: 'North America',
  international: 'Abroad',
}

export interface BudgetRow {
  category: string
  estimate: number
  actual: string
  notes: string
}

export interface PlanActivity {
  day: number
  time: 'morning' | 'afternoon' | 'evening'
  text: string
}

export interface TripPlanState {
  budgetRows: BudgetRow[]
  activities: PlanActivity[]
  notes: string
  checks: boolean[]
}

export function effectiveSpend(row: BudgetRow): number {
  const raw = row.actual.trim()
  if (raw === '') return row.estimate
  const n = Number(raw)
  return Number.isFinite(n) ? n : row.estimate
}

/** Primary airport per destination for flight search links (IATA). */
export const DEST_AIRPORT_CODES: Record<string, string> = {
  'lisbon': 'LIS',
  'bangkok': 'BKK',
  'mexico-city': 'MEX',
  'reykjavik': 'KEF',
  'barcelona': 'BCN',
  'tokyo': 'NRT',
  'cancun': 'CUN',
  'amsterdam': 'AMS',
  'marrakech': 'RAK',
  'new-orleans': 'MSY',
  'costa-rica': 'SJO',
  'prague': 'PRG',
  'bali': 'DPS',
  'cape-town': 'CPT',
  'nashville': 'BNA',
  'porto': 'OPO',
  'montreal': 'YUL',
  'athens': 'ATH',
  'miami': 'MIA',
  'seoul': 'ICN',
  'vermont': 'BTV',
  'asheville': 'AVL',
  'sedona': 'PHX',
  'denver-colorado': 'DEN',
  'acadia': 'BGR',
  'great-smoky': 'TYS',
  'portland-oregon': 'PDX',
  'paris': 'CDG',
  'rome': 'FCO',
  'phuket': 'HKT',
  'buenos-aires': 'EZE',
  'medellin': 'MDE',
  'sydney': 'SYD',
  'dubai': 'DXB',
  'hanoi': 'HAN',
  'dubrovnik': 'DBV',
  'chiang-mai': 'CNX',
  'singapore': 'SIN',
  'kyoto': 'KIX',
  'puerto-rico': 'SJU',
  'jamaica': 'MBJ',
  'aruba': 'AUA',
  'punta-cana': 'PUJ',
  'belize': 'BZE',
  'maui': 'OGG',
  'new-york-city': 'JFK',
  'washington-dc': 'DCA',
  'austin': 'AUS',
  'chicago': 'ORD',
  'san-francisco': 'SFO',
  'savannah': 'SAV',
  'yellowstone': 'JAC',
}

/** Pickup airport for Kayak car links on drive trips — overrides gateway when a closer strip exists. */
export const DEST_DRIVE_RENTAL_AIRPORT: Partial<Record<string, string>> = {
  sedona: 'FLG',
}

export const DESTINATIONS: Destination[] = [
  {
    id: 'lisbon',
    city: 'Lisbon', country: 'Portugal', region: 'europe',
    tagline: 'Warm, walkable, wildly underrated',
    vibes: ['city', 'food', 'historical', 'budget-friendly'],
    flightCostByRegion: { northeast: 380, southeast: 430, midwest: 480, south: 500, mountain: 530, west: 590 },
    hotelPerNight: 90, dailySpend: 60,
    flightHours: 7,
    weather: 'Sunny and mild most of the year, cool winters',
    highlights: ['Alfama hillside district', 'Pastéis de Belém', 'Tram 28 route', 'Fado music nights'],
    activities: ['Explore Alfama', 'Sintra day trip', 'LX Factory market', 'Oceanarium', 'Sunset at Miradouros'],
    bestFor: ['couples', 'solo', 'food lovers', 'first Europe trip'],
    watchOuts: ['Cobblestone hills are tough on feet', 'Tourist areas get crowded in summer', 'Pickpockets on Tram 28'],
    sampleDays: [
      { label: 'Day 1', items: ['Arrive, check in Alfama', 'Sunset at Miradouro da Graça', 'Dinner at a tasca'] },
      { label: 'Day 2', items: ['Belém tower & pastéis', 'LX Factory afternoon', 'Fado dinner show'] },
      { label: 'Day 3', items: ['Sintra palace day trip', 'Back for evening in Bairro Alto'] },
      { label: 'Day 4', items: ['Oceanarium', 'Time Out Market', 'Depart'] },
    ],
    imageGradient: 'linear-gradient(135deg, #e8722a 0%, #c94b27 100%)',
  },
  {
    id: 'bangkok',
    city: 'Bangkok', country: 'Thailand', region: 'asia',
    tagline: 'Chaotic, delicious, impossibly cheap',
    vibes: ['city', 'food', 'nightlife', 'budget-friendly'],
    flightCostByRegion: { northeast: 900, southeast: 950, midwest: 860, south: 880, mountain: 790, west: 580 },
    hotelPerNight: 45, dailySpend: 40,
    flightHours: 17,
    weather: 'Hot and humid year-round, rainy June–Oct',
    highlights: ['Street food scene', 'Grand Palace', 'Floating markets', 'Chatuchak weekend market'],
    activities: ['Temple hop by boat', 'Night bazaar shopping', 'Muay Thai fight', 'Day trip to Ayutthaya', 'Khao San bar crawl'],
    bestFor: ['backpackers', 'food lovers', 'nightlife', 'budget travelers'],
    watchOuts: ['Extreme heat Apr–May', 'Tuk-tuk scams for tourists', 'Very long flight from US'],
    sampleDays: [
      { label: 'Day 1', items: ['Grand Palace & Wat Pho', 'Chao Phraya river boat', 'Street food tour'] },
      { label: 'Day 2', items: ['Chatuchak market', 'Afternoon Asiatique riverfront', 'Khao San Road night'] },
      { label: 'Day 3', items: ['Day trip to Ayutthaya ancient ruins'] },
      { label: 'Day 4', items: ['Floating market', 'Shopping at MBK', 'Night rooftop bar'] },
    ],
    imageGradient: 'linear-gradient(135deg, #d4a017 0%, #a0522d 100%)',
  },
  {
    id: 'mexico-city',
    city: 'Mexico City', country: 'Mexico', region: 'americas',
    tagline: 'Culture, food, and colonial grandeur',
    vibes: ['city', 'food', 'historical', 'nightlife', 'budget-friendly'],
    flightCostByRegion: { northeast: 290, southeast: 260, midwest: 250, south: 210, mountain: 240, west: 280 },
    hotelPerNight: 70, dailySpend: 50,
    flightHours: 5,
    weather: 'Spring-like year-round, 7,000 ft altitude',
    highlights: ['Teotihuacan pyramids', 'Coyoacán neighborhood', 'Tacos al pastor', 'Frida Kahlo museum'],
    activities: ['Teotihuacan sunrise tour', 'Roma/Condesa cafe crawl', 'Lucha libre match', 'Xochimilco boat party', 'Anthropology museum'],
    bestFor: ['food lovers', 'culture seekers', 'history buffs', 'solo travelers'],
    watchOuts: ['Air quality can be poor', 'Altitude sickness first day', 'Stick to safer neighborhoods'],
    sampleDays: [
      { label: 'Day 1', items: ['Historic center & Zócalo', 'Mercado de San Juan food hall', 'Bellas Artes at night'] },
      { label: 'Day 2', items: ['Teotihuacan pyramids day trip'] },
      { label: 'Day 3', items: ['Coyoacán & Frida Kahlo museum', 'Roma afternoon', 'Condesa dinner'] },
      { label: 'Day 4', items: ['Xochimilco boats', 'Mercado de Jamaica', 'Night out in Polanco'] },
    ],
    imageGradient: 'linear-gradient(135deg, #2e8b57 0%, #1a5276 100%)',
  },
  {
    id: 'reykjavik',
    city: 'Reykjavik', country: 'Iceland', region: 'europe',
    tagline: 'Northern lights, hot springs, raw earth',
    vibes: ['nature', 'adventure', 'quiet'],
    flightCostByRegion: { northeast: 340, southeast: 400, midwest: 420, south: 430, mountain: 450, west: 490 },
    hotelPerNight: 160, dailySpend: 90,
    flightHours: 6,
    weather: 'Cool year-round, Aurora visible Sept–Mar',
    highlights: ['Northern lights', 'Blue Lagoon', 'Golden Circle', 'Midnight sun in summer'],
    activities: ['Northern lights hunt', 'Blue Lagoon soak', 'Golden Circle waterfall tour', 'Whale watching', 'Lava cave exploration'],
    bestFor: ['nature lovers', 'couples', 'adventure seekers', 'photographers'],
    watchOuts: ['Very expensive for food and alcohol', 'Weather changes fast', 'Need a car to see the best parts'],
    sampleDays: [
      { label: 'Day 1', items: ['Reykjavik city walk', 'Hallgrímskirkja church', 'Harbor dinner'] },
      { label: 'Day 2', items: ['Blue Lagoon morning', 'Reykjanes Peninsula drive'] },
      { label: 'Day 3', items: ['Golden Circle: Þingvellir, Geysir, Gullfoss waterfall'] },
      { label: 'Day 4', items: ['Northern lights tour or whale watching', 'Fly out'] },
    ],
    imageGradient: 'linear-gradient(135deg, #2980b9 0%, #1a252f 100%)',
  },
  {
    id: 'barcelona',
    city: 'Barcelona', country: 'Spain', region: 'europe',
    tagline: 'Beach, Gaudí, and late nights',
    vibes: ['beach', 'city', 'food', 'nightlife'],
    flightCostByRegion: { northeast: 440, southeast: 490, midwest: 530, south: 540, mountain: 560, west: 620 },
    hotelPerNight: 100, dailySpend: 70,
    flightHours: 8,
    weather: 'Warm and sunny most of the year, hot summers',
    highlights: ['Sagrada Família', 'La Barceloneta beach', 'La Boqueria market', 'Gothic Quarter streets'],
    activities: ['Sagrada Família tour', 'Park Güell morning', 'Tapas tour in El Born', 'Beach afternoon', 'Nightclub evening in Eixample'],
    bestFor: ['beach lovers', 'foodies', 'nightlife', 'architecture fans'],
    watchOuts: ['Very touristy in July–Aug', 'Pickpockets on Las Ramblas', 'Beaches crowded in peak season'],
    sampleDays: [
      { label: 'Day 1', items: ['Gothic Quarter walk', 'La Boqueria market', 'Barceloneta beach sunset'] },
      { label: 'Day 2', items: ['Sagrada Família', 'Park Güell', 'Gracia neighborhood dinner'] },
      { label: 'Day 3', items: ['Montjuïc castle', 'El Born tapas crawl', 'Nightlife in Eixample'] },
      { label: 'Day 4', items: ['Tibidabo views', 'Last beach afternoon', 'Fly out'] },
    ],
    imageGradient: 'linear-gradient(135deg, #c0392b 0%, #e67e22 100%)',
  },
  {
    id: 'tokyo',
    city: 'Tokyo', country: 'Japan', region: 'asia',
    tagline: 'Organized chaos, perfect food, total wonder',
    vibes: ['city', 'food', 'historical', 'nightlife'],
    flightCostByRegion: { northeast: 820, southeast: 870, midwest: 790, south: 800, mountain: 720, west: 590 },
    hotelPerNight: 110, dailySpend: 80,
    flightHours: 14,
    weather: 'Four seasons, best in April (cherry blossom) and November',
    highlights: ['Shibuya crossing', 'Tsukiji fish market', 'Shinjuku night scene', 'Senso-ji temple'],
    activities: ['Shibuya scramble crossing', 'Harajuku fashion district', 'Day trip to Nikko or Kyoto', 'Teamlab digital art', 'Izakaya bar crawl'],
    bestFor: ['food lovers', 'culture seekers', 'solo travelers', 'pop culture fans'],
    watchOuts: ['Very long flight', 'Cash-heavy society', 'Not ideal for very tight budgets'],
    sampleDays: [
      { label: 'Day 1', items: ['Shinjuku arrival, wander Golden Gai', 'Ramen dinner'] },
      { label: 'Day 2', items: ['Senso-ji temple', 'Shibuya crossing', 'Harajuku', 'Teamlab'] },
      { label: 'Day 3', items: ['Day trip to Nikko or Kamakura'] },
      { label: 'Day 4', items: ['Tsukiji market breakfast', 'Akihabara', 'Shinjuku goodbye dinner'] },
    ],
    imageGradient: 'linear-gradient(135deg, #922b21 0%, #6c3483 100%)',
  },
  {
    id: 'cancun',
    city: 'Cancún', country: 'Mexico', region: 'caribbean',
    tagline: 'All-inclusive beach, turquoise water',
    vibes: ['beach', 'tropical', 'nightlife'],
    flightCostByRegion: { northeast: 250, southeast: 200, midwest: 230, south: 195, mountain: 260, west: 310 },
    hotelPerNight: 80, dailySpend: 45,
    flightHours: 4,
    weather: 'Hot and sunny, hurricane season Jul–Oct',
    highlights: ['Hotel Zone beaches', 'Chichén Itzá ruins', 'Cenote swimming', 'Tulum nearby'],
    activities: ['Beach all day', 'Chichén Itzá day trip', 'Cenote swim', 'Tulum ruins', 'Party on Hotel Zone strip'],
    bestFor: ['beach vacation', 'groups', 'party travel', 'affordable tropical'],
    watchOuts: ['Very touristy strip', 'Hurricane season risk', 'Downtown far from beaches'],
    sampleDays: [
      { label: 'Day 1', items: ['Beach, pool, Hotel Zone', 'Sunset boat cruise'] },
      { label: 'Day 2', items: ['Chichén Itzá day trip'] },
      { label: 'Day 3', items: ['Tulum ruins morning', 'Cenote swim afternoon'] },
      { label: 'Day 4', items: ['Last beach day', 'Nightlife on Hotel Zone', 'Fly out'] },
    ],
    imageGradient: 'linear-gradient(135deg, #1abc9c 0%, #2980b9 100%)',
  },
  {
    id: 'amsterdam',
    city: 'Amsterdam', country: 'Netherlands', region: 'europe',
    tagline: 'Canals, bikes, and world-class museums',
    vibes: ['city', 'historical', 'nightlife', 'food'],
    flightCostByRegion: { northeast: 460, southeast: 510, midwest: 550, south: 560, mountain: 580, west: 640 },
    hotelPerNight: 130, dailySpend: 75,
    flightHours: 8,
    weather: 'Cool and rainy much of the year, mild summers',
    highlights: ['Rijksmuseum', 'Canal Ring', 'Vondelpark', 'Anne Frank House'],
    activities: ['Canal boat tour', 'Rijksmuseum & Van Gogh Museum', 'Bike rental all day', 'Jordaan neighborhood walk', 'Coffee shop culture'],
    bestFor: ['culture seekers', 'art lovers', 'cyclists', 'nightlife'],
    watchOuts: ['Very expensive in peak season', 'Bikes everywhere — watch out', 'Anne Frank House needs advance tickets'],
    sampleDays: [
      { label: 'Day 1', items: ['Canal walk', 'Rijksmuseum', 'Leidseplein evening'] },
      { label: 'Day 2', items: ['Van Gogh Museum', 'Vondelpark', 'Jordaan dinner'] },
      { label: 'Day 3', items: ['Day trip to Haarlem or Keukenhof gardens', 'De Pijp market'] },
      { label: 'Day 4', items: ['Anne Frank House', 'Final canal cruise', 'Fly out'] },
    ],
    imageGradient: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
  },
  {
    id: 'marrakech',
    city: 'Marrakech', country: 'Morocco', region: 'africa',
    tagline: 'Sensory overload in the best way',
    vibes: ['historical', 'food', 'adventure', 'budget-friendly'],
    flightCostByRegion: { northeast: 560, southeast: 610, midwest: 650, south: 660, mountain: 680, west: 750 },
    hotelPerNight: 65, dailySpend: 45,
    flightHours: 9,
    weather: 'Hot in summer, perfect spring and fall, cool winter nights',
    highlights: ['Djemaa el-Fna square', 'Medina souks', 'Majorelle Garden', 'Sahara desert nearby'],
    activities: ['Medina souk wander', 'Cooking class', 'Hammam spa day', 'Day trip to Atlas Mountains', 'Sunset at Café de France'],
    bestFor: ['adventure seekers', 'photographers', 'culture lovers', 'food travelers'],
    watchOuts: ['Aggressive vendors in souks', 'Very hot in July–August', 'Haggling is expected and exhausting'],
    sampleDays: [
      { label: 'Day 1', items: ['Arrive, check into riad', 'Djemaa el-Fna evening food stalls'] },
      { label: 'Day 2', items: ['Majorelle Garden', 'Bahia Palace', 'Souk shopping'] },
      { label: 'Day 3', items: ['Atlas Mountains day trip or camel ride'] },
      { label: 'Day 4', items: ['Hammam morning', 'Cooking class', 'Fly out'] },
    ],
    imageGradient: 'linear-gradient(135deg, #b7950b 0%, #784212 100%)',
  },
  {
    id: 'new-orleans',
    city: 'New Orleans', country: 'USA', region: 'americas',
    tagline: 'Jazz, beignets, and pure American soul',
    vibes: ['food', 'nightlife', 'historical', 'city'],
    flightCostByRegion: { northeast: 190, southeast: 140, midwest: 170, south: 120, mountain: 210, west: 260 },
    hotelPerNight: 120, dailySpend: 80,
    flightHours: 3,
    weather: 'Hot and humid, best Nov–Mar to avoid heat',
    highlights: ['French Quarter', 'Frenchmen Street jazz', 'Café Du Monde beignets', 'Garden District mansions'],
    activities: ['Frenchmen Street jazz bars', 'Garden District walking tour', 'Swamp tour', 'Bourbon Street night', 'Creole cooking class'],
    bestFor: ['food lovers', 'music fans', 'nightlife', 'domestic long weekend'],
    watchOuts: ['Very hot and humid summer', 'French Quarter gets overwhelming', 'Hurricane season'],
    sampleDays: [
      { label: 'Day 1', items: ['French Quarter walk', 'Café Du Monde', 'Frenchmen Street jazz night'] },
      { label: 'Day 2', items: ['Garden District tour', 'Magazine Street lunch', 'Swamp boat tour'] },
      { label: 'Day 3', items: ['Creole cooking class', 'WWII Museum', 'Bourbon Street final night'] },
    ],
    imageGradient: 'linear-gradient(135deg, #5d4037 0%, #8d1b2e 100%)',
  },
  {
    id: 'costa-rica',
    city: 'San José / Manuel Antonio', country: 'Costa Rica', region: 'americas',
    tagline: 'Rainforest, sloths, and Pacific beaches',
    vibes: ['nature', 'adventure', 'beach', 'tropical'],
    flightCostByRegion: { northeast: 320, southeast: 290, midwest: 310, south: 300, mountain: 340, west: 370 },
    hotelPerNight: 85, dailySpend: 60,
    flightHours: 5,
    weather: 'Tropical, rainy season May–Nov, dry season Dec–Apr',
    highlights: ['Arenal volcano', 'Monteverde cloud forest', 'Manuel Antonio beach', 'Sloth sanctuary'],
    activities: ['Zip line through canopy', 'White water rafting', 'Manuel Antonio snorkeling', 'Volcano hot springs', 'Wildlife sloth tour'],
    bestFor: ['nature lovers', 'adventure seekers', 'families', 'eco travel'],
    watchOuts: ['Roads between destinations take longer than expected', 'Rainy season limits some activities', 'Rental car highly recommended'],
    sampleDays: [
      { label: 'Day 1', items: ['Arrive San José, head to Arenal'] },
      { label: 'Day 2', items: ['Arenal volcano hike', 'Hot springs evening'] },
      { label: 'Day 3', items: ['Drive to Manuel Antonio', 'National park wildlife walk'] },
      { label: 'Day 4', items: ['Beach morning', 'Snorkel', 'Fly home from San José'] },
    ],
    imageGradient: 'linear-gradient(135deg, #27ae60 0%, #1a5c2a 100%)',
  },
  {
    id: 'prague',
    city: 'Prague', country: 'Czech Republic', region: 'europe',
    tagline: 'Fairy tale streets and great beer',
    vibes: ['historical', 'city', 'budget-friendly', 'nightlife'],
    flightCostByRegion: { northeast: 490, southeast: 540, midwest: 570, south: 580, mountain: 610, west: 670 },
    hotelPerNight: 70, dailySpend: 50,
    flightHours: 9,
    weather: 'Cold winters, beautiful summer, stunning in autumn',
    highlights: ['Old Town Square', 'Charles Bridge at dawn', 'Prague Castle', 'Beer culture'],
    activities: ['Old Town Square astronomical clock', 'Charles Bridge sunrise walk', 'Prague Castle tour', 'Beer hall crawl', 'Day trip to Český Krumlov'],
    bestFor: ['history lovers', 'budget travelers', 'beer enthusiasts', 'city explorers'],
    watchOuts: ['Very touristy in summer', 'Some areas overpriced near Old Town', 'Stag party crowds on weekends'],
    sampleDays: [
      { label: 'Day 1', items: ['Old Town Square', 'Charles Bridge sunset', 'Beer hall dinner'] },
      { label: 'Day 2', items: ['Prague Castle morning', 'Malá Strana neighborhood', 'Jazz bar evening'] },
      { label: 'Day 3', items: ['Day trip to Český Krumlov castle'] },
      { label: 'Day 4', items: ['Vinohrady neighborhood brunch', 'Wenceslas Square', 'Fly out'] },
    ],
    imageGradient: 'linear-gradient(135deg, #8e44ad 0%, #2c3e50 100%)',
  },
  {
    id: 'bali',
    city: 'Bali', country: 'Indonesia', region: 'asia',
    tagline: 'Rice paddies, temples, and cheap surf',
    vibes: ['beach', 'nature', 'tropical', 'adventure', 'budget-friendly'],
    flightCostByRegion: { northeast: 1050, southeast: 1100, midwest: 980, south: 1000, mountain: 860, west: 660 },
    hotelPerNight: 50, dailySpend: 35,
    flightHours: 19,
    weather: 'Tropical, dry season Apr–Oct is best',
    highlights: ['Ubud rice terraces', 'Tanah Lot temple', 'Seminyak beach sunsets', 'Volcano hike'],
    activities: ['Tegallalang rice terrace walk', 'Mount Batur sunrise hike', 'Ubud monkey forest', 'Surf lesson in Canggu', 'Temple hop'],
    bestFor: ['backpackers', 'yogis', 'surfers', 'photographers', 'digital nomads'],
    watchOuts: ['Very long flight', 'Traffic between Seminyak and Ubud is brutal', 'Monkeys will steal things'],
    sampleDays: [
      { label: 'Day 1', items: ['Arrive Seminyak, beach sunset', 'Nightlife in Kuta'] },
      { label: 'Day 2', items: ['Drive to Ubud', 'Monkey forest', 'Rice terrace walk'] },
      { label: 'Day 3', items: ['Mount Batur sunrise hike', 'Hot springs after'] },
      { label: 'Day 4', items: ['Tanah Lot temple', 'Surf lesson Canggu', 'Final Seminyak dinner'] },
    ],
    imageGradient: 'linear-gradient(135deg, #16a085 0%, #27ae60 100%)',
  },
  {
    id: 'cape-town',
    city: 'Cape Town', country: 'South Africa', region: 'africa',
    tagline: 'Mountains, ocean, and breathtaking views',
    vibes: ['nature', 'adventure', 'beach', 'city'],
    flightCostByRegion: { northeast: 920, southeast: 970, midwest: 950, south: 980, mountain: 970, west: 1010 },
    hotelPerNight: 95, dailySpend: 55,
    flightHours: 17,
    weather: 'Mediterranean — dry summers (Dec–Feb), mild winters',
    highlights: ['Table Mountain', 'Cape of Good Hope', 'Boulders Beach penguins', 'Wine route'],
    activities: ['Table Mountain cable car', 'Cape Point drive', 'Boulders Beach penguins', 'Stellenbosch wine tasting', 'Clifton Beach afternoon'],
    bestFor: ['nature lovers', 'adventure seekers', 'photographers', 'wine lovers'],
    watchOuts: ['Very long flight', 'Safety requires awareness especially at night', 'Water restrictions in some years'],
    sampleDays: [
      { label: 'Day 1', items: ['Table Mountain cable car', 'V&A Waterfront evening'] },
      { label: 'Day 2', items: ['Cape Point day drive', 'Boulders Beach penguins'] },
      { label: 'Day 3', items: ['Stellenbosch wine route'] },
      { label: 'Day 4', items: ['Clifton beach', 'Camps Bay sunset', 'Fly out'] },
    ],
    imageGradient: 'linear-gradient(135deg, #2980b9 0%, #1a252f 100%)',
  },
  {
    id: 'nashville',
    city: 'Nashville', country: 'USA', region: 'americas',
    tagline: 'Hot chicken, honky-tonks, and a wild weekend',
    vibes: ['food', 'nightlife', 'city', 'budget-friendly'],
    flightCostByRegion: { northeast: 170, southeast: 130, midwest: 150, south: 120, mountain: 200, west: 250 },
    hotelPerNight: 140, dailySpend: 90,
    flightHours: 2,
    weather: 'Four seasons, hot summers, mild spring and fall',
    highlights: ['Broadway honky-tonks', 'Hot chicken', 'Country Music Hall of Fame', 'The Gulch neighborhood'],
    activities: ['Broadway bar crawl', 'Hot chicken taste-off', 'Country Music Hall of Fame', 'Ryman Auditorium show', 'Antique shops'],
    bestFor: ['bachelorette parties', 'long weekends', 'music fans', 'food lovers'],
    watchOuts: ['Broadway gets very loud and rowdy', 'Hotels expensive on weekends', 'Can feel repetitive after 2 days'],
    sampleDays: [
      { label: 'Day 1', items: ['Arrive, check in Gulch', 'Broadway honky-tonks night'] },
      { label: 'Day 2', items: ['Country Music Hall of Fame', 'Hot chicken lunch', 'Ryman show evening'] },
      { label: 'Day 3', items: ['12 South neighborhood brunch', 'Antique shopping', 'Fly out'] },
    ],
    imageGradient: 'linear-gradient(135deg, #c0392b 0%, #6c3483 100%)',
  },
  {
    id: 'porto',
    city: 'Porto', country: 'Portugal', region: 'europe',
    tagline: 'Port wine, tiled buildings, and zero crowds',
    vibes: ['city', 'food', 'historical', 'quiet', 'budget-friendly'],
    flightCostByRegion: { northeast: 390, southeast: 440, midwest: 490, south: 510, mountain: 540, west: 600 },
    hotelPerNight: 80, dailySpend: 55,
    flightHours: 7,
    weather: 'Mild year-round, rainy winters, sunny summers',
    highlights: ['Ribeira riverside', 'Port wine caves', 'São Bento train station tiles', 'Livraria Lello bookshop'],
    activities: ['Port wine cave tour', 'Ribeira afternoon walk', 'São Bento tiles tour', 'Francesinha sandwich', 'Douro Valley wine day trip'],
    bestFor: ['couples', 'wine lovers', 'quiet city break', 'off-the-beaten-path'],
    watchOuts: ['Smaller than Lisbon, can see most in 2 days', 'Wet in winter', 'Hills are steep'],
    sampleDays: [
      { label: 'Day 1', items: ['Ribeira waterfront', 'Port wine tasting', 'Sunset from Dom Luís Bridge'] },
      { label: 'Day 2', items: ['São Bento station', 'Livraria Lello', 'Clérigos Tower climb'] },
      { label: 'Day 3', items: ['Douro Valley wine day trip'] },
    ],
    imageGradient: 'linear-gradient(135deg, #c0392b 0%, #922b21 100%)',
  },
  {
    id: 'montreal',
    city: 'Montréal', country: 'Canada', region: 'americas',
    tagline: 'European flair, North American prices',
    vibes: ['city', 'food', 'nightlife', 'historical', 'budget-friendly'],
    flightCostByRegion: { northeast: 120, southeast: 210, midwest: 200, south: 240, mountain: 290, west: 330 },
    hotelPerNight: 120, dailySpend: 70,
    flightHours: 1.5,
    weather: 'Cold winters (very), hot summers, gorgeous fall',
    highlights: ['Old Port cobblestones', 'Mount Royal park', 'Poutine', 'Underground city in winter', 'Festival season'],
    activities: ['Old Port walk', 'Mount Royal hike', 'Jean-Talon market', 'Mile End bagels', 'Underground city exploration'],
    bestFor: ['food lovers', 'weekend trips from US northeast', 'French culture seekers', 'festival-goers'],
    watchOuts: ['Brutal winters Nov–Mar', 'Construction everywhere in summer', 'Some things pricey in USD'],
    sampleDays: [
      { label: 'Day 1', items: ['Old Port cobblestones', 'Notre-Dame Basilica', 'Old Montreal dinner'] },
      { label: 'Day 2', items: ['Mount Royal hike', 'Plateau neighborhood brunch', 'Mile End bagels'] },
      { label: 'Day 3', items: ['Jean-Talon market', 'Underground city', 'Fly out'] },
    ],
    imageGradient: 'linear-gradient(135deg, #d35400 0%, #922b21 100%)',
  },
  {
    id: 'athens',
    city: 'Athens', country: 'Greece', region: 'europe',
    tagline: 'Ancient ruins, rooftop views, cheap wine',
    vibes: ['historical', 'city', 'food', 'budget-friendly'],
    flightCostByRegion: { northeast: 510, southeast: 560, midwest: 600, south: 610, mountain: 630, west: 700 },
    hotelPerNight: 75, dailySpend: 55,
    flightHours: 10,
    weather: 'Hot dry summers, mild spring and fall, cool winters',
    highlights: ['Acropolis and Parthenon', 'Monastiraki flea market', 'Plaka neighborhood', 'Aegean island day trips'],
    activities: ['Acropolis sunrise tour', 'Monastiraki market', 'Day trip to Hydra island', 'Rooftop bar with Parthenon view', 'Omonia street food'],
    bestFor: ['history buffs', 'island hoppers', 'budget Europe trip', 'solo travelers'],
    watchOuts: ['Very hot July–Aug', 'Tourist traps around Plaka', 'Acropolis gets crowded — go early'],
    sampleDays: [
      { label: 'Day 1', items: ['Acropolis and Parthenon', 'Plaka lunch', 'Monastiraki evening'] },
      { label: 'Day 2', items: ['Athens National Museum', 'Piraeus fish lunch', 'Hydra island ferry'] },
      { label: 'Day 3', items: ['Monastiraki flea market', 'Rooftop sunset bar', 'Fly out'] },
    ],
    imageGradient: 'linear-gradient(135deg, #2980b9 0%, #1abc9c 100%)',
  },
  {
    id: 'miami',
    city: 'Miami', country: 'USA', region: 'americas',
    tagline: 'Art Deco, ocean drive, neon nights',
    vibes: ['beach', 'nightlife', 'city', 'food'],
    flightCostByRegion: { northeast: 190, southeast: 110, midwest: 200, south: 160, mountain: 230, west: 280 },
    hotelPerNight: 160, dailySpend: 100,
    flightHours: 3,
    weather: 'Hot and sunny year-round, hurricane risk Aug–Oct',
    highlights: ['South Beach', 'Art Deco Historic District', 'Little Havana', 'Wynwood Walls'],
    activities: ['South Beach day', 'Wynwood art walk', 'Little Havana food tour', 'Ocean Drive sunset walk', 'Everglades airboat tour'],
    bestFor: ['beach vacations', 'nightlife', 'food lovers', 'domestic escape'],
    watchOuts: ['Expensive hotels', 'South Beach parking is a nightmare', 'Summer heat is intense'],
    sampleDays: [
      { label: 'Day 1', items: ['South Beach, Art Deco walk', 'Ocean Drive dinner'] },
      { label: 'Day 2', items: ['Wynwood Walls', 'Little Havana lunch', 'Sunset at Brickell'] },
      { label: 'Day 3', items: ['Everglades airboat tour', 'Poolside afternoon', 'Fly out'] },
    ],
    imageGradient: 'linear-gradient(135deg, #e74c3c 0%, #f39c12 100%)',
  },
  {
    id: 'seoul',
    city: 'Seoul', country: 'South Korea', region: 'asia',
    tagline: 'K-culture, street food, and midnight vibes',
    vibes: ['city', 'food', 'nightlife', 'historical'],
    flightCostByRegion: { northeast: 810, southeast: 860, midwest: 780, south: 800, mountain: 720, west: 570 },
    hotelPerNight: 90, dailySpend: 60,
    flightHours: 14,
    weather: 'Four seasons, beautiful spring cherry blossoms, hot humid summer',
    highlights: ['Gyeongbokgung Palace', 'Hongdae nightlife', 'Korean BBQ', 'N Seoul Tower', 'Han River parks'],
    activities: ['Gyeongbokgung Palace tour', 'Han River picnic', 'Hongdae bar crawl', 'Korean BBQ dinner', 'Namsan Mountain cable car'],
    bestFor: ['K-pop fans', 'food lovers', 'nightlife seekers', 'tech culture'],
    watchOuts: ['Long flight from US', 'Language barrier outside of tourist areas', 'Scorching humid summer'],
    sampleDays: [
      { label: 'Day 1', items: ['Gyeongbokgung Palace', 'Insadong market', 'Myeongdong shopping'] },
      { label: 'Day 2', items: ['N Seoul Tower', 'Han River afternoon', 'Hongdae nightlife'] },
      { label: 'Day 3', items: ['Korean BBQ lunch tour', 'Bukchon Hanok Village', 'Gangnam evening'] },
    ],
    imageGradient: 'linear-gradient(135deg, #8e44ad 0%, #2c3e50 100%)',
  },
  {
    id: 'vermont',
    city: 'Burlington / Vermont', country: 'USA', region: 'americas',
    tagline: 'Fall foliage, mountain trails, and farm-to-table calm',
    vibes: ['nature', 'quiet', 'adventure', 'food'],
    flightCostByRegion: { northeast: 110, southeast: 230, midwest: 260, south: 290, mountain: 330, west: 380 },
    driveFromRegion: { northeast: 3.5 },
    hotelPerNight: 130, dailySpend: 70,
    flightHours: 1,
    weather: 'Stunning fall Sept–Oct, snowy winters, warm summers',
    highlights: ['Green Mountains hiking', 'Lake Champlain waterfront', 'Stowe ski village', 'Farm-to-table dining'],
    activities: ['Appalachian Trail hike', 'Lake Champlain kayaking', 'Ben & Jerry\'s factory tour', 'Stowe village walk', 'Covered bridge road trip'],
    bestFor: ['nature lovers', 'couples', 'solo quiet retreat', 'fall foliage seekers'],
    watchOuts: ['Very cold Oct–Apr', 'Limited nightlife', 'Car recommended to explore'],
    sampleDays: [
      { label: 'Day 1', items: ['Fly into Burlington', 'Church Street lunch', 'Lake Champlain waterfront walk'] },
      { label: 'Day 2', items: ['Green Mountain day hike', 'Stowe village afternoon', 'Farm dinner'] },
      { label: 'Day 3', items: ['Covered bridge drive', 'Ben & Jerry\'s factory', 'Fly home'] },
    ],
    imageGradient: 'linear-gradient(135deg, #27ae60 0%, #145a32 100%)',
  },
  {
    id: 'asheville',
    city: 'Asheville', country: 'USA', region: 'americas',
    tagline: 'Blue Ridge mountains, craft beer, and art',
    vibes: ['nature', 'food', 'quiet', 'adventure', 'city'],
    flightCostByRegion: { northeast: 220, southeast: 180, midwest: 230, south: 160, mountain: 290, west: 350 },
    driveFromRegion: { southeast: 3.5, south: 4 },
    hotelPerNight: 140, dailySpend: 75,
    flightHours: 2,
    weather: 'Four seasons, best spring and fall, mild summers',
    highlights: ['Blue Ridge Parkway', 'Biltmore Estate', 'River Arts District', 'Craft brewery scene'],
    activities: ['Blue Ridge Parkway scenic drive', 'Appalachian Trail hike', 'Biltmore Estate tour', 'River Arts District walk', 'Craft brewery crawl'],
    bestFor: ['nature lovers', 'foodies', 'couples', 'artists', 'weekend escape'],
    watchOuts: ['Biltmore is pricey', 'Very popular on fall weekends', 'Parking downtown can be tough'],
    sampleDays: [
      { label: 'Day 1', items: ['Arrive, River Arts District', 'Downtown dinner and brewery'] },
      { label: 'Day 2', items: ['Blue Ridge Parkway drive', 'Appalachian trail hike', 'Craft beer evening'] },
      { label: 'Day 3', items: ['Biltmore Estate morning', 'French Broad Chocolate Lounge', 'Fly home'] },
    ],
    imageGradient: 'linear-gradient(135deg, #6d4c41 0%, #4a235a 100%)',
  },
  {
    id: 'sedona',
    city: 'Sedona', country: 'USA', region: 'americas',
    tagline: 'Red rock canyons, desert trails, and wide open sky',
    vibes: ['nature', 'adventure', 'quiet', 'luxury'],
    flightCostByRegion: { northeast: 360, southeast: 330, midwest: 280, south: 300, mountain: 160, west: 190 },
    hotelPerNight: 200, dailySpend: 85,
    flightHours: 5,
    weather: 'Sunny and dry year-round, perfect spring and fall, hot summers',
    highlights: ['Cathedral Rock', 'Bell Rock Trail', 'Oak Creek Canyon', 'Pink Jeep off-road tours'],
    activities: ['Cathedral Rock sunrise hike', 'Pink Jeep off-road tour', 'Oak Creek Canyon swim', 'Vortex meditation walk', 'Tlaquepaque arts village'],
    bestFor: ['hikers', 'couples', 'wellness seekers', 'photographers', 'nature lovers'],
    watchOuts: ['Fly into Phoenix then drive 2h', 'Very hot June–Aug', 'Crowded on weekends'],
    sampleDays: [
      { label: 'Day 1', items: ['Fly into Phoenix, drive to Sedona', 'Bell Rock hike at sunset'] },
      { label: 'Day 2', items: ['Cathedral Rock sunrise', 'Pink Jeep tour', 'Oak Creek Canyon afternoon'] },
      { label: 'Day 3', items: ['Vortex walk', 'Tlaquepaque shopping', 'Drive to PHX, fly home'] },
    ],
    imageGradient: 'linear-gradient(135deg, #c0392b 0%, #e67e22 100%)',
  },
  {
    id: 'denver-colorado',
    city: 'Denver / Colorado', country: 'USA', region: 'americas',
    tagline: 'Mountain trails, ski towns, and a mile-high city',
    vibes: ['nature', 'adventure', 'city', 'food'],
    flightCostByRegion: { northeast: 280, southeast: 260, midwest: 170, south: 230, mountain: 120, west: 250 },
    hotelPerNight: 130, dailySpend: 80,
    flightHours: 4,
    weather: 'Sunny 300 days/year, cold snowy winters, great summer hiking',
    highlights: ['Rocky Mountain National Park', 'Red Rocks Amphitheater', 'Breckenridge ski town', 'RiNo Art District'],
    activities: ['Rocky Mountain National Park hike', 'Red Rocks sunrise', 'Breckenridge ski or hike', 'RiNo brewery tour', 'Garden of the Gods day trip'],
    bestFor: ['hikers', 'outdoor adventurers', 'skiers', 'city and nature combo'],
    watchOuts: ['Altitude sickness first day (5,280 ft)', 'Mountain roads icy in winter', 'Ski resorts add up fast'],
    sampleDays: [
      { label: 'Day 1', items: ['Arrive Denver, RiNo Art District', 'Red Rocks sunset', 'LoDo dinner'] },
      { label: 'Day 2', items: ['Rocky Mountain National Park all day', 'Bear Lake trail', 'Elk watching at dusk'] },
      { label: 'Day 3', items: ['Garden of the Gods or Breckenridge', 'Fly home from Denver'] },
    ],
    imageGradient: 'linear-gradient(135deg, #2980b9 0%, #27ae60 100%)',
  },
  {
    id: 'acadia',
    city: 'Acadia / Bar Harbor', country: 'USA', region: 'americas',
    tagline: 'Rugged Atlantic coast, tide pools, and lobster rolls',
    vibes: ['nature', 'quiet', 'adventure'],
    flightCostByRegion: { northeast: 100, southeast: 300, midwest: 360, south: 380, mountain: 420, west: 460 },
    driveFromRegion: { northeast: 4.5 },
    hotelPerNight: 160, dailySpend: 70,
    flightHours: 1,
    weather: 'Cool and crisp, stunning fall, foggy spring, best June–Oct',
    highlights: ['Cadillac Mountain sunrise', 'Jordan Pond path', 'Thunder Hole sea surge', 'Bar Harbor lobster shacks'],
    activities: ['Cadillac Mountain sunrise hike', 'Jordan Pond carriage road walk', 'Sea kayaking around islands', 'Thunder Hole tide watching', 'Lobster roll in Bar Harbor'],
    bestFor: ['hikers', 'nature lovers', 'photographers', 'couples', 'quiet coastal escape'],
    watchOuts: ['Very crowded July–August', 'Cadillac Mountain sunrise needs advance permit', 'Cold water even in summer'],
    sampleDays: [
      { label: 'Day 1', items: ['Fly into Bangor or drive from Boston', 'Bar Harbor walk', 'Lobster dinner'] },
      { label: 'Day 2', items: ['Cadillac Mountain sunrise', 'Jordan Pond loop hike', 'Sea kayaking afternoon'] },
      { label: 'Day 3', items: ['Thunder Hole morning', 'Carriage road bike ride', 'Head home'] },
    ],
    imageGradient: 'linear-gradient(135deg, #1a5276 0%, #2980b9 100%)',
  },
  {
    id: 'great-smoky',
    city: 'Great Smoky Mountains', country: 'USA', region: 'americas',
    tagline: 'America\'s most visited national park — free to enter',
    vibes: ['nature', 'quiet', 'adventure', 'budget-friendly'],
    flightCostByRegion: { northeast: 200, southeast: 150, midwest: 210, south: 140, mountain: 280, west: 340 },
    driveFromRegion: { southeast: 3, south: 4 },
    hotelPerNight: 120, dailySpend: 60,
    flightHours: 2,
    weather: 'Four seasons, spectacular fall foliage, mild summer, snowy peaks in winter',
    highlights: ['Clingmans Dome summit', 'Roaring Fork waterfalls', 'Cades Cove wildlife loop', 'Gatlinburg village'],
    activities: ['Clingmans Dome sunrise hike', 'Roaring Fork waterfall trail', 'Cades Cove wildlife drive', 'Alum Cave Trail', 'Gatlinburg cabin evening'],
    bestFor: ['budget travelers', 'families', 'hikers', 'nature lovers', 'wildlife watchers'],
    watchOuts: ['Very crowded in fall', 'Gatlinburg strip is touristy', 'Lodging books up months ahead'],
    sampleDays: [
      { label: 'Day 1', items: ['Fly into Knoxville, drive to park', 'Cades Cove wildlife loop', 'Gatlinburg evening'] },
      { label: 'Day 2', items: ['Clingmans Dome sunrise', 'Alum Cave Trail hike', 'Roaring Fork waterfall walk'] },
      { label: 'Day 3', items: ['Chimney Tops trail morning', 'Drive back to Knoxville', 'Fly home'] },
    ],
    imageGradient: 'linear-gradient(135deg, #27ae60 0%, #6d4c41 100%)',
  },
  {
    id: 'portland-oregon',
    city: 'Portland', country: 'USA', region: 'americas',
    tagline: 'Weird, wonderful, with forest and waterfalls nearby',
    vibes: ['nature', 'food', 'city', 'adventure', 'nightlife'],
    flightCostByRegion: { northeast: 340, southeast: 360, midwest: 310, south: 330, mountain: 260, west: 130 },
    hotelPerNight: 130, dailySpend: 80,
    flightHours: 6,
    weather: 'Rainy Oct–May, dry and perfect June–Sept',
    highlights: ['Columbia River Gorge waterfalls', 'Forest Park urban wilderness', 'Powell\'s Books', 'Food cart culture'],
    activities: ['Columbia River Gorge waterfall hike', 'Forest Park trail run', 'Powell\'s Books browse', 'Food cart pod crawl', 'Mt Hood day trip'],
    bestFor: ['foodies', 'nature lovers', 'book lovers', 'outdoor adventurers'],
    watchOuts: ['Rainy most of the year', 'Best visited June–Sept', 'Mt Hood adds drive time'],
    sampleDays: [
      { label: 'Day 1', items: ['Arrive, Pearl District', 'Food cart pod dinner', 'Powell\'s Books evening'] },
      { label: 'Day 2', items: ['Columbia River Gorge waterfall hike', 'Vista House viewpoint', 'NE Portland dinner'] },
      { label: 'Day 3', items: ['Forest Park morning hike', 'Saturday Market', 'Fly home'] },
    ],
    imageGradient: 'linear-gradient(135deg, #27ae60 0%, #2c3e50 100%)',
  },

  // ── International additions ───────────────────────────────────────────────
  {
    id: 'paris',
    city: 'Paris', country: 'France', region: 'europe',
    tagline: 'The city everything else gets compared to',
    vibes: ['city', 'food', 'historical', 'luxury'],
    flightCostByRegion: { northeast: 440, southeast: 490, midwest: 530, south: 540, mountain: 560, west: 620 },
    hotelPerNight: 160, dailySpend: 95,
    flightHours: 7,
    weather: 'Four seasons, best April–June and Sept–Oct, cold grey winters',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Le Marais district', 'Montmartre', 'Versailles'],
    activities: ['Eiffel Tower at dusk', 'Louvre half-day', 'Montmartre morning walk', 'Seine river cruise', 'Versailles palace day trip'],
    bestFor: ['couples', 'art lovers', 'foodies', 'first Europe trip'],
    watchOuts: ['Extremely crowded at major sights year-round', 'Pickpockets near tourist spots', 'Restaurant etiquette matters'],
    sampleDays: [
      { label: 'Day 1', items: ['Eiffel Tower', 'Champ de Mars picnic', 'Le Marais evening'] },
      { label: 'Day 2', items: ['Louvre morning', 'Île de la Cité', 'Montmartre sunset'] },
      { label: 'Day 3', items: ['Versailles day trip', 'Seine riverside walk', 'Saint-Germain dinner'] },
    ],
    imageGradient: 'linear-gradient(135deg, #8e44ad 0%, #c0392b 100%)',
  },
  {
    id: 'rome',
    city: 'Rome', country: 'Italy', region: 'europe',
    tagline: 'Two thousand years of history on every street corner',
    vibes: ['historical', 'city', 'food'],
    flightCostByRegion: { northeast: 450, southeast: 500, midwest: 540, south: 550, mountain: 570, west: 630 },
    hotelPerNight: 130, dailySpend: 80,
    flightHours: 9,
    weather: 'Hot dry summers, mild spring and fall, cool winters',
    highlights: ['Colosseum', 'Vatican Museums + Sistine Chapel', 'Trevi Fountain', 'Roman Forum', 'Trastevere'],
    activities: ['Colosseum + Roman Forum walk', 'Vatican Museums + Sistine Chapel', 'Trastevere evening', 'Pasta-making class', 'Day trip to Pompeii'],
    bestFor: ['history buffs', 'foodies', 'couples', 'first Europe trip'],
    watchOuts: ['Colosseum tickets must be booked weeks ahead', 'Very hot July–August', 'Tourist traps around major sights'],
    sampleDays: [
      { label: 'Day 1', items: ['Colosseum and Roman Forum', 'Palatine Hill', 'Trastevere dinner'] },
      { label: 'Day 2', items: ['Vatican Museums', 'Sistine Chapel', 'St. Peter\'s Basilica', 'Piazza Navona evening'] },
      { label: 'Day 3', items: ['Trevi Fountain morning', 'Pantheon', 'Pasta-making class', 'Fly out'] },
    ],
    imageGradient: 'linear-gradient(135deg, #e8722a 0%, #c0392b 100%)',
  },
  {
    id: 'kyoto',
    city: 'Kyoto', country: 'Japan', region: 'asia',
    tagline: 'Ancient temples, bamboo groves, and the soul of Japan',
    vibes: ['historical', 'quiet', 'nature', 'food'],
    flightCostByRegion: { northeast: 820, southeast: 870, midwest: 790, south: 800, mountain: 720, west: 580 },
    hotelPerNight: 120, dailySpend: 75,
    flightHours: 14,
    weather: 'Four seasons — cherry blossom March–April and fall foliage November are peak',
    highlights: ['Fushimi Inari shrine gates', 'Arashiyama bamboo grove', 'Gion district', 'Kinkaku-ji Golden Pavilion', 'Philosopher\'s Path'],
    activities: ['Fushimi Inari sunrise hike', 'Arashiyama bamboo walk', 'Gion evening stroll', 'Kinkaku-ji and Ryoan-ji', 'Tea ceremony experience'],
    bestFor: ['culture seekers', 'history buffs', 'photographers', 'Japan first-timers'],
    watchOuts: ['Very crowded at top sights', 'Advance booking required for tea ceremonies', 'Some areas limit tourist access'],
    sampleDays: [
      { label: 'Day 1', items: ['Fushimi Inari sunrise', 'Gion walking tour', 'Kaiseki dinner'] },
      { label: 'Day 2', items: ['Arashiyama bamboo grove', 'Tenryu-ji garden', 'Kinkaku-ji afternoon'] },
      { label: 'Day 3', items: ['Nishiki Market', 'Tea ceremony', 'Shinkansen to Tokyo or fly home'] },
    ],
    imageGradient: 'linear-gradient(135deg, #922b21 0%, #e8722a 100%)',
  },
  {
    id: 'phuket',
    city: 'Phuket', country: 'Thailand', region: 'asia',
    tagline: 'White sand beaches, island hopping, emerald-green water',
    vibes: ['beach', 'tropical', 'nightlife', 'budget-friendly'],
    flightCostByRegion: { northeast: 940, southeast: 980, midwest: 910, south: 920, mountain: 830, west: 650 },
    hotelPerNight: 55, dailySpend: 45,
    flightHours: 18,
    weather: 'Tropical, dry season Nov–Apr is best, heavy rain May–Oct',
    highlights: ['Patong Beach', 'Phi Phi Islands', 'Old Phuket Town', 'James Bond Island', 'Phang Nga Bay'],
    activities: ['Phi Phi Islands full-day boat tour', 'Patong Beach day', 'Old Phuket Town walking tour', 'Sunset at Promthep Cape', 'Phang Nga Bay sea kayak'],
    bestFor: ['beach lovers', 'budget travelers', 'nightlife seekers', 'island hoppers'],
    watchOuts: ['Rainy season May–Oct limits beach time', 'Patong Beach area is very touristy', 'Very long flight from US'],
    sampleDays: [
      { label: 'Day 1', items: ['Arrive, Patong Beach', 'Old Phuket Town evening walk'] },
      { label: 'Day 2', items: ['Phi Phi Islands full-day boat tour'] },
      { label: 'Day 3', items: ['Phang Nga Bay sea kayak', 'James Bond Island', 'Night market dinner'] },
    ],
    imageGradient: 'linear-gradient(135deg, #1abc9c 0%, #2980b9 100%)',
  },
  {
    id: 'singapore',
    city: 'Singapore', country: 'Singapore', region: 'asia',
    tagline: 'Futuristic gardens, hawker street food, and seamless city living',
    vibes: ['city', 'food', 'luxury', 'nightlife'],
    flightCostByRegion: { northeast: 1050, southeast: 1090, midwest: 1010, south: 1020, mountain: 940, west: 760 },
    hotelPerNight: 180, dailySpend: 100,
    flightHours: 18,
    weather: 'Hot and humid year-round (~88°F), brief rain showers at any time',
    highlights: ['Gardens by the Bay', 'Marina Bay Sands', 'Hawker centre food', 'Chinatown and Little India', 'Sentosa Island'],
    activities: ['Gardens by the Bay + Supertree light show', 'Maxwell hawker centre food crawl', 'Marina Bay Sands infinity pool', 'Chinatown + Little India walk', 'Sentosa beach afternoon'],
    bestFor: ['luxury travelers', 'foodies', 'families', 'Asia first-timers'],
    watchOuts: ['Very expensive for Asia', 'Strict laws (no gum, etc.)', 'Very long flight from US'],
    sampleDays: [
      { label: 'Day 1', items: ['Gardens by the Bay', 'Hawker food tour at Maxwell', 'Marina Bay Sands skybar'] },
      { label: 'Day 2', items: ['Chinatown morning', 'Little India afternoon', 'Clarke Quay nightlife'] },
      { label: 'Day 3', items: ['Sentosa Island', 'Universal Studios or cable car', 'Changi Airport fly out'] },
    ],
    imageGradient: 'linear-gradient(135deg, #1a252f 0%, #2980b9 100%)',
  },
  {
    id: 'dubrovnik',
    city: 'Dubrovnik', country: 'Croatia', region: 'europe',
    tagline: 'Medieval walled city on the Adriatic — pure Game of Thrones',
    vibes: ['historical', 'beach', 'city'],
    flightCostByRegion: { northeast: 560, southeast: 610, midwest: 650, south: 660, mountain: 680, west: 740 },
    hotelPerNight: 120, dailySpend: 70,
    flightHours: 10,
    weather: 'Hot dry Mediterranean summer, mild spring and fall, mild winters',
    highlights: ['City Walls walk', 'Lokrum Island', 'Old Town Stradun', 'Sea kayaking around walls', 'Cable car viewpoint'],
    activities: ['City Walls sunrise walk', 'Sea kayak around old city walls', 'Lokrum Island day trip', 'Cable car to Mount Srđ', 'Old Town evening bar crawl'],
    bestFor: ['history lovers', 'beach + culture combo', 'couples', 'photographers'],
    watchOuts: ['Very expensive in peak summer', 'Extremely crowded July–Aug from cruise ships', 'Slippery marble streets'],
    sampleDays: [
      { label: 'Day 1', items: ['City Walls walk', 'Stradun exploration', 'Old Town sunset dinner'] },
      { label: 'Day 2', items: ['Sea kayak morning', 'Lokrum Island afternoon', 'Cable car sunset'] },
      { label: 'Day 3', items: ['Day trip to Hvar or Montenegro border', 'Fly out'] },
    ],
    imageGradient: 'linear-gradient(135deg, #2980b9 0%, #e8722a 100%)',
  },
  {
    id: 'buenos-aires',
    city: 'Buenos Aires', country: 'Argentina', region: 'americas',
    tagline: 'Tango, steak, late nights, and European grandeur in South America',
    vibes: ['city', 'food', 'nightlife', 'historical'],
    flightCostByRegion: { northeast: 680, southeast: 700, midwest: 720, south: 690, mountain: 740, west: 760 },
    hotelPerNight: 80, dailySpend: 55,
    flightHours: 11,
    weather: 'Opposite US seasons — summer Dec–Feb, spring Sept–Nov, fall Mar–May',
    highlights: ['La Boca Caminito', 'Recoleta Cemetery', 'San Telmo market', 'Puerto Madero waterfront', 'Palermo parks'],
    activities: ['Tango show in San Telmo', 'La Boca Caminito walk', 'Recoleta Cemetery tour', 'Parrilla steak dinner', 'Palermo afternoon rooftop'],
    bestFor: ['culture seekers', 'foodies', 'nightlife', 'Latin America explorers'],
    watchOuts: ['Currency exchange can be complicated', 'Long flight from US', 'Inflation affects prices rapidly'],
    sampleDays: [
      { label: 'Day 1', items: ['San Telmo market', 'La Boca Caminito', 'Puerto Madero dinner'] },
      { label: 'Day 2', items: ['Recoleta Cemetery', 'Palermo rooftop afternoon', 'Milonga tango evening'] },
      { label: 'Day 3', items: ['Puerto Madero waterfront brunch', 'Parrilla asado lunch', 'Fly home'] },
    ],
    imageGradient: 'linear-gradient(135deg, #2c3e50 0%, #4a69bd 100%)',
  },
  {
    id: 'medellin',
    city: 'Medellín', country: 'Colombia', region: 'americas',
    tagline: 'City of eternal spring — reinvented and more vibrant than ever',
    vibes: ['city', 'food', 'adventure', 'budget-friendly', 'nightlife'],
    flightCostByRegion: { northeast: 380, southeast: 350, midwest: 400, south: 340, mountain: 430, west: 460 },
    hotelPerNight: 60, dailySpend: 45,
    flightHours: 5,
    weather: 'Eternal spring — ~72°F year-round, light rain April–May and Oct–Nov',
    highlights: ['El Poblado neighborhood', 'Gondola to Comuna 13', 'Botanical Garden', 'Coffee region day trip', 'Parque Arvi'],
    activities: ['El Poblado bar crawl', 'Cable car to Comuna 13 street art', 'Botanical Garden walk', 'Coffee region hacienda tour', 'Nightlife in Laureles'],
    bestFor: ['budget travelers', 'digital nomads', 'foodies', 'adventure seekers', 'nightlife'],
    watchOuts: ['Research current neighborhood safety', 'Some areas require caution at night', 'Altitude can feel strong on arrival'],
    sampleDays: [
      { label: 'Day 1', items: ['El Poblado arrival', 'Parque Lleras evening', 'Colombian food tour'] },
      { label: 'Day 2', items: ['Cable car to Santo Domingo', 'Comuna 13 street art walk', 'Botanical Garden'] },
      { label: 'Day 3', items: ['Coffee region day trip', 'Hacienda tour and tasting', 'Fly out'] },
    ],
    imageGradient: 'linear-gradient(135deg, #27ae60 0%, #f39c12 100%)',
  },
  {
    id: 'chiang-mai',
    city: 'Chiang Mai', country: 'Thailand', region: 'asia',
    tagline: 'Temple trails, elephant sanctuaries, and best street food in Asia',
    vibes: ['nature', 'historical', 'adventure', 'budget-friendly', 'food'],
    flightCostByRegion: { northeast: 920, southeast: 960, midwest: 890, south: 900, mountain: 820, west: 650 },
    hotelPerNight: 30, dailySpend: 30,
    flightHours: 18,
    weather: 'Cool dry Nov–Feb is best, hot Mar–May, rainy June–Oct',
    highlights: ['Doi Suthep temple', 'Night Bazaar', 'Ethical elephant sanctuary', 'Old City moat', 'Thai cooking classes'],
    activities: ['Doi Suthep temple hike', 'Ethical elephant sanctuary full day', 'Thai cooking class', 'Night Bazaar evening', 'Jungle zip-line or waterfall hike'],
    bestFor: ['backpackers', 'nature lovers', 'foodies', 'wellness travelers', 'adventure seekers'],
    watchOuts: ['Burning season smoke Feb–Apr', 'Very long flight from US', 'Research elephant sanctuary ethics before booking'],
    sampleDays: [
      { label: 'Day 1', items: ['Old City temple walk', 'Thai cooking class', 'Night Bazaar'] },
      { label: 'Day 2', items: ['Ethical elephant sanctuary full day'] },
      { label: 'Day 3', items: ['Doi Suthep sunrise hike', 'Nimman neighborhood café', 'Jungle waterfall day trip'] },
    ],
    imageGradient: 'linear-gradient(135deg, #f39c12 0%, #27ae60 100%)',
  },
  {
    id: 'hanoi',
    city: 'Hanoi', country: 'Vietnam', region: 'asia',
    tagline: 'Ancient temples, street pho, and total sensory overload',
    vibes: ['historical', 'food', 'budget-friendly', 'city'],
    flightCostByRegion: { northeast: 890, southeast: 930, midwest: 870, south: 880, mountain: 790, west: 620 },
    hotelPerNight: 35, dailySpend: 30,
    flightHours: 17,
    weather: 'Hot humid summers, cool dry winters, best Oct–Apr',
    highlights: ['Hoan Kiem Lake', 'Old Quarter maze of streets', 'Temple of Literature', 'Ha Long Bay nearby', 'Train Street'],
    activities: ['Old Quarter walking tour', 'Pho and bun cha street food tour', 'Temple of Literature', 'Ha Long Bay overnight cruise', 'Train Street night visit'],
    bestFor: ['budget travelers', 'foodies', 'backpackers', 'culture seekers'],
    watchOuts: ['Traffic is chaotic', 'Very long flight from US', 'Scams common around tourist areas'],
    sampleDays: [
      { label: 'Day 1', items: ['Old Quarter walk', 'Hoan Kiem Lake', 'Street food evening tour'] },
      { label: 'Day 2', items: ['Ha Long Bay departure by overnight cruise'] },
      { label: 'Day 3', items: ['Ha Long Bay kayak + caves', 'Return to Hanoi', 'Train Street night visit'] },
    ],
    imageGradient: 'linear-gradient(135deg, #c0392b 0%, #27ae60 100%)',
  },
  {
    id: 'sydney',
    city: 'Sydney', country: 'Australia', region: 'oceania',
    tagline: 'Harbor views, surf beaches, and easy outdoor living',
    vibes: ['city', 'beach', 'nature', 'food'],
    flightCostByRegion: { northeast: 1200, southeast: 1250, midwest: 1180, south: 1200, mountain: 1100, west: 890 },
    hotelPerNight: 160, dailySpend: 95,
    flightHours: 20,
    weather: 'Opposite US seasons — summer Dec–Feb (hot), winter June–Aug (mild), best Sept–Nov',
    highlights: ['Sydney Opera House', 'Bondi Beach', 'Harbour Bridge', 'Blue Mountains', 'Manly ferry'],
    activities: ['Opera House tour', 'Bondi to Coogee coastal walk', 'Harbour Bridge climb', 'Blue Mountains day trip', 'Manly Beach ferry ride'],
    bestFor: ['beach lovers', 'outdoor adventurers', 'city explorers', 'bucket-list long trips'],
    watchOuts: ['Very long flight', 'Expensive city', 'Best combined with extra days to justify the journey'],
    sampleDays: [
      { label: 'Day 1', items: ['Sydney Opera House', 'The Rocks', 'Harbour Bridge walk at sunset'] },
      { label: 'Day 2', items: ['Bondi Beach morning', 'Coastal cliff walk to Coogee', 'Surry Hills dinner'] },
      { label: 'Day 3', items: ['Blue Mountains day trip', 'Three Sisters lookout', 'Echo Point'] },
      { label: 'Day 4', items: ['Manly Beach ferry', 'Darling Harbour final dinner', 'Fly home'] },
    ],
    imageGradient: 'linear-gradient(135deg, #2980b9 0%, #1abc9c 100%)',
  },
  {
    id: 'dubai',
    city: 'Dubai', country: 'UAE', region: 'asia',
    tagline: 'Record-breaking skyline, desert adventures, and zero-limits luxury',
    vibes: ['luxury', 'city', 'beach'],
    flightCostByRegion: { northeast: 780, southeast: 830, midwest: 870, south: 880, mountain: 900, west: 950 },
    hotelPerNight: 180, dailySpend: 120,
    flightHours: 13,
    weather: 'Hot year-round, best Oct–Apr (mild), extreme heat May–Sept',
    highlights: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Old Dubai Souks', 'Desert safari'],
    activities: ['Burj Khalifa observation deck', 'Desert safari + camel ride + BBQ dinner', 'Dubai Mall + fountain show', 'Old Gold and Spice Souk', 'Palm Jumeirah beach'],
    bestFor: ['luxury travelers', 'stopovers', 'architecture enthusiasts', 'bucket-list trips'],
    watchOuts: ['Extremely hot May–Sept', 'Expensive dining and entertainment', 'Cultural norms for dress and behaviour'],
    sampleDays: [
      { label: 'Day 1', items: ['Burj Khalifa', 'Dubai Mall', 'Fountain show evening'] },
      { label: 'Day 2', items: ['Desert safari morning', 'Camel ride', 'Sunset dunes BBQ dinner'] },
      { label: 'Day 3', items: ['Old Dubai Gold and Spice Souks', 'Abra water taxi', 'Palm Jumeirah beach', 'Fly out'] },
    ],
    imageGradient: 'linear-gradient(135deg, #f39c12 0%, #d35400 100%)',
  },

  // ── Caribbean & Americas additions ───────────────────────────────────────
  {
    id: 'puerto-rico',
    city: 'San Juan', country: 'USA', region: 'caribbean',
    tagline: 'Tropical US island — colorful old city, jungle, beaches, no passport',
    vibes: ['beach', 'tropical', 'historical', 'city', 'nightlife'],
    flightCostByRegion: { northeast: 180, southeast: 220, midwest: 280, south: 300, mountain: 380, west: 420 },
    hotelPerNight: 130, dailySpend: 75,
    flightHours: 3.5,
    weather: 'Tropical year-round ~82°F, brief afternoon showers, hurricane risk Aug–Oct',
    highlights: ['Old San Juan cobblestone streets', 'El Yunque rainforest', 'Bioluminescent Bay', 'Condado Beach', 'El Morro Fort'],
    activities: ['Old San Juan walls and forts walk', 'El Yunque rainforest hike', 'Bioluminescent Bay night kayak tour', 'Condado beach day', 'Rum distillery tour'],
    bestFor: ['beach lovers', 'US travelers wanting no passport', 'history + beach combo', 'nightlife'],
    watchOuts: ['Hurricane season July–Oct', 'Can be pricey vs other Caribbean islands', 'Traffic in metro area'],
    sampleDays: [
      { label: 'Day 1', items: ['Old San Juan walls and forts', 'La Fortaleza', 'La Placita evening'] },
      { label: 'Day 2', items: ['El Yunque rainforest hike', 'Luquillo Beach afternoon'] },
      { label: 'Day 3', items: ['Condado beach', 'Bioluminescent Bay night tour', 'Fly home'] },
    ],
    imageGradient: 'linear-gradient(135deg, #27ae60 0%, #2980b9 100%)',
  },
  {
    id: 'jamaica',
    city: 'Montego Bay / Negril', country: 'Jamaica', region: 'caribbean',
    tagline: 'Reggae, rum, cliff diving, and the most laid-back Caribbean vibe',
    vibes: ['beach', 'tropical', 'nightlife', 'food'],
    flightCostByRegion: { northeast: 280, southeast: 220, midwest: 300, south: 270, mountain: 360, west: 400 },
    hotelPerNight: 110, dailySpend: 65,
    flightHours: 4,
    weather: 'Warm sunny year-round, brief rainy season May–June and Sept–Nov',
    highlights: ['Seven Mile Beach Negril', 'Dunn\'s River Falls', 'Rick\'s Café cliff diving', 'Blue Mountains coffee', 'Bob Marley Museum'],
    activities: ['Seven Mile Beach day', 'Dunn\'s River Falls climb', 'Rick\'s Café sunset cliff diving', 'Rum bar crawl Negril', 'Blue Mountain coffee tour'],
    bestFor: ['beach vacation', 'all-inclusive resort trips', 'music culture lovers', 'couples'],
    watchOuts: ['Stay in well-known resort areas at night', 'Persistent vendors on public beaches', 'Hurricane season June–November'],
    sampleDays: [
      { label: 'Day 1', items: ['Seven Mile Beach Negril', 'Sunset at Rick\'s Café', 'Beach bar nightlife'] },
      { label: 'Day 2', items: ['Dunn\'s River Falls climb', 'Ocho Rios market', 'Jerk chicken roadside lunch'] },
      { label: 'Day 3', items: ['Blue Mountain coffee day trip', 'Bob Marley Museum Kingston', 'Fly home'] },
    ],
    imageGradient: 'linear-gradient(135deg, #f1c40f 0%, #27ae60 100%)',
  },
  {
    id: 'aruba',
    city: 'Aruba', country: 'Aruba', region: 'caribbean',
    tagline: 'Near-perfect weather every day — outside the hurricane belt',
    vibes: ['beach', 'tropical', 'quiet', 'luxury'],
    flightCostByRegion: { northeast: 320, southeast: 280, midwest: 360, south: 330, mountain: 400, west: 450 },
    hotelPerNight: 200, dailySpend: 90,
    flightHours: 4.5,
    weather: 'Consistently sunny ~82°F, almost never rains, outside hurricane belt — genuinely reliable',
    highlights: ['Eagle Beach', 'Natural Pool (Conchi)', 'Arikok National Park', 'Oranjestad old town', 'Flamingo Beach'],
    activities: ['Eagle Beach day', 'Jeep adventure to Natural Pool', 'Arikok National Park hike', 'Flamingo Beach on Renaissance Island', 'Sunset sailing cruise'],
    bestFor: ['beach vacation', 'couples', 'honeymooners', 'guaranteed sunshine trips'],
    watchOuts: ['Very expensive island', 'Somewhat limited beyond beach and dining', 'Eastern coast very windy'],
    sampleDays: [
      { label: 'Day 1', items: ['Eagle Beach afternoon', 'Oranjestad town walk', 'Sunset sailing'] },
      { label: 'Day 2', items: ['Jeep tour to Natural Pool', 'Arikok National Park', 'Flamingo Beach'] },
      { label: 'Day 3', items: ['Final beach morning', 'Local lunch in Oranjestad', 'Fly home'] },
    ],
    imageGradient: 'linear-gradient(135deg, #f1c40f 0%, #1abc9c 100%)',
  },
  {
    id: 'punta-cana',
    city: 'Punta Cana', country: 'Dominican Republic', region: 'caribbean',
    tagline: 'All-inclusive done right — long turquoise coast, affordable',
    vibes: ['beach', 'tropical', 'budget-friendly'],
    flightCostByRegion: { northeast: 260, southeast: 230, midwest: 290, south: 260, mountain: 350, west: 390 },
    hotelPerNight: 90, dailySpend: 40,
    flightHours: 4,
    weather: 'Warm sunny year-round, brief rains May–Nov, hurricane risk Aug–Oct',
    highlights: ['Bávaro Beach', 'Saona Island boat trip', 'Hoyo Azul lagoon', 'Scape Park', 'Catamaran cruises'],
    activities: ['Bávaro Beach full day', 'Saona Island catamaran day trip', 'Hoyo Azul cenote swim', 'Catamaran party cruise', 'Dune buggy adventure'],
    bestFor: ['budget beach vacation', 'all-inclusive resorts', 'groups', 'first Caribbean trip'],
    watchOuts: ['Mostly resort-bubble experience', 'Hurricane season risk August–October', 'Avoid tap water'],
    sampleDays: [
      { label: 'Day 1', items: ['Arrive, beach and pool', 'Resort dinner and entertainment'] },
      { label: 'Day 2', items: ['Saona Island full-day boat trip'] },
      { label: 'Day 3', items: ['Hoyo Azul cenote swim', 'Catamaran party cruise afternoon'] },
      { label: 'Day 4', items: ['Final beach morning', 'Fly home'] },
    ],
    imageGradient: 'linear-gradient(135deg, #2980b9 0%, #16a085 100%)',
  },
  {
    id: 'belize',
    city: 'Belize City / Caye Caulker', country: 'Belize', region: 'americas',
    tagline: 'World\'s second largest barrier reef, Mayan ruins, and total jungle calm',
    vibes: ['nature', 'adventure', 'beach', 'tropical'],
    flightCostByRegion: { northeast: 350, southeast: 300, midwest: 330, south: 310, mountain: 380, west: 410 },
    hotelPerNight: 90, dailySpend: 60,
    flightHours: 4,
    weather: 'Tropical, dry season Dec–April, rainy June–October',
    highlights: ['Great Blue Hole', 'Belize Barrier Reef', 'Caracol Mayan ruins', 'Caye Caulker beach', 'Cockscomb jaguar preserve'],
    activities: ['Great Blue Hole diving', 'Barrier Reef snorkel tour', 'Caracol Mayan ruins day trip', 'Cockscomb Wildlife Sanctuary hike', 'Caye Caulker beach and lobster'],
    bestFor: ['divers', 'adventure travelers', 'eco-tourists', 'nature lovers'],
    watchOuts: ['Belize City itself is just transit — stay on cayes or inland', 'Underdeveloped infrastructure', 'Pricey diving gear rental'],
    sampleDays: [
      { label: 'Day 1', items: ['Arrive, take water taxi to Caye Caulker', 'Reef snorkel', 'Lazy Lizard bar evening'] },
      { label: 'Day 2', items: ['Great Blue Hole full-day dive/snorkel trip'] },
      { label: 'Day 3', items: ['Caracol Mayan ruins day trip', 'Cave tubing in jungle'] },
      { label: 'Day 4', items: ['Caye Caulker beach morning', 'Fly home from Belize City'] },
    ],
    imageGradient: 'linear-gradient(135deg, #16a085 0%, #27ae60 100%)',
  },

  // ── US Domestic additions ─────────────────────────────────────────────────
  {
    id: 'maui',
    city: 'Maui', country: 'USA', region: 'americas',
    tagline: 'Hawaii\'s most stunning island — volcano crater, jungle waterfalls, perfect beaches',
    vibes: ['beach', 'tropical', 'nature', 'luxury'],
    flightCostByRegion: { northeast: 450, southeast: 500, midwest: 420, south: 440, mountain: 340, west: 270 },
    hotelPerNight: 250, dailySpend: 100,
    flightHours: 10,
    weather: 'Warm tropical year-round ~80°F, brief winter showers on windward side',
    highlights: ['Haleakalā crater sunrise', 'Road to Hana waterfalls', 'Wailea Beach', 'Molokini snorkel', 'Lahaina Front Street'],
    activities: ['Haleakalā crater sunrise hike (4am start)', 'Road to Hana full drive', 'Molokini crater snorkel', 'Wailea beach day', 'Whale watching Jan–Mar'],
    bestFor: ['honeymooners', 'nature lovers', 'beach lovers', 'luxury travelers'],
    watchOuts: ['Very expensive — hotels, food, car rental all premium', 'Long flight from mainland', 'Road to Hana is a 10-hour full-day commitment'],
    sampleDays: [
      { label: 'Day 1', items: ['Arrive, Wailea beach', 'Sunset at Lahaina Front Street'] },
      { label: 'Day 2', items: ['Haleakalā crater sunrise (leave 3am)', 'Kula upcountry lunch', 'Makena beach afternoon'] },
      { label: 'Day 3', items: ['Road to Hana — waterfalls, black sand beach, jungle pools'] },
      { label: 'Day 4', items: ['Molokini snorkel morning', 'Fly home'] },
    ],
    imageGradient: 'linear-gradient(135deg, #16a085 0%, #e8722a 100%)',
  },
  {
    id: 'new-york-city',
    city: 'New York City', country: 'USA', region: 'americas',
    tagline: 'The city everything else gets compared to',
    vibes: ['city', 'food', 'nightlife', 'historical'],
    flightCostByRegion: { northeast: 80, southeast: 160, midwest: 190, south: 210, mountain: 290, west: 340 },
    driveFromRegion: { northeast: 3.5 },
    hotelPerNight: 200, dailySpend: 110,
    flightHours: 1,
    weather: 'Four seasons — hot humid summer, cold winter, perfect spring and fall',
    highlights: ['Central Park', 'Brooklyn Bridge', 'MoMA and Met', 'High Line', 'Times Square'],
    activities: ['Central Park morning walk or bike', 'Brooklyn Bridge + DUMBO', 'Met or MoMA museum', 'High Line + Chelsea Market', 'Broadway show or comedy club'],
    bestFor: ['first-time NYC visitors', 'foodies', 'art and culture lovers', 'nightlife'],
    watchOuts: ['Very expensive hotels', 'Subway learning curve for newcomers', 'Can be overwhelming on first visit'],
    sampleDays: [
      { label: 'Day 1', items: ['Central Park', 'Upper West Side lunch', 'Times Square + Broadway show'] },
      { label: 'Day 2', items: ['Brooklyn Bridge walk', 'DUMBO brunch', 'High Line afternoon', 'Chelsea Market'] },
      { label: 'Day 3', items: ['Met Museum morning', 'Fifth Avenue', 'Fly or drive home'] },
    ],
    imageGradient: 'linear-gradient(135deg, #1a252f 0%, #2c3e50 100%)',
  },
  {
    id: 'washington-dc',
    city: 'Washington DC', country: 'USA', region: 'americas',
    tagline: 'Free world-class museums, monuments, and American history all in one',
    vibes: ['historical', 'city', 'food'],
    flightCostByRegion: { northeast: 130, southeast: 160, midwest: 190, south: 200, mountain: 270, west: 320 },
    driveFromRegion: { northeast: 4.5 },
    hotelPerNight: 160, dailySpend: 70,
    flightHours: 1.5,
    weather: 'Four seasons, brutally hot and humid summer, cold winter, spectacular spring cherry blossoms',
    highlights: ['National Mall monuments', 'Smithsonian museums (all free)', 'Georgetown', 'Capitol Hill', 'National Gallery of Art'],
    activities: ['National Mall monument walk', 'Smithsonian Air & Space or Natural History', 'Georgetown afternoon walk', 'Capitol Hill tour', 'National Portrait Gallery'],
    bestFor: ['history buffs', 'families', 'budget domestic (free museums)', 'school trips'],
    watchOuts: ['Summer heat and humidity extreme', 'Traffic and parking difficult', 'Popular sights packed in spring (cherry blossom season)'],
    sampleDays: [
      { label: 'Day 1', items: ['Lincoln Memorial + Reflecting Pool', 'Vietnam + WWII Memorials', 'National Mall sunset'] },
      { label: 'Day 2', items: ['Smithsonian Air & Space or Natural History', 'Georgetown dinner'] },
      { label: 'Day 3', items: ['Capitol Hill and Library of Congress', 'Eastern Market brunch', 'Drive or fly home'] },
    ],
    imageGradient: 'linear-gradient(135deg, #1a252f 0%, #8e44ad 100%)',
  },
  {
    id: 'chicago',
    city: 'Chicago', country: 'USA', region: 'americas',
    tagline: 'Architecture, deep dish, blues bars, and lakefront that surprises everyone',
    vibes: ['city', 'food', 'nightlife', 'historical'],
    flightCostByRegion: { northeast: 160, southeast: 200, midwest: 80, south: 190, mountain: 220, west: 280 },
    hotelPerNight: 170, dailySpend: 90,
    flightHours: 2,
    weather: 'Four extreme seasons — brutally cold winters, hot summers, perfect June and September',
    highlights: ['Architecture boat tour', 'Art Institute of Chicago', 'Millennium Park + the Bean', 'Deep dish pizza', 'Chicago Blues scene'],
    activities: ['Architecture river cruise', 'Art Institute of Chicago', 'Millennium Park + the Bean', 'Deep dish pizza at Lou Malnati\'s or Giordano\'s', 'Blues bar on North Side'],
    bestFor: ['architecture lovers', 'foodies', 'Midwest weekend trips', 'nightlife'],
    watchOuts: ['Winter (Nov–Mar) is genuinely brutal', 'Traffic downtown', 'Parking expensive'],
    sampleDays: [
      { label: 'Day 1', items: ['Architecture river cruise', 'Millennium Park', 'Deep dish dinner'] },
      { label: 'Day 2', items: ['Art Institute of Chicago', 'The Loop walk', 'Navy Pier evening'] },
      { label: 'Day 3', items: ['Wicker Park brunch', 'Riverwalk', 'Fly home'] },
    ],
    imageGradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
  },
  {
    id: 'austin',
    city: 'Austin', country: 'USA', region: 'americas',
    tagline: 'Live music capital of the world, legendary BBQ, and permanent weird energy',
    vibes: ['city', 'food', 'nightlife', 'adventure'],
    flightCostByRegion: { northeast: 220, southeast: 190, midwest: 200, south: 100, mountain: 220, west: 270 },
    hotelPerNight: 150, dailySpend: 85,
    flightHours: 3,
    weather: 'Hot long summers, mild winters, beautiful spring and fall',
    highlights: ['6th Street live music', 'Franklin Barbecue', 'South Congress Ave', 'Barton Springs Pool', 'Lady Bird Lake'],
    activities: ['6th Street live music bar crawl', 'Franklin BBQ (arrive early — long line)', 'South Congress vintage shops', 'Barton Springs pool swim', 'Kayak Lady Bird Lake'],
    bestFor: ['foodies', 'music lovers', 'nightlife', 'outdoor enthusiasts'],
    watchOuts: ['Summer heat is extreme', 'Franklin BBQ line is 2–3 hours', 'SXSW and ACL periods are very crowded and expensive'],
    sampleDays: [
      { label: 'Day 1', items: ['South Congress morning', 'Franklin BBQ lunch', '6th Street evening live music'] },
      { label: 'Day 2', items: ['Barton Springs swim', 'Rainey Street evening', 'Live music at Stubb\'s'] },
      { label: 'Day 3', items: ['East Austin brunch', 'Kayak Lady Bird Lake', 'Fly home'] },
    ],
    imageGradient: 'linear-gradient(135deg, #e8722a 0%, #c0392b 100%)',
  },
  {
    id: 'san-francisco',
    city: 'San Francisco', country: 'USA', region: 'americas',
    tagline: 'Golden Gate, fog, sourdough, and hills that keep you honest',
    vibes: ['city', 'food', 'nature', 'nightlife'],
    flightCostByRegion: { northeast: 260, southeast: 290, midwest: 240, south: 270, mountain: 160, west: 80 },
    hotelPerNight: 200, dailySpend: 100,
    flightHours: 5,
    weather: 'Mild year-round but famously foggy — never truly hot, rarely cold, summer is often grey',
    highlights: ['Golden Gate Bridge', 'Alcatraz', 'Mission District murals', 'Ferry Building', 'Marin Headlands'],
    activities: ['Golden Gate Bridge walk', 'Alcatraz island tour', 'Ferry Building Saturday market', 'Mission District food + mural walk', 'Day trip to Muir Woods or Napa Valley'],
    bestFor: ['city explorers', 'foodies', 'nature day trips', 'tech culture visits'],
    watchOuts: ['Very expensive hotels and dining', 'Fog can roll in any time of year', 'Homelessness visible in downtown areas'],
    sampleDays: [
      { label: 'Day 1', items: ['Golden Gate Bridge walk', 'Sausalito ferry lunch', 'Mission District evening'] },
      { label: 'Day 2', items: ['Alcatraz morning tour', 'Ferry Building market', 'Chinatown + North Beach'] },
      { label: 'Day 3', items: ['Muir Woods redwoods day trip', 'Fly home'] },
    ],
    imageGradient: 'linear-gradient(135deg, #e8722a 0%, #2980b9 100%)',
  },
  {
    id: 'savannah',
    city: 'Savannah', country: 'USA', region: 'americas',
    tagline: 'Spanish moss, antebellum squares, and the most charming city most people overlook',
    vibes: ['historical', 'food', 'quiet', 'city'],
    flightCostByRegion: { northeast: 190, southeast: 100, midwest: 210, south: 140, mountain: 270, west: 330 },
    hotelPerNight: 160, dailySpend: 70,
    flightHours: 2,
    weather: 'Hot humid summer, mild spring and fall, brief cool winters',
    highlights: ['Forsyth Park fountain', 'Bonaventure Cemetery', 'River Street', 'Historic district squares', 'Tybee Island beach'],
    activities: ['Historic square ghost tour', 'Forsyth Park morning picnic', 'River Street evening', 'Bonaventure Cemetery walk', 'Tybee Island beach day trip'],
    bestFor: ['history lovers', 'couples', 'quiet weekend escapes', 'Southern food lovers'],
    watchOuts: ['Summer humidity is oppressive', 'Small city — 2 days is often enough', 'Limited dining diversity'],
    sampleDays: [
      { label: 'Day 1', items: ['Historic squares walking tour', 'Forsyth Park', 'River Street evening'] },
      { label: 'Day 2', items: ['Bonaventure Cemetery', 'Southern brunch at Mrs. Wilkes\' or The Grey', 'Ghost tour night walk'] },
      { label: 'Day 3', items: ['Tybee Island beach', 'Fly home'] },
    ],
    imageGradient: 'linear-gradient(135deg, #27ae60 0%, #8d6e63 100%)',
  },
  {
    id: 'yellowstone',
    city: 'Yellowstone / Jackson Hole', country: 'USA', region: 'americas',
    tagline: 'Geysers, bison herds, and the American wilderness at its most raw',
    vibes: ['nature', 'adventure', 'quiet'],
    flightCostByRegion: { northeast: 310, southeast: 360, midwest: 280, south: 320, mountain: 150, west: 210 },
    driveFromRegion: { mountain: 5 },
    hotelPerNight: 150, dailySpend: 65,
    flightHours: 4,
    weather: 'Short best season June–August, extreme cold Oct–May, partial winter closure',
    highlights: ['Old Faithful geyser', 'Grand Prismatic Spring', 'Lamar Valley wildlife', 'Grand Canyon of the Yellowstone', 'Jackson Hole town'],
    activities: ['Old Faithful eruption watch', 'Grand Prismatic Spring overlook hike', 'Lamar Valley dawn wildlife drive', 'Grand Canyon of Yellowstone viewpoints', 'Jackson Hole evening'],
    bestFor: ['nature lovers', 'wildlife watchers', 'families', 'photographers', 'bucket-list US trips'],
    watchOuts: ['Peak summer (July–Aug) very crowded — book lodging 6–12 months ahead', 'Wildlife can be dangerous — maintain distance', 'Park can close roads with no warning'],
    sampleDays: [
      { label: 'Day 1', items: ['Fly into Jackson', 'Grand Teton scenic drive', 'Jackson Hole town evening'] },
      { label: 'Day 2', items: ['Old Faithful + Upper Geyser Basin', 'Grand Prismatic Spring hike', 'Mammoth Hot Springs'] },
      { label: 'Day 3', items: ['Lamar Valley 5am wildlife drive', 'Hayden Valley bison viewing', 'Grand Canyon of Yellowstone'] },
      { label: 'Day 4', items: ['Final hike or wildlife loop', 'Fly home from Jackson'] },
    ],
    imageGradient: 'linear-gradient(135deg, #e67e22 0%, #1a252f 100%)',
  },
]

/*
 * Helpers & ranking (target score ≤100): scope/vibes/overrun gates, then budget fit,
 * vibe overlap vs trip length, drive-as-flight proxy where relevant.
 */
function airportRegion(code?: string): AirportRegion {
  if (!code) return 'northeast'
  const match = US_AIRPORTS.find(a => a.code === code.toUpperCase())
  return match?.region ?? 'northeast'
}

export function oneWayFlight(constraints: TripConstraints, dest: Destination): number {
  const region = airportRegion(constraints.airportCode)
  return dest.flightCostByRegion[region]
}

export function isDriveTrip(constraints: TripConstraints, dest: Destination): boolean {
  if (!dest.driveFromRegion) return false
  const region = airportRegion(constraints.airportCode)
  return dest.driveFromRegion[region] !== undefined
}

export function getDriveHours(constraints: TripConstraints, dest: Destination): number {
  if (!dest.driveFromRegion) return 0
  const region = airportRegion(constraints.airportCode)
  return dest.driveFromRegion[region] ?? 0
}

export const RENTAL_CAR_PER_DAY = 75

export function tripBudget(constraints: TripConstraints, dest: Destination): number {
  const nights = lengthToNights(constraints.tripLength)
  if (isDriveTrip(constraints, dest)) {
    return RENTAL_CAR_PER_DAY * nights + dest.hotelPerNight * nights + dest.dailySpend * nights
  }
  const oneWay = oneWayFlight(constraints, dest)
  return oneWay * 2 + dest.hotelPerNight * nights + dest.dailySpend * nights
}

export function lengthToNights(tl: TripLength): number {
  if (tl === 'weekend') return 2
  if (tl === '3-4 days') return 3
  if (tl === '5-7 days') return 6
  return 9
}

const ANCHOR_VIBES: Vibe[] = ['beach', 'nature', 'historical', 'nightlife', 'adventure', 'quiet', 'tropical', 'luxury']

function vibeHits(selected: Vibe, dest: Destination): boolean {
  if (selected === 'tropical') return dest.vibes.includes('tropical') || dest.vibes.includes('beach')
  return dest.vibes.includes(selected)
}

export function fitScore(constraints: TripConstraints, dest: Destination): number {
  if (constraints.scope === 'domestic' && dest.country !== 'USA') return 0
  if (constraints.scope === 'national' &&
      dest.region !== 'americas' && dest.region !== 'caribbean') return 0
  if (constraints.scope === 'international' && dest.country === 'USA') return 0

  const matchedVibes = constraints.vibes.filter(v => vibeHits(v, dest)).length
  if (constraints.vibes.length > 0 && matchedVibes === 0) return 0

  const selectedAnchors = constraints.vibes.filter(v => ANCHOR_VIBES.includes(v))
  if (selectedAnchors.length > 0 && !selectedAnchors.some(v => vibeHits(v, dest))) return 0

  const estimated = tripBudget(constraints, dest)
  const ratio = estimated / constraints.budget

  if (ratio > 1.7) return 0

  let budgetScore: number
  if      (ratio < 0.35)  budgetScore = 8
  else if (ratio < 0.55)  budgetScore = 16
  else if (ratio <= 0.90) budgetScore = 25
  else if (ratio <= 1.00) budgetScore = 22
  else if (ratio <= 1.15) budgetScore = 14
  else if (ratio <= 1.35) budgetScore = 7
  else                    budgetScore = 2

  const vibeMatchScore = constraints.vibes.length > 0
    ? Math.round((matchedVibes / constraints.vibes.length) * 55)
    : 28
  const perfectVibeBonus = (constraints.vibes.length > 0 && matchedVibes === constraints.vibes.length) ? 2 : 0
  const vibeScore = vibeMatchScore + perfectVibeBonus

  const h = isDriveTrip(constraints, dest)
    ? getDriveHours(constraints, dest)
    : dest.flightHours
  let flightScore: number
  if (constraints.tripLength === 'weekend') {
    flightScore = h <= 2 ? 15 : h <= 3.5 ? 11 : h <= 5.5 ? 6 : h <= 8 ? 2 : 0
  } else if (constraints.tripLength === '3-4 days') {
    flightScore = h <= 4 ? 15 : h <= 7 ? 10 : h <= 12 ? 5 : 2
  } else if (constraints.tripLength === '5-7 days') {
    flightScore = h <= 9 ? 15 : h <= 14 ? 9 : 5
  } else {
    flightScore = 15
  }

  const tightBudget = ratio < 1.05 && dest.vibes.includes('budget-friendly')
  const bonus = tightBudget && constraints.budget < 1500 ? 3 : 0

  return Math.min(100, Math.round(budgetScore + vibeScore + flightScore + bonus))
}

export function filterDestinations(constraints: TripConstraints): (Destination & { estimatedCost: number; score: number })[] {
  return DESTINATIONS
    .map(d => ({
      ...d,
      estimatedCost: tripBudget(constraints, d),
      score: fitScore(constraints, d),
    }))
    .filter(d => d.score > 20)
    .sort((a, b) => b.score - a.score)
}

/** Short "why this fits" labels for the UI. */
export function fitReasons(constraints: TripConstraints, dest: Destination): string[] {
  const reasons: string[] = []
  const estimated = tripBudget(constraints, dest)
  const ratio     = estimated / constraints.budget

  if      (ratio <= 0.70) reasons.push('well under budget')
  else if (ratio <= 1.00) reasons.push('fits your budget')
  else if (ratio <= 1.15) reasons.push('slightly over budget')
  else if (ratio <= 1.40) reasons.push('a stretch on your budget')
  else                    reasons.push('over your budget')

  const h = dest.flightHours
  const shortTrip = constraints.tripLength === 'weekend' || constraints.tripLength === '3-4 days'
  if (isDriveTrip(constraints, dest)) {
    const dh = getDriveHours(constraints, dest)
    reasons.push(`~${dh}h drive`)
  } else if (h <= 2)               reasons.push('very short flight')
  else if (h <= 4)               reasons.push('short flight')
  else if (h <= 7 && shortTrip)  reasons.push(`${h}h flight`)
  else if (h > 8  && shortTrip)  reasons.push('long flight for trip length')

  const matched = constraints.vibes.filter(v => vibeHits(v, dest))
  const allMatched = matched.length === constraints.vibes.length && constraints.vibes.length > 0
  if      (allMatched && matched.length >= 2)  reasons.push(`perfect ${matched[0]} & ${matched[1]} match`)
  else if (allMatched && matched.length === 1) reasons.push(`great ${matched[0]} destination`)
  else if (matched.length >= 2)                reasons.push(`${matched[0]} + ${matched[1]} vibe`)
  else if (matched.length === 1)               reasons.push(`${matched[0]} vibe`)

  if (dest.vibes.includes('budget-friendly') && ratio <= 1.0) reasons.push('budget-friendly')
  else if (h <= 3 && constraints.tripLength === 'weekend')    reasons.push('great weekend length')
  else if (dest.vibes.includes('luxury') && ratio <= 1.0)     reasons.push('luxury within budget')

  return reasons.slice(0, 4)
}
