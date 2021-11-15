export const content = {
  "queryBody": {
    "view": "order_items",
    "limit": "500",
    "query_timezone": "America/Los_Angeles",
    "model": "atom_fashion",
  },
  "initialMeasures": ["order_items.total_sale_price", "order_items.total_returns", "order_items.total_tax_amount",],
  "initialDimensions": ["users.country", "users.state", "products.category", "products.sku", "users.gender",],
  "initialCustomFields": ["this_year", "this_month"],
  "resultFormat": "json_detail",
  "dynamicFieldsDimensions": {
    "this_month": {
      "dimension": "is_current_month",
      "label": "This Month",
      "expression": "extract_months(${order_items.created_date})\t= extract_months(now())",
      "value_format": null,
      "value_format_name": null,
      "_kind_hint": "dimension",
      "_type_hint": "yesno"
    },
    "last_month": {
      "dimension": "is_last_month",
      "label": "Last Month",
      "expression": "if(extract_months(now()) = 1, \n  extract_months(${order_items.created_date})\t= 12 AND extract_days(${order_items.created_date})\t< extract_days(now())\n  , \nextract_months(${order_items.created_date})\t= extract_months(now()) - 1 AND extract_days(${order_items.created_date})\t< extract_days(now()))\n",
      "value_format": null,
      "value_format_name": null,
      "_kind_hint": "dimension",
      "_type_hint": "yesno"
    },
    "this_year": {
      "dimension": "is_current_year",
      "label": "This Year",
      "expression": "extract_years(${order_items.created_date}) = extract_years(now())",
      "value_format": null,
      "value_format_name": null,
      "_kind_hint": "dimension",
      "_type_hint": "yesno"
    },
    "last_year": {
      "dimension": "is_last_year",
      "label": "Last Year",
      "expression": "extract_years(${order_items.created_date}) = extract_years(now()) - 1",
      "value_format": null,
      "value_format_name": null,
      "_kind_hint": "dimension",
      "_type_hint": "yesno"
    }
  },
  "dynamicFieldsMeasuresFilterExpressions": {
    "is_current_month": "${is_current_month} = yes", // AND ${is_current_year} = yes //for now
    "is_last_month": "${is_last_month} = yes",
    "is_current_year": "${is_current_year} = yes",
    "is_last_year": "${is_last_year} = yes"
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
  }
}