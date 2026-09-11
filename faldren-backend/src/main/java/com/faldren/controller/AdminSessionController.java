package com.faldren.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminSessionController {

    @GetMapping("/session")
    public ResponseEntity<?> validateAdminSession(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                Map.of(
                        "authenticated", true,
                        "email", authentication.getName(),
                        "role", "ADMIN"
                )
        );
    }
}