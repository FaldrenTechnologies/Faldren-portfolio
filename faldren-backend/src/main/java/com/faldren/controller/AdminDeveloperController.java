package com.faldren.controller;

import com.faldren.dto.AdminCreateDeveloperRequest;
import com.faldren.dto.AdminDeveloperResponse;

import com.faldren.service.AdminDeveloperService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/admin/developers")
public class AdminDeveloperController {

    private final AdminDeveloperService
            adminDeveloperService;


    public AdminDeveloperController(
            AdminDeveloperService adminDeveloperService
    ) {

        this.adminDeveloperService =
                adminDeveloperService;
    }



    // ==========================================
    // GET ALL DEVELOPERS
    // ==========================================

    @GetMapping
    public ResponseEntity<
            List<AdminDeveloperResponse>
            > getAllDevelopers() {

        return ResponseEntity.ok(
                adminDeveloperService
                        .getAllDevelopers()
        );
    }



    // ==========================================
    // CREATE DEVELOPER
    // ==========================================

    @PostMapping
    public ResponseEntity<?> createDeveloper(
            @RequestBody
            AdminCreateDeveloperRequest request
    ) {

        try {

            AdminDeveloperResponse developer =
                    adminDeveloperService
                            .createDeveloper(
                                    request
                            );


            return ResponseEntity
                    .status(
                            HttpStatus.CREATED
                    )
                    .body(
                            developer
                    );


        } catch (
                IllegalArgumentException exception
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