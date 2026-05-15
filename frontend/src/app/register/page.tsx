"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState("user");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, profile })
      });
      if (!res.ok) throw new Error("Error en el registro");
      router.push("/login");
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="container">
      <div className="glass form-container">
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>Crear Cuenta</h2>
        {error && <p style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Usuario</label>
            <input type="text" className="form-input" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', marginBottom: '1rem' }}>Registrarse</button>
        </form>
        <p style={{ textAlign: 'center', color: '#94a3b8' }}>
          ¿Ya tienes una cuenta? <Link href="/login" style={{ color: '#8b5cf6' }}>Iniciar Sesión</Link>
        </p>
      </div>
    </div>
  );
}
