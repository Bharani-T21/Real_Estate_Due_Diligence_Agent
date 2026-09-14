package com.infosys.realestate.controller;

import com.infosys.realestate.dto.ReportHistoryDTO;
import com.infosys.realestate.entity.DueDiligenceReport;
import com.infosys.realestate.service.PropertyDueDiligenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/due-diligence")
@CrossOrigin(origins = "*")
public class DueDiligenceController {

    @Autowired
    private PropertyDueDiligenceService dueDiligenceService;

    // -----------------------------------------------------------------------
    // Core processing
    // -----------------------------------------------------------------------

    @PostMapping("/{propertyId}/process")
    public DueDiligenceReport processDueDiligence(@PathVariable Long propertyId) {
        return dueDiligenceService.processDueDiligence(propertyId);
    }

    // -----------------------------------------------------------------------
    // Export
    // -----------------------------------------------------------------------

    @GetMapping("/{propertyId}/export/pdf")
    public ResponseEntity<byte[]> exportPdf(@PathVariable Long propertyId) {
        byte[] pdfBytes = dueDiligenceService.exportReportPdf(propertyId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("DueDiligenceReport_" + propertyId + ".pdf").build());
        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @GetMapping("/{propertyId}/export/excel")
    public ResponseEntity<byte[]> exportExcel(@PathVariable Long propertyId) {
        byte[] excelBytes = dueDiligenceService.exportReportExcel(propertyId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("DueDiligenceReport_" + propertyId + ".xlsx").build());
        return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);
    }

    // -----------------------------------------------------------------------
    // Report History
    // -----------------------------------------------------------------------

    /** GET /api/due-diligence/reports — list of all reports */
    @GetMapping("/reports")
    public ResponseEntity<?> getAllReports(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "100") int size) {
        return ResponseEntity.ok(
                dueDiligenceService.getAllReportHistory(PageRequest.of(page, size)).getContent());
    }

    /** GET /api/due-diligence/history?page=0&size=20 — Admin/System: all reports */
    @GetMapping("/history")
    public ResponseEntity<Page<ReportHistoryDTO>> getAllHistory(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
                dueDiligenceService.getAllReportHistory(PageRequest.of(page, size)));
    }

    /** GET /api/due-diligence/my-history?page=0&size=20 — current user's own reports */
    @GetMapping("/my-history")
    public ResponseEntity<Page<ReportHistoryDTO>> getMyHistory(
            Principal principal,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        String email = (principal != null) ? principal.getName() : "admin@example.com";
        return ResponseEntity.ok(
                dueDiligenceService.getMyReportHistory(email, PageRequest.of(page, size)));
    }

    /** GET /api/due-diligence/reports/{id} — single report detail */
    @GetMapping("/reports/{id}")
    public ResponseEntity<ReportHistoryDTO> getReportById(@PathVariable Long id) {
        return ResponseEntity.ok(dueDiligenceService.getReportById(id));
    }
}
