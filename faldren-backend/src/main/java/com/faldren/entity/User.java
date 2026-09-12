package com.faldren.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(
            name = "full_name",
            nullable = false
    )
    private String fullName;


    @Column(
            nullable = false,
            unique = true
    )
    private String email;


    private String phone;


    @Column(name = "company_name")
    private String companyName;


    @Column(nullable = false)
    private String password;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;


    // ==========================================
    // ACCOUNT STATUS
    // ==========================================

    @Column(
            nullable = false,
            columnDefinition = "boolean default true"
    )
    private boolean active = true;


    // ==========================================
    // FIRST LOGIN PASSWORD CHANGE
    // ==========================================

    @Column(
            name = "must_change_password",
            nullable = false,
            columnDefinition = "boolean default false"
    )
    private boolean mustChangePassword = false;


    @Column(
            name = "created_at",
            nullable = false
    )
    private LocalDateTime createdAt;


@OneToMany(
        mappedBy = "client"
)
private List<Conversation> conversations =
        new ArrayList<>();

    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public User() {
    }



    // ==========================================
    // PRE PERSIST
    // ==========================================

    @PrePersist
    public void onCreate() {

        if (createdAt == null) {
            createdAt =
                    LocalDateTime.now();
        }

        if (role == null) {
            role =
                    Role.CLIENT;
        }
    }



    // ==========================================
    // GETTERS / SETTERS
    // ==========================================

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
        this.fullName =
                fullName;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(
            String email
    ) {
        this.email =
                email;
    }


    public String getPhone() {
        return phone;
    }

    public void setPhone(
            String phone
    ) {
        this.phone =
                phone;
    }


    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(
            String companyName
    ) {
        this.companyName =
                companyName;
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(
            String password
    ) {
        this.password =
                password;
    }


    public Role getRole() {
        return role;
    }

    public void setRole(
            Role role
    ) {
        this.role =
                role;
    }


    public boolean isActive() {
        return active;
    }

    public void setActive(
            boolean active
    ) {
        this.active =
                active;
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
        this.createdAt =
                createdAt;
    }
 

public List<Conversation> getConversations() {
    return conversations;
}

public void setConversations(
        List<Conversation> conversations
) {
    this.conversations = conversations;
}

}