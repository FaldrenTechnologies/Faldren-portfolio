package com.faldren.controller;

import com.faldren.dto.AdminClientResponse;
import com.faldren.service.AdminClientService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/admin/clients")
public class AdminClientController {

    private final AdminClientService
            adminClientService;


    public AdminClientController(
            AdminClientService adminClientService
    ) {

        this.adminClientService =
                adminClientService;
    }


    // ==========================================
    // GET CLIENTS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<AdminClientResponse>>
    getAllClients() {

        return ResponseEntity.ok(
                adminClientService
                        .getAllClients()
        );
    }


    // ==========================================
    // DELETE CLIENT
    // ==========================================

    @DeleteMapping("/{clientId}")
    public ResponseEntity<?>
    deleteClient(
            @PathVariable
            Long clientId
    ) {

        try {

            adminClientService
                    .deleteClient(
                            clientId
                    );


            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Client deleted successfully."
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