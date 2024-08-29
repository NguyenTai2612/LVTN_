const GuitarHeader = ({ logoText, links, viewAllText, viewAllHref, width }) => {
  return (
    <div className="guitar-header1" style={{ width }}>
      <div className="logo1">{logoText}</div>
      <div className="links">
        {links.length > 0 ? (
          links.map((link, index) => (
            <span key={index}>
              <a href={link.href}>{link.text}</a>
              {index < links.length - 1 && ' | '}
            </span>
          ))
        ) : (
          <span>No subcategories available</span>
        )}
      </div>
      <div className="view-all">
        <a href={viewAllHref}>{viewAllText}</a>
      </div>
    </div>
  );
};


export default GuitarHeader;
