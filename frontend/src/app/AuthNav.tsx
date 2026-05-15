"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthNav() {
  const [profile, setProfile] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setProfile(payload.profile);
        } catch (e) {}
      } else {
        setProfile(null);
      }
    };
    checkToken();
    window.addEventListener('auth-change', checkToken);
    return () => window.removeEventListener('auth-change', checkToken);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setProfile(null);
    window.dispatchEvent(new Event('auth-change'));
    router.push("/");
  };

  return (
    <div className="nav-links">
      <Link href="/" className="btn btn-secondary">Inicio</Link>
      <Link href="/productos" className="btn btn-secondary">Productos</Link>
      {profile ? (
        <>
          <Link href="/gestionar-productos" className="btn btn-secondary">Gestionar Productos</Link>
          {profile === 'admin' && <Link href="/usuarios" className="btn btn-secondary">Usuarios</Link>}
          <Link href="/carrito" className="btn btn-secondary">Carrito</Link>
          <span style={{ color: '#cbd5e1', marginLeft: '1rem', marginRight: '1rem' }}>Perfil: {profile}</span>
          <button onClick={logout} className="btn btn-secondary">Cerrar Sesión</button>
        </>
      ) : (
        <>
          <Link href="/login" className="btn btn-secondary">Login</Link>
          <Link href="/register" className="btn">Registro</Link>
        </>
      )}
    </div>
  );
}
