import * as React from 'react'
import { exportUserData, getAllUsers, searchVolunteers, makeAdmin } from '../../api/api'
import { interests } from '../../models/interests'
import VolunteerInterestsCheckboxesComponent from '../commonComponents/VolunteerInterestsCheckboxesComponent'
import VolunteerSkillsInputComponent from '../commonComponents/SkillsInputComponent'
import VolunteerListComponent from './search/volunteerList/VolunteerListComponent'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector-material-ui'
import { validateEmail } from '../../../lib/validation.js'
import SearchVolunteer from './search/SearchVolunteer'

require('./AdminPanelComponent.css')
require('../sharedCss.css')



class AdminPanelComponent extends React.Component {
    constructor(props) {
        super(props)
        const checkInterests = interests.map(interest => ({ interest: interest, checked: false }));
        this.state = {
            allUsers: [],
            filteredVolunteers: [],
            volunteerInterestFilterCheckboxes: checkInterests,
            filterInterests: '',
            loadingScreenShow: false,
            makeAdminField: '',
            searchQuery: {
            },
        }
    }
    componentWillMount() {
        getAllUsers().then( response => {
            this.setState({
                ...this.state,
                filteredVolunteers: response,
            })
        }).catch( error => {
            console.log(error)    
        })
    }

    handleGettingData = (event) => {
        event.preventDefault()
        exportUserData().then(data => {
        }).catch( (error) => {
            console.log(error)
            window.alert('Error getting export data')
        })
    }

    getAllVolunteers = () => {
        getAllUsers().then( response => {
            this.setState({
                filteredVolunteers: response,
                loadingScreenShow: false,
            })
        }).catch( error => {
            console.log(error)    
        })
    }

    handleField = (fieldName, event) => {
        event.preventDefault()
        let searchQuery = {
            ...this.state.searchQuery,
            [fieldName]: event.target.value
        }
        this.searchVolunteersHandler(searchQuery)
    }

    handleSkillsInput = (event) => {
        event.preventDefault()
        let searchQuery = {
            ...this.state.searchQuery,
            skillsInput: event.target.value,
            skills: event.target.value.split(/\s*,\s*/),
        }
        if (searchQuery.skills && searchQuery.skills.length == 0 || searchQuery.skills[0] == '') {
            delete searchQuery['skills']
        }
        this.searchVolunteersHandler(searchQuery)
    }

    handleCountry = (event, index, value) => {
        event.preventDefault()
        let searchQuery = {
            ...this.state.searchQuery,
            country: value
        }
        this.searchVolunteersHandler(searchQuery)
    }

    handleRegion = (event, index, value) => {
        event.preventDefault()
        let searchQuery = {
            ...this.state.searchQuery,
            region: value
        }
        this.searchVolunteersHandler(searchQuery)
    }

    handleCheckbox = (event, index, interest) => {
        event.preventDefault()
        this.setState({ ...this.state, loadingScreenShow: true })
        var data = this.state.volunteerInterestFilterCheckboxes
        data[index] = { interest: data[index].interest, checked: !data[index].checked }
        var volunteerInterests = []
        data.map( interestCheckbox => {
            if (interestCheckbox.checked) {
                volunteerInterests.push(interestCheckbox.interest)
            }
        })
        let searchQuery = {
            ...this.state.searchQuery,
            interests: volunteerInterests
        }
        if (searchQuery.interests.length == 0) {
            delete searchQuery['interests']
        }
        this.searchVolunteersHandler(searchQuery)
    }

    searchVolunteersHandler = (searchQuery) => {
        let cacheSkillsInput =  searchQuery['skillsInput']
        delete searchQuery['skillsInput']
        if (Object.keys(searchQuery).length != 0) {
            searchVolunteers(searchQuery).then( response => {
                if (response.result.length > 0) {
                    this.setState({
                        ...this.state,
                        filteredVolunteers: response.result,
                        loadingScreenShow: false,
                        searchQuery: {
                            ...searchQuery,
                        }
                    })
                }
                else {
                    this.setState({
                        ...this.state,
                        filteredVolunteers: [],
                        loadingScreenShow: false,
                        searchQuery: {
                            ...searchQuery,
                        }
                    })

                }
            }).catch( error => {
                console.log("ERRROR: ", error)
                this.setState({ ...this.state, loadingScreenShow: false })
            })
        }
        else {
            this.getAllVolunteers()
        }
    }

    showLoadingScreen = () => {
        if (this.state.loadingScreenShow) {
            return (
                <div className="loadingScreenContainer">
                    Searching Volunteers Please Wait...
                </div>
            )
        }
    }

    displayVolunteerList = () => {
        if (this.state.filteredVolunteers.length == 0) {
            return (
                <div> No Results for search query</div>
            )
        }
        else {
            return (
                <VolunteerListComponent allVolunteers={this.state.filteredVolunteers} />
            )
        }
    }

    handleMakeAdmin = (event) => {
        event.preventDefault()
        this.setState({
            ...this.state,
            makeAdminField: event.target.value,
        })
    }
    submitMakeAdmin = (event) => {
        event.preventDefault()
        let emailInvalidMsg = validateEmail(this.state.makeAdminField, '')
            if (emailInvalidMsg == '') {
            let data = {
                'email': this.state.makeAdminField
            }
            makeAdmin(data).then( response => {
                console.log(response)
            }).catch( error => {
                console.log(error)
            })
        }
        else {
            window.alert('Invalid Email')
        }
        
    }

    render() {
        return (
            <div className="adminPanelContainer">
                {this.showLoadingScreen()}
                <div className="adminHeaderContainer">
                    <div>
                        <button onClick={this.handleGettingData}>Export User Data</button>
                        <div>
                            <input type="text" onChange={this.handleMakeAdmin} />
                            <button onClick={this.submitMakeAdmin} >Make New Admin</button>
                        </div>
                    </div>
                </div>
                <SearchVolunteer />
                <div className="filterContainer">
                    
                </div>
                <div className="filterResultsContainer">
                    { this.displayVolunteerList() }
                </div>
                
            </div>
            )
    }
}

export default AdminPanelComponent
