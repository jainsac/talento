"use client";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Organizer(){
 const[form,setForm]=useState({title:"",category:"Dance",fee:"0",mode:"Online",description:""});
 const[competition,setCompetition]=useState<any>(null);
 const[sponsors,setSponsors]=useState<any[]>([]);
 const[sponsor,setSponsor]=useState({name:"",detail:"",url:"",order:"1",logo:null as File|null});
 const[branding,setBranding]=useState({mode:"moving_strip",seconds:4,footer:true});
 const[message,setMessage]=useState(""); const[busy,setBusy]=useState(false); const[sponsorBusy,setSponsorBusy]=useState(false);
 async function create(){
  setMessage("");
  if(!form.title.trim()){setMessage("Competition name is required.");return;}
  const fee=Number(form.fee); if(!Number.isFinite(fee)||fee<0){setMessage("Enter a valid audition fee.");return;}
  setBusy(true);
  const{data:{user}}=await supabase.auth.getUser();
  if(!user){setBusy(false);setMessage("Please log in before creating a competition.");return;}
  const{data:c,error}=await supabase.from("competitions").insert({organizer_id:user.id,title:form.title.trim(),category:form.category,audition_fee:fee,description:form.description,status:"draft"}).select().single();
  if(error){setBusy(false);setMessage(error.message);return;}
  const stages=["Audition","Round 1","Elimination","Semi-final","Grand Final"];
  const{error:stageError}=await supabase.from("competition_stages").insert(stages.map((name,i)=>({competition_id:c.id,name,stage_order:i+1,status:i===0?"open":"upcoming"})));
  await supabase.from("media_branding").upsert({competition_id:c.id,enabled:true,sponsor_display_mode:"moving_strip",sponsor_rotation_seconds:4,footer_enabled:true},{onConflict:"competition_id"});
  setCompetition(c); setBusy(false);
  setMessage(stageError?"Competition created, but stages need attention: "+stageError.message:"Competition draft created successfully. Sponsor branding is ready to configure.");
 }
 async function loadSponsors(id=competition?.id){
  if(!id)return;
  const{data}=await supabase.from("competition_sponsors").select("*").eq("competition_id",id).order("display_order");
  setSponsors(data||[]);
  const{data:b}=await supabase.from("media_branding").select("sponsor_display_mode,sponsor_rotation_seconds,footer_enabled").eq("competition_id",id).maybeSingle();
  if(b)setBranding({mode:b.sponsor_display_mode||"moving_strip",seconds:b.sponsor_rotation_seconds||4,footer:b.footer_enabled!==false});
 }
 async function addSponsor(){
  if(!competition||!sponsor.name.trim()){setMessage("Sponsor name is required.");return;}
  setSponsorBusy(true); setMessage("");
  let logo_path=null;
  if(sponsor.logo){
   if(sponsor.logo.size>10*1024*1024){setSponsorBusy(false);setMessage("Sponsor logo must be under 10 MB.");return;}
   const ext=sponsor.logo.name.split(".").pop()||"png";
   const path=competition.id+"/"+crypto.randomUUID()+"."+ext;
   const{error}=await supabase.storage.from("sponsor-assets").upload(path,sponsor.logo,{contentType:sponsor.logo.type,upsert:false});
   if(error){setSponsorBusy(false);setMessage("Logo upload failed: "+error.message);return;}
   logo_path=path;
  }
  const{error}=await supabase.from("competition_sponsors").insert({competition_id:competition.id,sponsor_name:sponsor.name.trim(),short_detail:sponsor.detail.trim()||null,website_url:sponsor.url.trim()||null,logo_path,display_order:Number(sponsor.order)||1,enabled:true,show_logo:true,show_detail:true});
  if(error){setSponsorBusy(false);setMessage(error.message);return;}
  setSponsor({name:"",detail:"",url:"",order:String(sponsors.length+2),logo:null}); await loadSponsors(); setSponsorBusy(false); setMessage("Sponsor added.");
 }
 async function removeSponsor(id:string){await supabase.from("competition_sponsors").delete().eq("id",id);await loadSponsors();}
 async function saveBranding(){
  if(!competition)return;
  await supabase.from("media_branding").update({sponsor_display_mode:branding.mode,sponsor_rotation_seconds:Number(branding.seconds),footer_enabled:branding.footer}).eq("competition_id",competition.id);
  setMessage("Sponsor display settings saved.");
 }
 return <div className="shell"><nav className="nav"><Link href="/" className="brand">talento<span>.</span></Link><div className="navlinks"><Link href="/competitions">Competitions</Link><Link href="/admin">Admin</Link></div><Link className="btn ghost" href="/">Home</Link></nav><main className="container page"><Link className="back" href="/">← Home</Link><h1>Organizer workspace</h1><p className="muted">Create and manage a structured competition from audition to grand final.</p><div className="panel" style={{maxWidth:900,marginTop:25}}><div className="formgrid"><div><label className="label">Competition name</label><input className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. National Dance Championship"/></div><div><label className="label">Category</label><select className="input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Dance</option><option>Arts & Craft</option><option>Science</option><option>Games</option><option>Singing</option><option>Content</option></select></div><div><label className="label">Audition fee (INR)</label><input className="input" type="number" min="0" step="1" value={form.fee} onChange={e=>setForm({...form,fee:e.target.value})}/></div><div><label className="label">Competition mode</label><select className="input" value={form.mode} onChange={e=>setForm({...form,mode:e.target.value})}><option>Online</option><option>Hybrid</option><option>Offline</option></select></div><div style={{gridColumn:"1/-1"}}><label className="label">Description</label><textarea className="input" rows={5} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div></div><div className="notice" style={{margin:"18px 0"}}>Recommended lifecycle: Season → Audition → Round 1 → Elimination → Semi-final → Grand Final.</div><button className="btn primary" disabled={busy} onClick={create}>{busy?"Creating…":"Create competition draft"}</button>{message&&<div className="notice" style={{marginTop:18}}>{message}</div>}</div>
 {competition&&<div className="panel" style={{maxWidth:900,marginTop:18}}><div className="sectionhead"><div><h2>Sponsor branding</h2><p className="muted">Prime sponsor can be shown in the top-right. Additional sponsors rotate in the video footer.</p></div><span className="pill">CONFIGURABLE</span></div><div className="formgrid"><div><label className="label">Footer display style</label><select className="input" value={branding.mode} onChange={e=>setBranding({...branding,mode:e.target.value})}><option value="moving_strip">Moving strip</option><option value="slideshow">Slideshow</option><option value="fade">Fade</option><option value="grid">Grid</option></select></div><div><label className="label">Rotation / cycle seconds</label><input className="input" type="number" min="2" max="15" value={branding.seconds} onChange={e=>setBranding({...branding,seconds:Number(e.target.value)})}/></div><div style={{gridColumn:"1/-1"}}><label className="label"><input type="checkbox" checked={branding.footer} onChange={e=>setBranding({...branding,footer:e.target.checked})}/> Enable sponsor footer</label></div></div><button className="btn ghost" onClick={saveBranding}>Save display settings</button><div className="notice" style={{margin:"18px 0"}}>Video layout: Talento logo top-left · Prime sponsor top-right · Additional sponsors in the footer strip.</div><h3>Add sponsor</h3><div className="formgrid"><div><label className="label">Sponsor name</label><input className="input" value={sponsor.name} onChange={e=>setSponsor({...sponsor,name:e.target.value})} placeholder="Sponsor name"/></div><div><label className="label">Display order</label><input className="input" type="number" min="1" value={sponsor.order} onChange={e=>setSponsor({...sponsor,order:e.target.value})}/></div><div><label className="label">Short detail / tagline</label><input className="input" value={sponsor.detail} onChange={e=>setSponsor({...sponsor,detail:e.target.value})} placeholder="Official partner"/></div><div><label className="label">Website (optional)</label><input className="input" value={sponsor.url} onChange={e=>setSponsor({...sponsor,url:e.target.value})} placeholder="https://..."/></div><div style={{gridColumn:"1/-1"}}><label className="label">Sponsor logo</label><input className="input" type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>setSponsor({...sponsor,logo:e.target.files?.[0]||null})}/></div></div><button className="btn primary" disabled={sponsorBusy} onClick={addSponsor}>{sponsorBusy?"Saving…":"Add sponsor →"}</button><div style={{display:"grid",gap:10,marginTop:20}}>{sponsors.map(s=><div className="card" key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}><div><b>{s.display_order}. {s.sponsor_name}</b><p className="muted">{s.short_detail||"No detail added"}</p></div><button className="btn ghost" onClick={()=>removeSponsor(s.id)}>Remove</button></div>)}</div></div>}</main></div>