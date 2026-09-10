package com.faldren.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class EmailService {

    private final JavaMailSender mailSender;


    @Value("${spring.mail.username}")
    private String fromEmail;


    public EmailService(
            JavaMailSender mailSender
    ) {

        this.mailSender = mailSender;
    }


    public void sendOtp(
            String toEmail,
            String otp
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();


        message.setFrom(fromEmail);

        message.setTo(toEmail);

        message.setSubject(
                "Your FALDREN verification code"
        );


        message.setText(
                "Welcome to FALDREN.\n\n"
                + "Your verification code is:\n\n"
                + otp
                + "\n\nThis OTP is valid for 5 minutes."
                + "\n\nIf you did not request this code, "
                + "you can ignore this email."
                + "\n\n— FALDREN"
        );


        mailSender.send(message);
    }
}