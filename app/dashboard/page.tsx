"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const [profile,setProfile]=useState<any>(null);
  const [counts,setCounts]=useState({active:0,qualified:0,wins:0,certificates:0});
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    (async()=>{
      const {data:{user}}=await supabase.auth.getUser();
      if(!user){window.location.href="/login";return;}
      const [{data:p},{data:auditions}]=await Promise.all([
        supabase.from("profiles").select("*").eq("id",user.id).single(),
        supabase.from("auditions").select("status").eq("participant_id",user.id)
      ]);
      setProfile(p);
      const rows=auditions||[];
      setCounts({
        active:rows.filter(x=>["submitted","under_review","qualified"].includes(x.status)).length,
        qualified:rows.filter(x=>x.status==="qualified").length,
        wins:0,
        certificates:0
      });
      setLoading(false);
    })();
  },[]);

  async function logout(){await supabase.auth.signOut();window.location.href="/";}

  if(loading)return <div className="shell"><main className="container page"><div className="notice">Loading your dashboard…</div></main></div>;

  return <div className="shell"><nav className="nav"><Link href="/" className="brand">talento<span>.</span></Link><div className="navlinks"><Link href="/competitions">Competitions</Link><Link href="/organizer">Organizer</Link></div><button className="btn ghost" onClick={logout}>Logout</button></nav><main className="container page"><h1>My dashboard</h1><p className="muted">Welcome, {profile?.full_name || "Talento participant"}.</p><div className="kpis" style={{margin:"25px 0"}}><div className="card kpi"><b>{counts.active}</b><p className="muted">Active auditions</p></div><div className="card kpi"><b>{counts.qualified}</b><p className="muted">Qualified rounds</p></div><div className="card kpi"><b>{counts.wins}</b><p className="muted">Wins</p></div><div className="card kpi"><b>{counts.certificates}</b><p className="muted">Certificates</p></div></div><div className="grid"><div className="panel"><h3>Find your next competition</h3><p className="muted">Browse categories and submit an audition.</p><Link className="btn primary" href="/competitions">Explore competitions</Link></div><div className="panel"><h3>My profile</h3><p className="muted">{profile?.email || ""}{profile?.phone ? " · "+profile.phone : ""}</p><span className="pill">{profile?.role || "participant"}</span></div></div></main></div>;
}