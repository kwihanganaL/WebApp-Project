
pipeline {
    agent any

    tools {
        nodejs 'NodeJS20'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out WebApp Project'

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
                sh 'docker build -t webapp:1.0 .'
            }
        }

        stage('Deploy with Docker') {
            steps {
                sh '''
                    docker stop webapp-container || true
                    docker rm webapp-container || true

                    docker run -d \
                        --name webapp-container \
                        -p 3000:3000 \
                        webapp:1.0
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
            echo 'WebApp Project deployed successfully using Docker!'
        }

        failure {
            echo 'Pipeline failed. Check the console output.'
        }
    }
}
