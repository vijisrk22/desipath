import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import UserDashboard from './components/UserDashboard';
import BusinessDashboard from './components/BusinessDashboard';
import Login from './components/Login';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/user-dashboard" component={UserDashboard} />
                <Route path="/business-dashboard" component={BusinessDashboard} />
                <Route path="/login" component={Login} />
            </Switch>
        </Router>
    );
}

export default App;
