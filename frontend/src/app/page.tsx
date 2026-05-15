export default function Home() {
  return (
    <main className="container">
      <section className="hero">
        <h1>Mi Currículum Vitae</h1>
        <div className="glass" style={{ padding: '2rem', textAlign: 'left', marginTop: '2rem', maxWidth: '800px', margin: '2rem auto' }}>
          <h2 style={{ color: '#a78bfa', marginBottom: '1rem' }}>Datos Personales</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}><strong>Nombre:</strong>Francisco Parra Caparros</p>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}><strong>Especialidad:</strong>Grado superior en Técnico Superior en Administración de Sistemas Informáticos en Red </p>

          <h2 style={{ color: '#a78bfa', marginTop: '2rem', marginBottom: '1rem' }}>Experiencia</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Desarrollo completo de aplicaciones modernas e interactivas para e-commerce.</p>

          <h2 style={{ color: '#a78bfa', marginTop: '2rem', marginBottom: '1rem' }}>Habilidades</h2>
          <ul style={{ fontSize: '1.1rem', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
            <li>Diseño Frontend con Tailwind CSS, Vanilla CSS y Glassmorphism</li>
            <li>Autenticación segura JWT con Passport</li>
            <li>Gestión de base de datos relacionales con TypeORM y SQLite/Postgres</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
