import React from 'react'
import { Trash2, Edit3, User, DollarSign } from 'lucide-react';

const CardServicio = ({dataServicio}) => {
    return (
        <main className='w-1/4 p-4 m-4 bg-slate-400' key={dataServicio.id}>
            <header>
                <h1>{dataServicio.nombre}</h1>
                <p>{dataServicio.descripcion}</p>
            </header>
            <footer className="p-4 flex items-center gap-2">
                <DollarSign size={18} className="text-gray-400"></DollarSign>
                <p className="text-sm text-gray-500">Precio</p>
                <p className="font-semibold text-gray-800">{dataServicio.precio}</p>
            </footer>
        </main>
    )
}

export default CardServicio
