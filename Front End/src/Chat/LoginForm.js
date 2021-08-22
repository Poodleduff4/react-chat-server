import React from 'react';
import { withRouter } from 'react-router-dom';
import Cookies from 'universal-cookie'
const cookies = new Cookies()

class LoginForm extends React.Component {
    state = {
        value: '',
    }

    handleChange = (e) => {
        this.setState({ value: e.target.value });
    }

    handleSubmit = (e) => {
        alert('name: ' + this.state.value)
        this.props.sendLoginInfo(this.state.value);
    }

    submitForm(e) {
        e.preventDefault()
        cookies.set('username', this.state.value);
        this.props.history.push('/chat'); // <--- The page you want to redirect your user to.
    }

    render() {
        return (
            <div className="login">
                Name:
                <form onSubmit={this.submitForm.bind(this)}>
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                    <button type="submit">Submit</button>
                </form>
            </div>
        );
    }
}

export default withRouter(LoginForm);