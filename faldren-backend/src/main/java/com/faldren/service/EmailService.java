package com.faldren.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class EmailService {

    private final BrevoEmailClient
            brevoEmailClient;


    @Value("${app.brevo.otp-sender-email}")
    private String otpSenderEmail;


    @Value("${app.brevo.otp-sender-name:FALDREN OTP}")
    private String otpSenderName;


    public EmailService(
            BrevoEmailClient brevoEmailClient
    ) {

        this.brevoEmailClient =
                brevoEmailClient;
    }


    public void sendOtp(
            String toEmail,
            String otp
    ) {

        String subject =
                "Your FALDREN verification code";


        String content =
                "Welcome to FALDREN.\n\n"
                + "Your verification code is:\n\n"
                + otp
                + "\n\nThis OTP is valid for 5 minutes."
                + "\n\nIf you did not request this code, "
                + "you can ignore this email."
                + "\n\n— FALDREN";


        brevoEmailClient.sendEmail(
                otpSenderName,
                otpSenderEmail,
                toEmail,
                subject,
                content
        );
    }
}