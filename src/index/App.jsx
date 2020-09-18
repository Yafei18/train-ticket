import React, { useCallback, useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './App.css';

import Header from "../common/Header";
import DepartDate from "./DepartDate";
import HighSpeed from "./HighSpeed";
import Journey from "./Journey";
import Submit from "./Submit";
import CitySelector from "../common/CitySelector";

import {
    showCitySelector,
    exchangeFromTo,
    hideCitySelector,
    fetchCityData,
    setSelectedCity
} from './actions';

function App(props) {
    const {
        from,
        to,
        dispatch,
        isCitySelectorVisible,
        cityData,
        isLoadingCityData
    } = props;
    const onBack = useCallback(() => {
      window.history.back();
    }, []);

    const cbs = useMemo(() => {
        return bindActionCreators({
            exchangeFromTo,
            showCitySelector
        }, dispatch);
    }, []);

    const citySelectorCbs = useMemo(() => {
       return bindActionCreators({
           onBack: hideCitySelector,
           fetchCityData,
           onSelect: setSelectedCity
       }, dispatch);
    }, []);

    return (
        <div>
            <div className="header-wrapper">
                <Header title="火车票" onBack={onBack}/>
            </div>
            <form className="form">
                <Journey
                    from={from}
                    to={to}
                    {...cbs}/>
                <DepartDate />
                <HighSpeed />
                <Submit />
            </form>
            <CitySelector
                show={isCitySelectorVisible}
                cityData={cityData}
                isLoading={isLoadingCityData}
                {...citySelectorCbs}
            />
        </div>
    );

}

export default connect(
    function mapStateToProps(state) {
        return state;
    },
    function mapDispatchToProps(dispatch) {
        return { dispatch };
    }
)(App);