package com.faldren.service;

import com.faldren.dto.ClientLoginRequest;
import com.faldren.dto.ClientLoginResponse;
import com.faldren.entity.Role;
import com.faldren.entity.User;
import com.faldren.repository.UserRepository;
import com.faldren.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ClientAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    public ClientAuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }


    public ClientLoginResponse login(
            ClientLoginRequest request
    ) {

        String email =
                request.email()
                        .trim()
                        .toLowerCase();


        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid email or password."
                                )
                        );


        if (user.getRole() != Role.CLIENT) {

            throw new RuntimeException(
                    "Client access denied."
            );
        }


        if (
                !passwordEncoder.matches(
                        request.password(),
                        user.getPassword()
                )
        ) {

            throw new RuntimeException(
                    "Invalid email or password."
            );
        }


        String token =
                jwtService.generateToken(
                        user
                );


        return new ClientLoginResponse(

                token,

                user.getFullName(),

                user.getEmail(),

                user.getCompanyName(),

                user.getRole().name()

        );
    }
}