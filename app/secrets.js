// secret.js
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

async function getSecret(name) {
  const client = new SecretManagerServiceClient();
  const [version] = await client.accessSecretVersion({ name });
  return version.payload.data.toString('utf8');
}

// Replace these values with your actual GitHub secret names
const githubSecretProjectId = process.env.GITHUB_SECRET_PROJECT_ID || 'GCP_PROJECT_ID';
const databaseHostSecret = `projects/${githubSecretProjectId}/secrets/your-database-host/versions/latest`;
// const databaseUserSecret = `projects/${githubSecretProjectId}/secrets/your-database-user/versions/latest`;
const databasePasswordSecret = `projects/${githubSecretProjectId}/secrets/your-database-password/versions/latest`;
// const databaseNameSecret = `projects/${githubSecretProjectId}/secrets/your-database-name/versions/latest`;

module.exports = {
  database: {
    host: await getSecret(databaseHostSecret),
    user: "dexarc",
    password: await getSecret(databasePasswordSecret),
    database: "New",
  },
};
