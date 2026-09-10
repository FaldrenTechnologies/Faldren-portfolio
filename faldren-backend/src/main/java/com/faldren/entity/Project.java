package com.faldren.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Table(name = "projects")
public class Project {

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


    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "source_request_id",
            unique = true
    )
    private ProjectRequest sourceRequest;


    @Column(
            nullable = false,
            length = 180
    )
    private String title;


    @Column(
            name = "service_type",
            nullable = false,
            length = 100
    )
    private String serviceType;


    @Column(
            columnDefinition = "TEXT"
    )
    private String description;


    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 30
    )
    private ProjectStatus status;


    @Column(nullable = false)
    private Integer progress;


    @Column(name = "start_date")
    private LocalDate startDate;


    @Column(name = "due_date")
    private LocalDate dueDate;


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
            status = ProjectStatus.PLANNING;
        }

        if (progress == null) {
            progress = 0;
        }

        if (startDate == null) {
            startDate = LocalDate.now();
        }
    }


    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }


    public Long getId() {
        return id;
    }


    public User getClient() {
        return client;
    }


    public void setClient(User client) {
        this.client = client;
    }


    public ProjectRequest getSourceRequest() {
        return sourceRequest;
    }


    public void setSourceRequest(
            ProjectRequest sourceRequest
    ) {
        this.sourceRequest = sourceRequest;
    }


    public String getTitle() {
        return title;
    }


    public void setTitle(String title) {
        this.title = title;
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


    public ProjectStatus getStatus() {
        return status;
    }


    public void setStatus(
            ProjectStatus status
    ) {
        this.status = status;
    }


    public Integer getProgress() {
        return progress;
    }


    public void setProgress(
            Integer progress
    ) {
        this.progress = progress;
    }


    public LocalDate getStartDate() {
        return startDate;
    }


    public void setStartDate(
            LocalDate startDate
    ) {
        this.startDate = startDate;
    }


    public LocalDate getDueDate() {
        return dueDate;
    }


    public void setDueDate(
            LocalDate dueDate
    ) {
        this.dueDate = dueDate;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}