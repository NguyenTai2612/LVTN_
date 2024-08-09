import React from 'react';
import PropTypes from 'prop-types';

const GuitarHeader = ({ logoText, links, viewAllText, viewAllHref, width }) => {
  return (
    <div className="guitar-header" style={{ width }}>
      <div className="logo">{logoText}</div>
      <div className="links">
        {links.map((link, index) => (
          <span key={index}>
            <a href={link.href}>{link.text}</a>
            {index < links.length - 1 && ' | '}
          </span>
        ))}
      </div>
      <div className="view-all">
        <a href={viewAllHref}>{viewAllText}</a>
      </div>
    </div>
  );
};

GuitarHeader.propTypes = {
  logoText: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    })
  ).isRequired,
  viewAllText: PropTypes.string.isRequired,
  viewAllHref: PropTypes.string.isRequired,
  width: PropTypes.string,
};

GuitarHeader.defaultProps = {
  width: '100%', // Default width to 100% if not provided
};

export default GuitarHeader;
