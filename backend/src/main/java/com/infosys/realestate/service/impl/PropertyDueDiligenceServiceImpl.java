package com.infosys.realestate.service.impl;

import com.infosys.realestate.dto.PublicRecordsReportResponse;
import com.infosys.realestate.dto.ReportHistoryDTO;
import com.infosys.realestate.entity.DueDiligenceReport;
import com.infosys.realestate.entity.Property;
import com.infosys.realestate.entity.ReportHistory;
import com.infosys.realestate.entity.RiskAssessment;
import com.infosys.realestate.entity.User;
import com.infosys.realestate.exception.ResourceNotFoundException;
import com.infosys.realestate.repository.DueDiligenceReportRepository;
import com.infosys.realestate.repository.PropertyRepository;
import com.infosys.realestate.repository.ReportHistoryRepository;
import com.infosys.realestate.repository.UserRepository;
import com.infosys.realestate.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PropertyDueDiligenceServiceImpl implements PropertyDueDiligenceService {

    @Autowired private PropertyRepository propertyRepository;
    @Autowired private AddressValidationService addressValidationService;
    @Autowired private PublicDataAggregationService publicDataAggregationService;
    @Autowired private RiskAssessmentService riskAssessmentService;
    @Autowired private ReportGenerationService reportGenerationService;
    @Autowired private NotificationService notificationService;
    @Autowired private DueDiligenceReportRepository reportRepository;
    @Autowired private ReportHistoryRepository reportHistoryRepository;
    @Autowired private AuditLogService auditLogService;
    @Autowired private PublicRecordsService publicRecordsService;
    @Autowired private UserRepository userRepository;

    @Override
    @Transactional
    public DueDiligenceReport processDueDiligence(Long propertyId) {
        long startMs = System.currentTimeMillis();

        // 1. Fetch property
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        // 2. Address Validation
        addressValidationService.validateAddress(property);

        // Resolve the calling user from the security context
        User requestedBy = resolveCurrentUser();

        // Create initial report entity
        DueDiligenceReport report = new DueDiligenceReport();
        report.setProperty(property);
        report.setStatus("IN_PROGRESS");
        report.setRequestedBy(requestedBy);
        report = reportRepository.save(report);

        try {
            // 3. Public Data Collection
            String publicData = publicDataAggregationService.collectPublicData(property);

            // 4. Risk Assessment
            RiskAssessment riskAssessment = riskAssessmentService.assessRisk(property, publicData);

            // 5. Generate Report
            String reportUrl = reportGenerationService.generateReport(report, riskAssessment, publicData);

            // Update report with completion info
            report.setStatus("COMPLETED");
            report.setReportUrl(reportUrl);
            report.setCompletedAt(LocalDateTime.now());
            report.setDurationMs(System.currentTimeMillis() - startMs);

            // Save snapshot info
            report.setRiskScore(riskAssessment.getRiskScore());
            report.setRiskLevel(riskAssessment.getRiskLevel());

            // Simple snapshot JSON
            String snapshotJson = "{"
                    + "\"propertyId\": " + propertyId + ","
                    + "\"address\": \"" + escapeJson(property.getAddress()) + "\","
                    + "\"city\": \"" + escapeJson(property.getCity()) + "\","
                    + "\"state\": \"" + escapeJson(property.getState()) + "\","
                    + "\"riskScore\": " + riskAssessment.getRiskScore() + ","
                    + "\"riskLevel\": \"" + escapeJson(riskAssessment.getRiskLevel()) + "\","
                    + "\"recommendation\": \"" + escapeJson(riskAssessment.getMitigationRecommendations()) + "\","
                    + "\"comments\": \"" + escapeJson(riskAssessment.getComments()) + "\""
                    + "}";
            report.setReportSnapshot(snapshotJson);

            report = reportRepository.save(report);

            // Save report history entry
            saveReportHistory(report, property, requestedBy, "ONLINE", "COMPLETED", reportUrl, "Due diligence report completed successfully");

            // 6. Notify
            notificationService.sendReportNotification(report);

            // Audit log
            String actorEmail = requestedBy != null ? requestedBy.getEmail() : "system";
            String actorRole = requestedBy != null && requestedBy.getRole() != null ? requestedBy.getRole().getName() : "USER";
            auditLogService.log(actorEmail, actorRole, "PROCESS_DUE_DILIGENCE", "DueDiligenceReport",
                    String.valueOf(report.getId()), "Processed due diligence for property ID " + propertyId, null, "SUCCESS");

        } catch (Exception e) {
            report.setStatus("FAILED");
            report.setCompletedAt(LocalDateTime.now());
            report.setDurationMs(System.currentTimeMillis() - startMs);
            report.setErrorMessage(e.getMessage());
            report = reportRepository.save(report);

            saveReportHistory(report, property, requestedBy, "ONLINE", "FAILED", null, e.getMessage());

            notificationService.sendReportNotification(report);

            String actorEmail = requestedBy != null ? requestedBy.getEmail() : "system";
            String actorRole = requestedBy != null && requestedBy.getRole() != null ? requestedBy.getRole().getName() : "USER";
            auditLogService.log(actorEmail, actorRole, "PROCESS_DUE_DILIGENCE", "DueDiligenceReport",
                    String.valueOf(report.getId()), "Failed processing due diligence for property ID " + propertyId + ": " + e.getMessage(), null, "FAILURE");

            throw new RuntimeException("Due diligence process failed: " + e.getMessage());
        }

        return report;
    }

    @Override
    @Transactional
    public byte[] exportReportPdf(Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        User requestedBy = resolveCurrentUser();
        PublicRecordsReportResponse data = publicRecordsService.getCombinedPublicRecordsReport(propertyId);
        byte[] pdfBytes = reportGenerationService.generatePdfReport(data);

        String fileUrl = "/api/due-diligence/" + propertyId + "/export/pdf";
        saveReportHistory(null, property, requestedBy, "PDF", "COMPLETED", fileUrl, "Exported PDF report for property ID " + propertyId);

        String actorEmail = requestedBy != null ? requestedBy.getEmail() : "system";
        String actorRole = requestedBy != null && requestedBy.getRole() != null ? requestedBy.getRole().getName() : "USER";
        auditLogService.log(actorEmail, actorRole, "EXPORT_PDF", "Property",
                String.valueOf(propertyId), "Exported PDF report for property ID " + propertyId, null, "SUCCESS");

        return pdfBytes;
    }

    @Override
    @Transactional
    public byte[] exportReportExcel(Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        User requestedBy = resolveCurrentUser();
        PublicRecordsReportResponse data = publicRecordsService.getCombinedPublicRecordsReport(propertyId);
        byte[] excelBytes = reportGenerationService.generateExcelReport(data);

        String fileUrl = "/api/due-diligence/" + propertyId + "/export/excel";
        saveReportHistory(null, property, requestedBy, "EXCEL", "COMPLETED", fileUrl, "Exported Excel report for property ID " + propertyId);

        String actorEmail = requestedBy != null ? requestedBy.getEmail() : "system";
        String actorRole = requestedBy != null && requestedBy.getRole() != null ? requestedBy.getRole().getName() : "USER";
        auditLogService.log(actorEmail, actorRole, "EXPORT_EXCEL", "Property",
                String.valueOf(propertyId), "Exported Excel report for property ID " + propertyId, null, "SUCCESS");

        return excelBytes;
    }

    @Override
    public Page<ReportHistoryDTO> getAllReportHistory(Pageable pageable) {
        return reportRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::toHistoryDTO);
    }

    @Override
    public Page<ReportHistoryDTO> getMyReportHistory(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));
        return reportRepository
                .findByRequestedByUserIdOrderByCreatedAtDesc(user.getUserId(), pageable)
                .map(this::toHistoryDTO);
    }

    @Override
    public ReportHistoryDTO getReportById(Long reportId) {
        DueDiligenceReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));
        return toHistoryDTO(report);
    }

    // ---- helpers --------------------------------------------------------

    private void saveReportHistory(DueDiligenceReport report, Property property, User user,
                                   String exportFormat, String status, String fileUrl, String summary) {
        try {
            ReportHistory history = new ReportHistory();
            history.setReport(report);
            history.setProperty(property);
            history.setUser(user);
            history.setExportFormat(exportFormat);
            history.setStatus(status);
            history.setFileUrl(fileUrl);
            history.setSummary(summary);
            history.setGeneratedAt(LocalDateTime.now());
            reportHistoryRepository.save(history);
        } catch (Exception e) {
            // Log warning but don't break main report workflow
            System.err.println("Failed to save report history: " + e.getMessage());
        }
    }

    private User resolveCurrentUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) return null;
            String email = auth.getName();
            return userRepository.findByEmail(email).orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    private ReportHistoryDTO toHistoryDTO(DueDiligenceReport r) {
        ReportHistoryDTO dto = new ReportHistoryDTO();
        dto.setId(r.getId());
        dto.setStatus(r.getStatus());
        dto.setReportUrl(r.getReportUrl());
        dto.setCreatedAt(r.getCreatedAt());
        dto.setCompletedAt(r.getCompletedAt());
        dto.setDurationMs(r.getDurationMs());
        dto.setErrorMessage(r.getErrorMessage());

        if (r.getProperty() != null) {
            dto.setPropertyId(r.getProperty().getPropertyId());
            dto.setPropertyAddress(r.getProperty().getAddress());
            dto.setPropertyCity(r.getProperty().getCity());
            dto.setPropertyState(r.getProperty().getState());
        }
        if (r.getRequestedBy() != null) {
            dto.setRequestedByEmail(r.getRequestedBy().getEmail());
            dto.setRequestedByName(r.getRequestedBy().getName());
        }

        dto.setRiskScore(r.getRiskScore());
        dto.setRiskLevel(r.getRiskLevel());
        dto.setReportSnapshot(r.getReportSnapshot());

        return dto;
    }

    private String escapeJson(String input) {
        if (input == null) return "";
        return input.replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }

    private String convertFlagsToJson(java.util.List<String> flags) {
        if (flags == null || flags.isEmpty()) return "[]";
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < flags.size(); i++) {
            sb.append("\"").append(escapeJson(flags.get(i))).append("\"");
            if (i < flags.size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }
}

