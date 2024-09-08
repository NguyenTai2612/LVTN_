// UserList.js
import React, { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import { FiEdit3 } from "react-icons/fi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { Link } from 'react-router-dom';
import { apiDeleteUser, apiGetAllUsers } from '../../services/user';
import TooltipBox from '@mui/material/Tooltip';
import UserModal from '../User/editUser'; // Import UserModal component

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const selectAll = (e) => {
        setIsAllChecked(e.target.checked);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await apiGetAllUsers();
                setUsers(response.data);  // Lưu danh sách người dùng
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    // Hàm xóa người dùng
    const deleteUser = async (id) => {
        try {
            await apiDeleteUser(id);
            setUsers(users.filter((user) => user.id !== id));  // Cập nhật danh sách sau khi xóa
        } catch (error) {
            console.error(`Error deleting user with id ${id}:`, error);
        }
    };

    const handleOpenDialog = (userId) => {
        setSelectedUserId(userId);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedUserId(null);
    };

    const handleUserUpdated = () => {
        // Refresh user list
        const fetchUsers = async () => {
            try {
                const response = await apiGetAllUsers();
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    };

    return (
        <>
            <div className="card shadow my-4 border-0 flex-center p-3" style={{ backgroundColor: '#343A40' }}>
                <div className="flex items-center justify-between">
                    <h1 className="font-weight-bold text-white">User List</h1>
                    <div className="ml-auto flex align-items-center gap-3">
                        <Breadcrumbs aria-label="breadcrumb">
                            <StyledBreadcrumb
                                component={Link}
                                href="#"
                                label="Dashboard"
                                to="/"
                                icon={<HomeIcon fontSize="small" />}
                            />
                            <StyledBreadcrumb label="Category" />
                        </Breadcrumbs>
                    </div>
                </div>
            </div>
            <div className="card shadow my-4 border-0">
                <div className="flex items-center mb-4 justify-between pt-3 px-4"></div>
                <div className="table-responsive mb-2">
                    <table className="table w-[100%] table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th><Checkbox {...label} size="small" onChange={selectAll} /></th>
                                <th>NAME</th>
                                <th>PHONE</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.length > 0 && users.map((item, index) => (
                                <tr key={item.id || index}>
                                    <td><Checkbox {...label} size="small" checked={isAllChecked} /><span>#{index + 1}</span></td>

                                    <td>{item.name}</td>
                                    <td>{item.phone}</td>
                                    <td>
                                        <div className="actions flex items-center gap-2">
                                            <TooltipBox title="Edit" placement="top">
                                                <Button
                                                    onClick={() => handleOpenDialog(item.id)}
                                                    className="edit-button flex items-center justify-center w-[30px] h-[30px] rounded-md duration-300"
                                                >
                                                    <FiEdit3 />
                                                </Button>
                                            </TooltipBox>

                                            <TooltipBox title="Delete" placement="top">
                                                <Button
                                                    className="delete-button flex items-center justify-center w-[30px] h-[30px] rounded-md duration-300"
                                                    onClick={() => deleteUser(item.id)}
                                                >
                                                    <MdOutlineDeleteOutline />
                                                </Button>
                                            </TooltipBox>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="table-footer flex items-center justify-between py-2 px-3 mb-2">
                    {/* {catData.totalPages > 1 &&
                        <div className="d-flex tableFooter flex items-center justify-end py-2 px-3 mb-2 ml-auto">
                            <Pagination
                                count={catData.totalPages}
                                color="primary"
                                className="pagination"
                                page={currentPage}
                                onChange={handlePageChange}
                                showFirstButton
                                showLastButton
                            />
                        </div>
                    } */}
                </div>
            </div>

            {/* User Modal */}
            <UserModal
                open={isDialogOpen}
                onClose={handleDialogClose}
                userId={selectedUserId}
                onUserUpdated={handleUserUpdated}
            />
        </>
    );
};

export default UserList;
// ok