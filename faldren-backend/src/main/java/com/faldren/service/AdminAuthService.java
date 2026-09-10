package com.faldren.service;

import com.faldren.dto.AdminLoginRequest;
import com.faldren.dto.AdminLoginResponse;

import com.faldren.entity.Role;
import com.faldren.entity.User;

import com.faldren.repository.UserRepository;
import com.faldren.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

@Service
public class AdminAuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;


    public AdminAuthService(
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


    public AdminLoginResponse login(
            AdminLoginRequest request
    ) {

        User user =
                userRepository
                        .findByEmail(
                                request.email()
                                        .trim()
                                        .toLowerCase()
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Invalid email or password"
                                        )
                        );


        if (
                user.getRole()
                        != Role.ADMIN
        ) {

            throw new RuntimeException(
                    "Admin access denied"
            );
        }


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


        String token =
                jwtService
                        .generateToken(user);


        return new AdminLoginResponse(
                token,
                user.getFullName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}