package com.infosys.realestate.controller;

import com.infosys.realestate.dto.DashboardAnalyticsDTO;
import com.infosys.realestate.dto.ReportHistoryDTO;
import com.infosys.realestate.service.AdminAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

    @Autowired
    private AdminAnalyticsService adminAnalyticsService;

    /**
     * GET /api/admin/dashboard
     * Full dashboard snapshot: totals, recent reports, risk distribution, monthly trends.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardAnalyticsDTO> getDashboard() {
        return ResponseEntity.ok(adminAnalyticsService.getDashboard());
    }

    /**
     * GET /api/admin/reports?status=COMPLETED&page=0&size=20
     * Paged report management with optional status filter.
     */
    @GetMapping("/reports")
    public ResponseEntity<Page<ReportHistoryDTO>> getReports(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
                adminAnalyticsService.getReports(status, PageRequest.of(page, size)));
    }

    /**
     * GET /api/admin/analytics/export
     * Export system analytics as a CSV file.
     */
    @GetMapping("/analytics/export")
    public ResponseEntity<byte[]> exportAnalyticsCsv() {
        DashboardAnalyticsDTO data = adminAnalyticsService.getDashboard();
        StringBuilder csv = new StringBuilder();
        csv.append("Metric,Value\r\n");
        csv.append("Total Users,").append(data.getTotalUsers()).append("\r\n");
        csv.append("Total Properties,").append(data.getTotalProperties()).append("\r\n");
        csv.append("Total Reports,").append(data.getTotalReports()).append("\r\n");
        if (data.getReportsByStatus() != null) {
            data.getReportsByStatus().forEach((s, c) -> csv.append("Reports - ").append(s).append(",").append(c).append("\r\n"));
        }
        if (data.getRiskDistribution() != null) {
            data.getRiskDistribution().forEach((l, c) -> csv.append("Risk - ").append(l).append(",").append(c).append("\r\n"));
        }
        if (data.getAuditOutcomes() != null) {
            data.getAuditOutcomes().forEach((o, c) -> csv.append("Audit - ").append(o).append(",").append(c).append("\r\n"));
        }
        if (data.getAverageProcessingTimeMs() != null) {
            csv.append("Avg Processing Time (ms),").append(data.getAverageProcessingTimeMs()).append("\r\n");
        }
        csv.append("Export Generated At,").append(java.time.LocalDateTime.now()).append("\r\n");

        byte[] bytes = csv.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header("Content-Type", "text/csv; charset=UTF-8")
                .header("Content-Disposition", "attachment; filename=analytics-export.csv")
                .body(bytes);
    }
}

