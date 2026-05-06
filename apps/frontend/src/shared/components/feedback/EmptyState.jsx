import PropTypes from 'prop-types';

const EmptyState = ({ icon = '📭', title, description, action }) => (
  <div className="text-center py-20">
    <div className="text-6xl mb-4" aria-hidden="true">{icon}</div>
    <h3 className="text-2xl font-bold text-gray-700 mb-2">{title}</h3>
    {description && <p className="text-gray-500 mb-6">{description}</p>}
    {action}
  </div>
);

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  description: PropTypes.node,
  action: PropTypes.node,
};

export default EmptyState;
