import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FrontDeskLogin.css";


const API_URL =
    "http://127.0.0.1:8000/accounts/frontdesk/api/login/";


const FrontDeskLogin = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (!username || !password) {

            setError(
                "Please enter username and password."
            );

            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        username,
                        password,
                    }),
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                setError(
                    data.message ||
                    "Invalid username or password."
                );

                return;
            }


            // --------------------------------
            // Store logged-in employee
            // --------------------------------

            localStorage.setItem(
                "frontdesk_employee",
                JSON.stringify(
                    data.employee
                )
            );


            // --------------------------------
            // Store assigned hotel
            // --------------------------------

            localStorage.setItem(
                "frontdesk_hotel",
                JSON.stringify(
                    data.hotel
                )
            );


            // --------------------------------
            // Login success
            // --------------------------------

            navigate("/frontdesk");

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            setError(
                "Unable to connect to the server."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="frontdesk-login-page">

            <div className="frontdesk-login-background"></div>


            <div className="frontdesk-login-card">


                {/* Logo */}

                <div className="frontdesk-login-logo">

                    <div className="login-logo-icon">

                        <i className="bi bi-building"></i>

                    </div>

                </div>


                {/* Heading */}

                <div className="frontdesk-login-header">

                    <h1>
                        Front Desk
                    </h1>

                    <p>
                        Sign in to manage your hotel
                    </p>

                </div>


                {/* Error */}

                {error && (

                    <div className="login-error">

                        <i className="bi bi-exclamation-circle"></i>

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* Form */}

                <form
                    onSubmit={handleSubmit}
                    className="frontdesk-login-form"
                >


                    {/* Username */}

                    <div className="login-field">

                        <label>
                            Username
                        </label>

                        <div className="login-input-wrapper">

                            <i className="bi bi-person"></i>

                            <input
                                type="text"
                                value={username}
                                onChange={(e) =>
                                    setUsername(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter username"
                                autoComplete="username"
                            />

                        </div>

                    </div>


                    {/* Password */}

                    <div className="login-field">

                        <label>
                            Password
                        </label>

                        <div className="login-input-wrapper">

                            <i className="bi bi-lock"></i>

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter password"
                                autoComplete="current-password"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >

                                <i
                                    className={
                                        showPassword
                                            ? "bi bi-eye-slash"
                                            : "bi bi-eye"
                                    }
                                ></i>

                            </button>

                        </div>

                    </div>


                    {/* Forgot */}

                    <div className="login-options">

                        <button
                            type="button"
                            className="forgot-password"
                        >
                            Forgot Password?
                        </button>

                    </div>


                    {/* Login */}

                    <button
                        type="submit"
                        className="frontdesk-login-button"
                        disabled={loading}
                    >

                        {loading ? (

                            <>
                                <span className="login-spinner"></span>
                                Signing in...
                            </>

                        ) : (

                            <>
                                <i className="bi bi-box-arrow-in-right"></i>
                                Sign In
                            </>

                        )}

                    </button>

                </form>


                <div className="login-footer">

                    <i className="bi bi-shield-check"></i>

                    Secure hotel management system

                </div>

            </div>

        </div>

    );

};


export default FrontDeskLogin;