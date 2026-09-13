package com.infosys.realestate.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "due_diligence_reports")
public class DueDiligenceReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(nullable = false)
    private String status;

    private String reportUrl;

    /** Who triggered this report (resolved from SecurityContextHolder) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by")
    private User requestedBy;

    @JsonIgnore
    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ReportHistory> histories = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    /** When the report finished (COMPLETED or FAILED) */
    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    /** Total processing time in milliseconds */
    @Column(name = "duration_ms")
    private Long durationMs;

    /** Error message if status == FAILED */
    @Column(name = "error_message", length = 1000)
    private String errorMessage;

    @Column(name = "risk_score")
    private Integer riskScore;

    @Column(name = "risk_level")
    private String riskLevel;

    @Column(name = "report_snapshot", columnDefinition = "TEXT")
    private String reportSnapshot;

    public DueDiligenceReport() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReportUrl() { return reportUrl; }
    public void setReportUrl(String reportUrl) { this.reportUrl = reportUrl; }

    public User getRequestedBy() { return requestedBy; }
    public void setRequestedBy(User requestedBy) { this.requestedBy = requestedBy; }

    public List<ReportHistory> getHistories() { return histories; }
    public void setHistories(List<ReportHistory> histories) { this.histories = histories; }

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

