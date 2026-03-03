'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, MessageCircle, X, Trash2, Plus, Palette, Ruler, ChevronRight, Facebook, Instagram
} from 'lucide-react';

// --- DATA ---
const CATEGORIES = ['Saree', 'Lehenga', 'Kurta Set', 'Dress', 'T-Shirt', 'Shirt', 'Scarf', 'Stole'] as const;
const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
const FABRICS = ['Silk', 'Georgette', 'Organza', 'Chiffon', 'Crepe', 'Chanderi', 'Raw Silk', 'Cotton', 'Linen'];
const EMBROIDERY_STYLES = ['Zardosi', 'Mirror Work', 'Thread Work', 'Gota Patti', 'Aari','Sequin','NONE'];

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

export default function Page() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showStory, setShowStory] = useState(false); // Story Modal State
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('Saree');
  const [fabric, setFabric] = useState(FABRICS[0]);
  const [embroidery, setEmbroidery] = useState(EMBROIDERY_STYLES[0]);
  const [color, setColor] = useState('');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [notes, setNotes] = useState('');
  const [measurements, setMeasurements] = useState({ bust: '', waist: '', hips: '', length: '' });
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = () => {
    let sizeInfo = ['Dress', 'T-Shirt', 'Shirt'].includes(category) 
      ? `Size: ${selectedSize}` 
      : ['Scarf', 'Stole'].includes(category) ? `Free Size` 
      : `B:${measurements.bust || '-'} W:${measurements.waist || '-'} H:${measurements.hips || '-'} L:${measurements.length || '-'}`;

    const newItem = { id: Date.now(), category, fabric, embroidery, color: color || 'As per sample', sizeOrMeasurements: sizeInfo, notes };
    setCart([...cart, newItem]);
    setIsCartOpen(true);
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
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 flex flex-col">
      {/* HEADER */}
      <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 px-8 py-5 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-12">
          <span className="font-serif text-2xl tracking-widest italic uppercase font-black cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>KALAKARI</span>
          <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-widest text-neutral-500">
            <a href="#" className="hover:text-black transition-colors">Collections</a>
            <a href="#" className="hover:text-black transition-colors">Bespoke</a>
            <button onClick={() => setShowStory(true)} className="hover:text-black transition-colors uppercase font-black">Our Story</button>
            <a href="mailto:hello@kalakari.studio" className="hover:text-black transition-colors">Contact</a>
          </div>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="relative p-2">
          <ShoppingBag size={22} className="text-black" />
          {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{cart.length}</span>}
        </button>
      </nav>

      <main className="max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 flex-grow">
        <div className="space-y-8">
          <h1 className="font-serif text-6xl md:text-8xl text-neutral-900 leading-[0.9] tracking-tighter">Your Boutique <br/><span className="italic text-neutral-300">Your Way.</span></h1>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://cdn.cosmos.so/f93f0193-712e-47bf-a6f2-e1b3e03ab2c0?format=jpeg" className="rounded-3xl h-[400px] w-full object-cover shadow-2xl" alt="Ethnic 1"/>
            <img src="https://cdn.cosmos.so/63b79183-79ee-408e-b4c4-4d9be715dd2f?format=jpeg" className="rounded-3xl h-[400px] w-full object-cover mt-12 shadow-2xl" alt="Ethnic 2"/>
          </div>
        </div>

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

          <section>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-5 block flex items-center gap-2"><Palette size={14}/> Color Palette</label>
            <div className="max-h-[200px] overflow-y-auto pr-2 space-y-6 custom-scrollbar mb-6 border-b border-neutral-50 pb-4">
              {['Metallic', 'Jewel', 'Earth', 'Pastel'].map(group => (
                <div key={group}>
                  <p className="text-[9px] font-black uppercase text-neutral-300 mb-3 tracking-widest">{group}</p>
                  <div className="flex flex-wrap gap-3">
                    {BOUTIQUE_COLORS.filter(c => c.category === group).map((c) => (
                      <button key={c.name} onClick={() => setColor(c.name)} className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${color === c.name ? 'border-black ring-2 ring-neutral-100 ring-offset-2' : 'border-neutral-100'}`} style={{ backgroundColor: c.hex }} title={c.name} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <input type="text" placeholder="Custom shade name..." className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-black" value={color} onChange={(e)=>setColor(e.target.value)} />
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

            <AnimatePresence>
              {showSizeChart && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-6">
                  <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <table className="w-full text-left text-[10px] font-bold">
                      <thead className="text-neutral-400 uppercase tracking-widest border-b border-neutral-200">
                        <tr><th className="py-2">Size</th><th>Bust</th><th>Waist</th><th>Hips</th></tr>
                      </thead>
                      <tbody className="text-neutral-600 uppercase">
                        <tr className="border-b border-neutral-100"><td className="py-2 text-black">XS</td><td>32</td><td>26</td><td>34</td></tr>
                        <tr className="border-b border-neutral-100"><td className="py-2 text-black">S</td><td>34</td><td>28</td><td>36</td></tr>
                        <tr className="border-b border-neutral-100"><td className="py-2 text-black">M</td><td>36</td><td>30</td><td>38</td></tr>
                        <tr className="border-b border-neutral-100"><td className="py-2 text-black">L</td><td>38</td><td>32</td><td>40</td></tr>
                        <tr><td className="py-2 text-black">XL</td><td>40</td><td>34</td><td>42</td></tr>
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <section>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-3 block">Special Requests</label>
            <textarea placeholder="e.g. Extra tassels, specific length..." className="w-full bg-neutral-50 border border-neutral-200 rounded-3xl px-6 py-4 text-sm font-bold min-h-[100px] outline-none focus:border-black" value={notes} onChange={(e)=>setNotes(e.target.value)} />
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
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-neutral-400">
            <a href="#" className="hover:text-black transition-colors">Shipping</a>
            <a href="#" className="hover:text-black transition-colors">Privacy</a>
            <a href="#" className="hover:text-black transition-colors">Terms</a>
          </div>
          <div className="flex gap-6">
            <a href="https://www.instagram.com/hajelachhaya?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="p-3 bg-neutral-100 rounded-full hover:bg-black hover:text-white transition-all">
    <Instagram size={20}/>
  </a>
            <a href="https://facebook.com/kalakari" target="_blank" rel="noopener noreferrer" className="p-3 bg-neutral-100 rounded-full hover:bg-black hover:text-white transition-all"><Facebook size={20}/></a>
          </div>
        </div>
        <p className="text-center text-[9px] font-bold text-neutral-300 mt-8 tracking-[0.3em] uppercase">© 2026 KALAKARI STUDIO. Jaipur, India.</p>
      </footer>

      {/* MODALS: STORY & CART */}
      <AnimatePresence>
        {showStory && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowStory(false)} className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100]" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed inset-0 m-auto w-[90%] max-w-2xl h-fit bg-white z-[110] p-12 rounded-[3rem] shadow-2xl overflow-y-auto max-h-[80vh]">
              <button onClick={() => setShowStory(false)} className="absolute top-8 right-8 text-neutral-400 hover:text-black"><X size={24}/></button>
              <h2 className="font-serif text-4xl italic mb-6">Our Story</h2>
              <div className="space-y-4 text-neutral-600 leading-relaxed font-medium">
                <p>Born in the heart of Jaipur, <strong>Kalakari</strong> is a tribute to the timeless artistry of Indian textiles. We believe that every garment tells a story—one of heritage, hand-pressed dyes, and the rhythmic song of the loom.</p>
                <p>Our studio merges traditional craftsmanship like Zardosi and Aari work with modern silhouettes, allowing you to co-create pieces that aren't just worn, but cherished.</p>
                <p className="italic font-serif text-xl pt-4">Artistry in every stitch, for the modern soul.</p>
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
                <button onClick={() => setIsCartOpen(false)} className="hover:rotate-90 transition-transform duration-300"><X size={28}/></button>
              </div>
              <div className="flex-grow overflow-y-auto space-y-8 pr-2 custom-scrollbar">
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
                <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] mt-8 flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-transform">
                  <MessageCircle size={18}/> Place via WhatsApp
                </a>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}