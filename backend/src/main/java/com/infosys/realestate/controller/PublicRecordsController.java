package com.infosys.realestate.controller;

import com.infosys.realestate.dto.PublicRecordsReportResponse;
import com.infosys.realestate.entity.OwnershipRecord;
import com.infosys.realestate.entity.PropertyTaxRecord;
import com.infosys.realestate.entity.PublicRecord;
import com.infosys.realestate.service.PublicRecordsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public-records")
@CrossOrigin(origins = "*")
public class PublicRecordsController {

    private final PublicRecordsService publicRecordsService;

    public PublicRecordsController(PublicRecordsService publicRecordsService) {
        this.publicRecordsService = publicRecordsService;
    }

    /**
     * GET /api/public-records/{propertyId}/ownership
     * Returns the full ownership history for a property.
     */
    @GetMapping("/{propertyId}/ownership")
    public ResponseEntity<List<OwnershipRecord>> getOwnershipHistory(@PathVariable Long propertyId) {
        List<OwnershipRecord> records = publicRecordsService.getOwnershipHistory(propertyId);
        return ResponseEntity.ok(records);
    }

    /**
     * GET /api/public-records/{propertyId}/tax-history
     * Returns the full property tax history for a property.
     */
    @GetMapping("/{propertyId}/tax-history")
    public ResponseEntity<List<PropertyTaxRecord>> getTaxHistory(@PathVariable Long propertyId) {
        List<PropertyTaxRecord> records = publicRecordsService.getTaxHistory(propertyId);
        return ResponseEntity.ok(records);
    }

    /**
     * GET /api/public-records/{propertyId}/records
     * Returns all public records (liens, violations, etc.) for a property.
     */
    @GetMapping("/{propertyId}/records")
    public ResponseEntity<List<PublicRecord>> getPublicRecords(@PathVariable Long propertyId) {
        List<PublicRecord> records = publicRecordsService.getPublicRecords(propertyId);
        return ResponseEntity.ok(records);
    }

    /**
     * GET /api/public-records/{propertyId}/combined-report
     * Returns a combined due diligence report aggregating ownership, tax, and public records.
     */
    @GetMapping("/{propertyId}/combined-report")
    public ResponseEntity<PublicRecordsReportResponse> getCombinedReport(@PathVariable Long propertyId) {
        PublicRecordsReportResponse report = publicRecordsService.getCombinedPublicRecordsReport(propertyId);
        return ResponseEntity.ok(report);
    }
}
