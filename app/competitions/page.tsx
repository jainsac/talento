"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Competition={id:string;title:string;category:string|null;status:string;audition_fee:number;currency:string};

export default function Competitions(){
 const[cat,setCat]=useState("All"); const[data,setData]=useState<Competition[]>([]); const[loading,setLoading]=useState(true);
 const cats=["All","Dance","Arts & Craft","Science","Games","Singing","Content"];
 useEffect(()=>{(async()=>{const{data,error}=await supabase.from("competitions").select("id,title,category,status,audition_fee,currency").in("status",["published","live","completed"]).order("created_at",{ascending:false}); if(!error)setData(data||[]); setLoading(false);})()},[]);
 const list=cat==="All"?data:data.filter(x=>x.category===cat);
 return <div className="shell"><nav className="nav"><Link href="/" className="brand">talento<span>.</span></Link><div className="navlinks"><Link href="/competitions">Competitions</Link><Link href="/organizer">For Organizers</Link><Link href="/admin">Admin</Link></div><Link className="btn ghost" href="/">Home</Link></nav><main className="container page"><Link className="back" href="/">← Back to home</Link><h1>Competitions</h1><p className="muted">Discover open auditions, live rounds and upcoming talent events.</p><div className="filters">{cats.map(c=><button className={"btn "+(cat===c?"primary":"ghost")} onClick={()=>setCat(c)} key={c}>{c}</button>)}</div>{loading?<div className="notice">Loading competitions…</div>:list.length===0?<div className="notice">No published competitions in this category yet.</div>:<div className="grid">{list.map(c=><Link href={c.title==="India Dance League 2026"?"/competitions/india-dance-league-2026":"/competitions"} className="card competition" key={c.id}><div className="top"><span className="pill">{c.status==="live"?"LIVE":c.status==="completed"?"COMPLETED":"OPEN"}</span><span className="fee">{Number(c.audition_fee)===0?"Free":"₹"+Number(c.audition_fee)}</span></div><h3>{c.title}</h3><p>{c.category||"Open category"} · India</p><div className="meta"><span>Audition entry</span><span>Details →</span></div></Link>)}</div>}</main></div>;
}