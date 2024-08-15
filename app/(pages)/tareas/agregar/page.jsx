"use client";
import { supabase } from "../../../libs/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PageAgrearTareas = () => {
    const router = useRouter();
    const [tarea, setTarea] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const manejoTarea = (e) => {
        setTarea(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const completado = "No";
            const fechacreacion = new Date();
            const fecharealizacion = new Date();
            const { data, error } = await supabase
                .from("todo")
                .insert([
                    {
                        tarea,
                        completado,
                        fechacreacion,
                        fecharealizacion,
                    },
                ]);

            if (error) {
                setError("Error al agregar la tarea: " + error.message);
            } else {
                setShowSuccessMessage(true);
                setTarea("");
                setTimeout(() => {
                    router.push("/tareas");
                }, 2000);
            }
        } catch (error) {
            setError("Error al agregar la tarea: " + error.message);
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <h3 className="text-center py-4">Agregar una Tarea Supabase</h3>
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
                                    {loading ? "Agregando..." : "Agregar"}
                                </button>
                                {error && (
                                    <div className="alert alert-danger mt-3">
                                        {error}
                                    </div>
                                )}
                                {showSuccessMessage && (
                                    <div className="alert alert-success mt-3">
                                        Tarea agregada exitosamente. Redirigiendo...
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

export default PageAgrearTareas;