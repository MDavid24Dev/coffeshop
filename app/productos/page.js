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

        // Capturamos el archivo del input (necesitarás añadir el input al HTML abajo)
        const file = e.target.foto?.files[0];

        const datosLimpios = {
            ...formData,
            precio: parseFloat(formData.precio) || 0,
            stock: parseInt(formData.stock) || 0
        };

        if (productoSeleccionado) {
            await editarProducto(productoSeleccionado.id, datosLimpios, file);
        } else {
            await agregarProducto(datosLimpios, file);
        }

        setFormData({ nombre: "", precio: "", stock: "" });
        if (e.target.foto) e.target.foto.value = ""; // Limpia el input de archivo
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
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                />

                <input
                    type="number"
                    placeholder="Precio"
                    className="border p-2"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    required
                />

                <input
                    type="number"
                    placeholder="Stock"
                    className="border p-2"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                />

                <div className="flex flex-col">
                    <label className="text-xs text-gray-500">Imagen del Producto</label>
                    <input
                        name="foto"
                        type="file"
                        accept="image/*"
                        className="border p-1 text-sm"
                    />
                </div>

                {/* BOTÓN DINÁMICO: Cambia de color y texto si estamos editando */}
                <button className={`p-2 px-4 rounded text-white ${productoSeleccionado ? 'bg-green-600' : 'bg-blue-500'}`}>
                    {loading ? "Cargando..." : (productoSeleccionado ? "Actualizar" : "Agregar")}
                </button>

                {productoSeleccionado && (
                    <button
                        type="button"
                        onClick={() => { setProductosSeleccionado(null); setFormData({ nombre: "", precio: "", stock: "" }); }}
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
                                {/* Contenedor para alinear imagen y texto */}
                                <div className="flex items-center gap-4">

                                    {/* 1. LA IMAGEN: Solo se muestra si existe la URL */}
                                    {prod.imagen_url ? (
                                        <img
                                            /* Este truco añade parámetros a la URL:
                                               w_200: Redimensiona a 200px (suficiente para una miniatura)
                                                c_fill: Recorta para que encaje
                                               g_auto: Enfoca lo importante (el café) automáticamente
                                             */
                                            src={prod.imagen_url.replace('/upload/', '/upload/w_150,h_150,c_fill,g_auto/')}
                                            alt={prod.nombre}
                                            //style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            className="w-12 h-12 object-cover rounded shadow-sm border"
                                        />
                                    ) : (
                                        /* Un cuadro gris por si no hay foto */
                                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-[10px] text-gray-400">
                                            S/F
                                        </div>
                                    )}

                                    {/* 2. LOS TEXTOS: Nombre, precio y stock */}
                                    <div>
                                        <p className="font-bold text-gray-800">{prod.nombre}</p>
                                        <p className="text-sm text-gray-500">
                                            ${prod.precio.toLocaleString()} — Stock: {prod.stock}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            {/* ... el resto de tus botones de acciones se quedan igual ... */}
                            <td className="p-4 text-center flex justify-center gap-3">
                                <button onClick={() => alSeleccionar(prod)} className="text-blue-600 hover:underline">
                                    Editar
                                </button>
                                <button onClick={() => alBorrar(prod.id)} className="text-red-500 hover:underline">
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