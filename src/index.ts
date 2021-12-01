import tomcat from "@gostarehnegar/tomcat"

import { SMA } from "./lib/SMA"
(async () => {

    const pipeline = new tomcat.Domain.Pipes.Pipeline()
    const time = 1638230400000
    let resCandle: tomcat.Domain.Base.CandleStickData = null
    const a = []
    pipeline.from('binance', 'spot', 'BTCUSDT', '1m', tomcat.utils.randomName('source'))
        .add(SMA(14, 400, '1m'))
        .add(async (candle) => {
            a.push(candle)
            if (candle.openTime == time) {
                resCandle = candle
                pipeline.stop()
            }
        })
    pipeline.start(tomcat.utils.toTimeEx(time).addMinutes(-500))
    await tomcat.utils.delay(60 * 1000)
    console.log(resCandle.indicators.getNumberValue(SMA(14, 200, '1m')))
})()