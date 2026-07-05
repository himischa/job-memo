package com.himischa.jobmemo.service;

import com.himischa.jobmemo.dto.application.ApplicationRequest;
import com.himischa.jobmemo.dto.application.ApplicationResponse;
import com.himischa.jobmemo.dto.application.ApplicationSummaryResponse;
import com.himischa.jobmemo.exception.ResourceNotFoundException;
import com.himischa.jobmemo.model.ApplicationStatus;
import com.himischa.jobmemo.model.JobApplication;
import com.himischa.jobmemo.model.User;
import com.himischa.jobmemo.repository.ApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    @Transactional
    public ApplicationResponse create(ApplicationRequest request, User user) {
        JobApplication application = new JobApplication();
        application.setUser(user);
        application.setCompany(request.getCompany());
        application.setPosition(request.getPosition());
        application.setStatus(request.getStatus());
        application.setAppliedAt(request.getAppliedAt());
        application.setSource(request.getSource());
        application.setNotes(request.getNotes());

        JobApplication saved = applicationRepository.save(application);
        return toResponse(saved);
    }

    public List<ApplicationResponse> getAllByUser(Long userId) {
        return applicationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ApplicationResponse getByIdAndUser(Long id, Long userId) {
        JobApplication application = applicationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        return toResponse(application);
    }

    @Transactional
    public ApplicationResponse update(Long id, ApplicationRequest request, Long userId) {
        JobApplication application = applicationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        application.setCompany(request.getCompany());
        application.setPosition(request.getPosition());
        application.setStatus(request.getStatus());
        application.setAppliedAt(request.getAppliedAt());
        application.setSource(request.getSource());
        application.setNotes(request.getNotes());

        JobApplication saved = applicationRepository.save(application);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id, Long userId) {
        JobApplication application = applicationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        applicationRepository.delete(application);
    }

    public List<ApplicationResponse> getFiltered(Long userId, ApplicationStatus status,
                                                  String company, LocalDate startDate, LocalDate endDate) {
        if (status != null) {
            return applicationRepository.findByUserIdAndStatus(userId, status)
                    .stream().map(this::toResponse).toList();
        }
        if (company != null && !company.isBlank()) {
            return applicationRepository.findByUserIdAndCompanyContainingIgnoreCase(userId, company)
                    .stream().map(this::toResponse).toList();
        }
        if (startDate != null && endDate != null) {
            return applicationRepository.findByUserIdAndAppliedAtBetween(userId, startDate, endDate)
                    .stream().map(this::toResponse).toList();
        }
        return getAllByUser(userId);
    }

    public ApplicationSummaryResponse getSummary(Long userId) {
        ApplicationSummaryResponse summary = new ApplicationSummaryResponse();
        summary.setApplied(applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.APPLIED));
        summary.setInterview(applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.INTERVIEW));
        summary.setOffer(applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.OFFER));
        summary.setRejected(applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.REJECTED));
        summary.setWithdrawn(applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.WITHDRAWN));
        return summary;
    }

    private ApplicationResponse toResponse(JobApplication app) {
        ApplicationResponse response = new ApplicationResponse();
        response.setId(app.getId());
        response.setCompany(app.getCompany());
        response.setPosition(app.getPosition());
        response.setStatus(app.getStatus());
        response.setAppliedAt(app.getAppliedAt());
        response.setSource(app.getSource());
        response.setNotes(app.getNotes());
        response.setCreatedAt(app.getCreatedAt());
        response.setUpdatedAt(app.getUpdatedAt());
        return response;
    }
}