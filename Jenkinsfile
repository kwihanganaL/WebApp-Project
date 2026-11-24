
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

        stage('Check Project Files') {
            steps {
                sh 'pwd'
                sh 'ls -la'
                sh 'find . -name package.json'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t coderwanda-app:latest .'
            }
        }

        stage('Run Docker Container') {
            steps {
                sh '''
                    docker stop coderwanda-container || true
                    docker rm coderwanda-container || true
                    docker run -d --name coderwanda-container -p 3000:3000 coderwanda-app:latest
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the console output.'
        }
    }
}
