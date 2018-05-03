import * as React from 'react'
import  Checkbox from 'material-ui/Checkbox'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { isValidEmail } from '../../../lib/validation.js'

import GiveLightLogoComponent from '../commonComponents/GiveLightLogoComponent'
import VolunteerInterestsCheckboxesComponent from '../commonComponents/VolunteerInterestsCheckboxesComponent'
import VolunteerSkillsInputComponent from '../commonComponents/SkillsInputComponent'

import { CountryDropdown, RegionDropdown } from 'react-country-region-selector-material-ui'

import { registerUser, signupFacebook } from '../../api/api'
import { interests } from '../../models/interests'
import FontAwesome from 'react-fontawesome';
import { render as _render } from "react-dom";


require('../sharedCss.css')
require('./SignupComponent.css')
require('../facebook/FacebookButton.css')

class SignupComponent extends React.Component {
    constructor(props) {
        super(props)
        const checkInter = interests.map(interest => ({ interest: interest, checked: false }))
        
        this.state = {
            name: '',
            email: '',
            country: '',
            region: '',
            phone: '',
            interests: [],
            skills: [],
            skillsInput: '',
            passphrase: '',
            retypePassphrase: '',
            isAdmin: false,
            checkboxInterests: checkInter,
            errors: {
                name: '',
                email: '',
                passphrase: '',
                retypePassphrase: '',
                country: '',
                region: '',
            }
        }
    }
    handleField = (fieldName, event) => {
        event.preventDefault()
        this.setState({
            ...this.state,
            [fieldName]: event.target.value
        })
    }
    handleCountry = (event, index, value) => {
        this.setState({
            ...this.state,
            country: value
        })
    }
    handleRegion = (event, index, value) => {
        this.setState({
            ...this.state,
            region: value
        })
    }
    
    handleSkillsInput = (event) => {
        event.preventDefault()
        if (event.target.value == "") {
            this.setState({
                ...this.state,
                skillsInput: "",
                skills: []
            })
        }
        else {
            this.setState({
                ...this.state,
                skillsInput: event.target.value,
                skills: this.state.skillsInput.split(/[,]+/)
            })
        }
    }
    responseFacebook = (response) => {
        this.setState({
            ...this.state,
            name: response.name,
            email: response.email,
        })
    }
    signupWithFacebook = (e) => {
        e.preventDefault()
        window.location = '/api/auth/facebook'
    }
    handleCheckbox = (event, index, interest) => {
        var data = this.state.checkboxInterests
        data[index] = { interest: data[index].interest, checked: !data[index].checked }
        var volunteerInterests = []
        data.map( interestCheckbox => {
            if (interestCheckbox.checked) {
                volunteerInterests.push(interestCheckbox.interest)
            }
        })
        this.setState({
            ...this.state,
            checkboxInterests: data,
            interests: volunteerInterests
        })
    }
    validateState = () => {
        let errors = {};
        if (this.state.name.length == 0) {
            errors.name = 'Please enter your name.';
        }
        if (!isValidEmail(this.state.email)) {
            errors.email = 'Please enter a valid email.';
        }
        if (!this.state.passphrase) {
            errors.passphrase = 'Please enter a passphrase.'
        }
        if (!this.state.retypePassphrase) {
            errors.retypePassphrase = 'Please retype your passphrase.'
        }
        if (this.state.passphrase !== this.state.retypePassphrase) {
            errors.passphrase = 'Passphrases do not match.'
        }
        if (!this.state.country) {
            errors.country = 'Please select a country.'
        }
        if (!this.state.region) {
            errors.region = 'Please select a region.'
        }
        return errors
    }

    handleSubmit(e) {
        e.preventDefault()
        let errors = this.validateState()
        this.setState( {
            ...this.state,
            errors: errors
        });
        
        if (Object.keys(errors).length == 0) {
            registerUser(this.state)
        }
    }

    render () {
        return (
            <Paper>
                <div className="p-b-33">
                    <div className="sign-up-panel-box p-l-30 p-r-30 p-t-10">
                        <div className="div-center div-separator">
                            <a href="#" onClick={this.signupWithFacebook} className="sign-up-fa-btn-face m-b-10">
                                <FontAwesome name="facebook-official"/>Continue with Facebook
                            </a>
                        </div>
                        <form onSubmit={e => this.onSubmit(e)} className="flex-sb flex-w">
                            <div className="section">
                                <div className="checkBoxStyle"><TextField type="text" name="name" value={this.state.name} floatingLabelText="Name" errorText={this.state.errors.name} onChange={(e) => this.handleField('name', e)} /></div>
                                <div><TextField type="text" name="email" value={this.state.email} floatingLabelText="Email" errorText={this.state.errors.email} onChange={(e) => this.handleField('email', e)} /></div>
                                <div><TextField type="number" floatingLabelText="Phone" name="phone" onChange={(e) => this.handleField('phone', e)} /></div>
                                <div><TextField type="password" name="passphrase" value={this.state.passphrase} floatingLabelText="Passphrase" errorText={this.state.errors.passphrase} onChange={(e) => this.handleField('passphrase', e)} /></div>
                                <div><TextField type="password" name="retypePassphrase" value={this.state.retypePassphrase} floatingLabelText="Retype Passphrase" errorText={this.state.errors.retypePassphrase} onChange={(e) => this.handleField('retypePassphrase', e)} /></div>
                                <div className="countryRegionContainer">
                                    <CountryDropdown
                                        value={this.state.country}
                                        errorText={this.state.errors.country}
                                        onChange={this.handleCountry}
                                    />
                                </div>
                                <div className="countryRegionContainer">
                                    <RegionDropdown
                                        country={this.state.country}
                                        value={this.state.region}
                                        errorText={this.state.errors.region}
                                        onChange={this.handleRegion}
                                    />
                                </div>
                            </div>
                            <div className={`section volunteerDetailsContainer`}>
                                <h3>Please choose at most 3:</h3>
                                <VolunteerInterestsCheckboxesComponent handleCheckbox={this.handleCheckbox} checkboxInterests={this.state.checkboxInterests} />
                                <VolunteerSkillsInputComponent handleSkillsInput={this.handleSkillsInput} skillsInput={this.state.skillsInput ? this.state.skillsInput : ''} />
                            </div>
                            <div className="btn-container m-t-17 div-center">
                                <button onClick={e => this.handleSubmit(e)} className="sign-up-panel-sign-up-btn btn-form btn">Sign Up</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Paper>
        )
    }
}


export default SignupComponent
