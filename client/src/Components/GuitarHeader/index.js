// GuitarHeader.js
import React from 'react';
import PropTypes from 'prop-types';

const GuitarHeader = ({ logoText, links, viewAllText, viewAllHref }) => {
  return (
    <div className="guitar-header">
      <div className="logo">{logoText}</div>
      <div className="links">
        {links.map((link, index) => (
          <a key={index} href={link.href} className="link-item">
            {link.text}
          </a>
        ))}
      </div>
      <a href={viewAllHref} className="view-all">
        {viewAllText}
      </a>
    </div>
  );
};

GuitarHeader.propTypes = {
  logoText: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired
    })
  ).isRequired,
  viewAllText: PropTypes.string.isRequired,
  viewAllHref: PropTypes.string.isRequired
};

export default GuitarHeader;
