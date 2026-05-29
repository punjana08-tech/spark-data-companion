export type Event = {
  id: string;
  name: string;
  date: string;
  venue: string;
  category: string;
  poster: string; // emoji
  zones: { name: string; price: number; available: number }[];
};

export const EVENTS: Event[] = [
  {
    id: "evt-aurora",
    name: "Aurora Live · Night One",
    date: "Sat · 14 Jun · 7:30 PM",
    venue: "MastersCampus Arena, Bengaluru",
    category: "Concert",
    poster: "🎤",
    zones: [
      { name: "VIP Front", price: 6500, available: 42 },
      { name: "Premium", price: 3800, available: 180 },
      { name: "General North", price: 1800, available: 420 },
      { name: "General South", price: 1800, available: 380 },
    ],
  },
  {
    id: "evt-clash",
    name: "Champions Clash · Final",
    date: "Sun · 22 Jun · 4:00 PM",
    venue: "EventSphere Stadium, Mumbai",
    category: "Sports",
    poster: "🏆",
    zones: [
      { name: "VIP Box", price: 8500, available: 24 },
      { name: "East Stand", price: 2400, available: 520 },
      { name: "West Stand", price: 2400, available: 480 },
      { name: "General", price: 999, available: 1200 },
    ],
  },
  {
    id: "evt-comedy",
    name: "Stand-Up Carnival",
    date: "Fri · 04 Jul · 9:00 PM",
    venue: "Phoenix Hall, Hyderabad",
    category: "Comedy",
    poster: "🎭",
    zones: [
      { name: "Front Row", price: 2200, available: 30 },
      { name: "Premium", price: 1500, available: 120 },
      { name: "Regular", price: 799, available: 260 },
    ],
  },
  {
    id: "evt-tech",
    name: "TechFest Keynote",
    date: "Wed · 17 Jul · 10:00 AM",
    venue: "Convention Center, Delhi",
    category: "Conference",
    poster: "💡",
    zones: [
      { name: "Delegate Pass", price: 4500, available: 200 },
      { name: "Student", price: 1200, available: 500 },
    ],
  },
];

export type Product = {
  id: string;
  name: string;
  price: number;
  kind: "food" | "beverage" | "merch";
  emoji: string;
  desc: string;
};

export const PRODUCTS: Product[] = [
  // Food
  { id: "f-burger", name: "Smash Burger", price: 280, kind: "food", emoji: "🍔", desc: "Double patty, smoked cheddar" },
  { id: "f-pizza", name: "Margherita Slice", price: 220, kind: "food", emoji: "🍕", desc: "Wood-fired, fresh basil" },
  { id: "f-fries", name: "Truffle Fries", price: 180, kind: "food", emoji: "🍟", desc: "Parmesan, garlic aioli" },
  { id: "f-nachos", name: "Loaded Nachos", price: 240, kind: "food", emoji: "🌮", desc: "Cheese, jalapeños, salsa" },
  { id: "f-wrap", name: "Paneer Wrap", price: 200, kind: "food", emoji: "🌯", desc: "Spicy paneer, mint chutney" },
  { id: "f-hotdog", name: "Classic Hot Dog", price: 190, kind: "food", emoji: "🌭", desc: "Mustard, caramelised onion" },
  // Beverages
  { id: "b-cola", name: "Cola (500ml)", price: 90, kind: "beverage", emoji: "🥤", desc: "Chilled, fizzy" },
  { id: "b-water", name: "Mineral Water", price: 40, kind: "beverage", emoji: "💧", desc: "1L bottle" },
  { id: "b-beer", name: "Craft Beer", price: 350, kind: "beverage", emoji: "🍺", desc: "IPA, 330ml" },
  { id: "b-coffee", name: "Cold Brew", price: 180, kind: "beverage", emoji: "☕", desc: "Single origin" },
  { id: "b-juice", name: "Mango Juice", price: 120, kind: "beverage", emoji: "🥭", desc: "Fresh, no sugar" },
  // Merch
  { id: "m-tee", name: "Event Tee", price: 799, kind: "merch", emoji: "👕", desc: "Cotton, exclusive print" },
  { id: "m-cap", name: "Snapback Cap", price: 599, kind: "merch", emoji: "🧢", desc: "Embroidered logo" },
  { id: "m-poster", name: "Tour Poster", price: 299, kind: "merch", emoji: "🖼️", desc: "A2, signed edition" },
  { id: "m-band", name: "LED Wristband", price: 399, kind: "merch", emoji: "💡", desc: "Syncs with stage" },
  { id: "m-hoodie", name: "Premium Hoodie", price: 1899, kind: "merch", emoji: "🧥", desc: "Heavyweight fleece" },
];

export const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", emoji: "📱", sub: "GPay, PhonePe, Paytm, BHIM" },
  { id: "card", label: "Credit / Debit Card", emoji: "💳", sub: "Visa, Mastercard, RuPay, Amex" },
  { id: "netbanking", label: "Net Banking", emoji: "🏦", sub: "All major Indian banks" },
  { id: "wallet", label: "Wallet", emoji: "👛", sub: "Paytm, Amazon Pay, Mobikwik" },
] as const;
