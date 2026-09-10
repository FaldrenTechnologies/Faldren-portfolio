package com.faldren.dto;

public record AdminLoginResponse(

        String token,
        String fullName,
        String email,
        String role

) {
}