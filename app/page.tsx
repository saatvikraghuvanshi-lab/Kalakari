'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, User, Heart, X, Instagram, Facebook, 
  ChevronRight, ArrowLeft, Send, Ruler, Palette, Trash2, 
  Scissors, ShieldCheck, HelpCircle, FileText, MapPin, Phone, Mail
} from 'lucide-react';

// --- YOUR AUTHENTIC IMAGE ASSETS ---
const SAMPLE_IMAGES = [
  "https://media.samyakk.in/pub/media/catalog/product/b/e/beige-and-gold-dual-tone-tissue-designer-saree-with-thread-work-and-unstitched-blouse-gh1568-a.jpg",
  "https://theloomstore.in/cdn/shop/files/IMG_5243.jpg?v=1698303816&width=1946",
  "https://clothsvilla.com/cdn/shop/products/WhatsAppImage2022-04-02at2.31.50PM_3_1024x1024.jpg?v=1648890244",
  "https://media.samyakk.in/pub/media/catalog/product/l/i/light-brown-sequins-work-saree-with-readymade-full-sleeves-blouse-gh6037-a.jpg",
  "https://media.samyakk.in/pub/media/catalog/product/h/o/hot-pink-mirror-embroidered-silk-designer-saree-with-contrast-v-neck-blouse-jf1678-a.jpg",
  "https://cdn.cosmos.so/d87eaebb-5652-4e0c-8ec4-7214d4d45097?format=jpeg",
  "https://cdn.cosmos.so/c236e60f-4d49-46cc-a98e-ee06d0e845d8?format=jpeg",
  "https://cdn.cosmos.so/c56cc03d-07bd-4cf6-90fa-d1cf07851f3c?format=jpeg",
  "https://cdn.cosmos.so/d8e6098d-0e69-4fe9-b247-df846574c130?format=jpeg",
  "https://itokri.com/cdn/shop/files/red-hand-natural-dyed-pure-cotton-stole-tassels-26-stoles-310.jpg?v=1770793113&width=480",
  "https://itokri.com/cdn/shop/files/black-hand-natural-dyed-chanderi-silk-stole-tassels-13-stoles-182.jpg?v=1770738425&width=480"
];

const FABRICS = ["Pure Chiffon", "Raw Silk", "Organza", "Chanderi Silk", "Georgette", "Cotton Mulmul", "Banarasi Brocade", "Tissue Silk"];
const WORK_TYPES = ["Antique Gold Gota Patti", "Silver Zardosi", "Mirror Work", "Thread Embroidery", "Mukaish Work", "Pearl Border", "Sequins Work"];
const COLORS = [
  { name: "Ruby", hex: "#8B0000" }, { name: "Emerald", hex: "#006400" }, 
  { name: "Navy", hex: "#000080" }, { name: "Ivory", hex: "#F5F5DC" }, 
  { name: "Gold", hex: "#DAA520" }, { name: "Pink", hex: "#FF69B4" }
];

export default function KalakariBoutique() {
  // Navigation State
  const [view, setView] = useState<'home' | 'collections' | 'samples' | 'story' | 'cart' | 'checkout' | 'account' | 'terms' | 'privacy' | 'support'>('home');
  const [colType, setColType] = useState<'readymade' | 'custom' | null>(null);
  const [customCat, setCustomCat] = useState<'Saree' | 'Lehenga' | 'Kurta Set' | null>(null);
  
  // Logic States
  const [cart, setCart] = useState<any[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<'contact' | 'address'>('contact');
  const [customSelection, setCustomSelection] = useState({ fabric: FABRICS[0], work: WORK_TYPES[0], color: COLORS[3].name });
  const [form, setForm] = useState({ name: '', email: '', mobile: '', house: '', city: '', pin: '' });

  const navigateTo = (screen: any) => {
    setView(screen);
    window.scrollTo(0,0);
  };

  const addToCart = (item: any) => {
    setCart([...cart, { ...item, id: Math.random().toString(36).substr(2, 9) }]);
    navigateTo('cart');
  };

  const sendWhatsApp = () => {
    const items = cart.map(i => `*${i.name}*\n${i.type === 'custom' ? `Fabric: ${i.fabric}\nWork: ${i.work}\nColor: ${i.color}` : `Color: ${i.color}${i.size ? `\nSize: ${i.size}` : ''}`}`).join('\n\n');
    const msg = `*NEW ORDER - KALAKARI*\n\n*Name:* ${form.name}\n*Ph:* ${form.mobile}\n*Addr:* ${form.house}, ${form.city} ${form.pin}\n\n*Items:*\n${items}`;
    window.open(`https://wa.me/917991464638?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-black font-sans selection:bg-[#E9E5CE]">
      
      {/* --- REPAIRED TOP NAV --- */}
      <nav className="sticky top-0 z-[100] px-6 md:px-12 py-5 flex justify-between items-center border-b border-stone-200 bg-[#E9E5CE]">
        <div className="flex items-center gap-8 md:gap-12">
          <span onClick={() => {navigateTo('home'); setColType(null); setCustomCat(null)}} className="font-serif text-2xl md:text-3xl font-black italic cursor-pointer uppercase tracking-tighter">KALAKARI</span>
          <div className="hidden lg:flex gap-8 text-[10px] font-black uppercase tracking-widest">
            <button onClick={() => navigateTo('collections')}>Collections</button>
            <button onClick={() => navigateTo('samples')}>Samples</button>
            <button onClick={() => navigateTo('story')}>Our Story</button>
          </div>
        </div>
        <div className="flex items-center gap-5 md:gap-8">
          <button onClick={() => navigateTo('account')} className="hover:scale-110 transition-transform"><User size={22} /></button>
          <div onClick={() => navigateTo('cart')} className="relative cursor-pointer hover:scale-110 transition-transform">
            <ShoppingBag size={24} />
            {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce">{cart.length}</span>}
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        
        {/* --- HOME --- */}
        {view === 'home' && (
          <motion.section key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-12 md:py-24 px-6 text-center">
            <h1 className="font-serif text-[14vw] md:text-[130px] italic leading-none mb-12">Timeless Craft</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16">
              <img src={SAMPLE_IMAGES[0]} className="rounded-3xl h-[450px] w-full object-cover shadow-xl" alt="Saree" />
              <img src={SAMPLE_IMAGES[4]} className="rounded-3xl h-[550px] w-full object-cover shadow-2xl md:-mt-10" alt="Detail" />
              <img src={SAMPLE_IMAGES[2]} className="rounded-3xl h-[450px] w-full object-cover shadow-xl" alt="Lehenga" />
            </div>
            <button onClick={() => navigateTo('collections')} className="bg-black text-white px-16 py-6 rounded-full font-black uppercase tracking-widest text-xs active:scale-95 transition-all">Enter Studio</button>
          </motion.section>
        )}

        {/* --- COLLECTIONS SELECT --- */}
        {view === 'collections' && !colType && (
          <motion.section key="col" className="max-w-5xl mx-auto py-24 md:py-32 px-6 grid md:grid-cols-2 gap-8">
            <div onClick={() => setColType('readymade')} className="p-16 border-2 border-stone-200 rounded-[3rem] text-center cursor-pointer hover:bg-black hover:text-white transition-all">
              <h3 className="font-serif text-5xl italic mb-4">Readymade</h3>
              <p className="text-xs font-black uppercase opacity-60">Instant Heritage Pieces</p>
            </div>
            <div onClick={() => setColType('custom')} className="p-16 border-2 border-stone-200 rounded-[3rem] text-center cursor-pointer hover:bg-black hover:text-white transition-all">
              <h3 className="font-serif text-5xl italic mb-4">Custom</h3>
              <p className="text-xs font-black uppercase opacity-60">Bespoke Couture Design</p>
            </div>
          </motion.section>
        )}

        {/* --- READYMADE SHOP --- */}
        {colType === 'readymade' && (
          <motion.section key="ready" className="max-w-7xl mx-auto py-16 px-6">
            <button onClick={() => setColType(null)} className="mb-10 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest"><ArrowLeft size={16}/> Back</button>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {[{n:'Designer Dress', s:true, i:5}, {n:'Classic Shirt', s:true, i:6}, {n:'Pure Cotton Stole', s:false, i:9}, {n:'Chanderi Silk Stole', s:false, i:10}].map(item => (
                <div key={item.n} className="bg-white rounded-[2.5rem] border border-stone-100 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                  <img src={SAMPLE_IMAGES[item.i]} className="h-80 w-full object-cover" alt={item.n}/>
                  <div className="p-8">
                    <h4 className="font-serif text-2xl italic mb-6">{item.n}</h4>
                    <div className="space-y-4">
                      <select className="w-full p-4 bg-stone-50 rounded-xl text-xs font-bold ring-1 ring-stone-100"><option>Ivory Gold</option><option>Rajasthan Red</option></select>
                      {item.s && <select className="w-full p-4 bg-stone-50 rounded-xl text-xs font-bold ring-1 ring-stone-100">{['S', 'M', 'L'].map(s => <option key={s}>{s}</option>)}</select>}
                      <button onClick={() => addToCart({ name: item.n, type: 'readymade', color: 'Ivory Gold', size: item.s ? 'M' : null })} className="w-full bg-black text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest">Add to Bag</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* --- CUSTOM STUDIO (SAREE / LEHENGA / KURTA) --- */}
        {colType === 'custom' && (
          <motion.section key="custom" className="max-w-6xl mx-auto py-16 px-6">
            <button onClick={() => setColType(null)} className="mb-10 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest"><ArrowLeft size={16}/> Back</button>
            {!customCat ? (
              <div className="grid md:grid-cols-3 gap-8">
                {['Saree', 'Lehenga', 'Kurta Set'].map(c => (
                  <button key={c} onClick={() => setCustomCat(c as any)} className="p-16 border-2 border-stone-200 rounded-[3rem] font-serif text-4xl italic hover:bg-black hover:text-white transition-all">{c}</button>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 md:p-16 rounded-[4rem] shadow-2xl grid lg:grid-cols-2 gap-16 border border-stone-100">
                <div className="space-y-10">
                  <h3 className="font-serif text-5xl italic">{customCat} Studio</h3>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase opacity-40">Choose Fabric</label>
                    <div className="grid grid-cols-2 gap-2">
                      {FABRICS.map(f => (
                        <button key={f} onClick={() => setCustomSelection({...customSelection, fabric: f})} className={`p-4 rounded-xl text-[9px] font-black uppercase border-2 transition-all ${customSelection.fabric === f ? 'border-black bg-black text-white' : 'border-stone-50 bg-stone-50'}`}>{f}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase opacity-40">Choose Work</label>
                    <select value={customSelection.work} onChange={(e) => setCustomSelection({...customSelection, work: e.target.value})} className="w-full p-4 bg-stone-50 rounded-xl font-bold text-xs ring-1 ring-stone-100 border-none outline-none">
                      {WORK_TYPES.map(w => <option key={w}>{w}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase opacity-40">Color Palette</label>
                    <div className="flex flex-wrap gap-4">
                      {COLORS.map(c => (
                        <button key={c.name} onClick={() => setCustomSelection({...customSelection, color: c.name})} className={`w-10 h-10 rounded-full border-4 shadow-lg transition-transform hover:scale-110 ${customSelection.color === c.name ? 'border-black' : 'border-white'}`} style={{ backgroundColor: c.hex }} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase opacity-40">Measurements (Inches)</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Bust', 'Waist', 'Hips', 'Sleeves', 'Front', 'Back'].map(m => (
                        <input key={m} type="text" placeholder={m} className="p-4 bg-stone-50 rounded-xl text-xs font-bold w-full ring-1 ring-stone-100 border-none focus:ring-black outline-none" />
                      ))}
                    </div>
                  </div>
                  <button onClick={() => addToCart({ name: `Bespoke ${customCat}`, type: 'custom', ...customSelection })} className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Confirm Spec</button>
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* --- SAMPLES ARCHIVE --- */}
        {view === 'samples' && (
          <motion.section key="samples" className="max-w-7xl mx-auto py-24 px-6 text-center">
            <h2 className="font-serif text-7xl italic mb-16">The Archive</h2>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
              {SAMPLE_IMAGES.map((img, i) => (
                <div key={i} className="rounded-3xl overflow-hidden shadow-xl hover:scale-[1.02] transition-transform">
                  <img src={img} className="w-full h-full object-cover" alt="Archive item" />
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* --- REPAIRED FOOTER PAGES --- */}
        {view === 'story' && <div className="max-w-3xl mx-auto py-32 px-6 text-center"><h2 className="font-serif text-6xl italic mb-8">Our Story</h2><p className="text-xl italic text-stone-600 leading-relaxed">Kalakari is a sanctuary for Rajasthan's dying arts, founded by Chhaya Hajela. Every stitch is a testament to heritage reimagined for the modern silhouette.</p></div>}
        {view === 'terms' && <div className="max-w-3xl mx-auto py-32 px-6"><h2 className="font-serif text-4xl italic mb-8">Terms & Conditions</h2><p className="text-stone-500">Orders are handcrafted and may take 2-4 weeks. All sales on bespoke items are final.</p></div>}
        {view === 'privacy' && <div className="max-w-3xl mx-auto py-32 px-6"><h2 className="font-serif text-4xl italic mb-8">Privacy Policy</h2><p className="text-stone-500">Your measurements and contact data are only used for order fulfillment via WhatsApp.</p></div>}
        {view === 'support' && <div className="max-w-3xl mx-auto py-32 px-6 text-center"><h2 className="font-serif text-6xl italic mb-8">Support</h2><div className="space-y-4 font-bold"><p className="flex items-center justify-center gap-3"><Phone size={20}/> +91 7991464638</p><p className="flex items-center justify-center gap-3"><Mail size={20}/> studio@kalakari.in</p></div></div>}
        {view === 'account' && <div className="max-w-3xl mx-auto py-32 px-6 text-center"><h2 className="font-serif text-6xl italic mb-8">My Account</h2><p className="text-stone-400 font-black uppercase tracking-widest text-xs">Login feature coming soon. Track orders via WhatsApp.</p></div>}

        {/* --- REPAIRED CART --- */}
        {view === 'cart' && (
          <motion.section key="cart" className="max-w-2xl mx-auto py-24 px-6">
            <h2 className="font-serif text-6xl italic mb-12 text-center">Your Bag</h2>
            <div className="space-y-6 mb-16">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b pb-6 border-stone-200">
                  <div className="text-left">
                    <p className="font-serif italic text-2xl">{item.name}</p>
                    <p className="text-[10px] font-black uppercase opacity-40 mt-1">{item.type === 'custom' ? `${item.fabric} • ${item.work}` : item.color}</p>
                  </div>
                  <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-stone-300 hover:text-black"><Trash2 size={24}/></button>
                </div>
              ))}
              {cart.length === 0 && <p className="text-center font-serif italic text-stone-300 py-20">Bag is empty</p>}
            </div>
            {cart.length > 0 && <button onClick={() => navigateTo('checkout')} className="w-full bg-black text-white py-6 rounded-full font-black uppercase text-xs tracking-widest shadow-xl">Checkout</button>}
          </motion.section>
        )}

        {/* --- 30/70 CHECKOUT --- */}
        {view === 'checkout' && (
          <motion.section key="checkout" className="min-h-screen flex flex-col lg:flex-row">
            <div className="w-full lg:w-[30%] bg-stone-100 p-8 lg:p-12 border-b lg:border-r border-stone-200">
              <span className="font-serif text-3xl font-black italic block mb-10 uppercase tracking-tighter">ORDER SUMMARY</span>
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="bg-white p-5 rounded-3xl shadow-sm border border-stone-200">
                    <p className="font-serif italic text-lg">{item.name}</p>
                    <p className="text-[8px] font-black uppercase opacity-40">{item.type === 'custom' ? item.fabric : item.color}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-[70%] bg-white p-8 lg:p-32">
              <div className="flex gap-10 mb-16 items-center border-b pb-4 max-w-xl">
                <span className={`text-xs font-black uppercase tracking-widest ${checkoutStep === 'contact' ? 'text-black border-b-2 border-black pb-2' : 'text-stone-300'}`}>Contact</span>
                <ChevronRight size={16} className="text-stone-300" />
                <span className={`text-xs font-black uppercase tracking-widest ${checkoutStep === 'address' ? 'text-black border-b-2 border-black pb-2' : 'text-stone-300'}`}>Address</span>
              </div>
              <div className="max-w-xl space-y-6">
                {checkoutStep === 'contact' ? (
                  <>
                    <input type="tel" placeholder="Mobile" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} className="w-full p-6 bg-stone-50 border-none rounded-2xl font-bold text-sm" />
                    <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-6 bg-stone-50 border-none rounded-2xl font-bold text-sm" />
                    <button onClick={() => setCheckoutStep('address')} className="w-full bg-black text-white py-8 rounded-full font-black uppercase text-xs tracking-widest">Continue</button>
                  </>
                ) : (
                  <>
                    <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-6 bg-stone-50 rounded-2xl font-bold text-sm" />
                    <input type="text" placeholder="Address" value={form.house} onChange={e => setForm({...form, house: e.target.value})} className="w-full p-6 bg-stone-50 rounded-2xl font-bold text-sm" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="p-6 bg-stone-50 rounded-2xl font-bold text-sm" />
                      <input type="text" placeholder="Pin" value={form.pin} onChange={e => setForm({...form, pin: e.target.value})} className="p-6 bg-stone-50 rounded-2xl font-bold text-sm" />
                    </div>
                    <button onClick={sendWhatsApp} className="w-full bg-black text-white py-8 rounded-full font-black uppercase text-xs tracking-widest flex items-center justify-center gap-4">Finalize on WhatsApp <Send size={20}/></button>
                  </>
                )}
              </div>
            </div>
          </motion.section>
        )}

      </AnimatePresence>

      {/* --- REPAIRED FOOTER --- */}
      <footer className="px-6 py-20 bg-[#E9E5CE] border-t border-stone-200 text-center">
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-[10px] font-black uppercase tracking-widest mb-16">
           <button onClick={() => navigateTo('terms')}>Terms</button>
           <button onClick={() => navigateTo('privacy')}>Privacy</button>
           <button onClick={() => navigateTo('support')}>Support</button>
        </div>
        <div className="flex justify-center gap-8 mb-12">
           <a href="https://instagram.com/hajelachhaya" target="_blank" className="hover:scale-125 transition-transform"><Instagram size={24}/></a>
           <a href="https://facebook.com/chhaya.hajela" target="_blank" className="hover:scale-125 transition-transform"><Facebook size={24}/></a>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.5em] opacity-40">© 2026 KALAKARI BOUTIQUE</p>
      </footer>
    </div>
  );
}