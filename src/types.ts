import * as ui from '@grafana/schema'

export interface Options extends ui.OptionsWithLegend, ui.OptionsWithTooltip, ui.OptionsWithTimezones {
  colWidth?: number
  rowHeight: number
  showValue: ui.VisibilityMode
}

export const defaultOptions: Partial<Options> = {
  colWidth: 0.9,
  rowHeight: 0.9,
  showValue: ui.VisibilityMode.Auto,
}

export interface FieldConfig extends ui.HideableFieldConfig {
  fillOpacity?: number
  lineWidth?: number
}

export const defaultFieldConfig: Partial<FieldConfig> = {
  fillOpacity: 70,
  lineWidth: 1,
}
