import { useEffect, useState, useCallback } from "react"; 
import { useNavigate } from "react-router-dom";
import ModalNuevaMeta from "./ModalNuevaMeta"; 

export default function Dashboard() {
  const [metas, setMetas] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const navigate = useNavigate();

  const cargarMetas = useCallback(async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/metas");
      if (!res.ok) throw new Error("Error en la red");
      const data = await res.json();
      setMetas(data);
    } catch (error) {
      console.error("Error al cargar metas:", error);
    }
  }, []); 

  useEffect(() => {
    cargarMetas();
  }, [cargarMetas]);

  const borrarMeta = async (id, e) => {
    e.stopPropagation(); 
    if (window.confirm("¿Estás seguro de que quieres eliminar esta meta?")) {
      try {
        await fetch(`http://127.0.0.1:8000/metas/${id}`, { method: 'DELETE' });
        cargarMetas(); 
      } catch (error) {
        console.error("Error al borrar:", error);
      }
    }
  };


  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={styles.logoIcon}>🐷</div>
          <div>
            <h1 style={styles.title}>Mis Metas</h1>
            <p style={styles.subtitle}>Controla tu ahorro paso a paso</p>
          </div>
        </div>
        <button 
          onClick={() => setModalAbierto(true)} 
          style={styles.btnNuevaMeta}
        >
          + Nueva Meta
        </button>
      </div>

      <div style={styles.grid}>
        {/* Lógica del gatito: Si no hay metas, muestra el Empty State */}
        {metas.length === 0 ? (
          <div style={styles.emptyState}>
            <img 
              src="/michi-ahorrador.avif" 
              alt="Michi sin ahorros" 
              style={styles.emptyImage} 
            />
            <h2 style={styles.emptyTitle}>¡Tus michis se llevaron las monedas!</h2>
            <p style={styles.emptySubtitle}>
              Parece que aún no tienes metas. Crea una para empezar a ahorrar.
            </p>
            <button 
              onClick={() => setModalAbierto(true)} 
              style={styles.btnNuevaMeta}
            >
              + Crear mi primera meta
            </button>
          </div>
        ) : (
          metas.map((meta) => (
            <div key={meta.id} style={styles.card} onClick={() => navigate(`/meta/${meta.id}`)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={styles.metaTitle}>{meta.nombre}</h3>
                  <p style={styles.metaDesc}>{meta.descripcion}</p>
                </div>
                <button onClick={(e) => borrarMeta(meta.id, e)} style={styles.btnDelete}>
                  🗑️
                </button>
              </div>

              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Progreso</span>
                  <span style={{ color: '#2563eb', fontWeight: 'bold' }}>{meta.porcentaje_progreso}%</span>
                </div>
                <div style={styles.progressBarBg}>
                  <div 
                    style={{ 
                      ...styles.progressBarFill, 
                      width: `${meta.porcentaje_progreso}%` 
                    }} 
                  />
                </div>
                <div style={styles.progressLabels}>
                  <span>${meta.saldo_actual.toLocaleString()}</span>
                  <span>${meta.monto_objetivo.toLocaleString()}</span>
                </div>
              </div>

              <div style={styles.badgeContainer}>
                <div style={styles.badge}>
                  <div style={styles.badgeIcon}>🌐</div>
                  <div>
                    <div style={styles.badgeLabel}>Faltante</div>
                    <div style={styles.badgeValue}>${meta.cuanto_falta.toLocaleString()}</div>
                  </div>
                </div>
                <div style={styles.badge}>
                  <div style={{ ...styles.badgeIcon, color: '#2563eb' }}>📈</div>
                  <div>
                    <div style={styles.badgeLabel}>Semanal</div>
                    <div style={styles.badgeValue}>${meta.ahorro_semanal_necesario.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div style={styles.cardFooter}>
                <span style={styles.fechaTexto}>
                  📅 {new Date(meta.fecha_termino).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span style={styles.btnVerDetalle}>Ver detalle →</span>
              </div>
            </div>
          ))
        )}
      </div>

      <ModalNuevaMeta 
        isOpen={modalAbierto} 
        onClose={() => setModalAbierto(false)} 
        onActualizar={cargarMetas} 
      />
    </div>
  );
}

const styles = {
  container: { padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', maxWidth: '1200px', margin: '0 auto 40px auto' },
  logoIcon: { backgroundColor: '#2563eb', width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)' },
  title: { fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#0f172a' },
  subtitle: { color: '#64748b', margin: 0, fontSize: '16px' },
  btnNuevaMeta: { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '25px', maxWidth: '1200px', margin: '0 auto' },
  card: { backgroundColor: 'white', padding: '28px', borderRadius: '28px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', cursor: 'pointer' },
  metaTitle: { margin: 0, fontSize: '20px', fontWeight: '700', color: '#1e293b' },
  metaDesc: { color: '#94a3b8', fontSize: '14px', marginTop: '4px' },
  btnDelete: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', opacity: 0.4 },
  progressBarBg: { backgroundColor: '#e2e8f0', height: '12px', borderRadius: '10px', overflow: 'hidden' },
  progressBarFill: { backgroundColor: '#2563eb', height: '100%', borderRadius: '10px', transition: 'width 0.6s ease-out' },
  progressLabels: { display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '13px', fontWeight: '600', color: '#475569' },
  badgeContainer: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '25px' },
  badge: { backgroundColor: '#f1f5f9', padding: '14px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '12px' },
  badgeIcon: { backgroundColor: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' },
  badgeLabel: { fontSize: '10px', color: '#64748b', textTransform: 'uppercase' },
  badgeValue: { fontWeight: '700', fontSize: '15px', color: '#1e293b' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' },
  fechaTexto: { fontSize: '12px', color: '#94a3b8', fontWeight: '500' },
  btnVerDetalle: { color: '#2563eb', fontWeight: '700', fontSize: '14px' },
  
 
  emptyState: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius: '28px',
    border: '2px dashed #e2e8f0'
  },
  emptyImage: { width: '250px', marginBottom: '20px' },
  emptyTitle: { fontSize: '22px', color: '#0f172a', margin: '0 0 10px 0' },
  emptySubtitle: { color: '#64748b', maxWidth: '400px', marginBottom: '25px', lineHeight: '1.5' }
};