import * as React from 'react'
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import ChipInput from 'material-ui-chip-input';
import TextField from 'material-ui/TextField'
import { smsVolunteers } from '../../../api/api'
require('./SMSVolunteer.css');

class SMSVolunteer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showDialog: this.props.showDialog,
            volunteersToText: this.props.volunteersToText,
            emptyVolunteerError: '',
            textContent: '',
            textContentError: '',
            sendError: '',
            sendSuccess: '',
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.showDialog != nextProps.showDialog) {
            this.setState({
                ...this.state,
                showDialog: nextProps.showDialog,
                volunteersToText: nextProps.volunteersToText,
                sendError: '',
                sendSuccess: '',
            });
        }
    }

    closeTextDialog = () => {
        this.setState({
            ...this.state,
            showDialog: false
        });
        this.props.closeHandle();
    };

    handleAddToTextList = (text) => {
        //TODO Add validation and set the error for ChipInput
        this.setState({
            ...this.state,
            volunteersToText: [...this.state.volunteersToText, text]
        });
    }

    handleRemoveFromTextList = (chip, index) => {
        const text = this.state.volunteersToText;
        this.setState({
            ...this.state,
            volunteersToText: [...text.slice(0, index), ...text.slice(index + 1)]
        });
    }

    sendText = () => {
        let volunteersPhone = this.state.volunteersToText;
        console.log('Sending text: ', volunteersPhone);
        let textContent = this.state.textContent;
        if (this.validInput()) {
            smsVolunteers(volunteersPhone, textContent).then(response => {
                console.log('Text Sent: ', response);
                if (!response.error) {
                    this.setState({
                        sendSuccess: 'Texted the volunteers.',
                    });
                }
                else {
                    this.setState({
                        sendError: response.error,
                    });
                }
            }).catch(error => {
                console.log('Error sending text ', error);
                this.setState({
                    ...this.state,
                    sendError: error.message,
                });
            });
        }
    }

    validInput = () => {
        let volunteersPhone = this.state.volunteersToText;
        let textContent = this.state.textContent;
        if (!textContent) {
            this.setState({
                textContentError: 'Please enter the text to send.',
            });
            return false;
        }
        if (!volunteersPhone) {
            this.setState({
                emptyVolunteerError: 'Please enter the volunteer phone number\'s to send.',
            });
            return false;
        }
        return true;
    }

    renderStatus = () => {
        let sendError = this.state.sendError;
        let sendSuccess = this.state.sendSuccess;
        if (sendError) {
            return <div className="error-panel">{sendError}</div>;
        }
        if (sendSuccess) {
            return <div className="success-panel">{sendSuccess}</div>;
        }
    }

    render = () => {
        if (this.state.showDialog) {
            const actions = [
                <RaisedButton label="Send" primary={true} keyboardFocused={true} onClick={this.sendText} />,
                <RaisedButton label="Cancel" onClick={this.closeTextDialog} />
            ];
            const title = <div className="dialog-title">Text volunteers</div>
            const volunteerPhoneNumbers = this.state.volunteersToText.map(vol => {return vol.phone})
            return (
                <Dialog
                    title={title}
                    actions={actions}
                    modal={false}
                    open={this.state.showDialog}
                    onRequestClose={this.closeTextDialog}
                >
                    {this.renderStatus()}
                    <div className="dialog-body p-t-10">
                        <ChipInput
                            fullWidth
                            value={volunteerPhoneNumbers}
                            errorText={this.state.emptyVolunteerError}
                            onRequestAdd={(chip) => this.handleAddToTextList(chip)}
                            onRequestDelete={(chip, index) => this.handleRemoveFromTextList(chip, index)}
                        />
                        <TextField
                            type="text"
                            name="Text"
                            fullWidth
                            value={this.state.textContent}
                            errorText={this.state.textContentError}
                            floatingLabelText="Text"
                            onChange={(e) => this.setState({ textContent: e.target.value })} />
                    </div>
                </Dialog>
            )
        }
        else {
            return null;
        }
    }
}

export default SMSVolunteer
