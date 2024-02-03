import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// Function to retrieve secrets from Google Cloud Secret Manager
export async function getSecret(secretName) {
  const client = new SecretManagerServiceClient();
  const [version] = await client.accessSecretVersion({
    name: `projects/your-project-id/secrets/${secretName}/versions/latest`,
  });
  return version.payload.data.toString('utf8');
}
