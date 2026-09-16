export interface HighlightPair {
  id: string;
  key: string;
  value: string;
}

export interface ImportantPoint {
  id: string;
  icon: string;
  text: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  fileName: string;
  mediaType?: "image" | "video";
  caption?: string;
}

export interface TourismDestination {
  id: string;
  label: string;
  name: string;
  description: string;
  highlights: HighlightPair[];
  distance: string;
  importantPoints: ImportantPoint[];
  imageUrl: string;
  imageFileName: string;
  galleryImages: GalleryImage[];
  active: boolean;
}

export const INITIAL_TOURISM_DESTINATIONS: TourismDestination[] = [
  {
    id: "dest-1",
    name: "Tiger Point (Tiger's Leap)",
    label: "Scenic Valley & Waterfall",
    distance: "8.5 km from Lonavala Railway Station (via INS Shivaji Road)",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    imageFileName: "tiger-point-cliff.jpg",
    description:
      "Perched at a sheer drop of over 650 meters, Tiger Point provides a magnificent panorama of the Western Ghats ravines, roaring monsoon waterfalls, and undulating Sahyadri clouds. A quintessential Lonavala cliff landmark popular for morning sunrise views and roasted corn stalls.",
    highlights: [
      { id: "h-1", key: "Best Time to Visit", value: "Monsoon & Winter (July to February)" },
      { id: "h-2", key: "Altitude", value: "650 meters above sea level" },
      { id: "h-3", key: "Entry Fee", value: "Free (Municipal Parking: ₹50)" },
      { id: "h-4", key: "Visiting Hours", value: "06:00 AM – 06:30 PM (Daily)" },
    ],
    importantPoints: [
      {
        id: "ip-1",
        icon: "AlertTriangle",
        text: "Steep valley precipice — strictly avoid crossing safety barricades for selfies.",
      },
      {
        id: "ip-2",
        icon: "Leaf",
        text: "Plastic-free eco-sensitive zone: littering or glass disposal carries a strict municipal penalty.",
      },
      {
        id: "ip-3",
        icon: "Car",
        text: "Designated municipal parking available with token entry during peak monsoon weekends.",
      },
    ],
    galleryImages: [
      {
        id: "g-1",
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
        fileName: "tiger-leap-dawn.jpg",
        caption: "Sunrise mist over Borghat Valley",
      },
      {
        id: "g-2",
        url: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80",
        fileName: "waterfall-cascade.jpg",
        caption: "Monsoon seasonal cascades near cliff edge",
      },
    ],
    active: true,
  },
  {
    id: "dest-2",
    name: "Bhushi Dam & Water Cascade",
    label: "Monsoon Water Reservoir",
    distance: "6.0 km from LMC Municipal Complex",
    imageUrl:
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80",
    imageFileName: "bhushi-dam-overflow.jpg",
    description:
      "Built on the Indrayani River, Bhushi Dam is world-renowned for its overflowing steps during peak monsoon rains. Tourists from Mumbai and Pune flock to experience cascading mountain water and fresh Sahyadri breezes in a vibrant festive hill environment.",
    highlights: [
      { id: "h-21", key: "Best Season", value: "Peak Monsoon (July to September)" },
      { id: "h-22", key: "Entry Fee", value: "Free entry" },
      { id: "h-23", key: "Operating Hours", value: "09:00 AM – 05:00 PM" },
      { id: "h-24", key: "Water Source", value: "Indrayani River Watershed" },
    ],
    importantPoints: [
      {
        id: "ip-21",
        icon: "ShieldCheck",
        text: "Lifeguards and municipal safety marshals are deployed on-site during heavy discharge periods.",
      },
      {
        id: "ip-22",
        icon: "Ban",
        text: "Swimming in unbarricaded deep reservoir waters is strictly prohibited under Sec 144.",
      },
    ],
    galleryImages: [
      {
        id: "g-21",
        url: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80",
        fileName: "bhushi-steps.jpg",
        caption: "Overflowing stone steps during July rains",
      },
    ],
    active: true,
  },
  {
    id: "dest-3",
    name: "Karla Ancient Rock-Cut Caves",
    label: "Buddhist Heritage & Architecture",
    distance: "11.0 km from Lonavala Town Center",
    imageUrl:
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
    imageFileName: "karla-caves-chaitya.jpg",
    description:
      "Dating back to the 2nd Century BCE, Karla Caves house India's largest and most pristine rock-cut Chaitya hall, complete with intricate teak wood umbrella architecture, monolithic Ashokan pillars, and historical Brahmi script inscriptions.",
    highlights: [
      { id: "h-31", key: "Heritage Era", value: "2nd Century BCE (Satavahana Dynasty)" },
      { id: "h-32", key: "ASI Entry Fee", value: "₹25 (Indian Citizens), ₹300 (Foreign Nationals)" },
      { id: "h-33", key: "Climb Steps", value: "Approx. 350 stone steps" },
      { id: "h-34", key: "Temple Shrine", value: "Ekvira Aai Temple located adjacent" },
    ],
    importantPoints: [
      {
        id: "ip-31",
        icon: "Camera",
        text: "Non-commercial photography permitted; tripod usage requires ASI permission.",
      },
      {
        id: "ip-32",
        icon: "Clock",
        text: "Ticket counter closes at 05:00 PM. Plan arrival at least 90 minutes before sunset.",
      },
    ],
    galleryImages: [
      {
        id: "g-31",
        url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80",
        fileName: "karla-great-chaitya.jpg",
        caption: "Grand Great Chaitya Hall with teak ribbing",
      },
    ],
    active: true,
  },
];
