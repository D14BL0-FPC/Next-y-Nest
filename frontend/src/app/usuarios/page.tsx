"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/config";

interface User {
  id: number;
  username: string;
  profile: string;
}

export default function Usuarios() {
  const [users, setUsers] = useState<User[]>([]);
  const [profile, setProfile] = useState<string | null>(null);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) setUsers(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setProfile(payload.profile);
      if (payload.profile !== 'admin') {
        router.push("/");
      } else {
        fetchUsers();
      }
    } catch (e) {}
  }, [router]);

  const changeRole = async (id: number, newProfile: string) => {
    try {
      const res = await fetch(`${API_URL}/users/${id}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ profile: newProfile })
      });
      if (res.ok) fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  if (profile !== 'admin') return null;

  return (
    <div className="container">
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Gestión de Usuarios</h2>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {users.map(u => (
          <div key={u.id} className="glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>{u.username}</h3>
            <div>
              <select 
                className="form-input" 
                style={{ margin: 0, padding: '0.5rem', width: 'auto' }} 
                value={u.profile} 
                onChange={(e) => changeRole(u.id, e.target.value)}
              >
                <option value="user" style={{ color: 'black' }}>Usuario</option>
                <option value="admin" style={{ color: 'black' }}>Administrador</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
