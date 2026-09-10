package com.faldren.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;


public record CreateProjectRequestRequest(

        @NotBlank
        @Size(max = 180)
        String projectName,

        @NotBlank
        @Size(max = 100)
        String serviceType,

        @NotBlank
        @Size(max = 5000)
        String description,

        @NotBlank
        @Size(max = 5000)
        String requirements,

        @NotBlank
        @Size(max = 3000)
        String businessGoal,

        @NotBlank
        @Size(max = 100)
        String budgetRange,

        @NotNull
        @FutureOrPresent
        LocalDate expectedDeadline,

        @Size(max = 3000)
        String referenceLinks,

        @Size(max = 3000)
        String additionalNotes

) {
}