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
  
  // COLOR STATE - Initialized to a classic Gold
  const [color, setColor] = useState('#D4AF37');
  
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
      message += `• Fabric: ${item.fabric}\n`;
      message += `• Embroidery: ${item.embroidery}\n`;
      message += `• Color/Hex: ${item.color}\n`;
      message += `• ${item.sizeOrMeasurements}\n`;
      if(item.notes) message += `• Note: ${item.notes}\n`;
      message += `--------------------------\n`;
    });
    
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 flex flex-col">
      {/* HEADER: Pearlescent Ivory Theme */}
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
            <button 
              onClick={() => setShowStory(true)} 
              className="hover:text-[#2D2926] transition-colors uppercase font-black relative group"
            >
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
        {/* LEFT SIDE: TITLES & IMAGES */}
        <div className="space-y-8">
          <h1 className="font-serif text-6xl md:text-8xl text-neutral-900 leading-[0.9] tracking-tighter">
            Your Boutique <br/>
            <span className="italic text-neutral-300">Your Way.</span>
            {/* LIVE PREVIEW COLOR DOT */}
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

        {/* RIGHT SIDE: CUSTOMIZER */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-neutral-100 shadow-2xl space-y-10">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-5 block">Select Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)} className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}>{cat}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <section>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-3 block">Fabric</label>
              <select className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-4 text-sm font-bold appearance-none outline-none focus:border-black" value={fabric} onChange={(e)=>setFabric(e.target.value)}>
                {FABRICS.map(f => <option key={f}>{f}</option>)}
              </select>
            </section>
            <section>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-3 block">Embroidery</label>
              <select className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-4 text-sm font-bold appearance-none outline-none focus:border-black" value={embroidery} onChange={(e)=>setEmbroidery(e.target.value)}>
                {EMBROIDERY_STYLES.map(s => <option key={s}>{s}</option>)}
              </select>
            </section>
          </div>

          {/* COLOR WHEEL INTEGRATION */}
          <section>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-5 block flex items-center gap-2">
              <Palette size={14}/> Custom Shade Selector
            </label>
            
            <div className="flex flex-col md:flex-row items-center gap-6 bg-neutral-50 p-6 rounded-[2rem] border border-neutral-100">
              <div className="relative">
                <input 
                  type="color" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-xl cursor-pointer appearance-none bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none"
                />
                <div className="absolute inset-0 rounded-full border-2 border-black/5 pointer-events-none"></div>
              </div>

              <div className="flex-grow space-y-3 w-full">
                <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Hex Value</p>
                <code className="block bg-white px-4 py-3 rounded-xl border border-neutral-100 font-mono text-sm font-black text-black text-center">
                  {color.toUpperCase()}
                </code>
                <input 
                  type="text" 
                  placeholder="Or shade name (e.g. Blush Pink)" 
                  className="w-full bg-white border border-neutral-100 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-black" 
                  value={color} 
                  onChange={(e)=>setColor(e.target.value)} 
                />
              </div>
            </div>
          </section>

          <section className="pt-8 border-t border-neutral-100">
            <div className="flex justify-between items-center mb-5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-2"><Ruler size={14}/> Sizing</label>
              <button onClick={() => setShowSizeChart(!showSizeChart)} className="text-[9px] font-black uppercase underline tracking-widest text-neutral-400 hover:text-black">Size Guide</button>
            </div>

            {['Dress', 'T-Shirt', 'Shirt'].includes(category) ? (
              <div className="flex gap-2">
                {STANDARD_SIZES.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} className={`w-12 h-12 rounded-xl border-2 text-[10px] font-black transition-all ${selectedSize === s ? 'bg-black text-white border-black shadow-md' : 'bg-white text-neutral-300 border-neutral-100'}`}>{s}</button>
                ))}
              </div>
            ) : !['Scarf', 'Stole'].includes(category) ? (
              <div className="grid grid-cols-4 gap-3">
                {['bust', 'waist', 'hips', 'length'].map(m => (
                  <div key={m}>
                    <span className="text-[8px] font-black uppercase text-neutral-400 block mb-1.5 text-center">{m}</span>
                    <input type="number" placeholder="0" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-sm font-bold text-center outline-none focus:border-black" onChange={(e) => setMeasurements({...measurements, [m]: e.target.value})} />
                  </div>
                ))}
              </div>
            ) : <p className="text-[10px] font-black uppercase text-neutral-300 italic font-black">Free Size</p>}
          </section>

          <button onClick={addToCart} className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
            <Plus size={18}/> Add to Bag
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-neutral-200 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="font-serif text-xl italic tracking-widest font-black uppercase">KALAKARI</span>
          <div className="flex gap-6">
            <a href="https://www.instagram.com/hajelachhaya" target="_blank" rel="noopener noreferrer" className="p-3 bg-neutral-100 rounded-full hover:bg-black hover:text-white transition-all"><Instagram size={20}/></a>
            <a href="https://www.facebook.com/share/1CcqEsncpY/" target="_blank" rel="noopener noreferrer" className="p-3 bg-neutral-100 rounded-full hover:bg-black hover:text-white transition-all"><Facebook size={20}/></a>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <AnimatePresence>
        {showStory && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowStory(false)} 
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100]" 
            />
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 50, scale: 0.95 }} 
              className="fixed inset-0 m-auto w-[90%] max-w-2xl h-fit bg-white z-[110] p-10 md:p-16 rounded-[3rem] shadow-2xl overflow-y-auto max-h-[85vh]"
            >
              <button onClick={() => setShowStory(false)} className="absolute top-8 right-8 text-neutral-300 hover:text-black hover:rotate-90 transition-all duration-300">
                <X size={28}/>
              </button>
              
              <div className="space-y-8 text-center md:text-left">
                <h2 className="font-serif text-4xl md:text-5xl italic tracking-tight text-neutral-900 leading-tight">
                  Curated by Heritage. <br/>
                  <span className="text-neutral-300">Crafted for You.</span>
                </h2>
                
                <div className="space-y-6 text-neutral-600 leading-[1.8] font-medium text-sm md:text-base">
                  <p>
                    At <strong className="text-black font-black uppercase tracking-widest text-xs">Kalakari</strong>, we bridge the gap between the master weaver’s courtyard and the modern woman’s wardrobe. Our studio is a sanctuary where Zardosi, Aari, and Gota Patti are reimagined for a new era.
                  </p>
                  <p>
                    We don't just dress you; we invite you to be the <strong>architect of your own elegance.</strong> This is bespoke artistry, rooted in the soil of Rajasthan and refined for the world stage.
                  </p>
                  
                  <div className="pt-8 border-t border-neutral-100 flex flex-col items-center md:items-start gap-4">
                     <p className="font-serif text-xl italic text-neutral-400">Artistry in every stitch, for the modern soul.</p>
                     <button 
                       onClick={() => setShowStory(false)}
                       className="mt-4 bg-black text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all"
                     >
                       Explore the Studio
                     </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] p-10 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-10 border-b border-neutral-100 pb-6">
                <h2 className="font-serif text-2xl italic tracking-widest uppercase">Bag ({cart.length})</h2>
                <button onClick={() => setIsCartOpen(false)}><X size={28}/></button>
              </div>

              <div className="flex-grow overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                {cart.length > 0 && (
                  <div className="bg-neutral-50 p-6 rounded-3xl space-y-4 mb-8">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2 mb-2"><User size={14}/> Delivery Details</h3>
                    <input type="text" placeholder="Full Name" className="w-full bg-white border border-neutral-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-black" value={customerInfo.name} onChange={(e)=>setCustomerInfo({...customerInfo, name: e.target.value})} />
                    <input type="email" placeholder="Gmail Address" className="w-full bg-white border border-neutral-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-black" value={customerInfo.email} onChange={(e)=>setCustomerInfo({...customerInfo, email: e.target.value})} />
                    <div className="grid grid-cols-2 gap-3">
                       <input type="text" placeholder="City" className="w-full bg-white border border-neutral-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-black" value={customerInfo.city} onChange={(e)=>setCustomerInfo({...customerInfo, city: e.target.value})} />
                       <input type="text" placeholder="Pin Code" className="w-full bg-white border border-neutral-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-black" value={customerInfo.pincode} onChange={(e)=>setCustomerInfo({...customerInfo, pincode: e.target.value})} />
                    </div>
                    <textarea placeholder="Complete Shipping Address" className="w-full bg-white border border-neutral-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-black min-h-[80px]" value={customerInfo.address} onChange={(e)=>setCustomerInfo({...customerInfo, address: e.target.value})} />
                  </div>
                )}

                {cart.length === 0 ? (
                  <p className="text-center text-[10px] font-black uppercase text-neutral-300 tracking-[0.2em] py-20">Your bag is empty</p>
                ) : (
                  cart.map((item: any) => (
                    <div key={item.id} className="border-b border-neutral-50 pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-black text-sm uppercase tracking-tighter">{item.category}</h4>
                        <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-neutral-300 hover:text-red-500"><Trash2 size={16}/></button>
                      </div>
                      <p className="text-[11px] font-bold text-neutral-400 uppercase leading-relaxed">{item.fabric} • {item.embroidery} • {item.color}</p>
                      <p className="text-[11px] font-mono mt-1 text-black font-black uppercase">{item.sizeOrMeasurements}</p>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <button 
                  onClick={() => {
                    if(!customerInfo.name || !customerInfo.address) {
                      alert("Please fill in your Name and Address first!");
                      return;
                    }
                    window.open(generateWhatsAppLink(), '_blank');
                  }} 
                  className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] mt-8 flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-transform"
                >
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