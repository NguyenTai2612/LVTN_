import React, { useContext, useEffect, useState } from 'react';
import { MyContext } from '../../App';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaHome } from 'react-icons/fa';
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import { postData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';

const SignUp = () => {
  const context = useContext(MyContext);
  const history = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isAdmin: true
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    context.setIsHeaderFooterShow(true);
  }, [context]);

  const onChangeInput = (e) => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value
    }))
    return false

  }

  const signUp = (e) => {
    e.preventDefault()
    try {
      if (formFields.name === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "name can not be blank!"
        })
        return false

      }

      if (formFields.email === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "email can not be blank!"
        })
        return false

      }

      if (formFields.phone === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "phone can not be blank!"
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

      if (formFields.confirmPassword !== formFields.password) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "password not match!"
        })
        return false
      }
      setIsLoading(true)

      postData(`/api/user/signup`, formFields).then((res) => {


        if (res.status !== false) {
          context.setAlertBox({
            open: true,
            error: false,
            msg: "Register Successfully!"
          })

          setTimeout(() => {
            history("/login")
          }, 2000)
        } else {
          setIsLoading(false)

          context.setAlertBox({

            open: true,
            error: true,
            msg: res.msg
          })
        }

      })
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div className="main1">
      <div className="container1">
        <div className="left-panel">
          <h1>BEST UX/UI FASHION <br /><span>ECOMMERCE DASHBOARD</span> & <br />ADMIN PANEL</h1>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>
          {/* <a href="#" className="button1"><FaHome /> Sign In</a> */}
        </div>
        <div className="right-panel">
          <h2>Register a new account</h2>
          <form onSubmit={signUp}>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input type="text" name="name" onChange={onChangeInput} placeholder="enter your name" required />
            </div>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input type="email" name="email" onChange={onChangeInput} placeholder="enter your email" required />
            </div>
            <div className="input-group">
              <FaPhone className="input-icon" />
              <input type="text" name="phone" onChange={onChangeInput} placeholder="enter your Phone" required />
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
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword" onChange={onChangeInput}
                placeholder="confirm your password"
                required
              />
              <span onClick={toggleConfirmPasswordVisibility} className="toggle-password">
                {showConfirmPassword ? "🙈" : "👁️"}
              </span>
            </div>
            <p className="my-5 text-white">
              Already have account ?{" "}
              <Link
                to={"/login"}
                className="text-green-500 hover:text-green-800 hover:underline"
              >
                Login
              </Link>
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
  );
};

export default SignUp;
