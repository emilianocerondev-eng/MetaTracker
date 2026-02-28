import React, { useState } from 'react';

const ModalNuevaMeta = ({ isOpen, onClose, onActualizar }) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [objetivo, setObjetivo] = useState('');
    const [fechaTermino, setFechaTermino] = useState('');

    if (!isOpen) return null;

    const enviar = async (e) => {
        e.preventDefault();
        const nuevaMeta = {
            nombre,
            descripcion,
            monto_objetivo: parseFloat(objetivo),
            fecha_inicio: new Date().toISOString().split('T')[0], 
            fecha_termino: fechaTermino,
            estado: "activa"
        };

        const res = await fetch('http://127.0.0.1:8000/metas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaMeta)
        });

        if (res.ok) {
            onActualizar();
            onClose();
            setNombre(''); setDescripcion(''); setObjetivo(''); setFechaTermino('');
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>Crear Nueva Meta</h2>
                    <button onClick={onClose} style={styles.btnClose}>✕</button>
                </div>
                
                <form onSubmit={enviar} style={styles.form}>
                    <label style={styles.label}>¿Qué vas a comprar?</label>
                    <input type="text" placeholder="Ej. MacBook Air M4" value={nombre} onChange={e => setNombre(e.target.value)} style={styles.input} required />

                    <label style={styles.label}>Breve descripción</label>
                    <input type="text" placeholder="Ej. Para el trabajo dual" value={descripcion} onChange={e => setDescripcion(e.target.value)} style={styles.input} />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={styles.label}>Monto Objetivo</label>
                            <input type="number" placeholder="$0.00" value={objetivo} onChange={e => setObjetivo(e.target.value)} style={styles.input} required />
                        </div>
                        <div>
                            <label style={styles.label}>Fecha Límite</label>
                            <input type="date" value={fechaTermino} onChange={e => setFechaTermino(e.target.value)} style={styles.input} required />
                        </div>
                    </div>

                    <button type="submit" style={styles.btnCrear}>Crear Meta</button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal: { backgroundColor: 'white', padding: '30px', borderRadius: '24px', width: '450px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
    btnClose: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    label: { fontSize: '14px', fontWeight: 'bold', color: '#1e293b', marginBottom: '-10px' },
    input: { padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none' },
    btnCrear: { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }
};

export default ModalNuevaMeta;