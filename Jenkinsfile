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

     stage('Build Backend Image') {
    steps {
        dir('budget-management-backend') {
            sh 'docker build -t budget-backend:latest .'
        }
    }
}

stage('Build Frontend Image') {
    steps {
        dir('budget-management-frontend') {
            sh 'docker build -t budget-frontend:latest .'
        }
    }
}
}

    }
