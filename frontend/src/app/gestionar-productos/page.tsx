"use client";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/config";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

export default function GestionarProductos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      setProducts(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchProducts();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const url = editId ? `${API_URL}/products/${editId}` : `${API_URL}/products`;
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ name, description, price: parseFloat(price) })
      });
      if (!res.ok) throw new Error(editId ? "Error al editar" : "Error al crear");
      setMessage(editId ? "¡Producto editado con éxito!" : "¡Producto creado con éxito!");
      setName("");
      setDescription("");
      setPrice("");
      setEditId(null);
      fetchProducts();
      setTimeout(() => setMessage(""), 3000);
    } catch (e: any) {
      setMessage(e.message);
    }
  };

  const handleEdit = (p: Product) => {
    setEditId(p.id);
    setName(p.name);
    setDescription(p.description);
    setPrice(p.price.toString());
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas borrar este producto?")) return;
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        fetchProducts();
        setMessage("Producto borrado.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container">
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>Gestionar Productos</h2>
      {message && <div style={{ background: message.includes('Error') ? '#ef4444' : '#10b981', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center' }}>{message}</div>}

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <div className="glass form-container" style={{ flex: 1 }}>
          <h3 style={{ marginBottom: '1rem' }}>{editId ? "Editar Producto" : "Nuevo Producto"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre del Producto</label>
              <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea className="form-input" rows={4} value={description} onChange={e => setDescription(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Precio (€)</label>
              <input type="number" step="0.01" className="form-input" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>
            <button type="submit" className="btn" style={{ width: '100%' }}>{editId ? "Guardar Cambios" : "Crear Producto"}</button>
            {editId && <button type="button" className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }} onClick={() => {setEditId(null); setName(""); setDescription(""); setPrice("");}}>Cancelar</button>}
          </form>
        </div>

        <div style={{ flex: 2 }}>
          <div className="product-grid" style={{ gridTemplateColumns: '1fr' }}>
            {products.map(p => (
              <div key={p.id} className="glass product-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                <div>
                  <h4 style={{ margin: 0 }}>{p.name}</h4>
                  <p style={{ margin: 0, color: '#a78bfa' }}>${p.price}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-secondary" onClick={() => handleEdit(p)}>Editar</button>
                  <button className="btn" style={{ background: '#ef4444' }} onClick={() => handleDelete(p.id)}>Borrar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
