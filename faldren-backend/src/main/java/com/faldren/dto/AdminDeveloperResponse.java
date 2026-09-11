package com.faldren.dto;

import java.time.LocalDateTime;

public class AdminDeveloperResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private boolean active;
    private boolean mustChangePassword;
    private LocalDateTime createdAt;


    public AdminDeveloperResponse() {
    }


    public AdminDeveloperResponse(
            Long id,
            String fullName,
            String email,
            String phone,
            String role,
            boolean active,
            boolean mustChangePassword,
            LocalDateTime createdAt
    ) {

        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.active = active;
        this.mustChangePassword = mustChangePassword;
        this.createdAt = createdAt;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getFullName() {
        return fullName;
    }

    public void setFullName(
            String fullName
    ) {
        this.fullName = fullName;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(
            String email
    ) {
        this.email = email;
    }


    public String getPhone() {
        return phone;
    }

    public void setPhone(
            String phone
    ) {
        this.phone = phone;
    }


    public String getRole() {
        return role;
    }

    public void setRole(
            String role
    ) {
        this.role = role;
    }


    public boolean isActive() {
        return active;
    }

    public void setActive(
            boolean active
    ) {
        this.active = active;
    }


    public boolean isMustChangePassword() {
        return mustChangePassword;
    }

    public void setMustChangePassword(
            boolean mustChangePassword
    ) {
        this.mustChangePassword =
                mustChangePassword;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }
}