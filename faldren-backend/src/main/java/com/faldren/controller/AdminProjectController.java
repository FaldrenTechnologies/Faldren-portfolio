package com.faldren.controller;

import com.faldren.service.AdminProjectDeleteService;
import com.faldren.service.ProjectRequestService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/admin/projects")
public class AdminProjectController {

    private final ProjectRequestService
            projectRequestService;

    private final AdminProjectDeleteService
            adminProjectDeleteService;


    public AdminProjectController(
            ProjectRequestService projectRequestService,
            AdminProjectDeleteService adminProjectDeleteService
    ) {

        this.projectRequestService =
                projectRequestService;

        this.adminProjectDeleteService =
                adminProjectDeleteService;
    }


    // ==========================================
    // GET ALL PROJECTS
    // ==========================================

    @GetMapping
    public ResponseEntity<?>
    getAllProjects() {

        return ResponseEntity.ok(
                projectRequestService
                        .getAllProjects()
        );
    }


    // ==========================================
    // DELETE PROJECT
    // ==========================================

    @DeleteMapping("/{projectId}")
    public ResponseEntity<?>
    deleteProject(
            @PathVariable Long projectId
    ) {

        try {

            adminProjectDeleteService
                    .deleteProject(
                            projectId
                    );


            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Project deleted successfully."
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