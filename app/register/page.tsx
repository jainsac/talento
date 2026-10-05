"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Register() {
  const [form,setForm]=useState({name:"",phone:"",email:"",role:"participant",password:"",confirm:""});
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);

  async function submit(e:FormEvent) {
    e.preventDefault();
    setMessage("");
    if (form.password !== form.confirm) { setMessage("Passwords do not match."); return; }
    if (form.password.length < 8) { setMessage("Password must be at least 8 characters."); return; }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name, phone: form.phone, role: form.role } }
    });
    setBusy(false);
    if (error) { setMessage(error.message); return; }
    if (data.session) {
      window.location.href="/dashboard";
      return;
    }
    setMessage("Account created. Please check your email to confirm your account, then log in.");
  }

  return <div className="shell"><nav className="nav"><Link href="/" className="brand">talento<span>.</span></Link><Link className="btn ghost" href="/login">Login</Link></nav><main className="container page"><div className="panel" style={{maxWidth:620,margin:"40px auto"}}><h1 style={{fontSize:36}}>Create your Talento account</h1><p className="muted">Join competitions or create your own talent event.</p><form onSubmit={submit}><div className="formgrid"><div><label className="label">Full name</label><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required placeholder="Your name"/></div><div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required placeholder="+91"/></div><div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required placeholder="you@example.com"/></div><div><label className="label">Account type</label><select className="input" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option value="participant">Participant</option><option value="organizer">Organizer</option></select></div><div><label className="label">Password</label><input className="input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} minLength={8} required placeholder="Minimum 8 characters"/></div><div><label className="label">Confirm password</label><input className="input" type="password" value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})} minLength={8} required placeholder="Repeat password"/></div></div><div className="actions"><button className="btn primary" type="submit" disabled={busy}>{busy?"Creating…":"Create account"}</button></div></form>{message&&<div className="notice" style={{marginTop:18}}>{message}</div>}</div></main></div>;
}