import { useNavigate } from 'react-router-dom';
import { House, Terrain, Market, Garage, Offices, Department } from '@shared/assets/icons/icon';
import { usePropertyTypes } from '@features/properties/hooks';

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
    const { data, isLoading: loading } = usePropertyTypes();
    const categorias = (data?.propertyTypes ?? []).map(type => ({
        id: type.value,
        name: type.label,
    }));

    const handleSearch = (category) => {
        navigate(`/buscar?propertyType=${category}`);
    };

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