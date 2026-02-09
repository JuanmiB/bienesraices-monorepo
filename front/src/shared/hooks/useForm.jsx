import { useState } from "react";

const useForm = (initialValue) => {
    const [values, setValues] = useState(initialValue)

    const handleChange = (event) => {
        const { name, value } = event.target
        setValues({ ...values, [name]: value})
    }

    const resetForm = () => {
        setValues(initialValue)
    }

    const handleSubmit = (event, onSubmit) =>{
        event.preventDefault()
        if(onSubmit) onSubmit(values)
    }

    const handleLatLng = (lat, lng) => {
        setValues({ ...values, latitude: lat, longitude: lng})
    }

    const handleGeoData = (address, city, state) => {
        setValues(prev => ({ ...prev, address, city, state }));
    };

return {
    values,
    handleChange,
    resetForm,
    handleSubmit,
    handleLatLng,
    handleGeoData,
    setValues
}
}
export default useForm
