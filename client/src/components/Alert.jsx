import React from "react";

export default function Alert({ alertMessage, setDisplayMessage, setFailedJWTValidation }) {

    const changeDisplayStatus = () => {
        setDisplayMessage(false);
        setFailedJWTValidation(false);        
    }

    return (<div className="alert alert-warning alert-dismissible fade show" role="alert">
    <strong>{alertMessage.strong}</strong> {alertMessage.pTag}
    <button type="button" className="close" onClick={changeDisplayStatus} data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
    </div>);
}