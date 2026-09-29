"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type FormState = "idle" | "sending-code" | "submitting" | "error" | "success";

export function AdminSetup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  function resetState() {
    if (state !== "success") setState("idle");
  }

  async function sendCode() {
    setState("sending-code");
    setMessage("");
    try {
      const response = await fetch("/api/admin/setup/send-code", { method: "POST" });
      const body = (await response.json()) as { message?: string };
      if (!response.ok) {
        setState("error");
        setMessage(body.message ?? "We could not send a verification code. Please try again.");
        return;
      }
      setCodeSent(true);
      setState("idle");
      setMessage("A six-digit verification code has been sent to the designated owner inbox.");
    } catch {
      setState("error");
      setMessage("We could not reach the server. Please try again.");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setState("error");
      setMessage("Passwords do not match.");
      return;
    }

    setState("submitting");
    setMessage("");
    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, verificationCode }),
      });
      const body = (await response.json()) as { message?: string };
      if (!response.ok) {
        setState("error");
        setMessage(body.message ?? "We could not create the administrator account. Please try again.");
        return;
      }
      setState("success");
      setMessage("Administrator account created. Sign in to continue.");
    } catch {
      setState("error");
      setMessage("We could not reach the server. Please try again.");
    }
  }

  return <main className="admin-login"><div className="admin-login__brand"><span>✦</span><b>STAR</b> ENERGIES <small>ADMINISTRATION</small></div><section><p>OWNER ONBOARDING</p><h1>Create administrator account</h1><span>To protect the sole owner account, verify access to the designated owner inbox before creating your login. Once created, this setup page closes permanently.</span>{state === "success" ? <div className="admin-login__complete" role="status"><p>{message}</p><button type="button" onClick={() => router.replace("/admin/login")}>Continue to sign in</button></div> : <form onSubmit={submit}><label>Your name<input type="text" autoComplete="name" value={name} onChange={(event) => { setName(event.target.value); resetState(); }} required /></label><label>Administrator email<input type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); resetState(); }} required /></label><label>Password<input type="password" autoComplete="new-password" minLength={12} value={password} onChange={(event) => { setPassword(event.target.value); resetState(); }} required /><small>At least 12 characters.</small></label><label>Confirm password<input type="password" autoComplete="new-password" minLength={12} value={confirmPassword} onChange={(event) => { setConfirmPassword(event.target.value); resetState(); }} required /></label><div className="admin-setup-code"><button type="button" onClick={sendCode} disabled={state === "sending-code" || state === "submitting"}>{state === "sending-code" ? "Sending code…" : codeSent ? "Send a new code" : "Send verification code"}</button><label>Verification code<input inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={verificationCode} onChange={(event) => { setVerificationCode(event.target.value.replace(/\D/g, "")); resetState(); }} required /></label></div>{message && <p className="admin-setup-message" role={state === "error" ? "alert" : "status"}>{message}</p>}<button type="submit" disabled={state === "submitting" || state === "sending-code"}>{state === "submitting" ? "Creating account…" : "Create administrator"}</button></form>}</section><footer>STAR ENERGIES · WANI, MAHARASHTRA</footer></main>;
}
