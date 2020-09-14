import gql from "graphql-tag";
import { apolloClient, requestGraphql } from "../utils/graphql";

export function createConnection(params) {
  //建立连接
  return requestGraphql(
    gql`
      mutation createConnection($config: ConnectionConfig!) {
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
      }
    `,
    params
  )
}

export function initConnection(params) {
  //初始化连接
  return requestGraphql(
    gql`
      mutation initConnection($id: ID!, $credentials: Object) {
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
      }
    `,
    params
  )
  
}

export function sqlContextCreate(params) {
  //创建上下文
  return requestGraphql(
    gql`
      mutation sqlContextCreate(
        $connectionId: ID!
        $defaultCatalog: String
        $defaultSchema: String
      ) {
        context: sqlContextCreate(
          connectionId: $connectionId
          defaultCatalog: $defaultCatalog
          defaultSchema: $defaultSchema
        ) {
          id
          defaultCatalog
          defaultSchema
        }
      }
    `,
    params
  )
}

export function asyncSqlExecuteQuery(params) {
  //执行sql
  return requestGraphql(
    gql`
      mutation asyncSqlExecuteQuery(
        $connectionId: ID!
        $contextId: ID!
        $query: String!
        $filter: SQLDataFilter
      ) {
        taskInfo: asyncSqlExecuteQuery(
          connectionId: $connectionId
          contextId: $contextId
          sql: $query
          filter: $filter
        ) {
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
      }
    `,
    params
  )
}

export function getAsyncTaskInfo(params) {
  //获取sql执行情况
  return requestGraphql(
    gql`
      mutation getAsyncTaskInfo($taskId: String!, $removeOnFinish: Boolean!) {
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
      }
    `,
    params
  );
}

export function getSqlExecuteTaskResults(params) {
  //获取sql执行结果
  return requestGraphql(
    gql`
      mutation getSqlExecuteTaskResults($taskId: ID!) {
        result: asyncSqlExecuteResults(taskId: $taskId) {
          duration
          statusMessage
          results {
            updateRowCount
            sourceQuery
            title
            resultSet {
              id
              columns {
                dataKind
                entityName
                fullTypeName
                icon
                label
                maxLength
                name
                position
                precision
                readOnly
                scale
                typeName
              }
              rows
            }
          }
        }
      }
    `,
    params
  );
}
