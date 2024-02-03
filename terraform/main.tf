provider "google" {
#   credentials = file("service-account-key.json")
  project     = var.gcp_project
  region      = "us-central1"
}

# Specify the Google Cloud provider
provider "google" {
  credentials = file("service-account-key.json")
  project     = var.gcp_project
  region      = "us-central1"  # Adjust the region as needed
}

# Enable Compute Engine API
resource "google_project_service" "compute_engine" {
  project = var.gcp_project
  service = "compute.googleapis.com"
}

# Enable Cloud SQL API
resource "google_project_service" "sql" {
  project = var.gcp_project
  service = "sqladmin.googleapis.com"
}

# Enable Cloud Run API
resource "google_project_service" "cloud_run" {
  project = var.gcp_project
  service = "run.googleapis.com"
}

# Enable Secret Manager API
resource "google_project_service" "secret_manager" {
  project = var.gcp_project
  service = "secretmanager.googleapis.com"
}

# Create VPC network
resource "google_compute_network" "vpc_network" {
  name                    = "my-vpc"
  auto_create_subnetworks = false
  project = var.gcp_project
}

# Create Subnet within the VPC
resource "google_compute_subnetwork" "subnet" {
  name          = "my-subnet"
  ip_cidr_range = "10.0.0.0/24"
  network       = google_compute_network.vpc_network.self_link
  region        = "us-central1"
}

# Create Cloud SQL instance
resource "google_sql_database_instance" "cloud_sql_instance" {
  name             = "my-cloud-sql-instance"
  database_version = "MYSQL_8_0"
  region           = "us-central1"  
  
  # network          = google_compute_network.vpc_network.self_link  # Connect to the VPC

  settings {
    tier = "db-f1-micro"
  }
}

# Create a Cloud SQL database
resource "google_sql_database" "cloud_database" {
  name     = "my-database"
  instance = google_sql_database_instance.your_database.name
}

# Create Secret Manager Secret
resource "google_secret_manager_secret" "app_secrets" {
  secret_id = "my-app-secrets"
   labels = {
    my-key = "my-value"
  }
  replication {
    auto {
    }
  }
}

# Add secret versions to Secret Manager
resource "google_secret_manager_secret_version" "app_secrets_version" {
  secret = google_secret_manager_secret.app_secrets.id
  secret_data = jsonencode({
    db_username = var.db_username,
    db_password = var.db_password,
  })
}
# Create Cloud Run service
resource "google_cloud_run_service" "cloud_run_service" {
  name     = "my-cloud-run-service"
  location = "us-central1"
  project = var.gcp_project

  template {
    spec {
      containers {
        image = "gcr.io/${var.gcp_project}/your-node-app:latest"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# Grant the Cloud Run service permission to access the secret
resource "google_cloud_run_service_iam_member" "service_account_secret_access" {
  service = google_cloud_run_service.cloud_run_service.name
  location = google_cloud_run_service.cloud_run_service.location
  project = google_cloud_run_service.cloud_run_service.project

  role = "roles/secretmanager.secretAccessor"
  member = "serviceAccount:${google_cloud_run_service.cloud_run_service.project}@appspot.gserviceaccount.com"
}