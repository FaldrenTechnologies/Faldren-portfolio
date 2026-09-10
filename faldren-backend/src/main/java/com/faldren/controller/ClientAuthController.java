package com.faldren.controller;

import com.faldren.dto.ClientLoginRequest;
import com.faldren.dto.ClientLoginResponse;
import com.faldren.dto.ClientOtpResponse;
import com.faldren.dto.ClientSendOtpRequest;
import com.faldren.dto.ClientVerifyOtpRequest;

import com.faldren.entity.User;

import com.faldren.service.ClientAuthService;
import com.faldren.service.ClientRegistrationService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/client/auth")
public class ClientAuthController {

    private final ClientRegistrationService
            clientRegistrationService;

    private final ClientAuthService
            clientAuthService;


    public ClientAuthController(
            ClientRegistrationService clientRegistrationService,
            ClientAuthService clientAuthService
    ) {

        this.clientRegistrationService =
                clientRegistrationService;

        this.clientAuthService =
                clientAuthService;
    }


    // ==========================================
    // SEND OTP
    // ==========================================

    @PostMapping("/send-otp")
public ResponseEntity<?> sendOtp(
        @Valid
        @RequestBody ClientSendOtpRequest request
) {

    try {

        clientRegistrationService.sendOtp(
                request
        );

        return ResponseEntity.ok(
                new ClientOtpResponse(
                        "OTP sent successfully."
                )
        );

    } catch (RuntimeException exception) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                exception.getMessage()
                        )
                );
    }
}


    // ==========================================
    // VERIFY OTP + REGISTER
    // ==========================================

    @PostMapping("/verify-register")
    public ResponseEntity<?>
            verifyRegister(
                    @Valid
                    @RequestBody
                    ClientVerifyOtpRequest request
            ) {

        try {

            User user =
                    clientRegistrationService
                            .verifyAndRegister(
                                    request.email(),
                                    request.otp()
                            );


            return ResponseEntity.ok(

                    Map.of(
                            "message",
                            "Registration successful.",
                            "id",
                            user.getId(),
                            "email",
                            user.getEmail(),
                            "role",
                            user.getRole().name()
                    )

            );


        } catch (RuntimeException exception) {

            return ResponseEntity
                    .badRequest()
                    .body(

                            Map.of(
                                    "message",
                                    exception.getMessage()
                            )

                    );
        }
    }


    // ==========================================
    // CLIENT LOGIN
    // ==========================================

    @PostMapping("/login")
    public ResponseEntity<?>
            login(
                    @Valid
                    @RequestBody
                    ClientLoginRequest request
            ) {

        try {

            ClientLoginResponse response =
                    clientAuthService
                            .login(request);


            return ResponseEntity.ok(
                    response
            );


        } catch (RuntimeException exception) {

            return ResponseEntity
                    .status(401)
                    .body(

                            Map.of(
                                    "message",
                                    exception.getMessage()
                            )

                    );
        }
    }
}