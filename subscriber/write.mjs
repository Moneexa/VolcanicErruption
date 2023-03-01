#!/usr/bin/env node
//////////////////////////////////////////
// Shows how to use InfluxDB write API. //
//////////////////////////////////////////

import { InfluxDB, Point, HttpError } from "@influxdata/influxdb-client";
import { mqttURL, url, token, org, bucket } from "./env.mjs";
import { connect } from "mqtt";

// connecting to mqtt
const client = connect(mqttURL);

console.log("*** WRITE POINTS ***");
// create a write API, expecting point timestamps in nanoseconds (can be also 's', 'ms', 'us')
const writeApi = new InfluxDB({ url, token }).getWriteApi(org, bucket, "ns");
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
client.on("connect", function () {
  console.log("connected to MQTT");
  client.subscribe("temperature-sensor", function (error) {
    if (error) {
      console.error(error);
    }
  });
  client.subscribe("gas-sensor", function (error) {
    if (error) {
      console.error(error);
    }
  });
  client.subscribe("sesmic-sensor", function (error) {
    if (error) {
      console.error(error);
    }
  });
  client.subscribe("GPS-sensor", function (error) {
    if (error) {
      console.error(error);
    }
  });
});

client.on("message", function (topic, message) {
  console.log(new Date().toLocaleTimeString(), "Topic: ", topic);
  //get data from sensors
  const sensorData = JSON.parse(message.toString());
  const point = new Point(topic);
  Object.keys(sensorData).forEach((sensors) => {
    point.floatField(sensors, sensorData[sensors]);
  });
  writeApi.writePoint(point);
});

client.on("error", async function (topic) {
  // message is Buffer
  console.log(topic);
  client.end();
  try {
    await writeApi.close();
    console.log("FINISHED ... now try ./query.ts");
  } catch (e) {
    console.error(e);
    if (e instanceof HttpError && e.statusCode === 401) {
      console.log("Run ./onboarding.js to setup a new InfluxDB database.");
    }
    console.log("\nFinished ERROR");
  }
});
