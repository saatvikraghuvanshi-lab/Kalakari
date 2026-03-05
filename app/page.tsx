'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, User, Heart, X, Instagram, Facebook, 
  MessageCircle, Ruler, ShieldCheck, FileText, Headphones, 
  Trash2, ArrowLeft, ChevronRight, Droplets, Palette, Scissors
} from 'lucide-react';

// --- 1. TYPES & INTERFACES (Fixes terminal 'never' errors) ---
interface Measurements {
  bust: string; waist: string; hips: string; length: string;
}

interface CustomConfig {
  fabric: string;
  fabricColor: string;
  embroideryColor: string;
  neckStyle: string;
  measurements: Measurements;
}

interface CartItem {
  id: number;
  name: string;
  category: string;
  fabric: string;
  color: string;
  price: string;
  image: string;
  type: 'bespoke' | 'ready';
  config?: CustomConfig;
}

// --- 2. CONSTANTS & DATA ---
const NAV_COLOR = "#E9E5CE";    // Top Tab Shade
const FOOTER_COLOR = "#F7F2D1"; // Bottom Tab Shade

const FABRIC_COLORS = [
  { name: 'Champagne', hex: '#F7E7CE' },
  { name: 'Midnight', hex: '#191970' },
  { name: 'Emerald', hex: '#50C878' },
  { name: 'Ruby', hex: '#E0115F' },
  { name: 'Ivory', hex: '#FFFFF0' }
];

const THREAD_COLORS = [
  { name: 'Antique Gold', hex: '#CFB53B' },
  { name: 'Silver Zari', hex: '#C0C0C0' },
  { name: 'Rose Gold', hex: '#B76E79' },
  { name: 'Tone-on-Tone', hex: 'transparent' }
];

const TEAM = [
  { name: "Chhaya Hajela", role: "Owner", phone: "917991464638" },
  { name: "Design Team", role: "Design Manager", phone: "919589120141" },
  { name: "Tech Support", role: "Core Developer", phone: "919301661150" }
];

// --- 3. MAIN COMPONENT ---
export default function KalakariBoutique() {
  const [view, setView] = useState<'home' | 'samples' | 'bespoke' | 'checkout'>('home');
  const [modal, setModal] = useState<'T&C' | 'PrivacyPolicy' | 'CustomerSupport' | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Bespoke Config State
  const [config, setConfig] = useState<CustomConfig>({
    fabric: 'Raw Silk',
    fabricColor: '#F7E7CE',
    embroideryColor: '#CFB53B',
    neckStyle: 'Round Neck',
    measurements: { bust: '', waist: '', hips: '', length: '' }
  });

  // --- HELPERS ---
  const addToCart = () => {
    const newItem: CartItem = {
      id: Date.now(),
      name: `Bespoke ${config.fabric} Ensemble`,
      category: "Bespoke",
      fabric: config.fabric,
      color: config.fabricColor,
      price: "Price on Request",
      image: "https://media.samyakk.in/pub/media/catalog/product/b/e/beige-and-gold-dual-tone-tissue-designer-saree-with-thread-work-and-unstitched-blouse-gh1568-a.jpg",
      type: 'bespoke',
      config: config
    };
    setCart([...cart, newItem]);
    setView('checkout');
  };

  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2926] selection:bg-[#B19470] selection:text-white">
      
      {/* TOP TAB NAVIGATION */}
      <nav 
        style={{ backgroundColor: NAV_COLOR }} 
        className="sticky top-0 z-[100] px-6 md:px-12 py-5 flex justify-between items-center border-b border-stone-200 shadow-sm"
      >
        <div className="flex items-baseline gap-10">
          <span onClick={() => setView('home')} className="font-serif text-2xl font-black italic tracking-tighter uppercase cursor-pointer">KALAKARI</span>
          <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600">
            <button onClick={() => setView('samples')} className="hover:text-black transition-colors">Collections</button>
            <button onClick={() => setView('bespoke')} className="hover:text-black transition-colors">Bespoke Studio</button>
            <button className="hover:text-black transition-colors">Our Story</button>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <User size={18} className="text-stone-600 cursor-pointer hover:text-black" />
          <Heart size={18} className="text-stone-600 cursor-pointer hover:text-black" />
          <div className="relative cursor-pointer" onClick={() => setView('checkout')}>
            <ShoppingBag size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        
        {/* --- HOME VIEW --- */}
        {view === 'home' && (
          <motion.section key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
            <div className="text-center mb-16">
              <h1 className="font-serif text-[55px] md:text-[90px] italic leading-tight mb-4">Artistry in <br/>Every Stitch.</h1>
              <p className="font-serif text-[11px] uppercase tracking-[0.5em] text-stone-400">Handcrafted in Lucknow, Delivered Globally.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl mb-16 items-end">
              <div className="rounded-[3rem] overflow-hidden shadow-2xl h-[65vh]">
                <img src="https://media.samyakk.in/pub/media/catalog/product/b/e/beige-and-gold-dual-tone-tissue-designer-saree-with-thread-work-and-unstitched-blouse-gh1568-a.jpg" className="w-full h-full object-cover" alt="Lucknowi Handwork" />
              </div>
              <div className="rounded-[3rem] overflow-hidden shadow-xl h-[50vh]">
                <img src="https://media.samyakk.in/pub/media/catalog/product/h/o/hot-pink-mirror-embroidered-silk-designer-saree-with-contrast-v-neck-blouse-jf1678-a.jpg" className="w-full h-full object-cover" alt="Designer Saree" />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('bespoke')}
              className="bg-black text-white px-24 py-6 rounded-full text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-[#B19470] transition-all"
            >
              Shop Now
            </motion.button>
          </motion.section>
        )}

        {/* --- BESPOKE STUDIO VIEW --- */}
        {view === 'bespoke' && (
          <motion.section key="bespoke" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-20">
            <div className="space-y-12">
              <header>
                <h2 className="font-serif text-5xl italic">Bespoke Studio</h2>
                <p className="text-stone-400 text-[10px] uppercase tracking-widest mt-2 flex items-center gap-2">
                  <Scissors size={14}/> Custom construction from Lucknow
                </p>
              </header>

              {/* Fabric Picker */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase flex items-center gap-2 tracking-widest text-stone-500">
                  <Droplets size={14} className="text-[#B19470]"/> Base Fabric Shade
                </label>
                <div className="flex flex-wrap gap-4">
                  {FABRIC_COLORS.map(c => (
                    <button 
                      key={c.hex} 
                      onClick={() => setConfig({...config, fabricColor: c.hex})} 
                      className={`w-10 h-10 rounded-full border-2 transition-transform ${config.fabricColor === c.hex ? 'border-black scale-110' : 'border-transparent'}`} 
                      style={{ backgroundColor: c.hex }} 
                    />
                  ))}
                </div>
              </div>

              {/* Embroidery Picker */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase flex items-center gap-2 tracking-widest text-stone-500">
                  <Palette size={14} className="text-[#B19470]"/> Embroidery Zari
                </label>
                <div className="flex flex-wrap gap-4">
                  {THREAD_COLORS.map(c => (
                    <button 
                      key={c.name} 
                      onClick={() => setConfig({...config, embroideryColor: c.hex})} 
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-transform ${config.embroideryColor === c.hex ? 'border-black scale-110' : 'border-stone-200'}`} 
                      style={{ backgroundColor: c.hex === 'transparent' ? '#fff' : c.hex }}
                    >
                      {c.hex === 'transparent' && <span className="text-[7px] font-bold">T-O-T</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Measurements */}
              <div className="bg-stone-50 p-8 rounded-[2.5rem] grid grid-cols-2 gap-6">
                {Object.keys(config.measurements).map((m) => (
                  <div key={m}>
                    <label className="text-[9px] font-bold uppercase text-stone-400 block mb-2">{m}</label>
                    <input 
                      type="text" 
                      placeholder="inches" 
                      className="w-full bg-white p-4 rounded-xl outline-none text-sm border border-stone-100 focus:border-black"
                      onChange={(e) => setConfig({...config, measurements: {...config.measurements, [m as keyof Measurements]: e.target.value}})}
                    />
                  </div>
                ))}
              </div>

              <button 
                onClick={addToCart}
                className="w-full bg-black text-white py-7 rounded-full font-black uppercase text-[11px] tracking-[0.4em] shadow-xl hover:bg-[#B19470] transition-colors"
              >
                Add to Selection
              </button>
            </div>

            {/* Live Preview Column */}
            <div className="relative">
              <div className="sticky top-32">
                <div className="rounded-[3.5rem] overflow-hidden shadow-2xl h-[75vh] bg-stone-100 relative">
                  <div className="absolute inset-0 opacity-25 pointer-events-none transition-colors duration-500" style={{ backgroundColor: config.fabricColor }} />
                  <img src="https://media.samyakk.in/pub/media/catalog/product/b/e/beige-and-gold-dual-tone-tissue-designer-saree-with-thread-work-and-unstitched-blouse-gh1568-a.jpg" className="w-full h-full object-cover mix-blend-multiply" alt="Bespoke Preview" />
                </div>
                <div className="mt-6 flex justify-between items-center px-6">
                  <div className="flex gap-2">
                    <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: config.fabricColor }} />
                    <div className="w-4 h-4 rounded-full shadow-sm border border-stone-200" style={{ backgroundColor: config.embroideryColor }} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-300">Lucknow Studio Preview</span>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* --- 30/70 CHECKOUT VIEW --- */}
        {view === 'checkout' && (
          <motion.section key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col md:flex-row">
            {/* 30% LEFT: SUMMARY */}
            <div className="w-full md:w-[30%] bg-stone-50/80 p-10 md:p-14 border-r border-stone-200">
              <button onClick={() => setView('home')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 mb-12 hover:text-black">
                <ArrowLeft size={14} /> Studio
              </button>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-300 mb-8">Your Selection</h3>
              <div className="space-y-6">
                {cart.map(item => (
                  <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm flex gap-5 items-center group relative">
                    <img src={item.image} className="w-16 h-16 object-cover rounded-xl" alt="Cart Item" />
                    <div>
                      <p className="font-serif italic text-lg">{item.category}</p>
                      <p className="text-[9px] uppercase text-stone-400 tracking-tighter">{item.fabric} • Custom Fit</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-500 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {cart.length === 0 && <p className="italic text-stone-400 text-sm">Your bag is empty.</p>}
              </div>
            </div>

            {/* 70% RIGHT: FORMS */}
            <div className="w-full md:w-[70%] bg-white p-10 md:p-32 flex flex-col items-center">
              <div className="w-full max-w-xl">
                <div className="flex gap-6 mb-16 items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] border-b-2 border-black pb-1">Contact</span>
                  <ChevronRight size={14} className="text-stone-200" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-200">Shipping</span>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-5">
                    <input type="text" placeholder="Full Name" className="w-full bg-stone-50 p-6 rounded-2xl outline-none text-sm focus:ring-1 focus:ring-black transition-all" />
                    <input type="email" placeholder="Email Address" className="w-full bg-stone-50 p-6 rounded-2xl outline-none text-sm focus:ring-1 focus:ring-black transition-all" />
                    <div className="flex gap-3">
                      <div className="bg-stone-50 p-6 rounded-2xl text-sm font-bold text-stone-400">+91</div>
                      <input type="tel" placeholder="Mobile" className="flex-1 bg-stone-50 p-6 rounded-2xl outline-none text-sm focus:ring-1 focus:ring-black transition-all" />
                    </div>
                    <textarea placeholder="Complete Delivery Address" className="w-full bg-stone-50 p-6 rounded-2xl outline-none text-sm h-32 resize-none focus:ring-1 focus:ring-black transition-all" />
                  </div>

                  <button 
                    onClick={() => window.open(`https://wa.me/917991464638?text=Hello, I want to confirm my bespoke order for: ${cart.map(i => i.name).join(', ')}`, '_blank')}
                    className="w-full bg-[#25D366] text-white py-7 rounded-2xl font-black uppercase text-[11px] tracking-[0.4em] shadow-2xl flex justify-center items-center gap-3 hover:bg-black transition-all"
                  >
                    <MessageCircle size={18} /> Order via WhatsApp
                  </button>
                  <p className="text-center text-[9px] uppercase tracking-widest text-stone-300 font-bold">Secure Global Delivery from Lucknow Studio</p>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* BOTTOM TAB FOOTER */}
      <footer 
        style={{ backgroundColor: FOOTER_COLOR }} 
        className="mt-20 px-10 py-16 border-t border-stone-200/50"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          
          <div className="flex flex-wrap justify-center gap-10 text-[9px] font-black uppercase tracking-[0.3em] text-stone-500">
            <button onClick={() => setModal('T&C')} className="hover:text-black transition-colors">Terms & Conditions</button>
            <button onClick={() => setModal('PrivacyPolicy')} className="hover:text-black transition-colors">Privacy Policy</button>
            <button onClick={() => setModal('CustomerSupport')} className="hover:text-[#B19470] transition-colors">Customer Support</button>
          </div>
          
          <div className="flex gap-8">
            <a href="https://instagram.com/hajelachhaya" target="_blank" rel="noreferrer" className="text-stone-400 hover:text-black transition-colors"><Instagram size={20} /></a>
            <a href="https://facebook.com/chhaya.hajela" target="_blank" rel="noreferrer" className="text-stone-400 hover:text-blue-600 transition-colors"><Facebook size={20} /></a>
          </div>
        </div>
        <div className="text-center mt-12 text-[8px] font-bold uppercase tracking-[0.5em] text-stone-300">
          © 2026 Kalakari Boutique Lucknow
        </div>
      </footer>

      {/* UNIFIED MODAL SYSTEM */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(null)} className="absolute inset-0 bg-black/40 backdrop-blur-md" />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative bg-white w-full max-w-2xl p-12 rounded-[3.5rem] shadow-2xl overflow-y-auto max-h-[85vh]">
              <X className="absolute top-8 right-8 cursor-pointer text-stone-300 hover:text-black" onClick={() => setModal(null)} />
              
              {modal === 'T&C' && (
                <div className="prose prose-stone">
                  <h2 className="font-serif text-3xl italic mb-6 flex items-center gap-3"><FileText className="text-[#B19470]"/> Terms & Conditions</h2>
                  <div className="space-y-4 text-xs text-stone-500 leading-relaxed uppercase tracking-wider font-bold">
                    <p>1. Bespoke garments are handcrafted to order. Once production begins, orders cannot be cancelled.</p>
                    <p>2. Customers must provide accurate measurements. We are not liable for fitment issues from incorrect data.</p>
                    <p>3. Colors may vary slightly due to hand-dyeing and screen calibrations.</p>
                  </div>
                </div>
              )}

              {modal === 'PrivacyPolicy' && (
                <div className="prose prose-stone">
                  <h2 className="font-serif text-3xl italic mb-6 flex items-center gap-3"><ShieldCheck className="text-[#B19470]"/> Privacy Policy</h2>
                  <p className="text-xs text-stone-500 leading-relaxed uppercase tracking-wider font-bold">
                    We only store your measurements and contact details for order fulfillment. Your data is encrypted and never shared with third parties, ensuring your privacy is as exclusive as our designs.
                  </p>
                </div>
              )}

              {modal === 'CustomerSupport' && (
                <div className="space-y-6">
                  <h2 className="font-serif text-3xl italic mb-8 flex items-center gap-3"><Headphones size={28} className="text-[#B19470]"/> Customer Support</h2>
                  <div className="grid gap-4">
                    {TEAM.map((member, idx) => (
                      <div 
                        key={idx} 
                        className="group bg-stone-50 p-6 rounded-2xl flex justify-between items-center hover:bg-black transition-all cursor-pointer"
                        onClick={() => window.open(`https://wa.me/${member.phone}`, '_blank')}
                      >
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#B19470] mb-1">{member.role}</p>
                          <p className="font-serif text-xl italic group-hover:text-white transition-colors">{member.name}</p>
                        </div>
                        <MessageCircle size={20} className="text-stone-300 group-hover:text-white" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}