package com.faldren.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import java.nio.charset.StandardCharsets;
import java.time.Duration;


@Service
public class BrevoEmailClient {

    private static final String BREVO_API_URL =
            "https://api.brevo.com/v3/smtp/email";


    private final HttpClient httpClient;


    @Value("${app.brevo.api-key}")
    private String apiKey;


    public BrevoEmailClient() {

        this.httpClient =
                HttpClient.newBuilder()
                        .connectTimeout(
                                Duration.ofSeconds(15)
                        )
                        .build();
    }


    public void sendEmail(
            String senderName,
            String senderEmail,
            String recipientEmail,
            String subject,
            String textContent
    ) {

        try {

            String json =
                    "{"
                    + "\"sender\":{"
                    + "\"name\":\""
                    + escapeJson(senderName)
                    + "\","
                    + "\"email\":\""
                    + escapeJson(senderEmail)
                    + "\""
                    + "},"

                    + "\"to\":[{"
                    + "\"email\":\""
                    + escapeJson(recipientEmail)
                    + "\""
                    + "}],"

                    + "\"subject\":\""
                    + escapeJson(subject)
                    + "\","

                    + "\"textContent\":\""
                    + escapeJson(textContent)
                    + "\""

                    + "}";


            HttpRequest request =
                    HttpRequest
                            .newBuilder()
                            .uri(
                                    URI.create(
                                            BREVO_API_URL
                                    )
                            )
                            .timeout(
                                    Duration.ofSeconds(30)
                            )
                            .header(
                                    "accept",
                                    "application/json"
                            )
                            .header(
                                    "api-key",
                                    apiKey
                            )
                            .header(
                                    "content-type",
                                    "application/json"
                            )
                            .POST(
                                    HttpRequest
                                            .BodyPublishers
                                            .ofString(
                                                    json,
                                                    StandardCharsets.UTF_8
                                            )
                            )
                            .build();


            HttpResponse<String> response =
                    httpClient.send(
                            request,
                            HttpResponse
                                    .BodyHandlers
                                    .ofString()
                    );


            if (
                    response.statusCode() < 200 ||
                    response.statusCode() >= 300
            ) {

                System.err.println(
                        "Brevo API error: "
                                + response.statusCode()
                                + " - "
                                + response.body()
                );

                throw new RuntimeException(
                        "Brevo API returned status "
                                + response.statusCode()
                );
            }


            System.out.println(
                    "Brevo email sent successfully to: "
                            + recipientEmail
            );


        } catch (Exception exception) {

            System.err.println(
                    "Brevo email sending failed: "
                            + exception.getMessage()
            );

            throw new RuntimeException(
                    "Unable to send email through Brevo.",
                    exception
            );
        }
    }


    private String escapeJson(
            String value
    ) {

        if (value == null) {
            return "";
        }


        return value
                .replace(
                        "\\",
                        "\\\\"
                )
                .replace(
                        "\"",
                        "\\\""
                )
                .replace(
                        "\r",
                        "\\r"
                )
                .replace(
                        "\n",
                        "\\n"
                )
                .replace(
                        "\t",
                        "\\t"
                );
    }
}