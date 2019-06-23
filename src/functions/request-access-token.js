const axios = require('axios');

const APP_SECRET = process.env.REACT_APP_GITLAB_APP_SECRET;

export async function handler(event, context) {
  const jsonBody = JSON.parse(event.body);
  const requestGitlabToken = await axios.post('https://gitlab.com/oauth/token', Object.assign({
    client_secret: APP_SECRET,
    grant_type: 'authorization_code',
  }, jsonBody));
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestGitlabToken.data),
  };
}
