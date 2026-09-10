package com.faldren.dto;

public record ClientLoginResponse(

        String token,
        String fullName,
        String email,
        String companyName,
        String role

) {
}