import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';

import { FaTwitter } from "react-icons/fa";

import { FaInstagram } from "react-icons/fa";
import { postData } from "../../utils/api";

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
  });

  const history = useNavigate();
  const context = useContext(MyContext);

  useEffect(() => {
    context.setIsHeaderFooterShow(false);
  }, []);

  const onChangeInput = (e) => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value,
    }));
    return false;
  };

  const register = (e) => {
    console.log(formFields);
    e.preventDefault();
    try {
      if (formFields.name === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "name can not be blank!",
        });
        return false;
      }

      if (formFields.email === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "email can not be blank!",
        });
        return false;
      }

      if (formFields.phone === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "phone can not be blank!",
        });
        return false;
      }

      if (formFields.password === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "password can not be blank!",
        });
        return false;
      }

      setIsLoading(true);

      postData(`/api/user/signup`, formFields).then((res) => {
        if (res.status !== false) {
          context.setAlertBox({
            open: true,
            error: false,
            msg: "Register Successfully!",
          });

          setTimeout(() => {
            // history("/signIn");
            window.location.href="/signIn"
          }, 2000);
        } else {
          setIsLoading(false);

          context.setAlertBox({
            open: true,
            error: true,
            msg: res.msg,
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const styles = {
    button: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#4285F4",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      padding: "10px 20px",
      cursor: "pointer",
    },
    icon: {
      width: "20px",
      height: "20px",
      marginRight: "10px",
    },
    text: {
      fontSize: "14px",
      fontWeight: "bold",
    },
  };

  return (
    <section className="section signInPage signUpPage">
      <div className="shape-bottom">
        <svg
          fill="#fff"
          id="Layer_1"
          x="0px"
          y="0px"
          viewBox="0 0 1921 819.8"
          style={{ enableBackground: "new 0 0 1921 819.8" }}
        >
          <path
            className="st0"
            d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"
          ></path>
        </svg>
      </div>

      <div className="container">
        <div className="box card p-3 shadow border-0">
          {/* <div className="text-center">
            <img src="https://nhaccutiendat.vn/upload/images/logo/logo-tiendat.png" style={{marginLeft:'-216%', width:'70%'}} />
         
          </div> */}

          <h2 className="text-center">Sign Up</h2>

          <form style={{ marginTop: "95px" }} onSubmit={register}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <TextField
                    label="Name"
                    type="text"
                    variant="standard"
                    className="w-100"
                    name="name"
                    onChange={onChangeInput}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <TextField
                    label="Phone No."
                    type="text"
                    variant="standard"
                    className="w-100"
                    name="phone"
                    onChange={onChangeInput}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <TextField
                id="standard-basic"
                label="Email"
                type="email"
                variant="standard"
                className="w-100"
                name="email"
                onChange={onChangeInput}
              />
            </div>
            <div className="form-group">
              <TextField
                id="standard-basic"
                label="Password"
                type="password"
                variant="standard"
                className="w-100"
                name="password"
                onChange={onChangeInput}
              />
            </div>
            <a className="border-effect cursor">Forgot Password?</a>

            <div className="d-flex align-items-center mt-3 mb-3">
              <div className="row w-100">
                <div className="col-md-6">
                  <Button
                    type="submit"
                    className="btn-blue btn-lg w-100 btn-big "
                  >
                    {isLoading === true ? <CircularProgress /> : "Sign Up "}
                  </Button>
                </div>

                <div className="col-md-6">
                  <Link to={"/"} className="d-block w-100">
                    <Button
                      onClick={() => context.setIsHeaderFooterShow(true)}
                      className="btn-lg btn-big w-100 ml-3"
                      variant="outlined"
                    >
                      CanCal
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <p>
              Have Account?{" "}
              <Link to={"/signIn"} className="border-effect">
                Sign In
              </Link>
            </p>
            <h6 className=" text-center font-weight-bold">
              Or continue with social account
            </h6>

            <ul
              className="mb-2"
              style={{ marginTop: "110px", marginLeft: "95px" }}
            >
              <button className="google-sign-in-button ">
                <img
                  src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                  alt="Google icon"
                  className="google-icon"
                />
                <span className="google-text">Sign in with Google</span>
              </button>
            </ul>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
