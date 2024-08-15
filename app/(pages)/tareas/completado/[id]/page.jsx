'use client';

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../../../libs/supabase";

const PageCompletarTarea = () => {
    const router = useRouter();
    const { id } = useParams();
    const [tarea, setTarea] = useState("");
    const [fecharealizacion, setFecharealizacion] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        const fetchTarea = async () => {
            if (id) {
                const { data, error } = await supabase
                    .from('todo')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) {
                    setError("Error al cargar la tarea: " + error.message);
                } else {
                    setTarea(data.tarea);
                }
                setLoading(false);
            }
        };
        fetchTarea();
    }, [id]);

    const manejoFecha = (e) => {
        setFecharealizacion(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validar que la fecha de realización no sea anterior a la fecha actual
        const fechaActual = new Date().toISOString().split("T")[0]; // Obtener la fecha actual en formato YYYY-MM-DD
        if (fecharealizacion < fechaActual) {
            setMessage("La fecha de realización no puede ser anterior a la fecha actual.");
            return;
        }

        try {
            const { error } = await supabase
                .from('todo')
                .update({ fecharealizacion, completado: 'Si' })
                .eq('id', id);

            if (error) {
                setMessage("Error al actualizar la tarea: " + error.message);
            } else {
                setMessage("Tarea actualizada correctamente");
                setShowSuccessMessage(true);
                setTimeout(() => {
                    router.push('/tareas');
                }, 2000);
            }
        } catch (err) {
            setMessage("Error al actualizar la tarea: " + err.message);
        }
    };

    if (loading) {
        return <div className="text-center">Cargando tarea...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }

    return (
        <div className="container">
            <h4 className="text-center py-4">Completar Tarea</h4>
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <div className="card" data-bs-theme="dark">
                        <form onSubmit={handleSubmit}>
                            <div className="card-header">
                                <div className="mb-3">
                                    <label htmlFor="tarea" className="form-label">Tarea</label>
                                    <textarea className="form-control" value={tarea} placeholder="Indique la tarea" id="tarea" rows="4" readOnly></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="fecha" className="form-label">Fecha de Realización</label>
                                    <input type="date" className="form-control" value={fecharealizacion} id="fecha" onChange={manejoFecha} required />
                                </div>
                            </div>
                            <div className="card-footer text-center">
                                <button type="submit" className="btn btn-outline-success" disabled={loading}>
                                    {loading ? "Completar..." : "Completar"}
                                </button>
                                {message && (
                                    <div className={`alert ${showSuccessMessage ? 'alert-success' : 'alert-danger'} mt-3`}>
                                        {message}
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageCompletarTarea;