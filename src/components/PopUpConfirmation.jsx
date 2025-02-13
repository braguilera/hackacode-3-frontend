import React from 'react'

const PopUpConfirmation = () => {
    return (
        <main className='bg-white rounded-3xl p-6 h-auto w-full relative shadow-lg border border-gray-100'>
            <h2>Esta seguro que desea borrar a id 1?</h2>

            <footer>
                <button>Aceptar</button>
                <button>Cancelar</button>
            </footer>
        </main>
    )
}

export default PopUpConfirmation
