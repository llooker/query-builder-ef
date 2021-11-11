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

import React, { useState } from 'react'
import { startCase } from 'lodash'
import { Table, TableHead, TableRow, TableHeaderCell, TableBody, TableDataCell, TableFoot, Pagination } from '@looker/components'

export const FormattedTable = ({ queryResults }) => {
  const { data } = queryResults
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 25;
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const sliceStartValue = currentPage == 1 ? 0 : (currentPage - 1) * rowsPerPage;
  const sliceEndValue = currentPage == 1 ? 26 : (currentPage) * rowsPerPage + 1;
  const dataSubArray = data.slice(sliceStartValue, sliceEndValue)
  return (
    <Table>
      <FormattedTableHead data={data} />
      <FormattedTableBody data={dataSubArray} />
      <TablePagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
    </Table >
  )
}

const FormattedTableHead = ({ data }) => {
  return (

    <TableHead>
      <TableRow>
        {Object.keys(data[0]).map((key, index) => {
          let labelToUse = startCase(key.substring(key.lastIndexOf('.') + 1, key.length).replaceAll("_", " "))

          return (
            < TableHeaderCell key={`TableHeaderCell-${index}`}> {labelToUse}</TableHeaderCell>
          )
        })}
      </TableRow>
    </TableHead>
  )
}

const FormattedTableBody = ({ data }) => {
  return (
    <TableBody>
      {data.map((row, rowIndex) => {
        return (
          <TableRow key={`TableRow-${rowIndex}`}>
            {Object.keys(row).map((key, cellIndex) => {
              return (
                <TableDataCell key={`TableDataCell-${rowIndex}-${cellIndex}`} >
                  { parseInt(row[key].value) ? parseInt(row[key].value) : row[key].value}
                </TableDataCell>
              )
            })}
          </TableRow>
        )
      })}
    </TableBody >
  )
}

const TablePagination = ({ currentPage, setCurrentPage, totalPages }) => {
  return (
    <Pagination
      current={currentPage}
      pages={totalPages}
      onChange={setCurrentPage}
    />)
}
