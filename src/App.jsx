import { useState, useEffect, useMemo } from 'react';
import {
  Search, Phone, MessageCircle, ShoppingBag, Menu, X, ChevronLeft, ChevronRight,
  Smartphone, Wrench, ShieldCheck, Award, Zap, Users,
  MapPin, Clock, Send, Plus, Trash2, SlidersHorizontal, ArrowUpRight,
  Eye, Settings, Package, Tag, ExternalLink, Info, BatteryCharging,
  Volume2, Camera, Droplets, Terminal, Unlock, Sparkles, Store, ImagePlus,
  LoaderCircle
} from 'lucide-react';
import {
  deleteRemoteProduct,
  fetchAdminProducts,
  fetchPublicProducts,
  isProductApiConfigured,
  saveRemoteProduct,
  uploadRemoteProductImage,
  verifyAdminSession,
} from './services/productApi.js';

/**
 * VERMA ELECTRONICS - MAIN SARDARPURA, LALRU, PUNJAB, INDIA
 * Redesigned Streamlined Architecture:
 * - Clean 5-Section Storefront Homepage:
 *   1. Hero Showcase & Brand Strip
 *   2. 11 Categories & Filterable Electronics/Mobile Showcase
 *   3. Express Mobile Repair Center & Booking Form
 *   4. Special Deals, Why Verma Electronics & Genuine Reviews
 *   5. Lalru Showroom Location, Contact & Footer
 * - Single-Page Owner Admin Manager (No cluttered multi-tab dashboard: clean unified page to add, edit & delete everything)
 */

const IMAGES = {
  iphone16: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80',
  samsungS25: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=80',
  oneplusNord: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80',
  redmiNote: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
  vivoV40: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=900&q=80',
  realmePro: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=900&q=80',
  refurbIphone: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=900&q=80',
  usedAndroid: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=900&q=80',
  repairBench: '/mobile-repair-collage.jpg',
  repairTech: '/mobile-repair-collage.jpg',
  fridge: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=900&q=80',
  washingMachine: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=80',
  ledTv: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=80',
  airConditioner: 'https://images.unsplash.com/photo-1625961332771-3f40b0e2bdcf?auto=format&fit=crop&w=900&q=80',
  microwave: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=900&q=80',
  earbuds: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80',
  smartwatch: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=80',
  btSpeaker: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80',
  chargerCable: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80',
  powerBank: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80',
  phoneCase: 'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=900&q=80',
  heroSlide1: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1400&q=85',
  heroSlide3: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1400&q=85',
  heroSlide4: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=85',
};

const EMPTY_PRODUCT_FORM = {
  name: '',
  brand: '',
  category: 'Latest Smartphones',
  price: '',
  discountPrice: '',
  condition: 'New',
  image: '',
  specsText: '',
  shortDescription: '',
  description: '',
  availabilityStatus: 'in_stock',
  isFeatured: false,
  published: true,
};

const SafeImage = ({ src, alt, className = '', fallbackLabel = 'Verma Electronics' }) => {
  const [failedSrc, setFailedSrc] = useState(null);

  if (failedSrc === src || !src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F3F6FA] to-[#E2E8F0] text-[#101828] p-4 text-center ${className}`}>
        <div className="w-11 h-11 rounded-2xl bg-[#101828] text-[#00C2FF] flex items-center justify-center mb-2 shadow-sm">
          <Smartphone className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold text-[#182230] line-clamp-2">{fallbackLabel || alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      className={className}
    />
  );
};

const CATEGORIES = [
  { id: 'Latest Smartphones', title: 'Latest Smartphones', image: IMAGES.iphone16, tag: '5G Flagships' },
  { id: 'Second-Hand & Refurbished Mobiles', title: 'Second-Hand & Refurbished', image: IMAGES.refurbIphone, tag: 'Tested Phones' },
  { id: 'Mobile Accessories', title: 'Mobile Accessories', image: IMAGES.chargerCable, tag: 'Covers & Chargers' },
  { id: 'Mobile Repairing Services', title: 'Mobile Repair Lab', image: IMAGES.repairTech, tag: 'Fast Service', isService: true },
  { id: 'Smartwatches', title: 'Smartwatches', image: IMAGES.smartwatch, tag: 'AMOLED Wear' },
  { id: 'Bluetooth Speakers & Earbuds', title: 'Earbuds & Speakers', image: IMAGES.earbuds, tag: 'Wireless Audio' },
  { id: 'LED TVs', title: 'Smart LED TVs', image: IMAGES.ledTv, tag: '4K Ultra HD' },
  { id: 'Refrigerators', title: 'Refrigerators', image: IMAGES.fridge, tag: 'Inverter Tech' },
  { id: 'Washing Machines', title: 'Washing Machines', image: IMAGES.washingMachine, tag: 'Front & Top Load' },
  { id: 'Kitchen Appliances', title: 'Kitchen Appliances', image: IMAGES.microwave, tag: 'Home & Kitchen' },
  { id: 'Other Electronics', title: 'ACs & Electronics', image: IMAGES.airConditioner, tag: 'Cooling & More' },
];

const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Apple iPhone 16',
    brand: 'Apple',
    category: 'Latest Smartphones',
    price: 79900,
    originalPrice: 84900,
    ram: '8GB',
    storage: '128GB',
    condition: 'New',
    image: IMAGES.iphone16,
    specs: ['A18 Chip', '6.1" Super Retina XDR', '48MP Fusion Camera'],
    description: 'Demo showcase entry for Apple iPhone 16. Contact Verma Electronics in Main Sardarpura, Lalru for color availability and today’s store offer.',
  },
  {
    id: 'prod-2',
    name: 'Samsung Galaxy S25',
    brand: 'Samsung',
    category: 'Latest Smartphones',
    price: 80999,
    originalPrice: 85999,
    ram: '12GB',
    storage: '256GB',
    condition: 'New',
    image: IMAGES.samsungS25,
    specs: ['Snapdragon Elite', '120Hz AMOLED', 'Galaxy AI'],
    description: 'Demo showcase entry for Samsung Galaxy S25. Visit our Lalru showroom for live hands-on experience and exchange valuation.',
  },
  {
    id: 'prod-3',
    name: 'OnePlus Nord 4 5G',
    brand: 'OnePlus',
    category: 'Latest Smartphones',
    price: 29999,
    originalPrice: 32999,
    ram: '8GB',
    storage: '256GB',
    condition: 'New',
    image: IMAGES.oneplusNord,
    specs: ['Metal Unibody', '100W SUPERVOOC', '5500mAh Battery'],
    description: 'Demo showcase entry for OnePlus Nord 4 5G. Enquire on WhatsApp for current variant availability at Verma Electronics.',
  },
  {
    id: 'prod-4',
    name: 'Redmi Note 14 Pro 5G',
    brand: 'Redmi',
    category: 'Latest Smartphones',
    price: 23999,
    originalPrice: 26999,
    ram: '8GB',
    storage: '128GB',
    condition: 'New',
    image: IMAGES.redmiNote,
    specs: ['1.5K Curved AMOLED', '50MP OIS', 'IP68 Rated'],
    description: 'Demo showcase entry for Redmi Note 14 Pro 5G. Popular value smartphone for students and families in Lalru.',
  },
  {
    id: 'prod-5',
    name: 'Vivo V40 5G',
    brand: 'Vivo',
    category: 'Latest Smartphones',
    price: 34999,
    originalPrice: 37999,
    ram: '8GB',
    storage: '256GB',
    condition: 'New',
    image: IMAGES.vivoV40,
    specs: ['ZEISS Portrait Camera', '5500mAh Battery', '80W Charge'],
    description: 'Demo showcase entry for Vivo V40 5G with ZEISS optics. Ask Mr. Verma for latest store pricing.',
  },
  {
    id: 'prod-6',
    name: 'Apple iPhone 14 (Certified Refurbished)',
    brand: 'Apple',
    category: 'Second-Hand & Refurbished Mobiles',
    price: 41500,
    originalPrice: 54900,
    ram: '6GB',
    storage: '128GB',
    condition: 'Refurbished',
    image: IMAGES.refurbIphone,
    specs: ['Multi-Point Tested', 'A15 Bionic', 'Verified Battery'],
    description: 'Demo showcase entry for certified refurbished smartphones at Verma Electronics.',
  },
  {
    id: 'prod-7',
    name: 'Samsung Galaxy A54 (Pre-Owned)',
    brand: 'Samsung',
    category: 'Second-Hand & Refurbished Mobiles',
    price: 18500,
    originalPrice: 28999,
    ram: '8GB',
    storage: '128GB',
    condition: 'Used',
    image: IMAGES.usedAndroid,
    specs: ['120Hz Super AMOLED', '50MP OIS', 'Clean Condition'],
    description: 'Demo showcase entry for clean second-hand smartphones. Stock changes daily—message us on WhatsApp.',
  },
  {
    id: 'prod-8',
    name: 'Samsung 253L Double Door Refrigerator',
    brand: 'Samsung',
    category: 'Refrigerators',
    price: 26490,
    originalPrice: 31990,
    ram: 'N/A',
    storage: '253L',
    condition: 'New',
    image: IMAGES.fridge,
    specs: ['Digital Inverter', 'Convertible Freezer', 'Stabilizer Free'],
    description: 'Demo showcase entry for Samsung Double Door Refrigerator. Local delivery in Lalru available upon enquiry.',
  },
  {
    id: 'prod-9',
    name: 'LG 7 Kg Front Load Washing Machine',
    brand: 'LG',
    category: 'Washing Machines',
    price: 29990,
    originalPrice: 35990,
    ram: 'N/A',
    storage: '7 Kg',
    condition: 'New',
    image: IMAGES.washingMachine,
    specs: ['Direct Drive Motor', 'Steam Wash', 'In-Built Heater'],
    description: 'Demo showcase entry for LG Front-Load Washing Machine. Contact Verma Electronics for seasonal deals.',
  },
  {
    id: 'prod-10',
    name: 'Sony Bravia 55" 4K Smart LED TV',
    brand: 'Sony',
    category: 'LED TVs',
    price: 57990,
    originalPrice: 69900,
    ram: 'N/A',
    storage: '55 Inch',
    condition: 'New',
    image: IMAGES.ledTv,
    specs: ['4K Processor X1', 'Google TV', 'Dolby Audio'],
    description: 'Demo showcase entry for Sony Bravia 55-inch 4K Google TV.',
  },
  {
    id: 'prod-11',
    name: 'ANC Wireless Earbuds Pro',
    brand: 'OnePlus',
    category: 'Bluetooth Speakers & Earbuds',
    price: 2999,
    originalPrice: 3999,
    ram: 'N/A',
    storage: '38Hr Playtime',
    condition: 'New',
    image: IMAGES.earbuds,
    specs: ['45dB Active Noise Cancel', 'Dual Connection', 'IP55'],
    description: 'Demo showcase entry for ANC wireless earbuds.',
  },
  {
    id: 'prod-12',
    name: '45W GaN Fast Charger & Braided Cable',
    brand: 'Samsung',
    category: 'Mobile Accessories',
    price: 1699,
    originalPrice: 2499,
    ram: 'N/A',
    storage: '45W PD',
    condition: 'New',
    image: IMAGES.chargerCable,
    specs: ['45W Super Fast Charge', 'Over-Voltage Safe', 'Type-C Cable'],
    description: 'Demo showcase entry for fast chargers, cables, tempered glass, and mobile covers.',
  },
];

function normalizeProduct(product) {
  return {
    ...product,
    name: product.name || '',
    brand: product.brand || '',
    category: product.category || '',
    price: Number(product.price) || 0,
    discountPrice: Number(product.discountPrice) || null,
    image: product.image || '',
    images: Array.isArray(product.images) ? product.images : [],
    shortDescription: product.shortDescription || product.description || '',
    description: product.description || '',
    specs: Array.isArray(product.specs) ? product.specs : [],
    availabilityStatus: product.availabilityStatus || 'in_stock',
    isFeatured: product.isFeatured === true,
    published: product.published !== false,
    condition: product.condition || 'New',
  };
}

function getProductImageUrls(product) {
  const additionalImages = (Array.isArray(product.images) ? product.images : [])
    .map((image) => (typeof image === 'string' ? image : image?.url))
    .filter((url) => typeof url === 'string' && url.length > 0);
  return Array.from(new Set([product.image, ...additionalImages].filter(Boolean)));
}

function getAvailabilityLabel(status) {
  const labels = {
    in_stock: 'In stock',
    available: 'Available',
    preorder: 'Pre-order',
    out_of_stock: 'Out of stock',
    unavailable: 'Unavailable',
  };
  return labels[status] || String(status || 'Unavailable').replaceAll('_', ' ');
}

function isProductAvailable(status) {
  return ['in_stock', 'available', 'preorder'].includes(status);
}

const INITIAL_OFFERS = [
  {
    id: 'off-1',
    tag: 'Smartphone Deals',
    title: 'Latest 5G Mobiles & Easy Exchange',
    description: 'Upgrade your old phone in Main Sardarpura, Lalru with honest on-the-spot valuation and store offers.',
    highlight: 'Ask for Today’s Store Price',
    image: IMAGES.samsungS25,
  },
  {
    id: 'off-2',
    tag: 'Accessories & Protection',
    title: 'Cover + Tempered Glass + Fast Charger Combo',
    description: 'Complete protection and super-fast charging bundles with free precision tempered glass fitting in-store.',
    highlight: 'Free Glass Application',
    image: IMAGES.earbuds,
  },
  {
    id: 'off-3',
    tag: 'Home Appliances',
    title: 'Refrigerators, Washers & 4K LED TVs',
    description: 'Upgrade your family home with reliable electronics and friendly local after-sales assistance in Lalru.',
    highlight: 'Family Package Enquiries',
    image: IMAGES.fridge,
  },
];

const REPAIR_SERVICES = [
  { title: 'Broken Screen Replacement', desc: 'High-clarity OLED & LCD screen replacements with precision bonding.', icon: Smartphone, time: 'Same-Day Service' },
  { title: 'Battery Replacement', desc: 'Restore all-day battery backup with reliable tested batteries.', icon: BatteryCharging, time: '45–90 Mins' },
  { title: 'Charging Port Repair', desc: 'Fix loose charging pins, slow charging & USB-C/Lightning faults.', icon: Zap, time: 'Same-Day Fix' },
  { title: 'Speaker & Mic Repair', desc: 'Clear call voice, earpiece volume & loudspeaker restoration.', icon: Volume2, time: 'Quick Bench Fix' },
  { title: 'Camera Repair', desc: 'Front/rear camera module and scratched camera lens glass replacement.', icon: Camera, time: 'Component Check' },
  { title: 'Water Damage Repair', desc: 'Ultrasonic motherboard cleaning & liquid spill recovery.', icon: Droplets, time: 'Priority Check' },
  { title: 'Software & Data Transfer', desc: 'OS updates, boot-loop fix, storage cleanup & phone-to-phone transfer.', icon: Terminal, time: '1–2 Hours' },
  { title: 'Phone Unlocking & Troubleshooting', desc: 'Authorized passcode/account recovery with valid proof of ownership.', icon: Unlock, time: 'Proof Required' },
];

const HERO_SLIDES = [
  {
    id: 0,
    eyebrow: 'VERMA ELECTRONICS • MAIN SARDARPURA, LALRU',
    title: 'Your One-Stop Destination for Mobiles & Electronics',
    subtitle: 'Latest 5G phones, checked second-hand & refurbished mobiles, quick screen and battery repairs, plus fridges, washing machines, and LED TVs for homes in Lalru.',
    subtextNote: 'Walk in for honest advice from Mr. Verma or message us on WhatsApp before visiting.',
    primaryCta: 'Explore Products',
    primaryTarget: 'section-2-catalog',
    secondaryCta: 'Book a Repair',
    secondaryTarget: 'section-3-repair',
    image: IMAGES.heroSlide1,
    badge: '5G Phones, Refurbished & Home Appliances',
  },
  {
    id: 1,
    eyebrow: 'IN-HOUSE MOBILE REPAIR LAB',
    title: 'Expert Mobile Repair at the Right Price',
    subtitle: 'Cracked display, battery draining fast, loose charging port, or liquid spill? We check the fault clearly and fix most common issues without long wait times.',
    subtextNote: 'Covers iPhone, Samsung, OnePlus, Vivo, Oppo, Realme & Redmi.',
    primaryCta: 'Book a Repair',
    primaryTarget: 'section-3-repair',
    secondaryCta: 'WhatsApp Repair Desk',
    secondaryTarget: 'whatsapp',
    image: IMAGES.repairBench,
    badge: 'Screen, Battery, Charging & Software',
  },
  {
    id: 2,
    eyebrow: 'HOME & KITCHEN APPLIANCES',
    title: 'Upgrade Your Home with Quality Electronics',
    subtitle: 'Double-door refrigerators, front & top load washing machines, smart LED TVs, and daily kitchen appliances chosen for everyday family reliability.',
    subtextNote: 'Local assistance and clear product details right here in Main Sardarpura.',
    primaryCta: 'Browse Appliances',
    primaryTarget: 'section-2-catalog',
    secondaryCta: 'Ask Today’s Price',
    secondaryTarget: 'whatsapp',
    image: IMAGES.heroSlide3,
    badge: 'Refrigerators, Washers & Smart TVs',
  },
];

export default function App() {
  // 'store' = 5-Section Customer Website | 'admin' = Clean Single-Page Owner Editor
  const [pageMode, setPageMode] = useState('store');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeProductImage, setActiveProductImage] = useState('');
  const [enquiryDrawerOpen, setEnquiryDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [productsLoading, setProductsLoading] = useState(isProductApiConfigured);
  const [productApiError, setProductApiError] = useState('');

  // Persistent Store Settings
  const [storeSettings, setStoreSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('ve_v3_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fall back to defaults when localStorage is unavailable or contains invalid JSON.
    }
    return {
      businessName: 'Verma Electronics',
      ownerName: 'Mr. Verma',
      address: 'Main Sardarpura, Lalru, Punjab, India',
      phoneNumber: '',
      whatsappNumber: '',
      openingHours: 'Editable in Admin (e.g., Mon–Sun: 9:30 AM – 8:30 PM)',
      mapQuery: 'Main Sardarpura, Lalru, Punjab, India',
    };
  });

  // Persistent Products
  const [products, setProducts] = useState(() => {
    if (isProductApiConfigured) return [];
    try {
      const saved = localStorage.getItem('ve_v3_products');
      if (saved) return JSON.parse(saved).map(normalizeProduct);
    } catch {
      // Fall back to defaults when localStorage is unavailable or contains invalid JSON.
    }
    return INITIAL_PRODUCTS.map(normalizeProduct);
  });

  // Persistent Offers
  const [offers, setOffers] = useState(() => {
    try {
      const saved = localStorage.getItem('ve_v3_offers');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fall back to defaults when localStorage is unavailable or contains invalid JSON.
    }
    return INITIAL_OFFERS;
  });

  // Persistent Repair Bookings
  const [repairBookings, setRepairBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('ve_v3_repairs');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fall back to an empty repair queue when localStorage is unavailable.
    }
    return [];
  });

  // Persistent Customer Enquiries & Genuine Reviews
  const [enquiries, setEnquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('ve_v3_enquiries');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fall back to an empty enquiry list when localStorage is unavailable.
    }
    return [];
  });

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('ve_v3_reviews');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fall back to an empty review list when localStorage is unavailable.
    }
    return [];
  });

  const [enquiryList, setEnquiryList] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem('ve_v3_settings', JSON.stringify(storeSettings));
      if (!isProductApiConfigured) {
        localStorage.setItem('ve_v3_products', JSON.stringify(products));
      }
      localStorage.setItem('ve_v3_offers', JSON.stringify(offers));
      localStorage.setItem('ve_v3_repairs', JSON.stringify(repairBookings));
      localStorage.setItem('ve_v3_enquiries', JSON.stringify(enquiries));
      localStorage.setItem('ve_v3_reviews', JSON.stringify(reviews));
    } catch {
      // The app remains usable when browser storage is unavailable.
    }
  }, [storeSettings, products, offers, repairBookings, enquiries, reviews]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openWhatsAppEnquiry = (text) => {
    const cleanNum = (storeSettings.whatsappNumber || '').replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(text);
    const url = cleanNum ? `https://wa.me/${cleanNum}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    if (!isProductApiConfigured) return undefined;
    let active = true;
    fetchPublicProducts()
      .then((items) => {
        if (active) {
          setProducts(items.map(normalizeProduct));
          setProductApiError('');
        }
      })
      .catch((error) => {
        if (active) setProductApiError(`Could not load products: ${error.message}`);
      })
      .finally(() => {
        if (active) setProductsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedProduct) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setSelectedProduct(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [selectedProduct]);

  const openAdminPanel = async () => {
    try {
      if (isProductApiConfigured) {
        await verifyAdminSession();
        const adminProducts = await fetchAdminProducts();
        setProducts(adminProducts.map(normalizeProduct));
      } else {
        showToast('Local demo mode: changes are saved only in this browser.', 'info');
      }
      setPageMode('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const returnToStorefront = async () => {
    if (isProductApiConfigured) {
      try {
        const publicProducts = await fetchPublicProducts();
        setProducts(publicProducts.map(normalizeProduct));
      } catch (error) {
        showToast(`Could not refresh the public catalog: ${error.message}`, 'error');
      }
    }
    setPageMode('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProductDetails = (product) => {
    setActiveProductImage(product.image || '');
    setSelectedProduct(product);
  };

  // Hero Slider Autoplay
  const [activeSlide, setActiveSlide] = useState(0);
  const [sliderPaused, setSliderPaused] = useState(false);

  useEffect(() => {
    if (sliderPaused || pageMode !== 'store') return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [sliderPaused, pageMode]);

  // Catalog Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Derive available brands & categories dynamically from live admin products + core defaults
  const availableBrands = useMemo(() => {
    const baseBrands = ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Redmi', 'Vivo', 'Oppo', 'Realme', 'LG', 'Sony'];
    const dynamicBrands = products.map((p) => (p.brand || '').trim()).filter(Boolean);
    return Array.from(new Set([...baseBrands, ...dynamicBrands]));
  }, [products]);

  const availableCategories = useMemo(() => {
    const baseCats = CATEGORIES.filter((c) => !c.isService).map((c) => ({ id: c.id, title: c.title }));
    const dynamicCats = products
      .map((p) => (p.category || '').trim())
      .filter(Boolean)
      .filter((cat) => !baseCats.some((b) => b.id === cat))
      .map((cat) => ({ id: cat, title: cat }));
    return [...baseCats, ...dynamicCats];
  }, [products]);

  const availableConditions = useMemo(() => {
    const baseConds = ['New', 'Refurbished', 'Used'];
    const dynamicConds = products.map((p) => (p.condition || '').trim()).filter(Boolean);
    return Array.from(new Set([...baseConds, ...dynamicConds]));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.published === false) return false;
      const matchSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchBrand = selectedBrand === 'All' || p.brand === selectedBrand;
      const matchCond = selectedCondition === 'All' || p.condition === selectedCondition;

      let matchPrice = true;
      const currentPrice = p.discountPrice || p.price;
      if (selectedPriceRange === 'under10k') matchPrice = currentPrice < 10000;
      else if (selectedPriceRange === '10kto35k') matchPrice = currentPrice >= 10000 && currentPrice <= 35000;
      else if (selectedPriceRange === 'above35k') matchPrice = currentPrice > 35000;

      return matchSearch && matchCat && matchBrand && matchCond && matchPrice;
    });
  }, [products, searchQuery, selectedCategory, selectedBrand, selectedCondition, selectedPriceRange]);

  const scrollToSection = (id, category = null) => {
    if (pageMode !== 'store') setPageMode('store');
    if (category) setSelectedCategory(category);
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 70);
  };

  const toggleEnquiryItem = (product) => {
    setEnquiryList((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        showToast(`Removed ${product.name} from shortlist`, 'info');
        return prev.filter((item) => item.id !== product.id);
      }
      showToast(`Added ${product.name} to shortlist`);
      return [...prev, product];
    });
  };

  // Repair Form
  const [repairForm, setRepairForm] = useState({
    customerName: '',
    mobileNumber: '',
    phoneBrand: '',
    phoneModel: '',
    repairProblem: 'Broken Screen Replacement',
    visitDate: '',
  });
  const [repairTicket, setRepairTicket] = useState(null);

  const handleRepairSubmit = (e) => {
    e.preventDefault();
    if (!repairForm.customerName.trim() || !repairForm.mobileNumber.trim() || !repairForm.phoneBrand.trim()) {
      showToast('Please enter your name, mobile number, and phone brand.', 'error');
      return;
    }
    const ticket = {
      id: `VE-${Math.floor(1000 + Math.random() * 9000)}`,
      ...repairForm,
      status: 'Pending',
      createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setRepairBookings((prev) => [ticket, ...prev]);
    setRepairTicket(ticket);
    showToast(`Repair request ${ticket.id} saved!`);
    setRepairForm({
      customerName: '',
      mobileNumber: '',
      phoneBrand: '',
      phoneModel: '',
      repairProblem: 'Broken Screen Replacement',
      visitDate: '',
    });
  };

  // Contact & Review Forms
  const [contactForm, setContactForm] = useState({ name: '', phone: '', message: '' });
  const [reviewForm, setReviewForm] = useState({ customerName: '', rating: 5, comment: '' });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.phone.trim() || !contactForm.message.trim()) {
      showToast('Please fill in all fields.', 'error');
      return;
    }
    setEnquiries((prev) => [
      {
        id: `ENQ-${Date.now()}`,
        ...contactForm,
        createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      },
      ...prev,
    ]);
    showToast('Enquiry sent to Mr. Verma!');
    setContactForm({ name: '', phone: '', message: '' });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.customerName.trim() || !reviewForm.comment.trim()) return;
    setReviews((prev) => [
      {
        id: `REV-${Date.now()}`,
        ...reviewForm,
        createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      },
      ...prev,
    ]);
    showToast('Thank you for your genuine review!');
    setReviewForm({ customerName: '', rating: 5, comment: '' });
  };

  return (
    <div
      className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-[#182230] selection:bg-[#00C2FF]/20"
    >
      <style>{`
        html { scroll-behavior: smooth; overflow-x: hidden; }
        @keyframes marqueeInfinite {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-infinite {
          display: flex;
          width: max-content;
          animation: marqueeInfinite 32s linear infinite;
        }
        .animate-marquee-infinite:hover {
          animation-play-state: paused;
        }
        .marquee-track {
          mask-image: linear-gradient(to right, transparent, black 3%, black 97%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 3%, black 97%, transparent);
        }
        @media (max-width: 640px) {
          .animate-marquee-infinite {
            animation-duration: 24s;
          }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float-slow {
          animation: floatSlow 4.5s ease-in-out infinite;
        }
      `}</style>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 sm:bottom-24 left-4 right-4 sm:left-auto sm:right-6 z-50 sm:max-w-sm bg-[#101828] text-white px-4 py-3.5 rounded-2xl shadow-2xl border border-white/15 flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${toast.type === 'error' ? 'bg-rose-400' : 'bg-[#00C2FF]'}`} />
          <p className="text-xs sm:text-sm font-medium">{toast.message}</p>
        </div>
      )}

      {/* =====================================================================
          PREMIUM GLASSMORPHIC HEADER (5-SECTION NAVIGATION + ADMIN SWITCH)
         ===================================================================== */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-2xl border-b border-slate-200/80 shadow-2xs">
        <div className="bg-gradient-to-r from-[#0B1120] via-[#101828] to-[#172554] text-white text-[11px] sm:text-xs py-3 sm:py-2">
          <div className="site-container flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2">
            <div className="flex items-center justify-center gap-2 min-w-0 w-full sm:w-auto">
              <span className="inline-flex items-center justify-center gap-1.5 text-slate-200 text-center">
                <MapPin className="w-3.5 h-3.5 text-[#00C2FF] flex-shrink-0" />
                <span>{storeSettings.address}</span>
              </span>
              <span className="hidden md:inline-flex items-center gap-1.5 text-slate-400 border-l border-white/15 pl-3">
                <Clock className="w-3.5 h-3.5 text-[#00C2FF]" />
                <span>Prop: {storeSettings.ownerName}</span>
              </span>
            </div>
            <button
              onClick={pageMode === 'store' ? openAdminPanel : returnToStorefront}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#0284C7] hover:brightness-110 text-white font-bold shadow-sm transition flex-shrink-0"
            >
              {pageMode === 'store' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00C2FF]" />
                  <span>Owner Admin Panel</span>
                </>
              ) : (
                <>
                  <Store className="w-3.5 h-3.5 text-[#00C2FF]" />
                  <span>Back to Storefront</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="site-container min-h-[68px] sm:min-h-[72px] py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
          {/* Brand Monogram & Title */}
          <button
            onClick={() => {
              setPageMode('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-2 sm:gap-3 text-center sm:text-left group min-w-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#0B1120] via-[#1E3A8A] to-[#2563EB] flex items-center justify-center shadow-md ring-1 ring-black/5 flex-shrink-0 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 36 36" className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none">
                <path d="M7 9L18 28L29 9" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13 9L18 18L23 9" stroke="#00C2FF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="min-w-0">
              <span className="block text-base sm:text-xl font-extrabold tracking-tight text-[#101828] leading-tight truncate">
                VERMA <span className="text-[#2563EB]">ELECTRONICS</span>
              </span>
              <span className="block text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
                Lalru • Mobiles, Repair & Home Appliances
              </span>
            </div>
          </button>

          {/* 5-Section Pill Navigation */}
          {pageMode === 'store' && (
            <nav className="hidden lg:flex items-center bg-[#F3F6FA] p-1 rounded-2xl border border-slate-200/70">
              {[
                { label: '1. Showcase', id: 'section-1-hero' },
                { label: '2. Products', id: 'section-2-catalog' },
                { label: '3. Mobile Repair', id: 'section-3-repair' },
                { label: '4. Deals & Trust', id: 'section-4-deals' },
                { label: '5. Visit & Contact', id: 'section-5-contact' },
              ].map((nav) => (
                <button
                  key={nav.id}
                  onClick={() => scrollToSection(nav.id)}
                  className="px-3.5 py-2 rounded-xl text-xs xl:text-sm font-bold text-[#182230] hover:text-[#2563EB] hover:bg-white hover:shadow-2xs transition"
                >
                  {nav.label}
                </button>
              ))}
            </nav>
          )}

          {/* Header Right Controls */}
          {pageMode === 'store' && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() =>
                  openWhatsAppEnquiry('Hello Verma Electronics (Main Sardarpura, Lalru), I have an enquiry.')
                }
                className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => setEnquiryDrawerOpen(true)}
                aria-label="Enquiry Shortlist"
                className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-[#F3F6FA] hover:bg-slate-200 text-[#101828] border border-slate-200/70 transition"
              >
                <ShoppingBag className="w-4 h-4" />
                {enquiryList.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#2563EB] text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                    {enquiryList.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Open menu"
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-[#101828] text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && pageMode === 'store' && (
          <div className="lg:hidden bg-white border-t border-slate-200 p-4 space-y-2 shadow-2xl">
            {[
              { label: '1. Hero Showcase', id: 'section-1-hero' },
              { label: '2. Categories & Products', id: 'section-2-catalog' },
              { label: '3. Mobile Repair Lab', id: 'section-3-repair' },
              { label: '4. Deals & Why Verma Electronics', id: 'section-4-deals' },
              { label: '5. Showroom Location & Contact', id: 'section-5-contact' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="w-full text-left px-4 py-3 rounded-xl bg-[#F3F6FA] hover:bg-[#2563EB] hover:text-white text-sm font-bold text-[#101828] transition"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={async () => {
                setMobileMenuOpen(false);
                await openAdminPanel();
              }}
              className="w-full py-3 rounded-xl bg-[#101828] text-white text-sm font-bold flex items-center justify-center gap-2 mt-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#00C2FF]" />
              Open Owner Admin Panel
            </button>
          </div>
        )}
      </header>

      {/* =====================================================================
          SWITCH BETWEEN CLEAN SINGLE-PAGE ADMIN EDITOR & 5-SECTION STOREFRONT
         ===================================================================== */}
      {pageMode === 'admin' ? (
        <SinglePageAdminManager
          products={products}
          setProducts={setProducts}
          offers={offers}
          setOffers={setOffers}
          repairBookings={repairBookings}
          setRepairBookings={setRepairBookings}
          enquiries={enquiries}
          setEnquiries={setEnquiries}
          reviews={reviews}
          setReviews={setReviews}
          storeSettings={storeSettings}
          setStoreSettings={setStoreSettings}
          apiEnabled={isProductApiConfigured}
          showToast={showToast}
          onBackToStore={returnToStorefront}
        />
      ) : (
        <main>
          <section
            id="section-1-hero"
            className="relative overflow-hidden bg-[#101828]"
            onMouseEnter={() => setSliderPaused(true)}
            onMouseLeave={() => setSliderPaused(false)}
          >
            <div className="site-container pt-10 sm:pt-12 lg:pt-14 pb-8 relative z-10">
              {HERO_SLIDES.map((slide, idx) => {
                if (idx !== activeSlide) return null;
                return (
                  <div key={slide.id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    <div className="lg:col-span-6 space-y-6">
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#00C2FF] text-xs sm:text-sm font-bold tracking-wide">
                        <Sparkles className="w-4 h-4 flex-shrink-0" />
                        <span>{slide.eyebrow}</span>
                      </span>

                      <h1
                        className="font-display text-4xl sm:text-5xl xl:text-[56px] font-extrabold tracking-tight leading-[1.08] text-white"
                      >
                        {slide.title}
                      </h1>

                      <div className="space-y-2 max-w-xl">
                        <p className="font-body text-slate-200 text-base sm:text-lg leading-relaxed font-medium">
                          {slide.subtitle}
                        </p>
                        <p className="font-body text-xs sm:text-sm text-slate-400">
                          {slide.subtextNote}
                        </p>
                      </div>

                      {/* 3 Quick Store Highlights with Clear Subtext */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 max-w-2xl">
                        <div className="bg-white/6 border border-white/10 rounded-2xl p-3.5">
                          <span className="font-display block text-base sm:text-lg font-extrabold text-white">11 Departments</span>
                          <span className="font-body block text-xs text-slate-300 mt-0.5 leading-snug">
                            Mobiles, TVs, fridges &amp; accessories
                          </span>
                        </div>
                        <div className="bg-white/6 border border-white/10 rounded-2xl p-3.5">
                          <span className="font-display block text-base sm:text-lg font-extrabold text-[#00C2FF]">Repair Lab</span>
                          <span className="font-body block text-xs text-slate-300 mt-0.5 leading-snug">
                            Screens, batteries, ports &amp; software
                          </span>
                        </div>
                        <div className="bg-white/6 border border-white/10 rounded-2xl p-3.5">
                          <span className="font-display block text-base sm:text-lg font-extrabold text-emerald-400">Lalru Local</span>
                          <span className="font-body block text-xs text-slate-300 mt-0.5 leading-snug">
                            Main Sardarpura • Prop: Mr. Verma
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                        <button
                          onClick={() => scrollToSection(slide.primaryTarget)}
                          className="min-h-[52px] px-7 py-4 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition"
                        >
                          <span>{slide.primaryCta}</span>
                          <ArrowUpRight className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => {
                            if (slide.secondaryTarget === 'whatsapp') {
                              openWhatsAppEnquiry('Hi Verma Electronics (Lalru), please let me know today’s availability and price.');
                            } else {
                              scrollToSection(slide.secondaryTarget);
                            }
                          }}
                          className="min-h-[52px] px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition"
                        >
                          <MessageCircle className="w-5 h-5 text-[#00C2FF]" />
                          <span>{slide.secondaryCta}</span>
                        </button>
                      </div>
                    </div>

                    {/* Realistic Studio Showcase Framing */}
                    <div className="lg:col-span-6">
                      <div className="relative">
                        <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl aspect-[4/3] sm:aspect-[16/11] bg-slate-900">
                          <SafeImage src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/90 via-transparent to-transparent" />
                          <div className="absolute bottom-3.5 left-3.5 right-3.5 bg-[#101828]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-4 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <span className="block text-sm font-extrabold text-white truncate">{slide.badge}</span>
                              <span className="block text-xs text-slate-300 truncate">Main Sardarpura, Lalru, Punjab</span>
                            </div>
                            <span className="px-3 py-1.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold flex-shrink-0">
                              Verma Electronics
                            </span>
                          </div>
                        </div>

                        {/* Floating Realistic Product Accent Card (Desktop/Tablet) */}
                        <div className="hidden sm:flex items-center gap-3.5 absolute -top-5 -right-3 bg-white text-[#101828] p-3 pr-4 rounded-2xl shadow-2xl border border-slate-100 animate-float-slow">
                          <SafeImage
                            src={IMAGES.iphone16}
                            alt="Flagship Smartphones"
                            className="w-14 h-14 rounded-xl object-contain bg-[#F3F6FA] p-1.5"
                          />
                          <div>
                            <span className="block text-[11px] font-extrabold uppercase text-[#2563EB]">Showroom Pick</span>
                            <span className="block text-sm font-extrabold text-[#101828]">Smartphones &amp; TVs</span>
                            <span className="block text-xs text-slate-500">Check live stock in store</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Slide Controls */}
              <div className="flex items-center justify-between mt-9 pt-5 border-t border-white/10">
                <div className="flex items-center gap-2.5">
                  {HERO_SLIDES.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveSlide(i)}
                      aria-label={`Slide ${i + 1}`}
                      className={`h-3 rounded-full transition-all ${activeSlide === i ? 'w-11 bg-[#00C2FF]' : 'w-3 bg-white/30'}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                    aria-label="Previous slide"
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/10 hover:bg-[#2563EB] text-white transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                    aria-label="Next slide"
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/10 hover:bg-[#2563EB] text-white transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* INFINITE SEAMLESS BRAND & DEPARTMENT MARQUEE STRIP */}
            <div className="marquee-track bg-[#0B1120]/80 border-t border-white/10 py-3.5 sm:py-4 overflow-hidden">
              <div className="site-container mb-2.5 flex items-center justify-center sm:justify-start">
                <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#00C2FF]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C2FF] shadow-[0_0_12px_rgba(0,194,255,0.8)]" />
                  Popular brands & services
                </span>
              </div>
              <div className="animate-marquee-infinite flex items-center">
                {[...Array(2)].map((_, loopIdx) => (
                  <div key={loopIdx} className="flex items-center gap-2.5 pr-2.5">
                    {['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Redmi', 'Vivo', 'Oppo', 'Realme', 'LG', 'Sony'].map((brand) => (
                      <button
                        key={`${loopIdx}-${brand}`}
                        onClick={() => {
                          setSelectedBrand(brand);
                          scrollToSection('section-2-catalog');
                        }}
                        className="min-w-[88px] px-4 py-2 rounded-xl bg-white/[0.07] hover:bg-[#2563EB] border border-white/10 hover:border-[#2563EB] text-xs sm:text-sm font-extrabold tracking-wide text-white transition whitespace-nowrap shadow-sm"
                      >
                        {brand}
                      </button>
                    ))}
                    {['Screen Repair', 'Battery Repair', 'Refurbished Phones', 'LED TVs', 'Home Appliances'].map((service) => (
                      <span
                        key={`${loopIdx}-${service}`}
                        className="px-4 py-2 rounded-xl bg-[#00C2FF]/10 border border-[#00C2FF]/20 text-[11px] sm:text-xs font-bold text-[#79DFFF] whitespace-nowrap"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* =================================================================
              SECTION 2: ALL 11 CATEGORIES & FILTERABLE PRODUCT SHOWCASE
             ================================================================= */}
          <section id="section-2-catalog" className="store-section bg-white">
            <div className="site-container space-y-12">
              {/* Header + 11 Visual Category Strip */}
              <div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold uppercase mb-2">
                      11 Complete Departments
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
                      Explore Mobiles, Appliances & Accessories
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center justify-start md:justify-end gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-800 border border-amber-500/20 text-xs font-bold">
                      <Info className="w-3.5 h-3.5" />
                      Showing {filteredProducts.length} of {products.length} Items • Demo Prices Until Edited in Admin
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                        setSelectedBrand('All');
                        setSelectedCondition('All');
                        setSelectedPriceRange('All');
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm transition"
                    >
                      View All Products
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Horizontal Visual Category Cards */}
                <div className="flex gap-3.5 overflow-x-auto pb-3 no-scrollbar">
                  {CATEGORIES.map((cat) => {
                    const active = selectedCategory === cat.id;
                    const countInCat = cat.isService
                      ? REPAIR_SERVICES.length
                      : products.filter((p) => p.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          if (cat.isService) scrollToSection('section-3-repair');
                          else setSelectedCategory(active ? 'All' : cat.id);
                        }}
                        className={`w-40 sm:w-44 flex-shrink-0 rounded-2xl overflow-hidden border text-left transition ${
                          active
                            ? 'border-[#2563EB] ring-2 ring-[#2563EB]/30 bg-[#101828] text-white'
                            : 'border-slate-200 bg-[#F3F6FA] hover:bg-white text-[#101828]'
                        }`}
                      >
                        <div className="h-24 w-full bg-white overflow-hidden">
                          <SafeImage src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`block text-[10px] font-bold uppercase truncate ${active ? 'text-[#00C2FF]' : 'text-[#2563EB]'}`}>
                              {cat.tag}
                            </span>
                            <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${active ? 'bg-white/15 text-white' : 'bg-white text-slate-600'}`}>
                              {countInCat}
                            </span>
                          </div>
                          <span className="block text-xs font-extrabold mt-0.5 line-clamp-1">{cat.title}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filter Bar */}
              <div className="bg-[#F3F6FA] p-4 sm:p-5 rounded-3xl border border-slate-200/80 space-y-3">
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-3">
                  <div className="lg:col-span-5 flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search iPhone, Samsung, Refrigerator, TV..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                      className="lg:hidden min-h-[46px] px-3.5 rounded-xl bg-[#101828] text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-[#00C2FF]" />
                      <span>Filters</span>
                    </button>
                  </div>

                  <div className={`${mobileFiltersOpen ? 'grid' : 'hidden'} lg:grid lg:col-span-7 grid-cols-1 sm:grid-cols-4 gap-2.5`}>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-3 rounded-xl bg-white border border-slate-200 text-sm font-medium"
                    >
                      <option value="All">All Categories</option>
                      {availableCategories.map((c) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>

                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="px-3 py-3 rounded-xl bg-white border border-slate-200 text-sm font-medium"
                    >
                      <option value="All">All Brands</option>
                      {availableBrands.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>

                    <select
                      value={selectedPriceRange}
                      onChange={(e) => setSelectedPriceRange(e.target.value)}
                      className="px-3 py-3 rounded-xl bg-white border border-slate-200 text-sm font-medium"
                    >
                      <option value="All">Any Price</option>
                      <option value="under10k">Under ₹10,000</option>
                      <option value="10kto35k">₹10,000 – ₹35,000</option>
                      <option value="above35k">Above ₹35,000</option>
                    </select>

                    <select
                      value={selectedCondition}
                      onChange={(e) => setSelectedCondition(e.target.value)}
                      className="px-3 py-3 rounded-xl bg-white border border-slate-200 text-sm font-medium"
                    >
                      <option value="All">All Conditions</option>
                      {availableConditions.map((cond) => (
                        <option key={cond} value={cond}>{cond}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {productsLoading ? (
                <div className="flex items-center justify-center gap-3 py-14 text-slate-600">
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-semibold">Loading products…</span>
                </div>
              ) : productApiError ? (
                <div role="alert" className="text-center py-10 px-4 bg-rose-50 rounded-3xl border border-rose-200 text-rose-800">
                  <p className="font-bold">Products could not be loaded</p>
                  <p className="mt-1 text-sm">{productApiError}</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-14 bg-[#F3F6FA] rounded-3xl border border-dashed border-slate-300">
                  <p className="text-base font-bold text-[#101828]">
                    {products.length === 0 ? 'No products are available right now.' : 'No products match your current filter'}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedBrand('All');
                      setSelectedCondition('All');
                      setSelectedPriceRange('All');
                    }}
                    className="mt-3 px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isSaved={enquiryList.some((i) => i.id === product.id)}
                      onToggleSave={() => toggleEnquiryItem(product)}
                      onViewDetails={() => openProductDetails(product)}
                      onWhatsApp={() =>
                        openWhatsAppEnquiry(
                          `Hello Verma Electronics (Lalru), I want to enquire about:\n• Product: ${product.name}\n• Condition: ${product.condition}\n• Price: ₹${(product.discountPrice || product.price).toLocaleString('en-IN')}\nPlease confirm live availability.`
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* =================================================================
              SECTION 3: EXPRESS MOBILE REPAIR CENTER & BOOKING FORM
             ================================================================= */}
          <section id="section-3-repair" className="store-section bg-[#101828] text-white">
            <div className="site-container space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C2FF]/15 text-[#00C2FF] text-xs font-bold uppercase">
                    <Wrench className="w-3.5 h-3.5" />
                    Expert Mobile Repairing • Main Sardarpura, Lalru
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Fast, Reliable & Affordable Mobile Repairing
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
                    Tap any service below to pre-select your issue and book a repair slot with Verma Electronics.
                  </p>
                </div>
                <div className="lg:col-span-5">
                  <div className="rounded-3xl overflow-hidden border border-white/15 h-56 sm:h-64">
                    <SafeImage src={IMAGES.repairBench} alt="Mobile Repair Lab" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* 8 Repair Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {REPAIR_SERVICES.map((srv) => {
                  const Icon = srv.icon;
                  const active = repairForm.repairProblem === srv.title;
                  return (
                    <button
                      type="button"
                      key={srv.title}
                      onClick={() => {
                        setRepairForm((prev) => ({ ...prev, repairProblem: srv.title }));
                        showToast(`Selected "${srv.title}"`);
                      }}
                      className={`text-left p-5 rounded-3xl border transition ${
                        active
                          ? 'bg-[#2563EB]/25 border-[#00C2FF]'
                          : 'bg-white/5 hover:bg-white/10 border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[#2563EB]/30 text-[#00C2FF] flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-bold text-[#00C2FF]">{srv.time}</span>
                      </div>
                      <h3 className="text-base font-bold text-white">{srv.title}</h3>
                      <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{srv.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Repair Booking Form */}
              <div className="bg-white text-[#182230] rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <h3 className="text-2xl font-extrabold text-[#101828]">Book Your Repair Now</h3>
                    <p className="text-sm text-slate-600">Register your phone issue for priority check at Verma Electronics, Lalru.</p>
                  </div>
                  {repairTicket && (
                    <span className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                      Logged Ticket: {repairTicket.id} ✓
                    </span>
                  )}
                </div>

                <form onSubmit={handleRepairSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Customer Name *"
                    value={repairForm.customerName}
                    onChange={(e) => setRepairForm({ ...repairForm, customerName: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-[#F3F6FA] border border-slate-200 text-sm"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Number *"
                    value={repairForm.mobileNumber}
                    onChange={(e) => setRepairForm({ ...repairForm, mobileNumber: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-[#F3F6FA] border border-slate-200 text-sm"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Phone Brand (e.g., iPhone, Samsung) *"
                    value={repairForm.phoneBrand}
                    onChange={(e) => setRepairForm({ ...repairForm, phoneBrand: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-[#F3F6FA] border border-slate-200 text-sm"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Phone Model (e.g., Galaxy A54) *"
                    value={repairForm.phoneModel}
                    onChange={(e) => setRepairForm({ ...repairForm, phoneModel: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-[#F3F6FA] border border-slate-200 text-sm"
                  />
                  <select
                    value={repairForm.repairProblem}
                    onChange={(e) => setRepairForm({ ...repairForm, repairProblem: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-[#F3F6FA] border border-slate-200 text-sm font-semibold"
                  >
                    {REPAIR_SERVICES.map((s) => (
                      <option key={s.title} value={s.title}>{s.title}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={repairForm.visitDate}
                    onChange={(e) => setRepairForm({ ...repairForm, visitDate: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-[#F3F6FA] border border-slate-200 text-sm"
                  />
                  <div className="sm:col-span-2 lg:col-span-3 flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-3.5 px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm transition"
                    >
                      Book Your Repair Now
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        openWhatsAppEnquiry(
                          `Hello Verma Electronics (Lalru), I want to book a repair:\n• Name: ${repairForm.customerName || 'Customer'}\n• Device: ${repairForm.phoneBrand} ${repairForm.phoneModel}\n• Problem: ${repairForm.repairProblem}`
                        )
                      }
                      className="py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp Repair Desk
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>

          {/* =================================================================
              SECTION 4: SPECIAL DEALS, ABOUT VERMA ELECTRONICS & REVIEWS
             ================================================================= */}
          <section id="section-4-deals" className="store-section bg-[#F3F6FA] border-b border-slate-200">
            <div className="site-container space-y-14">
              {/* Editable Special Deals */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB] text-white text-xs font-bold uppercase mb-2">
                      <Tag className="w-3.5 h-3.5" />
                      Store Deals & Combos
                    </span>
                    <h2 className="text-3xl font-extrabold text-[#101828]">
                      Upgrade Your Tech. Enjoy Great Deals!
                    </h2>
                  </div>
                  <button
                    onClick={() =>
                      openWhatsAppEnquiry('Hello Verma Electronics (Lalru), please share today’s best store deals.')
                    }
                    className="self-start sm:self-end px-5 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Ask for Today&apos;s Best Price
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {offers.map((offer) => (
                    <div key={offer.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs flex flex-col">
                      <div className="h-44 bg-slate-100">
                        <SafeImage src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-bold text-[#2563EB] uppercase">{offer.tag}</span>
                          <h3 className="text-lg font-extrabold text-[#101828] mt-1">{offer.title}</h3>
                          <p className="text-sm text-slate-600 mt-2">{offer.description}</p>
                        </div>
                        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-700">{offer.highlight}</span>
                          <button
                            onClick={() =>
                              openWhatsAppEnquiry(`Hello Verma Electronics, I am asking about "${offer.title}".`)
                            }
                            className="text-xs font-bold text-[#2563EB] hover:underline"
                          >
                            Enquire →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* About & Trust Pillars + Genuine Reviews */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-5">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold uppercase">
                    Your Trusted Electronics Partner in Lalru
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
                    Why Families & Students Choose Verma Electronics
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    Led by <strong>Mr. Verma</strong> at <strong>Main Sardarpura, Lalru, Punjab</strong>, Verma Electronics offers smartphones, certified refurbished devices, accessories, home appliances, and expert mobile repair under one roof with transparent pricing and personal after-sales support.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {[
                      { icon: ShieldCheck, label: 'Trusted Local Showroom' },
                      { icon: Award, label: 'Genuine Product Information' },
                      { icon: Wrench, label: 'Expert In-House Mobile Repair' },
                      { icon: Users, label: 'Friendly After-Sales Assistance' },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="flex items-center gap-3 p-3 rounded-2xl bg-[#F3F6FA]">
                          <div className="w-9 h-9 rounded-xl bg-[#101828] text-[#00C2FF] flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-[#101828]">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Genuine Reviews Box (Zero Fake Reviews) */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-4">
                  <h3 className="text-xl font-extrabold text-[#101828]">Genuine Customer Reviews</h3>
                  {reviews.length === 0 ? (
                    <p className="text-xs text-slate-500 bg-[#F3F6FA] p-4 rounded-2xl">
                      No fake testimonials here—be the first customer from Lalru to share your honest visit experience below!
                    </p>
                  ) : (
                    <div className="space-y-2.5 max-h-48 overflow-y-auto">
                      {reviews.map((rev) => (
                        <div key={rev.id} className="p-3.5 rounded-2xl bg-[#F3F6FA]">
                          <div className="flex items-center justify-between text-xs font-bold text-[#101828]">
                            <span>{rev.customerName}</span>
                            <span className="text-amber-500">{'★'.repeat(rev.rating)}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleReviewSubmit} className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={reviewForm.customerName}
                        onChange={(e) => setReviewForm({ ...reviewForm, customerName: e.target.value })}
                        className="col-span-2 px-3 py-2.5 rounded-xl bg-[#F3F6FA] border border-slate-200 text-xs"
                      />
                      <select
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                        className="px-2 py-2.5 rounded-xl bg-[#F3F6FA] border border-slate-200 text-xs font-bold"
                      >
                        <option value={5}>5 ★</option>
                        <option value={4}>4 ★</option>
                        <option value={3}>3 ★</option>
                      </select>
                    </div>
                    <textarea
                      rows={2}
                      required
                      placeholder="Write your honest feedback..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#F3F6FA] border border-slate-200 text-xs"
                    />
                    <button type="submit" className="w-full py-2.5 rounded-xl bg-[#101828] hover:bg-[#2563EB] text-white text-xs font-bold transition">
                      Post Genuine Review
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================================
              SECTION 5: SHOWROOM LOCATION, CONTACT & FOOTER
             ================================================================= */}
          <section id="section-5-contact" className="store-section bg-white">
            <div className="site-container pb-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-6 space-y-5">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold uppercase">
                    Visit Verma Electronics
                  </span>
                  <h2 className="text-3xl font-extrabold text-[#101828]">
                    Main Sardarpura, Lalru, Punjab
                  </h2>

                  <div className="bg-[#F3F6FA] rounded-3xl p-6 border border-slate-200 space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-[#101828]">{storeSettings.businessName} (Prop: {storeSettings.ownerName})</p>
                        <p className="text-slate-600">{storeSettings.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-[#101828]">Phone & WhatsApp</p>
                        {storeSettings.phoneNumber ? (
                          <a href={`tel:${storeSettings.phoneNumber}`} className="text-[#2563EB] font-bold hover:underline">
                            {storeSettings.phoneNumber}
                          </a>
                        ) : (
                          <p className="text-xs text-slate-500">Configurable in Admin Edit Page</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-[#101828]">Opening Hours</p>
                        <p className="text-slate-600 text-xs">{storeSettings.openingHours}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2.5 pt-2">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeSettings.mapQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-[#101828] text-white text-xs font-bold inline-flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Get Directions
                      </a>
                      <button
                        onClick={() => openWhatsAppEnquiry('Hello Verma Electronics (Lalru), I would like to connect with the store.')}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold inline-flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp Store
                      </button>
                    </div>
                  </div>

                  <div className="rounded-3xl overflow-hidden border border-slate-200 h-56">
                    <iframe
                      title="Verma Electronics Lalru Map"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(storeSettings.mapQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="lg:col-span-6 bg-[#F3F6FA] rounded-3xl p-6 sm:p-8 border border-slate-200">
                  <h3 className="text-2xl font-extrabold text-[#101828]">Quick Store Enquiry</h3>
                  <p className="text-sm text-slate-600 mt-1 mb-5">
                    Send a message directly to Mr. Verma for product prices, exchange quotes, or repair assistance.
                  </p>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <input
                      type="text"
                      required
                      placeholder="Your Name *"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone / WhatsApp Number *"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm"
                    />
                    <textarea
                      rows={4}
                      required
                      placeholder="How can we help you today? *"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm"
                    />
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm flex items-center justify-center gap-2 transition"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Clean Footer */}
            <footer className="bg-[#101828] text-slate-300 py-8 border-t border-white/10">
              <div className="site-container flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-center sm:text-left">
                <div className="min-w-0">
                  <span className="font-extrabold text-white text-sm">VERMA ELECTRONICS</span>
                  <span className="block sm:inline sm:ml-2 text-slate-400">
                    Main Sardarpura, Lalru, Punjab, India • Prop: {storeSettings.ownerName}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={openAdminPanel}
                    className="text-[#00C2FF] font-bold hover:underline"
                  >
                    Owner Admin Edit Page
                  </button>
                  <span>© {new Date().getFullYear()} Verma Electronics</span>
                </div>
              </div>
            </footer>
          </section>
        </main>
      )}

      {/* Floating WhatsApp Button */}
      <button
        onClick={() =>
          openWhatsAppEnquiry('Hello Verma Electronics (Main Sardarpura, Lalru), I would like to enquire about a product/service.')
        }
        aria-label="WhatsApp Store"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-auto sm:h-auto flex items-center justify-center gap-2 sm:px-5 sm:py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-2xl transition"
      >
        <MessageCircle className="w-6 h-6 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">WhatsApp Store</span>
      </button>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedProduct(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-details-title"
            className="bg-white rounded-t-3xl sm:rounded-3xl max-w-5xl w-full max-h-[94vh] sm:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 shrink-0">
              <span className="px-2.5 py-1 rounded-full bg-[#F3F6FA] text-slate-700 text-xs font-bold">
                {selectedProduct.condition} • {getAvailabilityLabel(selectedProduct.availabilityStatus)}
              </span>
              <button
                type="button"
                aria-label="Close product details"
                onClick={() => setSelectedProduct(null)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F3F6FA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid md:grid-cols-2 min-h-0 overflow-y-auto">
              <div className="p-5 md:p-8 bg-[#F8FAFC] flex flex-col gap-3">
                <div className="aspect-square max-h-[48vh] md:max-h-[60vh] w-full bg-white rounded-2xl p-5 flex items-center justify-center">
                  <SafeImage
                    src={activeProductImage || selectedProduct.image}
                    alt={selectedProduct.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                {getProductImageUrls(selectedProduct).length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {getProductImageUrls(selectedProduct).map((imageUrl) => (
                      <button
                        key={imageUrl}
                        type="button"
                        aria-label={`View another image of ${selectedProduct.name}`}
                        onClick={() => setActiveProductImage(imageUrl)}
                        className={`w-16 h-16 shrink-0 rounded-xl bg-white border p-1 ${activeProductImage === imageUrl ? 'border-[#2563EB]' : 'border-slate-200'}`}
                      >
                        <SafeImage src={imageUrl} alt="" className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-5 md:p-8 space-y-5">
                <div>
                  <span className="text-xs font-bold text-[#2563EB] uppercase">{selectedProduct.brand} • {selectedProduct.category}</span>
                  <h2 id="product-details-title" className="text-2xl font-extrabold text-[#101828] mt-1">{selectedProduct.name}</h2>
                  <div className="flex items-baseline gap-2 mt-3">
                    <p className="font-price text-2xl font-extrabold text-[#101828]">
                      ₹{(selectedProduct.discountPrice || selectedProduct.price).toLocaleString('en-IN')}
                    </p>
                    {(selectedProduct.discountPrice || selectedProduct.originalPrice > selectedProduct.price) && (
                      <p className="font-price text-sm text-slate-400 line-through">
                        ₹{(selectedProduct.discountPrice ? selectedProduct.price : selectedProduct.originalPrice).toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                  <p className={`mt-2 text-sm font-semibold ${isProductAvailable(selectedProduct.availabilityStatus) ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {getAvailabilityLabel(selectedProduct.availabilityStatus)}
                  </p>
                </div>
                {selectedProduct.description && (
                  <section>
                    <h3 className="font-bold text-[#101828]">Product details</h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-600 whitespace-pre-line">{selectedProduct.description}</p>
                  </section>
                )}
                {selectedProduct.specs.length > 0 && (
                  <section>
                    <h3 className="font-bold text-[#101828]">Features & specifications</h3>
                    <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProduct.specs.map((spec) => (
                        <li key={spec} className="px-3 py-2 rounded-xl bg-[#F3F6FA] text-sm text-slate-700">{spec}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  openWhatsAppEnquiry(
                    `Hello Verma Electronics (Lalru), I want to enquire about ${selectedProduct.name} (Price: ₹${(selectedProduct.discountPrice || selectedProduct.price).toLocaleString('en-IN')}).`
                  )
                }
                className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Enquire on WhatsApp
              </button>
              <button
                type="button"
                onClick={() => toggleEnquiryItem(selectedProduct)}
                className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-bold"
              >
                {enquiryList.some((i) => i.id === selectedProduct.id) ? 'Saved ✓' : '+ Shortlist'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shortlist Drawer */}
      {enquiryDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-lg font-extrabold text-[#101828]">Enquiry Shortlist ({enquiryList.length})</h3>
                <button onClick={() => setEnquiryDrawerOpen(false)} className="p-2 rounded-xl bg-[#F3F6FA]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {enquiryList.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-16">No items shortlisted yet.</p>
              ) : (
                <div className="mt-4 space-y-2.5 max-h-[65vh] overflow-y-auto">
                  {enquiryList.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#F3F6FA]">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#101828] truncate">{item.name}</p>
                        <p className="font-price text-xs text-slate-500">₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                      <button onClick={() => toggleEnquiryItem(item)} className="p-2 text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {enquiryList.length > 0 && (
              <button
                onClick={() => {
                  const list = enquiryList.map((i, idx) => `${idx + 1}. ${i.name} (₹${i.price.toLocaleString('en-IN')})`).join('\n');
                  openWhatsAppEnquiry(`Hello Verma Electronics (Lalru), please share availability for:\n${list}`);
                }}
                className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Send All on WhatsApp
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * PRODUCT CARD COMPONENT
 */
function ProductCard({ product, isSaved, onToggleSave, onViewDetails, onWhatsApp }) {
  const displayPrice = product.discountPrice || product.price;
  const originalPrice = product.discountPrice
    ? product.price
    : product.originalPrice > product.price ? product.originalPrice : null;
  const available = isProductAvailable(product.availabilityStatus);
  return (
    <div className="group bg-white rounded-3xl border border-slate-200/85 hover:border-[#2563EB]/40 shadow-xs hover:shadow-xl transition-all flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3] w-full bg-[radial-gradient(circle_at_center,_#FFFFFF_0%,_#F1F5F9_100%)] p-4 flex items-center justify-center overflow-hidden">
        <SafeImage
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#101828]/85 text-white text-[10px] font-bold">
          {product.condition}
        </span>
        <button
          onClick={onToggleSave}
          aria-label="Shortlist"
          className={`absolute top-2.5 right-2.5 w-9 h-9 flex items-center justify-center rounded-full border transition ${
            isSaved ? 'bg-[#2563EB] text-white border-[#2563EB]' : 'bg-white/95 text-slate-600 border-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-bold text-[#2563EB] uppercase">{product.brand}</span>
          <h3 className="text-base font-extrabold text-[#101828] mt-0.5 line-clamp-2">{product.name}</h3>
          {product.shortDescription && (
            <p className="mt-1 text-xs text-slate-500 line-clamp-2">{product.shortDescription}</p>
          )}
          <div className="flex flex-wrap gap-1 mt-2">
            {product.specs.slice(0, 2).map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-md bg-[#F3F6FA] text-slate-600 text-[11px] font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
          <div className="flex items-baseline gap-2">
            <span className="font-price text-lg font-extrabold text-[#101828]">₹{displayPrice.toLocaleString('en-IN')}</span>
            {originalPrice && (
              <span className="font-price text-xs text-slate-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
            )}
            <span className={`ml-auto text-[10px] font-bold ${available ? 'text-emerald-700' : 'text-rose-600'}`}>
              {getAvailabilityLabel(product.availabilityStatus)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onViewDetails}
              className="py-2.5 px-3 rounded-xl bg-[#F3F6FA] hover:bg-slate-200 text-[#101828] text-xs font-bold flex items-center justify-center gap-1 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              Details
            </button>
            <button
              onClick={onWhatsApp}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 transition"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * CLASSIC EXECUTIVE OWNER ADMIN PANEL
 * Dark Left Navigation Rail + Structured White Workspace Cards, KPI Metrics,
 * Live Product Card Preview, Search/Filter, and One-Click Status Controls.
 */
function SinglePageAdminManager({
  products,
  setProducts,
  offers,
  setOffers,
  repairBookings,
  setRepairBookings,
  enquiries,
  setEnquiries,
  reviews,
  setReviews,
  storeSettings,
  setStoreSettings,
  apiEnabled,
  showToast,
  onBackToStore,
}) {
  const [adminSearch, setAdminSearch] = useState('');
  const [adminCatFilter, setAdminCatFilter] = useState('All');

  // Product Form (Add or Inline Edit)
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [imageMode, setImageMode] = useState('url');
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);

  useEffect(() => () => {
    if (imagePreviewUrl.startsWith('blob:')) URL.revokeObjectURL(imagePreviewUrl);
  }, [imagePreviewUrl]);

  const adminFilteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !adminSearch.trim() ||
        p.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
        p.brand.toLowerCase().includes(adminSearch.toLowerCase());
      const matchCat = adminCatFilter === 'All' || p.category === adminCatFilter;
      return matchSearch && matchCat;
    });
  }, [products, adminSearch, adminCatFilter]);

  const adminProductCategories = useMemo(() => Array.from(new Set([
    ...CATEGORIES.filter((category) => !category.isService).map((category) => category.id),
    ...products.map((product) => product.category).filter(Boolean),
  ])), [products]);

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const price = Number(productForm.price);
    const discountPrice = productForm.discountPrice ? Number(productForm.discountPrice) : null;
    if (!productForm.name.trim() || !Number.isFinite(price) || price <= 0) {
      showToast('Enter a product name and a valid price greater than zero.', 'error');
      return;
    }
    if (discountPrice !== null && (!Number.isFinite(discountPrice) || discountPrice <= 0 || discountPrice >= price)) {
      showToast('Discount price must be greater than zero and lower than the regular price.', 'error');
      return;
    }
    if (imageMode === 'url' && productForm.image.trim()) {
      try {
        const imageUrl = new URL(productForm.image.trim());
        if (!['http:', 'https:'].includes(imageUrl.protocol)) throw new Error();
      } catch {
        showToast('Enter a valid http or https image URL.', 'error');
        return;
      }
    }
    if (selectedImageFile && imageMode === 'upload' && !apiEnabled) {
      showToast('Configure the product API and Cloudinary upload route to save uploaded images.', 'error');
      return;
    }

    setSavingProduct(true);
    try {
      const currentProduct = products.find((product) => product.id === editingProductId);
      let image = imageMode === 'url' ? productForm.image.trim() : currentProduct?.image || '';
      if (selectedImageFile && imageMode === 'upload') {
        setUploadingImage(true);
        image = await uploadRemoteProductImage(selectedImageFile);
        setUploadingImage(false);
      }

      const payload = {
        ...(currentProduct || {}),
        name: productForm.name.trim(),
        brand: productForm.brand.trim(),
        category: productForm.category,
        price,
        discountPrice,
        originalPrice: discountPrice ? price : null,
        condition: productForm.condition,
        image,
        images: currentProduct?.images || [],
        specs: productForm.specsText.split(',').map((item) => item.trim()).filter(Boolean),
        shortDescription: productForm.shortDescription.trim(),
        description: productForm.description.trim(),
        availabilityStatus: productForm.availabilityStatus,
        isFeatured: productForm.isFeatured,
        published: productForm.published,
      };

      let savedProduct = payload;
      if (apiEnabled) {
        const response = await saveRemoteProduct(payload, editingProductId);
        const remoteRecord = response?.product || response;
        if (!editingProductId && (remoteRecord?.id === undefined || remoteRecord?.id === null)) {
          throw new Error('The product API must return the created product with its id.');
        }
        savedProduct = normalizeProduct({ ...payload, ...(remoteRecord || {}), id: remoteRecord?.id ?? editingProductId });
      } else {
        savedProduct = normalizeProduct({ ...payload, id: editingProductId || `prod-${Date.now()}` });
      }

      if (editingProductId) {
        setProducts((previous) => previous.map((product) => (
          product.id === editingProductId ? savedProduct : product
        )));
        showToast('Product updated successfully.');
      } else {
        setProducts((previous) => [savedProduct, ...previous]);
        showToast('Product added successfully.');
      }

      setEditingProductId(null);
      setProductForm(EMPTY_PRODUCT_FORM);
      setSelectedImageFile(null);
      setImagePreviewUrl('');
      setImageMode('url');
    } catch (error) {
      setUploadingImage(false);
      showToast(`Could not save product: ${error.message}`, 'error');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Delete "${product.name}" from the catalog?`)) return;
    setDeletingProductId(product.id);
    try {
      if (apiEnabled) await deleteRemoteProduct(product.id);
      setProducts((previous) => previous.filter((item) => item.id !== product.id));
      if (editingProductId === product.id) {
        setEditingProductId(null);
        setProductForm(EMPTY_PRODUCT_FORM);
        setSelectedImageFile(null);
        setImagePreviewUrl('');
      }
      showToast('Product deleted.');
    } catch (error) {
      showToast(`Could not delete product: ${error.message}`, 'error');
    } finally {
      setDeletingProductId(null);
    }
  };

  // Offer Form (Add or Inline Edit)
  const [editingOfferId, setEditingOfferId] = useState(null);
  const [offerForm, setOfferForm] = useState({
    tag: 'Special Offer',
    title: '',
    description: '',
    highlight: 'Ask for Today’s Price',
    image: IMAGES.iphone16,
  });

  const handleSaveOffer = (e) => {
    e.preventDefault();
    if (!offerForm.title.trim()) return;
    if (editingOfferId) {
      setOffers((prev) => prev.map((o) => (o.id === editingOfferId ? { ...o, ...offerForm } : o)));
      showToast('Deal updated!');
      setEditingOfferId(null);
    } else {
      setOffers((prev) => [{ id: `off-${Date.now()}`, ...offerForm }, ...prev]);
      showToast('New store deal added!');
    }
    setOfferForm({
      tag: 'Special Offer',
      title: '',
      description: '',
      highlight: 'Ask for Today’s Price',
      image: IMAGES.iphone16,
    });
  };

  const toggleRepairStatus = (id) => {
    const order = ['Pending', 'In Repair', 'Ready for Pickup'];
    setRepairBookings((prev) =>
      prev.map((rb) => {
        if (rb.id !== id) return rb;
        const nextStatus = order[(order.indexOf(rb.status || 'Pending') + 1) % order.length];
        showToast(`Ticket ${id} marked as "${nextStatus}"`);
        return { ...rb, status: nextStatus };
      })
    );
  };

  const jumpToAdminBox = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#EEF2F6]">
      <div className="site-container py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CLASSIC DARK EXECUTIVE SIDEBAR RAIL */}
          <aside className="lg:col-span-3 lg:sticky lg:top-24 bg-[#0B1120] text-white rounded-3xl p-5 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#00C2FF] text-[#0B1120] font-extrabold text-base flex items-center justify-center shadow-md">
                VE
              </div>
              <div className="min-w-0">
                <span className="block text-sm font-extrabold tracking-tight text-white truncate">
                  {storeSettings.ownerName}
                </span>
                <span className="block text-[11px] font-semibold text-[#00C2FF] truncate">
                  Store Owner Console
                </span>
              </div>
            </div>

            <nav className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-1.5">
              {[
                { label: 'Showroom Info', id: 'admin-box-settings', icon: Settings },
                { label: 'Products & Prices', id: 'admin-box-products', icon: Package },
                { label: 'Offers & Deals', id: 'admin-box-offers', icon: Tag },
                { label: 'Repairs & Inbox', id: 'admin-box-tickets', icon: Wrench },
              ].map((nav) => {
                const Icon = nav.icon;
                return (
                  <button
                    key={nav.id}
                    onClick={() => jumpToAdminBox(nav.id)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-[#2563EB] text-slate-200 hover:text-white text-xs font-bold transition text-left"
                  >
                    <Icon className="w-4 h-4 text-[#00C2FF] flex-shrink-0" />
                    <span className="truncate">{nav.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-white/10 space-y-2.5">
              <div className="bg-white/5 rounded-2xl p-3.5 text-xs space-y-1">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Showroom Location</span>
                <p className="font-semibold text-slate-200 leading-snug">{storeSettings.address}</p>
              </div>
              <button
                onClick={onBackToStore}
                className="w-full py-3 px-4 rounded-xl bg-white text-[#0B1120] hover:bg-[#00C2FF] text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition"
              >
                <Store className="w-4 h-4 text-[#2563EB]" />
                <span>View Live Website</span>
              </button>
            </div>
          </aside>

          {/* MAIN CLASSIC ADMIN WORKSPACE */}
          <div className="lg:col-span-9 space-y-6">
            {/* TOP OVERVIEW BANNER + 4 KPI STAT BOXES */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#2563EB]">
                    Verma Electronics • Management Workspace
                  </span>
                  <h1
                    className="text-2xl sm:text-3xl font-extrabold text-[#101828] mt-0.5"
                  >
                    Owner Control Panel
                  </h1>
                </div>
                <span className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Auto-Saved Locally
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-5">
                {[
                  { label: 'Total Products', value: products.length, badge: 'Catalog', bg: 'bg-blue-50 text-[#2563EB]', icon: Package },
                  { label: 'Active Offers', value: offers.length, badge: 'Promos', bg: 'bg-emerald-50 text-emerald-600', icon: Tag },
                  { label: 'Repair Tickets', value: repairBookings.length, badge: 'Service', bg: 'bg-amber-50 text-amber-600', icon: Wrench },
                  { label: 'Enquiries & Reviews', value: enquiries.length + reviews.length, badge: 'Inbox', bg: 'bg-slate-100 text-[#101828]', icon: MessageCircle },
                ].map((kpi) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={kpi.label} className="rounded-2xl border border-slate-200/80 bg-[#F8FAFC] p-4 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{kpi.badge}</span>
                      </div>
                      <div>
                        <span className="font-price block text-2xl font-extrabold text-[#101828]">{kpi.value}</span>
                        <span className="block text-xs font-semibold text-slate-500 mt-0.5">{kpi.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BOX 1: STORE IDENTITY, CONTACT & HOURS */}
            <div id="admin-box-settings" className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="px-6 py-4 bg-slate-50/90 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#101828] text-[#00C2FF] flex items-center justify-center">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-[#101828]">Showroom Contact & Timings</h2>
                    <p className="text-xs text-slate-500">Updates click-to-call, WhatsApp enquiries, and map pin</p>
                  </div>
                </div>
                <button
                  onClick={() => showToast('Showroom contact details saved!')}
                  className="self-start sm:self-center px-4 py-2 rounded-xl bg-[#101828] hover:bg-[#2563EB] text-white text-xs font-bold transition"
                >
                  Save Settings
                </button>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Showroom Address</label>
                  <input
                    type="text"
                    value={storeSettings.address}
                    onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Opening Hours</label>
                  <input
                    type="text"
                    value={storeSettings.openingHours}
                    onChange={(e) => setStoreSettings({ ...storeSettings, openingHours: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Store Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 XXXXX XXXXX"
                    value={storeSettings.phoneNumber}
                    onChange={(e) => setStoreSettings({ ...storeSettings, phoneNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">WhatsApp Number (91...)</label>
                  <input
                    type="text"
                    placeholder="91XXXXXXXXXX"
                    value={storeSettings.whatsappNumber}
                    onChange={(e) => setStoreSettings({ ...storeSettings, whatsappNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>
            </div>

            {/* BOX 2: PRODUCTS EDITOR WITH LIVE CARD PREVIEW & INVENTORY LIST */}
            <div id="admin-box-products" className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="px-6 py-4 bg-slate-50/90 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-[#101828]">
                                  Product Catalog Manager ({products.length} Items)
                    </h2>
                                <p className="text-xs text-slate-500">
                                  {apiEnabled
                                    ? 'Connected to the product API. The server must authorize all product writes.'
                                    : 'Local demo mode: products are saved in this browser only, not shared with customers on other devices.'}
                                </p>
                  </div>
                </div>
                {editingProductId && (
                  <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 text-xs font-bold">
                    Editing Item
                  </span>
                )}
              </div>

              <div className="p-6 space-y-6">
                {/* Split Editor Form + Live Visual Card Preview */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 bg-[#F8FAFC] p-5 rounded-2xl border border-slate-200/80">
                  <form onSubmit={handleSaveProduct} className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Product Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Apple iPhone 16 Pro Max"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Brand</label>
                      <input
                        type="text"
                        list="admin-brand-suggestions"
                        placeholder="e.g., Samsung, Apple, LG or custom brand"
                        value={productForm.brand}
                        onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium"
                      />
                      <datalist id="admin-brand-suggestions">
                        {['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Redmi', 'Vivo', 'Oppo', 'Realme', 'LG', 'Sony'].map((b) => (
                          <option key={b} value={b} />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Department</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium"
                      >
                        {adminProductCategories.map((category) => (
                          <option key={category} value={category}>
                            {CATEGORIES.find((item) => item.id === category)?.title || category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Regular Price (₹) *</label>
                      <input
                        type="number"
                        required
                        min="0.01"
                        step="0.01"
                        placeholder="e.g., 29999"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Discount Price (₹, optional)</label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="Leave empty for no discount"
                        value={productForm.discountPrice}
                        onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Condition</label>
                      <select
                        value={productForm.condition}
                        onChange={(e) => setProductForm({ ...productForm, condition: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium"
                      >
                        <option value="New">Brand New</option>
                        <option value="Refurbished">Refurbished</option>
                        <option value="Used">Used / Second-Hand</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Product Image</span>
                      <div className="flex gap-2 mb-3">
                        <button
                          type="button"
                          onClick={() => setImageMode('url')}
                          className={`px-3 py-2 rounded-lg text-xs font-bold ${imageMode === 'url' ? 'bg-[#2563EB] text-white' : 'bg-white border border-slate-200 text-slate-700'}`}
                        >
                          Image URL
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageMode('upload')}
                          className={`px-3 py-2 rounded-lg text-xs font-bold ${imageMode === 'upload' ? 'bg-[#2563EB] text-white' : 'bg-white border border-slate-200 text-slate-700'}`}
                        >
                          Upload image
                        </button>
                      </div>
                      {imageMode === 'url' ? (
                        <label className="block">
                          <span className="sr-only">Product image URL</span>
                          <input
                            type="url"
                            placeholder="https://example.com/product-image.jpg"
                            value={productForm.image}
                            onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm"
                          />
                        </label>
                      ) : (
                        <div className="flex flex-wrap items-center gap-3">
                          <label className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold cursor-pointer ${!apiEnabled ? 'opacity-60' : ''}`}>
                            <ImagePlus className="w-4 h-4" />
                            Choose image
                            <input
                              type="file"
                              accept="image/*"
                              disabled={!apiEnabled || uploadingImage || savingProduct}
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (!file) return;
                                setSelectedImageFile(file);
                                setImagePreviewUrl(URL.createObjectURL(file));
                              }}
                              className="sr-only"
                            />
                          </label>
                          {(selectedImageFile || productForm.image) && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedImageFile(null);
                                setImagePreviewUrl('');
                                setProductForm({ ...productForm, image: '' });
                              }}
                              className="px-3 py-2 rounded-xl text-sm font-semibold text-rose-700 bg-rose-50"
                            >
                              Remove image
                            </button>
                          )}
                          <span className="text-xs text-slate-500">
                            {apiEnabled ? 'Images are uploaded securely through your configured API.' : 'Image uploads require the configured product API; use an image URL in local demo mode.'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Features / Specifications (comma separated)</label>
                      <input
                        type="text"
                        placeholder="5G, 8GB RAM, 256GB storage"
                        value={productForm.specsText}
                        onChange={(e) => setProductForm({ ...productForm, specsText: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Availability</label>
                      <select
                        value={productForm.availabilityStatus}
                        onChange={(e) => setProductForm({ ...productForm, availabilityStatus: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm"
                      >
                        <option value="in_stock">In stock</option>
                        <option value="out_of_stock">Out of stock</option>
                        <option value="preorder">Pre-order</option>
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Short Description</label>
                      <input
                        type="text"
                        maxLength={240}
                        placeholder="A brief summary shown on product cards"
                        value={productForm.shortDescription}
                        onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Full Product Description</label>
                      <textarea
                        rows="3"
                        placeholder="Describe the product and its key benefits"
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm resize-y"
                      />
                    </div>
                    <div className="sm:col-span-2 flex flex-wrap gap-x-5 gap-y-2">
                      <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={productForm.isFeatured}
                          onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                          className="accent-[#2563EB]"
                        />
                        Featured product
                      </label>
                      <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={productForm.published}
                          onChange={(e) => setProductForm({ ...productForm, published: e.target.checked })}
                          className="accent-[#2563EB]"
                        />
                        Published on storefront
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex flex-wrap gap-2.5 pt-1">
                      <button
                        type="submit"
                        disabled={savingProduct}
                        className="px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white text-xs sm:text-sm font-bold shadow-sm transition flex items-center gap-1.5"
                      >
                        {savingProduct ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        <span>{uploadingImage ? 'Uploading image…' : savingProduct ? 'Saving…' : editingProductId ? 'Save Product Changes' : 'Add Product to Store'}</span>
                      </button>
                      {editingProductId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProductId(null);
                            setProductForm(EMPTY_PRODUCT_FORM);
                            setSelectedImageFile(null);
                            setImagePreviewUrl('');
                            setImageMode('url');
                          }}
                          className="px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Live Storefront Card Preview */}
                  <div className="xl:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between shadow-2xs">
                    <div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Live Card Preview
                      </span>
                      <div className="aspect-[4/3] w-full rounded-xl bg-[#F8FAFC] p-3 flex items-center justify-center overflow-hidden border border-slate-100">
                        <SafeImage
                          src={imagePreviewUrl || productForm.image}
                          alt={productForm.name || 'Preview'}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="mt-3">
                        <span className="text-[11px] font-bold text-[#2563EB] uppercase">{productForm.brand} • {productForm.condition}</span>
                        <h4 className="text-sm font-extrabold text-[#101828] mt-0.5 line-clamp-1">
                          {productForm.name || 'Product Name Preview'}
                        </h4>
                        <p className="text-base font-extrabold text-[#101828] mt-1">
                          <span className="font-price">₹{Number(productForm.discountPrice || productForm.price || 0).toLocaleString('en-IN')}</span>
                          {productForm.discountPrice && (
                            <span className="font-price ml-2 text-xs text-slate-400 line-through">₹{Number(productForm.price || 0).toLocaleString('en-IN')}</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                      {apiEnabled ? 'Changes sync with the connected product API.' : 'Local demo mode: changes are saved in this browser only.'}
                    </p>
                  </div>
                </div>

                {/* Search & Filter Existing Products */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filter inventory by name or brand..."
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm"
                    />
                  </div>
                  <select
                    value={adminCatFilter}
                    onChange={(e) => setAdminCatFilter(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm font-semibold"
                  >
                    <option value="All">All Departments ({products.length})</option>
                    {adminProductCategories.map((category) => (
                      <option key={category} value={category}>
                        {CATEGORIES.find((item) => item.id === category)?.title || category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Inventory Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[440px] overflow-y-auto pr-1">
                  {adminFilteredProducts.map((p) => (
                    <div
                      key={p.id}
                      className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition ${
                        editingProductId === p.id
                          ? 'bg-blue-50/70 border-[#2563EB]'
                          : 'bg-white hover:bg-[#F8FAFC] border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <SafeImage
                          src={p.image}
                          alt={p.name}
                          className="w-14 h-14 object-contain bg-[#F8FAFC] border border-slate-100 rounded-xl p-1.5 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase text-[#2563EB]">{p.brand} • {p.condition}</span>
                          <p className="text-sm font-extrabold text-[#101828] truncate">{p.name}</p>
                          <p className="font-price text-xs font-bold text-slate-600">₹{(p.discountPrice || p.price).toLocaleString('en-IN')}</p>
                          <p className="text-[10px] font-semibold text-slate-500">
                            {p.published === false ? 'Unpublished' : 'Published'} · {p.availabilityStatus.replaceAll('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => {
                            setEditingProductId(p.id);
                            setSelectedImageFile(null);
                            setImagePreviewUrl('');
                            setImageMode('url');
                            setProductForm({
                              name: p.name,
                              brand: p.brand,
                              category: p.category,
                              price: String(
                                p.discountPrice ? p.price
                                  : p.originalPrice > p.price ? p.originalPrice
                                    : p.price
                              ),
                              discountPrice: String(
                                p.discountPrice || (p.originalPrice > p.price ? p.price : '')
                              ),
                              condition: p.condition,
                              image: p.image,
                              specsText: (p.specs || []).join(', '),
                              shortDescription: p.shortDescription || '',
                              description: p.description || '',
                              availabilityStatus: p.availabilityStatus || 'in_stock',
                              isFeatured: p.isFeatured === true,
                              published: p.published !== false,
                            });
                          }}
                          className="px-3 py-2 rounded-xl bg-[#F3F6FA] hover:bg-[#2563EB] hover:text-white text-[#101828] text-xs font-bold transition"
                        >
                          Edit
                        </button>
                        <button
                          disabled={deletingProductId === p.id}
                          onClick={() => handleDeleteProduct(p)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white disabled:opacity-50 text-rose-600 transition"
                          title="Delete product"
                        >
                          {deletingProductId === p.id
                            ? <LoaderCircle className="w-4 h-4 animate-spin" />
                            : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BOX 3: STORE DEALS & PROMOTIONAL OFFERS */}
            <div id="admin-box-offers" className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="px-6 py-4 bg-slate-50/90 border-b border-slate-200/80 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#101828]">Store Deals & Promotional Banners ({offers.length})</h2>
                  <p className="text-xs text-slate-500">Edit featured combo cards shown on the homepage</p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <form onSubmit={handleSaveOffer} className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Badge Tag"
                    value={offerForm.tag}
                    onChange={(e) => setOfferForm({ ...offerForm, tag: e.target.value })}
                    className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Deal Headline *"
                    value={offerForm.title}
                    onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                    className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Short Details *"
                    value={offerForm.description}
                    onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                    className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm"
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 py-2.5 px-4 rounded-xl bg-[#101828] hover:bg-[#2563EB] text-white text-xs font-bold transition">
                      {editingOfferId ? 'Update Deal' : '+ Add Deal'}
                    </button>
                    {editingOfferId && (
                      <button
                        type="button"
                        onClick={() => setEditingOfferId(null)}
                        className="px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {offers.map((off) => (
                    <div key={off.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between gap-3">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-[10px] font-bold uppercase">
                          {off.tag}
                        </span>
                        <h3 className="text-sm font-extrabold text-[#101828] mt-1.5">{off.title}</h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{off.description}</p>
                      </div>
                      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setEditingOfferId(off.id);
                            setOfferForm({
                              tag: off.tag,
                              title: off.title,
                              description: off.description,
                              highlight: off.highlight,
                              image: off.image,
                            });
                          }}
                          className="flex-1 py-2 rounded-xl bg-[#F3F6FA] hover:bg-[#101828] hover:text-white text-xs font-bold text-[#101828] transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setOffers((prev) => prev.filter((item) => item.id !== off.id));
                            showToast('Deal deleted.');
                          }}
                          className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-xs font-bold text-rose-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BOX 4 & 5: REPAIR DESK QUEUE & CUSTOMER INBOX */}
            <div id="admin-box-tickets" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="px-6 py-4 bg-slate-50/90 border-b border-slate-200/80 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-[#101828]">Repair Tickets ({repairBookings.length})</h2>
                    <p className="text-[11px] text-slate-500">Tap status pill to update progress</p>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  {repairBookings.length === 0 ? (
                    <div className="text-center py-8 bg-[#F8FAFC] rounded-2xl text-xs text-slate-500">
                      No repair requests submitted yet.
                    </div>
                  ) : (
                    repairBookings.map((rb) => (
                      <div key={rb.id} className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-[#2563EB]">{rb.id}</span>
                            <span className="text-xs font-bold text-[#101828] truncate">{rb.customerName} ({rb.mobileNumber})</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            <strong>{rb.phoneBrand} {rb.phoneModel}</strong> — {rb.repairProblem}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => toggleRepairStatus(rb.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-[#101828] hover:border-[#2563EB]"
                          >
                            {rb.status || 'Pending'}
                          </button>
                          <button
                            onClick={() => setRepairBookings((prev) => prev.filter((item) => item.id !== rb.id))}
                            className="p-2 text-rose-600 hover:bg-white rounded-lg"
                            title="Delete ticket"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="px-6 py-4 bg-slate-50/90 border-b border-slate-200/80 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#101828] text-[#00C2FF] flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-[#101828]">
                      Customer Inbox ({enquiries.length + reviews.length})
                    </h2>
                    <p className="text-[11px] text-slate-500">Showroom enquiries & customer reviews</p>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  {enquiries.length === 0 && reviews.length === 0 ? (
                    <div className="text-center py-8 bg-[#F8FAFC] rounded-2xl text-xs text-slate-500">
                      No customer messages or reviews yet.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {enquiries.map((enq) => (
                        <div key={enq.id} className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-start justify-between gap-2">
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded-md bg-blue-100 text-[#2563EB] text-[10px] font-bold uppercase mb-1">
                              Enquiry
                            </span>
                            <p className="text-xs font-bold text-[#101828]">{enq.name} • {enq.phone}</p>
                            <p className="text-xs text-slate-600 mt-0.5">{enq.message}</p>
                          </div>
                          <button
                            onClick={() => setEnquiries((prev) => prev.filter((i) => i.id !== enq.id))}
                            className="p-1.5 text-rose-600 hover:bg-white rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {reviews.map((rev) => (
                        <div key={rev.id} className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-start justify-between gap-2">
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold uppercase mb-1">
                              Review • {rev.rating}★
                            </span>
                            <p className="text-xs font-bold text-[#101828]">{rev.customerName}</p>
                            <p className="text-xs text-slate-600 mt-0.5">{rev.comment}</p>
                          </div>
                          <button
                            onClick={() => setReviews((prev) => prev.filter((i) => i.id !== rev.id))}
                            className="p-1.5 text-rose-600 hover:bg-white rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}