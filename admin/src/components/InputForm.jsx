import React, { memo } from 'react';

const InputForm = ({ label, keyPayload, setValue, type = 'text', invalidFields, setInvalidFields }) => {
    return (
        <div className="input-container">
            <label htmlFor={keyPayload} className="input-label">{label}</label>
            <input
                type={type}
                id={keyPayload}
                className="input-field"
                value={setValue[keyPayload]} // This line assumes setValue is a state object
                onChange={(e) => setValue(prev => ({ ...prev, [keyPayload]: e.target.value }))}
                onFocus={() => setInvalidFields([])}
            />
            {invalidFields.length > 0 && invalidFields.some(i => i.name === keyPayload) && 
                <small className="error-message">
                    {invalidFields.find(i => i.name === keyPayload)?.message}
                </small>
            }
        </div>
    );
};

export default memo(InputForm);
