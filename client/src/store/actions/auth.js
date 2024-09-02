import actionTypes from './actionTypes';
import { apiRegister, apiLogin } from '../../services/auth';

export const register = (payload) => async (dispatch) => {
    try {
        const response = await apiRegister(payload);
        if (response?.data.err === 0) {
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            dispatch({
                type: actionTypes.REGISTER_SUCCESS,
                data: { token, user }
            });
        } else {
            dispatch({
                type: actionTypes.REGISTER_FAIL,
                data: response.data.msg
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.REGISTER_FAIL,
            data: 'Đã xảy ra lỗi trong quá trình đăng ký.'
        });
    }
};

export const login = (payload) => async (dispatch) => {
    try {
        const response = await apiLogin(payload);
        if (response?.data.err === 0) {
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                data: { token, user }
            });
        } else {
            dispatch({
                type: actionTypes.LOGIN_FAIL,
                data: response.data.msg
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.LOGIN_FAIL,
            data: 'Đã xảy ra lỗi trong quá trình đăng nhập.'
        });
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return {
        type: actionTypes.LOGOUT
    };
};
