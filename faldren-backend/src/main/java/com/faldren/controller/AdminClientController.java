package com.faldren.controller;

import com.faldren.dto.AdminClientResponse;
import com.faldren.entity.Role;
import com.faldren.entity.User;
import com.faldren.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/clients")
public class AdminClientController {

    private final UserRepository userRepository;


    public AdminClientController(
            UserRepository userRepository
    ) {
        this.userRepository =
                userRepository;
    }


    @GetMapping
    public ResponseEntity<List<AdminClientResponse>>
    getAllClients() {

        List<AdminClientResponse> clients =
                userRepository
                        .findByRole(Role.CLIENT)
                        .stream()
                        .map(this::toResponse)
                        .toList();


        return ResponseEntity.ok(
                clients
        );
    }


    private AdminClientResponse toResponse(
            User user
    ) {

        return new AdminClientResponse(

                user.getId(),

                user.getFullName(),

                user.getCompanyName(),

                user.getEmail(),

                user.getPhone(),

                user.getCreatedAt()
        );
    }
}