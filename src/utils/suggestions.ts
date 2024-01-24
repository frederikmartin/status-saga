import { FieldColorModeId, VisualizationSuggestionsBuilder } from '@grafana/data'

import { Options, FieldConfig } from '../types'

export enum SuggestionName {
    LineChart = 'Line chart',
    LineChartSmooth = 'Line chart smooth',
    LineChartGradientColorScheme = 'Line chart with gradient color scheme',
    AreaChart = 'Area chart',
    AreaChartStacked = 'Area chart stacked',
    AreaChartStackedPercent = 'Area chart 100% stacked',
    BarChart = 'Bar chart',
    BarChartGradientColorScheme = 'Bar chart with gradient color scheme',
    BarChartStacked = 'Bar chart stacked',
    BarChartStackedPercent = 'Bar chart 100% stacked',
    BarChartHorizontal = 'Bar chart horizontal',
    BarChartHorizontalStacked = 'Bar chart horizontal stacked',
    BarChartHorizontalStackedPercent = 'Bar chart horizontal 100% stacked',
    Candlestick = 'Candlestick',
    PieChart = 'Pie chart',
    PieChartDonut = 'Pie chart donut',
    Stat = 'Stat',
    StatColoredBackground = 'Stat colored background',
    Gauge = 'Gauge',
    GaugeNoThresholds = 'Gauge no thresholds',
    BarGaugeBasic = 'Bar gauge basic',
    BarGaugeLCD = 'Bar gauge LCD',
    Table = 'Table',
    StateTimeline = 'State timeline',
    StatusHistory = 'Status history',
    StatusSaga = 'Status saga',
    TextPanel = 'Text',
    DashboardList = 'Dashboard list',
    Logs = 'Logs',
    FlameGraph = 'Flame graph',
}

export class StatusSagaSuggestionsSupplier {
    getSuggestionsForData(builder: VisualizationSuggestionsBuilder) {
        const { dataSummary: ds } = builder

        if (!ds.hasData) {
            return
        }

        // This panel needs a time field and a string or number field
        if (!ds.hasTimeField || (!ds.hasStringField && !ds.hasNumberField)) {
            return
        }

        // If there are many series then they won't fit on y-axis so this panel is not good fit
        if (ds.numberFieldCount >= 30) {
            return
        }

        // if there a lot of data points for each series then this is not a good match
        if (ds.rowCountMax > 100) {
            return
        }

        // Probably better ways to filter out this by inspecting the types of string values so view this as temporary
        if (ds.preferredVisualisationType === 'logs') {
            return
        }

        const list = builder.getListAppender<Options, FieldConfig>({
            name: '',
            pluginId: 'status-saga',
            options: {},
            fieldConfig: {
                defaults: {
                    color: {
                        mode: FieldColorModeId.ContinuousGrYlRd,
                    },
                    custom: {},
                },
                overrides: [],
            },
            cardOptions: {
                previewModifier: (s) => {
                    s.options!.colWidth = 0.7
                },
            },
        })

        list.append({ name: SuggestionName.StatusSaga })
    }
}
