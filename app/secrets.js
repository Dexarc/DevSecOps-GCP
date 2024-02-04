// secrets.js
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

async function getSecret(name) {
  const client = new SecretManagerServiceClient();
  const [version] = await client.accessSecretVersion({ name });
  return version.payload.data.toString('utf8');
}

async function loadDatabaseSecrets() {
  // Replace these values with your actual GitHub secret names
  const githubSecretProjectId = process.env.GITHUB_SECRET_PROJECT_ID || 'GCP_PROJECT_ID';
  const databaseHostSecret = `projects/${githubSecretProjectId}/secrets/your-database-host/versions/1`;
  const databasePasswordSecret = `projects/${githubSecretProjectId}/secrets/your-database-password/versions/1`;

  return {
    database: {
      host: await getSecret(databaseHostSecret),
      user: "dexarc",
      password: await getSecret(databasePasswordSecret),
      database: "New",
    },
  };
}

module.exports = await loadDatabaseSecrets();
