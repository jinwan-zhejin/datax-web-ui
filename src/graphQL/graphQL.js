import gql from 'graphql-tag'
import apolloClient from '../utils/graphql'

export function createConnection(params) { //建立连接
  return apolloClient.mutate({
    mutation: gql`mutation createConnection($config: ConnectionConfig!) {
      createConnection(config: $config) {
          id
          name
          description
          driverId
          connected
          readOnly
          features
          authNeeded
          authModel
      }
    },`,
    variables: params
  })
}

export function initConnection(params) { //初始化连接
  return apolloClient.mutate({
    mutation: gql` mutation initConnection($id: ID!, $credentials: Object) {
    connection: initConnection(id: $id, credentials: $credentials) {
        id
        name
        description
        driverId
        connected
        readOnly
        features
        authNeeded
        authModel
    }
}`,
    variables: params
  })
}

export function sqlContextCreate(params) { //创建上下文
  return apolloClient.mutate({
    mutation: gql` mutation sqlContextCreate($connectionId: ID!, $defaultCatalog: String, $defaultSchema: String) {
      context: sqlContextCreate(connectionId: $connectionId, defaultCatalog: $defaultCatalog, 	defaultSchema: $defaultSchema) {
      id
      defaultCatalog
      defaultSchema
    }
 }`,
    variables: params
  })
}

export function asyncSqlExecuteQuery(params) { //执行sql
  return apolloClient.mutate({
    mutation: gql` mutation asyncSqlExecuteQuery($connectionId: ID!, $contextId: ID!, $query: String!, $filter: SQLDataFilter) {
      taskInfo: asyncSqlExecuteQuery(connectionId: $connectionId, contextId: $contextId, sql: $query, filter: $filter) {
          id
          name
          running
          status
          error {
              message
              errorCode
              stackTrace
              }
      	taskResult
  	}
  }`,
    variables: params
  })
}

export function getAsyncTaskInfo(params) { //获取sql执行情况
  return apolloClient.mutate({
    mutation: gql` mutation getAsyncTaskInfo($taskId: String!, $removeOnFinish: Boolean!) {
      taskInfo: asyncTaskInfo(id: $taskId, removeOnFinish: $removeOnFinish) {
          id
          name
          running
          status
          error {
              message
              errorCode
              stackTrace
        }
        taskResult
    }
  }`,
    variables: params
  })
}


export function getSqlExecuteTaskResults(params) { //获取sql执行结果
  return apolloClient.mutate({
    mutation: gql` mutation getSqlExecuteTaskResults($taskId: ID!) {\n  result: asyncSqlExecuteResults(taskId: $taskId) {\n    duration\n    statusMessage\n    results {\n      updateRowCount\n      sourceQuery\n      title\n      resultSet {\n        id\n        columns {\n          dataKind\n          entityName\n          fullTypeName\n          icon\n          label\n          maxLength\n          name\n          position\n          precision\n          readOnly\n          scale\n          typeName\n        }\n        rows\n      }\n    }\n  }\n}\n`,
    variables: params
  })
}

