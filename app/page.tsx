'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, 
  ChevronRight, 
  Ruler, 
  Palette, 
  Scissors, 
  MessageCircle,
  Menu,
  X,
  Instagram,
  Facebook,
  Sparkles
} from 'lucide-react';

const CATEGORIES = ['Saree', 'Lehenga', 'Kurta Set'] as const;
const FABRICS = ['Silk', 'Georgette', 'Organza', 'Chiffon', 'Crepe', 'Chanderi', 'Raw Silk', 'Cotton', 'Linen',];
const EMBROIDERY_STYLES = ['Zardosi', 'Mirror Work', 'Thread Work', 'Gota Patti', 'Aari','Sequin'];
type Category = typeof CATEGORIES[number];
const BOUTIQUE_COLORS = [
  // METALLICS & LUXE
  { name: 'Champagne', hex: '#F7E7CE', category: 'Metallic' },
  { name: 'Gold', hex: '#D4AF37', category: 'Metallic' },
  { name: 'Antique Gold', hex: '#B8860B', category: 'Metallic' },
  { name: 'Copper', hex: '#B87333', category: 'Metallic' },
  { name: 'Silver', hex: '#C0C0C0', category: 'Metallic' },
  
  // JEWEL TONES (Deep & Rich)
  { name: 'Crimson', hex: '#9E1B32', category: 'Jewel' },
  { name: 'Ruby Wine', hex: '#72010F', category: 'Jewel' },
  { name: 'Midnight Blue', hex: '#191970', category: 'Jewel' },
  { name: 'Royal Indigo', hex: '#3F00FF', category: 'Jewel' },
  { name: 'Emerald', hex: '#046307', category: 'Jewel' },
  { name: 'Forest Green', hex: '#013220', category: 'Jewel' },
  { name: 'Peacock Teal', hex: '#004953', category: 'Jewel' },
  { name: 'Deep Plum', hex: '#4B0082', category: 'Jewel' },
  { name: 'Mulberry', hex: '#770737', category: 'Jewel' },

  // EARTH, SPICE & SUNSET
  { name: 'Mustard', hex: '#E1AD01', category: 'Earth' },
  { name: 'Ochre', hex: '#CC7722', category: 'Earth' },
  { name: 'Burnt Orange', hex: '#CC5500', category: 'Earth' },
  { name: 'Rust', hex: '#8B4513', category: 'Earth' },
  { name: 'Terracotta', hex: '#E2725B', category: 'Earth' },
  { name: 'Coffee', hex: '#6F4E37', category: 'Earth' },

  // PASTELS & SOFT TONES
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
  const [category, setCategory] = useState<Category>('Saree');
  const [fabric, setFabric] = useState(FABRICS[0]);
  const [embroidery, setEmbroidery] = useState(EMBROIDERY_STYLES[0]);
  const [color, setColor] = useState('');
  const [measurements, setMeasurements] = useState({
    bust: '',
    waist: '',
    hips: '',
    length: ''
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false); 
  const handleMeasurementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMeasurements(prev => ({ ...prev, [name]: value }));
  };

 const generateWhatsAppLink = () => {
    const phoneNumber = '917991464638';
    
    const message = `✨ NEW CUSTOM ORDER - KALAKARI ✨

Item: ${category}
Fabric: ${fabric}
Embroidery: ${embroidery}
Color: ${color || 'Not specified'}

📏 MEASUREMENTS (Inches):
• Bust: ${measurements.bust || '-'}
• Waist: ${measurements.waist || '-'}
• Hips: ${measurements.hips || '-'}
• Length: ${measurements.length || '-'}

Please let me know the next steps for payment and timeline!`;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white scroll-smooth">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-serif text-2xl tracking-widest text-neutral-900 italic uppercase">
            KALAKARI <span className="text-sm not-italic tracking-normal ml-1">by Chhaya</span>
          </span>
        </div>
        
        <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest font-medium">
          <a href="#collections" className="text-neutral-600 hover:text-black transition-colors">Collections</a>
          <a href="#bespoke" className="text-neutral-600 hover:text-black transition-colors">Bespoke</a>
          <a href="#story" className="text-neutral-600 hover:text-black transition-colors">Our Story</a>
          <a href="#contact" className="text-neutral-600 hover:text-black transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-900">
            <ShoppingBag size={20} />
          </button>
          <button 
            className="md:hidden p-2 text-neutral-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-8 flex flex-col gap-6 text-xl font-serif italic text-neutral-900"
          >
            <a href="#" onClick={() => setIsMenuOpen(false)}>Collections</a>
            <a href="#" onClick={() => setIsMenuOpen(false)}>Bespoke</a>
            <a href="#" onClick={() => setIsMenuOpen(false)}>Our Story</a>
            <a href="#" onClick={() => setIsMenuOpen(false)}>Contact</a>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Column: Visuals & Intro */}
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-6 text-neutral-900">
              Crafting <span className="italic text-neutral-500">Elegance</span> <br />
              For Your Moments.
            </h1>
            <p className="text-neutral-600 text-lg max-w-md leading-relaxed">
              Experience the luxury of bespoke ethnic wear. From hand-picked fabrics to intricate embroidery, we bring your vision to life.
            </p>
          </motion.div>

          <div id="collections" className="grid grid-cols-2 gap-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100"
            >
              <img 
  src="https://cdn.cosmos.so/f93f0193-712e-47bf-a6f2-e1b3e03ab2c0?format=jpeg" 
  alt="Saree Detail" 
  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
/>

            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 mt-8"
            >
             <img 
  src="https://cdn.cosmos.so/63b79183-79ee-408e-b4c4-4d9be715dd2f?format=jpeg" 
  alt="Lehnga Detail" 
  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
/> 
            </motion.div>
          </div>
        </div>

        {/* Right Column: Customization Form */}
        <motion.div id="bespoke"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white rounded-[2rem] p-8 md:p-12 border border-neutral-100 shadow-2xl shadow-neutral-200/50"
        >
          <div className="mb-10">
            <h2 className="font-serif text-3xl mb-2 text-neutral-900">Bespoke Order</h2>
            <p className="text-neutral-500 text-sm uppercase tracking-widest">Customize your masterpiece</p>
          </div>

          <div className="space-y-8">
            {/* Category Selection */}
            <section>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-900 mb-4">
                <ShoppingBag size={14} /> Select Category
              </label>
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-6 py-2 rounded-full text-sm transition-all duration-300 ${
                      category === cat 
                        ? 'bg-black text-white shadow-lg' 
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-900 mb-3">
                  <Scissors size={14} /> Fabric Type
                </label>
                <select 
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none appearance-none cursor-pointer focus:border-black"
                >
                  {FABRICS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </section>

              <section>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-900 mb-3">
                  <Sparkles size={14} /> Embroidery Style
                </label>
                <select 
                  value={embroidery}
                  onChange={(e) => setEmbroidery(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none appearance-none cursor-pointer focus:border-black"
                >
                  {EMBROIDERY_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </section>
              <section className="mt-6">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-900 mb-4">
            <Palette size={14} /> Color Palette
          </label>
          
          <div className="space-y-4 mb-6 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar border-b border-neutral-100 pb-4">
            {['Metallic', 'Jewel', 'Earth', 'Pastel'].map((cat) => (
              <div key={cat}>
                <span className="text-[9px] uppercase tracking-tighter text-neutral-400 mb-2 block font-bold">{cat} Shades</span>
                <div className="flex flex-wrap gap-2">
                  {BOUTIQUE_COLORS.filter(c => c.category === cat).map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setColor(c.name)}
                      title={c.name}
                      className={`w-7 h-7 rounded-full border transition-all duration-300 hover:scale-125 ${
                        color === c.name 
                          ? 'border-black ring-2 ring-offset-2 ring-neutral-200 scale-110 shadow-sm' 
                          : 'border-neutral-200'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <input 
              type="text"
              placeholder="Selected Color or Custom Shade..."
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none focus:border-black transition-all"
            />
            {color && (
              <button 
                onClick={() => setColor('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 hover:text-black uppercase font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </section>
            </div>
            
            <section>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-900 mb-3">
                <Palette size={14} /> Color Preference
              </label>
              <input 
                type="text"
                placeholder="e.g. Midnight Blue, Dusty Rose..."
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-black"
              />
            </section>

            {/* Measurements */}
            <section className="pt-4 border-t border-neutral-100">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-900 mb-6">
                <Ruler size={14} /> Measurements (Inches)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Bust', name: 'bust' },
                  { label: 'Waist', name: 'waist' },
                  { label: 'Hips', name: 'hips' },
                  { label: 'Length', name: 'length' }
                ].map((m) => (
                  <div key={m.name}>
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-neutral-500 block mb-1">{m.label}</span>
                    <input 
                      type="number"
                      name={m.name}
                      placeholder="0.0"
                      value={measurements[m.name as keyof typeof measurements]}
                      onChange={handleMeasurementChange}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 outline-none focus:border-black"
                    />
                  </div>
                ))}
              </div>
            </section>
            {/* Size Guide Toggle */}
      <div className="mt-4 mb-6">
        <button 
          type="button"          onClick={() => setShowSizeChart(!showSizeChart)}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-black transition-colors"
        >
          {showSizeChart ? <X size={14} /> : <Ruler size={14} />}
          {showSizeChart ? "Close Size Guide" : "View Sizing & How to Measure"}
        </button>

        <AnimatePresence>
          {showSizeChart && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                <h3 className="font-serif text-xl mb-4 text-neutral-900">Standard Size Guide (Inches)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs mb-6">
                    <thead>
                      <tr className="border-b border-neutral-200 text-neutral-400 uppercase tracking-tighter">
                        <th className="py-2">Size</th>
                        <th>Bust</th>
                        <th>Waist</th>
                        <th>Hips</th>
                      </tr>
                    </thead>
                    <tbody className="text-neutral-700 font-medium">
                      <tr className="border-b border-neutral-100"><td className="py-3 font-bold text-neutral-900 uppercase">S</td><td>34</td><td>28</td><td>36</td></tr>
                      <tr className="border-b border-neutral-100"><td className="py-3 font-bold text-neutral-900 uppercase">M</td><td>36</td><td>30</td><td>38</td></tr>
                      <tr className="border-b border-neutral-100"><td className="py-3 font-bold text-neutral-900 uppercase">L</td><td>38</td><td>32</td><td>40</td></tr>
                      <tr><td className="py-3 font-bold text-neutral-900 uppercase">XL</td><td>40</td><td>34</td><td>42</td></tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-neutral-200">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-900">Pro-Tips for Chhaya's Boutique:</p>
                  <ul className="text-[11px] text-neutral-600 space-y-1">
                    <li>• Measure over the undergarments you plan to wear.</li>
                    <li>• For Lehengas, measure length while wearing your heels.</li>
                    <li>• Bust is the most critical for a perfect Saree Blouse fit.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
            {/* Submit Button */}
            <a 
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-3 w-full bg-black text-white py-5 rounded-2xl font-bold tracking-widest uppercase text-sm overflow-hidden transition-all active:scale-[0.98]"
            >
              <MessageCircle size={18} className="group-hover:animate-bounce" />
              Place Order via WhatsApp
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </a>
            
            <p className="text-center text-[10px] text-neutral-400 uppercase tracking-[0.2em]">
              Handcrafted with love in India
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      {/* Our Story Section */}
      <section id="story" className="py-24 bg-neutral-50 px-6 border-t border-neutral-100">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="font-serif text-4xl md:text-5xl text-neutral-900 tracking-tight">
            The Vision Behind <span className="italic">Kalakari</span>
          </h2>
          <div className="space-y-6 text-neutral-600 leading-relaxed text-lg font-light">
            <p>
              Founded by Chhaya, Kalakari is born from a passion for preserving the timeless artistry of Indian textiles. 
              We believe that every garment tells a story—of heritage and meticulous craftsmanship.
            </p>
            <p>
              Our bespoke process ensures that your vision is translated into a masterpiece, blending traditional 
              techniques with contemporary silhouettes.
            </p>
          </div>
          <div className="pt-8">
            <div className="h-px w-24 bg-neutral-300 mx-auto"></div>
          </div>
        </div>
      </section>
      <footer id="contact" className="bg-neutral-50 border-t border-neutral-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <span className="font-serif text-xl tracking-widest text-neutral-900 italic block mb-2">KALAKARI</span>
            <p className="text-xs text-neutral-400 tracking-widest uppercase">© 2024 Kalakari by Chhaya. All rights reserved.</p>
          </div>
          
          <div className="flex gap-6">
            <a href="https://www.instagram.com/hajelachhaya?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
  target="_blank" 
  rel="noopener noreferrer"
  className="p-3 bg-white border border-neutral-100 rounded-full text-neutral-600 hover:text-black transition-colors"
>
  <Instagram size={20} />
            </a>
            <a href="#" className="p-3 bg-white border border-neutral-100 rounded-full text-neutral-600 hover:text-black transition-colors">
              <Facebook size={20} />
            </a>
          </div>

          <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500">
            <a href="#" className="hover:text-black">Privacy</a>
            <a href="#" className="hover:text-black">Terms</a>
            <a href="#" className="hover:text-black">Shipping</a>
          </div>
        </div>
      </footer>
    </div>
  );
}