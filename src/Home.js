/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2021 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import React, { useEffect, useState, useContext } from 'react'
import { Box, ComponentsProvider, Divider, SpaceVertical, Heading, ProgressCircular } from '@looker/components'
import { ExtensionContext } from '@looker/extension-sdk-react'
import { FilterBar } from './FilterBar'
import { FormattedTable } from './Table'
export const Home = () => {
  const { core40SDK } = useContext(ExtensionContext)
  const [message, setMessage] = useState()
  const [queryResults, setQueryResults] = useState(undefined)
  const [queryStatus, setQueryStatus] = useState(undefined)
  const [mostRecentExecutedQuery, setMostRecentExecutedQuery] = useState(undefined)

  // const initialQuery = {
  //   "model": "atom_fashion",
  //   "view": "order_items",
  //   "fields": ["order_items.created_month", "order_items.created_date", "order_items.created_week", "users.city", "users.state", "users.country", "products.category_type", "products.category", "products.brand", "order_items.total_sale_price", "order_items.total_tax_amount"],
  //   "filters": {
  //     "users.state": "",
  //     "users.city": "",
  //     "users.country": "",
  //     "order_items.created_date": "6 months"
  //   },
  //   "limit": 500
  // }

  // useEffect(() => {
  //   if (queryResults === undefined) {
  //     executeQuery({ newQuery: initialQuery, resultFormat: "json" })
  //   }
  // }, [])


  const executeQuery = async ({ newQuery, resultFormat }) => {
    try {
      setQueryStatus('running');
      setMostRecentExecutedQuery(JSON.stringify(newQuery))
      let timer = Date.now();

      let lookerCreateQueryResponseData = await core40SDK.ok(core40SDK.create_query(newQuery))
      let lookerCreateTaskResponseData = await core40SDK.ok(core40SDK.create_query_task({
        body: {
          query_id: lookerCreateQueryResponseData.id,
          result_format: resultFormat || 'json_detail'
        }
      }))

      let taskInterval = setInterval(async () => {
        let lookerCheckTaskResponseData = await core40SDK.ok(core40SDK.query_task_results(lookerCreateTaskResponseData.id, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }));
        if (lookerCheckTaskResponseData.status === 'complete') {
          clearInterval(taskInterval);
          setQueryStatus('complete')
          setQueryResults(lookerCheckTaskResponseData)
        }

        //time out after 30 seconds
        if ((timer + (30 * 1000)) < Date.now()) {
          clearInterval()
          setQueryResults(undefined)
          setQueryStatus(undefined)
        }
      }, 1000)
    } catch (error) {
      setMessage('Error occured executing query!')
      console.error(error)
    }
  }


  return (
    <>
      <ComponentsProvider>
        <Box>
          <FilterBar
            executeQuery={executeQuery}
            queryStatus={queryStatus}
          />
          <Divider />


          {queryStatus === undefined ?
            <SpaceVertical m="large"><Heading>Press submit to see results</Heading></SpaceVertical> :
            queryStatus === 'running' ?
              <SpaceVertical m="large"><Heading>Query executing!</Heading>
                <ProgressCircular />
              </SpaceVertical>
              : queryStatus === 'complete' && queryResults ? <FormattedTable queryResults={queryResults}></FormattedTable>
                : ""

          }

        </Box>
      </ComponentsProvider>
    </>
  )
}
