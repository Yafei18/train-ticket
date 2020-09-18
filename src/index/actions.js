export const ACTION_SET_FROM = 'SET_FROM';
export const ACTION_SET_TO = 'SET_TO';
export const ACTION_SET_IS_CITY_SELECTOR_VISIBLE = 'SET_ IS_CITY_SELECTOR_VISIBLE';
export const ACTION_SET_CURRENT_SELECTING_LEFT_CITY = 'SET_CURRENT_SELECTING_LEFT_CITY';
export const ACTION_SET_CITY_DATA = 'SET_CITY_DATA';
export const ACTION_SET_IS_LOADING_CITY_DATA = 'SET_IS_LOADING_CITY_DATA';
export const ACTION_SET_IS_DATE_SELECTOR_VISIBLE = 'SET_IS_DATE_SELECTOR_VISIBLE';
export const ACTION_SET_HIGH_SPEED = 'SET_HIGH_SPEED';

export function setFrom(from) {
    return {
        type: ACTION_SET_FROM,
        payload: from
    };
}

export function setTo(to) {
    return {
        type: ACTION_SET_TO,
        payload: to
    };
}

export function setCityData(cityData) {
    return {
        type: ACTION_SET_CITY_DATA,
        payload: cityData
    };
}

export function setIsLoadingCityData(isLoadingCityData) {
    return {
        type: ACTION_SET_IS_LOADING_CITY_DATA,
        payload: isLoadingCityData
    };
}

// 需要根据当前的值来计算最新的值，需要用到异步action。
export function toggleHighSpeed() {
    return (dispatch, getState) => {
        const { highSpeed } = getState();
        dispatch({
            type: ACTION_SET_HIGH_SPEED,
            payload: !highSpeed
        });
    };
}

export function showCitySelector(currentSelectingLeftCity) {
    return (dispatch) => {
        dispatch({
            type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
            payload: true
        });

        dispatch({
            type: ACTION_SET_CURRENT_SELECTING_LEFT_CITY,
            payload: currentSelectingLeftCity
        });
    }
}

export function hideCitySelector() {
    return {
        type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
        payload: false
    };
}

export function setSelectedCity(city) {
    return (dispatch, getState) => {
        const { currentSelectingLeftCity } = getState();
        if (currentSelectingLeftCity) {
            dispatch(setFrom(city));
        } else {
            dispatch(setTo(city));
        }
        dispatch(hideCitySelector());
    };
}

export function showDateSelector() {
    return {
        type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
        payload: true,
    };
}

export function hideDateSelector() {
    return {
        type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
        payload: false
    };
}

export function exchangeFromTo() {
    return (dispatch, getState) => {
        const { from, to } = getState();
        dispatch(setFrom(to));
        dispatch(setTo(from));
    }
}

export function fetchCityData() {
    return ((dispatch, getState) => {
        const { isLoadingCityData } = getState();
        if (isLoadingCityData) return;

        dispatch(setIsLoadingCityData(true));

        const cache = JSON.parse(localStorage.getItem('city_data_cache'));
        if (Date.now() < cache.expires) {
            dispatch(setCityData(cache.data));
            return;
        }

        fetch('/rest/cities?_' + Date.now())
            .then(res => res.json())
            .then(cityData => {
                dispatch(setCityData(cityData));
                localStorage.setItem(
                    'city_data_cache',
                    JSON.stringify({
                        expires: Date.now() + 60 * 1000,
                        data: cityData
                    })
                );
                dispatch(setIsLoadingCityData(false));
            })
            .catch(() => {
                dispatch(setIsLoadingCityData(false));
            });
    });
}








