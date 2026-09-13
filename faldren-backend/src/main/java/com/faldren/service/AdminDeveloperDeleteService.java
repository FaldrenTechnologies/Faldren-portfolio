package com.faldren.service;

import com.faldren.entity.Role;
import com.faldren.entity.User;
import com.faldren.repository.UserRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class AdminDeveloperDeleteService {

    private final UserRepository
            userRepository;


    @PersistenceContext
    private EntityManager
            entityManager;


    public AdminDeveloperDeleteService(
            UserRepository userRepository
    ) {

        this.userRepository =
                userRepository;
    }


    // ==========================================
    // DELETE DEVELOPER
    // ==========================================

    @Transactional
    public void deleteDeveloper(
            Long developerId
    ) {

        if (developerId == null) {

            throw new IllegalArgumentException(
                    "Developer id is required."
            );
        }


        User developer =
                userRepository
                        .findById(
                                developerId
                        )
                        .orElseThrow(
                                () ->
                                        new IllegalArgumentException(
                                                "Developer not found."
                                        )
                        );


        if (
                developer.getRole()
                        != Role.DEVELOPER
        ) {

            throw new IllegalArgumentException(
                    "Selected user is not a developer."
            );
        }


        // ======================================
        // DELETE ASSIGNED MODULES / TASKS
        // ======================================

        entityManager
                .createQuery(
                        """
                        DELETE FROM ProjectModule pm
                        WHERE pm.assignedDeveloper = :developer
                        """
                )
                .setParameter(
                        "developer",
                        developer
                )
                .executeUpdate();


        entityManager.flush();


        // ======================================
        // DELETE DEVELOPER ACCOUNT
        // ======================================

        userRepository.delete(
                developer
        );


        userRepository.flush();
    }
}