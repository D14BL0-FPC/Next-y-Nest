"use client";
import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { API_URL } from "@/config";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [profile, setProfile] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const fetchProducts = async (searchQuery = "") => {
    try {
      const url = searchQuery ? `${API_URL}/products?query=${encodeURIComponent(searchQuery)}` : `${API_URL}/products`;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProducts();
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

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    fetchProducts(query);
  };

  const addToCart = async (productId: number) => {
    if (!profile) return;
    try {
      const res = await fetch(`${API_URL}/purchases/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ productId, quantity: 1 })
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

  return (
    <main className="container">
      <section className="hero">
        <h1>Descubre Productos Premium</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.25rem', marginBottom: '2rem' }}>Experimenta los artículos de mejor calidad con Aura.</p>
        <form className="search-bar" onSubmit={handleSearch}>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Buscar productos..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn">Buscar</button>
        </form>
      </section>

      {message && <div style={{ background: message.includes('Error') ? '#ef4444' : '#10b981', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center' }}>{message}</div>}

      <div className="product-grid">
        {products.map(p => (
          <div key={p.id} className="glass product-card">
            <h3>{p.name}</h3>
            <p>{p.description.substring(0, 50)}...</p>
            <div className="product-price">${p.price}</div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
              <Link href={`/productos/${p.id}`} className="btn btn-secondary" style={{ flex: 1, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Detalles</Link>
            </div>
          </div>
        ))}
        {products.length === 0 && <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8' }}>No se encontraron productos.</p>}
      </div>
    </main>
  );
}
