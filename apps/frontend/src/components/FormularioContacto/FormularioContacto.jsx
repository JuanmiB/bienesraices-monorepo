import { useState } from "react";
import PropTypes from "prop-types";
import { api } from "@shared/services/api";

const FormularioContacto = ({ propertyId }) => {
    const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
    const [status, setStatus] = useState(null); // null | "success" | "error"
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(`/api/v1/properties/${propertyId}/contact`, formData);
            setStatus("success");
        } catch {
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    if (status === "success") {
        return (
            <div className="flex flex-col">
                <div className="w-full bg-white shadow-md rounded-lg p-6 text-center">
                    <h3 className="text-xl font-semibold text-green-600 mb-2">¡Mensaje enviado!</h3>
                    <p className="text-sm text-gray-500">El propietario se comunicará contigo pronto.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <form onSubmit={handleSubmit} className="w-full bg-white shadow-md rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-6 text-center">Envíanos un mensaje</h3>

                {status === "error" && (
                    <p className="text-red-500 text-sm text-center mb-4">Error al enviar el mensaje. Intentá de nuevo.</p>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <label className="flex flex-col">
                        <span className="text-sm text-gray-600 mb-1">Nombre y apellido</span>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nombre y apellido"
                            className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>
                    <label className="flex flex-col">
                        <span className="text-sm text-gray-600 mb-1">Teléfono</span>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Teléfono"
                            className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>
                </div>

                <label className="flex flex-col mt-4">
                    <span className="text-sm text-gray-600 mb-1">Email</span>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </label>

                <label className="flex flex-col mt-4">
                    <span className="text-sm text-gray-600 mb-1">Mensaje</span>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Escribe tu mensaje aquí"
                        className="border rounded-md p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white font-semibold py-3 mt-6 rounded-md hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
                >
                    {loading ? "Enviando..." : "Contactar"}
                </button>
            </form>

            <small className="text-center mt-4 text-gray-600">
                Al enviar, estás aceptando los Términos y Condiciones de Uso y la Política de Privacidad.
            </small>
        </div>
    );
};

FormularioContacto.propTypes = {
    propertyId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired
};

export default FormularioContacto