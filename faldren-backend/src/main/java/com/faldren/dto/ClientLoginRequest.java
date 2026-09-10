package com.faldren.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ClientLoginRequest(

        @NotBlank
        @Email
        String email,

        @NotBlank
        String password

) {
}