import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { supabase } from "../../lib/supabase";
import AuthLayout from "./AuthLayout";

export function ForgotPassword() {
  const [email,setEmail]=useState("");const [loading,setLoading]=useState(false);const [message,setMessage]=useState("");const [error,setError]=useState("");
  async function submit(event){event.preventDefault();setLoading(true);setError("");const {error:resetError}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:`${window.location.origin}/reset-password`});setLoading(false);if(resetError){setError(resetError.message);return}setMessage("Check your inbox. We sent you a secure password reset link.")}
  return <AuthLayout eyebrow="ACCOUNT RECOVERY" title="Reset your password." description="Enter your account email and we will send you a secure reset link.">{error&&<div className="auth-alert" role="alert">{error}</div>}{message?<><div className="auth-alert" style={{color:"var(--accent2)"}}>{message}</div><p className="auth-switch"><Link to="/login">Return to sign in</Link></p></>:<form className="auth-form" onSubmit={submit}><div className="auth-field"><label htmlFor="recovery-email">Email address</label><div className="auth-input-shell"><FaEnvelope/><input id="recovery-email" className="auth-input" type="email" value={email} onChange={event=>setEmail(event.target.value)} placeholder="you@example.com" required/></div></div><button className="auth-submit" disabled={loading}>{loading?<><span className="auth-spinner"/> Sending link...</>:"Send reset link →"}</button><p className="auth-switch">Remembered your password? <Link to="/login">Sign in</Link></p></form>}</AuthLayout>
}

export function ResetPassword() {
  const [password,setPassword]=useState("");const [show,setShow]=useState(false);const [loading,setLoading]=useState(false);const [error,setError]=useState("");const navigate=useNavigate();
  async function submit(event){event.preventDefault();if(password.length<6){setError("Your password must contain at least 6 characters.");return}setLoading(true);const {error:updateError}=await supabase.auth.updateUser({password});setLoading(false);if(updateError){setError(updateError.message);return}navigate("/login")}
  return <AuthLayout eyebrow="SECURE YOUR ACCOUNT" title="Choose a new password." description="Use at least six characters and avoid reusing an old password.">{error&&<div className="auth-alert" role="alert">{error}</div>}<form className="auth-form" onSubmit={submit}><div className="auth-field"><label htmlFor="new-password">New password</label><div className="auth-input-shell"><FaLock/><input id="new-password" className="auth-input" type={show?"text":"password"} value={password} onChange={event=>setPassword(event.target.value)} placeholder="Enter a new password" required/><button type="button" className="auth-password-toggle" onClick={()=>setShow(value=>!value)}>{show?<FaEyeSlash/>:<FaEye/>}</button></div></div><button className="auth-submit" disabled={loading}>{loading?<><span className="auth-spinner"/> Updating...</>:"Update password →"}</button></form></AuthLayout>
}

export function CheckEmail() {
  return <AuthLayout eyebrow="ONE MORE STEP" title="Check your inbox." description="We sent a confirmation link to your email address. Open it to activate your Desktopalie account."><div className="auth-alert" style={{color:"var(--accent2)"}}>Your account has been created successfully. You can close this page after confirming your email.</div><p className="auth-switch"><Link to="/login">Continue to sign in</Link></p></AuthLayout>
}
