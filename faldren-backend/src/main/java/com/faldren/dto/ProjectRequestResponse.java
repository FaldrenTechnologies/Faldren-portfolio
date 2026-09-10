package com.faldren.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;


public record ProjectRequestResponse(

        Long id,

        Long clientId,

        String clientFullName,

        String clientEmail,

        String clientCompany,

        String clientPhone,

        String projectName,

        String serviceType,

        String description,

        String requirements,

        String businessGoal,

        String budgetRange,

        LocalDate expectedDeadline,

        String referenceLinks,

        String additionalNotes,

        String status,

        LocalDateTime createdAt

) {
}