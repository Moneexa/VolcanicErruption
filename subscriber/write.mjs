#!/usr/bin/env node
//////////////////////////////////////////
// Shows how to use InfluxDB write API. //
//////////////////////////////////////////

import { InfluxDB, Point, HttpError } from '@influxdata/influxdb-client'
import { url, token, org, bucket } from './env.mjs'
import { connect } from 'mqtt';

// const mqtt = require('mqtt')
const client = connect('mqtt://34.22.169.86')

console.log('*** WRITE POINTS ***')
// create a write API, expecting point timestamps in nanoseconds (can be also 's', 'ms', 'us')
const writeApi = new InfluxDB({ url, token }).getWriteApi(org, bucket, 'ns')
// setup default tags for all writes through this API

// write point with the current (client-side) timestamp
// const point1 = new Point('temperature')
//   .tag('example', 'write.ts')
//   .floatField('value', 20 + Math.round(100 * Math.random()) / 10)
// writeApi.writePoint(point1)
// console.log(` ${point1}`)
// write point with a custom timestamp


// WriteApi always buffer data into batches to optimize data transfer to InfluxDB server.
// writeApi.flush() can be called to flush the buffered data. The data is always written
// asynchronously, Moreover, a failed write (caused by a temporary networking or server failure)
// is retried automatically. Read `writeAdvanced.js` for better explanation and details.
//
// close() flushes the remaining buffered data and then cancels pending retries.
client.on('connect', function () {
  console.log("connected")
  client.subscribe('temperature-sensor', function (err) {
    if (err) {
      console.error(err)
    }
  })
  client.subscribe('gas-sensor', function (err) {
    if (err) {
      console.error(err);
    }
  })
  client.subscribe('sesmic-sensor', function (err) {
    if (err) {
      console.error(err);
    }
  })
  client.subscribe('GPS-sensor', function (err) {
    if (err) {
      console.error(err);
    }
  })
})

client.on('message', function (topic, message) {
  switch (topic) {
    case "gas-sensor":
      const data = JSON.parse(message.toString())

      const point1 = new Point(topic)
        .floatField('CO', data.CO)
        .floatField('CO2', data.CO2)
        .floatField('Ethane', data.Ethane)
        .floatField('NO2', data.NO2)
        .floatField('SO2', data.SO2)
      writeApi.writePoint(point1)
      break;
    case "temperature-sensor":
      const data11 = JSON.parse(message.toString())
      const point11= new Point(topic)
        .floatField('value', data11.temperature)
        writeApi.writePoint(point11)
      break;
    case "sesmic-sensor":
      const data2 = JSON.parse(message.toString())

      const point2 = new Point(topic)
        .floatField("Ground Deformation", data2["Ground Deformation"])
        .floatField('Gas concentrations', data2["Gas concentrations"])
        .floatField("Volcanic Tremour", data2["Volcanic Tremour"])
      writeApi.writePoint(point2)
      break;
      case "GPS-sensor":
        const data3 = JSON.parse(message.toString())
  
        const point3 = new Point(topic)
          .floatField("latitude", data3["latitude"])
          .floatField('longitude', data3["longitude"])
          .floatField("Elevation", data3["Elevation"])
          .floatField('velocity-n', data3["velocity-n"])
          .floatField('velocity-e', data3["velocity-e"])
          .floatField('velocity-u', data3["velocity-u"])
          .floatField('acceleration-n', data3["acceleration-n"])
          .floatField('acceleration-e', data3["acceleration-e"])
          .floatField('acceleration-u', data3["acceleration-u"]);
        writeApi.writePoint(point3)
        break;
    default:
      return
  }
  // message is Buffer
  // console.log(topic)
  //  const point1 = new Point(topic)
  //  .floatField('value', )
  //  writeApi.writePoint(point1)
  // console.log(` ${point1}`)


})

client.on('error', async function (topic, message) {
  // message is Buffer
  console.log(topic)
  client.end()
  try {
    await writeApi.close()
    console.log('FINISHED ... now try ./query.ts')
  } catch (e) {
    console.error(e)
    if (e instanceof HttpError && e.statusCode === 401) {
      console.log('Run ./onboarding.js to setup a new InfluxDB database.')
    }
    console.log('\nFinished ERROR')
  }
})
