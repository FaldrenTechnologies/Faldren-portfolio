package com.faldren.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class NotificationEmailService {

    private final BrevoEmailClient
            brevoEmailClient;


    @Value("${app.brevo.notification-sender-email}")
    private String fromEmail;


    @Value("${app.brevo.notification-sender-name:FALDREN Technologies}")
    private String fromName;


    @Value("${app.admin.notification-email}")
    private String adminNotificationEmail;


    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;


    public NotificationEmailService(
            BrevoEmailClient brevoEmailClient
    ) {

        this.brevoEmailClient =
                brevoEmailClient;
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

        String company =
                companyName == null ||
                companyName.isBlank()

                        ? "Not provided"

                        : companyName;


        String subject =
                "New Client Message - "
                        + clientName;


        String content =
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
                        + "— FALDREN Technologies";


        try {

            brevoEmailClient.sendEmail(
                    fromName,
                    fromEmail,
                    adminNotificationEmail,
                    subject,
                    content
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

        String subject =
                "Welcome to FALDREN Technologies";


        String content =
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

                        + "— FALDREN Technologies";


        try {

            brevoEmailClient.sendEmail(
                    fromName,
                    fromEmail,
                    developerEmail,
                    subject,
                    content
            );


        } catch (Exception exception) {

            throw new RuntimeException(
                    "Unable to send developer credentials email.",
                    exception
            );
        }
    }


    // ==========================================
    // ADMIN REPLY -> CLIENT EMAIL
    // ==========================================

    public void sendAdminReplyNotification(

            String clientName,
            String clientEmail,
            String adminMessage

    ) {

        String subject =
                "New message from FALDREN";


        String content =
                "Hello "
                        + clientName
                        + ",\n\n"

                        + "You have received a new message "
                        + "from FALDREN Technologies.\n\n"

                        + "MESSAGE\n"
                        + "--------------------------------\n"

                        + adminMessage
                        + "\n\n"

                        + "Open your FALDREN Client Portal "
                        + "to continue the conversation:\n"

                        + frontendUrl
                        + "/client/dashboard"

                        + "\n\n"

                        + "If you are currently signed out, "
                        + "simply log in to view the complete "
                        + "conversation and reply."

                        + "\n\n— FALDREN Technologies";


        try {

            brevoEmailClient.sendEmail(
                    fromName,
                    fromEmail,
                    clientEmail,
                    subject,
                    content
            );


        } catch (Exception exception) {

            throw new RuntimeException(
                    "Unable to send client notification email.",
                    exception
            );
        }
    }


    // ==========================================
    // NEW PROJECT REQUEST -> ADMIN EMAIL
    // ==========================================

    public void sendNewProjectRequestNotification(

            String clientName,
            String clientEmail,
            String companyName,

            String projectName,
            String serviceType,
            String description,
            String requirements,
            String businessGoal,
            String budgetRange,
            String expectedDeadline

    ) {

        String company =
                companyName == null ||
                companyName.isBlank()

                        ? "Not provided"

                        : companyName;


        String subject =
                "New Project Request - "
                        + projectName;


        String content =
                "Hello FALDREN,\n\n"

                        + "A new project request has been "
                        + "submitted through the client portal.\n\n"

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

                        + "PROJECT DETAILS\n"
                        + "--------------------------------\n"

                        + "Project: "
                        + projectName
                        + "\n"

                        + "Service: "
                        + serviceType
                        + "\n"

                        + "Budget: "
                        + budgetRange
                        + "\n"

                        + "Expected Deadline: "
                        + expectedDeadline
                        + "\n\n"

                        + "DESCRIPTION\n"
                        + "--------------------------------\n"

                        + description
                        + "\n\n"

                        + "REQUIREMENTS\n"
                        + "--------------------------------\n"

                        + requirements
                        + "\n\n"

                        + "BUSINESS GOAL\n"
                        + "--------------------------------\n"

                        + businessGoal
                        + "\n\n"

                        + "Review Project Request:\n"

                        + frontendUrl
                        + "/admin/requests"

                        + "\n\n"

                        + "— FALDREN Technologies";


        try {

            brevoEmailClient.sendEmail(
                    fromName,
                    fromEmail,
                    adminNotificationEmail,
                    subject,
                    content
            );


        } catch (Exception exception) {

            throw new RuntimeException(
                    "Unable to send project request notification email.",
                    exception
            );
        }
    }


    // ==========================================
    // TASK ASSIGNMENT -> DEVELOPER EMAIL
    // ==========================================

    public void sendTaskAssignmentNotification(

            String developerName,
            String developerEmail,

            String projectName,
            String moduleName,
            String description,

            String branchName,
            String priority,
            String deadline,
            String repoUrl

    ) {

        String safeDescription =
                description == null ||
                description.isBlank()

                        ? "No additional description provided."

                        : description;


        String safeDeadline =
                deadline == null ||
                deadline.isBlank()

                        ? "No deadline specified"

                        : deadline;


        String safeRepo =
                repoUrl == null ||
                repoUrl.isBlank()

                        ? "Not provided"

                        : repoUrl;


        String subject =
                "New Task Assigned - "
                        + moduleName;


        String content =
                "Hello "
                        + developerName
                        + ",\n\n"

                        + "A new development task has been "
                        + "assigned to you in FALDREN.\n\n"

                        + "TASK DETAILS\n"
                        + "--------------------------------\n"

                        + "Project: "
                        + projectName
                        + "\n"

                        + "Module: "
                        + moduleName
                        + "\n"

                        + "Priority: "
                        + priority
                        + "\n"

                        + "Deadline: "
                        + safeDeadline
                        + "\n"

                        + "Branch: "
                        + branchName
                        + "\n"

                        + "Repository: "
                        + safeRepo
                        + "\n\n"

                        + "DESCRIPTION\n"
                        + "--------------------------------\n"

                        + safeDescription
                        + "\n\n"

                        + "Open your assigned tasks:\n"

                        + frontendUrl
                        + "/developer/tasks"

                        + "\n\n"

                        + "Please review the task details "
                        + "before starting development."

                        + "\n\n"

                        + "— FALDREN Technologies";


        try {

            brevoEmailClient.sendEmail(
                    fromName,
                    fromEmail,
                    developerEmail,
                    subject,
                    content
            );


        } catch (Exception exception) {

            throw new RuntimeException(
                    "Unable to send task assignment email.",
                    exception
            );
        }
    }
}