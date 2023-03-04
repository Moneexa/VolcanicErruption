# MQTT Simulator

Easy-to-configure MQTT simulator written in [Python 3](https://www.python.org/) to simulate the sending of JSON objects from sensors or devices to a broker.

[Features](#features) •
[Getting Started](#getting-started) •
[Configuration](#configuration) •

![Simulator Running](images/simulator-running.gif)

## Features

- Small and easy-to-configure simulator for publishing data to a broker
- Configuration from a single JSON file
- Connection on pre-defined fixed topics
- Connection on multiple topics that have a variable id or items at the end
- Random variation of data generated according to configuration parameters

## Getting Started

#### Prerequisites

- [Python 3](https://www.python.org/) (with pip)

#### Installing Dependencies

To install all dependencies with a virtual environment:

```shell
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
```

#### Running

The default simulator settings can be changed in the `config/settings.json` file.

```shell
python3 mqtt-simulator/main.py
```

Runs the simulator according to the settings file.  
The terminal will show the simulator event log.

## Configuration

- The `config/settings.json` file has three main configuration parameters:

  ```json
  {
      "BROKER_URL": "mqtt.eclipse.org",
      "BROKER_PORT": 1883,
      "TOPICS": [
          ...
      ]
  }
  ```

  | Key           | Type            | Description                                            | Required |
  | ------------- | --------------- | ------------------------------------------------------ | -------- |
  | `BROKER_URL`  | string          | The broker URL where the data will be published        | yes      |
  | `BROKER_PORT` | number          | The port used by the broker                            | yes      |
  | `TOPICS`      | array\<Objects> | Specification of topics and how they will be published | yes      |

- The key **TOPICS** has a array of objects where each one has the format:

  ```json
  {
      "TYPE": "multiple",
      "PREFIX": "temperature",
      "RANGE_START": 1,
      "RANGE_END": 2,
      "TIME_INTERVAL": 25,
      "RETAIN_PROBABILITY": 0.5,
      "DATA": [
          ...
      ]
  }
  ```

- The key **DATA** inside TOPICS has a array of objects where each one has the format:

  ```json
  {
    "NAME": "temperature",
    "TYPE": "float",
    "MIN_VALUE": 30,
    "MAX_VALUE": 40,
    "MAX_STEP": 0.2
  }
  ```
