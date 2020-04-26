const { google } = require("googleapis");
const axios = require("axios").default;

// Load the service account key JSON file.
const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

// Specify the required scope.
const scopes = ["https://www.googleapis.com/auth/firebase"];

// Authenticate a JWT client with the service account.
const jwtClient = new google.auth.JWT(
  serviceAccount.client_email,
  null,
  serviceAccount.private_key,
  scopes
);

let accessToken;

const getAccessToken = () => {
  return new Promise((resolve, reject) => {
    if (accessToken) {
      return resolve(accessToken);
    }
    jwtClient.authorize(function (error, tokens) {
      if (error) {
        reject(`Error making request to generate access token: ${error}`);
      } else if (tokens.access_token === null) {
        reject(
          "Provided service account does not have permission to generate access tokens"
        );
      } else {
        accessToken = tokens.access_token;
        resolve(accessToken);
      }
    });
  });
};
/**
 *
 * @returns {Promise<AxiosInstance>}
 */
const getClient = () => {
    return getAccessToken().then(accessToken => {
        return new Promise(resolve => {
            const client = axios.create({
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            resolve(client);
        })
    })
}

module.exports = { getAccessToken, getClient }