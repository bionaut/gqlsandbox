import React, {useState, VFC} from 'react'
import {gql, useMutation, useSubscription} from '@apollo/client'

const subDoc = gql`
  subscription {
    issueModified(elementId: "e6c49c19-ec97-4d35-9d0f-ca3f571a10a5") {
      sourceId
      etype
    }
  }
`

const mutationDoc = gql`
    mutation {
      modifyIssue(applicationId: 7, issueId: "e6c49c19-ec97-4d35-9d0f-ca3f571a10a5", issue: {name: "new name here"}) {
        id
        name
      }
    }
`

export const Sample: VFC = () => {
  const [state, setState] = useState<any[]>([])

  const [mutate, { loading }] = useMutation(mutationDoc)

  useSubscription(subDoc, {
    onSubscriptionData: (data) => {
      console.log(data)
      setState((s: any[]) => {
        return [...s, data]
      })
    }
  })



  return <div>
    <button onClick={() => mutate()} disabled={loading} >Send mutation</button>
    {JSON.stringify(state)}
  </div>
}
