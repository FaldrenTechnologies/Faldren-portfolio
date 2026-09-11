package com.faldren.controller;

import com.faldren.dto.AdminCreateModuleRequest;
import com.faldren.dto.AdminModuleResponse;
import com.faldren.service.AdminProjectModuleService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/admin/modules")
public class AdminProjectModuleController {

    private final AdminProjectModuleService
            adminProjectModuleService;


    public AdminProjectModuleController(
            AdminProjectModuleService adminProjectModuleService
    ) {
        this.adminProjectModuleService =
                adminProjectModuleService;
    }


    // ==========================================
    // CREATE MODULE
    // ==========================================

    @PostMapping
    public ResponseEntity<?> createModule(
            @RequestBody
            AdminCreateModuleRequest request
    ) {

        try {

            AdminModuleResponse response =
                    adminProjectModuleService
                            .createModule(request);


            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);


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


    // ==========================================
    // GET MODULES BY PROJECT
    // ==========================================

    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> getProjectModules(
            @PathVariable Long projectId
    ) {

        try {

            List<AdminModuleResponse> modules =
                    adminProjectModuleService
                            .getModulesByProject(
                                    projectId
                            );


            return ResponseEntity.ok(
                    modules
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