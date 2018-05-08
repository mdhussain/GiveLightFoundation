import * as React from 'react'
import EmailIcon from 'material-ui/svg-icons/communication/email';
import SMSIcon from 'material-ui/svg-icons/communication/textsms';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import IconButton from 'material-ui/IconButton';
import CallIcon from 'material-ui/svg-icons/communication/call'
import Checkbox from 'material-ui/Checkbox'
import SearchVolunteerStats from './SearchVolunteerStats';
import EmailVolunteer from '../../communication/EmailVolunteer';
import SMSVolunteer from '../../communication/SMSVolunteer';
import { white } from 'material-ui/styles/colors';
import { CSVLink } from 'react-csv';

import VolunteerDisplayComponent from '../volunteerDisplay/VolunteerDisplayComponent'
require('./VolunteerListComponent.css');

class VolunteerListComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            volunteers: [],
            volunteerStats: props.volunteerStats,
            timestamp: null,
            allSelected: false,
            showEmailDialog: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.timestamp != nextProps.timestamp) {
            let newVolunteers = nextProps.volunteerList.map((volunteer, index) => {
                volunteer.selected = false
                volunteer.index = index
                return volunteer
            });
            this.setState({
                ...this.state,
                volunteers: newVolunteers,
                volunteerStats: nextProps.volunteerStats,
                timestamp: nextProps.timestamp
            })
        }
    }

    handleVolunteerSelection = (event, volunteerIndex) => {
        let allVolunteers = this.state.volunteers
        allVolunteers[volunteerIndex].selected = event.target.checked;
        this.setState({
            ...this.state,
            volunteers: allVolunteers,
        });
    }

    handleAllChecked = (event) => {
        let allVolunteers = this.state.volunteers.map(volunteer => {
            volunteer.selected = event.target.checked;
            return volunteer
        })

        this.setState({
            ...this.state,
            allSelected: event.target.checked,
            volunteers: allVolunteers,
        })
    }

    showEmailDialog = () => {
        const volunteersToEmail = this.state.volunteers.filter(volunteer => {
            return volunteer.selected
        })
        this.setState({
            ...this.state,
            showEmailDialog: true,
            volunteersToEmail: volunteersToEmail
        });
    };

    closeEmailDialog = () => {
        this.setState({
            ...this.state,
            showEmailDialog: false,
        });
    }

    showSMSDialog = () => {
        const volunteersToText = this.state.volunteers.filter(volunteer => {
            return volunteer.selected
        })
        this.setState({
            ...this.state,
            showSMSDialog: true,
            volunteersToText: volunteersToText
        });
    };

    closeSMSDialog = () => {
        this.setState({
            ...this.state,
            showSMSDialog: false,
        });
    }

    renderSearchTopActions = () => {
        return (
            <div className="volunteer-actions-container">
                <div className="select-all-checkbox">
                    <Checkbox
                        checked={this.state.allSelected}
                        onCheck={this.handleAllChecked}
                    />
                    <EmailVolunteer showDialog={this.state.showEmailDialog} volunteersToEmail={this.state.volunteersToEmail} closeHandle={this.closeEmailDialog} />
                    <SMSVolunteer showDialog={this.state.showSMSDialog} volunteersToText={this.state.volunteersToText} closeHandle={this.closeSMSDialog} />
                </div>
                <div className="right-actions">
                    <div className="actionItem">
                        <IconButton color="primary" onClick={(event) => this.showEmailDialog()} tooltip="Email volunteers" tooltipPosition="bottom-right">
                            <EmailIcon color={white} />
                        </IconButton>
                        <IconButton color="primary" onClick={(event) => this.showSMSDialog()} tooltip="Text volunteers" tooltipPosition="bottom-right">
                            <SMSIcon color={white} />
                        </IconButton>
                        <IconButton color="primary" onClick={(event) => this.showEmailDialog()} tooltip="Export to CSV" tooltipPosition="bottom-right">
                            <DownloadIcon color={white} />
                        </IconButton>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        if (this.state.volunteers.length != 0) {
            return (
                <div className="volunteer-list-container">
                    <div className="volunteer-list section">
                        {this.renderSearchTopActions()}
                        {
                            this.state.volunteers.map((volunteer, index) => {
                                return (<VolunteerDisplayComponent key={index} handleVolunteerSelection={this.handleVolunteerSelection} volunteer={volunteer} />)
                            })
                        }
                    </div>
                    <div className="volunteer-stats section">
                        <SearchVolunteerStats volunteerStats={this.state.volunteerStats} timestamp={this.state.timestamp} />
                    </div>
                </div>
            )
        }
        else {
            return null;
        }
    }
}

export default VolunteerListComponent
