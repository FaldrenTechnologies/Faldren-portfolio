package com.faldren.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;


public record ProjectResponse(

        Long id,

        Long clientId,

        String clientFullName,

        String clientCompany,

        String title,

        String serviceType,

        String description,

        String status,

        Integer progress,

        LocalDate startDate,

        LocalDate dueDate,

        LocalDateTime createdAt

) {
}