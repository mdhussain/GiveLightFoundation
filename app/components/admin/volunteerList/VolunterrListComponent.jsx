import * as React from 'react'
import EmailIcon from 'material-ui/svg-icons/communication/email'
import CallIcon from 'material-ui/svg-icons/communication/call'
import Checkbox from 'material-ui/Checkbox'

import VolunteerDisplayComponent from '../volunteerDisplay/VolunteerDisplayComponent'
require('./VolunteerListComponent.css');

class VolunteerListComponent extends React.Component {
    constructor (props) {
        super(props)
        this.props = props
        this.state = {
            volunteers: [],
            allSelected: false
        }
        this.state.volunteers = this.props.allVolunteers.map( (volunteer, index) => {
            volunteer.selected = false
            volunteer.index = index
            return volunteer
        })
    }

    handleChecked = (event, volunteerIndex) => {
        let allVolunteers = this.state.volunteers
        allVolunteers[volunteerIndex].selected = !allVolunteers[volunteerIndex].selected
        this.setState({
            ...this.state,
            volunteers: allVolunteers
        })
    }

    handleAllChecked = (event) => {
        console.log('all checked', event.target.value)
        const allSelected = !this.state.allSelected
        let allVolunteers = this.state.volunteers.map( volunteer => {
            volunteer.selected = allSelected 
            return volunteer
        })
        
        this.setState({
            ...this.state,
            allSelected: allSelected,
            volunteers: allVolunteers
        })
    }

    groupSelectionContainer = () => {
        return (
            <div>
                <Checkbox
                    checked={this.state.allSelected}
                    onCheck={this.handleAllChecked}
                />
                |
                <EmailIcon />
                |
                <CallIcon />

            </div>
        )

    }

    render () {
        if (this.props.allVolunteers) {
            return (
                <div>
                    {this.groupSelectionContainer()}
                    <div className="volunteerListContainer">
                        {
                            this.state.volunteers.map( (volunteer, index) => {
                                return ( <VolunteerDisplayComponent key={index} handleChecked={this.handleChecked} volunteerData={volunteer} />)
                            })
                        }
                    </div>
                </div>
            )
        }
        else {
            return (<div></div>)
        }
    }
}

export default VolunteerListComponent
