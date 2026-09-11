package com.faldren.controller;

import com.faldren.dto.AdminRequestChangesRequest;
import com.faldren.dto.AdminReviewModuleResponse;

import com.faldren.service.AdminModuleReviewService;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/admin/module-reviews")
public class AdminModuleReviewController {

    private final AdminModuleReviewService
            adminModuleReviewService;


    public AdminModuleReviewController(
            AdminModuleReviewService adminModuleReviewService
    ) {

        this.adminModuleReviewService =
                adminModuleReviewService;

    }


    // ==========================================
    // GET REVIEW QUEUE
    // ==========================================

    @GetMapping
    public ResponseEntity<?> getReviewQueue() {

        try {

            List<AdminReviewModuleResponse>
                    modules =
                    adminModuleReviewService
                            .getReviewQueue();


            return ResponseEntity.ok(
                    modules
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


    // ==========================================
    // APPROVE
    // ==========================================

    @PatchMapping("/{moduleId}/approve")
    public ResponseEntity<?> approveModule(

            @PathVariable
            Long moduleId

    ) {

        try {

            AdminReviewModuleResponse
                    response =
                    adminModuleReviewService
                            .approveModule(
                                    moduleId
                            );


            return ResponseEntity.ok(
                    response
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


    // ==========================================
    // REQUEST CHANGES
    // ==========================================

    @PatchMapping("/{moduleId}/request-changes")
    public ResponseEntity<?> requestChanges(

            @PathVariable
            Long moduleId,

            @RequestBody
            AdminRequestChangesRequest request

    ) {

        try {

            AdminReviewModuleResponse
                    response =
                    adminModuleReviewService
                            .requestChanges(
                                    moduleId,
                                    request
                            );


            return ResponseEntity.ok(
                    response
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