import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@shared/services/api';
import CardPropiedadDestacada from './CardPropiedadDestacada';

const PropiedadesDestacadas = () => {
    const [propiedades, setPropiedades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    

    useEffect(() => {
        const fetchPropiedadesDestacadas = async () => {
            try {
                const { data } = await api.get('/api/v1/properties?featured=true');
            
                
                setPropiedades(data.data || []);
            } catch {
                setError('Error al cargar propiedades destacadas');
            } finally {
                setLoading(false);
            }
        };

        fetchPropiedadesDestacadas();
    }, []);

    if (loading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Propiedades Destacadas
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Descubre las mejores propiedades seleccionadas para ti
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-red-500">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90"
                    >
                        Reintentar
                    </button>
                </div>
            </section>
        );
    }

    if (propiedades.length === 0) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Propiedades Destacadas
                    </h2>
                    <p className="text-gray-600">No hay propiedades disponibles en este momento</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Propiedades Destacadas
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Descubre las mejores propiedades seleccionadas para ti
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {propiedades.slice(0, 6).map((propiedad) => (
                        <CardPropiedadDestacada
                            key={propiedad.id}
                            propiedad={propiedad}
                            onClick={() => navigate(`/propiedades/${propiedad.id}`)}
                        />
                    ))}
                </div>

                <div className="text-center mt-10">
                    <button
                        onClick={() => navigate('/buscar')}
                        className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-lg
                                   hover:opacity-90 transition-all font-semibold shadow-md
                                   hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        Ver todas las propiedades
                    </button>
                </div>
            </div>
        </section>
    );
};

// Componente Skeleton para loading
const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-300" />
        <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-300 rounded w-3/4" />
            <div className="h-6 bg-gray-300 rounded w-1/2" />
            <div className="h-4 bg-gray-300 rounded w-full" />
            <div className="pt-3 border-t border-gray-100 flex gap-4">
                <div className="h-4 bg-gray-300 rounded w-16" />
                <div className="h-4 bg-gray-300 rounded w-16" />
            </div>
        </div>
    </div>
);

export default PropiedadesDestacadas;
