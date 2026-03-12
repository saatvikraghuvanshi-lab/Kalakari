"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// S01: SURGICAL IMPORT
import { createClient } from '@supabase/supabase-js';

// These pull the keys you just saved in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
import { 
  User, ShoppingBag, ArrowLeft, ChevronRight, X, Info, 
  Upload, Trash2, Loader2, LogOut, CheckCircle2, Send, 
  Instagram, Facebook, Mail, ChevronUp, ChevronDown, Menu, Ruler
} from 'lucide-react';

// --- CONSTANTS & ASSETS ---
const ASSETS = {
  SAREE_MAIN: "https://media.samyakk.in/pub/media/catalog/product/b/e/beige-and-gold-dual-tone-tissue-designer-saree-with-thread-work-and-unstitched-blouse-gh1568-a.jpg",
  LEHENGA_MAIN: "https://clothsvilla.com/cdn/shop/products/WhatsAppImage2022-04-02at2.31.50PM_3_1024x1024.jpg?v=1648890244",
  DRESS: "https://cpimg.tistatic.com/5593157/b/1/ladies-plain-one-piece-dress.jpg",
  SHIRT: "https://cdn.cosmos.so/dab01853-00d9-48cb-aebc-95b70bea7b3e?format=jpeg",
  TSHIRT: "https://cdn.cosmos.so/8056a947-4323-498f-990c-3f02f7112368?format=jpeg",
  STOLE: "https://cdn.cosmos.so/3a83e9e8-6a20-43e2-9f68-489ccf5d60dc?format=jpeg",
  SCARF: "https://cdn.cosmos.so/7aef443c-4c6e-4dc2-851a-6e4ce883039c?format=jpeg",
};

const COLORS = [
  { name: 'Ivory', hex: '#FDFBF7' },
  { name: 'Midnight', hex: '#1A1A1A' },
  { name: 'Slate', hex: '#707070' },
  { name: 'Royal Red', hex: '#9B1B1B' },
  { name: 'Cerulean', hex: '#2A5A9F' },
  { name: 'Mustard', hex: '#E1AD01' },
  { name: 'Terracotta', hex: '#C26D50' },
  { name: 'Sage', hex: '#9CAF88' },
  { name: 'Emerald', hex: '#046307' },
  { name: 'Dusty Rose', hex: '#DCAE96' },
  { name: 'Wine', hex: '#4E0E2E' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Antique Silver', hex: '#A8A9AD' }
];

const FABRICS = ['Silk', 'Georgette', 'Organza', 'Chiffon', 'Crepe', 'Chanderi', 'Raw Silk', 'Cotton'];
const EMBROIDERY_STYLES = ['Zardosi', 'Mirror Work', 'Thread Work', 'Gota Patti', 'Aari','Sequin','NONE'];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// --- SIZE CHART DATA ---
const SIZE_CHART = [
  { size: "XS", chest: "34\"", waist: "28\"", length: "26\"" },
  { size: "S", chest: "36\"", waist: "30\"", length: "27\"" },
  { size: "M", chest: "38\"", waist: "32\"", length: "28\"" },
  { size: "L", chest: "40\"", waist: "34\"", length: "29\"" },
  { size: "XL", chest: "42\"", waist: "36\"", length: "30\"" },
  { size: "XXL", chest: "44\"", waist: "38\"", length: "31\"" },
];

// RESTORED LEGAL CONTENT
const TERMS_AND_CONDITIONS = [
  "Bespoke orders require 4-6 weeks for craftsmanship.",
  "Slight variations in color and weave are characteristic of handcrafted textiles and are not considered defects.",
  "No returns on bespoke or altered items.",
  "Shipping timelines may vary based on embroidery complexity.",
  "Final fit is dependent on the measurements provided; we offer one complimentary minor adjustment within 15 days of delivery.",
  "Orders cannot be cancelled once the fabric has been cut or embroidery has commenced."
];

const PRIVACY_POLICY = [
  "We collect only necessary information for order fulfillment.",
  "Your measurements are stored securely for future orders.",
  "We do not share your data with third-party marketers.",
  "Transaction details are encrypted and handled via secure gateways.",
  "We maintain a digital record of your design preferences to provide a more personalized bespoke experience.",
  "Communication regarding your order status will be conducted primarily via WhatsApp or Email.",
  "Our website uses essential cookies to ensure your shopping bag remains intact during your visit.",
  "You may request a copy of the data we hold or ask for its deletion from our studio records at any time."
];

export default function KalaKariStudio() {
  // S02: SURGICAL AUTH STATE
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- UI STATE ---
  const [view, setView] = useState('home');
  const [colType, setColType] = useState<null | 'readymade' | 'custom'>(null);
  const [customCat, setCustomCat] = useState<null | 'Saree' | 'Lehenga' | 'Kurta Set'>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [showCollections, setShowCollections] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [selectedReadymade, setSelectedReadymade] = useState<any>(null);
  const [showSizeChart, setShowSizeChart] = useState(false); // Added for Size Chart
  const [checkoutStep, setCheckoutStep] = useState('contact');
  const [uploading, setUploading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // REQUIREMENT: Strict Admin Verification
  const [isAdmin, setIsAdmin] = useState(false); 
  const ADMIN_EMAILS = [
    "saatvikraghuvanshi123@gmail.com",
    "dhruvhajela5@gmail.com",
    "chhayahajela167@gmail.com"
  ];

  const [archiveItems, setArchiveItems] = useState<any[]>([
    { id: 1, url: ASSETS.SAREE_MAIN },
    { id: 2, url: ASSETS.SHIRT },
    { id: 3, url: ASSETS.LEHENGA_MAIN }
  ]);

  const [selection, setSelection] = useState({
    color: 'Ivory',
    fabric: 'Chanderi Silk',
    work: 'NONE',
    buttons: 'Front',
    sleeve: 'Full Length',
    size: 'M'
  });

  const [form, setForm] = useState({ name: '', mobile: '', house: '' });

  // S03: SURGICAL AUTH EFFECTS
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsAdmin(!!currentUser?.email && ADMIN_EMAILS.includes(currentUser.email));
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsAdmin(!!currentUser?.email && ADMIN_EMAILS.includes(currentUser.email));
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : '',
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigateTo('home');
  };

  const navigateTo = (v: string) => {
    setView(v);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const addToBag = (item: any) => {
    setCart([...cart, { ...item, cartId: Date.now() }]);
    setView('cart');
    setSelectedReadymade(null);
  };

  // REAL UPLOAD LOGIC REPLACING FAKE TIMEOUT
  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      
      const { data: storageData, error: storageError } = await supabase.storage
        .from('archive')
        .upload(fileName, file);

      if (storageError) throw storageError;

      const { data: { publicUrl } } = supabase.storage
        .from('archive')
        .getPublicUrl(fileName);

      const { data, error: dbError } = await supabase
        .from('archive_images')
        .insert([{ url: publicUrl }])
        .select();

      if (dbError) throw dbError;

      setArchiveItems(prev => [data[0], ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id: number) => {
    setArchiveItems(archiveItems.filter(i => i.id !== id));
  };

  const sendWhatsApp = () => {
    const text = `New Order from ${form.name}: ${cart.map(i => i.name).join(', ')}`;
    window.open(`https://wa.me/917991464638?text=${encodeURIComponent(text)}`);
  };

  if (loading) return null;

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#FDFBF7] gap-8 px-6 text-center">
         <h1 className="font-serif text-5xl md:text-6xl italic tracking-tighter text-[#1A1A1A]">KalaKari</h1>
         <button 
           onClick={login} 
           className="px-10 py-4 border border-[#1A1A1A] text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] hover:bg-black hover:text-[#FDFBF7] transition-all"
         >
           Enter Studio with Google
         </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] font-sans selection:bg-stone-200 overflow-x-hidden">
      
      {/* --- HEADER --- */}
      <nav className="relative w-full z-[100] px-6 md:px-12 py-8 md:py-12 flex justify-between items-center bg-transparent">
        <span 
          onClick={() => {navigateTo('home'); setColType(null); setCustomCat(null); setShowCollections(false);}} 
          className="font-serif text-4xl md:text-5xl italic cursor-pointer tracking-tighter text-[#1A1A1A]"
        >
          KalaKari
        </span>

        <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex gap-16 text-[13px] font-bold uppercase tracking-[0.3em] text-stone-500">
          <div className="relative">
            <button 
              onClick={() => setShowCollections(!showCollections)} 
              className={`${showCollections ? 'text-black' : 'hover:text-black'} transition-colors`}
            >
              Collections
            </button>
            <AnimatePresence>
              {showCollections && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setShowCollections(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute left-1/2 -translate-x-1/2 mt-6 flex gap-4 bg-white p-4 border border-stone-100 shadow-[0_20px_40px_rgba(0,0,0,0.08)] rounded-xl z-[110]"
                  >
                    <button 
                      onClick={() => { setColType('readymade'); setView('collections'); setShowCollections(false); }}
                      className="group flex flex-col items-center gap-1 p-3 hover:bg-stone-50 transition-all"
                    >
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black group-hover:scale-105 transition-transform">Readymade</span>
                    </button>
                    <div className="w-[1px] bg-stone-100 self-stretch my-1" />
                    <button 
                      onClick={() => { setColType('custom'); setView('collections'); setShowCollections(false); }}
                      className="group flex flex-col items-center gap-1 p-3 hover:bg-stone-50 transition-all"
                    >
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black group-hover:scale-105 transition-transform">Custom</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          <button onClick={() => navigateTo('samples')} className="hover:text-black transition-colors">The Archive</button>
          <button onClick={() => navigateTo('story')} className="hover:text-black transition-colors">Our Story</button>
        </div>

        <div className="flex items-center gap-5 md:gap-10">
          <button onClick={() => navigateTo('account')} className="hover:opacity-60 transition-opacity">
            <User size={22} strokeWidth={1.2} />
          </button>
          <button onClick={() => navigateTo('cart')} className="relative hover:opacity-60 transition-opacity">
            <ShoppingBag size={22} strokeWidth={1.2} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </button>
          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-stone-600">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* --- MOBILE DRAWER --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            className="fixed inset-0 z-[1000] bg-[#FDFBF7] flex flex-col p-10 lg:hidden"
          >
            <div className="flex justify-between items-center mb-20">
              <span className="font-serif text-3xl italic">KalaKari</span>
              <button onClick={() => setMobileMenuOpen(false)}><X size={30}/></button>
            </div>
            <div className="flex flex-col gap-10 text-2xl font-serif italic text-stone-800">
              <button onClick={() => {setColType('readymade'); navigateTo('collections')}} className="text-left">Readymade Selection</button>
              <button onClick={() => {setColType('custom'); navigateTo('collections')}} className="text-left">Custom Bespoke</button>
              <button onClick={() => navigateTo('samples')} className="text-left">The Archive</button>
              <button onClick={() => navigateTo('story')} className="text-left">Our Story</button>
              <button onClick={() => navigateTo('account')} className="text-left">My Space</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* --- HOME VIEW --- */}
        {view === 'home' && (
          <motion.section 
            key="home" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="pt-8 md:pt-16 pb-32 px-6 md:px-10 max-w-screen-2xl mx-auto"
          >
            <h2 className="font-serif text-[2.8rem] md:text-6xl italic leading-tight mb-12 md:mb-20 max-w-4xl tracking-tighter">
              Handcrafted <br /> with heritage.
            </h2>
            <div className="flex flex-col md:grid md:grid-cols-12 gap-5 md:h-[50vh] mb-16 md:mb-20">
              <div className="h-64 md:h-auto md:col-span-4 overflow-hidden rounded-2xl shadow-sm">
                <img src={ASSETS.SAREE_MAIN} className="h-full w-full object-cover hover:scale-105 transition-transform duration-1000" />
              </div>
              <div className="h-80 md:h-auto md:col-span-5 overflow-hidden rounded-2xl shadow-sm">
                <img src={ASSETS.SHIRT} className="h-full w-full object-cover hover:scale-105 transition-transform duration-1000" />
              </div>
              <div className="h-64 md:h-auto md:col-span-3 overflow-hidden rounded-2xl shadow-sm">
                <img src={ASSETS.LEHENGA_MAIN} className="h-full w-full object-cover hover:scale-105 transition-transform duration-1000" />
              </div>
            </div>
            <div className="flex justify-center">
              <button 
                onClick={() => setMobileMenuOpen(true)} 
                className="w-full md:w-auto border border-[#1A1A1A] px-16 md:px-24 py-5 md:py-6 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-black hover:text-[#FDFBF7] transition-all text-[#1A1A1A]"
              >
                Explore Collections
              </button>
            </div>
          </motion.section>
        )}

        {/* --- CUSTOM / BESPOKE SECTION --- */}
        {(view === 'collections' && colType === 'custom') && (
          <motion.section key="custom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto py-12 md:py-24 px-6 md:px-10">
            <button 
              onClick={() => {setColType(null); setCustomCat(null); setView('home')}} 
              className="mb-8 md:mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400"
            >
              <ArrowLeft size={18}/> Back
            </button>
            
            {!customCat ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Saree', 'Lehenga', 'Kurta Set'].map(c => (
                  <button 
                    key={c} 
                    onClick={() => setCustomCat(c as any)} 
                    className="py-16 md:p-20 border border-stone-200 bg-white rounded-3xl font-serif text-4xl md:text-5xl italic hover:border-black transition-all"
                  >
                    {c}
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] border border-stone-100 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 shadow-sm">
                <div className="lg:col-span-5 space-y-10 md:space-y-12">
                  <h3 className="font-serif text-5xl md:text-6xl italic border-b border-stone-100 pb-6 md:pb-10">{customCat}</h3>
                  <div className="space-y-6">
                    <label className="text-xs uppercase tracking-widest text-stone-400">Palette</label>
                    <div className="flex flex-wrap gap-4 md:gap-5">
                      {COLORS.map(c => (
                        <button 
                          key={c.name} 
                          onClick={() => setSelection({...selection, color: c.name})} 
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-full border border-stone-100 transition-all ${selection.color === c.name ? 'ring-2 ring-black ring-offset-4 scale-110' : ''}`} 
                          style={{ backgroundColor: c.hex }} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <label className="text-xs uppercase tracking-widest text-stone-400">Fabric</label>
                    <div className="grid grid-cols-2 gap-3">
                      {FABRICS.map(f => (
                        <button 
                          key={f} 
                          onClick={() => setSelection({...selection, fabric: f})} 
                          className={`py-3 md:py-4 border text-[9px] md:text-[10px] uppercase tracking-widest rounded-xl transition-all ${selection.fabric === f ? 'bg-black text-white border-black' : 'text-stone-400 border-stone-100'}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-7 space-y-10 md:space-y-12">
                  <div className="space-y-6">
                    <label className="text-xs uppercase tracking-widest text-stone-400">Embroidery Style</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {EMBROIDERY_STYLES.map(s => (
                        <button 
                          key={s} 
                          onClick={() => setSelection({...selection, work: s})} 
                          className={`py-3 md:py-4 border text-[9px] md:text-[10px] uppercase tracking-widest rounded-xl transition-all ${selection.work === s ? 'bg-black text-white border-black' : 'text-stone-400 border-stone-100'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
                    {['Bust', 'Waist', 'Hips', 'Shoulder', 'Apex', 'Armhole'].map(m => (
                      <input key={m} type="text" placeholder={m} className="w-full py-4 border-b border-stone-100 outline-none text-base focus:border-black bg-transparent" />
                    ))}
                  </div>
                  <button 
                    onClick={() => addToBag({ name: `Bespoke ${customCat}`, type: 'custom', ...selection })} 
                    className="w-full bg-[#1A1A1A] text-white py-6 md:py-8 rounded-full text-xs uppercase tracking-[0.3em] font-medium shadow-xl hover:bg-black transition-all"
                  >
                    Send to Studio Bag
                  </button>
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* --- READYMADE GALLERY --- */}
        {(view === 'collections' && colType === 'readymade') && (
          <motion.section key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-screen-2xl mx-auto py-12 md:py-20 px-6 md:px-10">
            <button onClick={() => {setColType(null); setView('home')}} className="mb-8 md:mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400">
              <ArrowLeft size={18}/> Back
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-12 md:gap-y-24">
              {[
                { name: 'Dress', hasSize: true, img: ASSETS.DRESS, price: 1249 }, 
                { name: 'Shirt', hasSize: true, img: ASSETS.SHIRT, price: 899 }, 
                { name: 'T-Shirt', hasSize: true, img: ASSETS.TSHIRT, price: 799 }, 
                { name: 'Stole', hasSize: false, img: ASSETS.STOLE, price: 1299 }
              ].map(product => (
                <div key={product.name} onClick={() => setSelectedReadymade(product)} className="group cursor-pointer">
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl mb-6 md:mb-8">
                    <img src={product.img} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
                  </div>
                  <div className="flex justify-between items-end border-b border-stone-100 pb-4 md:pb-6">
                    <div>
                      <h4 className="font-serif text-2xl md:text-3xl italic">{product.name}</h4>
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">₹{product.price}</p>
                    </div>
                    <ChevronRight size={20} className="text-stone-300 group-hover:text-black transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* --- ARCHIVE / SAMPLES --- */}
        {view === 'samples' && (
          <motion.section key="samples" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-screen-2xl mx-auto py-12 md:py-24 px-6 md:px-10 text-center">
             <button onClick={() => navigateTo('home')} className="mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400 mx-auto">
               <ArrowLeft size={18}/> Back
             </button>
             <h2 className="font-serif text-5xl md:text-8xl italic mb-12 md:mb-20 tracking-tighter">The Archive</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {archiveItems.map(item => (
                <div key={item.id} className="relative group rounded-2xl overflow-hidden bg-stone-50">
                  <img src={item.url} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                  {isAdmin && (
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className="absolute top-4 right-4 p-4 bg-white text-red-500 opacity-0 group-hover:opacity-100 rounded-full shadow-lg transition-opacity"
                    >
                      <Trash2 size={20}/>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* --- STORY SECTION --- */}
        {view === 'story' && (
          <motion.section key="story" className="max-w-4xl mx-auto py-12 md:py-32 px-6 md:px-10 text-center">
            <button onClick={() => navigateTo('home')} className="mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400 mx-auto">
              <ArrowLeft size={18}/> Back
            </button>
            <h2 className="font-serif text-5xl md:text-8xl italic mb-10 md:mb-16 tracking-tighter">Our Story</h2>
            <div className="space-y-10 md:space-y-16">
              <div className="text-lg md:text-2xl font-light leading-relaxed text-stone-600 space-y-6 md:space-y-8">
                <p>KalaKari Studio, based in Lucknow, India, is a design house dedicated to heritage textile craftsmanship.</p>
                <p>Rooted in the heart of Awadh, our work is a tribute to the silent hands that have kept the art of Chikan and Zardosi alive for generations.</p>
                <p>Each piece is a conscious dialogue between the past and the present—where raw silks meet contemporary geometry.</p>
              </div>
              <div className="h-[1px] w-20 bg-stone-200 mx-auto" />
              <p className="text-[9px] md:text-xs leading-loose tracking-[0.4em] text-stone-400 uppercase">Woven Stories • Tailored Dreams</p>
            </div>
          </motion.section>
        )}

        {/* --- SHOPPING BAG --- */}
        {view === 'cart' && (
          <motion.section key="cart" className="max-w-4xl mx-auto py-12 md:py-32 px-6 md:px-10">
            <button onClick={() => navigateTo('home')} className="mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400">
              <ArrowLeft size={18}/> Back Shopping
            </button>
            <h2 className="font-serif text-6xl md:text-8xl italic tracking-tighter text-center mb-16 md:mb-24">Your Bag</h2>
            <div className="space-y-8 md:space-y-12 mb-16 md:mb-20">
              {cart.map(item => (
                <div key={item.cartId} className="flex gap-6 md:gap-10 items-center border-b border-stone-100 pb-8 md:pb-12">
                  <div className="w-20 h-28 md:w-24 md:h-32 bg-stone-50 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={item.img || ASSETS.SAREE_MAIN} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-serif italic text-2xl md:text-4xl leading-none">{item.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
                      {item.type === 'custom' ? `${item.fabric} • ${item.work}` : `Color: ${item.color} • Size: ${item.size}`}
                    </p>
                  </div>
                  <button onClick={() => setCart(cart.filter(i => i.cartId !== item.cartId))} className="text-stone-300 hover:text-red-500 transition-colors">
                    <X size={24}/>
                  </button>
                </div>
              ))}
              {cart.length === 0 && <p className="text-center font-serif italic text-2xl text-stone-200 py-20">Your bag is empty.</p>}
            </div>
            {cart.length > 0 && (
              <button 
                onClick={() => navigateTo('checkout')} 
                className="w-full bg-[#1A1A1A] text-white py-6 md:py-10 rounded-full text-xs uppercase tracking-[0.4em] font-medium shadow-2xl"
              >
                Proceed to Checkout
              </button>
            )}
          </motion.section>
        )}

        {/* --- CHECKOUT --- */}
        {view === 'checkout' && (
          <motion.section key="checkout" className="min-h-screen flex flex-col lg:flex-row bg-white rounded-t-[2rem] md:rounded-t-[3rem] overflow-hidden mt-10 border-t border-stone-100">
            <div className="w-full lg:w-[65%] p-8 md:p-24 xl:p-32">
              <button onClick={() => navigateTo('cart')} className="mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400"><ArrowLeft size={18}/> Back</button>
              <div className="flex flex-wrap gap-6 md:gap-12 mb-16 text-[10px] md:text-xs font-medium uppercase tracking-widest">
                <span className={checkoutStep === 'contact' ? 'text-black underline underline-offset-8' : 'text-stone-300'}>01. Contact</span>
                <span className={checkoutStep === 'address' ? 'text-black underline underline-offset-8' : 'text-stone-300'}>02. Address</span>
                <span className={checkoutStep === 'payment' ? 'text-black underline underline-offset-8' : 'text-stone-300'}>03. Payment</span>
              </div>
              <div className="max-w-md">
                {checkoutStep === 'contact' && (
                  <div className="space-y-8">
                    <h2 className="font-serif text-5xl md:text-7xl italic">Contact</h2>
                    <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full py-5 border-b border-stone-100 outline-none focus:border-black text-lg bg-transparent" />
                    <input type="tel" placeholder="Mobile" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} className="w-full py-5 border-b border-stone-100 outline-none focus:border-black text-lg bg-transparent" />
                    <button onClick={() => setCheckoutStep('address')} className="w-full bg-black text-white py-6 rounded-full text-xs uppercase tracking-widest">Next Step</button>
                  </div>
                )}
                {checkoutStep === 'address' && (
                  <div className="space-y-8">
                    <h2 className="font-serif text-5xl md:text-7xl italic">Shipping</h2>
                    <input type="text" placeholder="House / Street" value={form.house} onChange={e => setForm({...form, house: e.target.value})} className="w-full py-5 border-b border-stone-100 outline-none focus:border-black text-lg bg-transparent" />
                    <div className="grid grid-cols-2 gap-5">
                      <input type="text" placeholder="City" className="w-full py-5 border-b border-stone-100 outline-none bg-transparent" />
                      <input type="text" placeholder="Pincode" className="w-full py-5 border-b border-stone-100 outline-none bg-transparent" />
                    </div>
                    <button onClick={() => setCheckoutStep('payment')} className="w-full bg-black text-white py-6 rounded-full text-xs uppercase tracking-widest">Next Step</button>
                  </div>
                )}
                {checkoutStep === 'payment' && (
                  <div className="space-y-10">
                    <h2 className="font-serif text-5xl md:text-7xl italic">Payment</h2>
                    <div className="p-8 border border-black rounded-2xl bg-stone-50/30">
                      <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-2">Order Method</p>
                      <p className="text-xs font-bold tracking-widest">CONSULTATION VIA WHATSAPP</p>
                    </div>
                    <button onClick={sendWhatsApp} className="w-full bg-[#1A1A1A] text-white py-8 rounded-full text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4">
                      Order on WhatsApp <Send size={18}/>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full lg:w-[35%] bg-[#FDFBF7] p-8 md:p-20 border-l border-stone-100">
              <h3 className="font-serif text-3xl md:text-5xl italic mb-10">Summary</h3>
              <div className="space-y-8">
                {cart.map(item => (
                  <div key={item.cartId} className="flex gap-6 items-center">
                    <div className="w-16 h-20 bg-white rounded-xl overflow-hidden shadow-sm">
                      <img src={item.img || ASSETS.SAREE_MAIN} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-serif text-xl italic">{item.name}</p>
                      <p className="text-[9px] uppercase tracking-widest text-stone-400">Studio Item</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* --- ACCOUNT VIEW --- */}
        {view === 'account' && (
          <motion.section key="account" className="max-w-6xl mx-auto py-12 md:py-32 px-6 md:px-10">
            <button onClick={() => navigateTo('home')} className="mb-8 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400">
              <ArrowLeft size={18}/> Back
            </button>
            <div className="flex justify-between items-end border-b border-stone-100 pb-8 mb-16">
              <h2 className="font-serif text-5xl md:text-7xl italic tracking-tighter">My Space</h2>
              <button onClick={handleLogout} className="text-stone-400 hover:text-black flex items-center gap-2 text-[10px] uppercase tracking-widest">
                <LogOut size={16}/> Sign Out
              </button>
            </div>
            
            {isAdmin ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
                <div className="lg:col-span-5 border border-dashed border-stone-300 p-12 md:p-20 text-center rounded-3xl bg-stone-50/50">
                  <label className="cursor-pointer group block">
                    {uploading ? <Loader2 className="animate-spin mx-auto text-stone-300" /> : <Upload size={32} className="mx-auto mb-4 text-stone-200" />}
                    <span className="text-[10px] uppercase tracking-widest text-stone-400">Upload to Archive</span>
                    <input type="file" className="hidden" onChange={handleUpload} />
                  </label>
                </div>
                <div className="lg:col-span-7 grid grid-cols-3 gap-4 h-[400px] overflow-y-auto pr-4 scrollbar-hide">
                  {archiveItems.map(item => (
                    <div key={item.id} className="aspect-square relative group rounded-xl overflow-hidden bg-stone-50">
                      <img src={item.url} className="w-full h-full object-cover" />
                      <button onClick={() => handleDelete(item.id)} className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Trash2 size={20}/></button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto py-24 border border-stone-100 text-center rounded-[2rem] bg-white">
                <p className="font-serif text-2xl italic mb-2">{user?.email}</p>
                <p className="text-[10px] uppercase tracking-widest text-stone-400">Studio Member</p>
              </div>
            )}
          </motion.section>
        )}

        {/* RESTORED TERMS VIEW */}
        {view === 'terms' && (
          <motion.section key="terms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto py-20 px-6">
            <button onClick={() => navigateTo('home')} className="mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400"><ArrowLeft size={18}/> Back</button>
            <h2 className="font-serif text-5xl italic mb-12">Terms & Conditions</h2>
            <div className="space-y-8">
              {TERMS_AND_CONDITIONS.map((text, i) => (
                <div key={i} className="flex gap-6 pb-6 border-b border-stone-100">
                  <span className="text-[10px] font-bold text-stone-300">0{i+1}</span>
                  <p className="text-sm text-stone-600 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* RESTORED PRIVACY VIEW */}
        {view === 'policy' && (
          <motion.section key="policy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto py-20 px-6">
            <button onClick={() => navigateTo('home')} className="mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400"><ArrowLeft size={18}/> Back</button>
            <h2 className="font-serif text-5xl italic mb-12">Privacy Policy</h2>
            <div className="space-y-8">
              {PRIVACY_POLICY.map((text, i) => (
                <div key={i} className="flex gap-6 pb-6 border-b border-stone-100">
                  <span className="text-[10px] font-bold text-stone-300">0{i+1}</span>
                  <p className="text-sm text-stone-600 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* --- PRODUCT DRAWER --- */}
      <AnimatePresence>
        {selectedReadymade && (
          <div className="fixed inset-0 z-[2000] flex justify-end bg-black/20 backdrop-blur-sm">
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="bg-[#FDFBF7] w-full max-w-xl h-full shadow-2xl p-8 md:p-16 flex flex-col overflow-y-auto"
            >
              <button onClick={() => setSelectedReadymade(null)} className="mb-10 text-stone-400 self-start"><X size={32}/></button>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-10">
                <img src={selectedReadymade.img} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-serif text-4xl md:text-6xl italic mb-4">{selectedReadymade.name}</h3>
              <p className="font-sans text-xl tracking-wider text-stone-500 mb-8">₹{selectedReadymade.price}</p>
              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-stone-400">Palette</label>
                  <div className="flex flex-wrap gap-4">
                    {COLORS.map(c => (
                      <button key={c.name} onClick={() => setSelection({...selection, color: c.name})} className={`w-8 h-8 rounded-full border border-stone-100 ${selection.color === c.name ? 'ring-2 ring-black ring-offset-2' : ''}`} style={{ backgroundColor: c.hex }} />
                    ))}
                  </div>
                </div>
                {selectedReadymade.hasSize && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-widest text-stone-400">Size</label>
                      <button onClick={() => setShowSizeChart(true)} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-black font-bold border-b border-black pb-1">
                        <Ruler size={14}/> Size Guide
                      </button>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {SIZES.map(s => (
                        <button key={s} onClick={() => setSelection({...selection, size: s})} className={`py-4 text-[10px] border rounded-lg ${selection.size === s ? 'bg-black text-white' : 'border-stone-100'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={() => addToBag({ ...selectedReadymade, ...selection })} className="w-full bg-black text-white py-6 rounded-full text-xs uppercase tracking-widest font-bold">Add to Bag</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SIZE CHART MODAL --- */}
      <AnimatePresence>
        {showSizeChart && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-md p-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-lg rounded-3xl p-8 md:p-12 shadow-2xl relative">
              <button onClick={() => setShowSizeChart(false)} className="absolute top-6 right-6 text-stone-300 hover:text-black"><X size={24}/></button>
              <h4 className="font-serif text-3xl italic mb-8">Size Guide</h4>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-6">Measurements in Inches</p>
              <div className="overflow-hidden border border-stone-100 rounded-2xl">
                <table className="w-full text-left text-[11px] uppercase tracking-wider">
                  <thead className="bg-stone-50 text-stone-400">
                    <tr>
                      <th className="p-4 font-medium">Size</th>
                      <th className="p-4 font-medium">Chest</th>
                      <th className="p-4 font-medium">Waist</th>
                      <th className="p-4 font-medium">Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {SIZE_CHART.map((row) => (
                      <tr key={row.size} className="hover:bg-stone-50/50 transition-colors">
                        <td className="p-4 font-bold">{row.size}</td>
                        <td className="p-4 text-stone-500">{row.chest}</td>
                        <td className="p-4 text-stone-500">{row.waist}</td>
                        <td className="p-4 text-stone-500">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-8 text-[10px] leading-relaxed text-stone-400 italic text-center">All items are tailored for a comfortable, regular fit.</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- FOOTER --- */}
      <footer className="px-6 md:px-10 py-24 md:py-40 bg-[#FDFBF7] border-t border-stone-100 text-center relative">
        <div className="flex justify-center gap-10 md:gap-20 mb-16 text-stone-300">
          <a href="https://instagram.com/hajelachhaya" target="_blank" className="hover:text-black"><Instagram size={24} /></a>
          <a href="https://facebook.com/chhaya.hajela" target="_blank" className="hover:text-black"><Facebook size={24} /></a>
          <a href="mailto:chhayahajela167@gmail.com" className="hover:text-black"><Mail size={24} /></a>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-20 mb-16 text-[10px] font-medium uppercase tracking-[0.3em] text-stone-400">
          <button onClick={() => navigateTo('terms')}>Terms & Conditions</button>
          <button onClick={() => navigateTo('policy')}>Privacy Policy</button>
          
          <div className="relative">
            <button 
              onClick={() => setShowSupport(!showSupport)} 
              className={`${showSupport ? 'text-black font-bold' : 'hover:text-stone-600'} transition-all`}
            >
              Customer Support
            </button>
            <AnimatePresence>
              {showSupport && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-1/2 -translate-x-1/2 bottom-full mb-8 flex flex-col gap-5 w-max bg-white p-8 border border-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2rem] z-[110]"
                >
                  <a href="tel:+917991464638" className="text-[10px] tracking-[0.3em] text-stone-500 hover:text-black transition-colors">+91 7991464638</a>
                  <a href="tel:+919589129241" className="text-[10px] tracking-[0.3em] text-stone-500 hover:text-black transition-colors">+91 9589129241</a>
                  <a href="tel:+919301661160" className="text-[10px] tracking-[0.3em] text-stone-500 hover:text-black transition-colors">+91 9301661160</a>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-stone-100"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[9px] md:text-[10px] font-medium uppercase tracking-[1em] text-stone-400">© 2026 KALAKARI STUDIO</p>
          <p className="text-[7px] md:text-[8px] uppercase tracking-widest text-stone-400">Woven Stories • Tailored Dreams</p>
        </div>
      </footer>
    </div>
  );
}