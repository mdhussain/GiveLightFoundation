import * as React from 'react'
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import ChipInput from 'material-ui-chip-input';
import RichTextEditor from 'react-rte';
import TextField from 'material-ui/TextField'
import { emailVolunteers } from '../../../api/api'
require('./EmailVolunteer.css');

class EmailVolunteer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showDialog: this.props.showDialog,
            volunteersToEmail: this.props.volunteersToEmail,
            emailSubject: '',
            emailContent: RichTextEditor.createEmptyValue(),
            sendError: '',
            sendSuccess: '',
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.showDialog != nextProps.showDialog) {
            this.setState({
                ...this.state,
                showDialog: nextProps.showDialog,
                volunteersToEmail: nextProps.volunteersToEmail,
                sendError: '',
                sendSuccess: '',
            });
        }
    }

    closeEmailDialog = () => {
        this.setState({
            ...this.state,
            showDialog: false
        });
        this.props.closeHandle();
    };

    handleAddToEmailList = (email) => {
        //TODO Add validation and set the error for ChipInput
        this.setState({
            ...this.state,
            volunteersToEmail: [...this.state.volunteersToEmail]
        });
    }

    handleRemoveFromEmailList = (chip, index) => {
        const emails = this.state.volunteersToEmail;
        this.setState({
            ...this.state,
            volunteersToEmail: [...emails.slice(0, index), ...emails.slice(index + 1)]
        });
    }

    handleEmailTextChange = (richText) => {
        this.setState({
            ...this.state,
            emailContent: richText
        });
    }

    sendEmail = () => {
        let emailAdd = this.state.volunteersToEmail;
        let emailHtml = this.state.emailContent.toString('html');
        let emailSubject = this.state.emailSubject;
        if (emailHtml.length !== 0 && emailAdd.length != 0) {
            emailVolunteers(emailAdd, emailSubject, emailHtml).then(response => {
                console.log('Email Sent: ', response);
                if (!response.error) {
                    this.setState({
                        sendSuccess: 'Email sent to volunteers.',
                    });
                }
                else {
                    this.setState({
                        sendError: response.error,
                    });
                }
            }).catch(error => {
                console.log('Error sending email ', error);
                this.setState({
                    sendError: error.message,
                });
            });
        }
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
                <RaisedButton label="Send" primary={true} keyboardFocused={true} onClick={this.sendEmail} />,
                <RaisedButton label="Cancel" onClick={this.closeEmailDialog} />
            ];
            const title = <div className="dialog-title">Email volunteers</div>
            const toolbarConfig = {
                // Optionally specify the groups to display (displayed in the order listed).
                display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN'],
                INLINE_STYLE_BUTTONS: [
                    { label: 'Bold', style: 'BOLD' },
                    { label: 'Italic', style: 'ITALIC' },
                    { label: 'Strikethrough', style: 'STRIKETHROUGH' },
                    { label: 'Underline', style: 'UNDERLINE' }
                ],
                BLOCK_TYPE_DROPDOWN: [
                    { label: 'Normal', style: 'unstyled' },
                    { label: 'Heading Large', style: 'header-one' },
                    { label: 'Heading Medium', style: 'header-two' },
                    { label: 'Heading Small', style: 'header-three' }
                ],
                BLOCK_TYPE_BUTTONS: [
                    { label: 'UL', style: 'unordered-list-item' },
                    { label: 'OL', style: 'ordered-list-item' },
                    { label: 'Blockquote', style: 'blockquote' }
                ],
                LINK_BUTTONS: [
                    { label: 'Link', style: 'link' },
                    { label: 'Remove Link', style: 'remove-link' },
                ],
            }
            return (
                <Dialog
                    title={title}
                    actions={actions}
                    modal={false}
                    open={this.state.showDialog}
                    onRequestClose={this.closeEmailDialog}
                >
                    {this.renderStatus()}
                    <div className="dialog-body p-t-10">
                        <ChipInput
                            fullWidth
                            value={this.state.volunteersToEmail}
                            onRequestAdd={(chip) => this.handleAddToEmailList(chip)}
                            onRequestDelete={(chip, index) => this.handleRemoveFromEmailList(chip, index)}
                        />
                        <TextField
                            type="text"
                            name="subject"
                            fullWidth
                            value={this.state.emailSubject}
                            floatingLabelText="Subject"
                            onChange={(e) => this.setState({ emailSubject: e.target.value })} />
                        <RichTextEditor
                            value={this.state.emailContent}
                            onChange={this.handleEmailTextChange}
                            toolbarConfig={toolbarConfig}
                        />
                    </div>
                </Dialog>
            )
        }
        else {
            return null;
        }
    }
}

export default EmailVolunteer
