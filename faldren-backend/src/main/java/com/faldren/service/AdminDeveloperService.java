package com.faldren.service;

import com.faldren.dto.AdminCreateDeveloperRequest;
import com.faldren.dto.AdminDeveloperResponse;

import com.faldren.entity.Role;
import com.faldren.entity.User;

import com.faldren.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class AdminDeveloperService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final NotificationEmailService
            notificationEmailService;


    public AdminDeveloperService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            NotificationEmailService notificationEmailService
    ) {

        this.userRepository =
                userRepository;

        this.passwordEncoder =
                passwordEncoder;

        this.notificationEmailService =
                notificationEmailService;
    }


    // ==========================================
    // CREATE DEVELOPER
    // ==========================================

    public AdminDeveloperResponse createDeveloper(
            AdminCreateDeveloperRequest request
    ) {

        if (
                request.getFullName() == null ||
                request.getFullName()
                        .trim()
                        .isEmpty()
        ) {

            throw new IllegalArgumentException(
                    "Developer name is required."
            );
        }


        if (
                request.getEmail() == null ||
                request.getEmail()
                        .trim()
                        .isEmpty()
        ) {

            throw new IllegalArgumentException(
                    "Developer email is required."
            );
        }


        if (
                request.getPassword() == null ||
                request.getPassword()
                        .length() < 8
        ) {

            throw new IllegalArgumentException(
                    "Temporary password must contain at least 8 characters."
            );
        }


        String normalizedEmail =
                request
                        .getEmail()
                        .trim()
                        .toLowerCase();


        if (
                userRepository.existsByEmail(
                        normalizedEmail
                )
        ) {

            throw new IllegalArgumentException(
                    "An account already exists with this email."
            );
        }


        // Keep temporary password
        // only for sending credential email
        String temporaryPassword =
                request.getPassword();


        User developer =
                new User();


        developer.setFullName(
                request
                        .getFullName()
                        .trim()
        );


        developer.setEmail(
                normalizedEmail
        );


        developer.setPhone(
                request.getPhone() == null

                        ? null

                        : request
                                .getPhone()
                                .trim()
        );


        developer.setCompanyName(
                null
        );


        developer.setPassword(
                passwordEncoder.encode(
                        temporaryPassword
                )
        );


        developer.setRole(
                Role.DEVELOPER
        );


        developer.setActive(
                true
        );


        developer.setMustChangePassword(
                true
        );


        User savedDeveloper =
                userRepository.save(
                        developer
                );


        // ======================================
        // SEND LOGIN CREDENTIALS
        // ======================================

        try {

            notificationEmailService
                    .sendDeveloperCredentials(

                            savedDeveloper
                                    .getFullName(),

                            savedDeveloper
                                    .getEmail(),

                            temporaryPassword
                    );

        } catch (Exception exception) {

            // Developer creation should
            // still succeed if Gmail fails.

            System.err.println(
                    "Developer credentials email failed: "
                            + exception.getMessage()
            );

        }


        return toResponse(
                savedDeveloper
        );
    }


    // ==========================================
    // GET ALL DEVELOPERS
    // ==========================================

    public List<AdminDeveloperResponse>
    getAllDevelopers() {

        return userRepository
                .findByRole(
                        Role.DEVELOPER
                )
                .stream()
                .map(
                        this::toResponse
                )
                .toList();
    }


    // ==========================================
    // RESPONSE
    // ==========================================

    private AdminDeveloperResponse toResponse(
            User developer
    ) {

        return new AdminDeveloperResponse(

                developer.getId(),

                developer.getFullName(),

                developer.getEmail(),

                developer.getPhone(),

                developer
                        .getRole()
                        .name(),

                developer.isActive(),

                developer
                        .isMustChangePassword(),

                developer.getCreatedAt()
        );
    }
}