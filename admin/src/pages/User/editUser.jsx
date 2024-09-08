import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { apiUpdateUser, apiGetUserById, apiVerifyPassword } from '../../services/user';

const UserModal = ({ open, onClose, userId, onUserUpdated }) => {
    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (userId) {
            const fetchUserDetails = async () => {
                setIsLoading(true);
                try {
                    const response = await apiGetUserById(userId);
                    setUserName(response.data.name);
                    setUserPhone(response.data.phone);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
                setIsLoading(false);
            };
            fetchUserDetails();
        }
    }, [userId]);

    const handleSaveUser = async () => {
        if (userId) {
            if (newPassword !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            if (newPassword) {
                try {
                    const isPasswordValid = await apiVerifyPassword(userId, currentPassword);
                    if (!isPasswordValid) {
                        setError('Current password is incorrect');
                        return;
                    }
                    await apiUpdateUser(userId, { name: userName, phone: userPhone, password: newPassword });
                } catch (error) {
                    console.error('Error updating user:', error);
                }
            } else {
                try {
                    await apiUpdateUser(userId, { name: userName, phone: userPhone });
                } catch (error) {
                    console.error('Error updating user:', error);
                }
            }
            onUserUpdated(); // Call parent callback to refresh user list
            onClose(); // Close modal
        }
    };
    
    

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    disabled={isLoading}
                />
                <TextField
                    margin="dense"
                    label="Phone"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    disabled={isLoading}
                />
                <TextField
                    margin="dense"
                    label="Current Password"
                    type="password"
                    fullWidth
                    variant="standard"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={isLoading}
                />
                <TextField
                    margin="dense"
                    label="New Password"
                    type="password"
                    fullWidth
                    variant="standard"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                />
                <TextField
                    margin="dense"
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    variant="standard"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                />
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
                <Button onClick={handleSaveUser} disabled={isLoading}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserModal;
//edittttttttt