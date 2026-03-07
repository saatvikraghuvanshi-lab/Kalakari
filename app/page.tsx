'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, User, X, Instagram, Facebook, 
  ChevronRight, ArrowLeft, Send, Trash2, Mail, Upload, Loader2, LogOut,
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

  if (authLoading) return <div className="min-h-screen bg-[#F9F6F2] flex items-center justify-center"><Loader2 className="animate-spin text-[#333333]/20" /></div>;

  if (!currentUser) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F6F2] text-[#333333] text-center p-6">
      <h1 className="font-serif text-[10rem] italic tracking-tighter leading-none mb-4">KalaKari</h1>
      <p className="uppercase tracking-[0.6em] text-[10px] text-[#333333]/60 mb-16">Ancestral Threads • Modern Silhouettes</p>
      <button onClick={handleLogin} className="bg-[#333333] text-[#F9F6F2] px-14 py-5 rounded-full uppercase text-[10px] tracking-widest font-medium hover:bg-[#8D5B5B] transition-all">Enter Studio</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F6F2] text-[#333333] font-sans selection:bg-[#8D5B5B]/10">
      
      {/* --- NAVBAR: CENTERED NAVIGATION --- */}
      <nav className="sticky top-0 z-[100] px-10 py-8 grid grid-cols-3 items-center bg-[#F9F6F2]/90 backdrop-blur-md border-b border-[#333333]/5">
        <div>
          <span onClick={() => {navigateTo('home'); setColType(null); setCustomCat(null)}} className="font-serif text-3xl italic cursor-pointer tracking-tighter">KalaKari</span>
        </div>
        <div className="flex justify-center gap-10 text-[10px] font-medium uppercase tracking-[0.25em] text-[#333333]/60">
          <button onClick={() => navigateTo('collections')} className="hover:text-[#333333] transition-colors">Collections</button>
          <button onClick={() => navigateTo('samples')} className="hover:text-[#333333] transition-colors">The Archive</button>
          <button onClick={() => navigateTo('story')} className="hover:text-[#333333] transition-colors">Our Story</button>
        </div>
        <div className="flex justify-end gap-8">
          <button onClick={() => navigateTo('account')} className="hover:text-[#8D5B5B] transition-colors"><User size={18} strokeWidth={1.5} /></button>
          <button onClick={() => navigateTo('cart')} className="relative hover:text-[#8D5B5B] transition-colors">
            <ShoppingBag size={18} strokeWidth={1.5} />
            {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-[#333333] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
          </button>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {/* --- HOME VIEW --- */}
        {view === 'home' && (
          <motion.section key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-24 pb-32 px-10 max-w-screen-2xl mx-auto">
            <h2 className="font-serif text-[115px] italic leading-[0.9] mb-20 max-w-5xl tracking-tighter text-[#333333]">
              Ancestral Threads<br /> Modern Silhouettes.
            </h2>
            <div className="grid grid-cols-12 gap-6 h-[85vh] mb-20">
              <div className="col-span-4 overflow-hidden rounded-[2rem] shadow-sm"><img src={ASSETS.SAREE_MAIN} className="h-full w-full object-cover hover:scale-105 transition-transform duration-1000" /></div>
              <div className="col-span-5 overflow-hidden rounded-[2rem] shadow-sm"><img src={ASSETS.SHIRT} className="h-full w-full object-cover hover:scale-105 transition-transform duration-1000" /></div>
              <div className="col-span-3 overflow-hidden rounded-[2rem] shadow-sm"><img src={ASSETS.LEHENGA_MAIN} className="h-full w-full object-cover hover:scale-105 transition-transform duration-1000" /></div>
            </div>
            <div className="flex justify-center">
              <button onClick={() => navigateTo('collections')} className="border border-[#333333] px-24 py-6 rounded-full text-[10px] uppercase tracking-[0.4em] font-medium hover:bg-[#333333] hover:text-[#F9F6F2] transition-all">Explore Collections</button>
            </div>
          </motion.section>
        )}

        {/* --- COLLECTIONS SELECT --- */}
        {view === 'collections' && !colType && (
          <motion.section key="col" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-6xl mx-auto py-32 px-10 grid md:grid-cols-2 gap-12">
            <div onClick={() => setColType('readymade')} className="p-24 border border-[#333333]/10 bg-white rounded-[2rem] text-center cursor-pointer hover:border-[#8D5B5B] transition-all group">
              <h3 className="font-serif text-5xl italic mb-6">Readymade</h3>
              <p className="text-[9px] uppercase tracking-[0.4em] text-[#333333]/40 group-hover:text-[#333333]">Studio Selection</p>
            </div>
            <div onClick={() => setColType('custom')} className="p-24 border border-[#333333]/10 bg-white rounded-[2rem] text-center cursor-pointer hover:border-[#8D5B5B] transition-all group">
              <h3 className="font-serif text-5xl italic mb-6">Custom</h3>
              <p className="text-[9px] uppercase tracking-[0.4em] text-[#333333]/40 group-hover:text-[#333333]">Bespoke Craftsmanship</p>
            </div>
          </motion.section>
        )}

        {/* --- READYMADE GALLERY --- */}
        {colType === 'readymade' && view !== 'product-page' && (
          <motion.section key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-screen-2xl mx-auto py-20 px-10">
            <button onClick={() => setColType(null)} className="mb-12 flex items-center gap-3 text-[9px] uppercase tracking-widest text-[#333333]/40 hover:text-[#333333]"><ArrowLeft size={14}/> Back</button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-20">
              {[{ name: 'Classic Dress', hasSize: true, img: ASSETS.DRESS }, { name: 'Heritage Shirt', hasSize: true, img: ASSETS.SHIRT }, { name: 'Studio T-Shirt', hasSize: true, img: ASSETS.TSHIRT }, { name: 'Silk Stole', hasSize: false, img: ASSETS.STOLE }, { name: 'Ancestral Scarf', hasSize: false, img: ASSETS.SCARF }].map(product => (
                <div key={product.name} onClick={() => { setSelectedReadymade(product); navigateTo('product-page'); }} className="group cursor-pointer">
                  <div className="aspect-[3/4] overflow-hidden rounded-[2rem] mb-8"><img src={product.img} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" /></div>
                  <div className="flex justify-between items-end border-b border-[#333333]/5 pb-6">
                    <h4 className="font-serif text-3xl italic">{product.name}</h4>
                    <ChevronRight size={18} className="text-[#333333]/20 group-hover:text-[#8D5B5B]" />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* --- DYNAMIC PRODUCT PAGE --- */}
        {view === 'product-page' && selectedReadymade && (
          <motion.section key="product" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto py-24 px-10">
            <button onClick={() => navigateTo('collections')} className="mb-12 flex items-center gap-3 text-[9px] uppercase tracking-widest text-[#333333]/40 hover:text-[#333333]"><ArrowLeft size={14}/> Back to Selection</button>
            <div className="grid md:grid-cols-2 gap-24">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-white shadow-sm"><img src={selectedReadymade.img} className="w-full h-full object-cover" /></div>
              <div className="py-12 space-y-16">
                <h2 className="font-serif text-7xl italic leading-none">{selectedReadymade.name}</h2>
                <div className="space-y-6">
                  <p className="text-[10px] uppercase tracking-widest text-[#333333]/40">Select Palette</p>
                  <div className="flex gap-4">{COLORS.map(c => <button key={c.name} onClick={() => setSelection({...selection, color: c.name})} className={`w-10 h-10 rounded-full border border-[#333333]/5 ${selection.color === c.name ? 'ring-2 ring-[#333333] ring-offset-4' : ''}`} style={{ backgroundColor: c.hex }} />)}</div>
                </div>
                {selectedReadymade.hasSize && (
                  <div className="space-y-6">
                    <p className="text-[10px] uppercase tracking-widest text-[#333333]/40">Select Size</p>
                    <div className="grid grid-cols-6 gap-3">{SIZES.map(s => <button key={s} onClick={() => setSelection({...selection, size: s})} className={`py-5 text-[10px] border transition-all ${selection.size === s ? 'bg-[#333333] text-white border-[#333333]' : 'border-[#333333]/10 text-[#333333]/60 hover:border-[#333333]'}`}>{s}</button>)}</div>
                  </div>
                )}
                <button onClick={() => addToBag({ ...selectedReadymade, ...selection })} className="w-full bg-[#333333] text-white py-8 rounded-full text-[11px] uppercase tracking-widest font-medium hover:bg-[#8D5B5B] transition-colors shadow-lg">Add to Bag</button>
              </div>
            </div>
          </motion.section>
        )}

        {/* --- CUSTOM FORM --- */}
        {colType === 'custom' && (
          <motion.section key="custom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto py-24 px-10">
            <button onClick={() => {setColType(null); setCustomCat(null)}} className="mb-12 flex items-center gap-3 text-[9px] uppercase tracking-widest text-[#333333]/40"><ArrowLeft size={14}/> Back</button>
            {!customCat ? (
              <div className="grid md:grid-cols-3 gap-8">
                {['Saree', 'Lehenga', 'Kurta Set'].map(c => <button key={c} onClick={() => setCustomCat(c as any)} className="p-20 border border-[#333333]/10 bg-white rounded-[2rem] font-serif text-4xl italic hover:border-[#8D5B5B] transition-all">{c}</button>)}
              </div>
            ) : (
              <div className="bg-white p-16 rounded-[3rem] border border-[#333333]/5 grid lg:grid-cols-2 gap-20 shadow-sm">
                <div className="space-y-12">
                  <h3 className="font-serif text-5xl italic border-b border-[#333333]/5 pb-10">{customCat} Specs</h3>
                  <div className="space-y-6">
                    <label className="text-[9px] uppercase tracking-widest text-[#333333]/40">Fabric Selection</label>
                    <div className="grid grid-cols-2 gap-3">{FABRICS.map(f => <button key={f} onClick={() => setSelection({...selection, fabric: f})} className={`py-5 border text-[10px] tracking-widest transition-all ${selection.fabric === f ? 'bg-[#333333] text-white border-[#333333]' : 'border-[#333333]/10 text-[#333333]/60 hover:border-[#333333]'}`}>{f}</button>)}</div>
                  </div>
                </div>
                <div className="space-y-12">
                  <div className="space-y-6">
                    <label className="text-[9px] uppercase tracking-widest text-[#333333]/40">Measurements (Inches)</label>
                    <div className="grid grid-cols-3 gap-6">{['Bust', 'Waist', 'Hips', 'Sleeves', 'Front', 'Back'].map(m => <input key={m} type="text" placeholder={m} className="py-5 border-b border-[#333333]/5 outline-none focus:border-[#333333] bg-transparent text-sm placeholder:text-[#333333]/20" />)}</div>
                  </div>
                  <button onClick={() => addToBag({ name: `Bespoke ${customCat}`, type: 'custom', ...selection })} className="w-full bg-[#333333] text-white py-8 rounded-full text-[10px] uppercase tracking-widest font-medium shadow-xl">Confirm Specification</button>
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* --- ARCHIVE --- */}
        {view === 'samples' && (
          <motion.section key="samples" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-screen-2xl mx-auto py-24 px-10 text-center">
            <h2 className="font-serif text-[115px] italic mb-20 tracking-tighter">The Archive</h2>
            <div className="columns-1 md:columns-4 gap-6 space-y-6">
              {archiveItems.map(item => (
                <div key={item.id} className="relative group rounded-[2rem] overflow-hidden bg-white shadow-sm">
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
              <p className="text-2xl font-light italic leading-relaxed text-[#333333]/70">"Kalakari is where history meets the stitch—crafted in Lucknow, worn by you."</p>
              <div className="h-[1px] w-20 bg-[#333333]/10 mx-auto" />
              <p className="text-sm leading-loose tracking-[0.3em] text-[#333333]/40 uppercase max-w-2xl mx-auto font-sans">Blending the age-old traditions of Chikan and Zardosi with a silhouette designed for the modern woman.</p>
            </div>
          </motion.section>
        )}

        {/* --- ACCOUNT --- */}
        {view === 'account' && (
          <motion.section key="account" className="max-w-6xl mx-auto py-32 px-10">
            <div className="flex justify-between items-end border-b border-[#333333]/5 pb-10 mb-20">
              <h2 className="font-serif text-7xl italic tracking-tighter">My Space</h2>
              <button onClick={handleLogout} className="text-[#333333]/40 hover:text-[#333333] flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-medium transition-colors"><LogOut size={14}/> Sign Out</button>
            </div>
            {isAdmin ? (
              <div className="grid lg:grid-cols-12 gap-16">
                <div className="lg:col-span-5 border-2 border-dashed border-[#333333]/10 p-16 text-center rounded-[2rem]">
                  <label className="cursor-pointer group">
                    {uploading ? <Loader2 className="animate-spin mx-auto text-[#333333]/20" /> : <Upload className="mx-auto mb-4 text-[#333333]/10 group-hover:text-[#333333] transition-colors" />}
                    <span className="text-[9px] uppercase tracking-widest text-[#333333]/40">Upload to Archive</span>
                    <input type="file" className="hidden" onChange={handleUpload} />
                  </label>
                </div>
                <div className="lg:col-span-7 grid grid-cols-3 gap-4 h-[400px] overflow-y-auto pr-4 scrollbar-hide">
                  {archiveItems.map(item => (
                    <div key={item.id} className="aspect-square relative group rounded-[1.5rem] overflow-hidden bg-white">
                      <img src={item.url} className="w-full h-full object-cover" />
                      <button onClick={() => handleDelete(item.id)} className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Trash2 size={18}/></button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto py-24 border border-[#333333]/5 text-center rounded-[2rem] bg-white">
                <p className="font-serif text-3xl italic mb-2">{currentUser.email}</p>
                <p className="text-[9px] uppercase tracking-widest text-[#333333]/40">Studio Member</p>
              </div>
            )}
          </motion.section>
        )}

        {/* --- CART VIEW --- */}
        {view === 'cart' && (
          <motion.section key="cart" className="max-w-4xl mx-auto py-32 px-10">
            <h2 className="text-[12px] uppercase tracking-[0.6em] text-[#333333]/40 text-center mb-24 font-sans">Your Cart</h2>
            <div className="space-y-12 mb-20">
              {cart.map(item => (
                <div key={item.cartId} className="flex gap-10 items-center border-b border-[#333333]/5 pb-12">
                  <div className="w-24 h-32 bg-white rounded-[1.5rem] overflow-hidden shadow-sm"><img src={item.img || ASSETS.SAREE_MAIN} className="w-full h-full object-cover" /></div>
                  <div className="flex-1 space-y-2">
                    <p className="font-serif italic text-3xl">{item.name}</p>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#333333]/40">{item.type === 'custom' ? item.fabric : item.color}</p>
                  </div>
                  <button onClick={() => setCart(cart.filter(i => i.cartId !== item.cartId))} className="text-[#333333]/20 hover:text-[#333333] transition-colors"><X size={22}/></button>
                </div>
              ))}
              {cart.length === 0 && <p className="text-center font-serif italic text-3xl text-[#333333]/10 py-24">Empty cart.</p>}
            </div>
            {cart.length > 0 && <button onClick={() => navigateTo('checkout')} className="w-full bg-[#333333] text-white py-9 rounded-full text-[11px] uppercase tracking-[0.4em] font-medium shadow-2xl hover:bg-[#059669] transition-all">Proceed to Checkout</button>}
          </motion.section>
        )}

        {/* --- CHECKOUT --- */}
        {view === 'checkout' && (
          <motion.section key="checkout" className="max-w-7xl mx-auto my-12 flex flex-col lg:flex-row bg-white rounded-[3rem] shadow-2xl overflow-hidden min-h-[80vh]">
            <div className="w-full lg:w-[60%] p-12 lg:p-24">
              <div className="flex gap-10 mb-20 text-[9px] font-medium uppercase tracking-widest text-[#333333]/40">
                <span className={checkoutStep === 'contact' ? 'text-[#333333] underline underline-offset-8' : ''}>01 Contact</span>
                <span className={checkoutStep === 'address' ? 'text-[#333333] underline underline-offset-8' : ''}>02 Address</span>
                <span className={checkoutStep === 'payment' ? 'text-[#333333] underline underline-offset-8' : ''}>03 Payment</span>
              </div>
              <div className="max-w-md">
                {checkoutStep === 'contact' && (
                  <div className="space-y-10">
                    <h2 className="font-serif text-6xl italic">Contact</h2>
                    <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full py-6 border-b border-[#333333]/10 outline-none focus:border-[#333333] bg-transparent" />
                    <input type="tel" placeholder="Mobile" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} className="w-full py-6 border-b border-[#333333]/10 outline-none focus:border-[#333333] bg-transparent" />
                    <button onClick={() => setCheckoutStep('address')} className="w-full bg-[#333333] text-white py-7 rounded-full text-[10px] uppercase tracking-widest font-medium mt-12">Continue</button>
                  </div>
                )}
                {checkoutStep === 'address' && (
                  <div className="space-y-10">
                    <h2 className="font-serif text-6xl italic">Shipping</h2>
                    <input type="text" placeholder="House / Area" value={form.house} onChange={e => setForm({...form, house: e.target.value})} className="w-full py-6 border-b border-[#333333]/10 outline-none focus:border-[#333333] bg-transparent" />
                    <div className="grid grid-cols-2 gap-6"><input type="text" placeholder="City" className="w-full py-6 border-b border-[#333333]/10 outline-none" /><input type="text" placeholder="Pincode" className="w-full py-6 border-b border-[#333333]/10 outline-none" /></div>
                    <button onClick={() => setCheckoutStep('payment')} className="w-full bg-[#333333] text-white py-7 rounded-full text-[10px] uppercase tracking-widest font-medium mt-12">Continue</button>
                  </div>
                )}
                {checkoutStep === 'payment' && (
                  <div className="space-y-12">
                    <h2 className="font-serif text-6xl italic">Payment</h2>
                    <div className="p-10 bg-[#D1FAE5] rounded-[2rem] flex justify-between items-center"><span className="text-[10px] font-bold tracking-widest uppercase text-[#059669]">WhatsApp Checkout Enabled</span><CheckCircle2 className="text-[#059669]" /></div>
                    <button onClick={sendWhatsApp} className="w-full bg-[#059669] text-white py-8 rounded-full text-[11px] uppercase tracking-widest font-bold shadow-lg">Confirm Order <Send size={16} className="inline ml-2"/></button>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full lg:w-[40%] bg-[#F9F6F2] p-12 lg:p-20 border-l border-[#333333]/5">
              <h3 className="font-serif text-3xl italic mb-12">Summary</h3>
              {cart.map(item => (
                <div key={item.cartId} className="flex gap-6 mb-8 items-center">
                  <div className="w-16 h-20 bg-white rounded-xl overflow-hidden shadow-sm"><img src={item.img || ASSETS.SAREE_MAIN} className="w-full h-full object-cover" /></div>
                  <div><p className="font-serif text-xl italic leading-none mb-1">{item.name}</p><p className="text-[8px] uppercase tracking-widest text-[#333333]/40">Qty: 01</p></div>
                </div>
              ))}
              <div className="border-t border-[#333333]/10 pt-10 mt-10 flex justify-between text-[11px] uppercase tracking-widest font-bold"><span>Total</span><span>Price on Request</span></div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* --- FOOTER --- */}
      <footer className="px-10 py-32 bg-[#F9F6F2] border-t border-[#333333]/5">
        <div className="flex justify-center gap-16 mb-24">
          <a href="https://instagram.com/hajelachhaya" target="_blank" className="text-[#333333] hover:text-[#8D5B5B] transition-colors"><Instagram size={24} strokeWidth={1.5} /></a>
          <a href="https://facebook.com/chhaya.hajela" target="_blank" className="text-[#333333] hover:text-[#8D5B5B] transition-colors"><Facebook size={24} strokeWidth={1.5} /></a>
          <a href="mailto:contact@kalakari.com" className="text-[#333333] hover:text-[#8D5B5B] transition-colors"><Mail size={24} strokeWidth={1.5} /></a>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center text-[11px] uppercase tracking-[0.4em] text-[#333333]/40 font-sans">
          <p className="font-medium">KALAKARI STUDIO • LUCKNOW • 2026</p>
          <div className="flex gap-10 mt-8 md:mt-0 text-[9px] tracking-[0.2em]">
            <button className="hover:text-[#333333] transition-colors">Terms & Conditions</button>
            <button className="hover:text-[#333333] transition-colors">Privacy Policy</button>
          </div>
        </div>
      </footer>
    </div>
  );
}