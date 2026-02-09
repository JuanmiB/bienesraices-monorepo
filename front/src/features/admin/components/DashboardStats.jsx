import PropTypes from 'prop-types';

const StatCard = ({ label, value, icon, bgColor, textColor }) => (
  <div className={`${bgColor} rounded-lg p-4 border border-gray-200`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  </div>
)

const DashboardStats = ({ properties = [] }) => {
  const total = properties.length
  const publicadas = properties.filter(p => p.active).length
  const borradores = total - publicadas
  const precioPromedio = total > 0
    ? properties.reduce((sum, p) => sum + Number(p.price), 0) / total
    : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        label="Total Propiedades"
        value={total}
        icon="🏠"
        bgColor="bg-blue-50"
        textColor="text-blue-600"
      />
      <StatCard
        label="Publicadas"
        value={publicadas}
        icon="✅"
        bgColor="bg-green-50"
        textColor="text-green-600"
      />
      <StatCard
        label="Borradores"
        value={borradores}
        icon="📝"
        bgColor="bg-yellow-50"
        textColor="text-yellow-600"
      />
      <StatCard
        label="Precio Promedio"
        value={`USD ${Math.round(precioPromedio).toLocaleString()}`}
        icon="💰"
        bgColor="bg-primary-50"
        textColor="text-primary-600"
      />
    </div>
  )
}

DashboardStats.propTypes = {
  properties: PropTypes.array
};

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired
};

export default DashboardStats
