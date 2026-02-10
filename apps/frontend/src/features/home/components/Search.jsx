import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";
const Search = ({selectOps}) => {

    const [searchTerm, setSearchTerm] = useState("");
    const [categoria, setCategoria] = useState('')
    const navigate = useNavigate();

    const handleInputChange = (e) => {
      setSearchTerm(e.target.value);
    };

    const handleCategoriaChange = (e)=>{
        setCategoria(e.target.value)
    }

    const handleSearch = (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append("query", searchTerm);
        if (categoria) queryParams.append("propertyType", categoria);
        navigate(`/buscar?${queryParams.toString()}`);
      };

    return (
        <section className="flex flex-col rounded-b-2xl custom:rounded-b-[0] custom:px-24 ">
            <h2 className="text-3xl font-bold text-white pt-2">Todos tenemos un lugar</h2>
            <form className="w-full flex flex-col py-4 " onSubmit={handleSearch}>

              <div className="flex flex-col px-4 lg:px-0 custom:items-center custom:justify-center w-full gap-2 custom:flex-row">
                    <div>
                        <select
                        value={categoria}
                        onChange={handleCategoriaChange}
                        name=""
                        id=""
                        className="w-full custom:w-[200px] border-slate-300 rounded-md px-3 text-slate-600 focus:outline-none focus:border-blue-600 h-[56px]">
                        <option value="">Seleccionar categoría...</option>
                        {selectOps.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
                        </select>
                    </div>

                    <div className="w-full custom:flex custom:flex-row custom:justify-center custom:items-center custom:bg-white border-slate-300 rounded-md placeholder:italic text-slate-600 focus:outline-none focus:border-blue-600 focus:ring focus:ring-blue-200">
                        <input
                        type="text"
                        className="w-full px-5 border-slate-300 rounded-md placeholder:italic text-slate-600 focus:outline-none h-[50px]"
                        placeholder="Casa, Palermo, Alquiler"
                        value={searchTerm}
                        onChange={handleInputChange}
                        />

                        <button
                        type="submit"
                        className="w-full mt-5 custom:w-32 p-3 custom:m-1 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200 transition duration-200 ease-in-out"
                        >Buscar</button>
                    </div>
                </div>
            </form>
        </section>
    )
}

Search.propTypes = {
    selectOps: PropTypes.array
}

export default Search
