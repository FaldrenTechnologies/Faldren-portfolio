package com.faldren.controller;

import com.faldren.dto.CreateProjectRequestRequest;
import com.faldren.service.ProjectRequestService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping(
        "/api/client/project-requests"
)
public class ClientProjectRequestController {

    private final ProjectRequestService
            projectRequestService;


    public ClientProjectRequestController(
            ProjectRequestService projectRequestService
    ) {

        this.projectRequestService =
                projectRequestService;
    }



    @PostMapping
    public ResponseEntity<?>
            createRequest(
                    Authentication authentication,

                    @Valid
                    @RequestBody
                    CreateProjectRequestRequest request
            ) {

        try {

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            projectRequestService
                                    .createRequest(
                                            authentication
                                                    .getName(),
                                            request
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



    @GetMapping
    public ResponseEntity<?>
            getMyRequests(
                    Authentication authentication
            ) {

        try {

            return ResponseEntity.ok(
                    projectRequestService
                            .getClientRequests(
                                    authentication
                                            .getName()
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