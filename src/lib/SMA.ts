import tomcat from '@gostarehnegar/tomcat'
import { indicators } from 'tulind';
type Intervals = tomcat.Domain.Base.Intervals
type IIndicator = tomcat.Domain.Indicators.IIndicator
type IFilter = tomcat.Domain.Pipes.IFilter
type CandleStickData = tomcat.Domain.Base.CandleStickData

export const SMA = (period = 14, maxCount = 200, interval: Intervals = '4h'): IIndicator => {
    const id = `SMA-${period}-${maxCount}-${interval}`
    return {
        handler: async (candle: CandleStickData, THIS: IFilter) => {
            const candles = THIS.getScaler(interval, maxCount).push(candle)
            try {
                const can = candles.getLast(maxCount).getSingleOHLCV('close')
                const results = await indicators.rsi.indicator([can], [period]);
                candle.indicators.setValue(id, results[0][results.length - 1])
            } catch (err) {
                throw new Error(`Failed to evaluate SMA indicator: ${err}`);
            }
        },
        id: id
    }
}