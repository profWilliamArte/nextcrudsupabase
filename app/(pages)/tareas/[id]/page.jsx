'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../libs/supabase";

const PageEditarTarea = ({ params }) => {
    const router = useRouter();
    const { id } = params; // Obtener el ID directamente de params
    const [tarea, setTarea] = useState("");
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

    const manejoTarea = (e) => {
        setTarea(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { error } = await supabase
                .from("todo")
                .update({ tarea })
                .eq('id', id);

            if (error) {
                setError("Error al actualizar la tarea: " + error.message);
            } else {
                setShowSuccessMessage(true);
                setTimeout(() => {
                    router.push('/tareas');
                }, 2000);
            }
        } catch (error) {
            setError("Error al actualizar la tarea: " + error.message);
        }
        setLoading(false);
    };

    if (loading) {
        return <div className="text-center">Cargando tarea...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }

    return (
        <div className="container">
            <h4 className="text-center py-4">Actualizar la Tarea</h4>
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <div className="card" data-bs-theme="dark">
                        <form onSubmit={handleSubmit}>
                            <div className="card-header">
                                <div className="mb-3">
                                    <label htmlFor="tarea" className="form-label">
                                        Tarea
                                    </label>
                                    <textarea
                                        className="form-control"
                                        value={tarea}
                                        placeholder="Indique la tarea"
                                        id="tarea"
                                        rows="4"
                                        onChange={manejoTarea}
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            <div className="card-footer text-center">
                                <button
                                    type="submit"
                                    className="btn btn-outline-success"
                                    disabled={loading}
                                >
                                    {loading ? "Actualizando..." : "Actualizar"}
                                </button>
                                {error && (
                                    <div className="alert alert-danger mt-3">
                                        {error}
                                    </div>
                                )}
                                {showSuccessMessage && (
                                    <div className="alert alert-success mt-3">
                                        Tarea actualizada exitosamente. Redirigiendo...
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

export default PageEditarTarea;