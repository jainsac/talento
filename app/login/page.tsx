"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    window.location.href = "/dashboard";
  }

  return <div className="shell"><nav className="nav"><Link href="/" className="brand">talento<span>.</span></Link><Link className="btn ghost" href="/">Home</Link></nav><main className="container page"><div className="panel" style={{maxWidth:520,margin:"40px auto"}}><h1 style={{fontSize:36}}>Welcome back</h1><p className="muted">Login to manage auditions, competitions and your Talento profile.</p><form onSubmit={submit}><label className="label">Email</label><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com"/><label className="label" style={{marginTop:14}}>Password</label><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••"/><div className="actions"><button className="btn primary" type="submit" disabled={busy}>{busy?"Signing in…":"Login"}</button><Link className="btn ghost" href="/register">Create account</Link></div></form>{message&&<div className="notice" style={{marginTop:18}}>{message}</div>}</div></main></div>;
}