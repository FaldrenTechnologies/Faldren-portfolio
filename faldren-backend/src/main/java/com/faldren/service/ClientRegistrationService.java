package com.faldren.service;

import com.faldren.dto.ClientSendOtpRequest;
import com.faldren.entity.Role;
import com.faldren.entity.User;
import com.faldren.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


@Service
public class ClientRegistrationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;


    private final SecureRandom secureRandom =
            new SecureRandom();


    private final Map<String, PendingRegistration>
            pendingRegistrations =
            new ConcurrentHashMap<>();


    public ClientRegistrationService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService
    ) {

        this.userRepository =
                userRepository;

        this.passwordEncoder =
                passwordEncoder;

        this.emailService =
                emailService;
    }


    // ==========================================
    // SEND OTP
    // ==========================================

    public void sendOtp(
            ClientSendOtpRequest request
    ) {

        String email =
                request.email()
                        .trim()
                        .toLowerCase();


        // Already registered client check
        if (
                userRepository
                        .existsByEmail(email)
        ) {

            throw new RuntimeException(
                    "An account with this email already exists."
            );
        }


        // Generate 6-digit OTP
        String otp =
                String.format(
                        "%06d",
                        secureRandom.nextInt(
                                1_000_000
                        )
                );


        // Hash password before storing temporarily
        String encodedPassword =
                passwordEncoder.encode(
                        request.password()
                );


        PendingRegistration pending =
                new PendingRegistration(

                        request.fullName()
                                .trim(),

                        request.companyName()
                                .trim(),

                        request.phone()
                                .trim(),

                        email,

                        encodedPassword,

                        otp,

                        LocalDateTime
                                .now()
                                .plusMinutes(5)

                );


        // ======================================
        // SEND OTP TO USER EMAIL
        // ======================================

        try {

            emailService.sendOtp(
                    email,
                    otp
            );

        } catch (Exception exception) {

            throw new RuntimeException(
                    "Unable to send OTP. Please try again."
            );
        }


        // Store only after email sent successfully
        pendingRegistrations.put(
                email,
                pending
        );
    }



    // ==========================================
    // VERIFY OTP + CREATE CLIENT
    // ==========================================

    public User verifyAndRegister(
            String emailValue,
            String otp
    ) {

        String email =
                emailValue
                        .trim()
                        .toLowerCase();


        PendingRegistration pending =
                pendingRegistrations
                        .get(email);


        // No OTP request
        if (pending == null) {

            throw new RuntimeException(
                    "No OTP request found. Please request a new OTP."
            );
        }


        // OTP expired
        if (
                LocalDateTime.now()
                        .isAfter(
                                pending.expiresAt()
                        )
        ) {

            pendingRegistrations.remove(
                    email
            );

            throw new RuntimeException(
                    "OTP has expired. Please request a new OTP."
            );
        }


        // Wrong OTP
        if (
                !pending.otp()
                        .equals(otp)
        ) {

            throw new RuntimeException(
                    "Invalid OTP. Please try again."
            );
        }


        // Account already created check
        if (
                userRepository
                        .existsByEmail(email)
        ) {

            pendingRegistrations.remove(
                    email
            );

            throw new RuntimeException(
                    "An account with this email already exists."
            );
        }


        // ======================================
        // CREATE CLIENT USER
        // ======================================

        User client =
                new User();


        client.setFullName(
                pending.fullName()
        );

        client.setCompanyName(
                pending.companyName()
        );

        client.setPhone(
                pending.phone()
        );

        client.setEmail(
                pending.email()
        );

        client.setPassword(
                pending.encodedPassword()
        );


        // Public registration can ONLY create CLIENT
        client.setRole(
                Role.CLIENT
        );


        User savedClient =
                userRepository.save(
                        client
                );


        // Registration finished
        pendingRegistrations.remove(
                email
        );


        return savedClient;
    }



    // ==========================================
    // TEMPORARY REGISTRATION DATA
    // ==========================================

    private record PendingRegistration(

            String fullName,

            String companyName,

            String phone,

            String email,

            String encodedPassword,

            String otp,

            LocalDateTime expiresAt

    ) {
    }
}