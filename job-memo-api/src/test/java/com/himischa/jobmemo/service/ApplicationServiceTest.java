package com.himischa.jobmemo.service;

import com.himischa.jobmemo.dto.application.ApplicationRequest;
import com.himischa.jobmemo.dto.application.ApplicationResponse;
import com.himischa.jobmemo.dto.application.ApplicationSummaryResponse;
import com.himischa.jobmemo.exception.ResourceNotFoundException;
import com.himischa.jobmemo.model.ApplicationStatus;
import com.himischa.jobmemo.model.JobApplication;
import com.himischa.jobmemo.model.User;
import com.himischa.jobmemo.repository.ApplicationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @InjectMocks
    private ApplicationService applicationService;

    private User user;
    private JobApplication application;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setName("John Doe");
        user.setEmail("john@example.com");

        application = new JobApplication();
        application.setUser(user);
        application.setCompany("Google");
        application.setPosition("Software Engineer");
        application.setStatus(ApplicationStatus.APPLIED);
        application.setAppliedAt(LocalDate.of(2026, 1, 15));
        application.setSource("LinkedIn");
        application.setNotes("Phone screen scheduled");
    }

    @Test
    void create_Success() {
        ApplicationRequest request = new ApplicationRequest();
        request.setCompany("Google");
        request.setPosition("Software Engineer");
        request.setStatus(ApplicationStatus.APPLIED);
        request.setAppliedAt(LocalDate.of(2026, 1, 15));
        request.setSource("LinkedIn");
        request.setNotes("Phone screen scheduled");

        when(applicationRepository.save(any(JobApplication.class))).thenReturn(application);

        ApplicationResponse response = applicationService.create(request, user);

        assertNotNull(response);
        assertEquals("Google", response.getCompany());
        assertEquals("Software Engineer", response.getPosition());
        assertEquals(ApplicationStatus.APPLIED, response.getStatus());
        assertEquals(LocalDate.of(2026, 1, 15), response.getAppliedAt());
        assertEquals("LinkedIn", response.getSource());
        assertEquals("Phone screen scheduled", response.getNotes());

        verify(applicationRepository).save(any(JobApplication.class));
    }

    @Test
    void getByIdAndUser_Success() {
        when(applicationRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(application));

        ApplicationResponse response = applicationService.getByIdAndUser(1L, 1L);

        assertNotNull(response);
        assertEquals("Google", response.getCompany());

        verify(applicationRepository).findByIdAndUserId(1L, 1L);
    }

    @Test
    void getByIdAndUser_NotFound_ThrowsException() {
        when(applicationRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> applicationService.getByIdAndUser(99L, 1L));

        verify(applicationRepository).findByIdAndUserId(99L, 1L);
    }

    @Test
    void getByIdAndUser_WrongUser_ThrowsException() {
        when(applicationRepository.findByIdAndUserId(1L, 2L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> applicationService.getByIdAndUser(1L, 2L));

        verify(applicationRepository).findByIdAndUserId(1L, 2L);
    }

    @Test
    void update_Success() {
        ApplicationRequest request = new ApplicationRequest();
        request.setCompany("Google");
        request.setPosition("Senior Software Engineer");
        request.setStatus(ApplicationStatus.INTERVIEW);
        request.setAppliedAt(LocalDate.of(2026, 1, 15));
        request.setSource("LinkedIn");
        request.setNotes("Moved to interview stage");

        when(applicationRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(application));
        when(applicationRepository.save(any(JobApplication.class))).thenReturn(application);

        ApplicationResponse response = applicationService.update(1L, request, 1L);

        assertNotNull(response);
        assertEquals("Senior Software Engineer", response.getPosition());
        assertEquals(ApplicationStatus.INTERVIEW, response.getStatus());

        verify(applicationRepository).findByIdAndUserId(1L, 1L);
        verify(applicationRepository).save(any(JobApplication.class));
    }

    @Test
    void delete_Success() {
        when(applicationRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(application));

        applicationService.delete(1L, 1L);

        verify(applicationRepository).findByIdAndUserId(1L, 1L);
        verify(applicationRepository).delete(application);
    }

    @Test
    void getAllByUser_ReturnsOnlyOwnApplications() {
        when(applicationRepository.findByUserIdOrderByCreatedAtDesc(1L)).thenReturn(List.of(application));

        List<ApplicationResponse> responses = applicationService.getAllByUser(1L);

        assertEquals(1, responses.size());
        assertEquals("Google", responses.get(0).getCompany());

        verify(applicationRepository).findByUserIdOrderByCreatedAtDesc(1L);
    }

    @Test
    void getAllByUser_ReturnsEmptyList() {
        when(applicationRepository.findByUserIdOrderByCreatedAtDesc(1L)).thenReturn(List.of());

        List<ApplicationResponse> responses = applicationService.getAllByUser(1L);

        assertTrue(responses.isEmpty());
        verify(applicationRepository).findByUserIdOrderByCreatedAtDesc(1L);
    }

    @Test
    void getSummary_ReturnsCounts() {
        when(applicationRepository.countByUserIdAndStatus(1L, ApplicationStatus.APPLIED)).thenReturn(3L);
        when(applicationRepository.countByUserIdAndStatus(1L, ApplicationStatus.INTERVIEW)).thenReturn(2L);
        when(applicationRepository.countByUserIdAndStatus(1L, ApplicationStatus.OFFER)).thenReturn(1L);
        when(applicationRepository.countByUserIdAndStatus(1L, ApplicationStatus.REJECTED)).thenReturn(4L);
        when(applicationRepository.countByUserIdAndStatus(1L, ApplicationStatus.WITHDRAWN)).thenReturn(0L);

        ApplicationSummaryResponse summary = applicationService.getSummary(1L);

        assertEquals(3L, summary.getApplied());
        assertEquals(2L, summary.getInterview());
        assertEquals(1L, summary.getOffer());
        assertEquals(4L, summary.getRejected());
        assertEquals(0L, summary.getWithdrawn());

        verify(applicationRepository).countByUserIdAndStatus(1L, ApplicationStatus.APPLIED);
        verify(applicationRepository).countByUserIdAndStatus(1L, ApplicationStatus.INTERVIEW);
        verify(applicationRepository).countByUserIdAndStatus(1L, ApplicationStatus.OFFER);
        verify(applicationRepository).countByUserIdAndStatus(1L, ApplicationStatus.REJECTED);
        verify(applicationRepository).countByUserIdAndStatus(1L, ApplicationStatus.WITHDRAWN);
    }
}