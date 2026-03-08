'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, User, X, Instagram, Facebook, 
  ChevronRight, ArrowLeft, Send, Trash2, Palette, Ruler, Mail, Upload, Loader2, LogOut,
  CheckCircle2, Info
} from 'lucide-react';

// --- CONFIG & ASSETS ---
const IMGBB_API_KEY = "694406d04ca241ae4636689de09341fb";
const ADMIN_EMAILS = ["dhruvhajela5@gmail.com", "saatvikraghuvanshi123@gmail.com", "chhayahajela167@gmail.com"];
const ASSETS = {
  SAREE_MAIN: "https://media.samyakk.in/pub/media/catalog/product/b/e/beige-and-gold-dual-tone-tissue-designer-saree-with-thread-work-and-unstitched-blouse-gh1568-a.jpg",
  LEHENGA_MAIN: "https://clothsvilla.com/cdn/shop/products/WhatsAppImage2022-04-02at2.31.50PM_3_1024x1024.jpg?v=1648890244",
  DRESS: "https://cpimg.tistatic.com/5593157/b/1/ladies-plain-one-piece-dress.jpg",
  SHIRT: "https://cdn.cosmos.so/dab01853-00d9-48cb-aebc-95b70bea7b3e?format=jpeg",
  TSHIRT: "https://cdn.cosmos.so/8056a947-4323-498f-990c-3f02f7112368?format=jpeg",
  STOLE: "https://cdn.cosmos.so/3a83e9e8-6a20-43e2-9f68-489ccf5d60dc?format=jpeg",
  SCARF: "https://cdn.cosmos.so/7aef443c-4c6e-4dc2-851a-6e4ce883039c?format=jpeg",
};

const FABRICS = ["Pure Chiffon", "Raw Silk", "Organza", "Chanderi Silk", "Georgette", "Cotton Mulmul", "Banarasi Brocade", "Tissue Silk"];
const WORK_TYPES = ["Antique Gold Gota Patti", "Silver Zardosi", "Mirror Work", "Thread Embroidery", "Mukaish Work", "Pearl Border", "Sequins Work"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = [
  { name: "Ruby", hex: "#8B0000" }, { name: "Emerald", hex: "#006400" }, 
  { name: "Navy", hex: "#000080" }, { name: "Ivory", hex: "#F5F5DC" }, 
  { name: "Gold", hex: "#DAA520" }, { name: "Pink", hex: "#FF69B4" },
  { name: "Teal", hex: "#008080" }, { name: "Ochre", hex: "#CC7722" }
];

const TERMS_AND_CONDITIONS = [
  "Bespoke orders require 4-6 weeks for craftsmanship.",
  "Colors may vary slightly due to screen calibration.",
  "Orders once placed for custom pieces cannot be cancelled.",
  "Shipping timelines are estimates and subject to heritage craft availability."
];

const PRIVACY_POLICY = [
  "Your data is used solely for order processing.",
  "We do not share your contact details with third-party marketers.",
  "Secure payment links are handled via WhatsApp direct communication."
];

export default function KalakariBoutique() {
  // --- STATE ---
  const [view, setView] = useState<string>('home');
  const [colType, setColType] = useState<'readymade' | 'custom' | null>(null);
  const [customCat, setCustomCat] = useState<'Saree' | 'Lehenga' | 'Kurta Set' | null>(null);
  const [selectedReadymade, setSelectedReadymade] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<'contact' | 'address' | 'payment'>('contact');
  const [showSizeChart, setShowSizeChart] = useState(false);

  const [selection, setSelection] = useState({ 
    fabric: FABRICS[0], work: WORK_TYPES[0], color: COLORS[3].name, 
    size: 'M', sleeve: 'Half', buttons: 'Back', frontNeck: '', backNeck: ''
  });
  
  const [form, setForm] = useState({ name: '', email: '', mobile: '', house: '', city: '', pin: '', state: '' });
  const [archiveItems, setArchiveItems] = useState<{id: string, url: string}[]>([]);
  const [uploading, setUploading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // --- EFFECTS & LOGIC ---
  useEffect(() => {
    fetchArchive();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        setIsAdmin(ADMIN_EMAILS.includes(session.user.email ?? ""));
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      setIsAdmin(ADMIN_EMAILS.includes(session?.user?.email ?? ""));
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchArchive = async () => {
    const { data, error } = await supabase.from('archive').select('*').order('id', { ascending: false });
    if (!error) setArchiveItems(data || []);
  };

  const handleLogin = async () => { await supabase.auth.signInWithOAuth({ provider: 'google' }); };
  const handleLogout = async () => { await supabase.auth.signOut(); setView('home'); };
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
    const result = await res.json();
    if (result.success) {
      const { data, error } = await supabase.from('archive').insert([{ url: result.data.url }]).select();
      if (!error && data) setArchiveItems([data[0], ...archiveItems]);
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (isAdmin && window.confirm("Delete item?")) {
      const { error } = await supabase.from('archive').delete().eq('id', id);
      if (!error) setArchiveItems(archiveItems.filter(item => item.id !== id));
    }
  };

  const navigateTo = (screen: string) => { 
    setView(screen); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const addToBag = (item: any) => {
    setCart([...cart, { ...item, cartId: Math.random().toString(36).substr(2, 9) }]);
    setSelectedReadymade(null);
    navigateTo('cart');
  };

  const sendWhatsApp = () => {
    const items = cart.map(i => `• *${i.name}*\n  ${i.type === 'custom' ? `Fabric: ${i.fabric} | Color: ${i.color} | Work: ${i.work}\n  Details: Sleeves: ${i.sleeve}, Buttons: ${i.buttons}` : `Color: ${i.color}`}`).join('\n\n');
    const msg = `*KALAKARI ORDER*\n\n*Client:* ${form.name}\n*Contact:* ${form.mobile}\n*Address:* ${form.house}, ${form.city}\n\n*Items:*\n${items}`;
    window.open(`https://wa.me/917991464638?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (authLoading) return <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center"><Loader2 className="animate-spin text-stone-200" /></div>;

  if (!currentUser) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] text-[#1A1A1A] text-center p-6">
      <h1 className="font-serif text-[8rem] md:text-[10rem] italic tracking-tighter leading-none mb-4">KalaKari</h1>
      <p className="uppercase tracking-[0.6em] text-xs text-stone-400 mb-16">Ancestral Threads • Modern Silhouettes</p>
      <button onClick={handleLogin} className="bg-[#1A1A1A] text-[#FDFBF7] px-14 py-5 rounded-full uppercase text-xs tracking-widest font-medium hover:bg-black transition-all">Enter Studio</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] font-sans">
      
      {/* --- STATIC HEADER --- */}
      <nav className="relative w-full z-[100] px-12 py-12 flex justify-between items-center bg-transparent">
        <span 
          onClick={() => {navigateTo('home'); setColType(null); setCustomCat(null)}} 
          className="font-serif text-5xl italic cursor-pointer tracking-tighter"
        >
          KalaKari
        </span>
        
        <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex gap-16 text-xs font-medium uppercase tracking-[0.4em] text-stone-500">
          <button onClick={() => navigateTo('collections')} className="hover:text-black transition-colors">Collections</button>
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
          <motion.section key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-16 pb-32 px-10 max-w-screen-2xl mx-auto">
            <h2 className="font-serif text-[6rem] md:text-9xl italic leading-tight mb-20 max-w-5xl tracking-tighter">Handcrafted <br /> with heritage.</h2>
            <div className="grid grid-cols-12 gap-5 h-[75vh] mb-20">
              <div className="col-span-4 overflow-hidden rounded-2xl"><img src={ASSETS.SAREE_MAIN} className="h-full w-full object-cover hover:scale-105 transition-transform duration-1000" /></div>
              <div className="col-span-5 overflow-hidden rounded-2xl"><img src={ASSETS.SHIRT} className="h-full w-full object-cover hover:scale-105 transition-transform duration-1000" /></div>
              <div className="col-span-3 overflow-hidden rounded-2xl"><img src={ASSETS.LEHENGA_MAIN} className="h-full w-full object-cover hover:scale-105 transition-transform duration-1000" /></div>
            </div>
            <div className="flex justify-center">
              <button onClick={() => navigateTo('collections')} className="border border-[#1A1A1A] px-24 py-6 rounded-full text-xs uppercase tracking-[0.4em] font-medium hover:bg-black hover:text-[#FDFBF7] transition-all">Explore Collections</button>
            </div>
          </motion.section>
        )}

        {/* --- COLLECTIONS SELECT --- */}
        {view === 'collections' && !colType && (
          <motion.section key="col" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto py-32 px-10">
             <button onClick={() => navigateTo('home')} className="mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400 hover:text-black">
                <ArrowLeft size={18}/> Back Home
             </button>
             <div className="grid md:grid-cols-2 gap-12">
                <div onClick={() => setColType('readymade')} className="p-24 border border-stone-200 bg-white rounded-3xl text-center cursor-pointer hover:border-black transition-all group shadow-sm">
                  <h3 className="font-serif text-6xl italic mb-6">Readymade</h3>
                  <p className="text-xs uppercase tracking-[0.4em] text-stone-400 group-hover:text-black">Studio Selection</p>
                </div>
                <div onClick={() => setColType('custom')} className="p-24 border border-stone-200 bg-white rounded-3xl text-center cursor-pointer hover:border-black transition-all group shadow-sm">
                  <h3 className="font-serif text-6xl italic mb-6">Custom</h3>
                  <p className="text-xs uppercase tracking-[0.4em] text-stone-400 group-hover:text-black">Bespoke Craftsmanship</p>
                </div>
             </div>
          </motion.section>
        )}

        {/* --- CUSTOM FORM --- */}
        {colType === 'custom' && (
          <motion.section key="custom" className="max-w-7xl mx-auto py-24 px-10">
            <button onClick={() => {setColType(null); setCustomCat(null)}} className="mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400 hover:text-black"><ArrowLeft size={18}/> Back</button>
            
            {!customCat ? (
              <div className="grid md:grid-cols-3 gap-6">
                {['Saree', 'Lehenga', 'Kurta Set'].map(c => <button key={c} onClick={() => setCustomCat(c as any)} className="p-20 border border-stone-200 bg-white rounded-2xl font-serif text-5xl italic hover:border-black transition-all shadow-sm">{c}</button>)}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-stone-100 grid lg:grid-cols-12 gap-16 shadow-sm relative">
                <div className="lg:col-span-5 space-y-12">
                   <h3 className="font-serif text-6xl italic border-b border-stone-100 pb-10">Bespoke {customCat}</h3>
                   <div className="space-y-6">
                      <label className="text-xs uppercase tracking-widest text-stone-400 block">Base Color Palette</label>
                      <div className="flex flex-wrap gap-5">
                        {COLORS.map(c => (
                          <button key={c.name} onClick={() => setSelection({...selection, color: c.name})} className={`w-12 h-12 rounded-full border border-stone-100 transition-all ${selection.color === c.name ? 'ring-2 ring-black ring-offset-4 scale-110' : 'hover:scale-105'}`} style={{ backgroundColor: c.hex }} />
                        ))}
                      </div>
                   </div>
                   <div className="space-y-6">
                    <label className="text-xs uppercase tracking-widest text-stone-400">Fabric Selection</label>
                    <div className="grid grid-cols-2 gap-4">{FABRICS.map(f => <button key={f} onClick={() => setSelection({...selection, fabric: f})} className={`py-5 border text-xs tracking-widest rounded-xl ${selection.fabric === f ? 'bg-black text-white border-black' : 'border-stone-100 text-stone-400'}`}>{f}</button>)}</div>
                  </div>
                  {(customCat === 'Saree' || customCat === 'Lehenga') && (
                    <div className="space-y-6">
                      <label className="text-xs uppercase tracking-widest text-stone-400">Embroidery Work</label>
                      <div className="grid grid-cols-1 gap-3">{WORK_TYPES.map(w => <button key={w} onClick={() => setSelection({...selection, work: w})} className={`py-5 px-8 border text-xs text-left tracking-widest rounded-xl ${selection.work === w ? 'bg-black text-white border-black' : 'border-stone-100 text-stone-400'}`}>{w}</button>)}</div>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-7 space-y-12">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-10">
                    <label className="text-xs uppercase tracking-widest text-stone-400">Tailoring Specs</label>
                    <button onClick={() => setShowSizeChart(!showSizeChart)} className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-900 font-bold"><Info size={18}/> {showSizeChart ? 'Hide Chart' : 'Size Guide'}</button>
                  </div>
                  <AnimatePresence>
                    {showSizeChart && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-stone-50 p-8 rounded-xl overflow-hidden mb-8">
                         <table className="w-full text-xs uppercase tracking-widest text-left">
                            <thead><tr className="border-b border-stone-200"><th className="pb-4">Size</th><th className="pb-4">Bust</th><th className="pb-4">Waist</th><th className="pb-4">Hip</th></tr></thead>
                            <tbody>
                              <tr><td className="py-3">S</td><td>34"</td><td>28"</td><td>36"</td></tr>
                              <tr><td className="py-3">M</td><td>36"</td><td>30"</td><td>38"</td></tr>
                              <tr><td className="py-3">L</td><td>38"</td><td>32"</td><td>40"</td></tr>
                            </tbody>
                         </table>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <label className="text-xs uppercase tracking-widest text-stone-400">Button Placement</label>
                      <div className="flex gap-4">{['Front', 'Back'].map(b => <button key={b} onClick={() => setSelection({...selection, buttons: b})} className={`flex-1 py-5 border text-xs tracking-widest rounded-xl ${selection.buttons === b ? 'bg-black text-white' : 'text-stone-400 border-stone-100'}`}>{b}</button>)}</div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs uppercase tracking-widest text-stone-400">Sleeve Length</label>
                      <select onChange={(e) => setSelection({...selection, sleeve: e.target.value})} className="w-full py-5 border-b border-stone-100 text-xs outline-none uppercase tracking-widest bg-transparent">
                        <option>Sleeveless</option><option>Cap Sleeves</option><option>Half (Above Elbow)</option><option>Three-Quarter</option><option>Full Length</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-4"><label className="text-xs uppercase tracking-widest text-stone-400">Front Neck (Inches)</label><input type="text" placeholder="e.g. 7.5" onChange={(e) => setSelection({...selection, frontNeck: e.target.value})} className="w-full py-5 border-b border-stone-100 text-base outline-none" /></div>
                    <div className="space-y-4"><label className="text-xs uppercase tracking-widest text-stone-400">Back Neck (Inches)</label><input type="text" placeholder="e.g. 9.0" onChange={(e) => setSelection({...selection, backNeck: e.target.value})} className="w-full py-5 border-b border-stone-100 text-base outline-none" /></div>
                  </div>
                  <div className="space-y-8 pt-10">
                    <label className="text-xs uppercase tracking-widest text-stone-400">Body Measurements (Inches)</label>
                    <div className="grid grid-cols-3 gap-6">{['Bust', 'Waist', 'Hips', 'Shoulder', 'Apex', 'Armhole'].map(m => <input key={m} type="text" placeholder={m} className="py-5 border-b border-stone-100 outline-none focus:border-black bg-transparent text-base" />)}</div>
                  </div>
                  <button onClick={() => addToBag({ name: `Bespoke ${customCat}`, type: 'custom', ...selection })} className="w-full bg-[#1A1A1A] text-white py-10 rounded-full text-xs uppercase tracking-widest font-medium shadow-2xl hover:bg-black transition-all">Submit to Design Studio</button>
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* --- READYMADE GALLERY --- */}
        {colType === 'readymade' && (
          <motion.section key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-screen-2xl mx-auto py-20 px-10">
            <button onClick={() => setColType(null)} className="mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400 hover:text-black"><ArrowLeft size={18}/> Back</button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-24">
              {[{ name: 'Classic Dress', hasSize: true, img: ASSETS.DRESS }, { name: 'Heritage Shirt', hasSize: true, img: ASSETS.SHIRT }, { name: 'Studio T-Shirt', hasSize: true, img: ASSETS.TSHIRT }, { name: 'Silk Stole', hasSize: false, img: ASSETS.STOLE }, { name: 'Ancestral Scarf', hasSize: false, img: ASSETS.SCARF }].map(product => (
                <div key={product.name} onClick={() => setSelectedReadymade(product)} className="group cursor-pointer">
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl mb-8"><img src={product.img} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" /></div>
                  <div className="flex justify-between items-end border-b border-stone-100 pb-6">
                    <h4 className="font-serif text-3xl italic">{product.name}</h4>
                    <ChevronRight size={20} className="text-stone-300 group-hover:text-black" />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* --- PRODUCT DRAWER --- */}
        <AnimatePresence>
          {selectedReadymade && (
            <div className="fixed inset-0 z-[200] flex justify-end bg-black/20 backdrop-blur-sm">
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="bg-[#FDFBF7] w-full max-w-xl h-full shadow-2xl p-16 flex flex-col overflow-y-auto rounded-l-[3rem]">
                <button onClick={() => setSelectedReadymade(null)} className="mb-10 text-stone-400 hover:text-black self-start"><X size={32} /></button>
                <div className="aspect-[4/5] rounded-3xl overflow-hidden mb-12"><img src={selectedReadymade.img} className="w-full h-full object-cover" /></div>
                <h3 className="font-serif text-6xl italic mb-12">{selectedReadymade.name}</h3>
                <div className="space-y-12">
                  <div className="space-y-6">
                    <label className="text-xs uppercase tracking-[0.3em] text-stone-400">Palette</label>
                    <div className="flex gap-5">{COLORS.map(c => <button key={c.name} onClick={() => setSelection({...selection, color: c.name})} className={`w-10 h-10 rounded-full border border-stone-100 ${selection.color === c.name ? 'ring-2 ring-black ring-offset-4' : ''}`} style={{ backgroundColor: c.hex }} />)}</div>
                  </div>
                  {selectedReadymade.hasSize && (
                    <div className="space-y-6">
                      <label className="text-xs uppercase tracking-[0.3em] text-stone-400">Size</label>
                      <div className="grid grid-cols-6 gap-3">{SIZES.map(s => <button key={s} onClick={() => setSelection({...selection, size: s})} className={`py-5 text-xs border rounded-xl ${selection.size === s ? 'bg-black text-white border-black' : 'border-stone-100 text-stone-400'}`}>{s}</button>)}</div>
                    </div>
                  )}
                  <button onClick={() => addToBag({ ...selectedReadymade, ...selection })} className="w-full bg-[#1A1A1A] text-white py-8 rounded-full text-xs uppercase tracking-widest font-medium mt-10 shadow-xl">Add to Bag</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- ARCHIVE --- */}
        {view === 'samples' && (
          <motion.section key="samples" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-screen-2xl mx-auto py-24 px-10 text-center">
             <button onClick={() => navigateTo('home')} className="mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400 hover:text-black mx-auto"><ArrowLeft size={18}/> Back</button>
             <h2 className="font-serif text-8xl italic mb-20 tracking-tighter">The Archive</h2>
             <div className="columns-1 md:columns-4 gap-6 space-y-6">
              {archiveItems.map(item => (
                <div key={item.id} className="relative group rounded-2xl overflow-hidden bg-stone-50">
                  <img src={item.url} className="w-full grayscale hover:grayscale-0 transition-all duration-1000" />
                  {isAdmin && <button onClick={() => handleDelete(item.id)} className="absolute top-4 right-4 p-4 bg-white text-red-500 opacity-0 group-hover:opacity-100 rounded-full shadow-lg transition-opacity"><Trash2 size={20}/></button>}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* --- STORY --- */}
        {view === 'story' && (
          <motion.section key="story" className="max-w-4xl mx-auto py-32 px-10 text-center">
            <button onClick={() => navigateTo('home')} className="mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400 hover:text-black mx-auto"><ArrowLeft size={18}/> Back</button>
            <h2 className="font-serif text-8xl italic mb-16 tracking-tighter">Our Story</h2>
            <div className="space-y-16">
              <p className="text-2xl font-light leading-relaxed text-stone-600">
                KalaKari Studio, based in Lucknow, India, is a design house dedicated to the art of heritage textile craftsmanship. Our studio blends ancestral threads with modern silhouettes, creating unique bespoke and luxury prêt pieces.
              </p>
              <div className="h-[1px] w-20 bg-stone-200 mx-auto" />
              <p className="text-xs leading-loose tracking-[0.5em] text-stone-400 uppercase max-w-2xl mx-auto">Ancestral Threads • Modern Silhouettes</p>
            </div>
          </motion.section>
        )}

        {/* --- ACCOUNT --- */}
        {view === 'account' && (
          <motion.section key="account" className="max-w-6xl mx-auto py-32 px-10">
            <button onClick={() => navigateTo('home')} className="mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400 hover:text-black"><ArrowLeft size={18}/> Back</button>
            <div className="flex justify-between items-end border-b border-stone-100 pb-10 mb-20">
              <h2 className="font-serif text-7xl italic tracking-tighter">My Space</h2>
              <button onClick={handleLogout} className="text-stone-400 hover:text-black flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium transition-colors"><LogOut size={18}/> Sign Out</button>
            </div>
            {isAdmin ? (
              <div className="grid lg:grid-cols-12 gap-16">
                <div className="lg:col-span-5 border border-dashed border-stone-300 p-20 text-center rounded-3xl">
                  <label className="cursor-pointer group">
                    {uploading ? <Loader2 className="animate-spin mx-auto text-stone-300" /> : <Upload size={40} className="mx-auto mb-6 text-stone-200 group-hover:text-black transition-colors" />}
                    <span className="text-xs uppercase tracking-widest text-stone-400">Upload to Archive</span>
                    <input type="file" className="hidden" onChange={handleUpload} />
                  </label>
                </div>
                <div className="lg:col-span-7 grid grid-cols-3 gap-6 h-[500px] overflow-y-auto pr-4 scrollbar-hide rounded-2xl">
                  {archiveItems.map(item => (
                    <div key={item.id} className="aspect-square relative group rounded-2xl overflow-hidden bg-stone-50">
                      <img src={item.url} className="w-full h-full object-cover" />
                      <button onClick={() => handleDelete(item.id)} className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Trash2 size={24}/></button>
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

        {/* --- SHOPPING BAG --- */}
        {view === 'cart' && (
          <motion.section key="cart" className="max-w-4xl mx-auto py-32 px-10">
            <button onClick={() => navigateTo('home')} className="mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400 hover:text-black"><ArrowLeft size={18}/> Back Shopping</button>
            <h2 className="font-serif text-8xl italic tracking-tighter text-center mb-24">Your Bag</h2>
            <div className="space-y-12 mb-20">
              {cart.map(item => (
                <div key={item.cartId} className="flex gap-10 items-center border-b border-stone-100 pb-12">
                  <div className="w-24 h-32 bg-stone-50 rounded-2xl overflow-hidden"><img src={item.img || ASSETS.SAREE_MAIN} className="w-full h-full object-cover" /></div>
                  <div className="flex-1 space-y-2">
                    <p className="font-serif italic text-4xl">{item.name}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-stone-400">{item.type === 'custom' ? `${item.fabric} • ${item.work}` : `Color: ${item.color}`}</p>
                  </div>
                  <button onClick={() => setCart(cart.filter(i => i.cartId !== item.cartId))} className="text-stone-300 hover:text-red-500 transition-colors"><X size={24}/></button>
                </div>
              ))}
              {cart.length === 0 && <p className="text-center font-serif italic text-3xl text-stone-200 py-20">Your bag is empty.</p>}
            </div>
            {cart.length > 0 && <button onClick={() => navigateTo('checkout')} className="w-full bg-[#1A1A1A] text-white py-10 rounded-full text-xs uppercase tracking-[0.4em] font-medium shadow-2xl">Proceed to Checkout</button>}
          </motion.section>
        )}

        {/* --- CHECKOUT --- */}
        {view === 'checkout' && (
          <motion.section key="checkout" className="min-h-screen flex flex-col lg:flex-row bg-white rounded-t-[3rem] overflow-hidden mt-10 border-t border-stone-100">
            <div className="w-full lg:w-[65%] p-10 lg:p-24 xl:p-32">
              <button onClick={() => navigateTo('cart')} className="mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400 hover:text-black"><ArrowLeft size={18}/> Back to Bag</button>
              <div className="flex gap-12 mb-20 text-xs font-medium uppercase tracking-[0.3em]">
                <span className={checkoutStep === 'contact' ? 'text-black underline underline-offset-8' : 'text-stone-300'}>01. Contact</span>
                <span className={checkoutStep === 'address' ? 'text-black underline underline-offset-8' : 'text-stone-300'}>02. Address</span>
                <span className={checkoutStep === 'payment' ? 'text-black underline underline-offset-8' : 'text-stone-300'}>03. Payment</span>
              </div>
              <div className="max-w-md">
                {checkoutStep === 'contact' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                    <h2 className="font-serif text-7xl italic mb-12">Contact</h2>
                    <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full py-6 border-b border-stone-100 outline-none focus:border-black text-lg transition-colors" />
                    <input type="tel" placeholder="Mobile" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} className="w-full py-6 border-b border-stone-100 outline-none focus:border-black text-lg transition-colors" />
                    <button onClick={() => setCheckoutStep('address')} className="w-full bg-[#1A1A1A] text-white py-8 rounded-full text-xs uppercase tracking-widest font-medium mt-12 shadow-xl">Continue to Address</button>
                  </motion.div>
                )}
                {checkoutStep === 'address' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                    <button onClick={() => setCheckoutStep('contact')} className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 mb-6"><ArrowLeft size={14}/> Back</button>
                    <h2 className="font-serif text-7xl italic mb-12">Shipping</h2>
                    <input type="text" placeholder="House / Area" value={form.house} onChange={e => setForm({...form, house: e.target.value})} className="w-full py-6 border-b border-stone-100 outline-none text-lg" />
                    <div className="grid grid-cols-2 gap-8"><input type="text" placeholder="City" className="w-full py-6 border-b border-stone-100 outline-none text-lg" /><input type="text" placeholder="Pincode" className="w-full py-6 border-b border-stone-100 outline-none text-lg" /></div>
                    <button onClick={() => setCheckoutStep('payment')} className="w-full bg-[#1A1A1A] text-white py-8 rounded-full text-xs uppercase tracking-widest font-medium mt-12 shadow-xl">Continue to Payment</button>
                  </motion.div>
                )}
                {checkoutStep === 'payment' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                    <button onClick={() => setCheckoutStep('address')} className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 mb-6"><ArrowLeft size={14}/> Back</button>
                    <h2 className="font-serif text-7xl italic">Payment</h2>
                    <div className="p-12 border border-black rounded-2xl flex justify-between items-center"><span className="text-xs font-medium tracking-widest uppercase">WhatsApp Confirmation</span><CheckCircle2 size={24}/></div>
                    <button onClick={sendWhatsApp} className="w-full bg-[#1A1A1A] text-white py-10 rounded-full text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-4 shadow-2xl">Confirm Order <Send size={20}/></button>
                  </motion.div>
                )}
              </div>
            </div>
            <div className="w-full lg:w-[35%] bg-[#FDFBF7] p-10 lg:p-20 border-l border-stone-100">
              <h3 className="font-serif text-5xl italic mb-16">Summary</h3>
              {cart.map(item => (
                <div key={item.cartId} className="flex gap-8 mb-10 items-center">
                  <div className="w-20 h-28 bg-stone-100 rounded-xl overflow-hidden shadow-sm"><img src={item.img || ASSETS.SAREE_MAIN} className="w-full h-full object-cover" /></div>
                  <div className="space-y-1"><p className="font-serif text-2xl italic leading-none">{item.name}</p><p className="text-[10px] uppercase tracking-widest text-stone-400">Qty: 01</p></div>
                </div>
              ))}
              <div className="border-t border-stone-200 pt-12 flex justify-between text-xs uppercase tracking-[0.3em] font-bold"><span>Total</span><span>Price on Request</span></div>
            </div>
          </motion.section>
        )}

        {/* --- T&C / POLICY --- */}
        {(view === 'terms' || view === 'policy') && (
          <motion.section key={view} className="max-w-4xl mx-auto py-32 px-10">
            <button onClick={() => navigateTo('home')} className="mb-12 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400 hover:text-black transition-colors"><ArrowLeft size={18}/> Back</button>
            <h2 className="font-serif text-7xl italic mb-16 tracking-tighter">{view === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}</h2>
            <ul className="space-y-10 list-decimal list-outside pl-6 text-xs leading-loose tracking-[0.2em] text-stone-500 uppercase">
              {(view === 'terms' ? TERMS_AND_CONDITIONS : PRIVACY_POLICY).map((text, index) => <li key={index} className="pl-4">{text}</li>)}
            </ul>
          </motion.section>
        )}
      </AnimatePresence>
{/* --- FOOTER --- */}
      <footer className="px-10 py-40 bg-[#FDFBF7] border-t border-stone-100 text-center">
        {/* Social Icons */}
        <div className="flex justify-center gap-20 mb-24 text-stone-300">
          <a href="https://instagram.com/hajelachhaya" target="_blank" className="hover:text-black transition-all hover:scale-110">
            <Instagram size={28} strokeWidth={1.2} />
          </a>
          <a href="https://facebook.com/chhaya.hajela" target="_blank" className="hover:text-black transition-all hover:scale-110">
            <Facebook size={28} strokeWidth={1.2} />
          </a>
          <a href="mailto:chhayahajela167@gmail.com" className="hover:text-black transition-all hover:scale-110">
            <Mail size={28} strokeWidth={1.2} />
          </a>
        </div>

        {/* Footer Navigation & Support */}
        <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-12 md:gap-24 mb-16 text-xs font-medium uppercase tracking-[0.4em] text-stone-400">
          <button onClick={() => navigateTo('terms')} className="hover:text-black transition-colors">Terms & Conditions</button>
          <button onClick={() => navigateTo('policy')} className="hover:text-black transition-colors">Privacy Policy</button>
          
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="text-black font-bold tracking-[0.4em]">Customer Support</span>
            <div className="flex flex-col gap-2 text-[10px] text-stone-500 tracking-widest lowercase">
              <a href="tel:+917991464638" className="hover:text-black transition-colors">+91 7991464638</a>
              <a href="tel:+919589129241" className="hover:text-black transition-colors">+91 9589129241</a>
              <a href="tel:+919301661160" className="hover:text-black transition-colors">+91 9301661160</a>
            </div>
          </div>
        </div>

        {/* Brand Marking */}
        <div className="space-y-4">
          <p className="text-[10px] font-medium uppercase tracking-[1.2em] text-stone-300">
             © 2026 KALAKARI STUDIO • LUCKNOW 
          </p>
          <p className="text-[8px] uppercase tracking-widest text-stone-200">
            Woven Stories • Tailored Dreams
          </p>
        </div>
      </footer>
    </div>
  );
}