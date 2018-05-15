import * as React from 'react'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import GiveLightLogoComponent from '../commonComponents/GiveLightLogoComponent'
import { loginUser } from '../../api/api'
import ClientAuth from '../../api/ClientAuth'
import FontAwesome from 'react-fontawesome';
import { render as _render } from "react-dom";

import {
    BrowserRouter as Router,
    Redirect, 
    Route,
    Link
} from 'react-router-dom'

import "./LoginComponent.css";
import "../sharedCss.css";
import "../facebook/FacebookButton.css";

class LoginComponent extends React.Component {
    state = {
        email: '',
        passphrase: '',
        facebookLogin: false,
        goToProfile: false,
        errors: false
    }

    handleField = (event, fieldName) => {
        event.preventDefault()
        this.setState({
            [fieldName]: event.target.value
        })
    }

    responseFacebook = (response) => {
        this.setState({
            facebookLogin: true,
            name: response.name,
            email: response.email
        })
        this.handleLoggingUser()
    }

    loginWithFacebook = (e) => {
        e.preventDefault()
        window.location = '/api/auth/facebook'
    }
    handleSubmit = (event) => {
        event.preventDefault()
        this.handleLoggingUser()
    }

    handleLoggingUser = () => {
        loginUser(this.state).then(user => {
            if (user._id) {
                var expiresAt = new Date();
                expiresAt.setMinutes(expiresAt.getMinutes() + 30);
                ClientAuth.storeAuthState(user._id, user.isAdmin, expiresAt.getTime());
                this.setState({
                    user,
                    goToProfile: true
                })
            }
            else {
                console.log('Error in login', error)
                this.setLoginError();
            }
        }).catch( (error) => {
            console.log('Error in login', error)
            this.setLoginError();
        })
    }

    setLoginError = () => {
        this.setState({
            error: true
        });
    }

    renderError = () => {
        if (this.state.error) {
            return <div className="login-error">Invalid Username/Password, please try again</div>;
        }
    }

    render() {
        if (this.state.goToProfile && this.state.user) {
            let userData = this.state.user
            let profileComponentDataAndNavBarFunctions = {
                pathname: `/profile/${userData._id}`,
                state: {
                    logoutNavBar: this.props.location.state,
                    userData
                }
            }
            return (
                <Redirect to={profileComponentDataAndNavBarFunctions} />
            )
        }
        return (
            <Paper>
                <div className="login-panel-box p-l-110 p-r-110 p-t-22 p-b-33">
                    <form className="flex-sb flex-w">
                        <span className="login-form-title p-b-23">Sign in with</span>
                        <div className="w-full div-separator div-center">
                            <a href="#" onClick={this.loginWithFacebook} className="fa-btn-face m-b-20">
                                <FontAwesome name="facebook-official"/>Facebook
                            </a>
                        </div>
                        {this.renderError()}
                        <div className="p-t-31 p-b-9">
                            <span className="login-label">Username</span>
                        </div>
                        <input className="txt-input" type="text" name="email" value={this.state.email} onChange={e => this.handleField(e, 'email')}/>
                        
                        <div className="p-t-13 p-b-9">
                            <span className="login-label">Password</span>
                        </div>
                        <input className="txt-input" type="password" name="passphrase" onChange={e => this.handleField(e, 'passphrase')}/>
                       
                        <div className="btn-container m-t-17 div-center">
                            <button onClick={e => this.handleSubmit(e)} className="btn login-btn">Sign In</button>
                        </div>

                        <div className="w-full text-center">
                            <span className="login-txt2 p-r-5">Not a member?</span>
                            <Link className="login-sign-up login-txt2 bo1" to="/signup">Sign up now</Link>
                        </div>
                    </form>
                </div>
            </Paper>
        )
    }
}

export default LoginComponent
