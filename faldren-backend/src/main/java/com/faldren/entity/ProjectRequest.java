package com.faldren.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Table(name = "project_requests")
public class ProjectRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "client_id",
            nullable = false
    )
    private User client;


    @Column(
            name = "project_name",
            nullable = false,
            length = 180
    )
    private String projectName;


    @Column(
            name = "service_type",
            nullable = false,
            length = 100
    )
    private String serviceType;


    @Column(
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String description;


    @Column(
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String requirements;


    @Column(
            name = "business_goal",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String businessGoal;


    @Column(
            name = "budget_range",
            nullable = false,
            length = 100
    )
    private String budgetRange;


    @Column(
            name = "expected_deadline",
            nullable = false
    )
    private LocalDate expectedDeadline;


    @Column(
            name = "reference_links",
            columnDefinition = "TEXT"
    )
    private String referenceLinks;


    @Column(
            name = "additional_notes",
            columnDefinition = "TEXT"
    )
    private String additionalNotes;


    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 30
    )
    private ProjectRequestStatus status;


    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;


    @Column(
            name = "updated_at",
            nullable = false
    )
    private LocalDateTime updatedAt;



    @PrePersist
    public void onCreate() {

        LocalDateTime now =
                LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (status == null) {
            status =
                    ProjectRequestStatus.PENDING;
        }
    }


    @PreUpdate
    public void onUpdate() {

        updatedAt =
                LocalDateTime.now();
    }


    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public User getClient() {
        return client;
    }


    public void setClient(User client) {
        this.client = client;
    }


    public String getProjectName() {
        return projectName;
    }


    public void setProjectName(
            String projectName
    ) {
        this.projectName = projectName;
    }


    public String getServiceType() {
        return serviceType;
    }


    public void setServiceType(
            String serviceType
    ) {
        this.serviceType = serviceType;
    }


    public String getDescription() {
        return description;
    }


    public void setDescription(
            String description
    ) {
        this.description = description;
    }


    public String getRequirements() {
        return requirements;
    }


    public void setRequirements(
            String requirements
    ) {
        this.requirements = requirements;
    }


    public String getBusinessGoal() {
        return businessGoal;
    }


    public void setBusinessGoal(
            String businessGoal
    ) {
        this.businessGoal = businessGoal;
    }


    public String getBudgetRange() {
        return budgetRange;
    }


    public void setBudgetRange(
            String budgetRange
    ) {
        this.budgetRange = budgetRange;
    }


    public LocalDate getExpectedDeadline() {
        return expectedDeadline;
    }


    public void setExpectedDeadline(
            LocalDate expectedDeadline
    ) {
        this.expectedDeadline =
                expectedDeadline;
    }


    public String getReferenceLinks() {
        return referenceLinks;
    }


    public void setReferenceLinks(
            String referenceLinks
    ) {
        this.referenceLinks =
                referenceLinks;
    }


    public String getAdditionalNotes() {
        return additionalNotes;
    }


    public void setAdditionalNotes(
            String additionalNotes
    ) {
        this.additionalNotes =
                additionalNotes;
    }


    public ProjectRequestStatus getStatus() {
        return status;
    }


    public void setStatus(
            ProjectRequestStatus status
    ) {
        this.status = status;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}