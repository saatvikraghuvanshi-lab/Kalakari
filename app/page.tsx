'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, User, Heart, X, Instagram, Facebook, 
  ChevronRight, ArrowLeft, Send, Ruler, Palette, Trash2, Menu
} from 'lucide-react';

// --- BRAND ASSETS & DATA ---
const THEME_COLOR = "#E9E5CE"; 
const WHATSAPP_NUMBER = "917991464638"; 

const BRAND_STORY = "Kalakari is a sanctuary for the dying arts of Rajasthan and Lucknow. Founded by Chhaya Hajela, every stitch of our Zardosi and Gota Patti is a testament to heritage, reimagined for the modern silhouette.";

const READYMADE_DATA = [
  { id: 'r1', name: 'Dress', hasSize: true, img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=500' },
  { id: 'r2', name: 'T-Shirt', hasSize: true, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500' },
  { id: 'r3', name: 'Shirt', hasSize: true, img: 'https://images.unsplash.com/photo-1596755094514-f87034a264c6?q=80&w=500' },
  { id: 'r4', name: 'Scarf', hasSize: false, img: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=500' },
  { id: 'r5', name: 'Stole', hasSize: false, img: 'https://images.unsplash.com/photo-1601924921557-45e6dea0a15e?q=80&w=500' }
];

const COLORS = ['Maroon Red', 'Royal Blue', 'Ivory', 'Forest Green', 'Golden Mustard'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

interface CartItem {
  id: string;
  name: string;
  type: 'readymade' | 'custom';
  color: string;
  size?: string;
  specs?: any;
}

export default function KalakariBoutique() {
  const [view, setView] = useState<'home' | 'collections' | 'samples' | 'story' | 'cart' | 'checkout'>('home');
  const [colType, setColType] = useState<'readymade' | 'custom' | null>(null);
  const [customCat, setCustomCat] = useState<'Saree' | 'Lehenga' | 'Kurta Set' | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<'contact' | 'address'>('contact');
  const [form, setForm] = useState({ name: '', email: '', mobile: '', house: '', city: '', pin: '' });

  // --- WHATSAPP LOGIC ---
  const handleFinalOrder = () => {
    const items = cart.map(i => `*${i.name}*\nType: ${i.type}\nColor: ${i.color}${i.size ? `\nSize: ${i.size}` : ''}${i.specs ? `\nSpecs: ${JSON.stringify(i.specs)}` : ''}`).join('\n\n');
    const message = `*NEW KALAKARI ORDER*\n\n*Customer:* ${form.name}\n*Ph:* ${form.mobile}\n*Address:* ${form.house}, ${form.city} - ${form.pin}\n\n*Cart Contents:*\n${items}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-black font-sans selection:bg-[#E9E5CE]">
      
      {/* --- RESPONSIVE TOP NAV --- */}
      <nav style={{ backgroundColor: THEME_COLOR }} className="sticky top-0 z-[100] px-4 md:px-12 py-4 md:py-6 flex justify-between items-center border-b border-stone-300">
        <div className="flex items-center gap-4 md:gap-12">
          <span onClick={() => {setView('home'); setColType(null)}} className="font-serif text-2xl md:text-3xl font-black italic cursor-pointer uppercase tracking-tighter">KALAKARI</span>
          <div className="hidden lg:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
            <button onClick={() => setView('collections')} className="hover:opacity-50">Collections</button>
            <button onClick={() => setView('samples')} className="hover:opacity-50">Samples</button>
            <button onClick={() => setView('story')} className="hover:opacity-50">Our Story</button>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <User size={20} className="cursor-pointer hidden md:block" />
          <div className="relative cursor-pointer" onClick={() => setView('cart')}>
            <ShoppingBag size={22} />
            {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{cart.length}</span>}
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        
        {/* --- HOME VIEW --- */}
        {view === 'home' && (
          <motion.section key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-12 md:py-24 px-6 text-center">
            <h2 className="text-[10px] md:text-xs uppercase tracking-[0.6em] mb-4 text-stone-500 font-bold">Lucknow • Rajasthan • Heritage</h2>
            <h1 className="font-serif text-[12vw] md:text-[100px] italic leading-none mb-12">Timeless Craft</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full mb-16">
              <img src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80" className="rounded-3xl h-64 md:h-[450px] w-full object-cover shadow-lg" alt="1" />
              <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80" className="rounded-3xl h-80 md:h-[550px] w-full object-cover shadow-2xl md:-mt-12" alt="2" />
              <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80" className="rounded-3xl h-64 md:h-[450px] w-full object-cover shadow-lg" alt="3" />
            </div>
            <button onClick={() => setView('collections')} className="w-full md:w-auto bg-black text-white px-16 py-6 rounded-full font-black uppercase text-xs tracking-widest active:scale-95 transition-transform">Explore Collections</button>
          </motion.section>
        )}

        {/* --- COLLECTIONS CHOICE --- */}
        {view === 'collections' && !colType && (
          <motion.section key="col-select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto py-12 md:py-32 px-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            <div onClick={() => setColType('readymade')} className="p-16 md:p-24 border-2 border-stone-200 rounded-[3rem] text-center cursor-pointer hover:bg-black hover:text-white transition-all group">
              <h3 className="font-serif text-4xl md:text-6xl italic mb-4">Readymade</h3>
              <p className="text-[11px] font-black uppercase tracking-widest opacity-60">Instant Elegance</p>
            </div>
            <div onClick={() => setColType('custom')} className="p-16 md:p-24 border-2 border-stone-200 rounded-[3rem] text-center cursor-pointer hover:bg-black hover:text-white transition-all group">
              <h3 className="font-serif text-4xl md:text-6xl italic mb-4">Custom</h3>
              <p className="text-[11px] font-black uppercase tracking-widest opacity-60">The Bespoke Studio</p>
            </div>
          </motion.section>
        )}

        {/* --- READYMADE SHOP --- */}
        {colType === 'readymade' && (
          <motion.section key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto py-10 px-6">
            <button onClick={() => setColType(null)} className="mb-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><ArrowLeft size={16}/> Back</button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {READYMADE_DATA.map(item => (
                <div key={item.id} className="bg-white rounded-[3rem] border border-stone-100 overflow-hidden shadow-sm hover:shadow-xl transition-shadow">
                  <img src={item.img} className="h-72 w-full object-cover" alt={item.name}/>
                  <div className="p-10">
                    <h4 className="font-serif text-3xl italic mb-6">{item.name}</h4>
                    <div className="space-y-4">
                      <select className="w-full p-4 bg-stone-50 rounded-2xl text-[11px] font-black uppercase tracking-widest border-none ring-1 ring-stone-200">
                        {COLORS.map(c => <option key={c}>{c}</option>)}
                      </select>
                      {item.hasSize && (
                        <select className="w-full p-4 bg-stone-50 rounded-2xl text-[11px] font-black uppercase tracking-widest border-none ring-1 ring-stone-200">
                          {SIZES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      )}
                      <button 
                        onClick={() => {
                          setCart([...cart, { id: Math.random().toString(), name: item.name, type: 'readymade', color: 'Custom Shade', size: item.hasSize ? 'M' : undefined }]);
                          setView('cart');
                        }}
                        className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest"
                      >Add to Bag</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* --- CUSTOM STUDIO --- */}
        {colType === 'custom' && (
          <motion.section key="custom" className="max-w-6xl mx-auto py-10 px-6">
            <button onClick={() => setColType(null)} className="mb-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><ArrowLeft size={16}/> Back</button>
            {!customCat ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Saree', 'Lehenga', 'Kurta Set'].map(c => (
                  <button key={c} onClick={() => setCustomCat(c as any)} className="p-16 border-2 border-stone-200 rounded-[2.5rem] font-serif text-3xl italic active:bg-black active:text-white">{c}</button>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 md:p-16 rounded-[4rem] shadow-2xl space-y-12">
                <div className="text-center">
                  <h3 className="font-serif text-4xl md:text-5xl italic">{customCat} Studio</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-40">Complete the specification for Chhaya</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <h5 className="text-[11px] font-black uppercase border-b pb-2 flex items-center gap-2"><Palette size={16}/> Selection</h5>
                    <div className="space-y-4">
                      <select className="w-full p-5 bg-stone-50 rounded-2xl text-xs font-bold"><option>Fabric: Pure Silk</option><option>Fabric: Organza</option></select>
                      <select className="w-full p-5 bg-stone-50 rounded-2xl text-xs font-bold"><option>Work: Antique Gold</option><option>Work: Mirror Work</option></select>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <h5 className="text-[11px] font-black uppercase border-b pb-2 flex items-center gap-2"><Ruler size={16}/> Measurements</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {['Bust', 'Waist', 'Hips', 'Sleeves', 'Front Cut', 'Back Cut'].map(m => (
                        <input key={m} type="text" placeholder={m} className="p-4 bg-stone-50 rounded-xl text-xs font-bold w-full outline-none focus:ring-1 focus:ring-black border-none" />
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        setCart([...cart, { id: Math.random().toString(), name: `Bespoke ${customCat}`, type: 'custom', color: 'As Specified' }]);
                        setView('cart');
                      }}
                      className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase text-xs tracking-widest"
                    >Register Custom Order</button>
                  </div>
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* --- 30/70 CHECKOUT PAGE --- */}
        {view === 'checkout' && (
          <motion.section key="checkout" className="min-h-screen flex flex-col md:flex-row">
            {/* 30% LEFT PANEL: SUMMARY */}
            <div className="w-full md:w-[30%] bg-stone-100 p-8 md:p-16 border-b md:border-r border-stone-200">
              <span className="font-serif text-3xl font-black italic block mb-12">KALAKARI</span>
              <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-4">
                {cart.map(item => (
                  <div key={item.id} className="min-w-[240px] md:min-w-0 bg-white p-6 rounded-3xl shadow-sm border border-stone-200 mb-4">
                    <p className="font-serif italic text-lg">{item.name}</p>
                    <p className="text-[9px] font-black uppercase opacity-40 mt-1">{item.color} {item.size ? `• ${item.size}` : ''}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 70% RIGHT PANEL: WORKFLOW */}
            <div className="w-full md:w-[70%] bg-white p-8 md:p-32">
              <div className="flex gap-6 md:gap-10 mb-16 items-center border-b pb-6 max-w-2xl">
                <span className={`text-[12px] font-black uppercase tracking-widest ${checkoutStep === 'contact' ? 'text-black border-b-2 border-black pb-2' : 'text-stone-300'}`}>1. Contact</span>
                <ChevronRight size={16} className="text-stone-300" />
                <span className={`text-[12px] font-black uppercase tracking-widest ${checkoutStep === 'address' ? 'text-black border-b-2 border-black pb-2' : 'text-stone-300'}`}>2. Address</span>
              </div>

              <div className="max-w-2xl space-y-10">
                {checkoutStep === 'contact' ? (
                  <div className="space-y-6">
                    <input type="tel" placeholder="Mobile Number" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} className="w-full p-6 bg-stone-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-1 focus:ring-black" />
                    <input type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-6 bg-stone-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-1 focus:ring-black" />
                    <button onClick={() => setCheckoutStep('address')} className="w-full bg-black text-white py-8 rounded-full font-black uppercase text-xs tracking-[0.4em]">Next: Shipping Details</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-6 bg-stone-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-1 focus:ring-black" />
                    <input type="text" placeholder="House Address / Locality" value={form.house} onChange={e => setForm({...form, house: e.target.value})} className="w-full p-6 bg-stone-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-1 focus:ring-black" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="p-6 bg-stone-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-1 focus:ring-black" />
                      <input type="text" placeholder="Pin" value={form.pin} onChange={e => setForm({...form, pin: e.target.value})} className="p-6 bg-stone-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-1 focus:ring-black" />
                    </div>
                    <button onClick={handleFinalOrder} className="w-full bg-black text-white py-8 rounded-full font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-4 shadow-2xl active:scale-95 transition-transform">
                      Send to Chhaya via WhatsApp <Send size={20}/>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* --- OTHER VIEWS (STORY/SAMPLES/CART) --- */}
        {view === 'story' && (
          <motion.section key="story" className="max-w-3xl mx-auto py-24 px-8 text-center">
            <h2 className="font-serif text-5xl md:text-7xl italic mb-12">Our Story</h2>
            <p className="font-bold text-lg md:text-xl leading-relaxed italic text-stone-600">{BRAND_STORY}</p>
          </motion.section>
        )}

        {view === 'samples' && (
          <motion.section key="samples" className="max-w-7xl mx-auto py-24 px-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-stone-200 h-96 rounded-2xl overflow-hidden shadow-md">
                <img src={`https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=400&i=${i}`} className="w-full h-full object-cover" alt="Catalogue" />
              </div>
            ))}
          </motion.section>
        )}

        {view === 'cart' && (
          <motion.section key="cart" className="max-w-2xl mx-auto py-24 px-8">
            <h2 className="font-serif text-5xl italic mb-12 text-center text-black">Your Cart</h2>
            <div className="space-y-6 mb-16">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b pb-8 border-stone-200">
                  <div className="text-left">
                    <p className="font-serif italic text-2xl">{item.name}</p>
                    <p className="text-[10px] font-black uppercase opacity-40 mt-1">{item.color} {item.size ? `• ${item.size}` : ''}</p>
                  </div>
                  <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-stone-300 hover:text-black transition-colors"><Trash2 size={24}/></button>
                </div>
              ))}
              {cart.length === 0 && <p className="text-center font-serif italic text-stone-400 py-20 text-xl">Bag is currently empty.</p>}
            </div>
            {cart.length > 0 && (
              <button onClick={() => setView('checkout')} className="w-full bg-black text-white py-8 rounded-full font-black uppercase text-xs tracking-[0.5em] shadow-xl">Confirm Bag & Checkout</button>
            )}
          </motion.section>
        )}

      </AnimatePresence>

      {/* --- RESPONSIVE BOTTOM TAB FOOTER --- */}
      <footer style={{ backgroundColor: THEME_COLOR }} className="px-6 md:px-16 py-16 md:py-24 border-t border-stone-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-[10px] font-black uppercase tracking-widest text-black">
             <button onClick={() => setView('story')}>Terms of Service</button>
             <button onClick={() => setView('story')}>Privacy Policy</button>
             <button onClick={() => setView('story')}>Support</button>
          </div>
          <div className="flex gap-10">
             <a href="https://instagram.com/hajelachhaya" target="_blank" className="hover:scale-125 transition-transform"><Instagram size={28} /></a>
             <a href="https://facebook.com/chhaya.hajela" target="_blank" className="hover:scale-125 transition-transform"><Facebook size={28} /></a>
          </div>
        </div>
        <div className="text-center mt-20 text-[9px] font-black uppercase tracking-[0.8em] opacity-40">© 2026 KALAKARI BOUTIQUE • RAJASTHAN • LUCKNOW</div>
      </footer>
    </div>
  );
}