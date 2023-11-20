import React, { useState } from 'react';
import axios from 'axios';
// import './Login.css';
import email from './email.png';
import password from './password.png';

// import 'bootstrap/dist/css/bootstrap.min.css';
function Login({ handleLogin, formData, setFormData, errors }) {
    [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    var [errors, setErrors] = useState({});

    const clearErrors = (field) => {
        setErrors({ ...errors, [field]: '' });
    };
    handleLogin = async (event) => {
        event.preventDefault();
        if (formData.email && formData.password) {
            try {
                const response = await axios.post("http://localhost:3001/login", formData);

                if (response.status === 200) {
                    // Login successful, you can perform further actions here
                    // For example, store user information in state or localStorage
                    console.log("Login successfully");
                    alert("Login Successfully");
                    // Clear login form
                    setFormData({
                        email: '',
                        password: ''
                    });
                    var loginCard = document.getElementById('loginCard');
                    loginCard.style.display = "none";
                    var userDetail = document.getElementById('userDetail');
                    userDetail.style.display = "inline";
                } else {
                    // Handle login failure (e.g., show an error message)
                    console.log("Login failed");
                }
            } catch (error) {
                console.error("Error during login:", error);
            }
        } else {
            // Handle empty email or password
            console.log("Please provide email and password");
        }
    };
    return (<>
        <div className='container'>
            <div style={{ display: "none" }} id='userDetail'>
                Hello!! {formData.fullName}
            </div>
            <div className='header'>
                <div className='text'>
                    Login
                </div>
                <div className='underline'></div>
            </div>
            <form onSubmit={handleLogin} className="text-info">

                <div className='inputs'>

                    <div className='input'>
                        <img src={email} alt='' />
                        <input type='email' 
                         id="loginEmail"
                         name="loginEmail"
                         className="form-control"
                         placeholder="Email"
                         value={formData.email}
                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                         required
                        />
                        {errors.email && (
                                <p className="text-danger">{errors.email}</p>
                            )}
                    </div>
                    <div className='input'>
                        <img src={password} alt='' />
                        <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-control"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Password"
                                required
                            />
                            {errors.password && (
                                <p className="text-danger">{errors.password}</p>
                            )}
                    </div>
                </div>
                <div className="forgot-password">Lost password? <span>Click here!</span></div>
                <div className="submit-container">
                    <button type='submit' className='submit'>Login</button>
                    
                </div>
            </form>
        </div>
        
    </>
    );
}

export default Login;
