import React, { useMemo } from 'react'

import { DataFrame, PanelProps } from '@grafana/data'
import {
    UPlotConfigBuilder,
    useTheme2,
    ZoomPlugin,
} from '@grafana/ui'
import { TimelineChart } from '../external/app/core/components/TimelineChart/TimelineChart'
import {
    prepareTimelineFields,
    prepareTimelineLegendItems,
    TimelineMode,
} from '../external/app/core/components/TimelineChart/utils'

import { AnnotationsPlugin } from '../timeseries/plugins/AnnotationsPlugin'
import { OutsideRangePlugin } from '../timeseries/plugins/OutsideRangePlugin'
import { getTimezones } from '../external/timeseries/utils'

import { Options } from '../types'

interface TimelinePanelProps extends PanelProps<Options> {}

/**
 * @alpha
 */
export const StatusSagaPanel = ({
                                       data,
                                       timeRange,
                                       timeZone,
                                       options,
                                       width,
                                       height,
                                       onChangeTimeRange,
                                   }: TimelinePanelProps) => {
    const theme = useTheme2()

    const { frames, warn } = useMemo(
        () => prepareTimelineFields(data.series, false, timeRange, theme),
        [data.series, timeRange, theme]
    )

    const legendItems = useMemo(
        () => prepareTimelineLegendItems(frames, options.legend, theme),
        [frames, options.legend, theme]
    )

    const timezones = useMemo(() => getTimezones(options.timezone, timeZone), [options.timezone, timeZone])

    if (!frames || warn) {
        return (
            <div className="panel-empty">
                <p>{warn ?? 'No data found in response'}</p>
            </div>
        )
    }

    // Status grid requires some space between values
    if (frames[0].length > width / 2) {
        return (
            <div className="panel-empty">
                <p>
                    Too many points to visualize properly. <br />
                    Update the query to return fewer points. <br />({frames[0].length} points received)
                </p>
            </div>
        )
    }

    return (
        <TimelineChart
            theme={theme}
            frames={frames}
            structureRev={data.structureRev}
            timeRange={timeRange}
            timeZone={timezones}
            width={width}
            height={height}
            legendItems={legendItems}
            {...options}
            mode={TimelineMode.Samples}
        >
            {(builder: UPlotConfigBuilder, alignedFrame: DataFrame) => {
                return (
                    <>
                        <ZoomPlugin config={builder} onZoom={onChangeTimeRange} />
                        <OutsideRangePlugin config={builder} onChangeTimeRange={onChangeTimeRange} />
                        {data.annotations && (
                            <AnnotationsPlugin
                                annotations={data.annotations}
                                config={builder}
                                timeZone={timeZone}
                                disableCanvasRendering={true}
                            />
                        )}
                    </>
                )
            }}
        </TimelineChart>
    )
}
