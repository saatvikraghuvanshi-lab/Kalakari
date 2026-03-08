"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, ShoppingBag, ArrowLeft, ChevronRight, X, Info, 
  Upload, Trash2, Loader2, LogOut, CheckCircle2, Send, 
  Instagram, Facebook, Mail, ChevronUp, ChevronDown 
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
  // --- EXISTING & NEUTRALS ---
  { name: 'Ivory', hex: '#FDFBF7' },
  { name: 'Midnight', hex: '#1A1A1A' },
  { name: 'Slate', hex: '#707070' }, // Popular neutral
  
  // --- PRIMARY & HERITAGE BOLD ---
  { name: 'Royal Red', hex: '#9B1B1B' }, // Primary Red (Classic for Bridal/Sarees)
  { name: 'Cerulean', hex: '#2A5A9F' },  // Primary Blue (Modern Indigo)
  { name: 'Mustard', hex: '#E1AD01' },   // Primary Yellow (Heritage Haldi)
  
  // --- POPULAR STUDIO FAVORITES ---
  { name: 'Terracotta', hex: '#C26D50' },
  { name: 'Sage', hex: '#9CAF88' },
  { name: 'Emerald', hex: '#046307' },   // Deep Bottle Green
  { name: 'Dusty Rose', hex: '#DCAE96' }, // Popular for modern Kurtas
  { name: 'Wine', hex: '#4E0E2E' },      // Deep Burgundy
  
  // --- METALLICS ---
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Antique Silver', hex: '#A8A9AD' }
];

const FABRICS = ['Silk', 'Georgette', 'Organza', 'Chiffon', 'Crepe', 'Chanderi', 'Raw Silk', 'Cotton'];
const WORK_TYPES = [" Gota Patti", "Zardosi", "Mirror Work", "Thread Work", "Aari Work", "Sequins Work", "No Work"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];


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
  // --- STATE ---
  const [view, setView] = useState('home');
  const [colType, setColType] = useState<null | 'readymade' | 'custom'>(null);
  const [customCat, setCustomCat] = useState<null | 'Saree' | 'Lehenga' | 'Kurta Set'>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [showCollections, setShowCollections] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [selectedReadymade, setSelectedReadymade] = useState<any>(null);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('contact');
  const [uploading, setUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true); 
  const [currentUser, setCurrentUser] = useState({ email: 'chhayahajela167@gmail.com' });
  const [archiveItems, setArchiveItems] = useState<any[]>([
    { id: 1, url: "https://media.samyakk.in/pub/media/catalog/product/b/e/beige-and-gold-dual-tone-tissue-designer-saree-with-thread-work-and-unstitched-blouse-gh1568-a.jpg" },
    { id: 2, url: "https://cdn.cosmos.so/dab01853-00d9-48cb-aebc-95b70bea7b3e?format=jpeg" },
    { id: 3, url: "https://clothsvilla.com/cdn/shop/products/WhatsAppImage2022-04-02at2.31.50PM_3_1024x1024.jpg?v=1648890244" }
  ]);

  const [selection, setSelection] = useState({
    color: 'Ivory',
    fabric: 'Chanderi Silk',
    work: 'Zardosi Handwork',
    buttons: 'Front',
    sleeve: 'Full Length',
    size: 'M'
  });

  const [form, setForm] = useState({ name: '', mobile: '', house: '' });

  // --- ACTIONS ---
  const navigateTo = (v: string) => {
    setView(v);
    window.scrollTo(0, 0);
  };

  const addToBag = (item: any) => {
    setCart([...cart, { ...item, cartId: Date.now() }]);
    setView('cart');
    setSelectedReadymade(null);
  };

  const handleLogout = () => {
    navigateTo('home');
  };

  const handleUpload = (e: any) => {
    setUploading(true);
    // Simulating upload delay
    setTimeout(() => setUploading(false), 2000);
  };

  const handleDelete = (id: number) => {
    setArchiveItems(archiveItems.filter(i => i.id !== id));
  };

  const sendWhatsApp = () => {
    const text = `New Order from ${form.name}: ${cart.map(i => i.name).join(', ')}`;
    window.open(`https://wa.me/917991464638?text=${encodeURIComponent(text)}`);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] font-sans selection:bg-stone-200">
      
      {/* --- HEADER --- */}
      <nav className="relative w-full z-[100] px-12 py-12 flex justify-between items-center bg-transparent">
        <span 
          onClick={() => {navigateTo('home'); setColType(null); setCustomCat(null); setShowCollections(false);}} 
          className="font-serif text-5xl italic cursor-pointer tracking-tighter"
        >
          KalaKari
        </span>
       {/* --- DESKTOP NAVIGATION & COLLECTIONS DROPDOWN --- */}
<div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex gap-16 text-[10px] font-bold uppercase tracking-[0.4em] text-stone-500">
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
            /* Reduced padding from p-10 to p-4, reduced rounded corners to xl */
            className="absolute left-1/2 -translate-x-1/2 mt-6 flex gap-4 bg-white p-4 border border-stone-100 shadow-[0_20px_40px_rgba(0,0,0,0.08)] rounded-xl z-[110]"
          >
            <button 
              onClick={() => { setColType('readymade'); setView('collections'); setShowCollections(false); }}
              /* Removed rounded-l for a cleaner internal look */
              className="group flex flex-col items-center gap-1 p-3 hover:bg-stone-50 transition-all"
            >
              {/* Changed to Uppercase, removed Serif/Italic, sharpened Font Weight */}
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black group-hover:scale-105 transition-transform">Readymade</span>
              <span className="text-[7px] tracking-[0.1em] text-stone-400 uppercase">Studio Selection</span>
            </button>

            <div className="w-[1px] bg-stone-100 self-stretch my-1" />

            <button 
              onClick={() => { setColType('custom'); setView('collections'); setShowCollections(false); }}
              className="group flex flex-col items-center gap-1 p-3 hover:bg-stone-50 transition-all"
            >
              {/* Changed to Uppercase, removed Serif/Italic, sharpened Font Weight */}
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black group-hover:scale-105 transition-transform">Custom</span>
              <span className="text-[7px] tracking-[0.1em] text-stone-400 uppercase">Bespoke Craft</span>
            </button>
            
            {/* The Little Arrow Tip */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-l border-t border-stone-100"></div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  </div>
  <button onClick={() => navigateTo('samples')} className="hover:text-black transition-colors">The Archive</button>
  <button onClick={() => navigateTo('story')} className="hover:text-black transition-colors">Our Story</button>
</div>

        <div className="flex items-center gap-10">
          <button onClick={() => navigateTo('account')} className="hover:opacity-60 transition-opacity">
            <User size={24} strokeWidth={1.2} />
          </button>
          <button onClick={() => navigateTo('cart')} className="relative hover:opacity-60 transition-opacity">
            <ShoppingBag size={24} strokeWidth={1.2} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </nav>
      <AnimatePresence mode="wait">
        {/* --- HOME VIEW --- */}
        {view === 'home' && (
          <motion.section 
            key="home" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="pt-16 pb-32 px-10 max-w-screen-2xl mx-auto"
          >
            <h2 className="font-serif text-[6rem] md:text-9xl italic leading-tight mb-20 max-w-5xl tracking-tighter">
              Handcrafted <br /> with heritage.
            </h2>
            <div className="grid grid-cols-12 gap-5 h-[75vh] mb-20">
              <div className="col-span-4 overflow-hidden rounded-2xl shadow-sm">
                <img src={ASSETS.SAREE_MAIN} className="h-full w-full object-cover hover:scale-105 transition-transform duration-1000" />
              </div>
              <div className="col-span-5 overflow-hidden rounded-2xl shadow-sm">
                <img src={ASSETS.SHIRT} className="h-full w-full object-cover hover:scale-105 transition-transform duration-1000" />
              </div>
              <div className="col-span-3 overflow-hidden rounded-2xl shadow-sm">
                <img src={ASSETS.LEHENGA_MAIN} className="h-full w-full object-cover hover:scale-105 transition-transform duration-1000" />
              </div>
            </div>
            <div className="flex justify-center">
              <button 
                onClick={() => setShowCollections(true)} 
                className="border border-[#1A1A1A] px-24 py-6 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-black hover:text-[#FDFBF7] transition-all"
              >
                Explore Collections
              </button>
            </div>
          </motion.section>
        )}

        {/* --- CUSTOM / BESPOKE SECTION --- */}
        {(view === 'collections' && colType === 'custom') && (
          <motion.section key="custom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto py-24 px-10">
            <button 
              onClick={() => {setColType(null); setCustomCat(null); setView('home')}} 
              className="mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400 hover:text-black transition-colors"
            >
              <ArrowLeft size={18}/> Back
            </button>
            
            {!customCat ? (
              <div className="grid md:grid-cols-3 gap-6">
                {['Saree', 'Lehenga', 'Kurta Set'].map(c => (
                  <button 
                    key={c} 
                    onClick={() => setCustomCat(c as any)} 
                    className="p-20 border border-stone-200 bg-white rounded-3xl font-serif text-5xl italic hover:border-black transition-all"
                  >
                    {c}
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-white p-16 rounded-[3rem] border border-stone-100 grid lg:grid-cols-12 gap-16 shadow-sm">
                <div className="lg:col-span-5 space-y-12">
                  <h3 className="font-serif text-6xl italic border-b border-stone-100 pb-10">{customCat}</h3>
                  <div className="space-y-6">
                    <label className="text-xs uppercase tracking-widest text-stone-400">Palette</label>
                    <div className="flex gap-5">
                      {COLORS.map(c => (
                        <button 
                          key={c.name} 
                          onClick={() => setSelection({...selection, color: c.name})} 
                          className={`w-10 h-10 rounded-full border border-stone-100 transition-all ${selection.color === c.name ? 'ring-2 ring-black ring-offset-4 scale-110' : ''}`} 
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
                          className={`py-4 border text-[10px] uppercase tracking-widest rounded-xl transition-all ${selection.fabric === f ? 'bg-black text-white border-black' : 'text-stone-400 border-stone-100'}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-7 space-y-12">
                   <div className="grid grid-cols-3 gap-6">
                    {['Bust', 'Waist', 'Hips', 'Shoulder', 'Apex', 'Armhole'].map(m => (
                      <input key={m} type="text" placeholder={m} className="w-full py-4 border-b border-stone-100 outline-none text-base focus:border-black bg-transparent" />
                    ))}
                  </div>
                  <button 
                    onClick={() => addToBag({ name: `Bespoke ${customCat}`, type: 'custom', ...selection })} 
                    className="w-full bg-[#1A1A1A] text-white py-8 rounded-full text-xs uppercase tracking-[0.3em] font-medium shadow-xl mt-10 hover:bg-black transition-all"
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
          <motion.section key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-screen-2xl mx-auto py-20 px-10">
            <button onClick={() => {setColType(null); setView('home')}} className="mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400 hover:text-black transition-colors">
              <ArrowLeft size={18}/> Back
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-24">
              {[
                { name: 'Dress', hasSize: true, img: ASSETS.DRESS }, 
                { name: 'Shirt', hasSize: true, img: ASSETS.SHIRT }, 
                { name: 'T-Shirt', hasSize: true, img: ASSETS.TSHIRT }, 
                { name: 'Stole', hasSize: false, img: ASSETS.STOLE }, 
                { name: 'Scarf', hasSize: false, img: ASSETS.SCARF }
              ].map(product => (
                <div key={product.name} onClick={() => setSelectedReadymade(product)} className="group cursor-pointer">
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl mb-8">
                    <img src={product.img} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
                  </div>
                  <div className="flex justify-between items-end border-b border-stone-100 pb-6">
                    <h4 className="font-serif text-3xl italic">{product.name}</h4>
                    <ChevronRight size={20} className="text-stone-300 group-hover:text-black transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
        {/* --- ARCHIVE / SAMPLES --- */}
        {view === 'samples' && (
          <motion.section key="samples" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-screen-2xl mx-auto py-24 px-10 text-center">
             <button onClick={() => navigateTo('home')} className="mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400 hover:text-black mx-auto">
               <ArrowLeft size={18}/> Back
             </button>
             <h2 className="font-serif text-8xl italic mb-20 tracking-tighter">The Archive</h2>
             <div className="columns-1 md:columns-4 gap-6 space-y-6">
              {archiveItems.map(item => (
                <div key={item.id} className="relative group rounded-2xl overflow-hidden bg-stone-50">
                  <img src={item.url} className="w-full grayscale hover:grayscale-0 transition-all duration-1000" />
                  {isAdmin && (
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className="absolute top-4 right-4 p-4 bg-white text-red-500 opacity-0 group-hover:opacity-100 rounded-full shadow-lg transition-opacity hover:bg-red-500 hover:text-white"
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
  <motion.section key="story" className="max-w-4xl mx-auto py-32 px-10 text-center">
    <button onClick={() => navigateTo('home')} className="mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400 hover:text-black mx-auto">
      <ArrowLeft size={18}/> Back
    </button>
    <h2 className="font-serif text-8xl italic mb-16 tracking-tighter">Our Story</h2>
    <div className="space-y-16">
      <div className="text-2xl font-light leading-relaxed text-stone-600 space-y-8">
        <p>
          KalaKari Studio, based in Lucknow, India, is a design house dedicated to heritage textile craftsmanship. 
          We blend ancestral threads with modern silhouettes, creating unique bespoke and luxury prêt pieces.
        </p>
        <p>
          Rooted in the heart of Awadh, our work is a tribute to the silent hands that have kept the art 
          of Chikan and Zardosi alive for generations. We do not just design garments; we curate heirlooms 
          that carry the whisper of the artisan’s needle and the weight of history.
        </p>
        <p>
          Each piece is a conscious dialogue between the past and the present—where raw silks meet 
          contemporary geometry, and every stitch tells a story of patience, precision, and passion.
        </p>
      </div>
      <div className="h-[1px] w-20 bg-stone-200 mx-auto" />
      <p className="text-xs leading-loose tracking-[0.5em] text-stone-400 uppercase">
        Woven Stories • Tailored Dreams
      </p>
    </div>
  </motion.section>
)}
      

        {/* --- SHOPPING BAG --- */}
        {view === 'cart' && (
          <motion.section key="cart" className="max-w-4xl mx-auto py-32 px-10">
            <button onClick={() => navigateTo('home')} className="mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400 hover:text-black">
              <ArrowLeft size={18}/> Back Shopping
            </button>
            <h2 className="font-serif text-8xl italic tracking-tighter text-center mb-24">Your Bag</h2>
            <div className="space-y-12 mb-20">
              {cart.map(item => (
                <div key={item.cartId} className="flex gap-10 items-center border-b border-stone-100 pb-12">
                  <div className="w-24 h-32 bg-stone-50 rounded-2xl overflow-hidden shadow-sm">
                    <img src={item.img || ASSETS.SAREE_MAIN} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="font-serif italic text-4xl leading-none">{item.name}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                      {item.type === 'custom' ? `${item.fabric} • ${item.work}` : `Color: ${item.color}`}
                    </p>
                  </div>
                  <button onClick={() => setCart(cart.filter(i => i.cartId !== item.cartId))} className="text-stone-300 hover:text-red-500 transition-colors">
                    <X size={24}/>
                  </button>
                </div>
              ))}
              {cart.length === 0 && <p className="text-center font-serif italic text-3xl text-stone-200 py-20">Your bag is empty.</p>}
            </div>
            {cart.length > 0 && (
              <button 
                onClick={() => navigateTo('checkout')} 
                className="w-full bg-[#1A1A1A] text-white py-10 rounded-full text-xs uppercase tracking-[0.4em] font-medium shadow-2xl hover:bg-black transition-all"
              >
                Proceed to Checkout
              </button>
            )}
          </motion.section>
        )}

        {/* --- CHECKOUT WORKFLOW --- */}
        {view === 'checkout' && (
          <motion.section key="checkout" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen flex flex-col lg:flex-row bg-white rounded-t-[3rem] overflow-hidden mt-10 border-t border-stone-100">
            <div className="w-full lg:w-[65%] p-10 lg:p-24 xl:p-32">
              <button onClick={() => navigateTo('cart')} className="mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400 hover:text-black transition-colors">
                <ArrowLeft size={18}/> Back to Bag
              </button>
              
              <div className="flex gap-12 mb-20 text-xs font-medium uppercase tracking-[0.3em]">
                <span className={checkoutStep === 'contact' ? 'text-black underline underline-offset-8 decoration-2' : 'text-stone-300'}>01. Contact</span>
                <span className={checkoutStep === 'address' ? 'text-black underline underline-offset-8 decoration-2' : 'text-stone-300'}>02. Address</span>
                <span className={checkoutStep === 'payment' ? 'text-black underline underline-offset-8 decoration-2' : 'text-stone-300'}>03. Payment</span>
              </div>

              <div className="max-w-md">
                {checkoutStep === 'contact' && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                    <h2 className="font-serif text-7xl italic mb-12">Contact</h2>
                    <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full py-6 border-b border-stone-100 outline-none focus:border-black text-lg transition-colors bg-transparent" />
                    <input type="tel" placeholder="Mobile" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} className="w-full py-6 border-b border-stone-100 outline-none focus:border-black text-lg transition-colors bg-transparent" />
                    <button onClick={() => setCheckoutStep('address')} className="w-full bg-[#1A1A1A] text-white py-8 rounded-full text-xs uppercase tracking-[0.4em] font-medium mt-12 shadow-xl hover:bg-black transition-all">Continue to Address</button>
                  </motion.div>
                )}
                {checkoutStep === 'address' && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                    <button onClick={() => setCheckoutStep('contact')} className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 mb-6 hover:text-black transition-colors">
                      <ArrowLeft size={14}/> Back
                    </button>
                    <h2 className="font-serif text-7xl italic mb-12">Shipping</h2>
                    <input type="text" placeholder="House / Area / Street" value={form.house} onChange={e => setForm({...form, house: e.target.value})} className="w-full py-6 border-b border-stone-100 outline-none focus:border-black text-lg bg-transparent" />
                    <div className="grid grid-cols-2 gap-8">
                      <input type="text" placeholder="City" className="w-full py-6 border-b border-stone-100 outline-none focus:border-black text-lg bg-transparent" />
                      <input type="text" placeholder="Pincode" className="w-full py-6 border-b border-stone-100 outline-none focus:border-black text-lg bg-transparent" />
                    </div>
                    <button onClick={() => setCheckoutStep('payment')} className="w-full bg-[#1A1A1A] text-white py-8 rounded-full text-xs uppercase tracking-[0.4em] font-medium mt-12 shadow-xl hover:bg-black transition-all">Continue to Payment</button>
                  </motion.div>
                )}
                {checkoutStep === 'payment' && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                    <button onClick={() => setCheckoutStep('address')} className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 mb-6 hover:text-black transition-colors">
                      <ArrowLeft size={14}/> Back
                    </button>
                    <h2 className="font-serif text-7xl italic">Payment</h2>
                    <div className="p-12 border border-black rounded-2xl flex justify-between items-center bg-stone-50/30">
                      <span className="text-xs font-medium tracking-widest uppercase text-stone-600">Confirmation via WhatsApp</span>
                      <CheckCircle2 size={24} className="text-black"/>
                    </div>
                    <button onClick={sendWhatsApp} className="w-full bg-[#1A1A1A] text-white py-10 rounded-full text-xs uppercase tracking-[0.5em] font-medium flex items-center justify-center gap-4 shadow-2xl hover:bg-black transition-all">
                      Confirm via WhatsApp <Send size={20}/>
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
            <div className="w-full lg:w-[35%] bg-[#FDFBF7] p-10 lg:p-20 border-l border-stone-100">
              <h3 className="font-serif text-5xl italic mb-16">Summary</h3>
              <div className="space-y-10">
                {cart.map(item => (
                  <div key={item.cartId} className="flex gap-8 items-center">
                    <div className="w-20 h-28 bg-white rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                      <img src={item.img || ASSETS.SAREE_MAIN} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-serif text-2xl italic leading-none">{item.name}</p>
                      <p className="text-[10px] uppercase tracking-widest text-stone-400">Qty: 01</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-stone-200 mt-12 pt-10 flex justify-between text-xs uppercase tracking-[0.4em] font-bold">
                <span>Total</span>
                <span>Price on Request</span>
              </div>
            </div>
          </motion.section>
        )}
        {/* --- ACCOUNT VIEW --- */}
        {view === 'account' && (
          <motion.section key="account" className="max-w-6xl mx-auto py-32 px-10">
            <button onClick={() => navigateTo('home')} className="mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400 hover:text-black transition-colors">
              <ArrowLeft size={18}/> Back
            </button>
            <div className="flex justify-between items-end border-b border-stone-100 pb-10 mb-20">
              <h2 className="font-serif text-7xl italic tracking-tighter">My Space</h2>
              <button 
                onClick={handleLogout} 
                className="text-stone-400 hover:text-black flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium transition-colors"
              >
                <LogOut size={18}/> Sign Out
              </button>
            </div>
            
            {isAdmin ? (
              <div className="grid lg:grid-cols-12 gap-16">
                <div className="lg:col-span-5 border border-dashed border-stone-300 p-20 text-center rounded-3xl bg-stone-50/50">
                  <label className="cursor-pointer group block">
                    {uploading ? (
                      <Loader2 className="animate-spin mx-auto text-stone-300" />
                    ) : (
                      <Upload size={40} className="mx-auto mb-6 text-stone-200 group-hover:text-black transition-colors" />
                    )}
                    <span className="text-xs uppercase tracking-widest text-stone-400 group-hover:text-black transition-colors">Upload to Archive</span>
                    <input type="file" className="hidden" onChange={handleUpload} />
                  </label>
                </div>
                <div className="lg:col-span-7 grid grid-cols-3 gap-6 h-[500px] overflow-y-auto pr-4 scrollbar-hide rounded-2xl">
                  {archiveItems.map(item => (
                    <div key={item.id} className="aspect-square relative group rounded-2xl overflow-hidden bg-stone-50 shadow-sm">
                      <img src={item.url} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <Trash2 size={24}/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto py-32 border border-stone-100 text-center rounded-[3rem] bg-white shadow-sm">
                <p className="font-serif text-3xl italic mb-4">{currentUser.email}</p>
                <p className="text-xs uppercase tracking-widest text-stone-400">Studio Member</p>
              </div>
            )}
          </motion.section>
        )}

        {/* --- T&C / POLICY --- */}
        {(view === 'terms' || view === 'policy') && (
          <motion.section key={view} className="max-w-4xl mx-auto py-32 px-10">
            <button onClick={() => navigateTo('home')} className="mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400 hover:text-black transition-colors">
              <ArrowLeft size={18}/> Back
            </button>
            <h2 className="font-serif text-7xl italic mb-16 tracking-tighter">
              {view === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
            </h2>
            <ul className="space-y-10 list-decimal list-outside pl-6 text-xs leading-loose tracking-[0.2em] text-stone-500 uppercase">
              {(view === 'terms' ? TERMS_AND_CONDITIONS : PRIVACY_POLICY).map((text, index) => (
                <li key={index} className="pl-4">{text}</li>
              ))}
            </ul>
          </motion.section>
        )}
      </AnimatePresence>

      {/* --- PRODUCT DRAWER --- */}
      <AnimatePresence>
        {selectedReadymade && (
          <div className="fixed inset-0 z-[200] flex justify-end bg-black/20 backdrop-blur-sm">
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#FDFBF7] w-full max-w-xl h-full shadow-2xl p-16 flex flex-col overflow-y-auto rounded-l-[3rem] border-l border-stone-100"
            >
              <button onClick={() => setSelectedReadymade(null)} className="mb-10 text-stone-400 hover:text-black self-start transition-colors">
                <X size={32} strokeWidth={1.5} />
              </button>
              <div className="aspect-[4/5] rounded-3xl overflow-hidden mb-12 shadow-sm">
                <img src={selectedReadymade.img} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-serif text-6xl italic mb-12 leading-none">{selectedReadymade.name}</h3>
              <div className="space-y-12">
                <div className="space-y-6">
                  <label className="text-xs uppercase tracking-[0.3em] text-stone-400">Palette</label>
                  <div className="flex gap-5">
                    {COLORS.map(c => (
                      <button 
                        key={c.name} 
                        onClick={() => setSelection({...selection, color: c.name})} 
                        className={`w-10 h-10 rounded-full border border-stone-100 transition-all ${selection.color === c.name ? 'ring-2 ring-black ring-offset-4 scale-110' : ''}`} 
                        style={{ backgroundColor: c.hex }} 
                      />
                    ))}
                  </div>
                </div>
                
                {selectedReadymade.hasSize && (
                  <div className="space-y-6">
                    <label className="text-xs uppercase tracking-[0.3em] text-stone-400">Select Size</label>
                    <div className="grid grid-cols-6 gap-3">
                      {SIZES.map(s => (
                        <button 
                          key={s} 
                          onClick={() => setSelection({...selection, size: s})} 
                          className={`py-5 text-xs border rounded-xl transition-all ${selection.size === s ? 'bg-black text-white border-black' : 'border-stone-100 text-stone-400 hover:border-black'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={() => addToBag({ ...selectedReadymade, ...selection })} 
                  className="w-full bg-[#1A1A1A] text-white py-8 rounded-full text-xs uppercase tracking-[0.4em] font-medium mt-10 shadow-xl hover:bg-black transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- FOOTER --- */}
      <footer className="px-10 py-40 bg-[#FDFBF7] border-t border-stone-100 text-center relative">
        <div className="flex justify-center gap-20 mb-24 text-stone-300">
          <a href="https://instagram.com/hajelachhaya" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-all hover:scale-110">
            <Instagram size={28} strokeWidth={1.2} />
          </a>
          <a href="https://facebook.com/chhaya.hajela" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-all hover:scale-110">
            <Facebook size={28} strokeWidth={1.2} />
          </a>
          <a href="mailto:chhayahajela167@gmail.com" className="hover:text-black transition-all hover:scale-110">
            <Mail size={28} strokeWidth={1.2} />
          </a>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 mb-20 text-xs font-medium uppercase tracking-[0.4em] text-stone-400">
          <button onClick={() => navigateTo('terms')} className="hover:text-black transition-colors">Terms & Conditions</button>
          <button onClick={() => navigateTo('policy')} className="hover:text-black transition-colors">Privacy Policy</button>
          
          <div className="relative">
            <button 
              onClick={() => setShowSupport(!showSupport)} 
              className={`${showSupport ? 'text-black font-bold underline underline-offset-8' : 'hover:text-black'} transition-all duration-300`}
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

        <div className="space-y-4">
          <p className="text-[10px] font-medium uppercase tracking-[1.2em] text-stone-400">
              © 2026 KALAKARI STUDIO • LUCKNOW 
          </p>
          <p className="text-[8px] uppercase tracking-widest text-stone-400">
            Woven Stories • Tailored Dreams
          </p>
        </div>
      </footer>
    </div>
  );
}