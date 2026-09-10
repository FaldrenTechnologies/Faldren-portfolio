package com.faldren.controller;

import com.faldren.service.ProjectRequestService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/client/projects")
public class ClientProjectController {

    private final ProjectRequestService projectRequestService;


    public ClientProjectController(
            ProjectRequestService projectRequestService
    ) {
        this.projectRequestService =
                projectRequestService;
    }


    @GetMapping
    public ResponseEntity<?> getMyProjects(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                projectRequestService
                        .getClientProjects(
                                authentication.getName()
                        )
        );
    }
}