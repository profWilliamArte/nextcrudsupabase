'use client'
import { useState } from "react";
import { supabase } from "../../libs/supabase";

const AgregarProducto = ({ onProductoAgregado }) => {
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [categoria, setCategoria] = useState("");
    const [disponibilidad, setDisponibilidad] = useState(0);
    const [imagen, setImagen] = useState(null); // Campo para la imagen
    const [descripcion, setDescripcion] = useState(""); // Campo para la descripción

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Si hay una imagen, primero la subimos a Supabase Storage
        let imageUrl = null;
        if (imagen) {
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('tuzona') // Asegúrate de que este bucket exista en tu Supabase
                .upload(`productos/${imagen.name}`, imagen);

            if (uploadError) {
                setError("Error al subir la imagen: " + uploadError.message);
                setLoading(false);
                return;
            }

            // Obtener la URL de la imagen
            imageUrl = `https://nxmsewmsmngxkuvpmrnh.supabase.co/storage/v1/object/public/tuzona/productos/${imagen.name}`;
        }
        // Insertar el nuevo producto en la tabla
        const { data, error } = await supabase
            .from("productos")
            .insert([{ 
                nombre, 
                precio: parseFloat(precio), 
                categoria, 
                disponibilidad, 
                imagen: imageUrl, // Guardamos la URL de la imagen
                descripcion 
            }]);

        if (error) {
            setError("Error al agregar el producto: " + error.message);
        } else {
            onProductoAgregado(); // Llama a la función para actualizar la lista de productos
            setNombre("");
            setPrecio("");
            setCategoria("");
            setDisponibilidad(0);
            setImagen(null);
            setDescripcion("");
        }
        setLoading(false);
    };

    return (
        <div className="card p-4 mb-4">
            <h4>Agregar Producto</h4>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Precio</label>
                    <input
                        type="number"
                        className="form-control"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Disponibilidad</label>
                    <input
                        type="number"
                        className="form-control"
                        value={disponibilidad}
                        onChange={(e) => setDisponibilidad(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Categoría</label>
                    <input
                        type="text"
                        className="form-control"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Imagen</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setImagen(e.target.files[0])}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                        className="form-control"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        rows="3"
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? "Agregando..." : "Agregar Producto"}
                </button>
            </form>
        </div>
    );
}

export default AgregarProducto;