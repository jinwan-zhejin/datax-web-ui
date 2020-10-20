pipeline {
    agent any

    environment {
        HOST_TEST = 'root@121.41.16.183'
        HOST_ONLINE = ''
        SOURCE_DIR = 'dist/*'
        TARGET_DIR = ''
    }

    stages {
        stage('打包') {
            steps {
                // nodejs('nodejs-12.16') {
                //     echo '开始安装依赖'
                //     sh 'npm i'
                //     echo '开始打包'
                //     sh 'npm run build'
                // }
                echo 'Building'
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