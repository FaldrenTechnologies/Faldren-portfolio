package com.faldren.config;

import com.faldren.entity.Role;
import com.faldren.entity.User;

import com.faldren.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.boot.CommandLineRunner;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Component;

@Component
public class AdminInitializer
        implements CommandLineRunner {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;


    @Value("${app.admin.name}")
    private String adminName;


    @Value("${app.admin.email}")
    private String adminEmail;


    @Value("${app.admin.password}")
    private String adminPassword;


    public AdminInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {

        this.userRepository =
                userRepository;

        this.passwordEncoder =
                passwordEncoder;
    }


    @Override
    public void run(
            String... args
    ) {

        String normalizedEmail =
                adminEmail
                        .trim()
                        .toLowerCase();


        if (
                userRepository
                        .existsByEmail(
                                normalizedEmail
                        )
        ) {

            System.out.println(
                    "FALDREN admin already exists."
            );

            return;
        }


        User admin =
                new User();


        admin.setFullName(
                adminName
        );

        admin.setEmail(
                normalizedEmail
        );

        admin.setPassword(
                passwordEncoder
                        .encode(
                                adminPassword
                        )
        );

        admin.setRole(
                Role.ADMIN
        );


        userRepository.save(
                admin
        );


        System.out.println(
                "FALDREN admin account created."
        );
    }
}