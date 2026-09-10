package com.faldren.controller;

import com.faldren.service.ProjectRequestService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/projects")
public class AdminProjectController {

    private final ProjectRequestService projectRequestService;


    public AdminProjectController(
            ProjectRequestService projectRequestService
    ) {
        this.projectRequestService =
                projectRequestService;
    }


    @GetMapping
    public ResponseEntity<?> getAllProjects() {

        return ResponseEntity.ok(
                projectRequestService
                        .getAllProjects()
        );
    }
}