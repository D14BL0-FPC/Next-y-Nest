"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/config";

interface Purchase {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
}

export default function Carrito() {
  const [items, setItems] = useState<Purchase[]>([]);
  const [profile, setProfile] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/purchases/cart`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setItems(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setProfile(payload.profile);
    } catch (e) {}
    fetchCart();
  }, [router]);

  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      await fetch(`${API_URL}/purchases/cart/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ quantity })
      });
      fetchCart();
    } catch (e) {
      console.error(e);
    }
  };

  const removeItem = async (id: number) => {
    try {
      await fetch(`${API_URL}/purchases/cart/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      fetchCart();
    } catch (e) {
      console.error(e);
    }
  };

  const checkout = async () => {
    try {
      const res = await fetch(`${API_URL}/purchases/checkout`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        setMessage("¡Pago realizado con éxito! Tu carrito ahora está vacío.");
        setItems([]);
      }
    } catch (e) {
      setMessage("Error al realizar el pago.");
    }
  };

  const total = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  if (loading) return <div className="container" style={{textAlign: 'center', marginTop: '4rem'}}>Cargando carrito...</div>;

  return (
    <div className="container">
      <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', background: '-webkit-linear-gradient(45deg, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Mi Carrito de Compra
      </h2>
      
      {message && <div style={{ background: message.includes('Error') ? '#ef4444' : '#10b981', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center' }}>{message}</div>}

      {items.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '1.25rem' }}>No hay productos en el carrito.</p>
      ) : (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {items.map(item => (
            <div key={item.id} className="glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', marginBottom: '1rem' }}>
              <div style={{ flex: 2 }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{item.product.name}</h3>
                <p style={{ color: '#a78bfa', margin: '0.25rem 0 0 0' }}>${item.product.price} c/u</p>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem' }} onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span style={{ fontSize: '1.25rem' }}>{item.quantity}</span>
                <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem' }} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>${(item.product.price * item.quantity).toFixed(2)}</p>
                <button className="btn" style={{ background: '#ef4444', padding: '0.25rem 1rem' }} onClick={() => removeItem(item.id)}>Eliminar</button>
              </div>
            </div>
          ))}
          
          <div className="glass" style={{ padding: '2rem', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#94a3b8' }}>Subtotal:</h3>
              <p style={{ fontSize: '2.5rem', margin: '0.5rem 0 0 0', color: '#a78bfa', fontWeight: 700 }}>${total.toFixed(2)}</p>
            </div>
            <button className="btn" style={{ fontSize: '1.25rem', padding: '1rem 3rem' }} onClick={checkout}>Pagar</button>
          </div>
        </div>
      )}
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <Link href="/productos" className="btn btn-secondary">&larr; Seguir Comprando</Link>
      </div>
    </div>
  );
}
