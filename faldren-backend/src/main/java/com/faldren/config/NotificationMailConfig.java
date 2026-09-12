package com.faldren.config;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;


@Configuration
public class NotificationMailConfig {


    @Bean(name = "notificationMailSender")
    public JavaMailSender notificationMailSender(

            @Value("${app.notification-mail.username}")
            String username,

            @Value("${app.notification-mail.password}")
            String password

    ) {


        JavaMailSenderImpl sender =
                new JavaMailSenderImpl();


        sender.setHost(
                "smtp.gmail.com"
        );


        sender.setPort(
                587
        );


        sender.setUsername(
                username
        );


        sender.setPassword(
                password
        );


        sender.setDefaultEncoding(
                "UTF-8"
        );


        Properties properties =
                sender.getJavaMailProperties();


        properties.put(
                "mail.smtp.auth",
                "true"
        );


        properties.put(
                "mail.smtp.starttls.enable",
                "true"
        );


        properties.put(
                "mail.smtp.starttls.required",
                "true"
        );


        properties.put(
                "mail.smtp.connectiontimeout",
                "5000"
        );


        properties.put(
                "mail.smtp.timeout",
                "5000"
        );


        properties.put(
                "mail.smtp.writetimeout",
                "5000"
        );


        return sender;
    }
}