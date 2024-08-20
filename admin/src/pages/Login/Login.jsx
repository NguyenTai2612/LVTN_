import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from '../../App';
import Logo from '../../../src/assets/logo.png';
import { FaUser, FaLock, FaHome } from 'react-icons/fa';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { postData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';

const Login = () => {

    const context = useContext(MyContext);
    const history = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [formFields, setFormFields] = useState({
        email: "",
        password: "",
        isAdmin: true
    })

    useEffect(() => {
        context.setIsHeaderFooterShow(true);
    }, []);

    const onChangeInput = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value
        }))
        return false

    }

    const signIn = (e) => {
        e.preventDefault()

        if (formFields.email === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "email can not be blank!"
            })
            return false

        }

        if (formFields.password === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "password can not be blank!"
            })
            return false

        }
        setIsLoading(true)

        postData(`/api/user/signin`, formFields).then((res) => {
            try {

                if (res.status !== false) {
                    localStorage.setItem("token", res.token)

                    const user = {
                        name: res.user?.name,
                        email: res.user?.email,
                        userId: res.user?.id,
                    }

                    localStorage.setItem("user", JSON.stringify(user))


                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "User Login Successfully"
                    })


                    setTimeout(() => {

                        // history("/") 
                        window.location.href = "/"
                    }, 2000)
                } else {
                    setIsLoading(false)

                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: res.msg
                    })
                }


            } catch (error) {
                console.log(error)
            }
        })

    }

    return (
        <div className='main1'>
            <div className='space1'></div>
            <div className="container1">
                <div className="left-panel">
                    <div className='space2'></div>
                    <h1>WELCOME BACK! <br /><span>LOGIN TO YOUR ACCOUNT</span></h1>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>

                </div>
                <div className="right-panel">
                    <h2>Login to your account</h2>
                    <form onSubmit={signIn}>
                        <div className="input-group">
                            <FaUser className="input-icon" />
                            <input
                                type="text" name="email" onChange={onChangeInput}
                                placeholder="enter your email" required
                            />
                        </div>
                        <div className="input-group">
                            <FaLock className="input-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password" onChange={onChangeInput}
                                placeholder="enter your password"
                                required
                            />
                            <span onClick={togglePasswordVisibility} className="toggle-password">
                                {showPassword ? "🙈" : "👁️"}
                            </span>
                        </div>
                        <p className="my-5 text-white">
                            Don't have account ? <Link to={"/signUp"} className="text-green-500 hover:text-green-800 hover:underline">Sign up</Link>
                        </p>
                        <button type="submit" className="sign-up-button">
                            {
                                isLoading === true ? <CircularProgress /> : 'Sign Up '
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;
