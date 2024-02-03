import { getSecret } from './secrets';
import { startApp } from './index'; // Assuming the main application logic is in index.js

async function startAppWithSecrets() {
  try {
    // Fetch secrets from Google Cloud Secret Manager
    const cloudSQLConnectionString = await getSecret('cloud-sql-connection-string');
    const dbUser = await getSecret('db-username');
    const dbPassword = await getSecret('db-password');
    const dbName = await getSecret('db-name');

    // Start the application with the fetched secrets
    startApp(cloudSQLConnectionString, dbUser, dbPassword, dbName);
  } catch (error) {
    console.error('Error starting the application with secrets:', error);
    process.exit(1);
  }
}

// Invoke the startAppWithSecrets function to start the application with secrets
startAppWithSecrets();
