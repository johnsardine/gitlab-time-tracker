import React from 'react';
import Axios from 'axios';

const APP_ID = process.env.REACT_APP_GITLAB_APP_ID;
const REDIRECT_URI = 'http://localhost:3000/';

const FUNCTIONS_ROOT_URL = 'http://localhost:3000/.netlify/functions';

const responseParameters = new URLSearchParams(window.location.search);
const gitlabResponseCode = responseParameters.get('code');

const requestAuthCode = `https://gitlab.com/oauth/authorize?client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

const authorizationData = JSON.parse(localStorage.getItem('gitlabTimeTracker'));

let apiInstance;
if (authorizationData) {
  apiInstance = Axios.create({
    baseURL: 'https://gitlab.com/api',
    timeout: 10000,
    headers: {
      'Authorization': `${authorizationData.token_type} ${authorizationData.access_token}`,
    },
  });
}

async function requestAccessToken() {
  const response = await fetch(`${FUNCTIONS_ROOT_URL}/request-access-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: APP_ID,
      redirect_uri: REDIRECT_URI,
      code: gitlabResponseCode,
    }),
  });
  return response.json();
}


if (gitlabResponseCode) {
  (async () => {
    try {
      const oauthResponse = await requestAccessToken();
      // Save oauth response
      localStorage.setItem('gitlabTimeTracker', JSON.stringify(oauthResponse));
      // Redirect to root
      window.location.href = REDIRECT_URI;
    } catch (except) {
      console.error('Failed to get oauth response', except);
    }
  })();
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      issues: [],
    };
    if (apiInstance) {
      this.fetchUser();
      this.fetchIssues();
    }
  }

  async fetchUser() {
    const request = await apiInstance.get('/v4/user');
    this.setState({
      user: request.data,
    });
  }

  async fetchIssues() {
    const request = await apiInstance.get('/v4/issues');
    this.setState({
      issues: request.data,
    });
  }

  renderIssue({
    id,
    title,
    web_url,
  }) {
    return (
      <li key={id}>
        <a href={web_url}>{title}</a>
      </li>
    );
  }

  render() {
    const {
      issues,
    } = this.state;
    return (
      <div>
        <a href={requestAuthCode}>Request Auth</a>
        <ul>
          {issues.map(this.renderIssue)}
        </ul>
      </div>
    );
  }
}

export default App;
