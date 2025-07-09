package com.library.system.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for loading Twilio credentials from application.properties.
 * Provides access to account SID, auth token, and sender phone number.
 */
@Configuration
public class TwilioConfig {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String fromNumber;

    /**
     * Gets the Twilio Account SID.
     *
     * @return the account SID
     */
    public String getAccountSid() {
        return accountSid;
    }

    /**
     * Gets the Twilio Auth Token.
     *
     * @return the auth token
     */
    public String getAuthToken() {
        return authToken;
    }

    /**
     * Gets the Twilio sender phone number.
     *
     * @return the sender phone number
     */
    public String getFromNumber() {
        return fromNumber;
    }
}
