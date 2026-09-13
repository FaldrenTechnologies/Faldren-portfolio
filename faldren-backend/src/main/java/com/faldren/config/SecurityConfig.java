package com.faldren.config;

import com.faldren.security.JwtAuthenticationFilter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;


    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }


    // ==========================================
    // PASSWORD ENCODER
    // ==========================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    // ==========================================
    // SECURITY
    // ==========================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // ==================================
                // CSRF
                // ==================================

                .csrf(csrf ->
                        csrf.disable()
                )


                // ==================================
                // CORS
                // ==================================

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )


                // ==================================
                // STATELESS JWT
                // ==================================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                // ==================================
                // ROUTE SECURITY
                // ==================================

                .authorizeHttpRequests(auth -> auth


                        // ==================================
                        // PREFLIGHT
                        // ==================================

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        )
                        .permitAll()


                        // ==================================
                        // PUBLIC ADMIN AUTH
                        // ==================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/admin/auth/login"
                        )
                        .permitAll()


                        // ==================================
                        // PUBLIC CLIENT AUTH
                        // ==================================

                        .requestMatchers(
                                HttpMethod.POST,

                                "/api/client/auth/send-otp",
                                "/api/client/auth/verify-register",
                                "/api/client/auth/verify-otp",
                                "/api/client/auth/register",
                                "/api/client/auth/login"
                        )
                        .permitAll()


                        // ==================================
                        // PUBLIC DEVELOPER AUTH
                        // ==================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/developer/auth/login"
                        )
                        .permitAll()


                        // ==================================
                        // SPRING ERROR HANDLER
                        // ==================================

                        .requestMatchers(
                                "/error"
                        )
                        .permitAll()


                        // ==================================
                        // ADMIN ONLY
                        // ==================================

                        .requestMatchers(
                                "/api/admin/**"
                        )
                        .hasRole("ADMIN")


                        // ==================================
                        // CLIENT ONLY
                        // ==================================

                        .requestMatchers(
                                "/api/client/**"
                        )
                        .hasRole("CLIENT")


                        // ==================================
                        // DEVELOPER ONLY
                        // ==================================

                        .requestMatchers(
                                "/api/developer/**"
                        )
                        .hasRole("DEVELOPER")


                        // ==================================
                        // EVERYTHING ELSE = BLOCK
                        // ==================================

                        .anyRequest()
                        .denyAll()
                )


                // ==================================
                // JWT FILTER
                // ==================================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }


    // ==========================================
    // CORS
    // ==========================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();


        // Local frontend + Production frontend
        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173",
                        frontendUrl
                )
        );


        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );


        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type"
                )
        );


        configuration.setAllowCredentials(false);


        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();


        source.registerCorsConfiguration(
                "/**",
                configuration
        );


        return source;
    }
}