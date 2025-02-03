import React from 'react'

const CardPaquete = ({dataPaquete}) => {
    return (
        <main className='w-full h-36 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden relative group cursor-pointer select-none p-4'>
            <h1>{dataPaquete.nombre}</h1>
        </main>
    )
}

export default CardPaquete
