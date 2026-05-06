import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@features/auth/context';
import { usePropertyTypes } from '@features/properties/hooks';
import { getMyProperties, deleteProperty, togglePublish } from '../services';
import { DashboardStats, ControlsBar, PropertiesGrid } from '../components';
import { Footer } from '@shared/components/layout';
import { BackButton } from '@shared/components';
import { Spinner, EmptyState, useToast } from '@shared/components/feedback';

const MyPropertiesPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const toast = useToast();
    const { isAuthenticated, loading } = useAuth();
    const [selectedCategoria, setSelectedCategoria] = useState('');
    const [sortBy, setSortBy] = useState('date-desc');
    const [confirmId, setConfirmId] = useState(null);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/auth/acceder');
        }
    }, [isAuthenticated, loading, navigate]);

    const { data: propiedades = [] } = useQuery({
        queryKey: ['my-properties'],
        queryFn: getMyProperties,
        enabled: isAuthenticated && !loading,
    });

    const { data: typesData } = usePropertyTypes();
    const categorias = (typesData?.propertyTypes ?? []).map(t => ({ id: t.value, name: t.label }));

    const deleteMutation = useMutation({
        mutationFn: deleteProperty,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-properties'] });
            toast.success('Propiedad eliminada con éxito');
        },
        onError: () => {
            toast.error('No se pudo eliminar la propiedad. Intenta nuevamente.');
        },
        onSettled: () => setConfirmId(null),
    });

    const publishMutation = useMutation({
        mutationFn: ({ id, active }) => togglePublish(id, !active),
        onSuccess: (_data, { active }) => {
            queryClient.invalidateQueries({ queryKey: ['my-properties'] });
            toast.success(`La propiedad fue ${!active ? 'publicada' : 'despublicada'} con éxito.`);
        },
        onError: () => {
            toast.error('Hubo un error al actualizar la publicación. Intenta nuevamente.');
        },
    });

    const filteredPropiedades = selectedCategoria
        ? propiedades.filter(p => p.propertyType === selectedCategoria)
        : propiedades;

    const sortProperties = (properties, sortKey) => {
        const sorted = [...properties];
        switch (sortKey) {
            case 'price-asc':
                return sorted.sort((a, b) => Number(a.price) - Number(b.price));
            case 'price-desc':
                return sorted.sort((a, b) => Number(b.price) - Number(a.price));
            case 'date-asc':
                return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'date-desc':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'name-asc':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            default:
                return sorted;
        }
    };

    const sortedPropiedades = sortProperties(filteredPropiedades, sortBy);

    if (loading) return <Spinner fullScreen label="Cargando..." />;

    if (!isAuthenticated) return null;

    return (
        <>
            <div className="py-10 px-4 md:px-10 max-w-7xl mx-auto">
                <div className="mb-4">
                    <BackButton fallbackPath="/" label="Volver al inicio" />
                </div>

                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                        Mis <span className="text-primary-600">Propiedades</span>
                    </h1>
                    <p className="text-gray-600">Administra tus publicaciones</p>
                </div>

                {propiedades.length > 0 && <DashboardStats properties={propiedades} />}

                <Link
                    to="crear-propiedad"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition mb-6"
                >
                    <span className="text-xl">➕</span>
                    Publicar Nueva Propiedad
                </Link>

                {propiedades.length > 0 ? (
                    <>
                        <ControlsBar
                            categorias={categorias}
                            selectedCategoria={selectedCategoria}
                            onFilterChange={(e) => setSelectedCategoria(e.target.value)}
                            sortBy={sortBy}
                            onSortChange={(e) => setSortBy(e.target.value)}
                        />

                        <PropertiesGrid
                            properties={sortedPropiedades}
                            onDelete={(id) => setConfirmId(id)}
                            onTogglePublish={(id, active) => publishMutation.mutate({ id, active })}
                        />
                    </>
                ) : (
                    <EmptyState
                        icon="🏠"
                        title="No tienes propiedades todavía"
                        description="Comienza publicando tu primera propiedad"
                    />
                )}
            </div>

            {confirmId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
                        <p className="text-gray-700 mb-4">¿Estás seguro de que deseas eliminar esta propiedad?</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setConfirmId(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                            <button onClick={() => deleteMutation.mutate(confirmId)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default MyPropertiesPage;
