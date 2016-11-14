import React, { Component } from 'react';
import Path from './Path';
import UserCard from './UserCard';

class Profile extends Component {

  componentDidMount() {
    const { params, actions } = this.props;
    const userId = params.userId;
    actions.pathsList(userId);
    actions.fetchProfile(userId);
  }

  render() {
    const { actions, params, paths, profile } = this.props;
    const userId = params.userId;
    return (
      <div>
        <UserCard user={profile} router={this.props.router} key={userId} />
        <Path userId={userId} actions={actions} paths={paths} />
      </div>
    );
  }
}

Profile.propTypes = {
  actions: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
  router: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,
  paths: React.PropTypes.object.isRequired,
  profile: React.PropTypes.object.isRequired
};

export default Profile;
