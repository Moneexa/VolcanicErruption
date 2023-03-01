import * as dotenv from "dotenv";
if (!process.env["INFLUX_TOKEN"]) {
  dotenv.config();
}

const mqttURL = "mqtt://host.docker.internal";

/** InfluxDB v2 URL */
const url =
  process.env["INFLUX_URL"] ||
  "https://eu-central-1-1.aws.cloud2.influxdata.com";
/** InfluxDB authorization token */
const token = process.env["INFLUX_TOKEN"] || "";
/** Organization within InfluxDB  */
const org = process.env["INFLUX_ORG"] || "academic";
/**InfluxDB bucket used in examples  */
const bucket = "volcanicDB";

export { mqttURL, url, token, org, bucket };
