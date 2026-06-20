pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Check') {
            steps {
                dir('budget-management-backend') {
                    sh 'ls'
                }
            }
        }

        stage('Frontend Check') {
            steps {
                dir('budget-management-frontend') {
                    sh 'ls'
                }
            }
        }
    }
}