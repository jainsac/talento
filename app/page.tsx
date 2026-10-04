"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

const competitions=[
{title:"India Dance League 2026",category:"Dance",mode:"Online + Finale",entries:"742 entries",fee:"Free",status:"Auditions Open"},
{title:"Young Innovators Challenge",category:"Science",mode:"Hybrid",entries:"318 entries",fee:"Free",status:"Auditions Open"},
{title:"ArtVerse India",category:"Arts & Craft",mode:"Online",entries:"186 entries",fee:"₹9",status:"Registration Open"},
{title:"Talento Game Masters",category:"Games",mode:"Online",entries:"524 entries",fee:"Free",status:"Round 1 Live"},
{title:"Future Voices",category:"Singing",mode:"Online",entries:"261 entries",fee:"Free",status:"Auditions Open"},
{title:"Creator Spotlight",category:"Content",mode:"Online",entries:"403 entries",fee:"₹9",status:"Registration Open"}
];
const categories=[["💃","Dance","124 competitions"],["🎨","Arts & Craft","68 competitions"],["🔬","Science","52 competitions"],["🎮","Games","41 competitions"],["🎤","Singing","36 competitions"],["🎬","Content","29 competitions"]];

export default function Home(){
 const [query,setQuery]=useState("");
 const filtered=useMemo(()=>competitions.filter(c=>(c.title+" "+c.category).toLowerCase().includes(query.toLowerCase())),[query]);
 return <div className="shell">
  <nav className="nav"><Link href="/" className="brand">talento<span>.</span></Link><div className="navlinks"><Link href="/competitions">Competitions</Link><Link href="/organizer">For Organizers</Link><Link href="/admin">Admin</Link></div><Link className="btn primary" href="/competitions">Explore</Link></nav>
  <main className="container">
   <section className="hero"><div><span className="eyebrow">India's digital competition network</span><h1>Talent deserves a <span className="gradient">stage.</span></h1><p>Discover competitions, submit your audition, clear every round and compete for recognition, rewards and opportunities.</p><div className="actions"><Link className="btn primary" href="/competitions">Find a Competition →</Link><Link className="btn ghost" href="/organizer">Create a Competition</Link></div></div>
    <div className="hero-card"><h3>Talento at a glance</h3><div className="statgrid"><div className="stat"><b>6+</b><small>Talent categories</small></div><div className="stat"><b>2.4K+</b><small>Audition entries</small></div><div className="stat"><b>₹9</b><small>Future nominal entry fee</small></div><div className="stat"><b>5</b><small>Competition stages</small></div></div><p className="muted">Season → Audition → Rounds → Semi-final → Grand Final</p></div>
   </section>
   <section className="section"><div className="sectionhead"><div><h2>Explore by talent</h2><p className="muted">Find the format that fits your skill.</p></div></div><div className="grid">{categories.map(([icon,name,count])=><Link href="/competitions" className="card category" key={name}><span className="icon">{icon}</span><div><h3>{name}</h3><span className="muted">{count}</span></div></Link>)}</div></section>
   <section className="section"><div className="sectionhead"><div><h2>Live & upcoming</h2><p className="muted">Auditions and registrations currently open.</p></div></div><input aria-label="Search competitions" className="input" placeholder="Search competitions or categories..." value={query} onChange={e=>setQuery(e.target.value)}/><div className="grid" style={{marginTop:16}}>{filtered.map((c,i)=><Link href={i===0?"/competitions/india-dance-league-2026":"/competitions"} className="card competition" key={c.title}><div className="top"><span className="pill">{c.status}</span><span className="fee">{c.fee}</span></div><h3>{c.title}</h3><p>{c.category} · {c.mode}</p><div className="meta"><span>{c.entries}</span><span>View details →</span></div></Link>)}</div></section>
   <section className="section"><div className="sectionhead"><div><h2>How Talento works</h2><p className="muted">A transparent competition journey.</p></div></div><div className="process">{["Choose","Audition","Compete","Qualify","Win"].map((x,i)=><div className="step" key={x}><b>{i+1}</b><h4>{x}</h4><p>{["Pick a competition and read its rules.","Upload your entry before the deadline.","Perform through judge and audience rounds.","Advance through elimination and semi-final stages.","Grand finalists compete for rewards and recognition."][i]}</p></div>)}</div></section>
   <section className="cta"><div><h2>Have a competition idea?</h2><p className="muted">Set up seasons, auditions, rounds, judging and rewards from one organizer workspace.</p></div><Link className="btn primary" href="/organizer">Open Organizer</Link></section>
  </main>
  <footer className="footer"><div className="container">© 2026 Talento · Built for creators, competitors and organizers.</div></footer>
 </div>
}