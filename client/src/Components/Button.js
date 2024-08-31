import React, { memo } from 'react';

const Button = ({ text, textColor, bgColor, IcAfter, onClick, fullWidth }) => {
    return (
        <button
            type="button"
            className={`button ${textColor} ${bgColor} ${fullWidth ? 'full-width' : ''}`}
            onClick={onClick}
        >
            <span>{text}</span>
            <span>{IcAfter && <IcAfter />}</span>
        </button>
    );
};

export default memo(Button);
