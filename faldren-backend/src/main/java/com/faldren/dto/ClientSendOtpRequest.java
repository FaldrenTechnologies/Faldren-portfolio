package com.faldren.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ClientSendOtpRequest(

        @NotBlank
        String fullName,

        @NotBlank
        String companyName,

        @NotBlank
        @Pattern(regexp = "\\d{10}")
        String phone,

        @NotBlank
        @Email
        String email,

        @NotBlank
        @Size(min = 6)
        String password

) {
}