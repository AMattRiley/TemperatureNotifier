const fs = require("fs");

const deviceName = "28-0117b2112cff";

const getSensorPath = () => {
    const sensor_path = `/sys/bus/w1/devices/${deviceName}/w1_slave`;
    const mock_sensor_path = "src/server/sensorMock";

    try {
        fs.accessSync(sensor_path, fs.constants.F_OK | fs.constants.R_OK);
        return sensor_path;
    } catch (err) {
        console.log("Cannot access sensor file, using mock");
        return mock_sensor_path;
    }
};
const sensor_path = getSensorPath();

const getReading = async () => {
    try {
        return await readSensorHW();
    } catch (err) {
        console.log(err.message);
        return {};
    }
};

const readSensorHW = () => {
    return new Promise((resolve, reject) => {
        try {
            fs.readFile(sensor_path, { encoding: "utf8" }, (err, data) => {
                if (err) {
                    throw err;
                }
                if (!data) {
                    throw "No sensor data";
                }
                const lines = data.split("\n");
                if (lines.length < 2) {
                    throw `Invalid sensor data: ${data}`;
                }
                if (!lines[0].match(/ YES$/)) {
                    throw `Checksum error reading sensor ${name}`;
                }

                const temp_pattern = /t=-?\d*/;
                let temp_string = temp_pattern.exec(lines[1]);
                if (temp_string === null) {
                    throw `Parsing error reading sensor ${name}`;
                }
                temp_string = String(temp_string).substr(2);
                const celsius = parseFloat(temp_string) / 1000;

                const fahrenheit = celsius * 1.8 + 32;

                resolve({ celsius, fahrenheit });
            });
        } catch (err) {
            reject(err);
            return;
        }
    });
};

module.exports = {
    sensor_path,
    getReading
};