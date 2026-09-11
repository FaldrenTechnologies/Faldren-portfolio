package com.faldren.controller;

import com.faldren.entity.Role;
import com.faldren.entity.User;
import com.faldren.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/developer")
public class DeveloperSessionController {

    private final UserRepository userRepository;


    public DeveloperSessionController(
            UserRepository userRepository
    ) {

        this.userRepository =
                userRepository;
    }


    // ==========================================
    // VALIDATE DEVELOPER SESSION
    // ==========================================

    @GetMapping("/session")
    public ResponseEntity<?> validateSession(
            Authentication authentication
    ) {

        User developer =
                userRepository
                        .findByEmail(
                                authentication
                                        .getName()
                                        .trim()
                                        .toLowerCase()
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Developer not found"
                                        )
                        );


        if (
                developer.getRole()
                        != Role.DEVELOPER
        ) {

            return ResponseEntity
                    .status(403)
                    .body(
                            Map.of(
                                    "message",
                                    "Developer access denied"
                            )
                    );
        }


        if (!developer.isActive()) {

            return ResponseEntity
                    .status(403)
                    .body(
                            Map.of(
                                    "message",
                                    "Developer account is disabled"
                            )
                    );
        }


        return ResponseEntity.ok(
                Map.of(
                        "authenticated", true,
                        "id", developer.getId(),
                        "fullName", developer.getFullName(),
                        "email", developer.getEmail(),
                        "role", developer.getRole().name(),
                        "mustChangePassword",
                        developer.isMustChangePassword()
                )
        );
    }
}