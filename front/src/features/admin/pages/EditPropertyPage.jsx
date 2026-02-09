import { useEffect, useState } from "react";
import { api } from '@shared/services/api';
import { useForm } from '@shared/hooks';
import { BackButton } from '@shared/components';
import { FormularioPropiedad, GaleriaAdmin } from '../components';
import { useParams, useNavigate } from "react-router-dom";

const EditPropertyPage = () => {
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const {id} = useParams()
  const navigate = useNavigate();

  const initialValues = {
    title: "",
    description: "",
    propertyType: "",
    operationType: "",
    price: "",
    currency: "USD",
    bedrooms: "",
    bathrooms: "",
    garages: "",
    totalArea: "",
    coveredArea: "",
    address: "",
    city: "",
    state: "",
    latitude: 0,
    longitude: 0,
  };

  const { values, setValues, handleChange, handleSubmit, handleLatLng, handleGeoData } = useForm(initialValues);

  // Cargar los datos de la propiedad al montar
  useEffect(() => {
    const fetchPropiedad = async () => {
      try {
        const response = await api.get(`/api/v1/users/me/properties/${id}`);
        const data = response.data.data;

        setValues({
          title: data.title,
          description: data.description,
          propertyType: data.propertyType,
          operationType: data.operationType,
          price: data.price,
          currency: data.currency,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          garages: data.garages,
          totalArea: data.totalArea,
          coveredArea: data.coveredArea,
          address: data.address,
          city: data.city,
          state: data.state,
          latitude: Number(data.latitude) || 0,
          longitude: Number(data.longitude) || 0,
        });
        setImagenes(data.images || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchPropiedad();
  }, [id]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      await api.put(`/api/v1/users/me/properties/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("success")
    } catch {
      setStatus("error")
    }
  };

  if (loading) return <p>Cargando...</p>;

  if (status === "success") {
    return (
      <section className="border border-blue-500 p-6 my-4 max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">¡Propiedad actualizada!</h2>
          <p className="text-gray-500 mb-6">Los cambios han sido guardados correctamente.</p>
          <button
            onClick={() => navigate("/admin/mis-propiedades")}
            className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90"
          >
            Ver mis propiedades
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="border border-blue-500 p-6 my-4 max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="mb-4">
        <BackButton fallbackPath="/admin/mis-propiedades" label="Volver a mis propiedades" />
      </div>
      <h2 className="text-2xl font-semibold text-blue-600 mb-6">Editar Propiedad</h2>
      {status === "error" && <p className="text-red-500 text-sm mb-4">Error al actualizar la propiedad. Intentá de nuevo.</p>}

      <div className="mb-8">
        <GaleriaAdmin propertyId={id} images={imagenes} onImagesChange={setImagenes} />
      </div>

      <FormularioPropiedad
        values={values}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleLatLng={handleLatLng}
        handleGeoData={handleGeoData}
        onSubmit={onSubmit}
        submitLabel="Guardar cambios"
      />
    </section>
  );
};

export default EditPropertyPage;
