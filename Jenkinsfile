pipeline {
     agent any
     stages {
        stage("Build") {
            steps {
                sh 'echo "techup" | sudo -S npm install'
                sh "sudo npm run build"
            }
        }
        stage("Deploy") {
            steps {
                sh "sudo rm -rf /var/www/jenkins-react-app"
                sh "sudo cp -r /var/lib/jenkins/workspace/jenkins-react-app/build/ /var/www/jenkins-react-app/"
            }
        }
    }
}