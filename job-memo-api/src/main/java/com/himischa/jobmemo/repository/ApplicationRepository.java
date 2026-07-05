package com.himischa.jobmemo.repository;

import com.himischa.jobmemo.model.ApplicationStatus;
import com.himischa.jobmemo.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<JobApplication> findByIdAndUserId(Long id, Long userId);

    List<JobApplication> findByUserIdAndStatus(Long userId, ApplicationStatus status);

    List<JobApplication> findByUserIdAndCompanyContainingIgnoreCase(Long userId, String company);

    List<JobApplication> findByUserIdAndAppliedAtBetween(Long userId, LocalDate start, LocalDate end);

    long countByUserIdAndStatus(Long userId, ApplicationStatus status);
}