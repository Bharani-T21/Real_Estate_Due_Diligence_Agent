package com.infosys.realestate.controller;

import com.infosys.realestate.dto.ReportHistoryDTO;
import com.infosys.realestate.service.ReportHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/report-history")
@CrossOrigin(origins = "http://localhost:3001")
public class ReportHistoryController {

    private final ReportHistoryService reportHistoryService;

    public ReportHistoryController(
            ReportHistoryService reportHistoryService) {
        this.reportHistoryService = reportHistoryService;
    }

    @GetMapping
    public ResponseEntity<List<ReportHistoryDTO>> getAllReportHistory() {
        return ResponseEntity.ok(
                reportHistoryService.getAllReportHistory()
        );
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<ReportHistoryDTO>> getByProperty(
            @PathVariable Long propertyId) {

        return ResponseEntity.ok(
                reportHistoryService
                        .getReportHistoryByProperty(propertyId)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportHistoryDTO> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                reportHistoryService
                        .getReportHistoryById(id)
        );
    }
}