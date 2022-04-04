import React, { Component, Fragment } from "react";
import { Redirect, withRouter } from "react-router-dom";
import "reset-css";
import "./css/App.css";
import "./css/App2.css";

import "./css/Responsive.css";
import "./css/Responsive2.css";

import "./css/responsive-desktop.css";
import "./css/responsive-tablet.css";
import "./css/responsive-phone.css";
import "./css/odometer2.css";
import "./css/Range.css";


import "rc-tooltip/assets/bootstrap.css";

import UserGuest from "./components/Guest/Guest";
import UserLogged from "./components/UserLogged";
import LoadingFull from "./components/LoadingFull";
import Frame from "./components/Frame.js";

import { pathIsInArray } from "./utils.js";
import { registerLogoutCallback, registerApiUser } from "./api.js";
var guestRoutes = ["/login", "/register", "/password_recover/*", "/email_confirmation/*"];
//Rutas de guest, pero accesibles con sesión
var hardLogoutRoutes = ["/login/*", "/register/required"];

const initialState = {
    user: null,
    initial_loading: true,
    main_loading: true,
};
class App extends Component {
    constructor(props) {
        super(props);
        this.state = { ...initialState };
        registerLogoutCallback(this.doLogout.bind(this));
    }
    componentDidMount() {
        this.checkSession();
    }
    checkSession() {
        let user = JSON.parse(localStorage.getItem("user"));
        let ishardLogout = pathIsInArray(
            hardLogoutRoutes,
            this.props.location.pathname
        );
        if (ishardLogout) this.doLogout();
        else if (user) {
            let token = localStorage.getItem("token");
            this.startUser(user, token);
        } else {
            this.startGuest();
        }
    }
    processLogin(user, token) {
        this.createSession(user, token);
        this.startUser(user, token);
    }
    startGuest() {
        var redirect = pathIsInArray(guestRoutes, this.props.location.pathname)
            ? null
            : "/login";
        this.state = {};
        this.setState(
            {
                ...initialState,
                initial_loading: false,
                main_loading: false,
                user: null,
                redirect,
            },
            () => {
                this.setState({ redirect: null });
            }
        );
    }
    startUser(user, token) {
        var redirect = !pathIsInArray(guestRoutes, this.props.location.pathname)
            ? null
            : "/servicios";
        this.setState({ rrss_login_data: null }, () => {
            registerApiUser(user, token);
            this.setState({ user, redirect }, () => {
                this.setState(
                    {
                        initial_loading: false,
                        main_loading: false,
                        redirect: null,
                    },
                    () => {}
                );
            });
        });
    }
    doLogout() {
        this.setState({ main_loading: true });
        this.deleteSession();
        registerApiUser(null, null, null);
        this.startGuest();
    }
    deleteSession(type) {
        localStorage.clear();
    }
    createSession(user, token, role) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
    }
    updateSession(user, token) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
    }
    redirect(url, cb) {
        this.setState({ redirect: url }, () =>
            this.setState({ redirect: false }, () => {
                if (cb) cb();
            })
        );
    }

    toggleMainLoading(main_loading) {
        console.log(main_loading);
        this.setState({ main_loading });
    }
    render() {
        if (this.state.initial_loading) return <LoadingFull />;
        return (
            <Fragment>
                {this.state.redirect ? (
                    <Redirect to={this.state.redirect} />
                ) : null}
                <Frame
                    user={this.state.user}
                    location={this.props.location}
                    logout={this.props.doLogout}
                    header_class={this.props.header_class}
                    doLogout={this.doLogout.bind(this)}
                >
                    {this.state.user ? (
                        <UserLogged
                            redirect={this.redirect.bind(this)}
                            user={this.state.user}
                            location={this.props.location}
                            toggleMainLoading={this.toggleMainLoading.bind(this)}                            
                        />
                    ) : (
                        <UserGuest
                            redirect={this.redirect.bind(this)}
                            processLogin={this.processLogin.bind(this)}
                            toggleMainLoading={this.toggleMainLoading.bind(this)}
                        />
                    )}
                </Frame>
                {this.state.main_loading ? <LoadingFull /> : null}
            </Fragment>
        );
    }
}
export default withRouter(App);
