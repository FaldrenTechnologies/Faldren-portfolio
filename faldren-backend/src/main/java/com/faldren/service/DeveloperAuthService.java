package com.faldren.service;

import com.faldren.dto.DeveloperLoginRequest;
import com.faldren.dto.DeveloperLoginResponse;

import com.faldren.entity.Role;
import com.faldren.entity.User;

import com.faldren.repository.UserRepository;
import com.faldren.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.faldren.dto.DeveloperChangePasswordRequest;

@Service
public class DeveloperAuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;


    public DeveloperAuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {

        this.userRepository =
                userRepository;

        this.passwordEncoder =
                passwordEncoder;

        this.jwtService =
                jwtService;
    }


    // ==========================================
    // DEVELOPER LOGIN
    // ==========================================

    public DeveloperLoginResponse login(
            DeveloperLoginRequest request
    ) {

        String normalizedEmail =
                request
                        .email()
                        .trim()
                        .toLowerCase();


        User user =
                userRepository
                        .findByEmail(
                                normalizedEmail
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Invalid email or password"
                                        )
                        );


        // ======================================
        // ROLE CHECK
        // ======================================

        if (
                user.getRole()
                        != Role.DEVELOPER
        ) {

            throw new RuntimeException(
                    "Developer access denied"
            );
        }


        // ======================================
        // ACCOUNT STATUS
        // ======================================

        if (!user.isActive()) {

            throw new RuntimeException(
                    "Developer account is disabled"
            );
        }


        // ======================================
        // PASSWORD CHECK
        // ======================================

        if (
                !passwordEncoder.matches(
                        request.password(),
                        user.getPassword()
                )
        ) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }


        // ======================================
        // JWT
        // ======================================

        String token =
                jwtService
                        .generateToken(user);


        return new DeveloperLoginResponse(

                token,

                user.getFullName(),

                user.getEmail(),

                user
                        .getRole()
                        .name(),

                user.isMustChangePassword()
        );
    }

    public void changePassword(
        String email,
        DeveloperChangePasswordRequest request
) {

    User user =
            userRepository
                    .findByEmail(
                            email
                                    .trim()
                                    .toLowerCase()
                    )
                    .orElseThrow(
                            () ->
                                    new RuntimeException(
                                            "Developer account not found"
                                    )
                    );


    if (
            user.getRole()
                    != Role.DEVELOPER
    ) {

        throw new RuntimeException(
                "Developer access denied"
        );
    }


    if (!user.isActive()) {

        throw new RuntimeException(
                "Developer account is disabled"
        );
    }


    if (
            !passwordEncoder.matches(
                    request.currentPassword(),
                    user.getPassword()
            )
    ) {

        throw new RuntimeException(
                "Current password is incorrect"
        );
    }


    if (
            !request.newPassword()
                    .equals(
                            request.confirmPassword()
                    )
    ) {

        throw new RuntimeException(
                "New passwords do not match"
        );
    }


    if (
            request.newPassword()
                    .length() < 8
    ) {

        throw new RuntimeException(
                "New password must contain at least 8 characters"
        );
    }


    if (
            passwordEncoder.matches(
                    request.newPassword(),
                    user.getPassword()
            )
    ) {

        throw new RuntimeException(
                "New password must be different from current password"
        );
    }


    user.setPassword(
            passwordEncoder.encode(
                    request.newPassword()
            )
    );


    user.setMustChangePassword(
            false
    );


    userRepository.save(
            user
    );
}
}