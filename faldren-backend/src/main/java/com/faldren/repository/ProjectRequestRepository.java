package com.faldren.repository;

import com.faldren.entity.ProjectRequest;
import com.faldren.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ProjectRequestRepository
        extends JpaRepository<ProjectRequest, Long> {

    List<ProjectRequest>
    findByClientOrderByCreatedAtDesc(
            User client
    );


    List<ProjectRequest>
    findAllByOrderByCreatedAtDesc();
}