output "cloud_run_url" {
  description = "URL of the deployed Cloud Run service"
  value       = google_cloud_run_service.cloud_run_service.status[0].url
}

output "cloud_sql_connection_name" {
  description = "Connection name for Cloud SQL"
  value       = google_sql_database_instance.cloud_sql_instance.connection_name
}

output "cloud_sql_database_name" {
  description = "Name of the Cloud SQL database"
  value       = google_sql_database.cloud_database.name
}

output "cloud_sql_instance_ip" {
  description = "Public IP address of the Cloud SQL instance"
  value       = google_sql_database_instance.cloud_sql_instance.ip_address
}
