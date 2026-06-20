pipeline {
    agent any

    stages {

        stage('Environment Check') {
            steps {
                sh 'node --version || true'
                sh 'npm --version || true'
                sh 'python3 --version || true'
                sh 'pip3 --version || true'
            }
        }
    }
}