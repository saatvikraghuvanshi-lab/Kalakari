'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, MessageCircle, X, Trash2, Plus, Scissors, Sparkles, Palette, Ruler
} from 'lucide-react';

// --- YOUR ORIGINAL DATA (RESTORED) ---
const CATEGORIES = ['Saree', 'Lehenga', 'Kurta Set', 'Dress', 'T-Shirt', 'Shirt', 'Scarf', 'Stole'] as const;
const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
const FABRICS = ['Silk', 'Georgette', 'Organza', 'Chiffon', 'Crepe', 'Chanderi', 'Raw Silk', 'Cotton', 'Linen'];
const EMBROIDERY_STYLES = ['Zardosi', 'Mirror Work', 'Thread Work', 'Gota Patti', 'Aari','Sequin'];

const BOUTIQUE_COLORS = [
  { name: 'Champagne', hex: '#F7E7CE', category: 'Metallic' },
  { name: 'Gold', hex: '#D4AF37', category: 'Metallic' },
  { name: 'Crimson', hex: '#9E1B32', category: 'Jewel' },
  { name: 'Midnight Blue', hex: '#191970', category: 'Jewel' },
  { name: 'Emerald', hex: '#046307', category: 'Jewel' },
  { name: 'Ivory', hex: '#FFFFF0', category: 'Pastel' },
  { name: 'Dusty Rose', hex: '#DCAE96', category: 'Pastel' },
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
  // UI States
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Form States
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('Saree');
  const [fabric, setFabric] = useState(FABRICS[0]);
  const [embroidery, setEmbroidery] = useState(EMBROIDERY_STYLES[0]);
  const [color, setColor] = useState('');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [notes, setNotes] = useState('');
  const [measurements, setMeasurements] = useState({ bust: '', waist: '', hips: '', length: '' });

  // --- CART LOGIC ---
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = () => {
    let sizeInfo = '';
    if (['Dress', 'T-Shirt', 'Shirt'].includes(category)) {
      sizeInfo = `Size: ${selectedSize}`;
    } else if (['Scarf', 'Stole'].includes(category)) {
      sizeInfo = `Free Size`;
    } else {
      sizeInfo = `B:${measurements.bust || '-'} W:${measurements.waist || '-'} H:${measurements.hips || '-'} L:${measurements.length || '-'}`;
    }

    const newItem: CartItem = {
      id: Date.now(),
      category,
      fabric,
      embroidery,
      color: color || 'As per sample',
      sizeOrMeasurements: sizeInfo,
      notes
    };

    setCart([...cart, newItem]);
    setIsCartOpen(true);
    // Reset inputs for the next item
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
      message += `*ITEM ${index + 1}: ${item.category.toUpperCase()}*\n`;
      message += `• Fabric: ${item.fabric}\n`;
      message += `• Embroidery: ${item.embroidery}\n`;
      message += `• Color: ${item.color}\n`;
      message += `• ${item.sizeOrMeasurements}\n`;
      if (item.notes) message += `• Note: ${item.notes}\n`;
      message += `--------------------------\n`;
    });
    message += `\n_Please confirm availability for these ${cart.length} items!_`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100 px-6 py-4 flex justify-between items-center">
        <span className="font-serif text-2xl tracking-widest text-neutral-900 italic uppercase">KALAKARI</span>
        <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-neutral-100 rounded-full">
          <ShoppingBag size={22} />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cart.length}
            </span>
          )}
        </button>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* LEFT: Visuals */}
        <div className="space-y-8">
            <h1 className="font-serif text-5xl md:text-6xl text-neutral-900 leading-tight">
              Your Boutique <br/><span className="italic text-neutral-400">Your Way.</span>
            </h1>
            <div className="grid grid-cols-2 gap-4">
               <img src="https://cdn.cosmos.so/f93f0193-712e-47bf-a6f2-e1b3e03ab2c0?format=jpeg" className="rounded-2xl h-80 w-full object-cover shadow-lg" alt="Ethnic"/>
               <img src="https://cdn.cosmos.so/63b79183-79ee-408e-b4c4-4d9be715dd2f?format=jpeg" className="rounded-2xl h-80 w-full object-cover mt-8 shadow-lg" alt="Lehenga"/>
            </div>
        </div>

        {/* RIGHT: Form */}
        <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-neutral-100 shadow-xl">
          <div className="space-y-6">
            {/* Category */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${category === cat ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-500'}`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Fabric/Embroidery */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">Fabric</label>
                <select value={fabric} onChange={(e) => setFabric(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none">
                  {FABRICS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">Embroidery</label>
                <select value={embroidery} onChange={(e) => setEmbroidery(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none">
                  {EMBROIDERY_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2 text-left flex items-center gap-2"><Palette size={12}/> Select Color</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {BOUTIQUE_COLORS.map((c) => (
                  <button key={c.name} onClick={() => setColor(c.name)} title={c.name}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c.name ? 'border-black' : 'border-transparent'}`}
                    style={{ backgroundColor: c.hex }} />
                ))}
              </div>
              <input type="text" placeholder="Or specify a custom shade..." value={color} onChange={(e) => setColor(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black" />
            </div>

            {/* Size Logic */}
            {['Dress', 'T-Shirt', 'Shirt'].includes(category) ? (
              <div className="flex gap-2">
                {STANDARD_SIZES.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} className={`w-10 h-10 rounded-full border text-[10px] font-bold ${selectedSize === s ? 'bg-black text-white' : 'bg-white text-neutral-400'}`}>{s}</button>
                ))}
              </div>
            ) : !['Scarf', 'Stole'].includes(category) && (
              <div className="grid grid-cols-4 gap-2">
                {['bust', 'waist', 'hips', 'length'].map(m => (
                  <input key={m} type="number" placeholder={m.toUpperCase()} className="bg-neutral-50 border border-neutral-200 rounded-lg p-2 text-xs text-center outline-none focus:border-black"
                    onChange={(e) => setMeasurements({...measurements, [m as keyof typeof measurements]: e.target.value})} />
                ))}
              </div>
            )}

            {/* Notes */}
            <textarea placeholder="Any special requests for this item?" value={notes} onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm min-h-[80px] outline-none focus:border-black" />

            <button onClick={addToCart} className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg">
              <Plus size={16} /> Add to Cart
            </button>
          </div>
        </div>
      </main>

      {/* CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl p-8 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-serif text-2xl uppercase tracking-widest">Your Cart ({cart.length})</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full"><X size={24}/></button>
              </div>

              <div className="flex-grow overflow-y-auto space-y-6 pr-2">
                {cart.length === 0 ? (
                  <div className="text-center py-20 text-neutral-400 uppercase text-xs tracking-[0.2em]">Cart is empty</div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-start border-b border-neutral-100 pb-6">
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm uppercase">{item.category}</h4>
                        <p className="text-[11px] text-neutral-500 uppercase">{item.fabric} • {item.embroidery}</p>
                        <p className="text-[11px] text-neutral-500 uppercase">Color: {item.color}</p>
                        <p className="text-[11px] text-neutral-500">{item.sizeOrMeasurements}</p>
                        {item.notes && <p className="text-[11px] italic text-neutral-400">"{item.notes}"</p>}
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-neutral-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-8 border-t border-neutral-100">
                  <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full bg-black text-white py-5 rounded-2xl font-bold tracking-widest uppercase text-sm">
                    <MessageCircle size={18} /> Order {cart.length} Items via WhatsApp
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