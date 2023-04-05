import React from "react";
import "./App.css";
import Button from "./components/Button/Button";

const App = () => {
    return (
        <div className='home'>
            <h1 className='header__title'>Smart Home Automation with web Interface</h1>

            <div className='main'>
                <div className='row'>
                    <Button />
                    <Button />
                </div>
                <div className='row'>
                    <Button />
                    <Button />
                </div>
            </div>
        </div>
    );
};

export default App;
