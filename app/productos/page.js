"use client"

import { useProducto } from "@/hooks/useProductos"; 
import { useState, useEffect } from "react";

export default function ProductosPage() {
    const { 
        productos, 
        loading, 
        agregarProducto, 
        borrarProducto,
        editarProducto,
        productoSeleccionado,
        setProductosSeleccionado // 👈 IMPORTANTE: Agregamos esta función aquí
    } = useProducto();

    const [formData, setFormData] = useState({ 
        nombre: "", 
        precio: "", 
        stock: "" 
    });

    useEffect(() => {
        if (productoSeleccionado) {
            setFormData({
                nombre: productoSeleccionado.nombre,
                precio: productoSeleccionado.precio,
                stock: productoSeleccionado.stock
            });
        }
    }, [productoSeleccionado]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const datosLimpios = {
            ...formData,
            precio: parseFloat(formData.precio) || 0, 
            stock: parseInt(formData.stock) || 0      
        };

        if (productoSeleccionado) {
            await editarProducto(productoSeleccionado.id, datosLimpios);
        } else {
            await agregarProducto(datosLimpios);
        }
        
        setFormData({ nombre: "", precio: "", stock: "" });
        setProductosSeleccionado(null); // Ahora sí funcionará porque la importamos arriba
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Gestionar Productos</h1>
            
            <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
                <input 
                    placeholder="Nombre"
                    className="border p-2"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required
                />
                
                <input 
                    type="number"
                    placeholder="Precio"
                    className="border p-2"
                    value={formData.precio}
                    onChange={(e) => setFormData({...formData, precio: e.target.value})}
                    required
                />
                
                <input 
                    type="number"
                    placeholder="Stock"
                    className="border p-2"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    required
                />

                {/* BOTÓN DINÁMICO: Cambia de color y texto si estamos editando */}
                <button className={`p-2 px-4 rounded text-white ${productoSeleccionado ? 'bg-green-600' : 'bg-blue-500'}`}>
                    {loading ? "Cargando..." : (productoSeleccionado ? "Actualizar" : "Agregar")}
                </button>

                {productoSeleccionado && (
                    <button 
                        type="button" 
                        onClick={() => { setProductosSeleccionado(null); setFormData({nombre:"", precio:"", stock:""}); }}
                        className="text-gray-400 text-sm underline"
                    >
                        Cancelar
                    </button>
                )}
            </form>

            <h2 className="text-xl font-semibold mb-4">Inventario Actual</h2>
            
            <TablaProductos 
                lista={productos} 
                alBorrar={borrarProducto} 
                alSeleccionar={setProductosSeleccionado} // 👈 CONECTAMOS EL CABLE AQUÍ
            />
        </div>
    );
}

// TU COMPONENTE DE TABLA (Se queda igual, pero ahora recibe alSeleccionar)
function TablaProductos({ lista, alBorrar, alSeleccionar }) {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border">
            <table className="w-full text-left">
                <thead className="bg-gray-100 border-b">
                    <tr>
                        <th className="p-4">Producto</th>
                        <th className="p-4 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {lista.map((prod) => (
                        <tr key={prod.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                                <p className="font-bold">{prod.nombre}</p>
                                <p className="text-sm text-gray-500">${prod.precio} - Stock: {prod.stock}</p>
                            </td>
                            <td className="p-4 text-center flex justify-center gap-3">
                                <button 
                                    onClick={() => alSeleccionar(prod)} 
                                    className="text-blue-600 hover:font-bold"
                                >
                                    Editar
                                </button>
                                <button 
                                    onClick={() => alBorrar(prod.id)} 
                                    className="text-red-500 hover:font-bold"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}