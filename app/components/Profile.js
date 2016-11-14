import React, { Component } from 'react';
import Path from './Path';
import UserCard from './UserCard';
import Paper from 'material-ui/Paper';

let styles = {};

class Profile extends Component {

  componentDidMount() {
    const { params, actions } = this.props;
    const userId = params.userId;
    actions.pathsList(userId);
    actions.fetchProfile(userId);
  }

  render() {
    const { actions, params, paths } = this.props;
    const userId = params.userId;
    const skills = [{ name: 'mongoDB' }, { name: 'Angular' }];
    const fakeProfile = { id: '114634487399949912483', lastName: 'Sójko', fullName: 'Karol Sójko', username: 'karol.sojko', email: 'karol.sojko@x-team.com', isAdmin: true, picture: 'https://lh3.googleusercontent.com/-bMOzaOKNYMY/AAAAAAAAAAI/AAAAAAAAADo/P8Z_HOUta9Q/s96-c/photo.jpg', firstName: 'Karol' };
    return (
      <div>
        <div style={styles.userWrapper}>
          <UserCard user={fakeProfile} router={this.props.router} key={userId} />
        </div>
        <div style={styles.skillsWrapper}>
          {skills.map(skill => (
            <Paper style={styles.skill} zDepth={2} circle="true">
              <span style={styles.skillTitle}>{skill.name}</span>
            </Paper>
          ))}
        </div>
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

styles = {
  skill: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '180px',
    height: '180px',
    margin: '20px 20px 50px',
    padding: '20px',
    textAlign: 'center',
    color: '#5f5f5f',
  },
  skillTitle: {
    display: 'flex',
    flexGrow: '1',
    alignItems: 'center',
    alignSelf: 'center',
    fontSize: '22px',
    fontWeight: '200',
    padding: '5px',
    marginTop: '10px'
  },
  skillsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    margin: 'auto',
    width: '90%',
    maxWidth: '1150px',
  },
  userWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    margin: 'auto',
    width: '90%',
    maxWidth: '1150px',
  },
};
