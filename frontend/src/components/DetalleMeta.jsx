import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  ArrowLeft, Plus, TrendingUp, TrendingDown, 
  Calendar, DollarSign, ArrowUpCircle, ArrowDownCircle 
} from "lucide-react";
import FormMovimiento from "./FormMovimiento";

export default function DetalleMeta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);

  
  useEffect(() => { 
    const cargar = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/metas/${id}`);
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error al cargar:", error);
      }
    };

    cargar(); 
  }, [id]); 

  if (!data) return null;
  const { meta, movimientos } = data;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/")} style={styles.btnVolver}>
        <ArrowLeft size={18} /> Volver
      </button>
      
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <span style={styles.labelMuted}>Total ahorrado</span>
            <h1 style={styles.montoGrande}>${meta.saldo_actual.toLocaleString()}</h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={styles.labelMuted}>Objetivo</span>
            <h3 style={styles.montoObjetivo}>${meta.monto_objetivo.toLocaleString()}</h3>
          </div>
        </div>
        
        <div style={styles.progressWrapper}>
          <div style={{ ...styles.progressBarFill, width: `${meta.porcentaje_progreso}%` }} />
        </div>
        
        <div style={styles.progressInfo}>
          <span style={{ color: '#2563eb' }}>{meta.porcentaje_progreso}%</span>
          <span>Faltan ${meta.cuanto_falta.toLocaleString()}</span>
        </div>
      </div>

      <div style={styles.gridStats}>
        <div style={styles.miniCard}>
          <div style={{ ...styles.miniIcon, color: '#10b981', backgroundColor: '#ecfdf5' }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <div style={styles.miniLabel}>Ingresos</div>
            <div style={styles.miniValue}>${meta.saldo_actual.toLocaleString()}</div>
          </div>
        </div>

        <div style={styles.miniCard}>
          <div style={{ ...styles.miniIcon, color: '#ef4444', backgroundColor: '#fef2f2' }}>
            <TrendingDown size={20} />
          </div>
          <div>
            <div style={styles.miniLabel}>Gastos</div>
            <div style={styles.miniValue}>$800.00</div>
          </div>
        </div>

        <div style={styles.miniCard}>
          <div style={{ ...styles.miniIcon, color: '#2563eb', backgroundColor: '#eff6ff' }}>
            <DollarSign size={20} />
          </div>
          <div>
            <div style={styles.miniLabel}>Semanal</div>
            <div style={styles.miniValue}>${meta.ahorro_semanal_necesario}</div>
          </div>
        </div>

        <div style={styles.miniCard}>
          <div style={{ ...styles.miniIcon, color: '#64748b', backgroundColor: '#f1f5f9' }}>
            <Calendar size={20} />
          </div>
          <div>
            <div style={styles.miniLabel}>Semanas</div>
            <div style={styles.miniValue}>7</div>
          </div>
        </div>
      </div>

      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Movimientos</h2>
        <button onClick={() => setMostrarForm(!mostrarForm)} style={styles.btnAgregar}>
          <Plus size={18} /> Agregar
        </button>
      </div>

      {mostrarForm && (
        <FormMovimiento 
          metaId={id} 
          onActualizar={() => {

            window.location.reload(); 
          }} 
        />
      )}

      <div style={styles.listContainer}>
        {movimientos.map(mov => (
          <div key={mov.id} style={styles.movRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ 
                ...styles.movIconContainer, 
                backgroundColor: mov.tipo === 'gasto' ? '#fef2f2' : '#ecfdf5',
                color: mov.tipo === 'gasto' ? '#ef4444' : '#10b981'
              }}>
                {mov.tipo === 'gasto' ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
              </div>
              <div>
                <div style={styles.movDesc}>{mov.descripcion}</div>
                <div style={styles.movFecha}>{new Date(mov.fecha).toLocaleDateString()}</div>
              </div>
            </div>
            <div style={{ ...styles.movMonto, color: mov.tipo === 'gasto' ? '#ef4444' : '#10b981' }}>
              {mov.tipo === 'gasto' ? '-' : '+'}${mov.cantidad.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { 
    padding: '40px', maxWidth: '900px', margin: 'auto', backgroundColor: '#fff', minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif'
  },
  btnVolver: { marginBottom: 30, border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '500' },
  labelMuted: { color: '#64748b', fontSize: '14px', fontWeight: '500' },
  montoGrande: { fontSize: '48px', margin: '5px 0', fontWeight: '800', letterSpacing: '-1.5px' },
  montoObjetivo: { fontSize: '24px', margin: '5px 0', fontWeight: '700' },
  progressWrapper: { backgroundColor: '#f1f5f9', height: '14px', borderRadius: '10px', overflow: 'hidden', marginTop: 15 },
  progressBarFill: { backgroundColor: '#2563eb', height: '100%', borderRadius: '10px' },
  progressInfo: { display: 'flex', justifyContent: 'space-between', marginTop: 12, fontWeight: '700', fontSize: '14px' },
  gridStats: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: 40 },
  miniCard: { backgroundColor: 'white', padding: '16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #f1f5f9' },
  miniIcon: { width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  miniLabel: { fontSize: '12px', color: '#64748b', fontWeight: '500' },
  miniValue: { fontWeight: '700', fontSize: '15px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: '24px', fontWeight: '800', margin: 0 },
  btnAgregar: { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
  movRow: { backgroundColor: '#fdfdfd', padding: '18px 24px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #f8fafc' },
  movIconContainer: { width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  movDesc: { fontWeight: '700', color: '#1e293b' },
  movFecha: { fontSize: '12px', color: '#94a3b8' },
  movMonto: { fontWeight: '800', fontSize: '16px' }
};