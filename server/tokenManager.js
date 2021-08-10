const JSRSASign = require('jsrsasign');

const GenerateJWT = (header, claims, key) => {
    //Convert everything into strings
    let sHeader = JSON.stringify(header);
    let sPayload = JSON.stringify(claims);
    // Generate the JWT and return it to the caller
    const sJWT = JSRSASign.jws.JWS.sign("HS512", sHeader, sPayload, key);
    return sJWT;
};

const DecodeJWT = sJWT => {
    //Get the untrusted header and claim strings
    const aJWT = sJWT.split(".");
    const uHeader = JSRSASign.b64utos(aJWT[0]);
    const uClaim = JSRSASign.b64utos(aJWT[1]);

    //Get the actual header and claim text
    const pHeader = JSRSASign.jws.JWS.readSafeJSONString(uHeader);
    const pClaim = JSRSASign.jws.JWS.readSafeJSONString(uClaim);
    return pClaim;
};

const ValidateJWT = (header, token, key) => {
    return JSRSASign.jws.JWS.verifyJWT(token, key, header);
};

module.exports = {
    GenerateJWT,
    DecodeJWT,
    ValidateJWT,
};