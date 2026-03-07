'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, User, X, Instagram, Facebook, 
  ChevronRight, ArrowLeft, Send, Trash2, Palette, Ruler, Mail, Upload, Loader2, LogOut,
  CheckCircle2
} from 'lucide-react';

// --- CONFIG & ASSETS (UNTOUCHED) ---
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
  { name: "Gold", hex: "#DAA520" }, { name: "Pink", hex: "#FF69B4" }
];

export default function KalakariBoutique() {
  // --- LOGIC (STRICTLY UNTOUCHED) ---
  const [view, setView] = useState<string>('home');
  const [colType, setColType] = useState<'readymade' | 'custom' | null>(null);
  const [customCat, setCustomCat] = useState<'Saree' | 'Lehenga' | 'Kurta Set' | null>(null);
  const [selectedReadymade, setSelectedReadymade] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<'contact' | 'address' | 'payment'>('contact');
  const [selection, setSelection] = useState({ fabric: FABRICS[0], work: WORK_TYPES[0], color: COLORS[3].name, size: 'M' });
  const [form, setForm] = useState({ name: '', email: '', mobile: '', house: '', city: '', pin: '', state: '' });
  const [archiveItems, setArchiveItems] = useState<{id: string, url: string}[]>([]);
  const [uploading, setUploading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const fetchArchive = async () => {
    const { data, error } = await supabase.from('archive').select('*').order('id', { ascending: false });
    if (!error) setArchiveItems(data || []);
  };

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
      if (!error) setArchiveItems([data[0], ...archiveItems]);
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (isAdmin && window.confirm("Delete item?")) {
      const { error } = await supabase.from('archive').delete().eq('id', id);
      if (!error) setArchiveItems(archiveItems.filter(item => item.id !== id));
    }
  };

  const navigateTo = (screen: string) => { setView(screen); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const addToBag = (item: any) => {
    setCart([...cart, { ...item, cartId: Math.random().toString(36).substr(2, 9) }]);
    setSelectedReadymade(null);
    navigateTo('cart');
  };

  const sendWhatsApp = () => {
    const items = cart.map(i => `• *${i.name}*\n  ${i.type === 'custom' ? `Fabric: ${i.fabric} | Work: ${i.work}` : `Color: ${i.color}`}`).join('\n\n');
    const msg = `*KALAKARI ORDER*\n\n*Client:* ${form.name}\n*Contact:* ${form.mobile}\n*Address:* ${form.house}, ${form.city}\n\n*Items:*\n${items}`;
    window.open(`https://wa.me/917991464638?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (authLoading) return <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center"><Loader2 className="animate-spin text-stone-200" /></div>;

  if (!currentUser) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] text-[#1A1A1A] text-center p-6">
      <h1 className="font-serif text-[10rem] italic tracking-tighter leading-none mb-4">KalaKari</h1>
      <p className="uppercase tracking-[0.6em] text-[10px] text-stone-400 mb-16">Ancestral Threads • Modern Silhouettes</p>
      <button onClick={handleLogin} className="bg-[#1A1A1A] text-[#FDFBF7] px-14 py-5 rounded-full uppercase text-[10px] tracking-widest font-medium hover:bg-black transition-all">Enter Studio</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] font-sans">
      
      {/* --- UPDATED NAVBAR (LARGER, DARKER, BOLD) --- */}
      <nav className="sticky top-0 z-[100] px-10 py-8 flex justify-between items-center bg-[#FDFBF7]/80 backdrop-blur-md border-b border-stone-100">
        <div className="flex items-center gap-20">
          <span onClick={() => {navigateTo('home'); setColType(null); setCustomCat(null)}} className="font-serif text-3xl italic cursor-pointer tracking-tighter text-black">KalaKari</span>
          <div className="hidden lg:flex gap-12 text-[12px] font-bold uppercase tracking-[0.3em] text-black">
            <button onClick={() => navigateTo('collections')} className="hover:opacity-60 transition-opacity">Collections</button>
            <button onClick={() => navigateTo('samples')} className="hover:opacity-60 transition-opacity">The Archive</button>
            <button onClick={() => navigateTo('story')} className="hover:opacity-60 transition-opacity">Our Story</button>
          </div>
        </div>
        <div className="flex items-center gap-10">
          <button onClick={() => navigateTo('account')} className="text-black">
            <User size={22} strokeWidth={2.5} />
          </button>
          <button onClick={() => navigateTo('cart')} className="relative text-black">
            <ShoppingBag size={22} strokeWidth={2.5} />
            {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cart.length}</span>}
          </button>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {/* --- HOME VIEW --- */}
        {view === 'home' && (
          <motion.section key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 pb-32 px-10 max-w-screen-2xl mx-auto">
            <h2 className="font-serif text-8xl italic leading-tight mb-20 max-w-4xl tracking-tighter">Handcrafted <br /> with heritage.</h2>
            <div className="grid grid-cols-12 gap-5 h-[75vh] mb-20">
              <div className="col-span-4 overflow-hidden rounded-sm"><img src={ASSETS.SAREE_MAIN} className="h-full w-full object-cover hover:scale-105 transition-transform duration-1000" /></div>
              <div className="col-span-5 overflow-hidden rounded-sm"><img src={ASSETS.SHIRT} className="h-full w-full object-cover hover:scale-105 transition-transform duration-1000" /></div>
              <div className="col-span-3 overflow-hidden rounded-sm"><img src={ASSETS.LEHENGA_MAIN} className="h-full w-full object-cover hover:scale-105 transition-transform duration-1000" /></div>
            </div>
            <div className="flex justify-center">
              <button onClick={() => navigateTo('collections')} className="border border-[#1A1A1A] px-24 py-6 rounded-full text-[10px] uppercase tracking-[0.4em] font-medium hover:bg-black hover:text-[#FDFBF7] transition-all">Explore Collections</button>
            </div>
          </motion.section>
        )}

        {/* --- COLLECTIONS SELECT --- */}
        {view === 'collections' && !colType && (
          <motion.section key="col" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto py-32 px-10 grid md:grid-cols-2 gap-12">
            <div onClick={() => setColType('readymade')} className="p-20 border border-stone-200 bg-white rounded-sm text-center cursor-pointer hover:border-black transition-all group">
              <h3 className="font-serif text-5xl italic mb-6">Readymade</h3>
              <p className="text-[9px] uppercase tracking-[0.4em] text-stone-400 group-hover:text-black">Studio Selection</p>
            </div>
            <div onClick={() => setColType('custom')} className="p-20 border border-stone-200 bg-white rounded-sm text-center cursor-pointer hover:border-black transition-all group">
              <h3 className="font-serif text-5xl italic mb-6">Custom</h3>
              <p className="text-[9px] uppercase tracking-[0.4em] text-stone-400 group-hover:text-black">Bespoke Craftsmanship</p>
            </div>
          </motion.section>
        )}

        {/* --- READYMADE GALLERY --- */}
        {colType === 'readymade' && (
          <motion.section key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-screen-2xl mx-auto py-20 px-10">
            <button onClick={() => setColType(null)} className="mb-12 flex items-center gap-3 text-[9px] uppercase tracking-widest text-stone-400 hover:text-black"><ArrowLeft size={14}/> Back</button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-20">
              {[{ name: 'Classic Dress', hasSize: true, img: ASSETS.DRESS }, { name: 'Heritage Shirt', hasSize: true, img: ASSETS.SHIRT }, { name: 'Studio T-Shirt', hasSize: true, img: ASSETS.TSHIRT }, { name: 'Silk Stole', hasSize: false, img: ASSETS.STOLE }, { name: 'Ancestral Scarf', hasSize: false, img: ASSETS.SCARF }].map(product => (
                <div key={product.name} onClick={() => setSelectedReadymade(product)} className="group cursor-pointer">
                  <div className="aspect-[3/4] overflow-hidden rounded-sm mb-6"><img src={product.img} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" /></div>
                  <div className="flex justify-between items-end border-b border-stone-100 pb-4">
                    <h4 className="font-serif text-2xl italic">{product.name}</h4>
                    <ChevronRight size={16} className="text-stone-300 group-hover:text-black" />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* --- PRODUCT DRAWER --- */}
        <AnimatePresence>
          {selectedReadymade && (
            <div className="fixed inset-0 z-[200] flex justify-end bg-black/10 backdrop-blur-sm">
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="bg-[#FDFBF7] w-full max-w-xl h-full shadow-2xl p-14 flex flex-col overflow-y-auto">
                <button onClick={() => setSelectedReadymade(null)} className="mb-10 text-stone-400 hover:text-black"><X size={24} /></button>
                <div className="aspect-[4/5] rounded-sm overflow-hidden mb-12"><img src={selectedReadymade.img} className="w-full h-full object-cover" /></div>
                <h3 className="font-serif text-5xl italic mb-10">{selectedReadymade.name}</h3>
                <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[9px] uppercase tracking-[0.3em] text-stone-400">Palette</label>
                    <div className="flex gap-4">{COLORS.map(c => <button key={c.name} onClick={() => setSelection({...selection, color: c.name})} className={`w-8 h-8 rounded-full border border-stone-100 ${selection.color === c.name ? 'ring-2 ring-black ring-offset-4' : ''}`} style={{ backgroundColor: c.hex }} />)}</div>
                  </div>
                  {selectedReadymade.hasSize && (
                    <div className="space-y-4">
                      <label className="text-[9px] uppercase tracking-[0.3em] text-stone-400">Size</label>
                      <div className="grid grid-cols-6 gap-2">{SIZES.map(s => <button key={s} onClick={() => setSelection({...selection, size: s})} className={`py-4 text-[9px] border ${selection.size === s ? 'bg-black text-white border-black' : 'border-stone-100 text-stone-400'}`}>{s}</button>)}</div>
                    </div>
                  )}
                  <button onClick={() => addToBag({ ...selectedReadymade, ...selection })} className="w-full bg-[#1A1A1A] text-white py-6 rounded-full text-[10px] uppercase tracking-widest font-medium mt-10">Add to Bag</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- CUSTOM FORM --- */}
        {colType === 'custom' && (
          <motion.section key="custom" className="max-w-6xl mx-auto py-24 px-10">
            <button onClick={() => {setColType(null); setCustomCat(null)}} className="mb-12 flex items-center gap-3 text-[9px] uppercase tracking-widest text-stone-400"><ArrowLeft size={14}/> Back</button>
            {!customCat ? (
              <div className="grid md:grid-cols-3 gap-6">
                {['Saree', 'Lehenga', 'Kurta Set'].map(c => <button key={c} onClick={() => setCustomCat(c as any)} className="p-16 border border-stone-200 bg-white rounded-sm font-serif text-4xl italic hover:border-black transition-all">{c}</button>)}
              </div>
            ) : (
              <div className="bg-white p-16 rounded-sm border border-stone-50 grid lg:grid-cols-2 gap-20 shadow-sm">
                <div className="space-y-12">
                  <h3 className="font-serif text-5xl italic border-b border-stone-100 pb-10">{customCat} Specs</h3>
                  <div className="space-y-6">
                    <label className="text-[9px] uppercase tracking-widest text-stone-400">Fabric Selection</label>
                    <div className="grid grid-cols-2 gap-3">{FABRICS.map(f => <button key={f} onClick={() => setSelection({...selection, fabric: f})} className={`py-4 border text-[9px] tracking-widest ${selection.fabric === f ? 'bg-black text-white border-black' : 'border-stone-100 text-stone-400'}`}>{f}</button>)}</div>
                  </div>
                </div>
                <div className="space-y-12">
                  <div className="space-y-6">
                    <label className="text-[9px] uppercase tracking-widest text-stone-400">Measurements (Inches)</label>
                    <div className="grid grid-cols-3 gap-6">{['Bust', 'Waist', 'Hips', 'Sleeves', 'Front', 'Back'].map(m => <input key={m} type="text" placeholder={m} className="py-4 border-b border-stone-100 outline-none focus:border-black bg-transparent text-sm placeholder:text-stone-200" />)}</div>
                  </div>
                  <button onClick={() => addToBag({ name: `Bespoke ${customCat}`, type: 'custom', ...selection })} className="w-full bg-[#1A1A1A] text-white py-6 rounded-full text-[10px] uppercase tracking-widest font-medium shadow-lg">Confirm Specification</button>
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* --- THE ARCHIVE --- */}
        {view === 'samples' && (
          <motion.section key="samples" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-screen-2xl mx-auto py-24 px-10 text-center">
            <h2 className="font-serif text-8xl italic mb-20 tracking-tighter">The Archive</h2>
            <div className="columns-1 md:columns-4 gap-6 space-y-6">
              {archiveItems.map(item => (
                <div key={item.id} className="relative group rounded-sm overflow-hidden bg-stone-50">
                  <img src={item.url} className="w-full grayscale hover:grayscale-0 transition-all duration-700" />
                  {isAdmin && <button onClick={() => handleDelete(item.id)} className="absolute top-4 right-4 p-3 bg-white text-red-500 opacity-0 group-hover:opacity-100 rounded-full transition-opacity"><Trash2 size={16}/></button>}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* --- OUR STORY --- */}
        {view === 'story' && (
          <motion.section key="story" className="max-w-4xl mx-auto py-32 px-10 text-center">
            <h2 className="font-serif text-8xl italic mb-16 tracking-tighter">Our Story</h2>
            <div className="space-y-16">
              <p className="text-2xl font-light italic leading-relaxed text-stone-600">"Kalakari is where history meets the stitch—crafted in Lucknow, worn by you."</p>
              <div className="h-[1px] w-20 bg-stone-200 mx-auto" />
              <p className="text-sm leading-loose tracking-widest text-stone-400 uppercase max-w-2xl mx-auto">Blending the age-old traditions of Chikan and Zardosi with a silhouette designed for the modern woman.</p>
            </div>
          </motion.section>
        )}

        {/* --- ACCOUNT / ADMIN --- */}
        {view === 'account' && (
          <motion.section key="account" className="max-w-6xl mx-auto py-32 px-10">
            <div className="flex justify-between items-end border-b border-stone-100 pb-10 mb-20">
              <h2 className="font-serif text-7xl italic tracking-tighter">My Space</h2>
              <button onClick={handleLogout} className="text-stone-400 hover:text-black flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-medium"><LogOut size={14}/> Sign Out</button>
            </div>
            {isAdmin ? (
              <div className="grid lg:grid-cols-12 gap-16">
                <div className="lg:col-span-5 border border-dashed border-stone-200 p-16 text-center rounded-sm">
                  <label className="cursor-pointer group">
                    {uploading ? <Loader2 className="animate-spin mx-auto text-stone-300" /> : <Upload className="mx-auto mb-4 text-stone-200 group-hover:text-black transition-colors" />}
                    <span className="text-[9px] uppercase tracking-widest text-stone-400">Upload to Archive</span>
                    <input type="file" className="hidden" onChange={handleUpload} />
                  </label>
                </div>
                <div className="lg:col-span-7 grid grid-cols-3 gap-4 h-[400px] overflow-y-auto pr-4 scrollbar-hide">
                  {archiveItems.map(item => (
                    <div key={item.id} className="aspect-square relative group rounded-sm overflow-hidden bg-stone-50">
                      <img src={item.url} className="w-full h-full object-cover" />
                      <button onClick={() => handleDelete(item.id)} className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Trash2 size={18}/></button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto py-24 border border-stone-100 text-center rounded-sm">
                <p className="font-serif text-2xl italic mb-2">{currentUser.email}</p>
                <p className="text-[9px] uppercase tracking-widest text-stone-400">Studio Member</p>
              </div>
            )}
          </motion.section>
        )}

        {/* --- SHOPPING BAG --- */}
        {view === 'cart' && (
          <motion.section key="cart" className="max-w-4xl mx-auto py-32 px-10">
            <h2 className="font-serif text-8xl italic tracking-tighter text-center mb-24">Your Bag</h2>
            <div className="space-y-12 mb-20">
              {cart.map(item => (
                <div key={item.cartId} className="flex gap-10 items-center border-b border-stone-100 pb-12">
                  <div className="w-24 h-32 bg-stone-50 rounded-sm overflow-hidden"><img src={item.img || ASSETS.SAREE_MAIN} className="w-full h-full object-cover" /></div>
                  <div className="flex-1 space-y-2">
                    <p className="font-serif italic text-3xl">{item.name}</p>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-stone-400">{item.type === 'custom' ? item.fabric : item.color}</p>
                  </div>
                  <button onClick={() => setCart(cart.filter(i => i.cartId !== item.cartId))} className="text-stone-300 hover:text-black transition-colors"><X size={20}/></button>
                </div>
              ))}
              {cart.length === 0 && <p className="text-center font-serif italic text-2xl text-stone-200 py-20">Empty bag.</p>}
            </div>
            {cart.length > 0 && <button onClick={() => navigateTo('checkout')} className="w-full bg-[#1A1A1A] text-white py-8 rounded-full text-[10px] uppercase tracking-[0.4em] font-medium shadow-xl">Proceed to Checkout</button>}
          </motion.section>
        )}

        {/* --- CHECKOUT FLOW --- */}
        {view === 'checkout' && (
          <motion.section key="checkout" className="min-h-screen flex flex-col lg:flex-row bg-white">
            <div className="w-full lg:w-[65%] p-10 lg:p-24 xl:p-32">
              <div className="flex gap-10 mb-20 text-[9px] font-medium uppercase tracking-widest">
                <span className={checkoutStep === 'contact' ? 'text-black underline underline-offset-8' : 'text-stone-300'}>01. Contact</span>
                <span className={checkoutStep === 'address' ? 'text-black underline underline-offset-8' : 'text-stone-300'}>02. Address</span>
                <span className={checkoutStep === 'payment' ? 'text-black underline underline-offset-8' : 'text-stone-300'}>03. Payment</span>
              </div>
              <div className="max-w-md">
                {checkoutStep === 'contact' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    <h2 className="font-serif text-6xl italic mb-12">Contact</h2>
                    <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full py-5 border-b border-stone-100 outline-none focus:border-black transition-colors" />
                    <input type="tel" placeholder="Mobile" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} className="w-full py-5 border-b border-stone-100 outline-none focus:border-black transition-colors" />
                    <button onClick={() => setCheckoutStep('address')} className="w-full bg-[#1A1A1A] text-white py-6 rounded-full text-[10px] uppercase tracking-widest font-medium mt-12">Continue to Address</button>
                  </motion.div>
                )}
                {checkoutStep === 'address' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    <h2 className="font-serif text-6xl italic mb-12">Shipping</h2>
                    <input type="text" placeholder="House / Area" value={form.house} onChange={e => setForm({...form, house: e.target.value})} className="w-full py-5 border-b border-stone-100 outline-none focus:border-black" />
                    <div className="grid grid-cols-2 gap-6"><input type="text" placeholder="City" className="w-full py-5 border-b border-stone-100 outline-none" /><input type="text" placeholder="Pincode" className="w-full py-5 border-b border-stone-100 outline-none" /></div>
                    <button onClick={() => setCheckoutStep('payment')} className="w-full bg-[#1A1A1A] text-white py-6 rounded-full text-[10px] uppercase tracking-widest font-medium mt-12">Continue to Payment</button>
                  </motion.div>
                )}
                {checkoutStep === 'payment' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                    <h2 className="font-serif text-6xl italic">Payment</h2>
                    <div className="p-10 border border-black rounded-sm flex justify-between items-center"><span className="text-[10px] font-medium tracking-widest uppercase">WhatsApp Confirmation</span><CheckCircle2 size={20}/></div>
                    <button onClick={sendWhatsApp} className="w-full bg-[#1A1A1A] text-white py-8 rounded-full text-[10px] uppercase tracking-widest font-medium flex items-center justify-center gap-4">Confirm Order <Send size={16}/></button>
                  </motion.div>
                )}
              </div>
            </div>
            <div className="w-full lg:w-[35%] bg-[#FDFBF7] p-10 lg:p-20 border-l border-stone-100">
              <h3 className="font-serif text-4xl italic mb-12">Summary</h3>
              {cart.map(item => (
                <div key={item.cartId} className="flex gap-6 mb-8 items-center">
                  <div className="w-16 h-20 bg-stone-100 rounded-sm overflow-hidden"><img src={item.img || ASSETS.SAREE_MAIN} className="w-full h-full object-cover" /></div>
                  <div><p className="font-serif text-xl italic leading-none mb-1">{item.name}</p><p className="text-[8px] uppercase tracking-widest text-stone-400">Qty: 01</p></div>
                </div>
              ))}
              <div className="border-t border-stone-200 pt-10 flex justify-between text-[11px] uppercase tracking-[0.2em] font-medium"><span>Total</span><span>Price on Request</span></div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* --- UPDATED FOOTER (STREAMLINED, DARKER, LARGER) --- */}
      <footer className="w-full px-10 py-12 bg-[#FDFBF7] border-t border-stone-100 mt-20">
        <div className="max-w-screen-2xl mx-auto flex flex-row items-center justify-between">
          
          {/* Left: Streamlined Text */}
          <div className="flex-1 text-left">
            <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-black">
              KALAKARI STUDIO, LUCKNOW . 2026
            </p>
          </div>

          {/* Middle: Social Icons */}
          <div className="flex items-center justify-center gap-12 flex-1">
            <a href="https://instagram.com/hajelachhaya" target="_blank" className="text-stone-300 hover:text-black transition-colors">
              <Instagram size={22} strokeWidth={1.5} />
            </a>
            <a href="https://facebook.com/chhaya.hajela" target="_blank" className="text-stone-300 hover:text-black transition-colors">
              <Facebook size={22} strokeWidth={1.5} />
            </a>
            <a href="mailto:contact@kalakari.com" className="text-stone-300 hover:text-black transition-colors">
              <Mail size={22} strokeWidth={1.5} />
            </a>
          </div>

          {/* Right: Policy Links */}
          <div className="flex-1 flex justify-end gap-12 text-right">
            <button className="text-[12px] font-bold uppercase tracking-[0.2em] text-black hover:opacity-60 transition-opacity">
              Terms & Conditions
            </button>
            <button className="text-[12px] font-bold uppercase tracking-[0.2em] text-black hover:opacity-60 transition-opacity">
              Privacy Policy
            </button>
          </div>

        </div>
      </footer>
    </div>
  );
}