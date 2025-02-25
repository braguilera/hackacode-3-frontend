import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Briefcase, Mail, ArrowRight, EyeOff, Eye, UserPlus } from 'lucide-react';
import { postDatos } from '../api/crud';

const Registro = () => {
    const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    roleRequest: {
      roleListName: ['']
    }
  });
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const rolesPermitidos = ['ADMIN', 'RECEPCIONISTA', 'DIRECTOR'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role') {
      setFormData(prev => ({
        ...prev,
        roleRequest: { roleListName: [value] }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postDatos('/api/auth/sign-up', formData, 'Error en el registro');
      setTimeout(() => {
          setMensaje({ tipo: 'exito', texto: 'Cuenta creada exitosamente' });

    }, 2000);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message || 'Error al crear la cuenta' });
    } finally {
    setFormData({
        username: '',
        password: '',
        roleRequest: {
          roleListName: ['']
        }})
      setLoading(false);
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full w-full flex items-center justify-center p-4"
    >
      <body className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <header className="text-center mb-8">
          <div className="mx-auto bg-blue-100 w-fit p-4 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Crear cuenta nueva</h1>
          <p className="text-gray-600">Registra nuevos usuarios para el sistema</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de usuario
            </label>
            <footer className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                required
              />
            </footer>
          </section>

          <section>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <footer className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                required
              />
                <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors'
                    >
                      {showPassword ? (
                        <EyeOff className='w-5 h-5' />
                      ) : (
                        <Eye className='w-5 h-5' />
                      )}
                    </button>
            </footer>
          </section>

          <section>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol del usuario
            </label>
            <footer className="relative">
              <select
                name="role"
                value={formData.roleRequest.roleListName[0]}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none bg-white"
                required
              >
                <option value="" disabled>Seleccione un rol</option>
                {rolesPermitidos.map((rol) => (
                  <option key={rol} value={rol}>{rol}</option>
                ))}
              </select>
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </footer>
          </section>

          {mensaje && (
            <aside className={`p-3 rounded-lg text-sm ${
              mensaje.tipo === 'exito' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {mensaje.texto}
            </aside>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <span>Crear cuenta</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>
      </body>
    </motion.main>
  );
};

export default Registro;