package com.faldren.controller;

import com.faldren.dto.DeveloperLoginRequest;
import com.faldren.dto.DeveloperLoginResponse;

import com.faldren.service.DeveloperAuthService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.faldren.dto.DeveloperChangePasswordRequest;
import org.springframework.security.core.Authentication;
import java.util.Map;


@RestController
@RequestMapping("/api/developer/auth")
public class DeveloperAuthController {

    private final DeveloperAuthService
            developerAuthService;


    public DeveloperAuthController(
            DeveloperAuthService developerAuthService
    ) {

        this.developerAuthService =
                developerAuthService;
    }


    // ==========================================
    // LOGIN
    // ==========================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid
            @RequestBody
            DeveloperLoginRequest request
    ) {

        try {

            DeveloperLoginResponse response =
                    developerAuthService
                            .login(request);


            return ResponseEntity
                    .ok(response);


        } catch (
                RuntimeException exception
        ) {

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

    @PutMapping("/change-password")
public ResponseEntity<?> changePassword(
        Authentication authentication,
        @Valid
        @RequestBody
        DeveloperChangePasswordRequest request
) {

    try {

        developerAuthService
                .changePassword(
                        authentication.getName(),
                        request
                );


        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Password changed successfully"
                )
        );


    } catch (
            RuntimeException exception
    ) {

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
}