import * as React from 'react'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import GiveLightLogoComponent from '../commonComponents/GiveLightLogoComponent'
import { loginUser } from '../../api/api'
import FontAwesome from 'react-fontawesome';
var ReactDOM = require('react-dom');

import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Link
} from 'react-router-dom'

require('./LoginComponent.css')
require('../sharedCss.css')
require('../facebook/FacebookButton.css')


class LoginComponent extends React.Component {
    state = {
        email: '',
        passphrase: '',
        facebookLogin: false,
        goToProfile: false
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
                this.setState({
                    user,
                    goToProfile: true
                })
            }
            else {
                console.log('Error in login', error)
                this.handleLoginError();
            }
        }).catch( (error) => {
            console.log('Error in login', error)
            this.handleLoginError();
        })
    }

    handleLoginError = () => {
        const errorText = <span>Invalid Username/Password, please try again</span>
        ReactDOM.render(errorText, document.getElementById('login-error'));
        document.getElementById('login-error').style.display = 'block';
    }

    goBacktoGiveLightMain = (event) => {
        window.location = 'http://www.givelight.org'
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
            <Paper zDepth={1} className="paper-style">
                <div className="login-box p-l-110 p-r-110 p-t-22 p-b-33">
                    <form className="flex-sb flex-w">
                        <span className="login-form-title p-b-23">Sign in with</span>
                        <div className="w-full div-separator div-block">
                            <div className="div-center">
                                <a href="#" onClick={this.loginWithFacebook} className="fa-btn-face m-b-20">
                                    <FontAwesome name="facebook-official"/>Facebook
                                </a>
                            </div>
                        </div>
                        <div id="login-error" className="login-error"/>
                        <div className="p-t-31 p-b-9">
                            <span className="login-label">Username</span>
                        </div>
                        <div className="wrap-input">
                            <input className="login-input" type="text" name="email" value={this.state.email} onChange={e => this.handleField(e, 'email')}/>
                        </div>

                        <div className="p-t-13 p-b-9">
                            <span className="login-label">Password</span>
                            {/* <a href="#" className="txt2 bo1 m-l-5">
                                Forgot?
                            </a> */}
                        </div>
                        <div className="wrap-input">
                            <input className="login-input" type="password" name="passphrase" onChange={e => this.handleField(e, 'passphrase')}/>
                        </div>

                        <div className="login-sign-in-btn-container m-t-17">
                            <button onClick={e => this.handleSubmit(e)} className="sign-in-btn">Sign In</button>
                        </div>

                        <div className="w-full text-center p-t-55">
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
