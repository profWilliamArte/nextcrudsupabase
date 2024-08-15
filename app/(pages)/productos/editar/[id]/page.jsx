// pages/EditProduct.js
'use client'; // Asegúrate de tener esta directiva al inicio del archivo

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Importa useRouter desde next/navigation
import { supabase } from "../../../../libs/supabase"; // Ajusta la ruta según tu estructura de carpetas

const EditProduct = ({params}) => {
    const router = useRouter();
    const { id } = params; // Obtener el ID del
    const [producto, setProducto] = useState(null);
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [categoria, setCategoria] = useState("");
    const [disponible, setDisponible] = useState(0);
    const [imagen, setImagen] = useState(null); // Campo para la imagen
    const [descripcion, setDescripcion] = useState(null); // Campo para la descripción
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        const fetchProducto = async () => {
            if (id) {
                const { data, error } = await supabase
                    .from('productos')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) {
                    setError("Error al cargar el producto: " + error.message);
                } else {
                    setProducto(data);
                    setNombre(data.nombre);
                    setPrecio(data.precio);
                    setCategoria(data.categoria);
                    setDisponible(data.disponible);
                    setDescripcion(data.descripcion);
                }
                setLoading(false);
            }
        };

        fetchProducto();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        let imageUrl = null;
        if (imagen) {
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('tuzona')
                .upload(`productos/${imagen.name}`, imagen);

            if (uploadError) {
                setError("Error al subir la imagen: " + uploadError.message);
                setLoading(false);
                return;
            }

            imageUrl = `https://rngcfmfbftksaprimgbd.supabase.co/storage/v1/object/public/tuzona/${imagen.name}`;
        }

        const { error } = await supabase
            .from("productos")
            .update({
                nombre,
                precio: parseFloat(precio),
                categoria,
                disponible,
                imagen: imageUrl || producto.imagen, // Mantener la imagen anterior si no se subió una nueva
                descripcion
            })
            .eq('id', id);

        if (error) {
            setError("Error al actualizar el producto: " + error.message);
        } else {
            setShowSuccessMessage(true); // Mostrar el mensaje de éxito
            setTimeout(() => {
                router.push('/productos'); // Redirigir a la lista de productos
            }, 2000);
        }
        setLoading(false);
    };

    if (loading) return <p>Cargando producto...</p>;

    return (
        <div className="container">
            <div className="card p-4 my-4" data-bs-theme="dark">
                <h4>Editar Producto</h4>
                {error && <p className="text-danger">{error}</p>}
                {showSuccessMessage && (
                    <div className="alert alert-success" role="alert">
                        ¡Producto actualizado correctamente!
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
                        <label className="form-label">Disponible</label>
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
                            value={descripcion || ''} 
                            onChange={(e) => setDescripcion(e.target.value)}
                            rows="3"
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-success" disabled={loading}>
                        {loading ? "Actualizando..." : "Actualizar Producto"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;