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
stage('Deploy Backend') {
    steps {
        sh 'docker stop budgetpro-backend || true'
        sh 'docker rm budgetpro-backend || true'
        sh 'docker run -d --name budgetpro-backend -p 8000:8000 budget-backend:latest'
    }
}

stage('Deploy Frontend') {
    steps {
        sh 'docker stop budgetpro-frontend || true'
        sh 'docker rm budgetpro-frontend || true'
        sh 'docker run -d --name budgetpro-frontend -p 5173:80 budget-frontend:latest'
    }
}
}

    }
