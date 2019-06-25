import Axios from 'axios';

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

export default apiInstance;
