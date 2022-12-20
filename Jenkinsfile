// Declarative pipeline
@Library('<name from your jenkins>') _

pipeline {

  agent { any }

  environment {
    DOCKER_IMG     = "<Your image here>"             // The image to push
    SSH_HOST       = "<Your Target server here>"       // The host to use
    SSH_USER       = "<Your SSH User here>"            // SSH user 
    CREDENTIALS_ID = "<Your SSH Credentials ID>" // ID of the credentials
  }

  stages {  
    stage("Deliver") {
      steps {
        // This will push the image `env.DOCKER_IMG` to the deployment host
        dockerRemoteSave(credentialsId: env.CREDENTIALS_ID, img: env.DOCKER_IMG, host: env.SSH_HOST, user: SSH_USER)
      }
    }
  
    stage("Deploy") {
      environment {
        BIND_PORT      = 80 // Your bind port - Exposed to other services public
        CONTAINER_PORT = 3000 // Container port - Not accessible to other service
        APP_NAME       = "<NAME OF YOUR SERVICE>"
        ENV_FILE_ID    = "<ID of the Env file>"
      }
      
      steps {
        dockerRemoteRun(
          host: "${env.SSH_HOST}",
          user: "${env.SSH_USER}",
          img: "${env.DOCKER_IMG}",
          bindPort: "${env.BIND_PORT}",
          containerPort: "${env.CONTAINER_PORT}",
          app: "${env.APP_NAME}",
          env: "{env.ENV_FILE_ID}"
        )
      }
    }
  }
}