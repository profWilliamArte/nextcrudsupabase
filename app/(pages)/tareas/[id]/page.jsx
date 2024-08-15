'use client'; // Asegúrate de tener esta directiva al inicio del archivo

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Importa useRouter desde next/navigation
import { supabase } from "../../../libs/supabase"; // Ajusta la ruta según tu estructura de carpetas

const PageEditarTarea = ({ params }) => {
    const router = useRouter();
    const { id } = params; // Obtener el ID del
    const [tarea, setTarea] = useState("")
    const [message, setMessage] = useState("");
    const [datos, setDatos] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Nuevo estado para mostrar el mensaje de actualización exitosa

    useEffect(() => {
        const fetchTarea = async () => {
            if (id) {
                const { data, error } = await supabase
                    .from('todo')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) {
                    setError("Error al cargar el producto: " + error.message);
                } else {
                    setDatos(data);
                    setTarea(data.tarea);
                }
                setLoading(false);
            }
        };
        fetchTarea();
    }, [id]);
    const manejoTarea = (e) => {
        setTarea(e.target.value)
        //console.log(tarea)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const { error } = await supabase
            .from("todo")
            .update({
                tarea  
            })
            .eq('id', id);
        if (error) {
            setError("Error al actualizar el la tarea: " + error.message);
        } else {
            setShowSuccessMessage(true); // Mostrar el mensaje de éxito
            setTimeout(() => {
                router.push('/tareas'); // Redirigir a la lista de tareas
            }, 300);
        }
        setLoading(false);
    };

    if (loading) return <p>Cargando producto...</p>;

    return (
        <div className="container">
            <h4 className="text-center py-4">Actualizar la Tarea</h4>
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <div className="card" data-bs-theme="dark">
                        <form onSubmit={handleSubmit} >
                            <div className="card-header">
                                <div className="mb-3">
                                    <label htmlFor="tarea" className="form-label">Tarea</label>
                                    <textarea className="form-control" value={tarea} placeholder="indique la tarea" id="tarea" rows="4" onChange={manejoTarea} required></textarea>
                                </div>
                            </div>
                            <div className="card-footer text-center">
                                <button type="submit" className="btn btn-outline-success">
                                    {params.id ? "Actualizar" : "Crear"}
                                </button>
                                {message && (
                                    <div className="alert alert-info mt-3">{message}</div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageEditarTarea