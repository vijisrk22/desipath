import React from 'react';
import '../../css/signup.css'; // Import the CSS file

const Signup = () => {
    return (
        <div className="container">
            <div className="main-content">
                <div className="title-container">
                    <div className="title">Desipath</div>
                </div>
                <div className="description-container">
                    <div className="description-title">Easy way to interact with Desi !</div>
                    <div className="description-text">
                        Find local services, Room mates, Buy & Sell Home, Rental home, Find Travel companion for your parents or Be a travel companion and get Gift cards, Find Local doctors/ Attorneys, Find IT trainings, Browse local events etc..
                    </div>
                </div>
            </div>
            <div className="signup-container">
                <div className="signup-header">
                    <div className="signup-title">Sign Up</div>
                    <div className="account-link">
                        <span>Already have an account?</span>
                        <span>Sign in</span>
                    </div>
                    <div className="continue-google-btn">
                        <div className="continue-google-btn-inner"></div>
                        <div className="google-signup-btn">
                            <div className="google-icon">
                                <div></div>
                                <div></div>
                                <div className="google-g"></div>
                                <div className="google-r"></div>
                                <div className="google-y"></div>
                                <div className="google-b"></div>
                                <div className="google-g2"></div>
                            </div>
                            <div>Continue with Google</div>
                        </div>
                    </div>
                    <div className="account-link">Or use your email address</div>
                </div>
                <div className="form-container">
                    <div className="input-group">
                        <div className="input-field">
                            <div className="input-label">Your First Name</div>
                        </div>
                        <div className="input-field">
                            <div className="input-label">Your Last Name</div>
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="input-field">
                            <div className="input-label">Your Email</div>
                        </div>
                        <div className="input-field">
                            <div className="input-label">Your Mobile Number</div>
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="input-field">
                            <div className="input-label">Password</div>
                        </div>
                        <div className="input-field">
                            <div className="input-label">Confirm Password</div>
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="terms">
                            <div></div>
                        </div>
                        <div className="terms-text">
                            I accept the <span>Terms of Service</span> & <span>Privacy Policy</span>
                        </div>
                    </div>
                    <div className="signup-button">
                        <div className="signup-button-text">Sign Up</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
