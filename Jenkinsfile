pipeline {
    agent any

    // triggers {
        // GenericTrigger(
        // genericVariables: [
        // [key: 'ref', value: '$.ref']
        // ],
        // causeString: 'Triggered on $ref',
        // token: 'dataEdit-CI/CD-workflow',
        // tokenCredentialId: '',
        // printContributedVariables: true,
        // printPostContent: true,
        // silentResponse: false,
        // regexpFilterText: '$ref',
        // regexpFilterExpression: 'refs/heads/dev'
        // )
//   }

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}