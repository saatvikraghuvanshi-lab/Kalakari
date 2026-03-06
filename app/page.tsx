'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, User, X, Instagram, Facebook, 
  ChevronRight, ArrowLeft, Send, Trash2, Palette, Ruler, Mail, Phone, Upload, Loader2, LogOut
} from 'lucide-react';

import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  GoogleAuthProvider
} from "firebase/auth";
import { auth, googleProvider, db } from './lib/firebase';
import { ref, onValue, push, set, remove } from 'firebase/database';

// --- CONFIGURATION ---
const IMGBB_API_KEY = "694406d04ca241ae4636689de09341fb";
const ADMIN_EMAILS = [
  "dhruvhajela5@gmail.com", 
  "saatvikraghuvanshi123@gmail.com", 
  "chhayahajela167@gmail.com"
];

const ASSETS = {
  SAREE_MAIN: "https://media.samyakk.in/pub/media/catalog/product/b/e/beige-and-gold-dual-tone-tissue-designer-saree-with-thread-work-and-unstitched-blouse-gh1568-a.jpg",
  LEHENGA_MAIN: "https://clothsvilla.com/cdn/shop/products/WhatsAppImage2022-04-02at2.31.50PM_3_1024x1024.jpg?v=1648890244",
  DRESS: "https://cpimg.tistatic.com/5593157/b/1/ladies-plain-one-piece-dress.jpg",
  SHIRT: "https://cdn.cosmos.so/dab01853-00d9-48cb-aebc-95b70bea7b3e?format=jpeg",
  TSHIRT: "https://cdn.cosmos.so/8056a947-4323-498f-990c-3f02f7112368?format=jpeg",
  STOLE: "https://cdn.cosmos.so/3a83e9e8-6a20-43e2-9f68-489ccf5d60dc?format=jpeg",
  SCARF: "https://cdn.cosmos.so/7aef443c-4c6e-4dc2-851a-6e4ce883039c?format=jpeg",
};

const FABRICS = ["Pure Chiffon", "Raw Silk", "Organza", "Chanderi Silk", "Georgette", "Cotton Mulmul", "Banarasi Brocade", "Tissue Silk"];
const WORK_TYPES = ["Antique Gold Gota Patti", "Silver Zardosi", "Mirror Work", "Thread Embroidery", "Mukaish Work", "Pearl Border", "Sequins Work"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = [
  { name: "Ruby", hex: "#8B0000" }, { name: "Emerald", hex: "#006400" }, 
  { name: "Navy", hex: "#000080" }, { name: "Ivory", hex: "#F5F5DC" }, 
  { name: "Gold", hex: "#DAA520" }, { name: "Pink", hex: "#FF69B4" }
];

export default function KalakariBoutique() {
  const [view, setView] = useState<string>('home');
  const [colType, setColType] = useState<'readymade' | 'custom' | null>(null);
  const [customCat, setCustomCat] = useState<'Saree' | 'Lehenga' | 'Kurta Set' | null>(null);
  const [selectedReadymade, setSelectedReadymade] = useState<any>(null);
  
  const [cart, setCart] = useState<any[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<'contact' | 'address'>('contact');
  const [selection, setSelection] = useState({ fabric: FABRICS[0], work: WORK_TYPES[0], color: COLORS[3].name, size: 'M' });
  const [form, setForm] = useState({ name: '', email: '', mobile: '', house: '', city: '', pin: '' });

  const [archiveItems, setArchiveItems] = useState<{id: string, url: string}[]>([]);
  const [uploading, setUploading] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // --- AUTH LISTENER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user?.email && ADMIN_EMAILS.includes(user.email)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- FETCH ARCHIVE ---
  useEffect(() => {
    if (!db) return;
    const archiveRef = ref(db, 'archive');
    const unsubscribe = onValue(archiveRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.entries(data).map(([id, url]) => ({ id, url: url as string }));
        setArchiveItems(items.reverse());
      } else {
        setArchiveItems([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- HANDLERS ---
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setView('home');
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const isAuthorized = isAdmin || (currentUser?.email && ADMIN_EMAILS.includes(currentUser.email));
    if (!isAuthorized) return alert("Access Denied: Admins Only.");

    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        const newArchiveRef = push(ref(db, 'archive'));
        await set(newArchiveRef, result.data.url);
        alert("Added to Archive!");
      }
    } catch (error) {
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return alert("Admins only.");
    if (window.confirm("Remove this piece from Archive?")) {
      await remove(ref(db, `archive/${id}`));
    }
  };

  const navigateTo = (screen: any) => { setView(screen); window.scrollTo(0,0); };
  const addToBag = (item: any) => {
    setCart([...cart, { ...item, id: Math.random().toString(36).substr(2, 9) }]);
    setSelectedReadymade(null);
    navigateTo('cart');
  };

  const sendWhatsApp = () => {
    const items = cart.map(i => `*${i.name}*\n${i.type === 'custom' ? `Fabric: ${i.fabric}\nWork: ${i.work}\nColor: ${i.color}` : `Color: ${i.color}${i.size ? `\nSize: ${i.size}` : ''}`}`).join('\n\n');
    const msg = `*NEW ORDER - KALAKARI*\n\n*Customer:* ${form.name}\n*Ph:* ${form.mobile}\n*Address:* ${form.house}, ${form.city} ${form.pin}\n\n*Items:*\n${items}`;
    window.open(`https://wa.me/917991464638?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // --- AUTH GATE (LOGIN PAGE) ---
  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] p-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-serif text-7xl md:text-9xl italic mb-4 text-black tracking-tighter">KALAKARI</h1>
          <p className="text-stone-400 mb-12 font-black uppercase tracking-[0.5em] text-[10px]">Ancestral Threads • Modern Silhouettes</p>
          <button 
            onClick={handleLogin}
            className="group bg-black text-white px-10 py-5 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center gap-4 hover:scale-105 transition-all shadow-2xl"
          >
            Continue with Google <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-black font-sans selection:bg-[#E9E5CE]">
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-[100] px-6 md:px-12 py-6 flex justify-between items-center border-b border-stone-200 bg-[#E9E5CE]">
        <div className="flex items-center gap-12">
          <span onClick={() => {navigateTo('home'); setColType(null); setCustomCat(null)}} className="font-serif text-3xl md:text-4xl font-black italic cursor-pointer uppercase tracking-tighter">KALAKARI</span>
          <div className="hidden lg:flex gap-10 text-[10px] font-black uppercase tracking-widest">
            <button onClick={() => navigateTo('collections')} className="hover:opacity-60 transition-opacity">COLLECTIONS</button>
            <button onClick={() => navigateTo('samples')} className="hover:opacity-60 transition-opacity">SAMPLES</button>
            <button onClick={() => navigateTo('story')} className="hover:opacity-60 transition-opacity">OUR STORY</button>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <button onClick={() => navigateTo('account')} className="hover:opacity-60 transition-opacity"><User size={24} /></button>
          <div onClick={() => navigateTo('cart')} className="relative cursor-pointer hover:opacity-60 transition-opacity">
            <ShoppingBag size={26} />
            {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{cart.length}</span>}
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {/* --- HOME VIEW --- */}
        {view === 'home' && (
          <motion.section key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 px-6 text-center">
            <h1 className="font-serif text-5xl md:text-7xl italic leading-none mb-16 max-w-4xl mx-auto text-stone-800">Kalakari • Ancestral Threads Modern Silhouettes</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16 items-center">
              <img src={ASSETS.SAREE_MAIN} className="rounded-3xl h-[500px] w-full object-cover shadow-xl" alt="Heritage" />
              <img src={ASSETS.SHIRT} className="rounded-3xl h-[500px] w-full object-cover shadow-xl" alt="New Arrival" />
              <img src={ASSETS.LEHENGA_MAIN} className="rounded-3xl h-[500px] w-full object-cover shadow-xl" alt="Couture" />
            </div>
            <button onClick={() => navigateTo('collections')} className="bg-black text-white px-16 py-6 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg hover:scale-105 transition-all">Enter Studio</button>
          </motion.section>
        )}

        {/* --- COLLECTIONS SPLIT --- */}
        {view === 'collections' && !colType && (
          <motion.section key="col" className="max-w-5xl mx-auto py-32 px-6 grid md:grid-cols-2 gap-10">
            <div onClick={() => setColType('readymade')} className="p-20 border-2 border-stone-200 rounded-[3rem] text-center cursor-pointer hover:bg-black hover:text-white transition-all group">
              <h3 className="font-serif text-5xl italic mb-4">Readymade</h3>
              <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Hand-Picked Essentials</p>
            </div>
            <div onClick={() => setColType('custom')} className="p-20 border-2 border-stone-200 rounded-[3rem] text-center cursor-pointer hover:bg-black hover:text-white transition-all group">
              <h3 className="font-serif text-5xl italic mb-4">Custom</h3>
              <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Bespoke Design Experience</p>
            </div>
          </motion.section>
        )}

        {/* --- READYMADE GALLERY --- */}
        {colType === 'readymade' && (
          <motion.section key="ready" className="max-w-7xl mx-auto py-16 px-6">
            <button onClick={() => setColType(null)} className="mb-10 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest hover:opacity-50"><ArrowLeft size={16}/> Back</button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                { name: 'Dress', hasSize: true, img: ASSETS.DRESS },
                { name: 'Shirt', hasSize: true, img: ASSETS.SHIRT },
                { name: 'T-Shirt', hasSize: true, img: ASSETS.TSHIRT },
                { name: 'Stole', hasSize: false, img: ASSETS.STOLE },
                { name: 'Scarf', hasSize: false, img: ASSETS.SCARF }
              ].map(product => (
                <div key={product.name} onClick={() => setSelectedReadymade(product)} className="bg-white rounded-[2.5rem] border border-stone-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all cursor-pointer group">
                  <div className="h-[400px] overflow-hidden">
                    <img src={product.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={product.name}/>
                  </div>
                  <div className="p-8 flex justify-between items-center">
                    <h4 className="font-serif text-3xl italic">{product.name}</h4>
                    <span className="bg-stone-50 p-3 rounded-full group-hover:bg-black group-hover:text-white transition-colors"><ChevronRight size={20}/></span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* --- PRODUCT MODAL --- */}
        {selectedReadymade && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl">
              <div className="w-full md:w-1/2 h-80 md:h-auto">
                <img src={selectedReadymade.img} className="w-full h-full object-cover" />
              </div>
              <div className="p-10 md:p-14 w-full md:w-1/2 space-y-10 relative bg-[#FDFBF7]">
                <button onClick={() => setSelectedReadymade(null)} className="absolute top-10 right-10 text-stone-300 hover:text-black"><X size={32}/></button>
                <h3 className="font-serif text-5xl italic border-b pb-4">{selectedReadymade.name}</h3>
                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase opacity-40 flex items-center gap-2 tracking-widest"><Palette size={14}/> Color Selection</label>
                  <div className="flex flex-wrap gap-4">
                    {COLORS.map(c => (
                      <button key={c.name} onClick={() => setSelection({...selection, color: c.name})} className={`w-10 h-10 rounded-full border-4 shadow-sm transition-all ${selection.color === c.name ? 'border-black scale-110' : 'border-white'}`} style={{ backgroundColor: c.hex }} />
                    ))}
                  </div>
                </div>
                {selectedReadymade.hasSize && (
                  <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase opacity-40 flex items-center gap-2 tracking-widest"><Ruler size={14}/> Choose Size</label>
                    <div className="grid grid-cols-3 gap-2">
                      {SIZES.map(s => (
                        <button key={s} onClick={() => setSelection({...selection, size: s})} className={`p-4 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${selection.size === s ? 'border-black bg-black text-white' : 'border-stone-100 bg-white'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={() => addToBag({ name: selectedReadymade.name, type: 'readymade', color: selection.color, size: selectedReadymade.hasSize ? selection.size : null })} className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-xl hover:bg-stone-800 transition-colors">Add to Bag</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* --- CUSTOM DESIGN --- */}
        {colType === 'custom' && (
          <motion.section key="custom" className="max-w-6xl mx-auto py-16 px-6">
            <button onClick={() => setColType(null)} className="mb-10 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest"><ArrowLeft size={16}/> Back</button>
            {!customCat ? (
              <div className="grid md:grid-cols-3 gap-8">
                {['Saree', 'Lehenga', 'Kurta Set'].map(c => (
                  <button key={c} onClick={() => setCustomCat(c as any)} className="p-16 border-2 border-stone-200 rounded-[3rem] font-serif text-4xl italic hover:bg-black hover:text-white transition-all">{c}</button>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 md:p-16 rounded-[4rem] shadow-2xl grid lg:grid-cols-2 gap-16 border border-stone-100">
                <div className="space-y-10">
                  <h3 className="font-serif text-5xl italic border-b pb-6">{customCat} Specs</h3>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase opacity-40 tracking-widest">Fabric Choice</label>
                    <div className="grid grid-cols-2 gap-2">
                      {FABRICS.map(f => (
                        <button key={f} onClick={() => setSelection({...selection, fabric: f})} className={`p-4 rounded-xl text-[9px] font-black uppercase border-2 transition-all ${selection.fabric === f ? 'border-black bg-black text-white' : 'border-stone-100 bg-white'}`}>{f}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase opacity-40 tracking-widest">Work Detail</label>
                    <select value={selection.work} onChange={(e) => setSelection({...selection, work: e.target.value})} className="w-full p-4 bg-stone-50 rounded-xl font-bold text-xs ring-1 ring-stone-100 border-none outline-none">
                      {WORK_TYPES.map(w => <option key={w}>{w}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase opacity-40 tracking-widest">Color Wheel</label>
                    <div className="flex flex-wrap gap-4">
                      {COLORS.map(c => (
                        <button key={c.name} onClick={() => setSelection({...selection, color: c.name})} className={`w-10 h-10 rounded-full border-4 shadow-lg transition-transform hover:scale-110 ${selection.color === c.name ? 'border-black' : 'border-white'}`} style={{ backgroundColor: c.hex }} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase opacity-40 tracking-widest">Measurements (Inches)</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Bust', 'Waist', 'Hips', 'Sleeves', 'Front', 'Back'].map(m => (
                        <input key={m} type="text" placeholder={m} className="p-4 bg-stone-50 rounded-xl text-xs font-bold w-full ring-1 ring-stone-100 border-none outline-none focus:ring-black" />
                      ))}
                    </div>
                  </div>
                  <button onClick={() => addToBag({ name: `Bespoke ${customCat}`, type: 'custom', ...selection })} className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-stone-800 transition-colors">Confirm Spec</button>
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* --- SAMPLES / ARCHIVE --- */}
        {view === 'samples' && (
          <motion.section key="samples" className="max-w-7xl mx-auto py-24 px-6 text-center">
            <h2 className="font-serif text-7xl italic mb-16 underline decoration-stone-200">The Archive</h2>
            {archiveItems.length > 0 ? (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                {archiveItems.map((item) => (
                    <div key={item.id} className="rounded-3xl overflow-hidden shadow-xl border border-stone-100 bg-white">
                        <img src={item.url} className="w-full object-cover" alt="Archive work" />
                    </div>
                ))}
                </div>
            ) : (
                <p className="font-serif italic text-2xl text-stone-300 py-20">The archive is being curated...</p>
            )}
          </motion.section>
        )}

        {/* --- STORY --- */}
        {view === 'story' && (
          <motion.section key="story" className="max-w-4xl mx-auto py-32 px-6">
            <h2 className="font-serif text-7xl italic mb-12 text-center underline decoration-stone-200">Our Story</h2>
            <div className="space-y-12 text-stone-800">
              <div>
                <h3 className="font-serif text-3xl italic mb-4">The Soul of the Stitch</h3>
                <p className="text-lg leading-relaxed">At Kalakari, we believe that every garment is a vessel for history. Our journey began in the vibrant lanes of Lucknow, where the rhythmic sound of the artisan's needle has echoed for generations. We don’t just create clothing; we curate memories, blending the age-old traditions of Chikan, Zardosi, and Gota Patti with a silhouette designed for the modern woman.</p>
              </div>
              <div>
                <h3 className="font-serif text-3xl italic mb-4">Guided by Craft</h3>
                <p className="text-lg leading-relaxed">Founded by Chhaya Hajela, Kalakari is an homage to the human hand. In an era of mass production, we remain committed to the slow, intentional process of bespoke tailoring. Each piece in our collection is a product of collaboration between our master craftspeople and our design studio.</p>
              </div>
              <div className="bg-[#E9E5CE] p-10 rounded-[3rem] text-center italic font-serif text-2xl shadow-sm">
                "Kalakari is where history meets the stitch—crafted in Lucknow, worn by you, anywhere in the world."
              </div>
            </div>
          </motion.section>
        )}

        {/* --- SUPPORT --- */}
        {view === 'support' && (
          <div className="max-w-4xl mx-auto py-32 px-6 text-center">
            <h2 className="font-serif text-7xl italic mb-16">Customer Support</h2>
            <div className="grid md:grid-cols-3 gap-10">
              {[
                { role: "Owner", phone: "917991464638" },
                { role: "Designer", phone: "919589120141" },
                { role: "Developer", phone: "919301661150" }
              ].map((contact) => (
                <div key={contact.role} className="p-8 border-2 border-stone-200 rounded-[2rem] bg-white shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">{contact.role}</p>
                  <p className="text-xl font-bold italic flex items-center justify-center gap-3">
                    <Phone size={18} className="text-stone-400"/> +{contact.phone}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-16 text-xl font-bold italic">
               <p className="flex items-center justify-center gap-4 text-stone-500"><Mail size={24}/> care@kalakari.in</p>
            </div>
          </div>
        )}

        {/* --- ACCOUNT / ADMIN --- */}
        {view === 'account' && (
          <motion.section key="account" className="max-w-5xl mx-auto py-32 px-6">
            <div className="flex justify-between items-end mb-16">
              <h2 className="font-serif text-7xl italic">My Space</h2>
              <button onClick={handleLogout} className="text-stone-400 hover:text-red-500 transition-colors flex items-center gap-2 uppercase text-[10px] font-black tracking-widest">
                <LogOut size={14} /> Sign Out
              </button>
            </div>

            {isAdmin ? (
              <div className="grid md:grid-cols-2 gap-10">
                <div className="bg-white p-10 rounded-[3rem] shadow-xl border-2 border-stone-100 flex flex-col justify-center min-h-[400px]">
                  <h4 className="font-serif text-2xl italic mb-6 text-stone-800">Admin: Add to Archive</h4>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-stone-200 p-10 rounded-2xl cursor-pointer hover:bg-stone-50 transition-colors">
                    {uploading ? <Loader2 className="animate-spin text-stone-400" size={40} /> : <Upload className="text-stone-300 mb-4" size={40} />}
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                      {uploading ? 'Uploading Piece...' : 'Tap to Upload Sample'}
                    </span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                  </label>
                </div>

                <div className="bg-white p-10 rounded-[3rem] shadow-xl border-2 border-stone-100 min-h-[400px]">
                  <h4 className="font-serif text-2xl italic mb-6 text-stone-800">Manage Archive</h4>
                  <div className="h-64 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {archiveItems.length > 0 ? archiveItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between bg-stone-50 p-4 rounded-2xl group">
                        <img src={item.url} className="w-12 h-12 object-cover rounded-lg shadow-sm" />
                        <button onClick={() => handleDelete(item.id)} className="text-stone-300 hover:text-red-500 transition-colors">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    )) : (
                      <p className="text-stone-300 text-[10px] uppercase font-black py-20 text-center">No items to manage</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-16 rounded-[4rem] border-2 border-stone-100 shadow-xl max-w-xl mx-auto text-center">
                <div className="w-24 h-24 bg-stone-50 rounded-full mx-auto mb-8 flex items-center justify-center border border-stone-100">
                  <User className="text-stone-300" size={48} />
                </div>
                <h3 className="text-3xl font-serif mb-2 text-stone-800">Welcome, {currentUser?.displayName}</h3>
                <p className="text-stone-400 font-medium mb-10 tracking-wide">{currentUser?.email}</p>
                <div className="pt-8 border-t border-stone-100 text-left">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-300 mb-4">Member Status</h4>
                  <p className="text-stone-500 italic">No active orders or saved designs found.</p>
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* --- CART --- */}
        {view === 'cart' && (
          <motion.section key="cart" className="max-w-2xl mx-auto py-24 px-6 text-center">
            <h2 className="font-serif text-7xl italic mb-12">Selection</h2>
            <div className="space-y-8 mb-16">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b pb-8 border-stone-200">
                  <div className="text-left">
                    <p className="font-serif italic text-3xl">{item.name}</p>
                    <p className="text-[10px] font-black uppercase opacity-40 mt-2 tracking-widest">
                      {item.type === 'custom' ? `${item.fabric} • ${item.work}` : `${item.color} ${item.size ? `• ${item.size}` : ''}`}
                    </p>
                  </div>
                  <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-stone-300 hover:text-red-500 transition-colors"><Trash2 size={24}/></button>
                </div>
              ))}
              {cart.length === 0 && <p className="text-2xl font-serif italic text-stone-200 py-20">Your bag is empty.</p>}
            </div>
            {cart.length > 0 && <button onClick={() => navigateTo('checkout')} className="w-full bg-black text-white py-8 rounded-full font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-stone-800 transition-colors">Go to Checkout</button>}
          </motion.section>
        )}

        {/* --- CHECKOUT --- */}
        {view === 'checkout' && (
          <motion.section key="checkout" className="min-h-screen flex flex-col lg:flex-row bg-white">
            <div className="w-full lg:w-[30%] bg-stone-50 p-8 lg:p-12 border-b lg:border-r border-stone-100">
              <span className="font-serif text-3xl font-black italic block mb-10 uppercase tracking-tighter">Order</span>
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
                    <p className="font-serif italic text-lg">{item.name}</p>
                    <p className="text-[9px] font-black uppercase opacity-40 mt-1">{item.type === 'custom' ? item.fabric : `${item.color} ${item.size ? `| ${item.size}` : ''}`}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-[70%] bg-white p-8 lg:p-32">
              <div className="flex gap-10 mb-16 items-center border-b pb-4 max-w-xl">
                <span className={`text-[10px] font-black uppercase tracking-widest ${checkoutStep === 'contact' ? 'text-black border-b-2 border-black pb-2' : 'text-stone-300'}`}>Contact</span>
                <span className="text-stone-300 mx-2">/</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${checkoutStep === 'address' ? 'text-black border-b-2 border-black pb-2' : 'text-stone-300'}`}>Address</span>
              </div>
              <div className="max-w-xl space-y-6">
                {checkoutStep === 'contact' ? (
                  <>
                    <input type="tel" placeholder="Phone Number" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} className="w-full p-6 bg-stone-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-1 ring-black" />
                    <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-6 bg-stone-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-1 ring-black" />
                    <button onClick={() => setCheckoutStep('address')} className="w-full bg-black text-white py-8 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-stone-800 transition-colors">Next</button>
                  </>
                ) : (
                  <>
                    <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-6 bg-stone-50 rounded-2xl font-bold text-sm outline-none focus:ring-1 ring-black" />
                    <input type="text" placeholder="House / Street" value={form.house} onChange={e => setForm({...form, house: e.target.value})} className="w-full p-6 bg-stone-50 rounded-2xl font-bold text-sm outline-none focus:ring-1 ring-black" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="p-6 bg-stone-50 rounded-2xl font-bold text-sm outline-none focus:ring-1 ring-black" />
                      <input type="text" placeholder="Pin Code" value={form.pin} onChange={e => setForm({...form, pin: e.target.value})} className="p-6 bg-stone-50 rounded-2xl font-bold text-sm outline-none focus:ring-1 ring-black" />
                    </div>
                    <button onClick={sendWhatsApp} className="w-full bg-black text-white py-8 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-4 hover:bg-stone-800 transition-colors">Finish via WhatsApp <Send size={20}/></button>
                  </>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* --- LEGAL VIEWS --- */}
        {view === 'terms' && (
          <div className="max-w-3xl mx-auto py-32 px-6">
            <h2 className="font-serif text-5xl italic mb-10 uppercase tracking-tighter">Terms & Conditions</h2>
            <div className="space-y-8 text-sm font-medium text-stone-600 leading-relaxed">
              <section>
                <h4 className="text-black font-black uppercase tracking-widest mb-2">1. Bespoke & Custom Orders</h4>
                <p>All custom-made, bespoke, or altered garments are final sale. Because these items are created to your specific measurements, they cannot be returned or exchanged. Artisanal variations in color and work are marks of authenticity.</p>
              </section>
              <section>
                <h4 className="text-black font-black uppercase tracking-widest mb-2">2. Production Timelines</h4>
                <p>Bespoke orders require 21 to 30 business days. Readymade items are dispatched within 3-5 business days. Kalakari is not responsible for logistics delays.</p>
              </section>
              <section>
                <h4 className="text-black font-black uppercase tracking-widest mb-2">3. Cancellations</h4>
                <p>Requests for changes or cancellations must be made within 24 hours of order placement. Beyond this window, production begins and no refunds are possible.</p>
              </section>
            </div>
          </div>
        )}

        {view === 'privacy' && (
          <div className="max-w-3xl mx-auto py-32 px-6">
            <h2 className="font-serif text-5xl italic mb-10 uppercase tracking-tighter">Privacy Policy</h2>
            <div className="space-y-8 text-sm font-medium text-stone-600 leading-relaxed">
              <section>
                <h4 className="text-black font-black uppercase tracking-widest mb-2">Data Collection</h4>
                <p>We collect contact details, shipping info, and personal measurements required for bespoke tailoring. We do not sell or trade your personal information.</p>
              </section>
              <section>
                <h4 className="text-black font-black uppercase tracking-widest mb-2">Security</h4>
                <p>Your measurements and design specs are stored in a secure environment accessible only to the production team. All data is encrypted and handled with artisanal care.</p>
              </section>
              <section>
                <h4 className="text-black font-black uppercase tracking-widest mb-2">WhatsApp Interaction</h4>
                <p>As checkout is handled via WhatsApp, your data on that platform is subject to their own privacy policies. We only share necessary details with logistics partners.</p>
              </section>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* --- FOOTER --- */}
      <footer className="px-6 py-24 bg-[#E9E5CE] border-t border-stone-200 text-center">
        <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] mb-20">
          <button onClick={() => navigateTo('terms')} className="hover:opacity-40 transition-opacity">Terms & Conditions</button>
          <button onClick={() => navigateTo('privacy')} className="hover:opacity-40 transition-opacity">Privacy Policy</button>
          <button onClick={() => navigateTo('support')} className="hover:opacity-40 transition-opacity">Customer Support</button>
        </div>
        <div className="flex justify-center gap-12 mb-16">
          <a href="https://instagram.com/hajelachhaya" target="_blank" className="hover:scale-125 transition-transform"><Instagram size={28} /></a>
          <a href="https://facebook.com/chhaya.hajela" target="_blank" className="hover:scale-125 transition-transform"><Facebook size={28} /></a>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[1em] opacity-40">KALAKARI BOUTIQUE • LUCKNOW • 2026</p>
      </footer>
    </div>
  );
}