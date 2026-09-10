package com.faldren.dto;

import java.time.LocalDateTime;

public record AdminClientResponse(

        Long id,
        String fullName,
        String companyName,
        String email,
        String phone,
        LocalDateTime createdAt

) {
}