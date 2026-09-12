package com.faldren.service;

import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import org.springframework.stereotype.Service;


@Service
public class NotificationEmailService {


    private final JavaMailSender
            notificationMailSender;


    @Value("${app.notification-mail.username}")
    private String fromEmail;


    @Value("${app.admin.notification-email}")
    private String adminNotificationEmail;


    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;



    public NotificationEmailService(

            @Qualifier("notificationMailSender")
            JavaMailSender notificationMailSender

    ) {

        this.notificationMailSender =
                notificationMailSender;
    }



    // ==========================================
    // CLIENT MESSAGE -> FALDREN
    // ==========================================

    public void sendClientMessageNotification(

            String clientName,
            String clientEmail,
            String companyName,
            String clientMessage

    ) {


        try {


            MimeMessage mimeMessage =
                    notificationMailSender
                            .createMimeMessage();


            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            mimeMessage,
                            false,
                            "UTF-8"
                    );


            helper.setFrom(
                    fromEmail,
                    "FALDREN Technologies"
            );


            helper.setTo(
                    adminNotificationEmail
            );


            helper.setSubject(

                    "New Client Message - "
                            + clientName

            );


            String company =
                    companyName == null ||
                    companyName.isBlank()

                            ? "Not provided"

                            : companyName;


            helper.setText(

                    "Hello FALDREN,\n\n"

                            + "A client has sent a new message "
                            + "through the FALDREN portal.\n\n"


                            + "CLIENT DETAILS\n"
                            + "--------------------------------\n"

                            + "Name: "
                            + clientName
                            + "\n"

                            + "Email: "
                            + clientEmail
                            + "\n"

                            + "Company: "
                            + company
                            + "\n\n"


                            + "MESSAGE\n"
                            + "--------------------------------\n"

                            + clientMessage
                            + "\n\n"


                            + "Open Admin Messages:\n"

                            + frontendUrl
                            + "/admin/messages"


                            + "\n\n"

                            + "— FALDREN Technologies"

            );


            notificationMailSender.send(
                    mimeMessage
            );


        } catch (Exception exception) {


            throw new RuntimeException(

                    "Unable to send FALDREN notification email.",

                    exception

            );

        }

    }



    // ==========================================
    // DEVELOPER CREDENTIALS
    // ==========================================

    public void sendDeveloperCredentials(

            String developerName,
            String developerEmail,
            String temporaryPassword

    ) {


        try {


            MimeMessage mimeMessage =
                    notificationMailSender
                            .createMimeMessage();


            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            mimeMessage,
                            false,
                            "UTF-8"
                    );


            helper.setFrom(
                    fromEmail,
                    "FALDREN Technologies"
            );


            helper.setTo(
                    developerEmail
            );


            helper.setSubject(
                    "Welcome to FALDREN Technologies"
            );


            helper.setText(

                    "Hello "
                            + developerName
                            + ",\n\n"


                            + "Welcome to FALDREN Technologies.\n\n"


                            + "You have been added as one of the "
                            + "developers of FALDREN.\n\n"


                            + "Your developer workspace account "
                            + "has been created successfully.\n\n"


                            + "LOGIN CREDENTIALS\n"
                            + "--------------------------------\n"

                            + "Email: "
                            + developerEmail
                            + "\n"

                            + "Temporary Password: "
                            + temporaryPassword
                            + "\n\n"


                            + "Developer Portal:\n"

                            + frontendUrl
                            + "/developer/login"
                            + "\n\n"


                            + "For security, you will be asked "
                            + "to create a new password when "
                            + "you sign in for the first time.\n\n"


                            + "Build with focus. Ship with clarity.\n\n"


                            + "— FALDREN Technologies"

            );


            notificationMailSender.send(
                    mimeMessage
            );


        } catch (Exception exception) {


            throw new RuntimeException(

                    "Unable to send developer credentials email.",

                    exception

            );

        }

    }
}