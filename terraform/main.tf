# Minimal Terraform config for HealthBridge's AI + Python services.
#
# Uses the Docker provider so it runs locally with zero cloud account / billing setup —
# this is enough to satisfy "Terraform configuration" as a submission requirement while
# you have almost no time left. If you get extra time later, swap this provider block for
# aws/azurerm/google and reuse the same resource structure against real cloud infra.

terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

resource "docker_image" "ai_service" {
  name = "healthbridge-ai-service:latest"
  build {
    context = "../ai-service"
  }
}

resource "docker_container" "ai_service" {
  name  = "healthbridge-ai-service"
  image = docker_image.ai_service.image_id
  ports {
    internal = 8001
    external = 8001
  }
  env = [
    "GROQ_API_KEY=${var.groq_api_key}",
    "PYTHON_SERVICE_URL=http://host.docker.internal:8002",
  ]
}

resource "docker_image" "python_service" {
  name = "healthbridge-python-service:latest"
  build {
    context = "../python-service"
  }
}

resource "docker_container" "python_service" {
  name  = "healthbridge-python-service"
  image = docker_image.python_service.image_id
  ports {
    internal = 8002
    external = 8002
  }
}

variable "groq_api_key" {
  description = "Groq API key for the AI service"
  type        = string
  sensitive   = true
}
