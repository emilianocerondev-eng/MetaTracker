import mysql.connector
from mysql.connector import Error
import datetime

def get_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='finanzas_bd'
        )
        return connection 
    except Error as e:
        print(f"Error al conectar: {e}")
        return None 

def consultar_metas():
    connection = get_connection()
    if connection:
        try:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM metas")
            todas_las_metas = cursor.fetchall()
            hoy = datetime.date.today()
            
            for meta in todas_las_metas:
                id_meta = meta['id']
                cursor.execute("""
                    SELECT 
                        SUM(CASE WHEN tipo IN ('ingreso', 'ahorro') THEN cantidad ELSE 0 END) as total_ingresos,
                        SUM(CASE WHEN tipo = 'gasto' THEN cantidad ELSE 0 END) as total_gastos
                    FROM movimientos WHERE meta_id = %s
                """, (id_meta,))
                resultado = cursor.fetchone()
                
                ingresos = float(resultado['total_ingresos'] or 0)
                gastos = float(resultado['total_gastos'] or 0)
                
                meta['saldo_actual'] = ingresos - gastos
                meta['monto_objetivo'] = float(meta['monto_objetivo'])
                
                # Progreso
                if meta['monto_objetivo'] > 0:
                    porcentaje = (meta['saldo_actual'] / meta['monto_objetivo']) * 100
                    meta['porcentaje_progreso'] = min(round(porcentaje, 2), 100)
                else:
                    meta['porcentaje_progreso'] = 0
                
                # Proyección semanal
                faltante = meta['monto_objetivo'] - meta['saldo_actual']
                meta['cuanto_falta'] = max(faltante, 0)
                
                dias_restantes = (meta['fecha_termino'] - hoy).days
                semanas_restantes = dias_restantes / 7
                
                if semanas_restantes > 0 and faltante > 0:
                    meta['ahorro_semanal_necesario'] = round(faltante / semanas_restantes, 2)
                else:
                    meta['ahorro_semanal_necesario'] = 0
            return todas_las_metas
        finally:
            cursor.close()
            connection.close()
    return []

def registrar_movimiento(movimiento):
    connection = get_connection()
    if connection:
        try:
            cursor = connection.cursor()
            query = "INSERT INTO movimientos (meta_id, tipo, cantidad, categoria, descripcion, fecha) VALUES (%s, %s, %s, %s, %s, %s)"
            fecha = movimiento.get("fecha", datetime.datetime.now())
            cursor.execute(query, (movimiento["meta_id"], movimiento["tipo"], movimiento["cantidad"], movimiento["categoria"], movimiento["descripcion"], fecha))
            connection.commit()
            return {"mensaje": "Ok", "id": cursor.lastrowid}
        finally:
            connection.close()

def crear_meta(meta):
    connection = get_connection()
    if connection:
        try:
            cursor = connection.cursor()
            query = "INSERT INTO metas (nombre, descripcion, monto_objetivo, fecha_inicio, fecha_termino, estado) VALUES (%s,%s,%s,%s,%s,%s)"
            cursor.execute(query, (meta["nombre"], meta.get("descripcion", ""), meta["monto_objetivo"], meta["fecha_inicio"], meta["fecha_termino"], "activa"))
            connection.commit()
            return {"mensaje": "Meta creada"}
        finally:
            connection.close()

def consultar_movimientos_por_meta(meta_id):
    connection = get_connection()
    if connection:
        try:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM movimientos WHERE meta_id = %s ORDER BY fecha DESC", (meta_id,))
            return cursor.fetchall()
        finally:
            connection.close()
    return []

def actualizar_estado_meta(meta_id: int, meta:dict):
    connection=get_connection()
    if connection:
        try:
            cursor = connection.cursor()
            
            query= """UPDATE metas 
            SET nombre=%s, descripcion=%s, monto_objetivo=%s, fecha_inicio=%s, fecha_termino=%s, estado=%s
            WHERE id=%s"""
            
            valores=(
                meta['nombre'],
                meta['descripcion'],
                meta['monto_objetivo'],
                meta['fecha_inicio'],
                meta['fecha_termino'],
                meta['estado'],
                meta_id
            )
            
            cursor.execute(query,(valores))
            connection.commit()
            
            return {"mensaje": "meta actualizada con exito"}
    
        except Exception as e:
            return{"error": str(e)}
        
        finally:
            cursor.close()
            connection.close()
        
    return None

def eliminar_meta(meta_id):
    connection = get_connection()
    if connection:
        try:
            cursor = connection.cursor()
            cursor.execute("DELETE FROM metas WHERE id = %s", (meta_id,))
            connection.commit()
            return {"mensaje": "Eliminada"}
        finally:
            connection.close()