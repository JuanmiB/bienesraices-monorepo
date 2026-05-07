import { useCallback, useState } from "react";

const useForm = (initialValue) => {
    const [values, setValues] = useState(initialValue);

    const handleChange = useCallback((event) => {
        const { name, value } = event.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    }, []);

    const resetForm = useCallback(() => {
        setValues(initialValue);
    }, [initialValue]);

    const handleSubmit = useCallback((event, onSubmit) => {
        event.preventDefault();
        if (onSubmit) onSubmit(values);
    }, [values]);

    const handleLatLng = useCallback((lat, lng) => {
        setValues((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    }, []);

    const handleGeoData = useCallback((address, city, state) => {
        setValues((prev) => ({ ...prev, address, city, state }));
    }, []);

    return {
        values,
        handleChange,
        resetForm,
        handleSubmit,
        handleLatLng,
        handleGeoData,
        setValues,
    };
};

export default useForm;
