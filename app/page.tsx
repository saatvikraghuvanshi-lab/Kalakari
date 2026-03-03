'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, MessageCircle, X, Trash2, Plus, Palette, Ruler, Facebook, Instagram, User
} from 'lucide-react';

// --- DATA ---
const CATEGORIES = ['Saree', 'Lehenga', 'Kurta Set', 'Dress', 'T-Shirt', 'Shirt', 'Scarf', 'Stole'] as const;
const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
const FABRICS = ['Silk', 'Georgette', 'Organza', 'Chiffon', 'Crepe', 'Chanderi', 'Raw Silk', 'Cotton', 'Linen'];
const EMBROIDERY_STYLES = ['Zardosi', 'Mirror Work', 'Thread Work', 'Gota Patti', 'Aari','Sequin','NONE'];

export default function Page() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('Saree');
  const [fabric, setFabric] = useState(FABRICS[0]);
  const [embroidery, setEmbroidery] = useState(EMBROIDERY_STYLES[0]);
  
  // COLOR STATES
  const [color, setColor] = useState('#D4AF37'); // Fabric Color
  const [embroideryColor, setEmbroideryColor] = useState('#FFFFFF'); // Embroidery Color
  
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [notes, setNotes] = useState('');
  const [measurements, setMeasurements] = useState({ bust: '', waist: '', hips: '', length: '' });
  const [cart, setCart] = useState<any[]>([]);

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    city: '',
    address: '',
    pincode: ''
  });

  const addToCart = () => {
    let sizeInfo = ['Dress', 'T-Shirt', 'Shirt'].includes(category) 
      ? `Size: ${selectedSize}` 
      : ['Scarf', 'Stole'].includes(category) ? `Free Size` 
      : `B:${measurements.bust || '-'} W:${measurements.waist || '-'} H:${measurements.hips || '-'} L:${measurements.length || '-'}`;

    const newItem = { 
      id: Date.now(), 
      category, 
      fabric, 
      embroidery, 
      color: color.toUpperCase(), 
      embroideryColor: embroideryColor.toUpperCase(), 
      sizeOrMeasurements: sizeInfo, 
      notes 
    };
    setCart([...cart, newItem]);
    setIsCartOpen(true);
  };

  const generateWhatsAppLink = () => {
    const phoneNumber = '917991464638';
    let message = `✨ *NEW ORDER - KALAKARI* ✨\n\n`;
    
    message += `👤 *CUSTOMER DETAILS*\n`;
    message += `• Name: ${customerInfo.name || 'Not provided'}\n`;
    message += `• Email: ${customerInfo.email || 'Not provided'}\n`;
    message += `• City: ${customerInfo.city || 'Not provided'}\n`;
    message += `• Pin Code: ${customerInfo.pincode || 'Not provided'}\n`;
    message += `• Address: ${customerInfo.address || 'Not provided'}\n\n`;
    
    message += `🛍️ *ORDER SUMMARY*\n`;
    cart.forEach((item, index) => {
      message += `*ITEM ${index + 1}: ${item.category.toUpperCase()}*\n`;
      message += `• Fabric: ${item.fabric} (${item.color})\n`;
      message += `• Embroidery: ${item.embroidery} (${item.embroideryColor})\n`;
      message += `• ${item.sizeOrMeasurements}\n`;
      if(item.notes) message += `• Note: ${item.notes}\n`;
      message += `--------------------------\n`;
    });
    
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 flex flex-col">
      <nav className="sticky top-0 z-50 bg-[#FAF9F6] border-b border-[#E3D9C6]/30 px-8 py-5 flex justify-between items-center shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-12">
          <span 
            className="font-serif text-2xl tracking-[0.15em] italic uppercase font-black cursor-pointer text-[#2D2926] hover:text-[#B19470] transition-all duration-500" 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          >
            KALAKARI
          </span>
          <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-[#8C867E]">
            <a href="#" className="hover:text-[#2D2926] transition-colors relative group">
              Collections
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#B19470] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#" className="hover:text-[#2D2926] transition-colors relative group">
              Bespoke
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#B19470] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <button onClick={() => setShowStory(true)} className="hover:text-[#2D2926] transition-colors uppercase font-black relative group">
              Our Story
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#B19470] transition-all duration-300 group-hover:w-full"></span>
            </button>
            <a href="mailto:chhayahajela167@gmail.com" className="hover:text-[#2D2926] transition-colors relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#B19470] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="relative p-2 group">
          <ShoppingBag size={22} className="text-[#2D2926] group-hover:text-[#B19470] transition-colors" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#B19470] text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
              {cart.length}
            </span>
          )}
        </button>
      </nav>

      <main className="max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 flex-grow">
        <div className="space-y-8">
          <h1 className="font-serif text-6xl md:text-8xl text-neutral-900 leading-[0.9] tracking-tighter">
            Your Boutique <br/>
            <span className="italic text-neutral-300">Your Way.</span>
            <motion.span 
              animate={{ backgroundColor: color }}
              className="inline-block w-12 h-12 rounded-full ml-4 align-middle border-4 border-white shadow-xl"
            />
          </h1>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://cdn.cosmos.so/f93f0193-712e-47bf-a6f2-e1b3e03ab2c0?format=jpeg" className="rounded-3xl h-[400px] w-full object-cover shadow-2xl" alt="Ethnic 1"/>
            <img src="https://cdn.cosmos.so/63b79183-79ee-408e-b4c4-4d9be715dd2f?format=jpeg" className="rounded-3xl h-[400px] w-full object-cover mt-12 shadow-2xl" alt="Ethnic 2"/>
          </div>
        </div>

        <div className="bg-[#FAF9F6] rounded-[3rem] p-8 md:p-12 border border-[#E3D9C6]/30 shadow-2xl space-y-10 h-fit">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8C867E] mb-5 block">Select Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setCategory(cat)} 
                  className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    category === cat 
                    ? 'bg-[#2D2926] text-white shadow-lg' 
                    : 'bg-white text-[#8C867E] border border-[#E3D9C6]/20 hover:bg-[#F3F0E9]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* FABRIC SECTION */}
            <section className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8C867E] block">1. Fabric & Color</label>
              <select 
                className="w-full bg-white border border-[#E3D9C6]/40 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-[#B19470] text-[#2D2926] shadow-sm" 
                value={fabric} 
                onChange={(e)=>setFabric(e.target.value)}
              >
                {FABRICS.map(f => <option key={f}>{f}</option>)}
              </select>
              <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-[#E3D9C6]/20">
                <input 
                  type="color" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer appearance-none bg-transparent [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none"
                />
                <code className="text-[10px] font-black text-[#2D2926]">{color.toUpperCase()}</code>
              </div>
            </section>
            
            {/* EMBROIDERY SECTION */}
            <section className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8C867E] block">2. Embroidery & Shade</label>
              <select 
                className="w-full bg-white border border-[#E3D9C6]/40 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-[#B19470] text-[#2D2926] shadow-sm" 
                value={embroidery} 
                onChange={(e)=>setEmbroidery(e.target.value)}
              >
                {EMBROIDERY_STYLES.map(s => <option key={s}>{s}</option>)}
              </select>
              <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-[#E3D9C6]/20">
                <input 
                  type="color" 
                  value={embroideryColor} 
                  onChange={(e) => setEmbroideryColor(e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer appearance-none bg-transparent [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none"
                />
                <code className="text-[10px] font-black text-[#2D2926]">{embroideryColor.toUpperCase()}</code>
              </div>
            </section>
          </div>

          <section className="pt-8 border-t border-[#E3D9C6]/30">
            <div className="flex justify-between items-center mb-5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8C867E] flex items-center gap-2">
                <Ruler size={14} className="text-[#B19470]"/> Sizing
              </label>
              <button onClick={() => setShowSizeChart(!showSizeChart)} className="text-[9px] font-black uppercase underline tracking-widest text-[#B19470] hover:text-[#2D2926]">
                Size Guide
              </button>
            </div>

            {['Dress', 'T-Shirt', 'Shirt'].includes(category) ? (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {STANDARD_SIZES.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} className={`min-w-[48px] h-12 rounded-xl border-2 text-[10px] font-black transition-all ${selectedSize === s ? 'bg-[#2D2926] text-white border-[#2D2926] shadow-md' : 'bg-white text-neutral-300 border-[#E3D9C6]/20'}`}>{s}</button>
                ))}
              </div>
            ) : !['Scarf', 'Stole'].includes(category) ? (
              <div className="grid grid-cols-4 gap-3">
                {['bust', 'waist', 'hips', 'length'].map(m => (
                  <div key={m}>
                    <span className="text-[8px] font-black uppercase text-[#8C867E] block mb-1.5 text-center">{m}</span>
                    <input type="number" placeholder="0" className="w-full bg-white border border-[#E3D9C6]/30 rounded-xl p-3 text-sm font-bold text-center outline-none focus:border-[#B19470] shadow-sm" onChange={(e) => setMeasurements({...measurements, [m as keyof typeof measurements]: e.target.value})} />
                  </div>
                ))}
              </div>
            ) : <p className="text-[10px] font-black uppercase text-neutral-300 italic">Free Size</p>}
          </section>

          <button 
            onClick={addToCart} 
            className="w-full bg-[#2D2926] text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:bg-[#B19470] transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300"/> 
            Add to Bag
          </button>
        </div>
      </main>

      <footer className="bg-[#FAF9F6] border-t border-[#E3D9C6]/30 py-12 px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="font-serif text-xl italic tracking-[0.2em] font-black uppercase text-[#2D2926]">
            KALAKARI
          </span>
          <div className="flex gap-6">
            <a href="https://www.instagram.com/hajelachhaya" target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-[#E3D9C6]/20 rounded-full text-[#8C867E] hover:bg-[#2D2926] hover:text-white transition-all shadow-sm">
              <Instagram size={20}/>
            </a>
            <a href="https://www.facebook.com/share/1CcqEsncpY/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-[#E3D9C6]/20 rounded-full text-[#8C867E] hover:bg-[#2D2926] hover:text-white transition-all shadow-sm">
              <Facebook size={20}/>
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-[#E3D9C6]/10 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#8C867E]/60">
            © 2026 Kalakari Studio • Handcrafted Excellence
          </p>
        </div>
      </footer>

      <AnimatePresence>
        {showStory && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowStory(false)} className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100]" />
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed inset-0 m-auto w-[90%] max-w-2xl h-fit bg-white z-[110] p-10 md:p-16 rounded-[3rem] shadow-2xl overflow-y-auto max-h-[85vh]">
              <button onClick={() => setShowStory(false)} className="absolute top-8 right-8 text-neutral-300 hover:text-black hover:rotate-90 transition-all">
                <X size={28}/>
              </button>
              <div className="space-y-8">
                <h2 className="font-serif text-4xl italic text-neutral-900 leading-tight">Curated by Heritage. <br/><span className="text-neutral-300">Crafted for You.</span></h2>
                <div className="space-y-6 text-neutral-600 leading-[1.8] text-sm md:text-base">
                  <p>At <strong className="text-black uppercase tracking-widest text-xs">Kalakari</strong>, we bridge the gap between the master weaver’s courtyard and the modern woman’s wardrobe.</p>
                  <p>We invite you to be the <strong>architect of your own elegance.</strong> Rooted in Rajasthan, refined for the world.</p>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] p-10 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-10 border-b border-neutral-100 pb-6">
                <h2 className="font-serif text-2xl italic tracking-widest uppercase">Bag ({cart.length})</h2>
                <button onClick={() => setIsCartOpen(false)}><X size={28}/></button>
              </div>
              <div className="flex-grow overflow-y-auto space-y-8">
                {cart.length > 0 && (
                  <div className="bg-[#FAF9F6] p-6 rounded-3xl space-y-4 border border-[#E3D9C6]/30">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[#8C867E] flex items-center gap-2 mb-2"><User size={14}/> Delivery Details</h3>
                    <input type="text" placeholder="Full Name" className="w-full bg-white border border-[#E3D9C6]/20 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#B19470]" value={customerInfo.name} onChange={(e)=>setCustomerInfo({...customerInfo, name: e.target.value})} />
                    <textarea placeholder="Complete Shipping Address" className="w-full bg-white border border-[#E3D9C6]/20 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#B19470] min-h-[80px]" value={customerInfo.address} onChange={(e)=>setCustomerInfo({...customerInfo, address: e.target.value})} />
                  </div>
                )}
                {cart.length === 0 ? <p className="text-center text-[10px] font-black uppercase text-neutral-300 tracking-[0.2em] py-20">Your bag is empty</p> : 
                  cart.map((item: any) => (
                    <div key={item.id} className="border-b border-neutral-50 pb-6">
                      <div className="flex justify-between items-start">
                        <h4 className="font-black text-sm uppercase">{item.category}</h4>
                        <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-neutral-300 hover:text-red-500"><Trash2 size={16}/></button>
                      </div>
                      <p className="text-[11px] font-bold text-neutral-400 uppercase">{item.fabric} ({item.color}) • {item.embroidery} ({item.embroideryColor})</p>
                      <p className="text-[11px] font-mono mt-1 text-black font-black">{item.sizeOrMeasurements}</p>
                    </div>
                  ))
                }
              </div>
              {cart.length > 0 && (
                <button onClick={() => { if(!customerInfo.name || !customerInfo.address) { alert("Please fill details!"); return; } window.open(generateWhatsAppLink(), '_blank'); }} className="w-full bg-[#2D2926] text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] mt-8 flex items-center justify-center gap-3 shadow-xl">
                  <MessageCircle size={18}/> Place via WhatsApp
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}