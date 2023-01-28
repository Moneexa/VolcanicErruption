import * as dotenv from 'dotenv' 
dotenv.config();

/** InfluxDB v2 URL */
const url = process.env["INFLUX_URL"] || "https://eu-central-1-1.aws.cloud2.influxdata.com";
/** InfluxDB authorization token */
const token = process.env["INFLUX_TOKEN"] || "";
/** Organization within InfluxDB  */
const org = process.env["INFLUX_ORG"] || "academic";
/**InfluxDB bucket used in examples  */
const bucket = "volcanicDB";
// ONLY onboarding example
/**InfluxDB user  */
const username = process.env["INFLUX_USER"] || "";
/**InfluxDB password  */
const password = process.env["INFLUX_PASSWORD"] || "";

export { url, token, org, bucket, username, password };
