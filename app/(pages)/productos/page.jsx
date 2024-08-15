'use client'
import { supabase } from "../../libs/supabase";
import { useEffect, useState } from "react";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'next/navigation';
const Page = () => {
    const router = useRouter(); // Usa useRouter aquí
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchProductos = async () => {
        const categoria="Deportes"
        const { data, error } = await supabase.from('productos').select('*').eq('categoria', categoria);

        if (error) {
            console.error('Error fetching productos:', error);
        } else {
            setDatos(data);
        }
        setLoading(false);
    };
    useEffect(() => {
        fetchProductos();
    }, []);

    const handleProductoAgregado = () => {
        fetchProductos(); // Vuelve a cargar los productos después de agregar uno nuevo
    };
    const handleEliminarProducto = async (id, nombre) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar el producto "${nombre}"?`)) {
            try {
                const { error } = await supabase
                    .from('productos')
                    .delete()
                    .eq('id', id);

                if (error) {
                    console.error('Error al eliminar el producto:', error);
                } else {
                    // Actualizar la lista de productos después de eliminar
                    const { data: productos, error: fetchError } = await supabase
                        .from('productos')
                        .select('*');

                    if (fetchError) {
                        console.error('Error al cargar los productos:', fetchError);
                    } else {
                        setDatos(productos);
                    }
                }
            } catch (error) {
                console.error('Error al eliminar el producto:', error);
            }
        }
    };

    if (loading) return <p>Cargando productos...</p>;
    return (

        <div className="container">
            <h3 className="text-center py-4">Productos</h3>

            <div className="text-end pb-4">
                <a href="/productos/agregar" className="btn btn-outline-success">Crear producto</a>
            </div>
            <DataTable value={datos} stripedRows showGridlines paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} className="card shadow" data-bs-theme="dark">
                <Column field="id" sortable header="ID"></Column>
                <Column field="imagen" header="Imagen" body={(rowData) => (
                    <img
                        src={`https://rngcfmfbftksaprimgbd.supabase.co/storage/v1/object/public/tuzona/${rowData.imagen}`}
                        alt={rowData.nombre}
                        style={{ maxWidth: '50px' }}
                    />
                )}
                ></Column>
                <Column field="nombre" sortable header="Nombre"></Column>
                <Column field="precio" sortable header="Precio"></Column>
                <Column field="categoria" sortable header="Categoria"></Column>
                <Column field="disponible" sortable header="Disponible"></Column>
               
                <Column
                    header="Eliminar"
                    body={(rowData) => (
                        <>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleEliminarProducto(rowData.id)}>
                                Eliminar
                            </button>
                            <button
                                className="btn btn-warning btn-sm ms-2"
                                onClick={() => router.push(`/productos/editar/${rowData.id}`)}>
                                Editar
                            </button>
                        </>

                    )}


                ></Column>


            </DataTable>
        </div>
    )

}

export default Page

