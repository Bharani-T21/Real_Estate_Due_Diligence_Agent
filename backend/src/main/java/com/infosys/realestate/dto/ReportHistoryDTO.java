package com.infosys.realestate.dto;

import java.time.LocalDateTime;

public class ReportHistoryDTO {

    private Long id;
    private Long propertyId;
    private String propertyAddress;
    private String propertyCity;
    private String propertyState;
    private String status;
    private String reportUrl;
    private String requestedByEmail;
    private String requestedByName;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    private Long durationMs;
    private String errorMessage;
    private Integer riskScore;
    private String riskLevel;
    private String reportSnapshot;

    public ReportHistoryDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public String getPropertyAddress() { return propertyAddress; }
    public void setPropertyAddress(String propertyAddress) { this.propertyAddress = propertyAddress; }

    public String getPropertyCity() { return propertyCity; }
    public void setPropertyCity(String propertyCity) { this.propertyCity = propertyCity; }

    public String getPropertyState() { return propertyState; }
    public void setPropertyState(String propertyState) { this.propertyState = propertyState; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReportUrl() { return reportUrl; }
    public void setReportUrl(String reportUrl) { this.reportUrl = reportUrl; }

    public String getRequestedByEmail() { return requestedByEmail; }
    public void setRequestedByEmail(String requestedByEmail) { this.requestedByEmail = requestedByEmail; }

    public String getRequestedByName() { return requestedByName; }
    public void setRequestedByName(String requestedByName) { this.requestedByName = requestedByName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public Long getDurationMs() { return durationMs; }
    public void setDurationMs(Long durationMs) { this.durationMs = durationMs; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public String getReportSnapshot() { return reportSnapshot; }
    public void setReportSnapshot(String reportSnapshot) { this.reportSnapshot = reportSnapshot; }
}
