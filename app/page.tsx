'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, MessageCircle, X, Trash2, Plus, Scissors, Sparkles, Palette, Ruler, ChevronRight
} from 'lucide-react';

// --- DATA ---
const CATEGORIES = ['Saree', 'Lehenga', 'Kurta Set', 'Dress', 'T-Shirt', 'Shirt', 'Scarf', 'Stole'] as const;
const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
const FABRICS = ['Silk', 'Georgette', 'Organza', 'Chiffon', 'Crepe', 'Chanderi', 'Raw Silk', 'Cotton', 'Linen'];
const EMBROIDERY_STYLES = ['Zardosi', 'Mirror Work', 'Thread Work', 'Gota Patti', 'Aari','Sequin'];

const BOUTIQUE_COLORS = [
  { name: 'Champagne', hex: '#F7E7CE', category: 'Metallic' },
  { name: 'Gold', hex: '#D4AF37', category: 'Metallic' },
  { name: 'Antique Gold', hex: '#B8860B', category: 'Metallic' },
  { name: 'Copper', hex: '#B87333', category: 'Metallic' },
  { name: 'Silver', hex: '#C0C0C0', category: 'Metallic' },
  { name: 'Crimson', hex: '#9E1B32', category: 'Jewel' },
  { name: 'Ruby Wine', hex: '#72010F', category: 'Jewel' },
  { name: 'Midnight Blue', hex: '#191970', category: 'Jewel' },
  { name: 'Royal Indigo', hex: '#3F00FF', category: 'Jewel' },
  { name: 'Emerald', hex: '#046307', category: 'Jewel' },
  { name: 'Forest Green', hex: '#013220', category: 'Jewel' },
  { name: 'Peacock Teal', hex: '#004953', category: 'Jewel' },
  { name: 'Deep Plum', hex: '#4B0082', category: 'Jewel' },
  { name: 'Mulberry', hex: '#770737', category: 'Jewel' },
  { name: 'Mustard', hex: '#E1AD01', category: 'Earth' },
  { name: 'Ochre', hex: '#CC7722', category: 'Earth' },
  { name: 'Burnt Orange', hex: '#CC5500', category: 'Earth' },
  { name: 'Rust', hex: '#8B4513', category: 'Earth' },
  { name: 'Terracotta', hex: '#E2725B', category: 'Earth' },
  { name: 'Coffee', hex: '#6F4E37', category: 'Earth' },
  { name: 'Ivory', hex: '#FFFFF0', category: 'Pastel' },
  { name: 'Powder Blue', hex: '#B0E0E6', category: 'Pastel' },
  { name: 'Dusty Rose', hex: '#DCAE96', category: 'Pastel' },
  { name: 'Mauve', hex: '#E0B0FF', category: 'Pastel' },
  { name: 'Sage Green', hex: '#BCCAAD', category: 'Pastel' },
  { name: 'Mint', hex: '#F5FFFA', category: 'Pastel' },
  { name: 'Lilac', hex: '#C8A2C8', category: 'Pastel' },
  { name: 'Peach Puff', hex: '#FFDAB9', category: 'Pastel' },
];

interface CartItem {
  id: number;
  category: string;
  fabric: string;
  embroidery: string;
  color: string;
  sizeOrMeasurements: string;
  notes: string;
}

export default function Page() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('Saree');
  const [fabric, setFabric] = useState(FABRICS[0]);
  const [embroidery, setEmbroidery] = useState(EMBROIDERY_STYLES[0]);
  const [color, setColor] = useState('');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [notes, setNotes] = useState('');
  const [measurements, setMeasurements] = useState({ bust: '', waist: '', hips: '', length: '' });
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = () => {
    let sizeInfo = ['Dress', 'T-Shirt', 'Shirt'].includes(category) 
      ? `Size: ${selectedSize}` 
      : ['Scarf', 'Stole'].includes(category) ? `Free Size` 
      : `B:${measurements.bust || '-'} W:${measurements.waist || '-'} H:${measurements.hips || '-'} L:${measurements.length || '-'}`;

    const newItem: CartItem = {
      id: Date.now(),
      category, fabric, embroidery,
      color: color || 'As per sample',
      sizeOrMeasurements: sizeInfo,
      notes
    };

    setCart([...cart, newItem]);
    setIsCartOpen(true);
    setNotes('');
    setColor('');
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const generateWhatsAppLink = () => {
    const phoneNumber = '917991464638';
    let message = `✨ *NEW MULTI-ORDER - KALAKARI* ✨\n\n`;
    cart.forEach((item, index) => {
      message += `*ITEM ${index + 1}: ${item.category.toUpperCase()}*\n• Fabric: ${item.fabric}\n• Embroidery: ${item.embroidery}\n• Color: ${item.color}\n• ${item.sizeOrMeasurements}\n${item.notes ? `• Note: ${item.notes}\n` : ''}--------------------------\n`;
    });
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <span className="font-serif text-2xl tracking-widest text-neutral-900 italic uppercase">KALAKARI</span>
        <button onClick={() => setIsCartOpen(true)} className="relative p-2">
          <ShoppingBag size={24} className="text-neutral-900" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{cart.length}</span>
          )}
        </button>
      </nav>

      <main className="max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
            <h1 className="font-serif text-5xl md:text-7xl text-neutral-900 leading-tight">Your Boutique <br/><span className="italic text-neutral-400">Your Way.</span></h1>
            <div className="grid grid-cols-2 gap-4">
               <img src="https://cdn.cosmos.so/f93f0193-712e-47bf-a6f2-e1b3e03ab2c0?format=jpeg" className="rounded-2xl h-80 w-full object-cover shadow-lg" alt="Ethnic"/>
               <img src="https://cdn.cosmos.so/63b79183-79ee-408e-b4c4-4d9be715dd2f?format=jpeg" className="rounded-2xl h-80 w-full object-cover mt-8 shadow-lg" alt="Lehenga"/>
            </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-neutral-100 shadow-2xl">
          <div className="space-y-10">
            {/* Category */}
            <div>
              <label className="text-xs font-black uppercase tracking-[0.2em] text-neutral-900 mb-4 block">Select Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric/Embroidery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section>
                <label className="text-xs font-black uppercase tracking-[0.2em] text-neutral-900 mb-3 block">Fabric</label>
                <select value={fabric} onChange={(e) => setFabric(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-4 text-sm font-bold text-neutral-900 outline-none focus:border-black appearance-none">
                  {FABRICS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </section>
              <section>
                <label className="text-xs font-black uppercase tracking-[0.2em] text-neutral-900 mb-3 block">Embroidery</label>
                <select value={embroidery} onChange={(e) => setEmbroidery(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-4 text-sm font-bold text-neutral-900 outline-none focus:border-black appearance-none">
                  {EMBROIDERY_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </section>
            </div>

            {/* Color Palette */}
            <section>
              <label className="text-xs font-black uppercase tracking-[0.2em] text-neutral-900 mb-4 block flex items-center gap-2"><Palette size={16}/> Color Palette</label>
              <div className="max-h-[250px] overflow-y-auto pr-2 space-y-6 custom-scrollbar mb-4 border-b border-neutral-100 pb-4">
                {['Metallic', 'Jewel', 'Earth', 'Pastel'].map(group => (
                  <div key={group}>
                    <p className="text-[10px] font-black uppercase text-neutral-500 mb-2">{group}</p>
                    <div className="flex flex-wrap gap-3">
                      {BOUTIQUE_COLORS.filter(c => c.category === group).map((c) => (
                        <button key={c.name} onClick={() => setColor(c.name)} title={c.name}
                          className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${color === c.name ? 'border-black ring-2 ring-neutral-100 ring-offset-2' : 'border-neutral-200'}`}
                          style={{ backgroundColor: c.hex }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <input type="text" placeholder="Custom shade name..." value={color} onChange={(e) => setColor(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-4 text-sm font-bold text-neutral-900 outline-none focus:border-black" />
            </section>

            {/* Sizing */}
            <section className="pt-6 border-t border-neutral-100">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-neutral-900 mb-4 block flex items-center gap-2"><Ruler size={16}/> Sizing</label>
              {['Dress', 'T-Shirt', 'Shirt'].includes(category) ? (
                <div className="flex gap-2">
                  {STANDARD_SIZES.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)} className={`w-11 h-11 rounded-xl border-2 text-[10px] font-black transition-all ${selectedSize === s ? 'bg-black text-white border-black shadow-md' : 'bg-white text-neutral-400 border-neutral-100 hover:border-neutral-300'}`}>{s}</button>
                  ))}
                </div>
              ) : !['Scarf', 'Stole'].includes(category) ? (
                <div className="grid grid-cols-4 gap-3">
                  {['bust', 'waist', 'hips', 'length'].map(m => (
                    <div key={m}>
                      <span className="text-[9px] font-black uppercase text-neutral-500 block mb-1 text-center">{m}</span>
                      <input type="number" placeholder="0" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-sm font-bold text-center text-neutral-900 outline-none focus:border-black"
                        onChange={(e) => setMeasurements({...measurements, [m as keyof typeof measurements]: e.target.value})} />
                    </div>
                  ))}
                </div>
              ) : <p className="text-xs font-bold text-neutral-400 italic font-black">Free Size</p>}
            </section>

            <section>
              <label className="text-xs font-black uppercase tracking-[0.2em] text-neutral-900 mb-3 block">Special Requests</label>
              <textarea placeholder="Add any notes here..." value={notes} onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-4 text-sm font-bold text-neutral-900 min-h-[100px] outline-none focus:border-black" />
            </section>

            <button onClick={addToCart} className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-neutral-800 transition-all shadow-2xl">
              <Plus size={20} /> Add to Bag
            </button>
          </div>
        </div>
      </main>

      {/* CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl p-8 flex flex-col">
              <div className="flex justify-between items-center mb-8 border-b border-neutral-100 pb-6">
                <h2 className="font-serif text-2xl uppercase italic tracking-widest text-neutral-900">Your Bag ({cart.length})</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-900"><X size={24}/></button>
              </div>
              <div className="flex-grow overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="text-center py-20 uppercase text-[10px] font-black text-neutral-400 tracking-[0.2em]">Bag is empty</div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-start border-b border-neutral-100 pb-6 text-neutral-900">
                      <div className="space-y-1">
                        <h4 className="font-black text-sm uppercase">{item.category}</h4>
                        <p className="text-[11px] font-bold uppercase">{item.fabric} • {item.embroidery} • {item.color}</p>
                        <p className="text-[11px] font-mono text-neutral-600">{item.sizeOrMeasurements}</p>
                        {item.notes && <p className="text-[11px] italic text-neutral-500">"{item.notes}"</p>}
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-neutral-300 hover:text-red-600 transition-colors"><Trash2 size={18}/></button>
                    </div>
                  ))
                )}
              </div>
              {cart.length > 0 && (
                <div className="pt-8">
                  <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full bg-black text-white py-5 rounded-2xl font-black tracking-[0.2em] text-xs shadow-xl transition-transform active:scale-95">
                    <MessageCircle size={18} /> Place Order via WhatsApp <ChevronRight size={16}/>
                  </a>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}