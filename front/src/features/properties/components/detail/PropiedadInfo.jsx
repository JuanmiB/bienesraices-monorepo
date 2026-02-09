// PropiedadInfo.js
import PropTypes from 'prop-types';
import { Baños, Cochera, Dormitorio, MetrosTotal } from "../../../../icons/icon";

const PropiedadInfo = ({ title, price, currency, address, bedrooms, bathrooms, garages, totalArea }) => (
  <div className="p-6 border-2 rounded bg-slate-100 h-fit md:hover:border-blue-600">
    <div className="grid grid-cols-2">
      <p className="font-extrabold text-2xl">{title}</p>
      <p className="font-extrabold text-xl text-violet-600">{currency} {Number(price)?.toLocaleString() || '0'}</p>
      <p>{address}</p>
    </div>
    <ul className="grid grid-cols-2 sm:grid-cols-3 place-content-start">
      <li className="flex justify-start items-center gap-2 ">
        <span><Dormitorio /></span>
        <p>Dormitorio: {bedrooms}</p>
      </li>
      <li className="flex justify-start items-center gap-2">
        <span><Baños /></span>
        <p>Baño: {bathrooms}</p>
      </li>
      <li className="flex justify-start items-center gap-2">
        <span><Cochera /></span>
        <p>Cochera: {garages}</p>
      </li>
      <li className="flex justify-start items-center gap-2 ">
        <span><MetrosTotal /></span>
        <p>M2: {totalArea}</p>
      </li>
    </ul>
  </div>
);

PropiedadInfo.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  currency: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  bedrooms: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bathrooms: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  garages: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  totalArea: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default PropiedadInfo;
