import { faCheck, faKey, faShieldAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function Security() {
    return (
        <div>
            <div
                style={{ padding: 8 }}
            >

                <div style={{ paddingBlock: 24 }}>
                    <div id="pass_text" className="w3-hide">
                        Password changed!
                    </div>
                    <div
                        id="auth_text"
                        className="w3-xlarge w3-big text-violet"
                    >
                        Authentication setting
                    </div>
                    <div
                        className={
                            "w3-round-xlarge content-bar bg-violet"
                        }
                    >
                        {" "}
                    </div>
                    <div className="w3-medium w3-text-grey w3-margin-top">
                        Pensez a changer regulierement votre mot de
                        passe des que vous trouveriez quelque chose
                        d'anormal
                    </div>
                </div>
                <form className="w3-block" id="cp_form">
                    <div style={{ paddingInline: 16 }}>
                        <div id="cpw_alert" className="w3-hide">
                            Something went wrong, please verify
                            your current password...
                        </div>
                    </div>
                    <div
                        className="w3-display-container"
                        style={{ paddingBlock: 0 }}
                    >
                        <input
                            // onChange={(e) => cpasswordRegister(e)}
                            type="password"
                            className="w3-border-0 w3-input input w3-light-grey w3-round-xxlarge w3-block w3-text-grey w3-medium"
                            placeholder="Current password"
                            id="cpassword"
                            name="user_cp"
                            required
                        />
                        <div
                            className="w3-black input-icon w3-display-right w3-circle w3-flex w3-flex-center"
                            style={{ marginRight: 3 }}
                        >
                            <span className="w3-text-white">
                                <FontAwesomeIcon icon={faKey} />
                            </span>
                        </div>
                    </div>
                    <div style={{ paddingInline: 16 }}>
                        <div style={{ paddingInline: 16 }}>
                            <div
                                id="npw_alert"
                                className="w3-hide"
                                style={{
                                    marginLeft: 8,
                                    marginTop: -8,
                                    marginBottom: -16,
                                }}
                            >
                                New password can't be less than 8
                                characters...
                            </div>
                        </div>
                    </div>
                    <div
                        className="w3-display-container w3-margin-top"
                        style={{ paddingBlock: 0 }}
                    >
                        <input
                            // onChange={(e) => npasswordRegister(e)}
                            type="password"
                            className="w3-border-0 w3-input input w3-light-grey w3-round-xxlarge w3-block w3-text-grey w3-medium"
                            placeholder="New Password"
                            id="npassword"
                            name="user_np"
                            required
                        />
                        <div
                            className="w3-black input-icon w3-display-right w3-circle w3-flex w3-flex-center"
                            style={{ marginRight: 3 }}
                        >
                            <span className="w3-text-white">
                                <FontAwesomeIcon
                                    icon={faShieldAlt}
                                />
                            </span>
                        </div>
                    </div>
                    <div style={{ paddingInline: 16 }}>
                        <div style={{ paddingInline: 16 }}>
                            <div
                                id="rpw_alert"
                                className="w3-hide"
                                style={{
                                    marginLeft: 8,
                                    marginTop: -8,
                                    marginBottom: -16,
                                }}
                            >
                                Password don't match...
                            </div>
                        </div>
                    </div>
                    <div
                        className="w3-display-container w3-margin-top"
                        style={{ paddingBlock: 0 }}
                    >
                        <input
                            // onChange={(e) => rpasswordRegister(e)}
                            type="password"
                            className="w3-border-0 w3-input input w3-light-grey w3-round-xxlarge w3-block w3-text-grey w3-medium"
                            placeholder="Retape password"
                            id="rpassword"
                            name="user_rp"
                            required
                        />
                        <div
                            className="w3-black input-icon w3-display-right w3-circle w3-flex w3-flex-center"
                            style={{ marginRight: 3 }}
                        >
                            <span className="w3-text-white">
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                        </div>
                    </div>
                    <div className="w3-center w3-white w3-flex w3-flex-center">
                        <div className="w3-margin">
                            <div
                                // onClick={() => updatePassword()}
                                className="transition w3-medium w3-button w3-round-xxlarge w3-text-white w3-black w3-margin-bottom"
                            >
                                Change password
                                <span
                                    className="w3-spin-flash w3-margin-left"
                                    style={{ display: "none" }}
                                    id="spinnerUpdate"
                                >
                                    <FontAwesomeIcon
                                        icon={faSpinner}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Security