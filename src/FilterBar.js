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
import { Space, ComponentsProvider, Text, Chip, SpaceVertical, Heading, Button } from '@looker/components'
import { ExtensionContext } from '@looker/extension-sdk-react'
import { content } from './StaticContent';
import { startCase, find, lowerCase } from 'lodash'
export const FilterBar = ({ executeQuery, queryStatus }) => {
  const { queryBody,
    dynamicFieldsDimensions,
    dynamicFieldMeasureTemplate,
    dynamicFieldsMeasuresFilterExpressions,
    initialMeasures, initialDimensions, initialCustomFields } = content;
  let measuresArr = [];
  let dimensionsArr = [];
  let customFieldsArr = [];

  initialMeasures.map((measure, index) => {
    let label = startCase(measure.substring(measure.lastIndexOf('.') + 1, measure.length).replaceAll("_", " "))
    measuresArr.push({
      key: measure,
      label: label,
      selected: index === 0 ? true : false
    })
  })
  initialDimensions.map((dimension, index) => {
    let label = startCase(dimension.substring(dimension.lastIndexOf('.') + 1, dimension.length).replaceAll("_", " "))
    dimensionsArr.push({
      key: dimension,
      label: label,
      selected: index === 0 ? true : false
    })
  })
  initialCustomFields.map((customField, index) => {
    let label = startCase(customField.substring(customField.lastIndexOf('.') + 1, customField.length).replaceAll("_", " "))
    customFieldsArr.push({
      key: customField,
      label: label,
      selected: index === 0 ? true : false
    })
  })

  const [measures, setMeasures] = useState(measuresArr)
  const [dimensions, setDimensions] = useState(dimensionsArr);
  const [customFields, setCustomFields] = useState(customFieldsArr);
  const measuresHelper = (target, e) => {
    var newMeasuresArr = measures.map((measure) => {
      return target.label === measure.label ? { ...target, selected: !target.selected } : { ...measure, selected: false };
    });
    setMeasures(newMeasuresArr)
  }
  const dimensionsHelper = (target, e) => {
    var newDimensionsArr = dimensions.map((dimension) => {
      return target.label === dimension.label ? { ...target, selected: !target.selected } : dimension; //allow more than one to be selected
    });
    setDimensions(newDimensionsArr)
  }
  const customFieldsHelper = (target, e) => {
    var newCustomFieldsArr = customFields.map((customField) => {
      return target.label === customField.label ? { ...target, selected: !target.selected } : { ...customField, selected: false };
    });
    setCustomFields(newCustomFieldsArr)
  }

  const runQueryHelper = () => {
    let queryCopy = assembleQuery();
    executeQuery({ newQuery: queryCopy, resultFormat: content.resultFormat || "json" })
  }

  const assembleQuery = () => {

    let queryCopy = { ...queryBody };

    let selectedDimensions = dimensions.map(dimension => {
      if (dimension.selected) return dimension.key
    }).filter(item => item !== undefined)
    let selectedMeasures = measures.map(measure => {
      if (measure.selected) return measure.key
    }).filter(item => item !== undefined)
    let selectedCustomFields = customFields.map(customField => {
      if (customField.selected) return customField.key
    }).filter(item => item !== undefined)


    let selectedDynamicFieldsDimensions = []
    selectedCustomFields.map(scf => {
      selectedDynamicFieldsDimensions.push(dynamicFieldsDimensions[scf])
      if (scf === "this_year") selectedDynamicFieldsDimensions.push(dynamicFieldsDimensions["last_year"])
      else if (scf === "this_month") selectedDynamicFieldsDimensions.push(dynamicFieldsDimensions["last_month"])
    })

    let dynamicFieldsMeasures = [];
    let measureArrForSelectedFields = [];
    selectedDynamicFieldsDimensions.map(sdfd => {
      selectedMeasures.map(sm => {
        let measure = lowerCase(sdfd.label).split(" ").join("_")
        measure += "_"
        measure += sm.substring(sm.lastIndexOf('.') + 1, sm.length);
        measureArrForSelectedFields.push(measure)

        let label = startCase(sdfd.label + " " + sm.substring(sm.lastIndexOf('.') + 1, sm.length).replaceAll("_", " "))

        let copy = { ...dynamicFieldMeasureTemplate }
        copy.measure = measure;
        copy.based_on = sm;
        copy.type = "count_distinct";
        copy.label = label;
        copy.value_format = null;
        copy.value_format_name = null;
        copy._kind_hint = "measure"
        copy._type_hint = "number"
        copy.filter_expression = dynamicFieldsMeasuresFilterExpressions[sdfd.dimension]
        dynamicFieldsMeasures.push(copy)
      })
    })

    let selectedFields = [...selectedDimensions, ...measureArrForSelectedFields]
    queryCopy.fields = selectedFields;

    let dynamicFields = [...dynamicFieldsMeasures, ...selectedDynamicFieldsDimensions];
    queryCopy.dynamic_fields = JSON.stringify(dynamicFields);
    return queryCopy;
  }

  // onload
  useEffect(() => {
    if (queryStatus === undefined) {
      let queryCopy = assembleQuery();
      executeQuery({ newQuery: queryCopy, resultFormat: content.resultFormat || "json" })
    }
  }, [])

  return (
    <>
      <SpaceVertical m="large">
        <Heading>Breakdown:</Heading>
        <Space gap="u1">
          {dimensions.map((dimension, index) => {
            return (
              <Chip key={dimension.key}
                selected={dimension.selected}
                onClick={(e) => dimensionsHelper(dimension, e)}
                style={{ opacity: dimension.selected ? 1 : .25 }}>{dimension.label}</Chip>
            )
          })}
        </Space>
      </SpaceVertical>

      <SpaceVertical m="large">
        <Heading>Period:</Heading>
        <Space gap="u1">
          {customFields.map((customField, index) => {
            return (
              <Chip key={customField.key}
                selected={customField.selected}
                onClick={(e) => customFieldsHelper(customField, e)}
                style={{ opacity: customField.selected ? 1 : .25 }}>{customField.label}</Chip>
            )
          })}
        </Space>
      </SpaceVertical>


      <SpaceVertical m="large">
        <Heading>Metrics:</Heading>
        <Space gap="u1">
          {measures.map((measure, index) => {
            return (
              <Chip key={measure.key}
                selected={measure.selected}
                onClick={(e) => measuresHelper(measure, e)}
                style={{ opacity: measure.selected ? 1 : .25 }}>{measure.label}</Chip>
            )
          })}
        </Space>
      </SpaceVertical>


      <SpaceVertical m="large">
        <Button onClick={runQueryHelper} disabled={queryStatus === 'running' ? true : false}>Submit</Button>
      </SpaceVertical>
    </>
  )
}
