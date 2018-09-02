import React, { Fragment } from "react";
import { Subscription } from "react-apollo";
import gql from "graphql-tag";
import moment from "moment";

import "./App.css";

const formatNumber = raw => raw.toFixed(1);
const TEMP_SUBSCRIPTION = gql`
    subscription tempUpdated {
        updatedTemp {
            externalTemperature {
                celsius
                fahrenheit
            }
            internalTemperature {
                celsius
                fahrenheit
            }
            timestamp
            fansAreOn
        }
    }
`;

const Temperature = ({ timestamp, celsius, fahrenheit, title }) => {
    return (
        <div>
            <h3>{title}</h3>
            <span>{`${moment(timestamp).format("H:mm:ss")}  --  ${formatNumber(
                celsius
            )} °C  --  ${formatNumber(fahrenheit)} °F`}</span>
        </div>
    );
};

const App = () => (
    <Subscription subscription={TEMP_SUBSCRIPTION}>
        {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;
            if (!data || !data.updatedTemp) return <p>Nothing to see yet!</p>;
            const {
                timestamp,
                internalTemperature = {},
                externalTemperature = {},
                fansAreOn
            } = data.updatedTemp;
            return (
                <Fragment>
                    <Temperature
                        title={"Internal Temperature"}
                        timestamp={timestamp}
                        celsius={internalTemperature.celsius}
                        fahrenheit={internalTemperature.fahrenheit}
                    />
                    <Temperature
                        title={"External Temperature"}
                        timestamp={timestamp}
                        celsius={externalTemperature.celsius}
                        fahrenheit={externalTemperature.fahrenheit}
                    />
                    <span>{`Fan On: ${fansAreOn ? "Yes" : "No"}`}</span>
                </Fragment>
            );
        }}
    </Subscription>
);

export default App;
