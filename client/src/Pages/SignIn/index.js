import React, { useContext, useEffect } from "react";
import { MyContext } from "../../App";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";

import { FaTwitter } from "react-icons/fa";

import { FaInstagram } from "react-icons/fa";

const SignIn = () => {
  const context = useContext(MyContext);

  useEffect(() => {
    context.setIsHeaderFooterShow(false);
  }, []);

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
    <section className="section signInPage">
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

          <h2 className="text-center">Sign In</h2>
          <form style={{ marginTop: "105px" }} className="">
            <div className="form-group">
              <TextField
                id="standard-basic"
                label="Email"
                type="email"
                variant="standard"
                required
                className="w-100"
              />
            </div>
            <div className="form-group">
              <TextField
                id="standard-basic"
                label="Password"
                type="password"
                variant="standard"
                required
                className="w-100"
              />
            </div>
            <a className="border-effect cursor">Forgot Password?</a>

            <div className="d-flex align-items-center mt-3 mb-3">
              <Button className="btn-blue btn-lg col btn-big ">Sign In</Button>

              <Link to={'/'}>
                <Button 
                  onClick={()=> context.setIsHeaderFooterShow(true)}
                  className="btn-lg btn-big col ml-3" variant="outlined">
                  CanCal
                </Button>
              </Link>
            </div>

            <p>
              Not Register?{" "}
              <Link to={"/signUp"} className="border-effect">
                Sign Up
              </Link>
            </p>
            <h6 className="mt-4 text-center font-weight-bold">
              Or continue with social account
            </h6>

            <ul
              className="mb-2"
              style={{ marginTop: "110px", marginLeft: "55px" }}
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

export default SignIn;
