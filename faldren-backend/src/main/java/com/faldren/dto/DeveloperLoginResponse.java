package com.faldren.dto;

public record DeveloperLoginResponse(

        String token,
        String fullName,
        String email,
        String role,
        boolean mustChangePassword

) {
}