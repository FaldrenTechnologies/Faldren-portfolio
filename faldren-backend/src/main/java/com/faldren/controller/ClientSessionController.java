package com.faldren.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/client")
public class ClientSessionController {

    @GetMapping("/session")
    public ResponseEntity<?> validateClientSession(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                Map.of(
                        "authenticated", true,
                        "email", authentication.getName(),
                        "role", "CLIENT"
                )
        );
    }
}