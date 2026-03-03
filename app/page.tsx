'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, MessageCircle, X, Trash2, Plus, Palette, Ruler, Facebook, Instagram, User, Phone, Mail, MapPin, Grid
} from 'lucide-react';

// --- DATA ---
const CATEGORIES = ['Saree', 'Lehenga', 'Kurta Set', 'Dress', 'T-Shirt', 'Shirt', 'Scarf', 'Stole'] as const;
const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
const FABRICS = ['Silk', 'Georgette', 'Organza', 'Chiffon', 'Crepe', 'Chanderi', 'Raw Silk', 'Cotton', 'Linen'];
const EMBROIDERY_STYLES = ['Zardosi', 'Mirror Work', 'Thread Work', 'Gota Patti', 'Aari','Sequin','NONE'];

// SAMPLE IMAGES
const SAMPLE_IMAGES = [
  "https://media.samyakk.in/pub/media/catalog/product/b/e/beige-and-gold-dual-tone-tissue-designer-saree-with-thread-work-and-unstitched-blouse-gh1568-a.jpg",
  "https://theloomstore.in/cdn/shop/files/IMG_5243.jpg?v=1698303816&width=1946",
  "https://clothsvilla.com/cdn/shop/products/WhatsAppImage2022-04-02at2.31.50PM_3_1024x1024.jpg?v=1648890244",
  "https://media.samyakk.in/pub/media/catalog/product/l/i/light-brown-sequins-work-saree-with-readymade-full-sleeves-blouse-gh6037-a.jpg",
  "https://media.samyakk.in/pub/media/catalog/product/h/o/hot-pink-mirror-embroidered-silk-designer-saree-with-contrast-v-neck-blouse-jf1678-a.jpg"
];

export default function Page() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showSamples, setShowSamples] = useState(false); // NEW STATE
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('Saree');
  const [fabric, setFabric] = useState(FABRICS[0]);
  const [embroidery, setEmbroidery] = useState(EMBROIDERY_STYLES[0]);
  const [color, setColor] = useState('#D4AF37');
  const [embroideryColor, setEmbroideryColor] = useState('#FFFFFF');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [notes, setNotes] = useState('');
  const [measurements, setMeasurements] = useState({ bust: '', waist: '', hips: '', length: '' });
  const [cart, setCart] = useState<any[]>([]);
  const [customerInfo, setCustomerInfo] = useState({ name: '', number: '', gmail: '', city: '', address: '', pincode: '' });

  const addToCart = () => {
    let sizeInfo = ['Dress', 'T-Shirt', 'Shirt'].includes(category) 
      ? `Size: ${selectedSize}` 
      : ['Scarf', 'Stole'].includes(category) ? `Free Size` 
      : `B:${measurements.bust || '-'} W:${measurements.waist || '-'} H:${measurements.hips || '-'} L:${measurements.length || '-'}`;

    const newItem = { id: Date.now(), category, fabric, embroidery, color: color.toUpperCase(), embroideryColor: embroideryColor.toUpperCase(), sizeOrMeasurements: sizeInfo, notes };
    setCart([...cart, newItem]);
    setIsCartOpen(true);
  };

  const generateWhatsAppLink = () => {
    const phoneNumber = '917991464638';
    let message = `✨ *NEW ORDER - KALAKARI* ✨\n\n`;
    message += `👤 *CUSTOMER*\n• ${customerInfo.name}\n• ${customerInfo.number}\n• ${customerInfo.city}, ${customerInfo.pincode}\n\n`;
    message += `🛍️ *ORDER*\n`;
    cart.forEach((item, index) => {
      message += `*${index + 1}. ${item.category}*\n• Fabric: ${item.fabric} (${item.color})\n• Work: ${item.embroidery} (${item.embroideryColor})\n• ${item.sizeOrMeasurements}\n---\n`;
    });
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 flex flex-col">
      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-[#FAF9F6] border-b border-[#E3D9C6]/30 px-8 py-5 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-12">
          <span onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="font-serif text-2xl tracking-[0.15em] italic uppercase font-black cursor-pointer text-[#2D2926]">KALAKARI</span>
          <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-[#8C867E]">
            <a href="#" className="hover:text-[#2D2926]">Collections</a>
            <a href="#" className="hover:text-[#2D2926]">Bespoke</a>
            <button onClick={() => setShowSamples(true)} className="hover:text-[#2D2926] uppercase">Samples</button>
            <button onClick={() => setShowStory(true)} className="hover:text-[#2D2926] uppercase">Our Story</button>
            <a href="mailto:chhayahajela167@gmail.com" className="hover:text-[#2D2926]">Contact</a>
          </div>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="relative p-2"><ShoppingBag size={22} /><{cart.length > 0 && <span className="absolute -top-1 -right-1 bg-[#B19470] text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{cart.length}</span>}</button>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 flex-grow">
        <div className="space-y-8">
            <h1 className="font-serif text-6xl md:text-8xl text-neutral-900 leading-[0.9] tracking-tighter">Your Boutique <br/> <span className="italic text-neutral-300">Your Way.</span></h1>
            <div className="grid grid-cols-2 gap-4">
                <img src={SAMPLE_IMAGES[0]} className="rounded-3xl h-[400px] w-full object-cover shadow-2xl" alt="Ethnic 1"/>
                <img src={SAMPLE_IMAGES[4]} className="rounded-3xl h-[400px] w-full object-cover mt-12 shadow-2xl" alt="Ethnic 2"/>
            </div>
        </div>

        {/* CUSTOMIZER BOX */}
        <div className="bg-[#FAF9F6] rounded-[3rem] p-8 md:p-12 border border-[#E3D9C6]/30 shadow-2xl space-y-10 h-fit">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8C867E] mb-5 block">Select Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)} className={`px-5 py-2.5 rounded-full text-[10px] font-black tracking-widest ${category === cat ? 'bg-[#2D2926] text-white' : 'bg-white text-[#8C867E] border border-[#E3D9C6]/20'}`}>{cat}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8C867E] block">1. Fabric & Color</label>
              <select className="w-full bg-white border border-[#E3D9C6]/40 rounded-2xl px-5 py-4 text-sm font-bold outline-none" value={fabric} onChange={(e)=>setFabric(e.target.value)}>{FABRICS.map(f => <option key={f}>{f}</option>)}</select>
              <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-[#E3D9C6]/20">
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer" />
                <code className="text-[10px] font-black">{color.toUpperCase()}</code>
              </div>
            </section>
            
            <section className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8C867E] block">2. Embroidery & Shade</label>
              <select className="w-full bg-white border border-[#E3D9C6]/40 rounded-2xl px-5 py-4 text-sm font-bold outline-none" value={embroidery} onChange={(e)=>setEmbroidery(e.target.value)}>{EMBROIDERY_STYLES.map(s => <option key={s}>{s}</option>)}</select>
              <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-[#E3D9C6]/20">
                <input type="color" value={embroideryColor} onChange={(e) => setEmbroideryColor(e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer" />
                <code className="text-[10px] font-black">{embroideryColor.toUpperCase()}</code>
              </div>
            </section>
          </div>

          <section className="pt-8 border-t border-[#E3D9C6]/30">
            <div className="flex justify-between items-center mb-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#8C867E]">
              <span className="flex items-center gap-2"><Ruler size={14}/> Sizing</span>
              <button onClick={() => setShowSizeChart(true)} className="underline">Size Guide</button>
            </div>
            {['Dress', 'T-Shirt', 'Shirt'].includes(category) ? (
              <div className="flex gap-2 overflow-x-auto">
                {STANDARD_SIZES.map(s => <button key={s} onClick={() => setSelectedSize(s)} className={`min-w-[48px] h-12 rounded-xl border-2 text-[10px] font-black ${selectedSize === s ? 'bg-[#2D2926] text-white' : 'bg-white text-neutral-300'}`}>{s}</button>)}
              </div>
            ) : !['Scarf', 'Stole'].includes(category) ? (
              <div className="grid grid-cols-4 gap-3">
                {['bust', 'waist', 'hips', 'length'].map(m => (
                  <div key={m}>
                    <span className="text-[8px] font-black uppercase text-[#8C867E] block mb-1 text-center">{m}</span>
                    <input type="number" placeholder="0" className="w-full bg-white border border-[#E3D9C6]/30 rounded-xl p-3 text-sm text-center font-bold" onChange={(e) => setMeasurements({...measurements, [m as keyof typeof measurements]: e.target.value})} />
                  </div>
                ))}
              </div>
            ) : <p className="text-[10px] font-black italic text-neutral-300 uppercase tracking-widest">Free Size</p>}
          </section>

          <button onClick={addToCart} className="w-full bg-[#2D2926] text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:bg-[#B19470] transition-all flex items-center justify-center gap-3">
            <Plus size={18}/> Add to Bag
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#FAF9F6] border-t border-[#E3D9C6]/30 py-12 px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="font-serif text-xl italic font-black uppercase text-[#2D2926]">KALAKARI</span>
          <div className="flex gap-6">
            <a href="https://www.instagram.com/hajelachhaya" target="_blank" className="p-3 bg-white border border-[#E3D9C6]/20 rounded-full text-[#8C867E] hover:bg-black hover:text-white transition-all"><Instagram size={20}/></a>
            <a href="https://www.facebook.com/share/1CcqEsncpY/" target="_blank" className="p-3 bg-white border border-[#E3D9C6]/20 rounded-full text-[#8C867E] hover:bg-black hover:text-white transition-all"><Facebook size={20}/></a>
          </div>
        </div>
      </footer>

      {/* OVERLAYS & MODALS */}
      <AnimatePresence>
        {/* SAMPLES MODAL */}
        {showSamples && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSamples(false)} className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[100]" />
            <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="fixed inset-0 m-auto w-[95%] max-w-5xl h-[85vh] bg-white z-[110] p-8 md:p-12 rounded-[3rem] shadow-2xl overflow-y-auto">
              <button onClick={() => setShowSamples(false)} className="absolute top-8 right-8 text-neutral-300 hover:text-black transition-all"><X size={32}/></button>
              <div className="mb-12">
                <h2 className="font-serif text-4xl italic uppercase mb-2">The Archive</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8C867E]">Handpicked inspirations from our studio</p>
              </div>
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {SAMPLE_IMAGES.map((img, idx) => (
                  <motion.div key={idx} whileHover={{ scale: 1.02 }} className="break-inside-avoid">
                    <img src={img} className="w-full rounded-2xl shadow-lg border border-neutral-100" alt={`Sample ${idx}`} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* SIZE GUIDE MODAL */}
        {showSizeChart && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSizeChart(false)} className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100]" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 m-auto w-[90%] max-w-xl h-fit bg-white z-[110] p-12 rounded-[3rem] shadow-2xl">
              <button onClick={() => setShowSizeChart(false)} className="absolute top-8 right-8 text-neutral-300 hover:text-black"><X size={28}/></button>
              <h2 className="font-serif text-3xl italic mb-8 uppercase tracking-tight">Standard Size Chart</h2>
              <table className="w-full text-left text-[10px] font-black uppercase tracking-widest">
                <thead><tr className="border-b border-neutral-100 text-[#8C867E]"><th className="py-4">Size</th><th className="py-4">Bust</th><th className="py-4">Waist</th><th className="py-4">Hips</th></tr></thead>
                <tbody className="text-[#2D2926]">
                  {[['XS','32','26','35'],['S','34','28','37'],['M','36','30','39'],['L','38','32','41'],['XL','40','34','43']].map((row) => (
                    <tr key={row[0]} className="border-b border-neutral-50"><td className="py-4">{row[0]}</td><td className="py-4">{row[1]}"</td><td className="py-4">{row[2]}"</td><td className="py-4">{row[3]}"</td></tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </>
        )}

        {/* OUR STORY MODAL */}
        {showStory && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowStory(false)} className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100]" />
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed inset-0 m-auto w-[90%] max-w-2xl h-fit bg-white z-[110] p-16 rounded-[3rem] shadow-2xl">
              <button onClick={() => setShowStory(false)} className="absolute top-8 right-8 text-neutral-300 hover:text-black"><X size={28}/></button>
              <h2 className="font-serif text-4xl italic text-neutral-900 leading-tight mb-8">Curated by Heritage. <br/><span className="text-neutral-300">Crafted for You.</span></h2>
              <p className="text-neutral-600 leading-[1.8] text-sm italic">At Kalakari, we bridge the gap between the master weaver’s courtyard and the modern woman’s wardrobe. Rooted in Rajasthan, refined for the world.</p>
            </motion.div>
          </>
        )}

        {/* CART SIDEBAR */}
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] p-10 flex flex-col shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center mb-8 border-b pb-4"><h2 className="font-serif text-2xl italic uppercase">Bag ({cart.length})</h2><button onClick={() => setIsCartOpen(false)}><X size={28}/></button></div>
              <div className="flex-grow overflow-y-auto space-y-6 pr-2">
                {cart.length > 0 && (
                  <div className="bg-[#FAF9F6] p-6 rounded-3xl space-y-3 border border-[#E3D9C6]/30">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[#8C867E] flex items-center gap-2 mb-2"><User size={14}/> Delivery Details</h3>
                    <input type="text" placeholder="Full Name" className="w-full bg-white border border-[#E3D9C6]/20 rounded-xl px-4 py-3 text-xs font-bold" value={customerInfo.name} onChange={(e)=>setCustomerInfo({...customerInfo, name: e.target.value})} />
                    <input type="text" placeholder="Phone Number" className="w-full bg-white border border-[#E3D9C6]/20 rounded-xl px-4 py-3 text-xs font-bold" value={customerInfo.number} onChange={(e)=>setCustomerInfo({...customerInfo, number: e.target.value})} />
                    <textarea placeholder="Address & City" className="w-full bg-white border border-[#E3D9C6]/20 rounded-xl px-4 py-3 text-xs font-bold min-h-[80px]" value={customerInfo.address} onChange={(e)=>setCustomerInfo({...customerInfo, address: e.target.value})} />
                  </div>
                )}
                {cart.length === 0 ? <p className="text-center text-[10px] font-black uppercase text-neutral-300 py-20">Bag is empty</p> : 
                  cart.map((item: any) => (
                    <div key={item.id} className="border-b pb-4 flex justify-between items-start">
                      <div>
                        <h4 className="font-black text-sm uppercase">{item.category}</h4>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase">{item.fabric} ({item.color}) • {item.embroidery} ({item.embroideryColor})</p>
                        <p className="text-[10px] mt-1 font-black">{item.sizeOrMeasurements}</p>
                      </div>
                      <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-neutral-300 hover:text-red-500"><Trash2 size={16}/></button>
                    </div>
                  ))
                }
              </div>
              {cart.length > 0 && <button onClick={() => window.open(generateWhatsAppLink(), '_blank')} className="w-full bg-[#2D2926] text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] mt-8 flex items-center justify-center gap-3"> <MessageCircle size={18}/> Place via WhatsApp </button>}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}