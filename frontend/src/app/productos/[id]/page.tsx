"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [profile, setProfile] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3001/products/${params.id}`);
        if (!res.ok) throw new Error("Producto no encontrado");
        const data = await res.json();
        setProduct(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchProduct();

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setProfile(payload.profile);
      } catch (e) {}
    }
  }, [params.id]);

  const addToCart = async () => {
    if (!profile) return;
    try {
      const res = await fetch("http://localhost:3001/purchases/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      });
      if (res.ok) {
        setMessage("¡Producto añadido al carrito!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Error al añadir al carrito.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!product) return <div className="container" style={{textAlign: 'center', marginTop: '4rem'}}>Cargando...</div>;

  return (
    <div className="container">
      <button className="btn btn-secondary" style={{marginBottom: '2rem'}} onClick={() => router.back()}>&larr; Volver</button>
      <div className="glass" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: '-webkit-linear-gradient(45deg, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {product.name}
        </h1>
        <div style={{ fontSize: '2rem', color: '#a78bfa', marginBottom: '2rem', fontWeight: 600 }}>${product.price}</div>
        <p style={{ color: '#cbd5e1', fontSize: '1.25rem', lineHeight: '1.8', marginBottom: '3rem', textAlign: 'left' }}>
          {product.description}
        </p>
        
        {message && <div style={{ background: message.includes('Error') ? '#ef4444' : '#10b981', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>{message}</div>}

        {profile ? (
          <button className="btn" style={{ fontSize: '1.25rem', padding: '1rem 3rem' }} onClick={addToCart}>Añadir al carrito</button>
        ) : (
          <p style={{ color: '#94a3b8' }}>Por favor, inicia sesión para añadir al carrito.</p>
        )}
      </div>
    </div>
  );
}
