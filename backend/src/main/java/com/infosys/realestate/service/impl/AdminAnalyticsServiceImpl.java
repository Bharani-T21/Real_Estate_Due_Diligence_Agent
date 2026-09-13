package com.infosys.realestate.service.impl;

import com.infosys.realestate.dto.DashboardAnalyticsDTO;
import com.infosys.realestate.dto.ReportHistoryDTO;
import com.infosys.realestate.entity.DueDiligenceReport;
import com.infosys.realestate.repository.*;
import com.infosys.realestate.service.AdminAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AdminAnalyticsServiceImpl implements AdminAnalyticsService {

    @Autowired private DueDiligenceReportRepository reportRepository;
    @Autowired private PropertyRepository propertyRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private RiskAssessmentRepository riskAssessmentRepository;
    @Autowired private AuditLogRepository auditLogRepository;

    @Override
    public DashboardAnalyticsDTO getDashboard() {
        System.out.println("===== DASHBOARD START =====");
        DashboardAnalyticsDTO dto = new DashboardAnalyticsDTO();

        // --- Totals ---
        System.out.println("1. Counting properties...");
        dto.setTotalProperties(propertyRepository.count());
        System.out.println("2. Counting reports...");
        dto.setTotalReports(reportRepository.count());
        System.out.println("3. Counting users...");

        dto.setTotalUsers(userRepository.count());

        // --- Reports by status ---

        System.out.println("4. Counting report statuses...");
        Map<String, Long> byStatus = new LinkedHashMap<>();
        byStatus.put("COMPLETED", reportRepository.countByStatus("COMPLETED"));
        byStatus.put("IN_PROGRESS", reportRepository.countByStatus("IN_PROGRESS"));
        byStatus.put("FAILED", reportRepository.countByStatus("FAILED"));
        dto.setReportsByStatus(byStatus);

        // --- Recent reports (last 10) ---
        Page<DueDiligenceReport> recentPage =
                reportRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, 10));
        List<ReportHistoryDTO> recentDTOs = recentPage.map(this::toHistoryDTO).getContent();
        dto.setRecentReports(recentDTOs);

        // --- Reports by month ---
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusDays(180);
        List<Object[]> monthlyRows = reportRepository.countReportsByMonth(sixMonthsAgo);
        Map<String, Long> byMonth = new LinkedHashMap<>();
        for (Object[] row : monthlyRows) {
            byMonth.put(String.valueOf(row[0]), ((Number) row[1]).longValue());
        }
        dto.setReportsByMonth(byMonth);

        // --- Risk distribution ---
        List<Object[]> riskRows = riskAssessmentRepository.countByRiskLevel();
        Map<String, Long> riskDist = new LinkedHashMap<>();
        for (Object[] row : riskRows) {
            riskDist.put(String.valueOf(row[0]), ((Number) row[1]).longValue());
        }
        dto.setRiskDistribution(riskDist);

        // --- Average processing time ---
        Double avgMs = reportRepository.averageProcessingTimeMs();
        dto.setAverageProcessingTimeMs(avgMs != null ? avgMs.longValue() : null);

        // --- Top properties by report count ---
        List<Object[]> topRows = reportRepository.topPropertiesByReportCount(PageRequest.of(0, 5));
        List<Map<String, Object>> topList = new ArrayList<>();
        for (Object[] row : topRows) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("propertyId", row[0]);
            entry.put("address", row[1]);
            entry.put("reportCount", ((Number) row[2]).longValue());
            topList.add(entry);
        }
        dto.setTopPropertiesByReportCount(topList);

        // --- Audit outcomes ---
        Map<String, Long> auditOutcomes = new LinkedHashMap<>();
        auditOutcomes.put("SUCCESS", auditLogRepository.countByOutcome("SUCCESS"));
        auditOutcomes.put("FAILURE", auditLogRepository.countByOutcome("FAILURE"));
        dto.setAuditOutcomes(auditOutcomes);

        return dto;
    }

    @Override
    public Page<ReportHistoryDTO> getReports(String status, Pageable pageable) {
        if (status != null && !status.isBlank()) {
            return reportRepository.findByStatusOrderByCreatedAtDesc(status, pageable)
                    .map(this::toHistoryDTO);
        }
        return reportRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::toHistoryDTO);
    }

    // ---- helper ---------------------------------------------------------

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
        return dto;
    }
}
