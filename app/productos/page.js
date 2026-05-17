"use client"

import { useProducto } from "@/hooks/useProductos";
import { useState, useEffect } from "react";

export default function ProductosPage() {
    
    const [preview, setPreview] = useState(null);

    const {
        productos,
        loading,
        agregarProducto,
        borrarProducto,
        editarProducto,
        productoSeleccionado,
        setProductosSeleccionado 
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
            // Si el producto ya tiene URL de texto de Cloudinary, la precargamos en la vista previa
            setPreview(productoSeleccionado.imagen_url || null);
        }
    }, [productoSeleccionado]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Captura segura del archivo para móviles
        const fileInput = e.target.elements?.foto;
        const file = fileInput?.files?.[0] || null;

        const datosLimpios = {
            ...formData,
            precio: parseFloat(formData.precio) || 0,
            stock: parseInt(formData.stock) || 0
        };

        try {
            if (productoSeleccionado) {
                await editarProducto(productoSeleccionado.id, datosLimpios, file);
            } else {
                await agregarProducto(datosLimpios, file);
            }

            // Limpieza segura de estados post-envío
            setFormData({ nombre: "", precio: "", stock: "" });
            setPreview(null);
            if (fileInput) fileInput.value = ""; 
            if (setProductosSeleccionado) setProductosSeleccionado(null); 
        } catch (error) {
            console.error("❌ Error al procesar el producto en el dispositivo:", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFDF9] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 selection:bg-amber-200">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* COLUMNA IZQUIERDA: Formulario */}
                    <div className="lg:col-span-5 space-y-4">
                        <h1 className="text-xl sm:text-2xl font-extrabold text-[#2B1B17] tracking-tight mb-2">
                            Gestionar Productos
                        </h1>
                        
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-white p-5 sm:p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100">
                            
                            {/* Contenedor de vista previa responsivo */}
                            <div className="flex flex-col gap-1.5 items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-[#FFFDF9]/50 min-h-[140px] transition-all">
                                {preview ? (
                                    <div className="relative w-full flex flex-col items-center group">
                                        <img 
                                            src={preview} 
                                            alt="Vista previa" 
                                            className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-2xl shadow-md border border-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreview(null);
                                                const input = document.getElementsByName("foto")[0];
                                                if (input) input.value = "";
                                            }}
                                            className="mt-2 text-xs font-semibold text-red-500 hover:underline bg-red-50 px-2.5 py-1 rounded-md transition-colors"
                                        >
                                            Remover imagen
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center space-y-1 p-2">
                                        <span className="text-2xl block opacity-60">📸</span>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sin vista previa</p>
                                        <p className="text-[11px] text-gray-400">Selecciona un archivo abajo</p>
                                    </div>
                                )}
                            </div>

                            {/* Input Nombre */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-600">Nombre del café</label>
                                <input
                                    placeholder="Ej. Caramel Macchiato"
                                    className="w-full bg-[#FFFDF9] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all font-medium text-gray-800"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Grid Precio y Stock */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600">Precio ($)</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full bg-[#FFFDF9] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all font-medium text-gray-800"
                                        value={formData.precio}
                                        onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600">Stock actual</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full bg-[#FFFDF9] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all font-medium text-gray-800"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Input Imagen */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-600">Imagen del Producto</label>
                                <input
                                    name="foto"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:uppercase file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200 file:cursor-pointer bg-[#FFFDF9] border border-gray-200 rounded-xl p-1"
                                />
                            </div>

                            {/* Botones de acción */}
                            <div className="flex items-center gap-3 pt-1">
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm tracking-wide shadow-sm transition-all duration-200 text-white active:scale-[0.98]
                                        ${loading 
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                            : productoSeleccionado 
                                                ? 'bg-emerald-600 hover:bg-emerald-700' 
                                                : 'bg-[#FFC554] hover:bg-[#e6b147] text-gray-900'
                                        }`}
                                >
                                    {loading ? "Procesando..." : (productoSeleccionado ? "Actualizar Producto" : "Agregar Producto")}
                                </button>
                            
                                {productoSeleccionado && (
                                    <button
                                        type="button"
                                        onClick={() => { 
                                            if (setProductosSeleccionado) setProductosSeleccionado(null); 
                                            setFormData({ nombre: "", precio: "", stock: "" }); 
                                            setPreview(null);
                                        }}
                                        className="px-3 py-3 text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* COLUMNA DERECHA: Inventario */}
                    <div className="lg:col-span-7 space-y-4 w-full overflow-hidden">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-[#2B1B17] tracking-tight mb-2">
                            Inventario Actual
                        </h2>
                        <TablaProductos
                            lista={productos}
                            alBorrar={borrarProducto}
                            alSeleccionar={(prod) => {
                                if (setProductosSeleccionado) setProductosSeleccionado(prod);
                                setPreview(prod.imagen_url || null);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function TablaProductos({ lista, alBorrar, alSeleccionar }) {
    return (
        <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-3xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto w-full block scrollbar-thin">
                <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead className="bg-[#FFFDF9] border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 pl-6">Producto</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right pr-6">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {lista.length === 0 ? (
                            <tr>
                                <td colSpan="2" className="p-8 text-center text-sm text-gray-400 font-medium">
                                    No hay productos en el inventario todavía.
                                </td>
                            </tr>
                        ) : (
                            lista.map((prod) => (
                                <tr key={prod.id} className="hover:bg-[#FFFDF9]/60 transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            {prod.imagen_url ? (
                                                <img
                                                    src={prod.imagen_url.replace('/upload/', '/upload/w_150,h_150,c_fill,g_auto/')}
                                                    alt={prod.nombre}
                                                    className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-2xl shadow-sm border border-gray-100 transition-transform group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-[11px] font-bold text-gray-400 border border-dashed shrink-0">
                                                    S/F
                                                </div>
                                            )}

                                            <div className="space-y-0.5">
                                                <p className="font-bold text-gray-900 group-hover:text-amber-800 transition-colors text-sm sm:text-base">
                                                    {prod.nombre}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-medium">
                                                    <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                                                        ${prod.precio?.toLocaleString()}
                                                    </span>
                                                    <span className="text-gray-300 hidden sm:inline">•</span>
                                                    <span className={`px-2 py-0.5 rounded-md ${prod.stock < 5 ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-500 bg-gray-100'}`}>
                                                        Stock: {prod.stock} u.
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-4 pr-6 text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-2 sm:gap-3">
                                            <button 
                                                onClick={() => alSeleccionar(prod)} 
                                                className="text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-2.5 py-2 rounded-xl hover:bg-blue-100 transition-all"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => alBorrar(prod.id)} 
                                                className="text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-500 px-2.5 py-2 rounded-xl hover:bg-red-100 transition-all"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}