'use client';

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Car, ChevronRight, SlidersHorizontal, Gauge, Sparkles, ShieldCheck, Stars, MapPin } from "lucide-react";

type Offer = {
  id: string;
  make: string;
  model: string;
  trim?: string;
  year: number;
  monthly: number;
  dueAtSigning: number;
  termMonths: number;
  mileage: number;
  bodyType: string;
  drivetrain: string;
  mpgCity?: number | null;
  mpgHwy?: number | null;
  msrp?: number;
  state?: string;
  expiration?: string;
  image: string;
  ev?: boolean;
  mpge?: number;
};

const OFFERS: Offer[] = [
  {
    id: "1",
    make: "Toyota",
    model: "Camry",
    trim: "SE",
    year: 2025,
    monthly: 329,
    dueAtSigning: 2999,
    termMonths: 36,
    mileage: 12000,
    bodyType: "Sedan",
    drivetrain: "FWD",
    mpgCity: 28,
    mpgHwy: 39,
    msrp: 29250,
    state: "CA",
    expiration: "2025-11-30",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1d?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "2",
    make: "Subaru",
    model: "Forester",
    trim: "Premium",
    year: 2025,
    monthly: 359,
    dueAtSigning: 2499,
    termMonths: 36,
    mileage: 12000,
    bodyType: "SUV",
    drivetrain: "AWD",
    mpgCity: 26,
    mpgHwy: 33,
    msrp: 31695,
    state: "CA",
    expiration: "2025-11-30",
    image: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "3",
    make: "Tesla",
    model: "Model 3",
    trim: "RWD",
    year: 2025,
    monthly: 419,
    dueAtSigning: 3999,
    termMonths: 36,
    mileage: 10000,
    bodyType: "Sedan",
    drivetrain: "RWD",
    mpgCity: null,
    mpgHwy: null,
    msrp: 38990,
    ev: true,
    mpge: 132,
    state: "CA",
    expiration: "2025-11-30",
    image: "https://images.unsplash.com/photo-1620891549027-8427f94c603a?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "4",
    make: "Honda",
    model: "CR-V",
    trim: "EX-L",
    year: 2025,
    monthly: 339,
    dueAtSigning: 2999,
    termMonths: 36,
    mileage: 10000,
    bodyType: "SUV",
    drivetrain: "AWD",
    mpgCity: 27,
    mpgHwy: 32,
    msrp: 34950,
    state: "CA",
    expiration: "2025-11-30",
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "5",
    make: "BMW",
    model: "i4",
    trim: "eDrive40",
    year: 2025,
    monthly: 549,
    dueAtSigning: 4999,
    termMonths: 36,
    mileage: 10000,
    bodyType: "Sedan",
    drivetrain: "RWD",
    msrp: 61700,
    ev: true,
    mpge: 109,
    state: "CA",
    expiration: "2025-11-30",
    image: "https://images.unsplash.com/photo-1620177089131-7fc4910e0f66?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "6",
    make: "Ford",
    model: "F-150",
    trim: "XLT",
    year: 2025,
    monthly: 479,
    dueAtSigning: 3999,
    termMonths: 36,
    mileage: 10000,
    bodyType: "Truck",
    drivetrain: "4WD",
    mpgCity: 20,
    mpgHwy: 26,
    msrp: 45765,
    state: "CA",
    expiration: "2025-11-30",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1d?q=80&w=1600&auto=format&fit=crop",
  },
];

const MAKES = Array.from(new Set(OFFERS.map(o => o.make))).sort();
const BODY_TYPES = Array.from(new Set(OFFERS.map(o => o.bodyType))).sort();
const DRIVETRAINS = ["FWD", "RWD", "AWD", "4WD"];

function classNames(...classes: (string | false | null | undefined)[]) { 
  return classes.filter(Boolean).join(" "); 
}

export default function Page() {
  const [payment, setPayment] = useState(400); // monthly ceiling
  const [make, setMake] = useState("");
  const [body, setBody] = useState("");
  const [drives, setDrives] = useState<string[]>([]);
  const [minMpg, setMinMpg] = useState(0);
  const [zeroDown, setZeroDown] = useState(false);
  const [term, setTerm] = useState<string | number>("");
  const [mileage, setMileage] = useState<string | number>("");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    return OFFERS.filter(o => {
      const meetsPayment = o.monthly <= payment;
      const meetsMake = !make || o.make === make;
      const meetsBody = !body || o.bodyType === body;
      const meetsDrive = drives.length === 0 || drives.includes(o.drivetrain);
      const meetsMpg = o.ev ? true : ((o.mpgCity ?? 0) >= minMpg || (o.mpgHwy ?? 0) >= minMpg);
      const meetsZeroDown = !zeroDown || (o.dueAtSigning === 0);
      const meetsTerm = !term || o.termMonths === Number(term);
      const meetsMileage = !mileage || o.mileage === Number(mileage);
      const meetsQuery = !query || [o.make, o.model, o.trim].join(" ").toLowerCase().includes(query.toLowerCase());
      return meetsPayment && meetsMake && meetsBody && meetsDrive && meetsMpg && meetsZeroDown && meetsTerm && meetsMileage && meetsQuery;
    }).sort((a,b) => a.monthly - b.monthly);
  }, [payment, make, body, drives, minMpg, zeroDown, term, mileage, query]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-slate-900 text-white grid place-content-center"><Car className="h-5 w-5"/></div>
            <div className="font-semibold text-slate-900 text-lg">CurrentLeaseDeals<span className="text-slate-400">.com</span></div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-slate-600">
            <a className="hover:text-slate-900" href="#makes">By Make</a>
            <a className="hover:text-slate-900" href="#types">By Type</a>
            <a className="hover:text-slate-900" href="#payment">By Payment</a>
            <a className="hover:text-slate-900" href="#zero">Zero Down</a>
          </nav>
          <button className="px-3 py-2 rounded-xl bg-slate-900 text-white text-sm hover:shadow-md">Get Deal Alerts</button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.h1 initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.5}} className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
              Find <span className="bg-yellow-200 px-2 rounded-xl">Current</span> Car Lease Deals by <span className="underline decoration-wavy">Monthly Payment</span>
            </motion.h1>
            <p className="mt-4 text-slate-600 md:text-lg">Search offers from every major manufacturer. Filter by payment first, then refine by make, body type, MPG/MPGe, drivetrain, term and more.</p>
            <ul className="mt-4 text-slate-600 grid gap-2">
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4"/> Verified offers • Updated monthly</li>
              <li className="flex items-center gap-2"><Stars className="h-4 w-4"/> Zero-down & regional incentives supported</li>
              <li className="flex items-center gap-2"><Sparkles className="h-4 w-4"/> No spam, no fluff—just the numbers</li>
            </ul>
          </div>
          <div>
            <div className="rounded-2xl shadow-xl border border-slate-200 p-4 md:p-6 bg-white">
              <div className="flex items-center gap-2 text-slate-700 font-medium"><SlidersHorizontal className="h-4 w-4"/> Quick Search</div>
              <div className="mt-4 grid gap-4">
                <div>
                  <label className="text-sm text-slate-600">Max Monthly Payment: <span className="font-semibold text-slate-900">{payment}</span></label>
                  <input type="range" min={150} max={1000} step={5} value={payment} onChange={e=>setPayment(Number(e.target.value))} className="w-full"/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select value={make} onChange={e=>setMake(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2">
                    <option value="">Any Make</option>
                    {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select value={body} onChange={e=>setBody(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2">
                    <option value="">Any Type</option>
                    {BODY_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select value={term} onChange={e=>setTerm(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2">
                    <option value="">Any Term</option>
                    {[24, 27, 30, 36, 39, 42].map(t => <option key={t} value={t}>{t} mo</option>)}
                  </select>
                  <select value={mileage} onChange={e=>setMileage(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2">
                    <option value="">Any Mileage</option>
                    {[7500, 10000, 12000, 15000].map(m => <option key={m} value={m}>{m.toLocaleString()} / yr</option>)}
                  </select>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <input id="zero" type="checkbox" checked={zeroDown} onChange={e=>setZeroDown(e.target.checked)} />
                    <label htmlFor="zero" className="text-sm">Zero Down Only</label>
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">Min MPG / MPGe</label>
                    <input type="number" min={0} max={150} value={minMpg} onChange={e=>setMinMpg(Number(e.target.value))} className="rounded-xl border border-slate-300 px-3 py-2 w-full" placeholder="e.g., 30" />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {DRIVETRAINS.map(d => (
                      <button key={d} onClick={()=> setDrives(prev => prev.includes(d) ? prev.filter(x=>x!==d) : [...prev, d])} className={classNames("px-3 py-1 rounded-xl border", drives.includes(d) ? "bg-slate-900 text-white border-slate-900" : "border-slate-300 text-slate-700 hover:bg-slate-100")}>{d}</button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search make, model or trim" className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300"/>
                  </div>
                  <a href="#results" className="px-4 py-2 rounded-xl bg-slate-900 text-white flex items-center gap-2 hover:shadow-md">Search <ChevronRight className="h-4 w-4"/></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section id="results" className="mx-auto max-w-7xl px-4 pb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900">{results.length} deals under {payment}/mo</h2>
          <div className="text-sm text-slate-600">Sort by: <span className="font-medium">Lowest payment</span></div>
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-8 text-center text-slate-600">
            No deals match your filters. Try increasing max payment or clearing some filters.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map(o => (
              <motion.div key={o.id} initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{duration:0.25}} className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md">
                <div className="relative">
                  
                  <img src={o.image} alt={`${o.make} ${o.model}`} className="h-44 w-full object-cover"/>
                  <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs flex items-center gap-1"><MapPin className="h-3 w-3"/> {o.state ?? "US"}</div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-slate-900 font-semibold">{o.year} {o.make} {o.model}</div>
                      <div className="text-slate-600 text-sm">{o.trim} • {o.bodyType} • {o.drivetrain}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{o.monthly}<span className="text-sm font-normal text-slate-600">/mo</span></div>
                      <div className="text-xs text-slate-500">{(o.dueAtSigning ?? 0).toLocaleString()} due</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs mt-3 text-slate-700">
                    <div className="rounded-xl border border-slate-200 px-2 py-1 flex items-center gap-1"><Gauge className="h-3 w-3"/> {o.ev ? `${o.mpge} MPGe` : `${o.mpgCity}/${o.mpgHwy} MPG`}</div>
                    <div className="rounded-xl border border-slate-200 px-2 py-1">{o.termMonths} mo</div>
                    <div className="rounded-xl border border-slate-200 px-2 py-1">{o.mileage.toLocaleString()} mi/yr</div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-slate-500">MSRP {(o.msrp ?? 0).toLocaleString()}</div>
                    <a href="#" className="text-sm font-medium text-slate-900 hover:underline inline-flex items-center gap-1">View details <ChevronRight className="h-4 w-4"/></a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-3 gap-6 text-sm text-slate-600">
          <div>
            <div className="font-semibold text-slate-900 mb-2">About</div>
            <p>CurrentLeaseDeals.com helps shoppers quickly find and compare today’s best car lease offers by monthly payment, make, type, MPG/MPGe, drivetrain, term, mileage and more.</p>
          </div>
          <div>
            <div className="font-semibold text-slate-900 mb-2">Resources</div>
            <ul className="grid gap-1">
              <li><a className="hover:underline" href="#">Best Lease Deals – November 2025</a></li>
              <li><a className="hover:underline" href="#">Zero-Down Lease Deals</a></li>
              <li><a className="hover:underline" href="#">Leasing 101: How Leasing Works</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-slate-900 mb-2">Legal</div>
            <ul className="grid gap-1">
              <li><a className="hover:underline" href="#">Terms</a></li>
              <li><a className="hover:underline" href="#">Privacy</a></li>
              <li><a className="hover:underline" href="#">Disclosures</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-slate-500 pb-8">© {new Date().getFullYear()} CurrentLeaseDeals.com</div>
      </footer>
    </div>
  );
}
