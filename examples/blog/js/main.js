import React from 'react';
import { render } from 'react-dom';
import { Route } from 'react-router';
// import ReactAdmin from '../build/react-admin-standalone.min.js';
import ReactAdmin from '../../../app/ReactAdmin';

import * as ApiFlavor from './api_flavor';
import ETags from './entities/tag';
import EComments from './entities/comment';
import EPosts from './entities/post';
import MyMenu from './menu';
import StateStore from './stateStore';
import Login from './components/login';
import CustomHeader from './components/header';

function configureApp(nga, fieldViewConfiguration, setupRoutes, components, restful, autoload) {

    let state = new StateStore();

    ApiFlavor.init(restful, state);

    // Add custom component
    var SendEmail = React.createClass({
        render: function () {
            return <a className='btn btn-default' href='#/stats'>Show stats</a>;
        }
    });
    autoload('SendEmail', SendEmail);

    var admin = nga.application('rest-admin backend demo') // application main title
        .baseApiUrl('http://localhost:3000/'); // main API endpoint

    // create da entities
    admin
        .addEntity(nga.entity('tags'))
        .addEntity(nga.entity('comments'))
        .addEntity(nga.entity('posts'));
    // init them
    var tag = ETags(nga, admin);
    var comment = EComments(nga, admin);
    var post = EPosts(nga, admin);

    // customize menu
    admin.menu(MyMenu(nga, admin));

    // override component
    components['Header'] = CustomHeader;

    // Add custom route
    var ViewActions = components.ViewActions;
    var Stats = React.createClass({
        render: function () {
            return <div>
                <ViewActions buttons={['back']} />
                <h1>Stats</h1>
                <p className='lead'>You can add custom pages, too</p>
            </div>;
        }
    });

    function customEnterHook(nextState, replace) {
      // this redirect all urls concerning tag with id=5
      // NOTE: can be used to check e.g. state.user.isLogged and redir to login
      if(nextState.params.entity === "tags" && nextState.params.id === "5") {
        replace('/login');
      }
    }
    let routes = setupRoutes(customEnterHook);

    routes.props.children.push(
      <Route name="stats" path="/stats" component={Stats} />
    );
    routes.props.children.push(
      <Route name="login" path="/login" component={Login} />
    );

    return {
      admin,
      state
    };
}

render(
  <ReactAdmin configureApp={configureApp} />,
  document.getElementById('my-app')
);
