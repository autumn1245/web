import React from "react";
//import { Button, message} from 'antd';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Login from "./pages/login/login";
import Admin from "./pages/admin/admin";
import "./css/App.less";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login}></Route>
          <Route path="/admin" component={Admin}></Route>
          <Redirect to="/"></Redirect>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
