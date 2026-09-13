package com.faldren.controller;

import com.faldren.service.AdminDeveloperDeleteService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/admin/developers")
public class AdminDeveloperDeleteController {

    private final AdminDeveloperDeleteService
            adminDeveloperDeleteService;


    public AdminDeveloperDeleteController(
            AdminDeveloperDeleteService adminDeveloperDeleteService
    ) {

        this.adminDeveloperDeleteService =
                adminDeveloperDeleteService;
    }


    // ==========================================
    // DELETE DEVELOPER
    // ==========================================

    @DeleteMapping("/{developerId}")
    public ResponseEntity<?>
    deleteDeveloper(
            @PathVariable Long developerId
    ) {

        try {

            adminDeveloperDeleteService
                    .deleteDeveloper(
                            developerId
                    );


            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Developer deleted successfully."
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
}