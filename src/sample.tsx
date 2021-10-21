import React, {useState, VFC} from 'react'
import {gql, useSubscription} from '@apollo/client'

const subDoc = gql`
  subscription {
    issueModified(elementId: "e6c49c19-ec97-4d35-9d0f-ca3f571a10a5") {
      sourceId
      etype
    }
  }
`

export const Sample: VFC = () => {
  const [state, setState] = useState<any[]>([])
  useSubscription(subDoc, {
    onSubscriptionData: (data) => {
      setState((s: any[]) => {
        return [...s, data]
      })
    }
  })

  return <div>
    {JSON.stringify(state)}
  </div>
}
