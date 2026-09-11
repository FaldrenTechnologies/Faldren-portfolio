package com.faldren.controller;

import com.faldren.dto.DeveloperModuleResponse;

import com.faldren.service.DeveloperModuleService;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/developer/modules")
public class DeveloperModuleController {

    private final DeveloperModuleService
            developerModuleService;


    public DeveloperModuleController(
            DeveloperModuleService developerModuleService
    ) {

        this.developerModuleService =
                developerModuleService;
    }


    // ==========================================
    // GET MY MODULES
    // ==========================================

    @GetMapping
    public ResponseEntity<?> getMyModules(
            Authentication authentication
    ) {

        try {

            List<DeveloperModuleResponse>
                    modules =
                    developerModuleService
                            .getMyModules(
                                    authentication
                                            .getName()
                            );


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
    // START WORK
    // ==========================================

    @PatchMapping("/{moduleId}/start")
    public ResponseEntity<?> startWork(
            @PathVariable Long moduleId,
            Authentication authentication
    ) {

        try {

            DeveloperModuleResponse response =
                    developerModuleService
                            .startWork(
                                    moduleId,
                                    authentication
                                            .getName()
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
// SUBMIT FOR REVIEW
// ==========================================

@PostMapping("/{moduleId}/submit-review")
public ResponseEntity<?> submitForReview(
        @PathVariable Long moduleId,
        @RequestBody
        com.faldren.dto.DeveloperSubmitReviewRequest request,
        Authentication authentication
) {

    try {

        DeveloperModuleResponse response =
                developerModuleService
                        .submitForReview(
                                moduleId,
                                authentication
                                        .getName(),
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