import actionTypes from "../actions/actionTypes";

const initState = {
    isLoggedIn: false,
    token: null,
    user: null,
    msg: '',
    update: false
};

// Khi khôi phục từ localStorage, đảm bảo rằng giá trị JSON được phân tích cú pháp
const authReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.REGISTER_SUCCESS:
        case actionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                token: action.data.token,
                user: action.data.user,
                msg: ''
            };
        case actionTypes.REGISTER_FAIL:
        case actionTypes.LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                msg: action.data,
                token: null,
                user: null,
                update: !state.update,
            };
        case actionTypes.LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                token: null,
                user: null,
                msg: ''
            };
        default:
            return state;
    }
};

export default authReducer;
