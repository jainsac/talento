"use client";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Organizer(){
 const[form,setForm]=useState({title:"",category:"Dance",fee:"0",mode:"Online",description:""});
 const[message,setMessage]=useState(""); const[busy,setBusy]=useState(false);
 async function create(){
  setMessage("");
  if(!form.title.trim()){setMessage("Competition name is required.");return;}
  const fee=Number(form.fee); if(!Number.isFinite(fee)||fee<0){setMessage("Enter a valid audition fee.");return;}
  setBusy(true);
  const{data:{user}}=await supabase.auth.getUser();
  if(!user){setBusy(false);setMessage("Please log in before creating a competition.");return;}
  const{data:competition,error}=await supabase.from("competitions").insert({organizer_id:user.id,title:form.title.trim(),category:form.category,audition_fee:fee,description:form.description,status:"draft"}).select().single();
  if(error){setBusy(false);setMessage(error.message);return;}
  const stages=["Audition","Round 1","Elimination","Semi-final","Grand Final"];
  const{error:stageError}=await supabase.from("competition_stages").insert(stages.map((name,i)=>({competition_id:competition.id,name,stage_order:i+1,status:i===0?"open":"upcoming"})));
  setBusy(false);
  setMessage(stageError?"Competition created, but stages need attention: "+stageError.message:"Competition draft created successfully with all 5 stages.");
 }
 return <div className="shell"><nav className="nav"><Link href="/" className="brand">talento<span>.</span></Link><div className="navlinks"><Link href="/competitions">Competitions</Link><Link href="/admin">Admin</Link></div><Link className="btn ghost" href="/">Home</Link></nav><main className="container page"><Link className="back" href="/">← Home</Link><h1>Organizer workspace</h1><p className="muted">Create and manage a structured competition from audition to grand final.</p><div className="panel" style={{maxWidth:900,marginTop:25}}><div className="formgrid"><div><label className="label">Competition name</label><input className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. National Dance Championship"/></div><div><label className="label">Category</label><select className="input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Dance</option><option>Arts & Craft</option><option>Science</option><option>Games</option><option>Singing</option><option>Content</option></select></div><div><label className="label">Audition fee (INR)</label><input className="input" type="number" min="0" step="1" value={form.fee} onChange={e=>setForm({...form,fee:e.target.value})} placeholder="0 / 9 / custom"/></div><div><label className="label">Competition mode</label><select className="input" value={form.mode} onChange={e=>setForm({...form,mode:e.target.value})}><option>Online</option><option>Hybrid</option><option>Offline</option></select></div><div style={{gridColumn:"1/-1"}}><label className="label">Description</label><textarea className="input" rows={5} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Competition rules, eligibility, prizes and judging criteria..."/></div></div><div className="notice" style={{margin:"18px 0"}}>Recommended lifecycle: Season → Audition → Round 1 → Elimination → Semi-final → Grand Final.</div><button className="btn primary" disabled={busy} onClick={create}>{busy?"Creating…":"Create competition draft"}</button>{message&&<div className="notice" style={{marginTop:18}}>{message}</div>}</div></main></div>;
}