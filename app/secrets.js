// secrets.js
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

async function getSecret(name) {
  const client = new SecretManagerServiceClient();
  const [version] = await client.accessSecretVersion({ name });
  return version.payload.data.toString('utf8');
}

async function loadDatabaseSecrets() {
  // Replace these values with your actual GitHub secret names
  // const githubSecretProjectId = process.env.GCP_PROJECT_ID || 'GCP_PROJECT_ID';
  // const databaseHostSecret = `projects/876168632127/secrets/your-database-host/versions/1`;
  const databasePasswordSecret = `projects/876168632127/secrets/your-database-password/versions/1`;

  return {
    database: {
      user: "dexarc",
      password: await getSecret(databasePasswordSecret),
      database: "New",
      socketPath: '/cloudsql/named-archway-413111:us-central1:my-cloud-sql-instance',
    },
  };
}

// Exporting the asynchronous function itself, not the result of its execution
module.exports = loadDatabaseSecrets;
