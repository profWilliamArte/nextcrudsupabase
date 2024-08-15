
"use client"
import { supabase } from "../../../libs/supabase";
import { useRouter,useParams } from "next/navigation";
import { useEffect, useState } from "react"
const PageAgrearTareas = () => {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [tarea, setTarea] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Nuevo estado para mostrar el 
    
  const manejoTarea = (e) => {
    setTarea(e.target.value)
    //console.log(tarea)
  }
    const handleSudmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

 
        // Insertar el nuevo producto en la tabla
        const completado="no";
        const fechacreacion = new Date();
        const fecharealizacion = new Date();
        const { data, error } = await supabase
            .from("todo")
            .insert([{
                tarea,
                completado,
                fechacreacion,
                fecharealizacion
              
            }]);

        if (error) {
            setError("Error al agregar la tarea: " + error.message);
        } else {
            setShowSuccessMessage(true); // Mostrar el mensaje de éxito
            setTarea("");
            setTimeout(() => {
                router.push('/tareas'); // Redirigir a la lista de productos
            }, 200);
        }
        setLoading(false);
    };
  return (
    <div className="container">
        <h3 className="text-center py-4">Agregar una Tarea Supabase</h3>
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card" data-bs-theme="dark">
            <form onSubmit={handleSudmit} >
                <div className="card-header">
                  <div className="mb-3">
                    <label htmlFor="tarea" className="form-label">Tarea</label>
                    <textarea className="form-control" value={tarea} placeholder="indique la tarea" id="tarea" rows="4" onChange={manejoTarea}  required></textarea>
                  </div>
                    </div>
                  <div className="card-footer text-center"> 
                    <button type="submit" className="btn btn-outline-success">Agregar </button>
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

export default PageAgrearTareas