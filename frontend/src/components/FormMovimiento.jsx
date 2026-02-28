import React, { useState } from 'react';

const FormMovimiento = ({ metaId, onActualizar }) => {
    const [cantidad, setCantidad] = useState('');
    const [tipo, setTipo] = useState('ahorro');
    const [descripcion, setDescripcion] = useState('');

    const enviar = async (e) => {
        e.preventDefault();
        if (!cantidad || cantidad <= 0) return alert("Ingresa un monto válido");

        const res = await fetch('http://127.0.0.1:8000/movimientos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                meta_id: metaId,
                tipo: tipo,
                cantidad: parseFloat(cantidad),
                categoria: "General",
                descripcion: descripcion || (tipo === 'ahorro' ? "Ahorro guardado" : "Gasto realizado")
            })
        });

        if (res.ok) {
            setCantidad('');
            setDescripcion('');
            onActualizar(); 
        }
    };

    return (
        <form onSubmit={enviar} style={styles.form}>
            <div style={styles.inputGroup}>
                <input 
                    type="number" 
                    value={cantidad} 
                    onChange={(e) => setCantidad(e.target.value)} 
                    placeholder="$ 0.00"
                    style={styles.inputMonto}
                />
                <input 
                    type="text" 
                    value={descripcion} 
                    onChange={(e) => setDescripcion(e.target.value)} 
                    placeholder="Descripcion (opcional)"
                    style={styles.inputDesc}
                />
                <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={styles.select}>
                    <option value="ahorro">➕ Ahorro</option>
                    <option value="gasto">➖ Gasto</option>
                </select>
                <button type="submit" style={styles.button}>
                    Registrar
                </button>
            </div>
        </form>
    );
};

const styles = {
    form: {
        background: '#fff',
        padding: '20px',
        borderRadius: '20px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        marginTop: '20px',
        border: '1px solid #e2e8f0'
    },
    inputGroup: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        alignItems: 'center'
    },
    inputMonto: {
        flex: '1',
        minWidth: '100px',
        padding: '12px',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        fontSize: '16px',
        outline: 'none'
    },
    inputDesc: {
        flex: '2',
        minWidth: '200px',
        padding: '12px',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        fontSize: '16px',
        outline: 'none'
    },
    select: {
        padding: '12px',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        backgroundColor: '#fff',
        cursor: 'pointer',
        fontSize: '14px'
    },
    button: {
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        padding: '12px 24px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background 0.2s',
    }
};

export default FormMovimiento;