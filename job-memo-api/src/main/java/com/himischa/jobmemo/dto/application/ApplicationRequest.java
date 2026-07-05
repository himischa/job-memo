package com.himischa.jobmemo.dto.application;

import com.himischa.jobmemo.model.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class ApplicationRequest {

    @NotBlank(message = "Company is required")
    @Size(max = 150, message = "Company must not exceed 150 characters")
    private String company;

    @NotBlank(message = "Position is required")
    @Size(max = 150, message = "Position must not exceed 150 characters")
    private String position;

    @NotNull(message = "Status is required")
    private ApplicationStatus status;

    private LocalDate appliedAt;

    @Size(max = 100, message = "Source must not exceed 100 characters")
    private String source;

    private String notes;

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public LocalDate getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDate appliedAt) {
        this.appliedAt = appliedAt;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}