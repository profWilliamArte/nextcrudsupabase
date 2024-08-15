'use client';

import { supabase } from "../../libs/supabase";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

const Pagetareas = () => {
    const router = useRouter();
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTareas = async () => {
        const { data, error } = await supabase
            .from('todo')
            .select('*')
            .order('id', { ascending: false });

        if (error) {
            setError('Error fetching tareas: ' + error.message);
        } else {
            setDatos(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTareas();
    }, []);

    const editar = (id) => {
        router.push(`/tareas/${id}`);
    };

    const completarTarea = async (id) => {
        router.push(`/tareas/completado/${id}`);
    };

    const eliminar = async (id, tarea) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar esta tarea "${tarea}"?`)) {
            try {
                const { error } = await supabase
                    .from('todo')
                    .delete()
                    .eq('id', id);

                if (error) {
                    setError('Error al eliminar la tarea: ' + error.message);
                } else {
                    setDatos((prevDatos) => prevDatos.filter(item => item.id !== id));
                    alert(`Tarea "${tarea}" eliminada exitosamente.`);
                }
            } catch (error) {
                setError('Error al eliminar la tarea: ' + error.message);
            }
        }
    };

    const renderTareas = () => {
        return datos.map((item) => (
            <div className='col-md-4 col-xl-3 mb-4' key={item.id}>
                <div className='card h-100' data-bs-theme="dark">
                    <div className='card-header text-center h-100 d-flex align-items-center justify-content-center'>
                        <p className='fs-5 fw-bold'>{item.tarea}</p>
                    </div>
                    <div className='card-body text-center'>
                        <p>
                            Fecha de Creación:<br />
                            {new Date(item.fechacreacion).toLocaleString()}
                        </p>
                        <h1 className={`badge ${item.completado === 'Si' ? 'bg-success' : 'bg-danger'} fs-5`}>
                            {item.completado === 'Si' ? 'Completado' : 'Sin Completar'}
                        </h1>

                        {item.completado === 'Si' && (
                            <>
                                <hr />
                                <p>
                                    Fecha de Realización:<br />
                                    {new Date(item.fecharealizacion).toLocaleString()}
                                </p>
                            </>
                        )}
                    </div>
                    <div className='card-footer text-center'>
                        <button type="button" className="btn btn-outline-info btn-sm me-1"
                            onClick={() => editar(item.id)}>Editar
                        </button>
                        {item.completado === 'No' && (
                            <button type="button" className='btn btn-success btn-sm me-1'
                                onClick={() => completarTarea(item.id)}>Completado</button>
                        )}
                        <button type="button" className="btn btn-outline-danger btn-sm"
                            onClick={() => eliminar(item.id, item.tarea)}>Eliminar
                        </button>
                    </div>
                </div>
            </div>
        ));
    };

    if (loading) {
        return <div className="text-center">Cargando tareas...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }

    return (
        <div className="container">
            <h3 className="text-center pt-4">Tareas</h3>
            <div className="text-center py-4">
                <a href="/tareas/agregar" className="btn btn-outline-success">Agregar una Tarea</a>
            </div>
            <div className="row">
                {renderTareas()}
            </div>
        </div>
    );
};

export default Pagetareas;