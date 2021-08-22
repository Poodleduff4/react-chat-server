import React from 'react';
import logo from './logo.svg';
import './App.css';
import Chat from './Chat/Chat';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import LoginForm from './Chat/LoginForm';
import Cookies from 'universal-cookie'
const cookies = new Cookies()

function Name() {
  // const name = useParams();
  console.log(cookies.get('username'));
  const name = cookies.get('username');
  return (
    <Chat name={name} />
  )
}

export default function App() {
  return (
    <Router>
      <React.Fragment>
      
        <nav>
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/chat">Chat</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/login">
            <LoginForm />
          </Route>
          <Route path="/chat">
            <Name />
          </Route>
        </Switch>
      
      </React.Fragment>
    </Router>
  );
}

// export default App;