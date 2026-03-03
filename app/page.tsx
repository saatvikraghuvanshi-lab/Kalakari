'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, MessageCircle, X, Trash2, Plus, Palette, Ruler, Facebook, Instagram, User, Phone, Mail, MapPin
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

  // UPDATED CUSTOMER INFO STATE
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    number: '',
    gmail: '',
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
    message += `• Name: ${customerInfo.name || 'N/A'}\n`;
    message += `• Contact: ${customerInfo.number || 'N/A'}\n`;
    message += `• Email: ${customerInfo.gmail || 'N/A'}\n`;
    message += `• City: ${customerInfo.city || 'N/A'}\n`;
    message += `• Pincode: ${customerInfo.pincode || 'N/A'}\n`;
    message += `• Address: ${customerInfo.address || 'N/A'}\n\n`;
    
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
          <span className="font-serif text-2xl tracking-[0.15em] italic uppercase font-black cursor-pointer text-[#2D2926]">KALAKARI</span>
          <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-[#8C867E]">
            <a href="#" className="hover:text-[#2D2926]">Collections</a>
            <a href="#" className="hover:text-[#2D2926]">Bespoke</a>
            <button onClick={() => setShowStory(true)} className="uppercase font-black">Our Story</button>
            <a href="mailto:chhayahajela167@gmail.com">Contact</a>
          </div>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="relative p-2 group">
          <ShoppingBag size={22} className="text-[#2D2926] group-hover:text-[#B19470]" />
          {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-[#B19470] text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{cart.length}</span>}
        </button>
      </nav>

      <main className="max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 flex-grow">
        <div className="space-y-8">
          <h1 className="font-serif text-6xl md:text-8xl text-neutral-900 leading-[0.9] tracking-tighter">
            Your Boutique <br/> <span className="italic text-neutral-300">Your Way.</span>
            <motion.span animate={{ backgroundColor: color }} className="inline-block w-12 h-12 rounded-full ml-4 align-middle border-4 border-white shadow-xl" />
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
                <button key={cat} onClick={() => setCategory(cat)} className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest ${category === cat ? 'bg-[#2D2926] text-white' : 'bg-white text-[#8C867E] border border-[#E3D9C6]/20'}`}>{cat}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8C867E] block">1. Fabric & Color</label>
              <select className="w-full bg-white border border-[#E3D9C6]/40 rounded-2xl px-5 py-4 text-sm font-bold outline-none" value={fabric} onChange={(e)=>setFabric(e.target.value)}>
                {FABRICS.map(f => <option key={f}>{f}</option>)}
              </select>
              <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-[#E3D9C6]/20">
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer appearance-none bg-transparent" />
                <code className="text-[10px] font-black uppercase">{color}</code>
              </div>
            </section>
            
            <section className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8C867E] block">2. Embroidery & Shade</label>
              <select className="w-full bg-white border border-[#E3D9C6]/40 rounded-2xl px-5 py-4 text-sm font-bold outline-none" value={embroidery} onChange={(e)=>setEmbroidery(e.target.value)}>
                {EMBROIDERY_STYLES.map(s => <option key={s}>{s}</option>)}
              </select>
              <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-[#E3D9C6]/20">
                <input type="color" value={embroideryColor} onChange={(e) => setEmbroideryColor(e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer appearance-none bg-transparent" />
                <code className="text-[10px] font-black uppercase">{embroideryColor}</code>
              </div>
            </section>
          </div>

          <section className="pt-8 border-t border-[#E3D9C6]/30">
            <div className="flex justify-between items-center mb-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#8C867E]">
              <span className="flex items-center gap-2"><Ruler size={14}/> Sizing</span>
              <button onClick={() => setShowSizeChart(!showSizeChart)} className="underline">Size Guide</button>
            </div>
            {['Dress', 'T-Shirt', 'Shirt'].includes(category) ? (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {STANDARD_SIZES.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} className={`min-w-[48px] h-12 rounded-xl border-2 text-[10px] font-black ${selectedSize === s ? 'bg-[#2D2926] text-white' : 'bg-white text-neutral-300 border-[#E3D9C6]/20'}`}>{s}</button>
                ))}
              </div>
            ) : !['Scarf', 'Stole'].includes(category) ? (
              <div className="grid grid-cols-4 gap-3">
                {['bust', 'waist', 'hips', 'length'].map(m => (
                  <div key={m}>
                    <span className="text-[8px] font-black uppercase text-[#8C867E] block mb-1 text-center">{m}</span>
                    <input type="number" placeholder="0" className="w-full bg-white border border-[#E3D9C6]/30 rounded-xl p-3 text-sm text-center font-bold outline-none" onChange={(e) => setMeasurements({...measurements, [m as keyof typeof measurements]: e.target.value})} />
                  </div>
                ))}
              </div>
            ) : <p className="text-[10px] font-black italic text-neutral-300 uppercase">Free Size</p>}
          </section>

          <button onClick={addToCart} className="w-full bg-[#2D2926] text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:bg-[#B19470] transition-all flex items-center justify-center gap-3">
            <Plus size={18}/> Add to Bag
          </button>
        </div>
      </main>

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] p-10 flex flex-col shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h2 className="font-serif text-2xl italic uppercase">Bag ({cart.length})</h2>
                <button onClick={() => setIsCartOpen(false)}><X size={28}/></button>
              </div>

              <div className="flex-grow overflow-y-auto space-y-6 pr-2">
                {cart.length > 0 && (
                  <div className="bg-[#FAF9F6] p-6 rounded-3xl space-y-3 border border-[#E3D9C6]/30">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[#8C867E] flex items-center gap-2 mb-2"><User size={14}/> Delivery Details</h3>
                    <input type="text" placeholder="Full Name" className="w-full bg-white border border-[#E3D9C6]/20 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#B19470]" value={customerInfo.name} onChange={(e)=>setCustomerInfo({...customerInfo, name: e.target.value})} />
                    <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Phone Number" className="w-full bg-white border border-[#E3D9C6]/20 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#B19470]" value={customerInfo.number} onChange={(e)=>setCustomerInfo({...customerInfo, number: e.target.value})} />
                        <input type="email" placeholder="Gmail Address" className="w-full bg-white border border-[#E3D9C6]/20 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#B19470]" value={customerInfo.gmail} onChange={(e)=>setCustomerInfo({...customerInfo, gmail: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="City" className="w-full bg-white border border-[#E3D9C6]/20 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#B19470]" value={customerInfo.city} onChange={(e)=>setCustomerInfo({...customerInfo, city: e.target.value})} />
                        <input type="text" placeholder="Pincode" className="w-full bg-white border border-[#E3D9C6]/20 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#B19470]" value={customerInfo.pincode} onChange={(e)=>setCustomerInfo({...customerInfo, pincode: e.target.value})} />
                    </div>
                    <textarea placeholder="Complete Shipping Address" className="w-full bg-white border border-[#E3D9C6]/20 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#B19470] min-h-[60px]" value={customerInfo.address} onChange={(e)=>setCustomerInfo({...customerInfo, address: e.target.value})} />
                  </div>
                )}
                
                {cart.map((item: any) => (
                  <div key={item.id} className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-black text-sm uppercase">{item.category}</h4>
                      <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-neutral-300 hover:text-red-500"><Trash2 size={16}/></button>
                    </div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase">{item.fabric} ({item.color}) • {item.embroidery} ({item.embroideryColor})</p>
                    <p className="text-[10px] mt-1 font-black">{item.sizeOrMeasurements}</p>
                  </div>
                ))}
              </div>

              {cart.length > 0 && (
                <button 
                  onClick={() => { 
                    if(!customerInfo.name || !customerInfo.address || !customerInfo.number) { alert("Please fill Name, Number and Address!"); return; } 
                    window.open(generateWhatsAppLink(), '_blank'); 
                  }} 
                  className="w-full bg-[#2D2926] text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] mt-8 flex items-center justify-center gap-3 shadow-xl"
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