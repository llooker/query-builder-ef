export const content = {
  "queryBody": {
    "view": "order_items",
    "fields": ["users.country", "users.gender", "order_items.total_sale_price", "this_year", "this_month", "last_month"],
    "limit": "500",
    "dynamic_fields": "[{\"measure\":\"this_year\",\"based_on\":\"order_items.total_sale_price\",\"type\":\"count_distinct\",\"label\":\"This Year\",\"value_format\":null,\"value_format_name\":null,\"_kind_hint\":\"measure\",\"_type_hint\":\"number\",\"filter_expression\":\"${is_current_year} = yes\"},{\"measure\":\"this_month\",\"based_on\":\"order_items.total_sale_price\",\"type\":\"count_distinct\",\"label\":\"This Month\",\"value_format\":null,\"value_format_name\":null,\"_kind_hint\":\"measure\",\"_type_hint\":\"number\",\"filter_expression\":\"${is_current_month} = yes AND ${is_current_year} = yes\"},{\"measure\":\"last_month\",\"based_on\":\"order_items.total_sale_price\",\"type\":\"count_distinct\",\"label\":\"Last Month\",\"value_format\":null,\"value_format_name\":null,\"_kind_hint\":\"measure\",\"_type_hint\":\"number\",\"filter_expression\":\"${is_last_month} = yes\"},{\"dimension\":\"is_current_year\",\"label\":\"Is Current Year\",\"expression\":\"extract_years(${order_items.created_date}) = extract_years(now())\",\"value_format\":null,\"value_format_name\":null,\"_kind_hint\":\"dimension\",\"_type_hint\":\"yesno\"},{\"dimension\":\"is_current_month\",\"label\":\"Is Current Month\",\"expression\":\"extract_months(${order_items.created_date})\\t= extract_months(now())\",\"value_format\":null,\"value_format_name\":null,\"_kind_hint\":\"dimension\",\"_type_hint\":\"yesno\"},{\"dimension\":\"is_last_month\",\"label\":\"Is Last Month\",\"expression\":\"if(extract_months(now()) = 1, \\n  extract_months(${order_items.created_date})\\t= 12 AND extract_days(${order_items.created_date})\\t< extract_days(now())\\n  , \\nextract_months(${order_items.created_date})\\t= extract_months(now()) - 1 AND extract_days(${order_items.created_date})\\t< extract_days(now()))\\n\",\"value_format\":null,\"value_format_name\":null,\"_kind_hint\":\"dimension\",\"_type_hint\":\"yesno\"}]",
    "query_timezone": "America/Los_Angeles",
    "model": "atom_fashion",
  },
  "resultFormat": "json_detail",
  "fieldType": {
    "users.country": "dimension",
    "users.gender": "dimension",
    "order_items.total_sale_price": "measure",
    "this_year": "custom_field",
    "this_month": "custom_field",
    "last_month": "custom_field"
  },
  "customFieldMeasureDimensionMapper": {
    "this_month": "is_current_month",
    "last_month": "is_last_month",
    "this_year": "is_current_year",
  },
  "customFieldDimensionMeasureMapper": {
    "is_current_month": "this_month",
    "is_last_month": "last_month",
    "is_current_year": "this_year",
  },
  "dynamicFieldMeasureTemplate": {
    "measure": "this_year",
    "based_on": "order_items.total_sale_price",
    "type": "count_distinct",
    "label": "This Year",
    "value_format": null,
    "value_format_name": null,
    "_kind_hint": "measure",
    "_type_hint": "number",
    "filter_expression": "${is_current_year} = yes"
  },
  "dynamicFieldsDimensions": [{
    "dimension": "is_current_year",
    "label": "Is Current Year",
    "expression": "extract_years(${order_items.created_date}) = extract_years(now())",
    "value_format": null,
    "value_format_name": null,
    "_kind_hint": "dimension",
    "_type_hint": "yesno"
  }, {
    "dimension": "is_current_month",
    "label": "Is Current Month",
    "expression": "extract_months(${order_items.created_date})\t= extract_months(now())",
    "value_format": null,
    "value_format_name": null,
    "_kind_hint": "dimension",
    "_type_hint": "yesno"
  }, {
    "dimension": "is_last_month",
    "label": "Is Last Month",
    "expression": "if(extract_months(now()) = 1, \n  extract_months(${order_items.created_date})\t= 12 AND extract_days(${order_items.created_date})\t< extract_days(now())\n  , \nextract_months(${order_items.created_date})\t= extract_months(now()) - 1 AND extract_days(${order_items.created_date})\t< extract_days(now()))\n",
    "value_format": null,
    "value_format_name": null,
    "_kind_hint": "dimension",
    "_type_hint": "yesno"
  }],
  "dynamicFieldsMeasuresFilterExpressions": {
    "this_year": "${is_current_year} = yes",
    "this_month": "${is_current_month} = yes AND ${is_current_year} = yes",
    "last_month": "${is_last_month} = yes"
  }
}