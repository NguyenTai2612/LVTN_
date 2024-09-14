// import React, { useState, useEffect, useContext } from 'react';
// import { MyContext } from '../../App';
// import Logo from '../../../src/assets/logo2.png';
// import { FaUser, FaLock, FaHome } from 'react-icons/fa';
// import './Login.css';
// import { Link } from 'react-router-dom';
// import CircularProgress from '@mui/material/CircularProgress';
// import Button from "../../components/Button.jsx";
// import InputForm from "../../components/InputForm.jsx";
// import { useLocation, useNavigate } from "react-router-dom";
// import * as actions from "../../store/actions";
// import { useDispatch, useSelector } from "react-redux";
// import Swal from 'sweetalert2'

// const Login = () => {
//     const context = useContext(MyContext);


//     useEffect(() => {
//         context.setIsHeaderFooterShow(false); 
//         return () => {
//             context.setIsHeaderFooterShow(true); 
//         };
//     }, [context]);

  

//     const location = useLocation();
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { isLoggedIn, msg, update } = useSelector((state) => state.auth);
//     const [isRegister, setIsRegister] = useState(location.state?.flag);
//     const [invalidFields, setInvalidFields] = useState([]);
//     const [payload, setPayload] = useState({
//         phone: "",
//         password: "",
//         name: "",
//     });
    
//     useEffect(() => {
//         setIsRegister(location.state?.flag);
//     }, [location.state?.flag]);

//     useEffect(() => {
//         isLoggedIn && navigate("/");
//     }, [isLoggedIn]);

//     useEffect(() => {
//         msg && Swal.fire('Oops !', msg, 'error')
//     }, [msg, update])
 
//     const handleSubmit = async () => {
//         let finalPayload = isRegister
//             ? payload
//             : {
//                 phone: payload.phone,
//                 password: payload.password,
//             };
//         let invalids = validate(finalPayload);
//         if (invalids === 0)
//             isRegister
//                 ? dispatch(actions.register(payload))
//                 : dispatch(actions.login(payload));
//     };
//     const validate = (payload) => {
//         let invalids = 0;
//         let fields = Object.entries(payload);
//         fields.forEach((item) => {
//             if (item[1] === "") {
//                 setInvalidFields((prev) => [
//                     ...prev,
//                     {
//                         name: item[0],
//                         message: "Bạn không được bỏ trống trường này.",
//                     },
//                 ]);
//                 invalids++;
//             }
//         });
//         fields.forEach((item) => {
//             switch (item[0]) {
//                 case "password":
//                     if (item[1].length < 6) {
//                         setInvalidFields((prev) => [
//                             ...prev,
//                             {
//                                 name: item[0],
//                                 message: "Mật khẩu phải có tối thiểu 6 kí tự.",
//                             },
//                         ]);
//                         invalids++;
//                     }
//                     break;
//                 case "phone":
//                     if (!+item[1]) {
//                         setInvalidFields((prev) => [
//                             ...prev,
//                             {
//                                 name: item[0],
//                                 message: "Số điện thoại không hợp lệ.",
//                             },
//                         ]);
//                         invalids++;
//                     }
//                     break;

//                 default:
//                     break;
//             }
//         });
//         return invalids;
//     };
//     return (
//         <div className='main1'>
//             <div className='space1'></div>
//             <div className="container1">
//                 <div className="left-panel">
//                     <div className='space2'></div>
//                     <h1>WELCOME BACK! <br /><span>LOGIN TO YOUR ACCOUNT</span></h1>
//                     <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>

//                 </div>
//                 <div className="right-panel">
//                     <div className="login-container">
//                         <h3 className="login-title">
//                             {isRegister ? "Đăng kí tài khoản" : "Đăng nhập"}
//                         </h3>
//                         <div className="login-form">
//                             {isRegister && (
//                                 <InputForm
//                                     setInvalidFields={setInvalidFields}
//                                     invalidFields={invalidFields}
//                                     label={"HỌ TÊN"}
//                                     value={payload.name}
//                                     setValue={setPayload}
//                                     keyPayload={"name"}
//                                 />
//                             )}
//                             <InputForm
//                                 setInvalidFields={setInvalidFields}
//                                 invalidFields={invalidFields}
//                                 label={"SỐ ĐIỆN THOẠI"}
//                                 value={payload.phone}
//                                 setValue={setPayload}
//                                 keyPayload={"phone"}
//                             />
//                             <InputForm
//                                 setInvalidFields={setInvalidFields}
//                                 invalidFields={invalidFields}
//                                 label={"MẬT KHÂU"}
//                                 value={payload.password}
//                                 setValue={setPayload}
//                                 keyPayload={"password"}
//                                 type='password'
//                             />
//                             <Button
//                                 text={isRegister ? "Đăng kí" : "Đăng nhập"}
//                                 bgColor="bg-secondary1"
//                                 textColor="text-white"
//                                 fullWidth
//                                 onClick={handleSubmit}
//                             />
//                         </div>
//                         <div className="login-footer">
//                             {isRegister ? (
//                                 <small>
//                                     Bạn đã có tài khoản?{" "}
//                                     <span
//                                         onClick={() => {
//                                             setIsRegister(false);
//                                             setPayload({
//                                                 phone: "",
//                                                 password: "",
//                                                 name: "",
//                                             });
//                                         }}
//                                         className="login-link"
//                                     >
//                                         Đăng nhập ngay
//                                     </span>
//                                 </small>
//                             ) : (
//                                 <>
//                                     <small className="login-link">Bạn quên mật khẩu?</small> &nbsp; &nbsp;&nbsp;&nbsp;
//                                     <small
//                                         onClick={() => {
//                                             setIsRegister(true);
//                                             setPayload({
//                                                 phone: "",
//                                                 password: "",
//                                                 name: "",
//                                             });
//                                         }}
//                                         className="login-link"
//                                     >
//                                         Tạo tài khoản mới
//                                     </small>
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Login;
