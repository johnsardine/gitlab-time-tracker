import React from 'react';
import Axios from 'axios';
import apiInstance from './apiInstance';
import IssueEntry from './components/IssueEntry';

const APP_ID = process.env.REACT_APP_GITLAB_APP_ID;
const APP_URL = process.env.REACT_APP_APP_URL;
const REDIRECT_URI = APP_URL;

const FUNCTIONS_ROOT_URL = `${APP_URL}/.netlify/functions`;

const responseParameters = new URLSearchParams(window.location.search);
const gitlabResponseCode = responseParameters.get('code');

const requestAuthCode = `https://gitlab.com/oauth/authorize?client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

function requestAccessToken() {
  return Axios.post(`${FUNCTIONS_ROOT_URL}/request-access-token`, {
    client_id: APP_ID,
    redirect_uri: REDIRECT_URI,
    code: gitlabResponseCode,
  });
}


if (gitlabResponseCode) {
  (async () => {
    try {
      const oauthResponse = await requestAccessToken();
      // Save oauth response
      localStorage.setItem('gitlabTimeTracker', JSON.stringify(oauthResponse.data));
      // Redirect to root
      window.location.href = REDIRECT_URI;
    } catch (except) {
      const {
        data: {
          error,
          error_description,
        },
      } = except.response;
      if (error === 'invalid_grant') {
        alert(error_description);
      }
    }
  })();
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      issues: [],
      loadingIssues: false,
    };
    this.updateIssue = this.updateIssue.bind(this);
  }

  async fetchUser() {
    const request = await apiInstance.get('/v4/user');
    this.setState({
      user: request.data,
    });
  }

  async fetchIssues() {
    this.setState({
      loadingIssues: true,
    });
    const request = await apiInstance.get('/v4/issues?state=opened&scope=assigned_to_me&order_by=updated_at');
    this.setState({
      issues: request.data,
      loadingIssues: false,
    });
  }

  async updateIssue(issue) {
    const request = await apiInstance.get(issue._links.self);
    this.setState((state) => {
      const issues = state.issues.map((issue) => {
        if (request.data.id === issue.id) {
          return request.data;
        }
        return issue;
      });
      return {
        issues,
      }
    });
  }

  componentDidMount() {
    if (apiInstance) {
      this.fetchUser();
      this.fetchIssues();
    }
  }

  render() {
    const {
      issues,
    } = this.state;
    return (
      <div>
        <a href={requestAuthCode}>Request Auth</a>
        <div>
          {issues.map((issue) =>
            <IssueEntry
              key={issue.id}
              issue={issue}
              updateEntry={this.updateIssue} />
          )}
        </div>
      </div>
    );
  }
}

export default App;
