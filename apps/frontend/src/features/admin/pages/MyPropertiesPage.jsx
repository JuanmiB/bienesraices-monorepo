import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@features/auth/context';
import { useEffect, useState } from 'react';
import { api } from '@shared/services/api';
import { DashboardStats, ControlsBar, PropertiesGrid } from '../components';
import { Footer } from '@shared/components/layout';
import { BackButton } from '@shared/components';


const MyPropertiesPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useAuth()
    const [propiedades, setPropiedades] = useState([])
    const [filteredPropiedades, setFilteredPropiedades] = useState([])
    const [categorias, setCategorias] = useState([])
    const [selectedCategoria, setSelectedCategoria] = useState('')
    const [sortBy, setSortBy] = useState('date-desc')
    const [confirmId, setConfirmId] = useState(null)
    const [toastMsg, setToastMsg] = useState(null)

    // Redirigir si no está autenticado
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/auth/acceder');
        }
    }, [isAuthenticated, loading, navigate]);

    useEffect(() => {
        if (toastMsg) {
            const t = setTimeout(() => setToastMsg(null), 3000);
            return () => clearTimeout(t);
        }
    }, [toastMsg]);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/v1/users/me/properties/${id}`)
            setToastMsg({ text: 'Propiedad eliminada con éxito', ok: true });
            setPropiedades(prev => prev.filter(p => p.id !== id));
            setFilteredPropiedades(prev => prev.filter(p => p.id !== id));
        } catch {
            setToastMsg({ text: 'No se pudo eliminar la propiedad. Intenta nuevamente.', ok: false });
        } finally {
            setConfirmId(null);
        }
    };

    const handleTogglePublish = async (id, active) => {
        try {
            const response = await api.patch(`/api/v1/users/me/properties/${id}`, {
                active: !active
            });

            setPropiedades((prevPropiedades) =>
                prevPropiedades.map((propiedad) =>
                    propiedad.id === id
                        ? { ...propiedad, active: response.data.data.active }
                        : propiedad
                )
            );

            setToastMsg({ text: `La propiedad fue ${!active ? "publicada" : "despublicada"} con éxito.`, ok: true });
        } catch {
            setToastMsg({ text: "Hubo un error al actualizar la publicación. Intenta nuevamente.", ok: false });
        }
    };

    const fetchPropiedades = async () => {
        try {
            const response = await api.get('/api/v1/users/me/properties')
            const propiedades = response.data.data
            setPropiedades(propiedades)
            setFilteredPropiedades(propiedades)
        }
        catch (error) {
            console.error('Error fetching properties:', error);
        }
    }

    const fetchCategorias = async () => {
        try {
            const response = await api.get('/api/v1/properties/types')
            setCategorias(response.data.propertyTypes.map(t => ({ id: t.value, name: t.label })))

        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    useEffect(() => {
        // Llamada a las funciones de fetch cuando sea necesario
        if (isAuthenticated && !loading) {
            fetchPropiedades();
            fetchCategorias();
        }
    }, [isAuthenticated, loading]);

    const handleFilterChange = (e) => {
        const categoria = e.target.value;
        setSelectedCategoria(categoria);

        // Filtrar las propiedades dependiendo de si hay o no una categoría seleccionada
        if (categoria === '') {
            setFilteredPropiedades(propiedades); // Mostrar todas las propiedades
        } else {
            const propiedadesFiltradas = propiedades.filter(
                (propiedad) => propiedad.propertyType === categoria
            );
            setFilteredPropiedades(propiedadesFiltradas);
        }
    };

    const sortProperties = (properties, sortBy) => {
        const sorted = [...properties]
        switch(sortBy) {
            case 'price-asc':
                return sorted.sort((a, b) => Number(a.price) - Number(b.price))
            case 'price-desc':
                return sorted.sort((a, b) => Number(b.price) - Number(a.price))
            case 'date-asc':
                return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            case 'date-desc':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            case 'name-asc':
                return sorted.sort((a, b) => a.title.localeCompare(b.title))
            default:
                return sorted
        }
    }

    const sortedPropiedades = sortProperties(filteredPropiedades, sortBy);

    if (loading) return <p className="text-center my-12 text-gray-500">Cargando...</p>;

    if (!isAuthenticated) return null;

    return (
        <>
            <div className="py-10 px-4 md:px-10 max-w-7xl mx-auto">
                {/* BackButton */}
                <div className="mb-4">
                    <BackButton fallbackPath="/" label="Volver al inicio" />
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                        Mis <span className="text-primary-600">Propiedades</span>
                    </h1>
                    <p className="text-gray-600">Administra tus publicaciones</p>
                </div>

                {/* Dashboard */}
                {propiedades.length > 0 && <DashboardStats properties={propiedades} />}

                {/* Botón crear */}
                <Link
                    to="crear-propiedad"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition mb-6"
                >
                    <span className="text-xl">➕</span>
                    Publicar Nueva Propiedad
                </Link>

                {propiedades.length > 0 ? (
                    <>
                        {/* Controles */}
                        <ControlsBar
                            categorias={categorias}
                            selectedCategoria={selectedCategoria}
                            onFilterChange={handleFilterChange}
                            sortBy={sortBy}
                            onSortChange={(e) => setSortBy(e.target.value)}
                        />

                        {/* Grid */}
                        <PropertiesGrid
                            properties={sortedPropiedades}
                            onDelete={(id) => setConfirmId(id)}
                            onTogglePublish={handleTogglePublish}
                        />
                    </>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-xl">
                        <div className="text-6xl mb-4">🏠</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No tienes propiedades todavía</h3>
                        <p className="text-gray-500 mb-6">Comienza publicando tu primera propiedad</p>
                    </div>
                )}
            </div>

            {/* Modal confirmación */}
            {confirmId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
                        <p className="text-gray-700 mb-4">¿Estás seguro de que deseas eliminar esta propiedad?</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setConfirmId(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                            <button onClick={() => handleDelete(confirmId)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toastMsg && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm max-w-xs ${toastMsg.ok ? 'bg-green-600' : 'bg-red-600'}`}>
                    {toastMsg.text}
                </div>
            )}

            <Footer />
        </>
    )
}

export default MyPropertiesPage
