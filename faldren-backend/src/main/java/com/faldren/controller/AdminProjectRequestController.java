package com.faldren.controller;

import com.faldren.service.ProjectRequestService;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping(
        "/api/admin/project-requests"
)
public class AdminProjectRequestController {

    private final ProjectRequestService
            projectRequestService;


    public AdminProjectRequestController(
            ProjectRequestService projectRequestService
    ) {

        this.projectRequestService =
                projectRequestService;
    }



    @GetMapping
    public ResponseEntity<?>
            getAllRequests() {

        return ResponseEntity.ok(
                projectRequestService
                        .getAllRequests()
        );
    }



    @PatchMapping("/{id}/accept")
    public ResponseEntity<?>
            acceptRequest(
                    @PathVariable Long id
            ) {

        try {

            return ResponseEntity.ok(
                    projectRequestService
                            .acceptRequest(id)
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



    @PatchMapping("/{id}/reject")
    public ResponseEntity<?>
            rejectRequest(
                    @PathVariable Long id
            ) {

        try {

            return ResponseEntity.ok(
                    projectRequestService
                            .rejectRequest(id)
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