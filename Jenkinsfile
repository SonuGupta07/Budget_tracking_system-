pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Frontend Build') {
            steps {
                dir('budget-management-frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Backend Dependency Check') {
            steps {
                dir('budget-management-backend') {
                    sh 'pip3 install --break-system-packages -r requirements.txt'
                }
            }
        }

       stage('Docker Validation') {
            steps {
                sh 'docker --version'
                sh 'docker ps'
    }
}

    }
}