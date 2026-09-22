"use client";

import { useEffect, useState } from "react";
import {
  // People & Community
  Users,
  UserCheck,
  UserPlus,
  GraduationCap,
  School,
  Baby,
  // Services, SLA & Governance
  CheckCircle,
  CheckCircle2,
  CheckSquare,
  Clock,
  Timer,
  Hourglass,
  ShieldCheck,
  Shield,
  HelpCircle,
  PhoneCall,
  Headphones,
  Bell,
  MessageSquare,
  Landmark,
  Scale,
  Newspaper,
  // Nature, Tourism & Climate
  Trees,
  TreePine,
  Mountain,
  Sun,
  CloudRain,
  Wind,
  Waves,
  Compass,
  Tent,
  Camera,
  MapPin,
  Navigation,
  Binoculars,
  // Technology & Smart City
  Smartphone,
  Laptop,
  Wifi,
  Globe,
  Server,
  Database,
  QrCode,
  Lightbulb,
  Zap,
  Rocket,
  // Awards & Milestones
  Award,
  Medal,
  Trophy,
  Crown,
  Star,
  Sparkles,
  Flame,
  ThumbsUp,
  BookmarkCheck,
  // Infrastructure & Construction
  Building2,
  Building,
  Home,
  Castle,
  Warehouse,
  Construction,
  HardHat,
  Hammer,
  Wrench,
  // Health, Water & Sanitation
  HeartPulse,
  Heart,
  Activity,
  Stethoscope,
  Trash2,
  Recycle,
  Droplets,
  Droplet,
  Pill,
  // Transport & Mobility
  Bus,
  Car,
  Train,
  Truck,
  Bike,
  Plane,
  Fuel,
  // Finance, Tax & Business
  DollarSign,
  IndianRupee,
  CreditCard,
  Wallet,
  Receipt,
  FileText,
  FileSpreadsheet,
  Briefcase,
  // Analytics & Metrics
  BarChart3,
  BarChart,
  LineChart,
  PieChart,
  TrendingUp,
  Target,
  Gauge,
  Percent,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { GlanceItemDto, getGlanceItems } from "@/lib/services/glance.service";
import { useAutoTranslate } from "@/hooks/useAutoTranslation";

const ICON_MAP: Record<string, any> = {
  // People & Community
  users: Users,
  usercheck: UserCheck,
  userplus: UserPlus,
  graduationcap: GraduationCap,
  school: School,
  baby: Baby,
  // Services, SLA & Governance
  checkcircle: CheckCircle,
  checkcircle2: CheckCircle2,
  checksquare: CheckSquare,
  clock: Clock,
  timer: Timer,
  hourglass: Hourglass,
  shieldcheck: ShieldCheck,
  shield: Shield,
  helpcircle: HelpCircle,
  phonecall: PhoneCall,
  headphones: Headphones,
  bell: Bell,
  messagesquare: MessageSquare,
  landmark: Landmark,
  scale: Scale,
  scales: Scale,
  newspaper: Newspaper,
  // Nature, Tourism & Climate
  trees: Trees,
  treepine: TreePine,
  mountain: Mountain,
  sun: Sun,
  cloudrain: CloudRain,
  wind: Wind,
  waves: Waves,
  compass: Compass,
  tent: Tent,
  camera: Camera,
  mappin: MapPin,
  navigation: Navigation,
  binoculars: Binoculars,
  // Technology & Smart City
  smartphone: Smartphone,
  laptop: Laptop,
  wifi: Wifi,
  globe: Globe,
  server: Server,
  database: Database,
  qrcode: QrCode,
  lightbulb: Lightbulb,
  zap: Zap,
  rocket: Rocket,
  // Awards & Milestones
  award: Award,
  medal: Medal,
  trophy: Trophy,
  crown: Crown,
  star: Star,
  sparkles: Sparkles,
  flame: Flame,
  thumbsup: ThumbsUp,
  bookmarkcheck: BookmarkCheck,
  // Infrastructure & Construction
  building2: Building2,
  building: Building,
  home: Home,
  castle: Castle,
  warehouse: Warehouse,
  construction: Construction,
  hardhat: HardHat,
  hammer: Hammer,
  wrench: Wrench,
  // Health, Water & Sanitation
  heartpulse: HeartPulse,
  heart: Heart,
  activity: Activity,
  stethoscope: Stethoscope,
  trash2: Trash2,
  recycle: Recycle,
  droplets: Droplets,
  droplet: Droplet,
  pill: Pill,
  // Transport & Mobility
  bus: Bus,
  car: Car,
  train: Train,
  truck: Truck,
  bike: Bike,
  plane: Plane,
  fuel: Fuel,
  // Finance, Tax & Business
  dollarsign: DollarSign,
  indianrupee: IndianRupee,
  creditcard: CreditCard,
  wallet: Wallet,
  receipt: Receipt,
  filetext: FileText,
  filespreadsheet: FileSpreadsheet,
  briefcase: Briefcase,
  // Analytics & Metrics
  barchart3: BarChart3,
  barchart: BarChart,
  linechart: LineChart,
  piechart: PieChart,
  trendingup: TrendingUp,
  target: Target,
  gauge: Gauge,
  percent: Percent,
};

function getMetricIcon(iconName: string, className: string = "w-5 h-5 text-emerald-700") {
  const normalized = (iconName || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const IconComponent = ICON_MAP[normalized] || BarChart3;
  return <IconComponent className={className} />;
}

function StatMetricCard({ item }: { item: GlanceItemDto }) {
  const title = useAutoTranslate(item.title, (item as any).titleMr);
  const tag = useAutoTranslate(item.tag, (item as any).tagMr);

  return (
    <div
      key={item.id}
      className="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.75rem)] lg:w-[calc(16.666%-0.85rem)] min-w-[150px] max-w-[210px] bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-emerald-600/60 hover:-translate-y-1 transition-all duration-200 text-center group flex flex-col justify-between"
    >
      <div>
        <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-50/80 border border-emerald-100 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
          {getMetricIcon(item.icon, "w-5 h-5 text-emerald-700")}
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
          {item.value}
        </div>
        <div className="text-xs font-bold text-slate-700 mt-1 line-clamp-1">{title}</div>
      </div>
      <div className="text-[10px] text-slate-400 mt-2 line-clamp-1">{tag || "—"}</div>
    </div>
  );
}

export function StatisticsSection() {
  const { dict } = useLanguage();
  const [metrics, setMetrics] = useState<GlanceItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchGlance() {
      try {
        const data = await getGlanceItems({ active: true });
        if (isMounted && data && Array.isArray(data)) {
          setMetrics(data.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)));
        }
      } catch (err) {
        console.warn("Could not fetch glance metrics from API:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchGlance();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="py-14 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 animate-pulse">
            <div className="h-6 w-36 bg-slate-200 rounded-full mx-auto mb-3" />
            <div className="h-8 w-64 bg-slate-200 rounded-xl mx-auto mb-2" />
            <div className="h-4 w-96 bg-slate-200 rounded-lg mx-auto" />
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.75rem)] lg:w-[calc(16.666%-0.85rem)] min-w-[150px] max-w-[210px] bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center animate-pulse"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-slate-100 mb-3" />
                <div className="h-6 w-20 bg-slate-200 rounded-md mx-auto mb-2" />
                <div className="h-3 w-24 bg-slate-100 rounded-md mx-auto mb-1" />
                <div className="h-2.5 w-16 bg-slate-100 rounded-md mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (metrics.length === 0) {
    return null;
  }

  return (
    <section className="py-14 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {dict.stats.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {dict.stats.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {dict.stats.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-stretch gap-4">
          {metrics.map((item) => (
            <StatMetricCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

