import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { House, Terrain, Market, Garage, Offices, Department } from '../../../icons/icon';
import { api } from '@shared/services/api';

const iconMapping = {
    Casa: <House />,
    Departamento: <Department />,
    Terreno: <Terrain />,
    'Local Comercial': <Market />,
    Oficina: <Offices />,
    Depósito: <Garage />
};

const CardCategories = () => {
    const navigate = useNavigate();
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleSearch = (category) => {
        navigate(`/buscar?propertyType=${category}`);
    };


    // Obtener categorías desde la API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/api/v1/properties/types');
                const categoriasFormateadas = data.propertyTypes.map(type => ({
                    id: type.value,
                    name: type.label
                }));
                setCategorias(categoriasFormateadas); // Actualizar el estado con el array de objetos
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
            finally {
                setLoading(false); // Cambiar el estado de `loading` a `false`
            }
        };

        fetchCategories();
    }, []);

    // Renderizar las categorías
    return (
        <div className="grid grid-cols-2 gap-4">
            {loading ? (
                <p className="text-center col-span-2">Cargando categorías...</p>
            ) : (
                categorias.map((categoria) => (
                    <div
                        key={categoria.id}
                        className="grid grid-cols-2 items-center border rounded cursor-pointer hover:shadow-lg"
                        onClick={() => handleSearch(categoria.id)}
                    >
                        <span className="flex items-center justify-center bg-gray-200 p-4">
                            {iconMapping[categoria.name] || <House />}
                        </span>
                        <span className="p-4 flex items-center justify-center font-medium text-gray-700">
                            {categoria.name}
                        </span>
                    </div>
                ))
            )}
        </div>
    );
};

export default CardCategories;