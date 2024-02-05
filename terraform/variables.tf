# variable "db_password" {
#   description = "Database password"
# }

##passed as env vars from github actions
variable "gcp_project" {
  type        = string
  description = "Google Cloud Project ID"
}

variable "service_account_key_file" {
  description = "The path to the Google Cloud service account key file"
  type        = string
}