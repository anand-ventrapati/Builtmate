'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const Toggle = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="space-y-2">
    <p className="text-xs font-bold text-slate-400">{label}</p>
    <div className="flex gap-2">
      {['Yes', 'No'].map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
            value === opt
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/20'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

export default function DesignStudioContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || '';

  // Basic
  const [prompt, setPrompt] = useState(initialPrompt);
  const [plotSize, setPlotSize] = useState('1200');
  const [floors, setFloors] = useState('2');
  const [bhk, setBhk] = useState('3');
  const [style, setStyle] = useState('Modern');
  const [facing, setFacing] = useState('East');
  const [budget, setBudget] = useState('₹30L–₹60L');

  // Rooms
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('2');
  const [studyRoom, setStudyRoom] = useState('No');
  const [servantRoom, setServantRoom] = useState('No');
  const [pooja, setPooja] = useState('Yes');

  // Features
  const [balcony, setBalcony] = useState('Yes');
  const [parking, setParking] = useState('Yes');
  const [garden, setGarden] = useState('No');
  const [rooftop, setRooftop] = useState('No');
  const [openKitchen, setOpenKitchen] = useState('Yes');

  // Extra
  const [extraDetails, setExtraDetails] = useState('');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialPrompt && !result && !loading) {
      handleGenerate();
    }
  }, [initialPrompt]);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/generate-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt, plotSize, floors, bhk, style,
          bedrooms, bathrooms, balcony, parking,
          garden, rooftop, openKitchen, pooja,
          studyRoom, servantRoom, facing, budget,
          extraDetails
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult({ ...data, userPrompt: prompt || 'Standard Design', extraDetails, style });
    } catch (err: any) {
      console.error(err);
      setResult({
        description: `A stunning ${style} residence featuring clean lines and an open-plan living concept. Thoughtfully designed for the Indian climate with cross-ventilation.`,
        features: ["Double-height living room", "Balcony with toughened glass", "Modular open kitchen", "Dedicated home office", "Solar-ready rooftop"],
        materials: ["Fe 500D TMT Steel", "OPC 53 Grade Cement", "Vitrified Tiles 800x800mm", "Toughened Float Glass 12mm", "Exterior Texture Coat Paint"],
        estimatedBudget: budget,
        constructionTimeline: "14–18 months",
        architect_notes: `Recommend orienting the living room toward the ${facing}-facing garden for optimal light.`,
        userPrompt: prompt || 'Standard Design',
        extraDetails,
        style
      });
      setError('AI service busy. Showing a sample design concept.');
    } finally {
      setLoading(false);
    }
  };

  const selectClass = "w-full bg-slate-950 border border-white/5 p-3.5 rounded-xl text-white outline-none focus:border-indigo-500/50 transition-all font-bold text-sm";
  const inputClass = "w-full bg-slate-950 border border-white/5 p-3.5 rounded-xl text-white outline-none focus:border-indigo-500/50 transition-all font-bold text-sm";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-indigo-400 border-b border-white/5 pb-2 mb-4 block";

  const styleImages: Record<string, string> = {
    Modern: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    Minimalist: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
    Industrial: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80',
    Traditional: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    Colonial: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200&q=80',
    Mediterranean: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&q=80',
    Contemporary: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    'Vastu-Compliant': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    Tropical: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80'
  };

  const getStyleImage = (currentStyle: string) => styleImages[currentStyle] || styleImages['Modern'];

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 bg-slate-950">
      <Navbar />

      <div className="glow-sphere top-[-100px] left-[-100px] w-[500px] h-[500px] bg-indigo-600/20" />
      <div className="glow-sphere bottom-20 right-20 w-[400px] h-[400px] bg-emerald-600/10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
            AI Design <span className="text-gradient">Studio</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            Turn your imagination into architectural blueprints using our ultra-advanced AI engine. Every design is uniquely generated for you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="glass-card p-8 space-y-7 bg-slate-900/60 sticky top-32 max-h-[85vh] overflow-y-auto">

              {/* Section 1: Dimensions */}
              <div>
                <span className={labelClass}>📐 Dimensions & Scale</span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400">Plot Size (SqFt)</p>
                    <input type="number" className={inputClass} value={plotSize} onChange={e => setPlotSize(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400">Total Floors</p>
                    <select className={selectClass} value={floors} onChange={e => setFloors(e.target.value)}>
                      <option>1</option><option>2</option><option>3</option><option>4</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400">House Facing</p>
                    <select className={selectClass} value={facing} onChange={e => setFacing(e.target.value)}>
                      {['East','West','North','South','North-East','North-West','South-East','South-West'].map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400">Budget Range</p>
                    <select className={selectClass} value={budget} onChange={e => setBudget(e.target.value)}>
                      {['Below ₹20L','₹20L–₹40L','₹30L–₹60L','₹50L–₹80L','₹80L–₹1.2Cr','Above ₹1.2Cr'].map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Rooms */}
              <div>
                <span className={labelClass}>🛏️ Room Configuration</span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400">BHK</p>
                    <select className={selectClass} value={bhk} onChange={e => setBhk(e.target.value)}>
                      <option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400">Bedrooms</p>
                    <select className={selectClass} value={bedrooms} onChange={e => setBedrooms(e.target.value)}>
                      {['1','2','3','4','5','6+'].map(n => <option key={n}>{n}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400">Bathrooms</p>
                    <select className={selectClass} value={bathrooms} onChange={e => setBathrooms(e.target.value)}>
                      {['1','2','3','4','5+'].map(n => <option key={n}>{n}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400">Aesthetic Style</p>
                    <select className={selectClass} value={style} onChange={e => setStyle(e.target.value)}>
                      {['Modern','Minimalist','Industrial','Traditional','Colonial','Mediterranean','Contemporary','Vastu-Compliant','Tropical'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Extras */}
              <div>
                <span className={labelClass}>🏠 Special Rooms</span>
                <div className="grid grid-cols-2 gap-4">
                  <Toggle label="Pooja Room" value={pooja} onChange={setPooja} />
                  <Toggle label="Study Room" value={studyRoom} onChange={setStudyRoom} />
                  <Toggle label="Servant Room" value={servantRoom} onChange={setServantRoom} />
                  <Toggle label="Open Kitchen" value={openKitchen} onChange={setOpenKitchen} />
                </div>
              </div>

              {/* Section 4: Features */}
              <div>
                <span className={labelClass}>✨ Features & Amenities</span>
                <div className="grid grid-cols-2 gap-4">
                  <Toggle label="Balcony" value={balcony} onChange={setBalcony} />
                  <Toggle label="Parking" value={parking} onChange={setParking} />
                  <Toggle label="Garden / Lawn" value={garden} onChange={setGarden} />
                  <Toggle label="Rooftop Terrace" value={rooftop} onChange={setRooftop} />
                </div>
              </div>

              {/* Section 5: Vision */}
              <div className="space-y-3">
                <span className={labelClass}>💬 Your Vision</span>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400">Design Prompt</p>
                  <textarea
                    placeholder="e.g. A peaceful family home with Vastu compliance, lots of natural light..."
                    className="w-full bg-slate-950 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-indigo-500/50 h-24 transition-all font-medium text-sm resize-none"
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400">Additional Details</p>
                  <textarea
                    placeholder="e.g. Home theatre in basement, swimming pool, Italian marble everywhere, smart home automation..."
                    className="w-full bg-slate-950 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-indigo-500/50 h-24 transition-all font-medium text-sm resize-none"
                    value={extraDetails}
                    onChange={e => setExtraDetails(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full btn-primary py-5 uppercase tracking-widest font-black text-sm flex items-center justify-center gap-3 active:scale-95"
              >
                {loading ? (
                  <><i className="bx bx-loader-alt animate-spin text-xl"></i>Thinking...</>
                ) : (
                  <><i className="bx bxs-magic-wand text-xl"></i>Generate AI Design</>
                )}
              </button>
            </div>
          </div>

          {/* ── Results ── */}
          <div className="lg:col-span-2 space-y-10">
            {loading ? (
              <div className="glass-card h-[600px] flex flex-col items-center justify-center text-center p-20 animate-pulse border-indigo-500/20">
                <div className="w-24 h-24 rounded-full bg-indigo-600/20 flex items-center justify-center mb-10 border border-indigo-500/30">
                  <i className="bx bx-atom text-5xl text-indigo-500 animate-spin-slow"></i>
                </div>
                <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">AI Architect is <span className="text-gradient">thinking</span>...</h3>
                <p className="text-slate-500 font-medium">Drafting floor plans, material specs, and cost optimizations for your dream project.</p>
              </div>
            ) : result ? (
              <div className="space-y-10 animate-fade-in">

                {/* Hero Card */}
                <div className="glass-card overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-950/20">
                  <div className="aspect-video relative group">
                    <img
                      src={getStyleImage(result.style || style)}
                      className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700"
                      alt="Architectural concept"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="absolute top-10 left-10 flex gap-3">
                      <span className="bg-indigo-600 text-white text-[10px] font-black px-4 py-2 rounded-full tracking-widest uppercase shadow-lg shadow-indigo-500/40">Concept Ready</span>
                      <span className="bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-black px-4 py-2 rounded-full tracking-widest uppercase border border-white/10">{result.style || style} Style</span>
                    </div>
                  </div>
                  <div className="p-12 relative -mt-32 z-10">
                    <div className="mb-8 p-6 bg-slate-950/60 rounded-3xl border border-indigo-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(79,70,229,0.15)]">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2 border-b border-indigo-500/20 pb-2">Client Vision</h4>
                      <p className="text-slate-200 text-lg font-medium italic">"{result.userPrompt}"</p>
                      {result.extraDetails && <p className="text-slate-400 text-sm mt-2">{result.extraDetails}</p>}
                    </div>
                    
                    <h2 className="text-4xl font-black mb-6 uppercase tracking-tighter">Architectural <span className="text-gradient">Description</span></h2>
                    <p className="text-slate-300 text-xl leading-relaxed font-light italic bg-slate-950/50 p-8 rounded-3xl border border-white/5 backdrop-blur-md">
                      "{result.description}"
                    </p>
                    {result.architect_notes && (
                      <div className="mt-6 flex items-start gap-3 p-5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                        <i className="bx bxs-quote-alt-left text-2xl text-indigo-400 mt-0.5"></i>
                        <p className="text-sm text-indigo-300 font-medium italic">{result.architect_notes}</p>
                      </div>
                    )}
                    {error && <p className="mt-6 text-rose-400 text-xs font-bold uppercase tracking-widest"><i className="bx bx-error-circle"></i> {error}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Features */}
                  <div className="glass-card p-10 bg-slate-900/40">
                    <h3 className="text-xl font-black mb-8 uppercase tracking-tighter border-b border-white/5 pb-4">Key <span className="text-gradient">Features</span></h3>
                    <ul className="space-y-4">
                      {(result.features || []).map((f: string, i: number) => (
                        <li key={i} className="flex items-start gap-4 text-slate-300 font-medium text-sm">
                          <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20 flex-shrink-0 mt-0.5">
                            <i className="bx bx-check text-sm"></i>
                          </div>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Budget + Materials + Timeline */}
                  <div className="glass-card p-10 bg-slate-900/40 border-indigo-500/20 space-y-6">
                    <h3 className="text-xl font-black uppercase tracking-tighter border-b border-white/5 pb-4">Budgetary <span className="text-gradient">HUD</span></h3>
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Estimated Cost Range</p>
                      <p className="text-4xl font-black text-indigo-400 tracking-tighter leading-none">{result.estimatedBudget}</p>
                    </div>
                    {result.constructionTimeline && (
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                        <i className="bx bx-time-five text-xl text-violet-400"></i>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Construction Timeline</p>
                          <p className="text-white font-black">{result.constructionTimeline}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {(result.materials || []).map((m: string, i: number) => (
                        <span key={i} className="bg-white/5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-white/5 text-slate-400">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="glass-card p-10 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
                  <div className="absolute -right-10 -top-10 w-48 h-48 bg-indigo-600/20 blur-3xl rounded-full" />
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Ready to <span className="text-gradient">Build</span>?</h3>
                    <p className="text-slate-400 font-medium">We've found builders specializing in this architectural style.</p>
                  </div>
                  <div className="flex gap-4 relative z-10">
                    <button onClick={handleGenerate} className="btn-secondary whitespace-nowrap px-8 group">
                      <i className="bx bx-refresh mr-2 group-hover:rotate-180 transition-transform duration-500"></i>Regenerate
                    </button>
                    <Link href="/builders" prefetch={false} className="btn-primary whitespace-nowrap px-10 group">
                      Match with Builders <i className="bx bx-right-arrow-alt ml-2 group-hover:translate-x-2 transition-transform"></i>
                    </Link>
                  </div>
                </div>

              </div>
            ) : (
              <div className="glass-card h-[600px] flex flex-col items-center justify-center text-center p-20 border-dashed border-white/5">
                <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
                  <i className="bx bx-pencil text-5xl text-slate-700"></i>
                </div>
                <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Draft Your <span className="text-gradient">Legacy</span></h3>
                <p className="text-slate-500 max-w-md font-medium leading-relaxed">Configure your requirements on the left and let the AI Architect generate your bespoke construction concept.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
