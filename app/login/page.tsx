"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function Login(){
 const [message,setMessage]=useState("");
 function submit(e:FormEvent){e.preventDefault();setMessage("Demo login screen ready. Supabase authentication will be connected after the database is linked.");}
 return <div className="shell"><nav className="nav"><Link href="/" className="brand">talento<span>.</span></Link><Link className="btn ghost" href="/">Home</Link></nav><main className="container page"><div className="panel" style={{maxWidth:520,margin:"40px auto"}}><h1 style={{fontSize:36}}>Welcome back</h1><p className="muted">Login to manage auditions, competitions and your Talento profile.</p><form onSubmit={submit}><label className="label">Email</label><input className="input" type="email" required placeholder="you@example.com"/><label className="label" style={{marginTop:14}}>Password</label><input className="input" type="password" required placeholder="••••••••"/><div className="actions"><button className="btn primary" type="submit">Login</button><Link className="btn ghost" href="/register">Create account</Link></div></form>{message&&<div className="notice" style={{marginTop:18}}>{message}</div>}</div></main></div>}