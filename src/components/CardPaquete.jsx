import React from 'react'

const CardPaquete = ({dataPaquete}) => {
    return (
        <main className='w-full bg-slate-400 m-4 p-2'>
            <h1>{dataPaquete.nombre}</h1>
        </main>
    )
}

export default CardPaquete
