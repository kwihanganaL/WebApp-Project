
pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out CODERWANDA project'

                git branch: 'main',
                    url: 'https://github.com/kwihanganaL/WebApp-Project.git'
            }
        }

        stage('Check Node.js') {
            steps {
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t webapp:1.0 .'
            }
        }

        stage('Run Docker Container') {
            steps {
                sh '''
                    docker rm -f webapp-container || true
                    docker run -d -p 8081:3000 \
                    --name webapp-container webapp:1.0
                '''
            }
        }
    }

    post {
        success {
            echo 'CODERWANDA application deployed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the console output.'
        }
    }
}
