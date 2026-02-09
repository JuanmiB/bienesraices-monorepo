import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MapComponent from "../../../components/Mapa/Mapa";
import { api } from "@shared/services/api";
import { getAddress } from "@shared/utils";

export const FormularioPropiedad = ({ values, handleChange, handleSubmit, handleLatLng, handleGeoData, onSubmit, isEditable, submitLabel = 'Publicar' }) => {
    const [loading, setLoading] = useState(true);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [operationTypes, setOperationTypes] = useState([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await api.get('/api/v1/properties/types');
                setPropertyTypes(response.data.propertyTypes);
                setOperationTypes(response.data.operationTypes);

                // Solo solicitar geolocation si es nuevo (latitude y longitude son 0)
                // y si isEditable es true (creación de nueva propiedad)
                if (isEditable && values.latitude === 0 && values.longitude === 0) {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            (pos) => {
                                const userLat = pos.coords.latitude;
                                const userLng = pos.coords.longitude;
                                handleLatLng(userLat, userLng);
                            },
                            () => {
                                // Si falla, usar coordenadas por defecto (Buenos Aires)
                                handleLatLng(-34.6037, -58.3816);
                            }
                        );
                    } else {
                        // Si no hay geolocation, usar coordenadas por defecto (Buenos Aires)
                        handleLatLng(-34.6037, -58.3816);
                    }
                }
            } catch (error) {
                // Error al cargar tipos de propiedades o geolocalización
                console.error('Error loading initial data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData()
    }, [handleLatLng, isEditable, values.latitude, values.longitude]);

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const data = await getAddress(values.latitude, values.longitude)
                handleGeoData(data.address.road, data.address.city, data.address.state)
            } catch (error) {
                // Error al obtener dirección desde coordenadas (servicio de geocoding no disponible)
                console.error('Error fetching address:', error);
            }
        }
        if (values.latitude && values.longitude) {
            fetchAddress()
        }
    }, [values.latitude, values.longitude, handleGeoData])


    if (loading) {
        return <p className="text-center text-lg font-medium">Cargando datos, por favor espera...</p>;
    }

    return (
        <form onSubmit={(event) => handleSubmit(event, onSubmit)} className="space-y-6">
            <label className="block">
                <span className="text-gray-600 font-medium">Título del anuncio</span>
                <input
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    placeholder="Título de la propiedad"
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-emerald-300"
                />
            </label>

            <label className="block">
                <span className="text-gray-600 font-medium">Describe tu propiedad</span>
                <textarea
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    placeholder="Descripción..."
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-emerald-300"
                />
            </label>

            <CategoriaPrecio values={values} handleChange={handleChange} propertyTypes={propertyTypes} operationTypes={operationTypes} />

            <CamposPropiedad values={values} handleChange={handleChange} />


            <div className="p-4">
                <h3>Mapa</h3>
                <p>Selecciona la ubicación de la propiedad</p>
                <p>{values.address ? values.address : 'No hay calle'}</p>
                <MapComponent
                    lat={values.latitude}
                    lng={values.longitude}
                    onChange={handleLatLng}
                    isEditable
                />
            </div>
            <button type="submit" className="bg-emerald-500 text-white py-2 px-4 rounded-md">{submitLabel}</button>
        </form>
    );
};

FormularioPropiedad.propTypes = {
    values: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        propertyType: PropTypes.string,
        operationType: PropTypes.string,
        currency: PropTypes.string,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        bedrooms: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        bathrooms: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        garages: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        totalArea: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        coveredArea: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        address: PropTypes.string
    }).isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleLatLng: PropTypes.func.isRequired,
    handleGeoData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isEditable: PropTypes.bool,
    submitLabel: PropTypes.string
};

export const CategoriaPrecio = ({ values, handleChange, propertyTypes, operationTypes }) => {
    return (
        <div className="border-2 border-gray-200 p-4 rounded-md space-y-4 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10">
            <label className="block mt-4">
                <span className="text-gray-600 font-medium mr-2">Tipo de propiedad:</span>
                <select
                    name="propertyType"
                    value={values.propertyType}
                    onChange={handleChange}
                    className="lg:w-1/3 h-[42px] mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-emerald-300"
                >
                    <option value="">Seleccionar...</option>
                    {propertyTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
            </label>

            <label className="block mt-4">
                <span className="text-gray-600 font-medium mr-2">Tipo de operación:</span>
                <select
                    name="operationType"
                    value={values.operationType}
                    onChange={handleChange}
                    className="lg:w-1/3 h-[42px] mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-emerald-300"
                >
                    <option value="">Seleccionar...</option>
                    {operationTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
            </label>

            <label className="flex items-center space-x-2">
                <span className="text-gray-600 font-medium mr-2">Moneda:</span>
                <select
                    name="currency"
                    value={values.currency}
                    onChange={handleChange}
                    className="lg:w-1/3 h-[42px] mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-emerald-300"
                >
                    <option value="USD">USD</option>
                    <option value="ARS">ARS</option>
                </select>
            </label>

            <label className="flex items-center space-x-2">
                <span className="text-gray-600 font-medium mr-2">Precio:</span>
                <input
                    type="text"
                    name="price"
                    value={values.price}
                    onChange={handleChange}
                    placeholder="10000 - 50000"
                    className="lg:w-2/3 w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-emerald-300"
                />
            </label>
        </div>
    );
};

CategoriaPrecio.propTypes = {
    values: PropTypes.shape({
        propertyType: PropTypes.string,
        operationType: PropTypes.string,
        currency: PropTypes.string,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired,
    handleChange: PropTypes.func.isRequired,
    propertyTypes: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string
    })).isRequired,
    operationTypes: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string
    })).isRequired
};

export const CamposPropiedad = ({ values, handleChange }) => {
    return (
        <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <label className="block">
                <input
                    type="text"
                    name="bedrooms"
                    value={values.bedrooms}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-emerald-300"
                />
                <span className="text-gray-600 font-medium">Dormitorios</span>
            </label>

            <label className="block">
                <input
                    type="text"
                    name="bathrooms"
                    value={values.bathrooms}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-emerald-300"
                />
                <span className="text-gray-600 font-medium">Baños</span>
            </label>

            <label className="block">
                <input
                    type="text"
                    name="garages"
                    value={values.garages}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-emerald-300"
                />
                <span className="text-gray-600 font-medium">Cochera</span>
            </label>

            <label className="block">
                <input
                    type="text"
                    name="totalArea"
                    value={values.totalArea}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-emerald-300"
                />
                <span className="text-gray-600 font-medium">Metros cuadrados</span>
            </label>

            <label className="block">
                <input
                    type="text"
                    name="coveredArea"
                    value={values.coveredArea}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-emerald-300"
                />
                <span className="text-gray-600 font-medium">Metros cubiertos</span>
            </label>
        </div>
    );
};

CamposPropiedad.propTypes = {
    values: PropTypes.shape({
        bedrooms: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        bathrooms: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        garages: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        totalArea: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        coveredArea: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired,
    handleChange: PropTypes.func.isRequired
};
