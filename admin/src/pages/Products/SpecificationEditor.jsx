import React, { useState } from 'react';
import { CiEdit } from "react-icons/ci";
import { FaDeleteLeft } from "react-icons/fa6";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

const SpecificationEditor = ({ specifications, onSpecificationsChange }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSpecName, setCurrentSpecName] = useState('');
    const [newSpecName, setNewSpecName] = useState('');
    const [newSpecValue, setNewSpecValue] = useState('');

    const handleDialogClose = () => {
        setOpenDialog(false);
        setIsEditing(false);
        setNewSpecName('');
        setNewSpecValue('');
    };

    const handleAddSpecification = () => {
        setIsEditing(false);
        setOpenDialog(true);
    };

    const handleEditSpecification = (name, value) => {
        setCurrentSpecName(name);
        setNewSpecName(name);
        setNewSpecValue(value);
        setIsEditing(true);
        setOpenDialog(true);
    };

    const handleSaveSpecification = () => {
        const updatedSpecifications = { ...specifications };

        if (isEditing && currentSpecName !== newSpecName) {
            delete updatedSpecifications[currentSpecName];
        }

        updatedSpecifications[newSpecName] = newSpecValue;
        onSpecificationsChange(updatedSpecifications);
        handleDialogClose();
    };

    const handleDeleteSpecification = (name) => {
        const updatedSpecifications = { ...specifications };
        delete updatedSpecifications[name];
        onSpecificationsChange(updatedSpecifications);
    };

    return (
        <div className='col-md-12 col_ specifications-container'>
            <h4>Specifications</h4>
            <table className="specification-table">
                <tbody>
                    {Object.entries(specifications).map(([key, value], index) => (
                        <tr key={index}>
                            <th>{key}</th>
                            <td>{value}</td>
                            <td>
                                <button
                                    type="button"
                                    className="edit-specification-btn"
                                    onClick={() => handleEditSpecification(key, value)}
                                >
                                    <CiEdit />
                                </button>
                                <button
                                    type="button"
                                    className="delete-specification-btn ml-3"
                                    onClick={() => handleDeleteSpecification(key)}
                                >
                                    <FaDeleteLeft />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button type="button" className="add-specification-btn" onClick={handleAddSpecification}>
                Add Specification
            </button>

            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{isEditing ? 'Edit Specification' : 'Add Specification'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Specification Name"
                        fullWidth
                        variant="outlined"
                        value={newSpecName}
                        onChange={(e) => setNewSpecName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Specification Value"
                        fullWidth
                        variant="outlined"
                        value={newSpecValue}
                        onChange={(e) => setNewSpecValue(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveSpecification} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SpecificationEditor;
