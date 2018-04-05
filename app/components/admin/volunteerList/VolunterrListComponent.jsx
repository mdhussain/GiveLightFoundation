import * as React from 'react'
import EmailIcon from 'material-ui/svg-icons/communication/email'
import CallIcon from 'material-ui/svg-icons/communication/call'
import Checkbox from 'material-ui/Checkbox'

import VolunteerDisplayComponent from '../volunteerDisplay/VolunteerDisplayComponent'
import { groupEmailNotify } from '../../../api/api'
require('./VolunteerListComponent.scss');

class VolunteerListComponent extends React.Component {
    constructor (props) {
        super(props)
        this.props = props
        this.state = {
            volunteers: [],
            allSelected: false,
            groupMessage: ''
        }
        this.state.volunteers = this.props.allVolunteers.map( (volunteer, index) => {
            volunteer.selected = false
            volunteer.index = index
            return volunteer
        })
    }

    handleGroupMessage = (event) => {
        this.setState({
            ...this.state,
            groupMessage: event.target.value
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

    handleGroupNotification = (event, notificationType) => {
        const volunteersToEmail = this.state.volunteers.filter( volunteer => {
            return volunteer.selected
        })
        if (this.state.groupMessage.length !== 0) {
            groupEmailNotify(volunteersToEmail, notificationType, this.state.groupMessage)
        }
        console.log('volunteers to email: ', volunteersToEmail)
        
    }

    groupSelectionContainer = () => {
        return (
            <div className="volunteerListActionsContainer">
                <div className="groupNotificuationSelectionContainer">
                    <div className="actionItem">
                        <Checkbox
                            checked={this.state.allSelected}
                            onCheck={this.handleAllChecked}
                        />
                    </div>
                    <div className="actionItem">
                        <EmailIcon onClick={(event) => this.handleGroupNotification(event, 'email')} />
                    </div>
                    <div className="actionItem">
                        <CallIcon onClick={(event) => this.handleGroupNotification(event, 'sms')} />
                    </div>
                </div>
                <div className="messageDetailsContainer">
                    <textarea rows="6" cols="60" onChange={this.handleGroupMessage}></textarea>
                </div>

            </div>
        )

    }

    render () {
        if (this.props.allVolunteers) {
            return (
                <div className="listContainer">
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
