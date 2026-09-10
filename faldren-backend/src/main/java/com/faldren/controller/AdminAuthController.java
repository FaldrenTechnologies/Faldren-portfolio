package com.faldren.controller;

import com.faldren.dto.AdminLoginRequest;
import com.faldren.dto.AdminLoginResponse;

import com.faldren.service.AdminAuthService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

    private final AdminAuthService
            adminAuthService;


    public AdminAuthController(
            AdminAuthService adminAuthService
    ) {

        this.adminAuthService =
                adminAuthService;
    }


    @PostMapping("/login")
    public ResponseEntity<?>
            login(
                    @Valid
                    @RequestBody
                    AdminLoginRequest request
            ) {

        try {

            AdminLoginResponse response =
                    adminAuthService
                            .login(request);


            return ResponseEntity
                    .ok(response);

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