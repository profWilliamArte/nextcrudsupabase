'use client'
import { useState } from "react";
import { supabase } from "../../../libs/supabase";
import { useRouter } from "next/navigation";
const AgregarProducto = ({ onProductoAgregado }) => {
    const router = useRouter();
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [categoria, setCategoria] = useState("");
    const [disponible, setDisponible] = useState(0);
    const [imagen, setImagen] = useState(null); // Campo para la imagen
    const [descripcion, setDescripcion] = useState(""); // Campo para la descripción

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Nuevo estado para mostrar el 
  
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
                imageUrl = `https://rngcfmfbftksaprimgbd.supabase.co/storage/v1/object/public/tuzona/${imagen.name}`;
        }
        // Insertar el nuevo producto en la tabla
        const { data, error } = await supabase
            .from("productos")
            .insert([{
                nombre,
                precio: parseFloat(precio),
                categoria,
                disponible,
                imagen: imageUrl, // Guardamos la URL de la imagen
                descripcion
            }]);

        if (error) {
            setError("Error al agregar el producto: " + error.message);
        } else {
            setShowSuccessMessage(true); // Mostrar el mensaje de éxito
            setNombre("");
            setPrecio("");
            setCategoria("");
            setDisponible(0);
            setImagen(null);
            setDescripcion("");
            setTimeout(() => {
                router.push('/productos'); // Redirigir a la lista de productos
            }, 2000);
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <div className="card p-4 my-4" data-bs-theme="dark">
                <h4>Agregar Producto</h4>
                {error && <p className="text-danger">{error}</p>}
                {showSuccessMessage && ( // Mostrar el mensaje de éxito si showSuccessMessage es true
                    <div className="alert alert-success" role="alert">
                        ¡Producto agregado correctamente!
                    </div>
                )}
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
                        <label className="form-label">disponible</label>
                        <input
                            type="number"
                            className="form-control"
                            value={disponible}
                            onChange={(e) => setDisponible(e.target.value)}
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
        </div>
    );
}

export default AgregarProducto;