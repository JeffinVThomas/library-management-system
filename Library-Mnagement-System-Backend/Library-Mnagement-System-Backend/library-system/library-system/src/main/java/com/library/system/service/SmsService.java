package com.library.system.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String fromNumber;

    public void sendOtp(String to, String otp) {
        Twilio.init(accountSid, authToken);

        // ✅ Add country code if not present
        if (!to.startsWith("+")) {
            to = "+91" + to; // For Indian numbers, change if needed for other countries
        }

        Message.creator(
                new com.twilio.type.PhoneNumber(to),
                new com.twilio.type.PhoneNumber(fromNumber),
                "Your Library OTP is: " + otp
        ).create();

        System.out.println("Sent OTP to: " + to);
    }

}
