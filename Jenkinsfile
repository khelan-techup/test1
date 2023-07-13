pipeline {
    agent any

    stages {
        stage("Build") {
            steps {
                sh ' sudo npm install'
                sh " sudo npm run build"
            }
        }

        stage("Deploy") {
            steps {
                sh "sudo rm -rf /var/www/jenkins-react-app"
                sh "sudo cp -r /var/lib/jenkins/workspace/jenkins-react-app/build/ /var/www/jenkins-react-app/"
            }
        }

        stage("Verify Build") {
            steps {
                sh "ls -la /var/lib/jenkins/workspace/jenkins-react-app/build/"
            }
        }
    }

    post {
        always {
            // Print the Jenkins workspace contents for troubleshooting
            sh "ls -la /var/lib/jenkins/workspace/"
        }
    }
}
